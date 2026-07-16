import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkLocationCooldown } from "@/lib/services/spatial";

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized", code: "AUTH" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const { lat, lng } = body;

        if (typeof lat !== "number" || typeof lng !== "number") {
            return NextResponse.json(
                { error: "Valid lat and lng are required", code: "VALIDATION" },
                { status: 400 },
            );
        }

        const result = await checkLocationCooldown(lat, lng);

        if (result.inCooldown) {
            return NextResponse.json(
                { isValid: false, ...result },
                { status: 200 },
            );
        }

        return NextResponse.json(
            { isValid: true, inCooldown: false, message: null },
            { status: 200 },
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { error: message, code: "INTERNAL" },
            { status: 500 },
        );
    }
}
