import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json(
                { success: false, error: "Unauthorized", code: "AUTH" },
                { status: 401 },
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found", code: "NOT_FOUND" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { success: true, data: user },
            { status: 200 },
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { success: false, error: message, code: "INTERNAL" },
            { status: 500 },
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json(
                { success: false, error: "Unauthorized", code: "AUTH" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const { name, email, address, phoneNumber } = body;
        console.log(body);

        if (!name && !email) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Minimal satu field (name atau email) harus diisi",
                    code: "VALIDATION",
                },
                { status: 400 },
            );
        }

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: name ?? undefined,
                email: email ?? undefined,
                address: address ?? undefined,
                phoneNumber: phoneNumber ?? undefined,
            },
        });

        return NextResponse.json(
            { success: true, data: user },
            { status: 200 },
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { success: false, error: message, code: "INTERNAL" },
            { status: 500 },
        );
    }
}
