import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma/client";
import { getRequestDinas } from "@/lib/dinas-auth";
import { prisma } from "@/lib/prisma";
import type { DlhState } from "@/lib/dlh-store";

export const dynamic = "force-dynamic";

function isDlhState(value: unknown): value is DlhState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<DlhState>;
  return Array.isArray(state.reports)
    && Array.isArray(state.vehicles)
    && Array.isArray(state.officers)
    && Array.isArray(state.accounts)
    && Array.isArray(state.notifications)
    && Boolean(state.admin && typeof state.admin === "object")
    && Boolean(state.settings && typeof state.settings === "object");
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function reportStatus(status: string): DlhState["reports"][number]["status"] {
  if (status === "SELESAI") return "Selesai";
  if (status === "DIJEMPUT" || status === "DIPROSES") return "Diproses";
  return "Menunggu";
}

function databaseStatus(status: DlhState["reports"][number]["status"]) {
  if (status === "Selesai") return "SELESAI";
  if (status === "Diproses") return "DIJEMPUT";
  return "PENDING";
}

function mergeById<T extends { id: string }>(saved: T[] | undefined, database: T[]) {
  const databaseIds = new Set(database.map((item) => item.id));
  const savedMap = new Map((saved ?? []).map((item) => [item.id, item]));
  return [
    ...database.map((item) => ({ ...savedMap.get(item.id), ...item })),
    ...(saved ?? []).filter((item) => !databaseIds.has(item.id)),
  ];
}

