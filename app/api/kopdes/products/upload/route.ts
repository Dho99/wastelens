import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

interface ProductRow {
    nama_barang: string;
    harga_koin: number;
    stok: number;
}

function parseCSV(text: string): ProductRow[] {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    const rows: ProductRow[] = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim());
        if (cols.length < 3) continue;

        const nama_barang = cols[0];
        const harga_koin = parseInt(cols[1], 10);
        const stok = parseInt(cols[2], 10);

        if (!nama_barang || isNaN(harga_koin) || isNaN(stok)) continue;
        if (harga_koin < 0 || stok < 0) continue;

        rows.push({ nama_barang, harga_koin, stok });
    }
    return rows;
}

function parseXLSX(buffer: ArrayBuffer): ProductRow[] {
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return [];

    const sheet = workbook.Sheets[sheetName];
    const raw: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);

    const rows: ProductRow[] = [];
    for (const item of raw) {
        const nama_barang = String(
            item.nama_barang ?? item.NamaBarang ?? item.nama ?? "",
        ).trim();
        const harga_koin = Number(
            item.harga_koin ?? item.HargaKoin ?? item.harga ?? -1,
        );
        const stok = Number(item.stok ?? item.Stok ?? -1);

        if (!nama_barang || isNaN(harga_koin) || isNaN(stok)) continue;
        if (harga_koin < 0 || stok < 0) continue;

        rows.push({ nama_barang, harga_koin, stok });
    }
    return rows;
}

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

        const userId = session.user.id;
        const role = (session.user as { role?: string }).role;
        if (role !== "kopdes") {
            return NextResponse.json(
                { error: "Forbidden", code: "AUTH" },
                { status: 403 },
            );
        }

        const kopdes = await prisma.kopdes.findFirst({
            where: { user_id: userId },
            select: { id: true },
        });

        if (!kopdes) {
            return NextResponse.json(
                { error: "Kopdes not found", code: "NOT_FOUND" },
                { status: 404 },
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "File is required", code: "VALIDATION" },
                { status: 400 },
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = file.name.toLowerCase();

        let rows: ProductRow[];

        if (fileName.endsWith(".csv")) {
            rows = parseCSV(buffer.toString("utf-8"));
        } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
            rows = parseXLSX(buffer.buffer);
        } else {
            return NextResponse.json(
                { error: "File must be .csv or .xlsx", code: "VALIDATION" },
                { status: 400 },
            );
        }

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "No valid rows found in file", code: "VALIDATION" },
                { status: 400 },
            );
        }

        const errors: string[] = [];
        let inserted = 0;

        await prisma.$transaction(async (tx) => {
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                try {
                    await tx.produk.create({
                        data: {
                            kopdes_id: kopdes.id,
                            nama_barang: row.nama_barang,
                            harga_koin: row.harga_koin,
                            stok: row.stok,
                        },
                    });
                    inserted++;
                } catch {
                    errors.push(
                        `Row ${i + 1}: ${row.nama_barang} — gagal disimpan`,
                    );
                }
            }
        });

        return NextResponse.json({ inserted, errors }, { status: 201 });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { error: message, code: "INTERNAL" },
            { status: 500 },
        );
    }
}
