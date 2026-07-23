import { NextRequest, NextResponse } from "next/server";
import { getRequestDinas } from "@/lib/dinas-auth";
import {
  ACTIVE_ROUTE_BLOCK_CODE,
  ACTIVE_ROUTE_BLOCK_MESSAGE,
  confirmAppendToRoute,
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
    const body = (await request.json()) as { reportId?: string; impactToken?: string };
    if (!body.reportId || !body.impactToken) {
      return NextResponse.json(
        { error: "reportId dan impactToken wajib", code: "VALIDATION" },
        { status: 400 },
      );
    }

    const result = await confirmAppendToRoute(dinas.id, routeId, body.reportId, body.impactToken);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const err = error as Error & { code?: string; status?: number };
    const status = err.status ?? 500;
    const code = err.code ?? "INTERNAL";
    const message =
      code === ACTIVE_ROUTE_BLOCK_CODE ? ACTIVE_ROUTE_BLOCK_MESSAGE : err.message || "Internal server error";
    return NextResponse.json({ error: message, code }, { status });
  }
}