export async function GET(request: NextRequest) {
  try {
    const dinas = await getRequestDinas(request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const [state, reports, vehicles, officers] = await Promise.all([
      prisma.dlhPortalState.findUnique({
        where: { dinas_id: dinas.id },
        select: { data: true, updatedAt: true },
      }),
      prisma.laporan.findMany({
        where: { dinas_id: dinas.id },
        include: { user: { select: { nama: true } }, foto: { select: { url: true }, take: 1 } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.kendaraan.findMany({ where: { dinas_id: dinas.id }, orderBy: { id: "asc" } }),
      prisma.petugas.findMany({
        where: { dinas_id: dinas.id },
        include: { user: { select: { email: true, status: true } }, _count: { select: { laporan: true } } },
        orderBy: { nama: "asc" },
      }),
    ]);

    const saved = (state?.data && typeof state.data === "object" ? state.data : {}) as Partial<DlhState>;
    const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", timeZone: "Asia/Jakarta" });
    const timeFormatter = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });
    const dbReports: DlhState["reports"] = reports.map((report) => ({
      id: report.id,
      date: dateFormatter.format(report.createdAt),
      isoDate: report.createdAt.toISOString().slice(0, 10),
      year: String(report.createdAt.getFullYear()),
      time: `${timeFormatter.format(report.createdAt).replace(".", ":")} WIB`,
      location: `${report.lokasi_lat.toFixed(5)}, ${report.lokasi_lng.toFixed(5)}`,
      district: dinas.name,
      category: report.kategori_ukuran.toLowerCase() === "large" ? "BAHAYA" : "AMAN",
      status: reportStatus(report.status),
      reporter: report.user.nama,
      photoUrl: report.foto[0]?.url ?? report.foto_url,
      assignedOfficerId: report.petugas_id ?? undefined,
      assignedVehicleId: report.kendaraan_id ?? undefined,
    }));
    const dbVehicles: DlhState["vehicles"] = vehicles.map((vehicle) => {
      const capacity = vehicle.kapasitas > 100 ? vehicle.kapasitas / 1000 : vehicle.kapasitas;
      const load = vehicle.current_load > 100 ? vehicle.current_load / 1000 : vehicle.current_load;
      const existing = saved.vehicles?.find((item) => item.id === vehicle.id);
      return {
        id: vehicle.id,
        plate: existing?.plate ?? vehicle.jenis.toUpperCase(),
        capacity: `${capacity.toFixed(1)} Ton`,
        status: existing?.status ?? (vehicle.current_load >= vehicle.kapasitas ? "Standby" : "Beroperasi"),
        type: vehicle.jenis,
        year: existing?.year ?? new Date().getFullYear(),
        area: dinas.name,
        load,
        maintenance: existing?.maintenance ?? [],
        nextService: existing?.nextService,
      };
    });
    const dbOfficers: DlhState["officers"] = officers.map((officer, index) => {
      const existing = saved.officers?.find((item) => item.id === officer.id);
      return {
        id: officer.id,
        name: officer.nama,
        initials: officer.nama.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
        zone: existing?.zone ?? dinas.name,
        phone: officer.no_hp,
        email: officer.user.email,
        color: existing?.color ?? ["bg-[#bcebd1]", "bg-[#ffd9ae]", "bg-[#d7eafd]"][index % 3],
        role: existing?.role ?? "Field Operator",
        shift: existing?.shift ?? "Pagi",
        mobileAccess: existing?.mobileAccess ?? true,
        tracking: existing?.tracking ?? true,
        photo: existing?.photo,
        tasks: officer._count.laporan,
        location: existing?.location ?? dinas.name,
        recentTasks: existing?.recentTasks ?? [],
      };
    });
    const dbAccounts: DlhState["accounts"] = officers.map((officer, index) => ({
      id: index + 1,
      name: officer.nama,
      initials: officer.nama.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      email: officer.user.email,
      phone: officer.no_hp,
      role: "Petugas Lapangan",
      active: officer.user.status === "active",
    }));
    const merged: Partial<DlhState> = {
      ...saved,
      reports: mergeById(saved.reports, dbReports),
      vehicles: mergeById(saved.vehicles, dbVehicles),
      officers: mergeById(saved.officers, dbOfficers),
      accounts: [
        ...(saved.accounts ?? []),
        ...dbAccounts.filter((account) => !(saved.accounts ?? []).some((savedAccount) => savedAccount.email.toLowerCase() === account.email.toLowerCase())),
      ],
    };

    return NextResponse.json(
      { data: merged, updatedAt: state?.updatedAt ?? null, dinas: { id: dinas.id, name: dinas.name } },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memuat data DLH";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const dinas = await getRequestDinas(request);
    if (!dinas) {
      return NextResponse.json({ error: "Akses DLH tidak ditemukan", code: "AUTH" }, { status: 401 });
    }

    const body = await request.json() as { data?: unknown };
    if (!isDlhState(body.data)) {
      return NextResponse.json({ error: "Format state DLH tidak valid", code: "VALIDATION" }, { status: 400 });
    }

    const serialized = JSON.stringify(body.data);
    if (serialized.length > 7_500_000) {
      return NextResponse.json({ error: "Data DLH terlalu besar. Kurangi ukuran foto yang diunggah.", code: "PAYLOAD_TOO_LARGE" }, { status: 413 });
    }

    const data = JSON.parse(serialized) as Prisma.InputJsonValue;
    const state = await prisma.dlhPortalState.upsert({
      where: { dinas_id: dinas.id },
      create: { dinas_id: dinas.id, data },
      update: { data },
      select: { updatedAt: true },
    });

    const [ownedOfficers, ownedVehicles] = await Promise.all([
      prisma.petugas.findMany({ where: { dinas_id: dinas.id }, select: { id: true } }),
      prisma.kendaraan.findMany({ where: { dinas_id: dinas.id }, select: { id: true } }),
    ]);
    const ownedOfficerIds = new Set(ownedOfficers.map((item) => item.id));
    const ownedVehicleIds = new Set(ownedVehicles.map((item) => item.id));
    const reportUpdates = body.data.reports
      .filter((report) => UUID_PATTERN.test(report.id))
      .map((report) => prisma.laporan.updateMany({
        where: { id: report.id, dinas_id: dinas.id },
        data: {
          status: databaseStatus(report.status),
          petugas_id: report.assignedOfficerId && ownedOfficerIds.has(report.assignedOfficerId) ? report.assignedOfficerId : null,
          kendaraan_id: report.assignedVehicleId && ownedVehicleIds.has(report.assignedVehicleId) ? report.assignedVehicleId : null,
        },
      }));
    await Promise.all(reportUpdates);

    return NextResponse.json({ success: true, updatedAt: state.updatedAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan data DLH";
    return NextResponse.json({ error: message, code: "INTERNAL" }, { status: 500 });
  }
}
