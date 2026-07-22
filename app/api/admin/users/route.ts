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
                { error: "Unauthorized", code: "AUTH" },
                { status: 401 },
            );
        }

        const role = (session.user as { role?: string }).role;
        if (role !== "admin") {
            return NextResponse.json(
                { error: "Forbidden", code: "FORBIDDEN" },
                { status: 403 },
            );
        }

        const { searchParams } = new URL(request.url);
        const filterRole = searchParams.get("role") ?? undefined;
        const filterStatus = searchParams.get("status") ?? undefined;
        const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
        const limit = Math.min(
            100,
            Math.max(1, parseInt(searchParams.get("limit") ?? "20")),
        );
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};
        if (filterRole) where.role = filterRole;
        if (filterStatus) where.status = filterStatus;

        const [data, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    saldo_koin: true,
                    createdAt: true,
                },
            }),
            prisma.user.count({ where }),
        ]);

        const mappedData = data.map((u) => ({
            id: u.id,
            nama: u.name,
            email: u.email,
            role: u.role,
            status: u.status,
            saldo_koin: u.saldo_koin,
            createdAt: u.createdAt,
        }));

        return NextResponse.json({
            success: true,
            data: {
                items: mappedData,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { error: message, code: "INTERNAL" },
            { status: 500 },
        );
    }
}

const VALID_ROLES = ["user", "petugas", "kopdes", "dinas", "admin"] as const;

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

        const adminRole = (session.user as { role?: string }).role;
        if (adminRole !== "admin") {
            return NextResponse.json(
                { error: "Forbidden", code: "FORBIDDEN" },
                { status: 403 },
            );
        }

        const body = await request.json();
        const {
            nama,
            email,
            password,
            role,
            dinas_id,
            nama_dinas,
            kontak_dinas,
            kopdes_nama,
            kopdes_alamat,
        } = body as Record<string, unknown>;

        // ── Common validations ───────────────────────────────
        if (!nama || typeof nama !== "string" || nama.trim().length === 0) {
            return NextResponse.json(
                { error: "Nama wajib diisi", code: "VALIDATION" },
                { status: 400 },
            );
        }
        if (!email || typeof email !== "string" || !email.includes("@")) {
            return NextResponse.json(
                { error: "Email tidak valid", code: "VALIDATION" },
                { status: 400 },
            );
        }
        if (!password || typeof password !== "string" || password.length < 8) {
            return NextResponse.json(
                { error: "Password minimal 8 karakter", code: "VALIDATION" },
                { status: 400 },
            );
        }
        if (
            !role ||
            !VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])
        ) {
            return NextResponse.json(
                { error: "Role tidak valid", code: "VALIDATION" },
                { status: 400 },
            );
        }

        const userRole = role as string;

        // ── Role-specific validations ────────────────────────
        if (userRole === "petugas") {
            if (!dinas_id || typeof dinas_id !== "string") {
                return NextResponse.json(
                    {
                        error: "Dinas wajib dipilih untuk petugas",
                        code: "VALIDATION",
                    },
                    { status: 400 },
                );
            }
            // Verify dinas exists
            const dinas = await prisma.dinas.findUnique({
                where: { id: dinas_id },
            });
            if (!dinas) {
                return NextResponse.json(
                    { error: "Dinas tidak ditemukan", code: "VALIDATION" },
                    { status: 400 },
                );
            }
        }
        if (userRole === "dinas") {
            if (
                !nama_dinas ||
                typeof nama_dinas !== "string" ||
                nama_dinas.trim().length === 0
            ) {
                return NextResponse.json(
                    { error: "Nama dinas wajib diisi", code: "VALIDATION" },
                    { status: 400 },
                );
            }
            if (
                !kontak_dinas ||
                typeof kontak_dinas !== "string" ||
                kontak_dinas.trim().length === 0
            ) {
                return NextResponse.json(
                    { error: "Kontak dinas wajib diisi", code: "VALIDATION" },
                    { status: 400 },
                );
            }
        }
        if (userRole === "kopdes") {
            if (
                !kopdes_nama ||
                typeof kopdes_nama !== "string" ||
                kopdes_nama.trim().length === 0
            ) {
                return NextResponse.json(
                    { error: "Nama kopdes wajib diisi", code: "VALIDATION" },
                    { status: 400 },
                );
            }
            if (
                !kopdes_alamat ||
                typeof kopdes_alamat !== "string" ||
                kopdes_alamat.trim().length === 0
            ) {
                return NextResponse.json(
                    { error: "Alamat kopdes wajib diisi", code: "VALIDATION" },
                    { status: 400 },
                );
            }
        }

        // ── Check email uniqueness ───────────────────────────
        const existing = await prisma.user.findUnique({
            where: { email: email as string },
        });
        if (existing) {
            return NextResponse.json(
                { error: "Email sudah terdaftar", code: "EMAIL_EXISTS" },
                { status: 409 },
            );
        }

        // ── Create user through Better Auth ──────────────────
        const trimmedNama = (nama as string).trim();
        const normalizedEmail = (email as string).trim().toLowerCase();
        const plainPassword = password as string;

        const signUpBody = {
            name: trimmedNama,
            email: normalizedEmail,
            password: plainPassword,
            nama: trimmedNama,
            role: userRole,
        };

        const result = await auth.api.signUpEmail({
            body: signUpBody,
            headers: request.headers,
            asResponse: false,
        });

        const userId = (result as { user?: { id: string } })?.user?.id;
        if (!userId) {
            return NextResponse.json(
                { error: "Gagal membuat akun", code: "CREATE_FAILED" },
                { status: 500 },
            );
        }

        // ── Create role-specific records ─────────────────────
        if (userRole === "petugas") {
            await prisma.petugas.create({
                data: {
                    user_id: userId,
                    dinas_id: dinas_id as string,
                    nama: (nama as string).trim(),
                    no_hp: "-",
                },
            });
        } else if (userRole === "kopdes") {
            await prisma.kopdes.create({
                data: {
                    user_id: userId,
                    nama: (kopdes_nama as string).trim(),
                    alamat: (kopdes_alamat as string).trim(),
                },
            });
        } else if (userRole === "dinas") {
            await prisma.dinas.create({
                data: {
                    user_id: userId,
                    nama_dinas: (nama_dinas as string).trim(),
                    kontak: (kontak_dinas as string).trim(),
                },
            });
        }

        return NextResponse.json(
            {
                success: true,
                data: {
                    message: "Pengguna berhasil dibuat",
                    userId,
                    role: userRole,
                },
            },
            { status: 201 },
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
