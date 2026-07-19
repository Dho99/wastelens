"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardList,
  MapPin,
  Medal,
  Save,
  ShieldCheck,
  X,
} from "lucide-react";
import { updateDlhStore, useDlhStore } from "@/lib/dlh-store";

const inputClass =
  "mt-1.5 h-11 w-full rounded-full border-2 border-[#bdcbbd] bg-[#f5fbfe] px-4 text-sm font-normal outline-none focus:border-[#087529]";

export function EditOfficerProfile({ officerId }: { officerId: string }) {
  const router = useRouter();
  const store = useDlhStore();
  const officer =
    store.officers.find((item) => item.id === officerId) ?? store.officers[0];
  const [shift, setShift] = useState(officer.shift);
  const [mobileAccess, setMobileAccess] = useState(officer.mobileAccess);
  const [tracking, setTracking] = useState(officer.tracking);
  const [saved, setSaved] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    updateDlhStore((draft) => {
      const target = draft.officers.find((item) => item.id === officerId);
      if (!target) return;
      target.name = String(data.get("name"));
      target.initials = target.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      target.phone = String(data.get("phone"));
      target.email = String(data.get("email"));
      target.zone = String(data.get("zone"));
      target.shift = shift;
      target.mobileAccess = mobileAccess;
      target.tracking = tracking;
    });
    setSaved(true);
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
            Edit Petugas Lapangan
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
          <form onSubmit={submit} className="mx-auto max-w-[1160px]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold text-[#526158]">
                  Manajemen Petugas / Edit Profile
                </p>
                <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] sm:text-2xl">
                  {officerId} • {officer.name}
                </h2>
              </div>
              <span className="flex w-fit items-center gap-2 rounded-full border border-[#bcebd1] bg-[#e6f7ee] px-4 py-1.5 text-xs font-bold text-[#47705b] sm:ml-auto">
                <ShieldCheck className="size-4" />
                Status: Aktif
              </span>
            </div>

            <div className="mt-5 grid items-start gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
              <aside className="space-y-4">
                <section className="rounded-[22px] border border-[#bdcbbd] bg-white p-5 text-center">
                  <div className="mx-auto grid size-28 place-items-center rounded-full border-4 border-[#edf5f8] bg-gradient-to-br from-[#bcebd1] to-[#5da976] text-3xl font-extrabold text-white shadow-md">
                    {officer.initials}
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold">
                    {officer.name}
                  </h3>
                  <p className="text-sm font-semibold text-[#667169]">
                    Senior Field Officer
                  </p>
                  <div className="mt-5 space-y-2 text-left">
                    <ProfileStat
                      icon={<CalendarDays />}
                      label="Bergabung Sejak"
                      value="12 Januari 2021"
                    />
                    <ProfileStat
                      icon={<Medal />}
                      label="Performa"
                      value="98.4% On-Time"
                    />
                  </div>
                </section>
                <section className="rounded-[22px] border border-[#bdcbbd] bg-white p-5">
                  <h3 className="border-b border-[#bdcbbd] pb-2 text-sm font-extrabold">
                    Akses Sistem
                  </h3>
                  <Toggle
                    label="Mobile App Access"
                    active={mobileAccess}
                    onClick={() => setMobileAccess((value) => !value)}
                  />
                  <Toggle
                    label="Real-time Tracking"
                    active={tracking}
                    onClick={() => setTracking((value) => !value)}
                  />
                </section>
              </aside>

              <div className="space-y-4">
                <section className="rounded-[22px] border border-[#bdcbbd] bg-white p-5">
                  <h3 className="flex items-center gap-2 text-lg font-extrabold text-[#087529]">
                    <ClipboardList className="size-5" />
                    Informasi Personal
                  </h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-semibold">
                      Nama Lengkap
                      <input
                        name="name"
                        required
                        defaultValue={officer.name}
                        className={inputClass}
                      />
                    </label>
                    <label className="text-sm font-semibold">
                      ID Petugas
                      <input
                        name="id"
                        readOnly
                        value={officerId}
                        className={`${inputClass} bg-[#e1edf4] text-[#667169]`}
                      />
                    </label>
                    <label className="text-sm font-semibold">
                      Nomor Telepon
                      <input
                        name="phone"
                        type="tel"
                        required
                        defaultValue={officer.phone}
                        className={inputClass}
                      />
                    </label>
                    <label className="text-sm font-semibold">
                      Email Kerja
                      <input
                        name="email"
                        type="email"
                        required
                        defaultValue={officer.email}
                        className={inputClass}
                      />
                    </label>
                  </div>
                </section>

                <section className="rounded-[22px] border border-[#bdcbbd] bg-white p-5">
                  <h3 className="flex items-center gap-2 text-lg font-extrabold text-[#087529]">
                    <MapPin className="size-5" />
                    Penugasan Wilayah
                  </h3>
                  <div className="mt-4 grid gap-5 md:grid-cols-[1fr_0.9fr]">
                    <div>
                      <label className="text-sm font-semibold">
                        Zona Penugasan
                        <span className="relative block">
                          <select
                            name="zone"
                            defaultValue={officer.zone}
                            className={`${inputClass} appearance-none pr-11`}
                          >
                            <option>Zone A - Menteng</option>
                            <option>Zone B - Gambir</option>
                            <option>Zone C - Tebet</option>
                            <option>Zone D - Senen</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-[18px] size-4 text-[#667169]" />
                        </span>
                      </label>
                      <fieldset className="mt-4">
                        <legend className="text-sm font-semibold">
                          Shift Kerja
                        </legend>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {["Pagi", "Siang", "Malam"].map((item) => (
                            <button
                              type="button"
                              key={item}
                              onClick={() => setShift(item)}
                              className={`h-10 rounded-full border-2 text-xs font-semibold ${shift === item ? "border-[#087529] bg-[#2e8737] text-white" : "border-[#bdcbbd]"}`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                        <input type="hidden" name="shift" value={shift} />
                      </fieldset>
                    </div>
                    <AreaMap />
                  </div>
                </section>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => router.push("/dinas/logistics")}
                    className="flex h-11 items-center justify-center gap-2 rounded-full border-2 border-red-600 px-8 text-sm font-extrabold text-red-600 hover:bg-red-50"
                  >
                    <X className="size-4" />
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#087529] px-10 text-sm font-extrabold text-white hover:bg-[#066421]"
                  >
                    <Save className="size-4" />
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>
          </form>
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
              Profil berhasil diperbarui
            </h2>
            <p className="mt-2 text-sm text-[#667169]">
              Perubahan data petugas telah disimpan.
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

function ProfileStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
      <>
    <div className="flex items-center gap-3 rounded-2xl bg-[#e5f3fa] px-4 py-3">
      <span className="text-[#087529] [&_svg]:size-4">{icon}</span>
      <div>
        <p className="text-[10px] font-bold uppercase text-[#667169]">
          {label}
        </p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
      </>
  );
}

function Toggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
      <>
    <div className="mt-3 flex items-center text-sm font-medium">
      <span>{label}</span>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`relative ml-auto h-6 w-11 rounded-full transition ${active ? "bg-[#087529]" : "bg-slate-300"}`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white transition ${active ? "left-6" : "left-1"}`}
        />
      </button>
    </div>
      </>
  );
}

function AreaMap() {
  return (
      <>
    <div className="relative min-h-[150px] overflow-hidden rounded-[20px] border border-[#bdcbbd] bg-[#dfeaed]">
      <div className="absolute -left-6 top-10 h-5 w-[120%] -rotate-6 bg-white/80" />
      <div className="absolute left-[30%] -top-5 h-[130%] w-5 rotate-[24deg] bg-white/75" />
      <div className="absolute inset-[28%_18%] rounded-[35%] bg-[#75aa7b]/55" />
      <span className="absolute right-3 top-3 rounded-full bg-[#087529] px-3 py-1 text-[10px] font-extrabold text-white">
        LOKASI AKTIF
      </span>
      <div className="absolute inset-x-0 bottom-0 bg-slate-800/55 px-4 py-3 text-white">
        <p className="text-[10px] font-bold uppercase tracking-wide">
          Visualisasi Area
        </p>
        <p className="text-sm font-extrabold">Menteng, Jakarta Pusat</p>
      </div>
    </div>
      </>
  );
}
