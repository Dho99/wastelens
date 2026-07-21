import { NextRequest, NextResponse } from "next/server";
import { getRequestDinas } from "@/lib/dinas-auth";
import {
  getEligibleReports,
  getAvailableVehicles,
  getAvailableOfficers,
  buildCollectiveRoutes,
} from "@/server/modules/dispatch/auto-collective.service";
import type { EligibleReport } from "@/app/dinas/types/auto-collective";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const dinas = await getRequestDinas(request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { reportIds } = body as { reportIds?: string[] };

    const [eligibleReports, vehicles, officers] = await Promise.all([
      getEligibleReports(dinas.id),
      getAvailableVehicles(dinas.id),
      getAvailableOfficers(dinas.id),
    ]);

    const filteredReports = reportIds && reportIds.length > 0
      ? eligibleReports.filter((r) => reportIds.includes(r.id))
      : eligibleReports;

    const uncertainReports: EligibleReport[] = [];
    const assignableReports: EligibleReport[] = [];

    for (const report of filteredReports) {
      if (report.estimatedLoadKg <= 0) {
        uncertainReports.push(report);
      } else {
        assignableReports.push(report);
      }
    }

    const preview = await buildCollectiveRoutes(assignableReports, vehicles, officers);

    const uncertainUnassigned = uncertainReports.map((r) => ({
      ...r,
      unassignableReason: "UNCERTAIN_LOAD" as const,
    }));

    return NextResponse.json({
      success: true,
      data: {
        routes: preview.routes,
        unassignedReports: [
          ...preview.unassignedReports,
          ...uncertainUnassigned,
        ],
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
