import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized", code: "AUTH" }, { status: 401 });
    }

    const data = {
      lastPasswordChangeText: "Terakhir diubah 3 bulan lalu",
      twoFactorEnabled: true,
      activeDevicesCount: 2,
    };

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message, code: "INTERNAL" }, { status: 500 });
  }
}
