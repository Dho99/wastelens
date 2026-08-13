import { NextRequest, NextResponse } from "next/server";
import { getRequestDinas } from "@/lib/dinas-auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { LOAD_ESTIMATES_KG } from "@/lib/services/assignment";
import type { ConfirmRequest } from "@/app/dinas/types/auto-collective";
import { createHash } from "node:crypto";
import { persistNotification, firePendingEvents } from "@/server/websocket/notify.service";
import { createReportAssignedEvent } from "@/server/websocket/websocket.events";
import type { PusherEvent } from "@/server/websocket/websocket.types";
import { computeRouteDetails } from "@/server/modules/dispatch/auto-collective.service";
import { createDispatchRouteForAssignment } from "@/server/modules/dispatch/route-append.service";
import type { AutoCollectiveStop } from "@/app/dinas/types/auto-collective";

export const dynamic = "force-dynamic";

class ConfirmError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number = 409,
  ) {
    super(message);
    this.name = "ConfirmError";
  }
}

function hashBody(body: ConfirmRequest): string {
  const canonical = JSON.stringify({
    idempotencyKey: body.idempotencyKey,
    routes: body.routes.map((route) => ({
      temporaryRouteId: route.temporaryRouteId,
      petugasId: route.petugasId,
      kendaraanId: route.kendaraanId,
      stopIds: route.stopIds,
      routeOrder: route.routeOrder,
    })),
  });
  return createHash("sha256").update(canonical).digest("hex");
}

