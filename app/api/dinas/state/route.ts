import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma/client";
import { getRequestDinas } from "@/lib/dinas-auth";
import { prisma } from "@/lib/prisma";
import type { DlhState } from "@/lib/dlh-store";
import { computeEstimatedLoadKg } from "@/server/modules/dispatch/auto-collective.service";
import { LOAD_ESTIMATES_KG } from "@/lib/services/assignment";

class StateUpdateError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number = 409,
  ) {
    super(message);
    this.name = "StateUpdateError";
  }
}

interface DbReport {
  kategori_ukuran: string;
  corrected_kategori_ukuran: string | null;
  drainage_risk: boolean | null;
  access_obstruction_risk: boolean | null;
  needs_manual_review: boolean | null;
  estimated_load_unit: number | null;
  route_order: number | null;
}

export const dynamic = "force-dynamic";

function isDlhState(value: unknown): value is DlhState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<DlhState>;
  return Array.isArray(state.reports)
    && Array.isArray(state.vehicles)
    && Array.isArray(state.officers)
    && Array.isArray(state.accounts)
    && Array.isArray(state.notifications)
    && Boolean(state.admin && typeof state.admin === "object")
    && Boolean(state.settings && typeof state.settings === "object");
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function reportStatus(status: string): DlhState["reports"][number]["status"] {
  if (status === "SELESAI") return "Selesai";
  if (status === "DIJEMPUT" || status === "DIPROSES") return "Diproses";
  return "Menunggu";
}

function databaseStatus(status: DlhState["reports"][number]["status"]) {
  if (status === "Selesai") return "SELESAI";
  if (status === "Diproses") return "DIJEMPUT";
  return "PENDING";
}

function reportPhotoUrl(photoUrl: string | null | undefined) {
  if (!photoUrl || photoUrl.startsWith("https://res.cloudinary.com/wastelens/")) {
    return "/images/waste_bags_stack.png";
  }

  return photoUrl;
}

function mergeById<T extends { id: string }>(saved: T[] | undefined, database: T[]) {
  const databaseIds = new Set(database.map((item) => item.id));
  const savedMap = new Map((saved ?? []).map((item) => [item.id, item]));
  return [
    ...database.map((item) => ({ ...savedMap.get(item.id), ...item })),
    ...(saved ?? []).filter((item) => !databaseIds.has(item.id)),
  ];
}

