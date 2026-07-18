import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized", code: "AUTH" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "currentPassword and newPassword are required", code: "VALIDATION" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters", code: "VALIDATION" },
        { status: 400 },
      );
    }

    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
      },
      headers: request.headers,
    });

    return NextResponse.json({ success: true, data: { message: "Password updated successfully" } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to change password";
    return NextResponse.json({ success: false, error: message, code: "INTERNAL" }, { status: 500 });
  }
}
