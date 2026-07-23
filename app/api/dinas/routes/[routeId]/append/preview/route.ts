import { NextRequest, NextResponse } from "next/server";
import { getRequestDinas } from "@/lib/dinas-auth";
import {
  ACTIVE_ROUTE_BLOCK_CODE,
  ACTIVE_ROUTE_BLOCK_MESSAGE,
  previewAppendToRoute,
} from "@/server/modules/dispatch/route-append.service";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ routeId: string }> },
) {
  try {
    const dinas = await getRequestDinas(request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const { routeId } = await params;
    const body = (await request.json()) as { reportId?: string };
    if (!body.reportId) {
      return NextResponse.json({ error: "reportId required", code: "VALIDATION" }, { status: 400 });
    }

    const preview = await previewAppendToRoute(dinas.id, routeId, body.reportId);
    return NextResponse.json({ success: true, data: preview });
  } catch (error) {
    const err = error as Error & { code?: string; status?: number };
    const status = err.status ?? 500;
    const code = err.code ?? "INTERNAL";
    const message =
      code === ACTIVE_ROUTE_BLOCK_CODE ? ACTIVE_ROUTE_BLOCK_MESSAGE : err.message || "Internal server error";
    return NextResponse.json({ error: message, code }, { status });
  }
}
