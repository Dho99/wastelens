"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Pencil,
  Save,
  ShieldCheck,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { DlhShell } from "./dlh-shell";
import { updateDlhStore, useDlhStore } from "@/lib/dlh-store";

export function AdminProfile() {
  const store = useDlhStore();
  const { name, email, passwordUpdatedAt } = store.admin;
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const completedReports = store.reports.filter(
    (report) => report.status === "Selesai",
  ).length;
  const operatingVehicles = store.vehicles.filter(
    (vehicle) => vehicle.status === "Beroperasi",
  ).length;

  return (
    <DlhShell hideHeader>
      <div className="flex min-w-0 flex-1 flex-col bg-[#f4fbff]">
        <header className="flex h-14 shrink-0 items-center border-b border-[#c7d6cc] px-5 sm:px-6">
          <h1 className="text-xl font-extrabold text-[#087529]">
            Profil Admin
          </h1>
          <Link
            href="/dinas/notifications"
            className="ml-auto rounded-full p-2 hover:bg-white"
            aria-label="Notifikasi"
          >
            <Bell className="size-5" />
          </Link>
          <span className="relative ml-4 size-9 overflow-hidden rounded-full border-2 border-[#087529]">
            <Image
              src={store.admin.photo ?? "/images/dlh-field-officer.png"}
              alt="Admin DLH"
              fill
              className="object-cover object-top"
              sizes="36px"
            />
          </span>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto bg-white p-4 sm:p-5">
          <div className="mx-auto grid max-w-[1220px] items-start gap-5 lg:grid-cols-[minmax(0,2.4fr)_330px]">
            <div className="space-y-5">
              {notice && (
                <div
                  role="status"
                  className="flex items-center rounded-xl bg-[#daf3e5] px-4 py-2.5 text-sm font-semibold text-[#176a35]"
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

              <section className="relative overflow-hidden rounded-[24px] border border-[#d4ded7] bg-white p-6 shadow-sm">
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-white to-[#e8f1ea]" />
                <div className="relative flex flex-col items-center gap-5 sm:flex-row">
                  <div className="relative size-32 shrink-0 overflow-hidden rounded-full border-4 border-white bg-[#e2eff6] shadow-md">
                    <Image
                      src={store.admin.photo ?? "/images/dlh-field-officer.png"}
                      alt={name}
                      fill
                      priority
                      className="object-cover object-top"
                      sizes="128px"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-[-0.03em]">
                      {name}
                    </h2>
                    <p className="mt-1 text-sm text-[#667169]">
                      {store.admin.position ?? "Kepala Bidang Operasional"} DLH
                    </p>
                    <Link
                      href="/dinas/accounts/edit"
                      className="mt-4 flex h-10 w-fit items-center gap-2 rounded-full bg-[#2e8737] px-6 text-sm font-semibold text-white"
                    >
                      <Pencil className="size-4" />
                      Edit Profil
                    </Link>
                  </div>
                </div>
              </section>

              <section className="rounded-[24px] border border-[#d4ded7] bg-white p-6 shadow-sm">
                <h2 className="flex items-center gap-2 border-b border-[#bdcbbd] pb-3 text-lg font-extrabold">
                  <UserRound className="size-5 text-[#087529]" />
                  Informasi Pribadi
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-[#667169]">Nama Lengkap</p>
                    <p className="mt-2 rounded-full border-2 border-[#e0e2df] px-4 py-3 text-sm font-normal">
                      {name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#667169]">Email Dinas</p>
                    <p className="mt-2 rounded-full border-2 border-[#e0e2df] px-4 py-3 text-sm font-normal">
                      {email}
                    </p>
                  </div>
                </div>
              </section>

              <section
                id="security"
                className="rounded-[24px] border border-[#d4ded7] bg-white p-6 shadow-sm"
              >
                <h2 className="flex items-center gap-2 border-b border-[#bdcbbd] pb-3 text-lg font-extrabold">
                  <ShieldCheck className="size-5 text-[#087529]" />
                  Keamanan Akun
                </h2>
                <div className="mt-5 flex flex-col gap-4 rounded-[20px] bg-[#e6f4fb] px-5 py-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-bold">Kata Sandi</p>
                    <p className="text-xs text-[#667169]">
                      Terakhir diubah {passwordUpdatedAt}
                    </p>
                  </div>
                  <Link
                    href="/dinas/accounts/password"
                    className="flex h-10 items-center justify-center rounded-full border-2 border-[#087529] px-6 text-sm font-semibold text-[#087529] sm:ml-auto"
                  >
                    Ganti Kata Sandi
                  </Link>
                </div>
              </section>
            </div>

            <aside>
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-[#667169]">
                Aktivitas Stats
              </h2>
              <div className="space-y-4">
                <StatCard
                  icon={<CheckCircle2 />}
                  tone="green"
                  value={completedReports.toLocaleString("id-ID")}
                  label="Laporan Selesai"
                  trend="Data Aktif"
                />
                <StatCard
                  icon={<Truck />}
                  tone="amber"
                  value={operatingVehicles.toLocaleString("id-ID")}
                  label="Armada Beroperasi"
                  trend="Saat Ini"
                />
                <div className="rounded-[24px] bg-[#2e8737] p-6 text-white">
                  <h3 className="text-lg font-medium">Butuh Bantuan?</h3>
                  <p className="mt-3 text-xs leading-5 text-white/85">
                    Hubungi tim IT DLH jika Anda mengalami kendala pada akses
                    akun dashboard.
                  </p>
                  <a
                    href={`mailto:${store.settings.email}`}
                    className="mt-5 flex h-11 items-center justify-center rounded-full bg-white text-sm font-bold text-[#087529]"
                  >
                    Hubungi Support
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              updateDlhStore((draft) => {
                draft.admin.name = String(data.get("name"));
                draft.admin.email = String(data.get("email"));
              });
              setEditOpen(false);
              setNotice("Profil admin berhasil diperbarui.");
            }}
            className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center">
              <h2 className="text-lg font-extrabold">Edit Profil Admin</h2>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="ml-auto rounded-full p-2"
              >
                <X className="size-5" />
              </button>
            </div>
            <label className="mt-5 block text-sm font-semibold">
              Nama Lengkap
              <input
                name="name"
                required
                defaultValue={name}
                className="mt-1.5 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Email Dinas
              <input
                name="email"
                type="email"
                required
                defaultValue={email}
                className="mt-1.5 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]"
              />
            </label>
            <button
              type="submit"
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#087529] text-sm font-bold text-white"
            >
              <Save className="size-4" />
              Simpan Profil
            </button>
          </form>
        </div>
      )}

      {passwordOpen && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              if (data.get("newPassword") !== data.get("confirmPassword")) {
                setNotice("Konfirmasi kata sandi tidak cocok.");
                return;
              }
              updateDlhStore((draft) => {
                draft.admin.passwordUpdatedAt = "baru saja";
              });
              setPasswordOpen(false);
              setNotice("Kata sandi berhasil diperbarui pada profil lokal.");
            }}
            className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center">
              <h2 className="text-lg font-extrabold">Ganti Kata Sandi</h2>
              <button
                type="button"
                onClick={() => setPasswordOpen(false)}
                className="ml-auto rounded-full p-2"
              >
                <X className="size-5" />
              </button>
            </div>
            <label className="mt-5 block text-sm font-semibold">
              Kata Sandi Saat Ini
              <input
                name="currentPassword"
                type="password"
                required
                minLength={8}
                className="mt-1.5 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Kata Sandi Baru
              <input
                name="newPassword"
                type="password"
                required
                minLength={8}
                className="mt-1.5 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Konfirmasi Kata Sandi
              <input
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                className="mt-1.5 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]"
              />
            </label>
            <button
              type="submit"
              className="mt-6 h-11 w-full rounded-xl bg-[#087529] text-sm font-bold text-white"
            >
              Perbarui Kata Sandi
            </button>
          </form>
        </div>
      )}
    </DlhShell>
  );
}

function StatCard({
  icon,
  tone,
  value,
  label,
  trend,
}: {
  icon: React.ReactNode;
  tone: "green" | "amber";
  value: string;
  label: string;
  trend: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#d4ded7] bg-white p-5 shadow-sm">
      <div className="flex items-start">
        <span
          className={`grid size-11 place-items-center rounded-xl [&_svg]:size-5 ${tone === "green" ? "bg-[#bcebd1] text-[#47705b]" : "bg-[#ffd9ae] text-[#795000]"}`}
        >
          {icon}
        </span>
        <span
          className={`ml-auto text-xs font-bold ${tone === "green" ? "text-[#087529]" : "text-[#956100]"}`}
        >
          {trend}
        </span>
      </div>
      <p className="mt-4 text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-sm text-[#667169]">{label}</p>
    </div>
  );
}
