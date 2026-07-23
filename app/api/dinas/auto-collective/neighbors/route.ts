import { NextRequest, NextResponse } from "next/server";
import { getRequestDinas } from "@/lib/dinas-auth";
import {
  findNeighborReports,
} from "@/server/modules/dispatch/auto-collective.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const dinas = await getRequestDinas(request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const body = await request.json() as { reportId?: string };
    if (!body.reportId) {
      return NextResponse.json({ error: "reportId required", code: "VALIDATION" }, { status: 400 });
    }

    const result = await findNeighborReports(body.reportId, dinas.id);

    return NextResponse.json({
      success: true,
      data: {
        sourceReportId: body.reportId,
        neighborIds: result.neighborIds,
        totalCandidatesFound: result.neighborIds.length,
        eligibleCount: result.neighborIds.length,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