export async function GET(request: NextRequest) {
  try {
    const dinas = await getRequestDinas(request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const [state, reports, vehicles, officers, adminUser] = await Promise.all([
      prisma.dlhPortalState.findUnique({
        where: { dinas_id: dinas.id },
        select: { data: true, updatedAt: true },
      }),
      prisma.laporan.findMany({
        where: { dinas_id: dinas.id },
        include: { user: { select: { name: true } }, foto: { select: { url: true }, take: 1 } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.kendaraan.findMany({ where: { dinas_id: dinas.id }, orderBy: { id: "asc" } }),
      prisma.petugas.findMany({
        where: { dinas_id: dinas.id },
        include: { user: { select: { email: true, status: true } }, _count: { select: { laporan: true } } },
        orderBy: { nama: "asc" },
      }),
      prisma.user.findUnique({ where: { id: dinas.userId }, select: { name: true, email: true, image: true } }),
    ]);

    const saved = (state?.data && typeof state.data === "object" ? state.data : {}) as Partial<DlhState>;
    const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", timeZone: "Asia/Jakarta" });
    const timeFormatter = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });
    const dbReports: DlhState["reports"] = reports.map((report) => ({
      id: report.id,
      date: dateFormatter.format(report.createdAt),
      isoDate: report.createdAt.toISOString().slice(0, 10),
      year: String(report.createdAt.getFullYear()),
      time: `${timeFormatter.format(report.createdAt).replace(".", ":")} WIB`,
      location: `${report.lokasi_lat.toFixed(5)}, ${report.lokasi_lng.toFixed(5)}`,
      district: report.district ?? dinas.name,
      address: report.address_text ?? undefined,
      latitude: report.lokasi_lat,
      longitude: report.lokasi_lng,
      wasteTypes: report.waste_types,
      sizeCategory: report.kategori_ukuran,
      priorityLevel: report.priority_level ?? undefined,
      category: report.kategori_ukuran.toUpperCase() === "BESAR" ? "BAHAYA" : "AMAN",
      status: reportStatus(report.status),
      reporter: report.user.name,
      photoUrl: reportPhotoUrl(report.foto[0]?.url ?? report.foto_url),
      assignedOfficerId: report.petugas_id ?? undefined,
      assignedVehicleId: report.kendaraan_id ?? undefined,
      estimatedLoadKg: computeEstimatedLoadKg({
        kategori_ukuran: report.kategori_ukuran,
        corrected_kategori_ukuran: (report as unknown as DbReport).corrected_kategori_ukuran ?? null,
      }),
      drainageRisk: report.drainage_risk ?? undefined,
      accessObstructionRisk: report.access_obstruction_risk ?? undefined,
      needsManualReview: report.needs_manual_review ?? undefined,
      estimatedLoadUnit: report.estimated_load_unit ?? undefined,
      routeOrder: (report as unknown as DbReport).route_order ?? undefined,
    }));
    const dbVehicles: DlhState["vehicles"] = vehicles.map((vehicle) => {
      const capacity = vehicle.kapasitas > 100 ? vehicle.kapasitas / 1000 : vehicle.kapasitas;
      const load = vehicle.current_load > 100 ? vehicle.current_load / 1000 : vehicle.current_load;
      const existing = saved.vehicles?.find((item) => item.id === vehicle.id);
      return {
        id: vehicle.id,
        plate: existing?.plate ?? vehicle.jenis.toUpperCase(),
        capacity: `${capacity.toFixed(1)} Ton`,
        status: existing?.status ?? (vehicle.current_load >= vehicle.kapasitas ? "Standby" : "Beroperasi"),
        type: vehicle.jenis,
        year: existing?.year ?? new Date().getFullYear(),
        area: dinas.name,
        load,
        maintenance: existing?.maintenance ?? [],
        nextService: existing?.nextService,
      };
    });
    const dbOfficers: DlhState["officers"] = officers.map((officer, index) => {
      const existing = saved.officers?.find((item) => item.id === officer.id);
      return {
        id: officer.id,
        name: officer.nama,
        initials: officer.nama.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
        zone: existing?.zone ?? dinas.name,
        phone: officer.no_hp,
        email: officer.user.email,
        color: existing?.color ?? ["bg-[#bcebd1]", "bg-[#ffd9ae]", "bg-[#d7eafd]"][index % 3],
        role: existing?.role ?? "Field Operator",
        shift: existing?.shift ?? "Pagi",
        mobileAccess: existing?.mobileAccess ?? true,
        tracking: existing?.tracking ?? true,
        photo: existing?.photo,
        tasks: officer._count.laporan,
        location: existing?.location ?? dinas.name,
        recentTasks: existing?.recentTasks ?? [],
      };
    });
    const dbAccounts: DlhState["accounts"] = officers.map((officer, index) => ({
      id: index + 1,
      name: officer.nama,
      initials: officer.nama.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      email: officer.user.email,
      phone: officer.no_hp,
      role: "Petugas Lapangan",
      active: officer.user.status === "active",
    }));
    const merged: Partial<DlhState> = {
      ...saved,
      reports: mergeById(saved.reports, dbReports),
      vehicles: mergeById(saved.vehicles, dbVehicles),
      officers: mergeById(saved.officers, dbOfficers),
      accounts: [
        ...(saved.accounts ?? []),
        ...dbAccounts.filter((account) => !(saved.accounts ?? []).some((savedAccount) => savedAccount.email.toLowerCase() === account.email.toLowerCase())),
      ],
      admin: {
        ...saved.admin,
        name: saved.admin?.name ?? adminUser?.name ?? dinas.name,
        email: saved.admin?.email ?? adminUser?.email ?? "",
        passwordUpdatedAt: saved.admin?.passwordUpdatedAt ?? "Belum tersedia",
        photo: adminUser?.image ?? saved.admin?.photo,
      },
    };

    return NextResponse.json(
      { data: merged, updatedAt: state?.updatedAt ?? null, dinas: { id: dinas.id, name: dinas.name } },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memuat data DLH";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const dinas = await getRequestDinas(request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const body = await request.json() as { data?: unknown };
    if (!isDlhState(body.data)) {
      return NextResponse.json({ error: "Format state DLH tidak valid", code: "VALIDATION" }, { status: 400 });
    }

    const dlhData = body.data;

    const serialized = JSON.stringify(dlhData);
    if (serialized.length > 7_500_000) {
      return NextResponse.json({ error: "Data DLH terlalu besar. Kurangi ukuran foto yang diunggah.", code: "PAYLOAD_TOO_LARGE" }, { status: 413 });
    }

    const data = JSON.parse(serialized) as Prisma.InputJsonValue;
    const state = await prisma.dlhPortalState.upsert({
      where: { dinas_id: dinas.id },
      create: { dinas_id: dinas.id, data },
      update: { data },
      select: { updatedAt: true },
    });

    const [ownedOfficers, ownedVehicles] = await Promise.all([
      prisma.petugas.findMany({ where: { dinas_id: dinas.id }, select: { id: true } }),
      prisma.kendaraan.findMany({ where: { dinas_id: dinas.id }, select: { id: true } }),
    ]);
    const ownedOfficerIds = new Set(ownedOfficers.map((item) => item.id));
    const ownedVehicleIds = new Set(ownedVehicles.map((item) => item.id));

    const assignmentReports = dlhData.reports.filter(
      (report) => UUID_PATTERN.test(report.id) && report.assignedOfficerId && report.assignedVehicleId,
    );

    await prisma.$transaction(async (tx) => {
      for (const report of assignmentReports) {
        const existing = await tx.laporan.findUnique({
          where: { id: report.id },
          select: {
            id: true,
            petugas_id: true,
            kendaraan_id: true,
            assigned_load_kg: true,
            kategori_ukuran: true,
            corrected_kategori_ukuran: true,
          },
        });

        if (!existing) continue;

        const data: Record<string, unknown> = {
          status: databaseStatus(report.status),
          petugas_id: ownedOfficerIds.has(report.assignedOfficerId!) ? report.assignedOfficerId : null,
          kendaraan_id: ownedVehicleIds.has(report.assignedVehicleId!) ? report.assignedVehicleId : null,
        };

        if (!existing.petugas_id && data.petugas_id && !existing.assigned_load_kg) {
          const effectiveSize = (existing.corrected_kategori_ukuran ?? existing.kategori_ukuran).toUpperCase();
          const load = LOAD_ESTIMATES_KG[effectiveSize] ?? LOAD_ESTIMATES_KG.UNCERTAIN;
          data.assigned_load_kg = load;
          data.load_released_at = null;

          if (data.kendaraan_id && load > 0) {
            const vehicles = await tx.$queryRawUnsafe<Array<{ id: string; current_load: number; kapasitas: number }>>(
              `SELECT id, current_load, kapasitas FROM "KENDARAAN" WHERE id = $1::uuid AND dinas_id = $2::uuid FOR UPDATE`,
              data.kendaraan_id as string,
              dinas.id,
            );

            if (vehicles.length === 0) {
              throw new StateUpdateError("Kendaraan tidak ditemukan", "VEHICLE_NOT_FOUND", 404);
            }

            const vehicle = vehicles[0];
            if (vehicle.current_load + load > vehicle.kapasitas) {
              throw new StateUpdateError(
                `Kapasitas kendaraan tidak mencukupi`,
                "VEHICLE_CAPACITY_CHANGED",
                409,
              );
            }

            await tx.kendaraan.update({
              where: { id: data.kendaraan_id as string },
              data: { current_load: { increment: load } },
            });
          }
        }

        await tx.laporan.update({
          where: { id: report.id },
          data,
        });
      }

      const nonAssignmentReports = dlhData.reports.filter(
        (report) => UUID_PATTERN.test(report.id) && !report.assignedOfficerId && !report.assignedVehicleId,
      );

      for (const report of nonAssignmentReports) {
        await tx.laporan.updateMany({
          where: { id: report.id, dinas_id: dinas.id },
          data: { status: databaseStatus(report.status) },
        });
      }
    });

    return NextResponse.json({ success: true, updatedAt: state.updatedAt });
  } catch (error) {
    if (error instanceof StateUpdateError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status },
      );
    }
    const message = error instanceof Error ? error.message : "Gagal menyimpan data DLH";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