function isTransactionTimeout(error: unknown): boolean {
  return (
    (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2028")
    || (error instanceof Error && error.message.includes("expired transaction"))
  );
}

export async function POST(request: NextRequest) {
  try {
    const dinas = await getRequestDinas(request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const body = (await request.json()) as ConfirmRequest;

    if (!body.idempotencyKey || !body.routes || body.routes.length === 0) {
      return NextResponse.json(
        { error: "idempotencyKey and routes are required", code: "VALIDATION" },
        { status: 400 },
      );
    }

    const requestHash = hashBody(body);

    const existing = await prisma.autoCollectiveRequest.findUnique({
      where: {
        dinas_id_idempotency_key: {
          dinas_id: dinas.id,
          idempotency_key: body.idempotencyKey,
        },
      },
      select: { request_hash: true, response_data: true },
    });

    if (existing) {
      if (existing.request_hash === requestHash) {
        return NextResponse.json(existing.response_data ?? { success: true, data: { assignedRoutes: [] } });
      }
      return NextResponse.json(
        { error: "Idempotency key already used with different request body", code: "IDEMPOTENCY_KEY_REUSED" },
        { status: 409 },
      );
    }

    const allStopIds = body.routes.flatMap((r) => r.stopIds);

    if (allStopIds.length !== new Set(allStopIds).size) {
      return NextResponse.json(
        { error: "Terdapat stopId duplikat antar rute", code: "DEDUP" },
        { status: 400 },
      );
    }

    const reports = await prisma.laporan.findMany({
      where: { id: { in: allStopIds } },
    });

    if (reports.length !== allStopIds.length) {
      const foundIds = new Set(reports.map((r) => r.id));
      const missing = allStopIds.filter((id) => !foundIds.has(id));
      return NextResponse.json(
        { error: `Laporan tidak ditemukan: ${missing.join(", ")}`, code: "REPORT_NOT_FOUND" },
        { status: 404 },
      );
    }

    for (const r of reports) {
      const rf = r as unknown as { id: string; dinas_id: string; petugas_id: string | null; kendaraan_id: string | null; status: string };
      if (rf.dinas_id !== dinas.id) {
        return NextResponse.json({ error: `Laporan ${rf.id} bukan milik Dinas ini`, code: "REPORT_NOT_OWNED" }, { status: 403 });
      }
      if (rf.petugas_id || rf.kendaraan_id) {
        return NextResponse.json({ error: `Laporan ${rf.id} sudah di-assign`, code: "REPORT_ALREADY_ASSIGNED" }, { status: 409 });
      }
      if (rf.status !== "ANALYZED" && rf.status !== "WAITING") {
        return NextResponse.json({ error: `Laporan ${rf.id} status tidak eligible`, code: "REPORT_STATUS_INVALID" }, { status: 409 });
      }
    }

    for (const route of body.routes) {
      const officer = await prisma.petugas.findFirst({
        where: { id: route.petugasId, dinas_id: dinas.id },
        select: { id: true },
      });
      if (!officer) {
        return NextResponse.json({ error: `Petugas ${route.petugasId} tidak ditemukan`, code: "OFFICER_UNAVAILABLE" }, { status: 404 });
      }
    }

    const allVehicleIds = body.routes.map((r) => r.kendaraanId);
    const uniqueVehicleIds = [...new Set(allVehicleIds)].sort();
    const uniqueOfficerIds = [...new Set(body.routes.map((r) => r.petugasId))].sort();
    const reportMap = new Map(reports.map((report) => [report.id, report]));

    // Routing may call the external OSRM service and must never run while database
    // rows are locked inside the interactive transaction.
    const preparedRouteDetails = await Promise.all(
      body.routes.map(async (route) => {
        const stops = route.stopIds.flatMap((stopId): AutoCollectiveStop[] => {
          const report = reportMap.get(stopId);
          if (!report) return [];
          const effectiveSize = (report.corrected_kategori_ukuran ?? report.kategori_ukuran).toUpperCase();
          return [{
            reportId: report.id,
            lat: report.lokasi_lat,
            lng: report.lokasi_lng,
            address: report.address_text,
            priorityLevel: report.priority_level,
            priorityScore: report.priority_score,
            estimatedLoadKg: LOAD_ESTIMATES_KG[effectiveSize] ?? LOAD_ESTIMATES_KG.UNCERTAIN,
            sizeCategory: report.kategori_ukuran,
            drainageRisk: report.drainage_risk,
            accessObstructionRisk: report.access_obstruction_risk,
            wasteTypes: report.waste_types,
          }];
        });
        return computeRouteDetails(stops);
      }),
    );

    try {
      const result = await prisma.$transaction(async (tx) => {
        const lockedVehicles: Array<{ id: string; current_load: number; kapasitas: number }> = [];

        for (const vehicleId of uniqueVehicleIds) {
          const rows = await tx.$queryRawUnsafe<Array<{ id: string; current_load: number; kapasitas: number }>>(
            `SELECT id, current_load, kapasitas FROM "KENDARAAN" WHERE id = $1::uuid AND dinas_id = $2::uuid FOR UPDATE`,
            vehicleId,
            dinas.id,
          );
          if (rows.length === 0) {
            throw new ConfirmError(`Kendaraan ${vehicleId} tidak ditemukan`, "VEHICLE_NOT_FOUND", 404);
          }
          lockedVehicles.push(rows[0]);
        }

        for (const officerId of uniqueOfficerIds) {
          const officerRows = await tx.$queryRawUnsafe<Array<{ id: string }>>(
            `SELECT id FROM "PETUGAS" WHERE id = $1::uuid AND dinas_id = $2::uuid FOR UPDATE`,
            officerId,
            dinas.id,
          );
          if (officerRows.length === 0) {
            throw new ConfirmError(`Petugas ${officerId} tidak ditemukan`, "OFFICER_NOT_FOUND", 404);
          }
        }

        for (const stopId of allStopIds) {
          const reportRows = await tx.$queryRawUnsafe<Array<{ id: string; petugas_id: string | null; kendaraan_id: string | null; status: string }>>(
            `SELECT id, petugas_id, kendaraan_id, status FROM "LAPORAN" WHERE id = $1::uuid FOR UPDATE`,
            stopId,
          );
          if (reportRows.length === 0) {
            throw new ConfirmError(`Laporan ${stopId} tidak ditemukan`, "REPORT_NOT_FOUND_IN_LOCK", 404);
          }
          const r = reportRows[0];
          if (r.petugas_id || r.kendaraan_id) {
            throw new ConfirmError(`Laporan ${stopId} sudah di-assign`, "REPORT_ALREADY_ASSIGNED_AT_LOCK", 409);
          }
          if (r.status !== "ANALYZED" && r.status !== "WAITING") {
            throw new ConfirmError(`Laporan ${stopId} status tidak eligible: ${r.status}`, "REPORT_STATUS_INVALID_AT_LOCK", 409);
          }
        }

        const vehicleMap = new Map(lockedVehicles.map((v) => [v.id, v]));

        const assignedRoutes: Array<{
          routeId: string;
          petugasId: string;
          kendaraanId: string;
          stopCount: number;
        }> = [];
        const reportLoadMap = new Map<string, number>();
        const pendingEvents: Array<{ userId: string; event: PusherEvent }> = [];

        for (let routeIndex = 0; routeIndex < body.routes.length; routeIndex++) {
          const route = body.routes[routeIndex];
          const totalLoad = route.stopIds.reduce((sum, stopId) => {
            const report = reports.find((r) => r.id === stopId);
            if (!report) return sum;
            const reportAny = report as unknown as { kategori_ukuran: string; corrected_kategori_ukuran: string | null };
            const corrected = reportAny.corrected_kategori_ukuran;
            const effectiveSize = (corrected ?? reportAny.kategori_ukuran).toUpperCase();
            const load = LOAD_ESTIMATES_KG[effectiveSize] ?? LOAD_ESTIMATES_KG.UNCERTAIN;
            reportLoadMap.set(stopId, load);
            return sum + load;
          }, 0);

          const vehicle = vehicleMap.get(route.kendaraanId);
          if (!vehicle) {
            throw new ConfirmError(`Kendaraan tidak ditemukan`, "VEHICLE_NOT_FOUND_IN_MAP", 404);
          }

          if (vehicle.current_load + totalLoad > vehicle.kapasitas) {
            throw new ConfirmError(
              `Kapasitas kendaraan ${route.kendaraanId} tidak mencukupi`,
              "VEHICLE_CAPACITY_CHANGED",
              409,
            );
          }

          await tx.kendaraan.update({
            where: { id: vehicle.id },
            data: { current_load: { increment: totalLoad } },
          });
          vehicle.current_load += totalLoad;
          vehicleMap.set(vehicle.id, vehicle);

          for (let i = 0; i < route.stopIds.length; i++) {
            const stopId = route.stopIds[i];
            const routeOrder = route.routeOrder[i] ?? i + 1;

            const updateResult = await tx.laporan.updateMany({
              where: {
                id: stopId,
                dinas_id: dinas.id,
                petugas_id: null,
                kendaraan_id: null,
                status: { in: ["ANALYZED", "WAITING"] },
              },
              data: {
                petugas_id: route.petugasId,
                kendaraan_id: route.kendaraanId,
                status: "PENDING",
                route_order: routeOrder,
                assigned_load_kg: reportLoadMap.get(stopId) ?? 0,
                load_released_at: null,
              },
            });

            if (updateResult.count !== 1) {
              throw new ConfirmError(
                `Laporan ${stopId} gagal di-assign (mungkin sudah diambil)`,
                "REPORT_ALREADY_ASSIGNED",
                409,
              );
            }

            const report = reports.find((r) => r.id === stopId);
            if (report?.user_id) {
              await persistNotification(
                {
                  user_id: report.user_id,
                  laporan_id: stopId,
                  pesan: "Laporan Anda telah dijadwalkan untuk dijemput.",
                },
                tx,
              );
              pendingEvents.push({
                userId: report.user_id,
                event: createReportAssignedEvent({
                  laporanId: stopId,
                  petugasId: route.petugasId,
                }),
              });
            }
          }

          const dispatchRouteId = await createDispatchRouteForAssignment(tx, {
            dinasId: dinas.id,
            petugasId: route.petugasId,
            kendaraanId: route.kendaraanId,
            stopIds: route.stopIds,
            routeOrder: route.routeOrder,
            totalLoadKg: totalLoad,
            preparedRouteDetails: preparedRouteDetails[routeIndex],
          });

          const petugasUser = await tx.petugas.findUnique({
            where: { id: route.petugasId },
            select: { user_id: true },
          });

          if (petugasUser) {
            await persistNotification(
              {
                user_id: petugasUser.user_id,
                laporan_id: route.stopIds[0],
                pesan: `Rute pickup telah tersedia. ${route.stopIds.length} titik pickup ditugaskan kepada Anda. Segera periksa daftar tugas.`,
              },
              tx,
            );
            pendingEvents.push({
              userId: petugasUser.user_id,
              event: createReportAssignedEvent({
                laporanId: route.stopIds[0],
                petugasId: route.petugasId,
              }),
            });
          }

          assignedRoutes.push({
            routeId: dispatchRouteId,
            petugasId: route.petugasId,
            kendaraanId: route.kendaraanId,
            stopCount: route.stopIds.length,
          });
        }

        if (assignedRoutes.length === 0) {
          throw new ConfirmError("Semua rute gagal di-assign", "ALL_ROUTES_FAILED", 409);
        }

        const responsePayload = {
          success: true,
          data: { assignedRoutes },
        };

        await tx.autoCollectiveRequest.create({
          data: {
            dinas_id: dinas.id,
            idempotency_key: body.idempotencyKey,
            request_hash: requestHash,
            response_data: responsePayload,
          },
        });

        return { assignedRoutes, responsePayload, pendingEvents };
      }, {
        maxWait: 5_000,
        timeout: 15_000,
      });

      firePendingEvents(result.pendingEvents);

      return NextResponse.json(result.responsePayload, { status: 200 });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const existingAfterConflict = await prisma.autoCollectiveRequest.findUnique({
          where: {
            dinas_id_idempotency_key: {
              dinas_id: dinas.id,
              idempotency_key: body.idempotencyKey,
            },
          },
          select: { request_hash: true, response_data: true },
        });

        if (existingAfterConflict) {
          if (existingAfterConflict.request_hash === requestHash) {
            return NextResponse.json(
              existingAfterConflict.response_data ?? { success: true, data: { assignedRoutes: [] } },
              { status: 200 },
            );
          }
          return NextResponse.json(
            { error: "Idempotency key already used with different request body", code: "IDEMPOTENCY_KEY_REUSED" },
            { status: 409 },
          );
        }

        return NextResponse.json({ error: "Idempotency conflict", code: "IDEMPOTENCY_CONFLICT" }, { status: 409 });
      }

      if (error instanceof ConfirmError) {
        return NextResponse.json(
          { error: error.message, code: error.code },
          { status: error.status },
        );
      }

      if (isTransactionTimeout(error)) {
        return NextResponse.json(
          {
            error: "Konfirmasi rute memerlukan waktu terlalu lama. Silakan coba lagi.",
            code: "TRANSACTION_TIMEOUT",
          },
          { status: 503 },
        );
      }

      const message = error instanceof Error ? error.message : "Internal server error";
      return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Idempotency conflict", code: "IDEMPOTENCY_CONFLICT" }, { status: 409 });
    }
    if (error instanceof ConfirmError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status },
      );
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
