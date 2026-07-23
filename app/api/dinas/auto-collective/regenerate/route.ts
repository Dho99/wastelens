import { NextRequest, NextResponse } from "next/server";
import { getRequestDinas } from "@/lib/dinas-auth";
import {
  getEligibleReports,
  getAvailableVehicles,
  getAvailableOfficers,
  buildMinimumVehicleRoutes,
} from "@/server/modules/dispatch/auto-collective.service";
import type { RegenerateRequest } from "@/app/dinas/types/auto-collective";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const dinas = await getRequestDinas(request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const body = (await request.json()) as RegenerateRequest;

    if (!body.routes || body.routes.length === 0) {
      return NextResponse.json(
        { error: "routes is required", code: "VALIDATION" },
        { status: 400 },
      );
    }

    const [eligibleReports, vehicles, officers] = await Promise.all([
      getEligibleReports(dinas.id),
      getAvailableVehicles(dinas.id),
      getAvailableOfficers(dinas.id),
    ]);

    const allReportIds = new Set<string>();
    for (const route of body.routes) {
      for (const stop of route.stops) {
        allReportIds.add(stop.reportId);
      }
    }

    const routeMods = body.modifications?.routeModifications ?? [];
    const removeSet = new Set(
      routeMods.flatMap((m) => m.removeStopIds ?? []),
    );

    const remainingIds = new Set(allReportIds);
    for (const id of removeSet) {
      remainingIds.delete(id);
    }

    const filteredReports = eligibleReports.filter((r) => remainingIds.has(r.id));

    const modOverrides = new Map<
      string,
      { petugasId?: string; kendaraanId?: string }
    >();
    for (const mod of routeMods) {
      modOverrides.set(mod.temporaryRouteId, {
        petugasId: mod.newPetugasId,
        kendaraanId: mod.newKendaraanId,
      });
    }

    const preview = await buildMinimumVehicleRoutes(filteredReports, vehicles, officers);

    const overriddenRoutes = preview.routes.map((route) => {
      const override = modOverrides.get(route.temporaryRouteId);
      if (!override) return route;

      const newPetugas = override.petugasId
        ? officers.find((o) => o.id === override.petugasId) ?? null
        : null;

      return {
        ...route,
        ...(override.petugasId ? { petugasId: override.petugasId } : {}),
        ...(override.kendaraanId ? { kendaraanId: override.kendaraanId } : {}),
        ...(newPetugas ? { petugasNama: newPetugas.nama } : {}),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        routes: overriddenRoutes,
        unassignedReports: preview.unassignedReports,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
