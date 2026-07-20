import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized", code: "AUTH" }, { status: 401 });
    }

    const body = await request.json();
    const { produk_id } = body;

    if (!produk_id) {
      return NextResponse.json(
        { error: "produk_id is required", code: "VALIDATION" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    const result = await prisma.$transaction(async (tx) => {
      const produk = await tx.produk.findUnique({
        where: { id: produk_id },
        include: { kopdes: true },
      });

      if (!produk) {
        throw { status: 404, code: "NOT_FOUND", message: "Produk tidak ditemukan" };
      }

      if (produk.stok < 1) {
        throw { status: 400, code: "OUT_OF_STOCK", message: "Stok produk habis" };
      }

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { saldo_koin: true },
      });

      if (!user) {
        throw { status: 404, code: "NOT_FOUND", message: "User tidak ditemukan" };
      }

      if (user.saldo_koin < produk.harga_koin) {
        throw {
          status: 400,
          code: "INSUFFICIENT_FUNDS",
          message: `Koin tidak cukup. Dibutuhkan ${produk.harga_koin}, saldo Anda ${user.saldo_koin}`,
        };
      }

      await tx.user.update({
        where: { id: userId },
        data: { saldo_koin: { decrement: produk.harga_koin } },
      });

      await tx.produk.update({
        where: { id: produk_id },
        data: { stok: { decrement: 1 } },
      });

      const penukaran = await tx.penukaran.create({
        data: {
          user_id: userId,
          produk_id,
          kopdes_id: produk.kopdes_id,
          unit_coin_price: produk.harga_koin,
          jumlah_koin: produk.harga_koin,
          expires_at: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      const updatedUser = await tx.user.findUnique({
        where: { id: userId },
        select: { saldo_koin: true },
      });

      return { penukaran, sisa_koin: updatedUser!.saldo_koin, nama_barang: produk.nama_barang };
    });

    return NextResponse.json(
      {
        penukaran_id: result.penukaran.id,
        sisa_koin: result.sisa_koin,
        nama_barang: result.nama_barang,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error && typeof error === "object" && "status" in error) {
      const e = error as { status: number; code: string; message: string };
      return NextResponse.json(
        { error: e.message, code: e.code },
        { status: e.status }
      );
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message, code: "INTERNAL" },
      { status: 500 }
    );
  }
}
