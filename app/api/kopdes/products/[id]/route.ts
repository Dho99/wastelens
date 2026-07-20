import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// GET /api/kopdes/products/[id] — Fetch a single product
// ---------------------------------------------------------------------------

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    // Verify the product belongs to this kopdes
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

    const produk = await prisma.produk.findFirst({
      where: { id, kopdes_id: kopdes.id },
    });

    if (!produk) {
      return NextResponse.json(
        { error: "Produk not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json(produk, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message, code: "INTERNAL" },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// PUT /api/kopdes/products/[id] — Update a product
// ---------------------------------------------------------------------------

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    // Verify the product belongs to this kopdes
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

    const existing = await prisma.produk.findFirst({
      where: { id, kopdes_id: kopdes.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Produk not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { nama_barang, harga_koin, stok, kategori, satuan } = body;

    // Validate
    if (nama_barang === "") {
      return NextResponse.json(
        { error: "nama_barang cannot be empty", code: "VALIDATION" },
        { status: 400 },
      );
    }
    if (harga_koin != null && (typeof harga_koin !== "number" || harga_koin < 0)) {
      return NextResponse.json(
        { error: "harga_koin must be a non-negative number", code: "VALIDATION" },
        { status: 400 },
      );
    }
    if (stok != null && (typeof stok !== "number" || stok < 0)) {
      return NextResponse.json(
        { error: "stok must be a non-negative number", code: "VALIDATION" },
        { status: 400 },
      );
    }

    const updated = await prisma.produk.update({
      where: { id },
      data: {
        ...(nama_barang != null && { nama_barang }),
        ...(harga_koin != null && { harga_koin }),
        ...(stok != null && { stok }),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message, code: "INTERNAL" },
      { status: 500 },
    );
  }
}
