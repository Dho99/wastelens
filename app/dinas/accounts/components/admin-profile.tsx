"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
    CheckCircle2,
    Pencil,
    Save,
    ShieldCheck,
    Truck,
    UserRound,
    X,
    AlertTriangle,
    Loader2,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
    useAdmin,
    useUpdateAdmin,
    useChangePassword,
} from "../../hooks/useAdmin";
import { useReports } from "../../hooks/useReports";
import { useVehicles } from "../../hooks/useVehicles";
import { useSettings } from "../../hooks/useSettings";

export function AdminProfile() {
    const queryClient = useQueryClient();
    const { data: admin, isLoading, isError, refetch } = useAdmin();
    const { data: reportsData } = useReports();
    const { data: vehiclesData } = useVehicles();
    const { data: settings } = useSettings();
    const updateAdmin = useUpdateAdmin();
    const changePassword = useChangePassword();
    const [editOpen, setEditOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [notice, setNotice] = useState("");
    const reports = reportsData ?? [];
    const vehicles = vehiclesData ?? [];
    const completedReports = reports.filter(
        (report) => report.status === "SELESAI",
    ).length;
    const operatingVehicles = vehicles.length;

    if (isLoading) {
        return (
            <div className="flex min-w-0 flex-1 items-center justify-center bg-[#f4fbff]">
                <div className="text-center text-[#087529]">
                    <Loader2 className="mx-auto size-8 animate-spin" />
                    <p className="mt-3 text-sm font-semibold">
                        Memuat profil Dinas...
                    </p>
                </div>
            </div>
        );
    }

    if (isError || !admin) {
        return (
            <div className="flex min-w-0 flex-1 items-center justify-center bg-[#f4fbff] p-6">
                <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <AlertTriangle className="mx-auto size-10 text-red-500" />
                    <h1 className="mt-4 text-lg font-extrabold text-slate-800">
                        Profil Dinas gagal dimuat
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Terjadi kendala saat mengambil data akun. Silakan coba
                        kembali.
                    </p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-5 rounded-full bg-[#087529] px-6 py-2.5 text-sm font-bold text-white"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    const { name, email, image } = admin;

    return (
        <>
            <div className="flex min-w-0 flex-1 flex-col bg-[#f4fbff]">
                <main className="min-h-0 flex-1 overflow-y-auto bg-[#f4fbff] p-4 sm:p-5">
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
                                            src={
                                                image ??
                                                "/images/dlh-field-officer.png"
                                            }
                                            alt={name}
                                            fill
                                            loading="eager"
                                            className="object-cover object-top"
                                            sizes="128px"
                                            unoptimized={Boolean(
                                                image?.startsWith("data:") ||
                                                image?.startsWith(
                                                    "/api/dinas/media/",
                                                ) ||
                                                image?.includes("/svg"),
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-extrabold tracking-[-0.03em]">
                                            {name}
                                        </h2>
                                        <p className="mt-1 text-sm text-[#667169]">
                                            Kepala Bidang Operasional DLH
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
                                        <p className="text-sm text-[#667169]">
                                            Nama Lengkap
                                        </p>
                                        <p className="mt-2 rounded-full border-2 border-[#e0e2df] px-4 py-3 text-sm font-normal">
                                            {name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#667169]">
                                            Email Dinas
                                        </p>
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
                                        <p className="text-sm font-bold">
                                            Kata Sandi
                                        </p>
                                        {/* <p className="text-xs text-[#667169]">
                      Terakhir diubah baru saja
                    </p> */}
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
                                    value={completedReports.toLocaleString(
                                        "id-ID",
                                    )}
                                    label="Laporan Selesai"
                                    trend="Data Aktif"
                                />
                                <StatCard
                                    icon={<Truck />}
                                    tone="amber"
                                    value={operatingVehicles.toLocaleString(
                                        "id-ID",
                                    )}
                                    label="Armada Beroperasi"
                                    trend="Saat Ini"
                                />
                                <div className="rounded-[24px] bg-[#2e8737] p-6 text-white">
                                    <h3 className="text-lg font-medium">
                                        Butuh Bantuan?
                                    </h3>
                                    <p className="mt-3 text-xs leading-5 text-white/85">
                                        Hubungi tim IT DLH jika Anda mengalami
                                        kendala pada akses akun dashboard.
                                    </p>
                                    <a
                                        href={`mailto:${settings?.email ?? ""}`}
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
                        onSubmit={async (event) => {
                            event.preventDefault();
                            const data = new FormData(event.currentTarget);
                            try {
                                await updateAdmin.mutateAsync({
                                    name: String(data.get("name")),
                                });
                                setEditOpen(false);
                                setNotice("Profil dinas berhasil diperbarui.");
                            } catch {
                                setNotice("Gagal memperbarui profil dinas.");
                            }
                        }}
                        className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl"
                    >
                        <div className="flex items-center">
                            <h2 className="text-lg font-extrabold">
                                Edit Profil Dinas
                            </h2>
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
                        onSubmit={async (event) => {
                            event.preventDefault();
                            const data = new FormData(event.currentTarget);
                            if (
                                data.get("newPassword") !==
                                data.get("confirmPassword")
                            ) {
                                setNotice("Konfirmasi kata sandi tidak cocok.");
                                return;
                            }
                            try {
                                await changePassword.mutateAsync({
                                    currentPassword: String(
                                        data.get("currentPassword"),
                                    ),
                                    newPassword: String(
                                        data.get("newPassword"),
                                    ),
                                });
                                queryClient.invalidateQueries({
                                    queryKey: ["dinas-admin"],
                                });
                                setPasswordOpen(false);
                                setNotice("Kata sandi berhasil diperbarui.");
                            } catch {
                                setNotice("Gagal memperbarui kata sandi.");
                            }
                        }}
                        className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl"
                    >
                        <div className="flex items-center">
                            <h2 className="text-lg font-extrabold">
                                Ganti Kata Sandi
                            </h2>
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
        </>
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
        <>
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
        </>
    );
}
