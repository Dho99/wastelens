import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { reverseGeocode } from "@/server/modules/location/reverse-geocode.service";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { lat, lng } = body;

    if (typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json(
        { error: "lat and lng (numbers) are required" },
        { status: 400 },
      );
    }

    const address = await reverseGeocode(lat, lng);

    return NextResponse.json({ success: true, data: address });
  } catch {
    return NextResponse.json(
      { success: false, data: null },
      { status: 200 },
    );
  }
}
