import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const correctSchema = z.object({
  correctedSizeCategory: z.enum(["SMALL", "MEDIUM", "LARGE", "UNCERTAIN"]).optional(),
  correctedDrainageRisk: z.boolean().optional(),
  correctedAccessObstructionRisk: z.boolean().optional(),
  correctionReason: z.string().min(1, "Alasan koreksi wajib diisi"),
}).refine(
  (d) => d.correctedSizeCategory !== undefined
     || d.correctedDrainageRisk !== undefined
     || d.correctedAccessObstructionRisk !== undefined,
  "Setidaknya satu field koreksi harus diisi",
);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized", code: "AUTH" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "petugas" && role !== "dinas") {
      return NextResponse.json({ error: "Forbidden", code: "AUTH" }, { status: 403 });
    }

    const { id } = await params;

    const laporan = await prisma.laporan.findUnique({
      where: { id },
      select: {
        petugas_id: true,
        dinas_id: true,
        user_id: true,
      },
    });

    if (!laporan) {
      return NextResponse.json({ error: "Laporan tidak ditemukan", code: "NOT_FOUND" }, { status: 404 });
    }

    if (role === "petugas") {
      const petugas = await prisma.petugas.findFirst({
        where: { user_id: session.user.id },
        select: { id: true },
      });
      if (!petugas || petugas.id !== laporan.petugas_id) {
        return NextResponse.json({ error: "Anda tidak ditugaskan ke laporan ini", code: "FORBIDDEN" }, { status: 403 });
      }
    }

    if (role === "dinas") {
      const dinas = await prisma.dinas.findFirst({
        where: { user_id: session.user.id },
        select: { id: true },
      });
      if (!dinas || dinas.id !== laporan.dinas_id) {
        return NextResponse.json({ error: "Laporan ini bukan dalam cakupan dinas Anda", code: "FORBIDDEN" }, { status: 403 });
      }
    }

    const existingReward = await prisma.transaksiKoin.findFirst({
      where: { laporan_id: id, jenis: "kredit" },
    });

    if (existingReward) {
      return NextResponse.json({
        error: "Reward sudah diberikan, koreksi tidak diizinkan",
        code: "REWARD_ALREADY_GRANTED",
      }, { status: 409 });
    }

    const body = await request.json();
    const parsed = correctSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        error: "Validasi gagal",
        code: "VALIDATION",
        details: parsed.error.issues,
      }, { status: 400 });
    }

    const { correctedSizeCategory, correctedDrainageRisk, correctedAccessObstructionRisk, correctionReason } = parsed.data;

    const data: Record<string, unknown> = {
      corrected_by: session.user.id,
      corrected_at: new Date(),
      correction_reason: correctionReason,
    };

    if (correctedSizeCategory !== undefined) data.corrected_kategori_ukuran = correctedSizeCategory;
    if (correctedDrainageRisk !== undefined) data.corrected_drainage_risk = correctedDrainageRisk;
    if (correctedAccessObstructionRisk !== undefined) data.corrected_access_obstruction_risk = correctedAccessObstructionRisk;

    await prisma.laporan.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      data: {
        correctedKategoriUkuran: correctedSizeCategory,
        correctedDrainageRisk: correctedDrainageRisk,
        correctedAccessObstructionRisk: correctedAccessObstructionRisk,
        correctionReason,
      },
    }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
