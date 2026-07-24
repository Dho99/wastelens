"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  CirclePause,
  CircleX,
  ClipboardList,
  Hourglass,
  Info,
  Save,
  Truck,
  Wrench,
} from "lucide-react";
import { useVehicles, useCreateVehicle } from "../../../../hooks/useVehicles";

type OperationalStatus = "Beroperasi" | "Maintenance" | "Standby";

const fieldClass =
  "mt-1.5 h-11 w-full rounded-full bg-[#e6f4fb] px-4 text-sm outline-none placeholder:text-[#89949c] focus:ring-2 focus:ring-[#087529]/30";

export function AddVehicleForm() {
  const router = useRouter();
  const { data: vehicles } = useVehicles();
  const createVehicle = useCreateVehicle();
  const [status, setStatus] = useState<OperationalStatus>("Beroperasi");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const id = String(data.get("id")).toUpperCase();
    if (vehicles?.some((vehicle) => vehicle.id === id)) {
      setError(`ID ${id} sudah digunakan.`);
      return;
    }
    try {
      await createVehicle.mutateAsync({
        jenis: String(data.get("plate")).toUpperCase(),
        kapasitas: Math.round(Number(data.get("capacity")) * 1000),
      });
      setSaved(true);
    } catch {
      setError("Gagal menyimpan armada.");
    }
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
            <ArrowLeft className="size-6" />
          </button>
          <Link
            href="/dinas/notifications"
            className="ml-auto rounded-full p-2 hover:bg-white"
            aria-label="Notifikasi"
          >
            <Bell className="size-5" />
          </Link>
          <span className="ml-5 grid size-9 place-items-center rounded-full border border-[#b8c9bd] bg-[#dff1e8] text-xs font-extrabold text-[#087529]">
            AD
          </span>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#526158]">
                  <span>Armada</span>
                  <span>›</span>
                  <span className="font-extrabold text-[#087529]">
                    Tambah Armada Baru
                  </span>
                </div>
                <h1 className="mt-2 text-xl font-extrabold tracking-[-0.03em] sm:text-2xl">
                  Pendaftaran Unit Armada
                </h1>
              </div>
              <span className="w-fit rounded-full bg-[#9cf29b] px-4 py-1.5 text-xs font-extrabold sm:ml-auto">
                Status: Penambahan Baru
              </span>
            </div>

            <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,2.05fr)_minmax(280px,1fr)]">
              <form
                onSubmit={submit}
                className="rounded-[22px] border border-[#b9cabc] bg-white p-5 shadow-sm"
              >
                {error && (
                  <p
                    role="alert"
                    className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600"
                  >
                    {error}
                  </p>
                )}
                <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
                  <label className="text-sm font-extrabold text-[#4d5b52]">
                    Vehicle Name / ID
                    <span className="relative block">
                      <input
                        name="id"
                        required
                        pattern="ARM-[0-9]{3}"
                        title="Gunakan format ARM-XXX, contoh ARM-003"
                        placeholder="Contoh: ARM-003"
                        className={`${fieldClass} pr-12`}
                      />
                      <ClipboardList className="pointer-events-none absolute right-4 top-[19px] size-4 text-[#94a39a]" />
                    </span>
                  </label>
                  <label className="text-sm font-extrabold text-[#4d5b52]">
                    Plat Nomor
                    <span className="relative block">
                      <input
                        name="plate"
                        required
                        placeholder="B 1234 XXX"
                        className={`${fieldClass} pr-12 uppercase`}
                      />
                      <Truck className="pointer-events-none absolute right-4 top-[19px] size-4 text-[#94a39a]" />
                    </span>
                  </label>
                  <label className="text-sm font-extrabold text-[#4d5b52]">
                    Tipe Kendaraan
                    <span className="relative block">
                      <select
                        name="type"
                        defaultValue="Compactor"
                        className={`${fieldClass} appearance-none pr-12`}
                      >
                        <option>Compactor</option>
                        <option>Dump Truck</option>
                        <option>Arm Roll</option>
                        <option>Pick Up</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-[19px] size-4 text-[#65736a]" />
                    </span>
                  </label>
                  <label className="text-sm font-extrabold text-[#4d5b52]">
                    Kapasitas Maksimal (Ton)
                    <span className="relative block">
                      <input
                        name="capacity"
                        type="number"
                        min="0.5"
                        step="0.5"
                        required
                        placeholder="0.0"
                        className={`${fieldClass} pr-12`}
                      />
                      <Hourglass className="pointer-events-none absolute right-4 top-[19px] size-4 text-[#94a39a]" />
                    </span>
                  </label>
                </div>

                <fieldset className="mt-5">
                  <legend className="text-sm font-extrabold text-[#4d5b52]">
                    Status Operasional Awal
                  </legend>
                  <div className="mt-2 grid gap-3 md:grid-cols-3">
                    {(["Beroperasi", "Maintenance", "Standby"] as const).map(
                      (item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => setStatus(item)}
                          className={`flex h-11 items-center justify-center gap-2 rounded-2xl border-2 text-xs font-extrabold transition ${status === item ? "border-[#087529] bg-[#2e8737] text-white" : "border-[#bdcbbd] bg-white hover:bg-[#f2f9f5]"}`}
                        >
                          {item === "Beroperasi" ? (
                            <Check className="size-4" />
                          ) : item === "Maintenance" ? (
                            <Wrench className="size-4" />
                          ) : (
                            <CirclePause className="size-4" />
                          )}
                          {item}
                        </button>
                      ),
                    )}
                  </div>
                  <input type="hidden" name="status" value={status} />
                </fieldset>

                <div className="mt-6 flex flex-col gap-3 border-t border-[#bdcbbd] pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => router.push("/dinas/logistics")}
                    className="flex h-10 items-center justify-center gap-2 rounded-full border-2 border-red-600 px-7 text-xs font-extrabold text-red-600 hover:bg-red-50"
                  >
                    <CircleX className="size-4" />
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#087529] px-8 text-xs font-extrabold text-white hover:bg-[#066421]"
                  >
                    <Save className="size-4" />
                    Simpan Armada
                  </button>
                </div>
              </form>

              <aside className="space-y-3">
                <div className="relative h-[145px] overflow-hidden rounded-[20px] bg-slate-300">
                  <Image
                    src="/images/bg.jpg"
                    alt="Area operasional armada DLH"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 100vw, 360px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                  <p className="absolute bottom-3 left-4 right-4 text-xs font-medium text-white">
                    Pastikan data yang diinput sesuai dengan STNK Kendaraan.
                  </p>
                </div>
                <InfoCard
                  icon={<Info />}
                  color="bg-[#bcebd1] text-[#47705b]"
                  title="Penamaan ID"
                >
                  Gunakan format standar DLH (e.g., ARM-XXX) untuk kemudahan
                  filter pada dashboard peta.
                </InfoCard>
                <InfoCard
                  icon={<Hourglass />}
                  color="bg-[#b87800] text-white"
                  title="Kapasitas Maksimal"
                >
                  Input kapasitas akan mempengaruhi kalkulasi efisiensi rute
                  harian secara otomatis.
                </InfoCard>
                <div className="rounded-[20px] bg-[#2e8737] p-4 text-white shadow-lg">
                  <h2 className="text-sm font-extrabold">Bantuan Operator</h2>
                  <p className="mt-2 text-xs leading-5 text-white/85">
                    Kesulitan saat mendaftarkan armada baru? Hubungi pusat
                    dukungan teknis DLH.
                  </p>
                  <a
                    href="mailto:support@dlh.go.id"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-bold hover:bg-white/30"
                  >
                    Hubungi IT Support <ArrowRight className="size-3.5" />
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>

      {saved && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            className="w-full max-w-[380px] rounded-[24px] bg-white p-7 text-center shadow-2xl"
          >
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#d8f3e4] text-[#087529]">
              <Check className="size-8" strokeWidth={3} />
            </span>
            <h2 className="mt-5 text-lg font-extrabold">
              Armada berhasil disimpan
            </h2>
            <p className="mt-2 text-sm text-[#667169]">
              Unit armada baru telah ditambahkan ke sistem operasional.
            </p>
            <button
              type="button"
              onClick={() => router.push("/dinas/logistics")}
              className="mt-6 h-11 w-full rounded-xl bg-[#087529] text-sm font-bold text-white"
            >
              Kembali ke Kelola Logistik
            </button>
          </section>
        </div>
      )}
      </>
  );
}

function InfoCard({
  icon,
  color,
  title,
  children,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
      <>
    <div className="flex gap-3 rounded-[20px] border border-[#bdcbbd] bg-white p-3.5">
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-xl [&_svg]:size-4 ${color}`}
      >
        {icon}
      </span>
      <div>
        <h2 className="text-xs font-extrabold">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-[#667169]">{children}</p>
      </div>
    </div>
      </>
  );
}
