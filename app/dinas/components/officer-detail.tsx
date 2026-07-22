"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  History,
  MapPin,
  Navigation,
  Phone,
  PlusCircle,
  Save,
  ShieldCheck,
  X,
} from "lucide-react";
import { useOfficer } from "../hooks/useOfficers";

export function OfficerDetail({ officerId }: { officerId: string }) {
  const router = useRouter();
  const { data: officer } = useOfficer(officerId);
  const [showAll, setShowAll] = useState(false);
  const [exceptionOpen, setExceptionOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [tracking, setTracking] = useState(false);

  if (!officer) return null;

  const saveException = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setExceptionOpen(false);
    setNotice("Tugas pengecualian berhasil dicatat.");
  };

  const toggleLiveTracking = () => {
    if (tracking) {
      setTracking(false);
      setNotice("Pelacakan langsung dihentikan.");
      return;
    }
    if (!navigator.geolocation) {
      setNotice("Browser tidak mendukung layanan lokasi.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTracking(true);
        setNotice(
          `Lokasi langsung aktif: ${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}.`,
        );
      },
      () =>
        setNotice(
          "Izin lokasi ditolak. Aktifkan izin lokasi browser untuk Track Live.",
        ),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
      <>
      <div className="flex min-w-0 flex-1 flex-col bg-[#f4fbff]">
        <header className="flex h-14 shrink-0 items-center border-b border-[#c7d6cc] px-5 sm:px-6">
          <button
            type="button"
            onClick={() => router.push("/dinas/logistics")}
            className="grid size-9 place-items-center rounded-full hover:bg-white"
            aria-label="Kembali"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="ml-3 text-lg font-extrabold text-[#087529]">
            Detail Petugas
          </h1>
          <Link
            href="/dinas/notifications"
            className="ml-auto rounded-full p-2 hover:bg-white"
            aria-label="Notifikasi"
          >
            <Bell className="size-5" />
          </Link>
          <span className="ml-4 grid size-9 place-items-center rounded-full border border-[#b8c9bd] bg-[#dff1e8] text-xs font-extrabold text-[#087529]">
            AD
          </span>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="mx-auto max-w-[1160px]">
            {notice && (
              <div
                role="status"
                className="mb-4 flex items-center rounded-xl bg-[#daf3e5] px-4 py-2.5 text-sm font-semibold text-[#176a35]"
              >
                {notice}
                <button
                  type="button"
                  onClick={() => setNotice("")}
                  className="ml-auto"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}
            <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_280px]">
              <section className="flex flex-col items-center gap-5 rounded-[22px] border border-[#bdcbbd] bg-white p-6 sm:flex-row">
                <div className="relative size-40 shrink-0 overflow-hidden rounded-2xl bg-slate-200">
                  <Image
                    src={officer.user?.image || "/images/dlh-field-officer.png"}
                    alt={officer.nama}
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="160px"
                    unoptimized={Boolean(officer.user?.image)}
                  />
                  <span className="absolute bottom-2 right-2 grid size-8 place-items-center rounded-full border-2 border-white bg-[#2e8737] text-white">
                    <ShieldCheck className="size-4" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-extrabold">{officer.nama}</h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <a
                      href={`tel:${officer.no_hp.replace(/\s|-/g, "")}`}
                      className="flex items-center gap-3 rounded-[20px] bg-[#e6f4fb] px-5 py-4"
                    >
                      <Phone className="size-5 shrink-0 text-[#087529]" />
                      <div>
                        <p className="text-xs text-[#667169]">Nomor Kontak</p>
                        <p className="text-sm font-bold">{officer.no_hp}</p>
                      </div>
                    </a>
                    <div className="flex items-center gap-3 rounded-[20px] bg-[#e6f4fb] px-5 py-4">
                      <MapPin className="size-5 shrink-0 text-[#087529]" />
                      <div>
                        <p className="text-xs text-[#667169]">Zona Penugasan</p>
                        <p className="text-sm font-bold text-[#956100]">
                          -
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="relative overflow-hidden rounded-[22px] bg-[#2e8737] p-6 text-white">
                <CheckCircle2 className="absolute right-5 top-5 size-7 text-[#baffb6]" />
                <p className="text-6xl font-light leading-none text-[#baffb6]">
                  {officer._count?.laporan ?? 0}
                </p>
                <p className="mt-3 text-sm font-semibold text-white/80">
                  Tugas
                  <br />
                  Diselesaikan
                </p>
              </section>
            </div>

            <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(350px,0.9fr)_minmax(0,1.3fr)]">
              <section className="overflow-hidden rounded-[22px] border border-[#bdcbbd] bg-white">
                <div className="relative h-[270px] bg-[#dfeaed]">
                  <div className="absolute -left-10 top-12 h-6 w-[120%] -rotate-6 bg-white/85" />
                  <div className="absolute left-[25%] -top-10 h-[140%] w-6 rotate-[22deg] bg-white/80" />
                  <div className="absolute inset-[22%_18%] rounded-[30%] bg-[#4cc3b5]/50 ring-2 ring-[#29998e]" />
                  {[
                    [35, 35],
                    [52, 40],
                    [68, 54],
                    [43, 67],
                    [61, 73],
                    [29, 57],
                  ].map(([left, top]) => (
                    <span
                      key={`${left}-${top}`}
                      className="absolute size-3 rounded-full border-2 border-white bg-[#15988c]"
                      style={{ left: `${left}%`, top: `${top}%` }}
                    />
                  ))}
                  <div className="absolute left-4 top-4 rounded-xl bg-white px-4 py-3 shadow-md">
                    <p className="text-xs font-bold">Lokasi Saat Ini</p>
                    <p className="text-sm text-[#667169]">-</p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleLiveTracking}
                    className={`absolute bottom-4 right-4 flex h-10 items-center gap-2 rounded-xl px-5 text-xs font-bold text-white shadow-md ${tracking ? "bg-red-600" : "bg-[#087529]"}`}
                  >
                    <Navigation className="size-4" />
                    {tracking ? "Hentikan" : "Track Live"}
                  </button>
                </div>
              </section>

              <section className="rounded-[22px] border border-[#bdcbbd] bg-white p-5">
                <div className="flex items-center">
                  <h2 className="flex items-center gap-2 text-lg font-extrabold">
                    <History className="size-5 text-[#087529]" />
                    Tugas Baru Diselesaikan
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowAll((value) => !value)}
                    className="ml-auto text-xs font-bold text-[#087529]"
                  >
                    {showAll ? "Ringkas" : "Lihat Semua"}
                  </button>
                </div>
                <p className="mt-5 text-sm text-[#667169]">Belum ada tugas.</p>
                <button
                  type="button"
                  onClick={() => setExceptionOpen(true)}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[18px] border-2 border-dashed border-[#bdcbbd] text-sm font-bold text-[#536159] hover:bg-[#f4faf7]"
                >
                  <PlusCircle className="size-5" />
                  Catat Tugas Pengecualian Manual
                </button>
              </section>
            </div>
          </div>
        </main>
      </div>

      {exceptionOpen && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <form
            onSubmit={saveException}
            className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center">
              <h2 className="text-lg font-extrabold">
                Catat Tugas Pengecualian
              </h2>
              <button
                type="button"
                onClick={() => setExceptionOpen(false)}
                className="ml-auto rounded-full p-2"
              >
                <X className="size-5" />
              </button>
            </div>
            <label className="mt-5 block text-sm font-semibold">
              Lokasi Tugas
              <input
                name="place"
                required
                placeholder="Masukkan lokasi"
                className="mt-1.5 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Catatan
              <textarea
                name="note"
                required
                rows={3}
                placeholder="Jelaskan tugas yang dilakukan..."
                className="mt-1.5 w-full resize-none rounded-xl border p-4 font-normal outline-none focus:border-[#087529]"
              />
            </label>
            <button
              type="submit"
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#087529] text-sm font-bold text-white"
            >
              <Save className="size-4" />
              Simpan Tugas
            </button>
          </form>
        </div>
      )}
      </>
  );
}
