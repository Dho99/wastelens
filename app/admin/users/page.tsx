"use client";

import { useState } from "react";
import {
    Search,
    HelpCircle,
    ShieldAlert,
    Loader2,
    Plus,
    UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { User, Pagination } from "../types/users";
import { useUsers, useUpdateUserStatus } from "../hooks/useUsers";

const ROLE_LABELS: Record<string, string> = {
    user: "Warga",
    petugas: "Petugas",
    kopdes: "Kopdes",
    dinas: "Dinas",
    admin: "Admin",
};

export default function AdminUsersPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [roleFilter, setRoleFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isLoading } = useUsers(page, roleFilter);
    const { mutateAsync: updateStatus, isPending: updating } =
        useUpdateUserStatus();

    const users = data?.items ?? [];
    const pagination = data?.pagination as Pagination | undefined;

    const [blockUser, setBlockUser] = useState<User | null>(null);
    const [blockReason, setBlockReason] = useState("");

    async function handleActivate(u: User) {
        try {
            await updateStatus({ id: u.id, status: "active" });
            toast.success("Akun berhasil diaktifkan");
        } catch {
            toast.error("Gagal mengaktifkan akun");
        }
    }

    async function handleDeactivateSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!blockUser) return;
        try {
            await updateStatus({
                id: blockUser.id,
                status: "nonaktif",
                alasan: blockReason,
            });
            toast.success("Akun berhasil dinonaktifkan");
            setBlockUser(null);
            setBlockReason("");
        } catch {
            toast.error("Gagal menonaktifkan akun");
        }
    }

    const filteredUsers = users.filter((u) => {
        const term = searchQuery.toLowerCase();
        return (
            u.nama.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term) ||
            u.id.includes(term)
        );
    });

    const activeUsersCount = users.filter((u) => u.status === "active").length;

    return (
        <div className="bg-[#FAF9F5] min-h-screen p-8 text-neutral-850 select-none pb-24 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200/60 pb-5 mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-805 tracking-tight">
                        Kelola User
                    </h1>
                    <p className="text-xs text-gray-500 font-semibold mt-1">
                        Monitor dan kelola status akun seluruh pengguna platform
                        WasteLens.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari ID atau Nama..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38] shadow-sm w-44 md:w-56"
                        />
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer shadow-sm">
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2A2 2 0 0 0 10 4V4.29C7.12 5.14 5 7.82 5 11V17L3 19V20H21V19L19 17V11C19 7.82 16.88 5.14 14 4.29V4A2 2 0 0 0 12 2M12 22A2 2 0 0 0 14 20H10A2 2 0 0 0 12 22Z" />
                        </svg>
                    </div>
                    <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="space-y-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                        Filter Berdasarkan Role
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                        {[
                            { value: "", label: "Semua User" },
                            { value: "user", label: "Warga" },
                            { value: "petugas", label: "Petugas" },
                            { value: "kopdes", label: "Kopdes" },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => {
                                    setRoleFilter(tab.value);
                                    setPage(1);
                                }}
                                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition border ${
                                    roleFilter === tab.value
                                        ? "bg-[#1E7D38] border-[#1E7D38] text-white shadow-sm"
                                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-150"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl px-3 py-5 shadow-sm flex items-center gap-3 pr-6 pl-4 self-start sm:self-center w-full max-w-xs">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#1E7D38] flex items-center justify-center">
                        <UserIcon className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
                            Aktif
                        </span>
                        <span className="text-sm font-black text-gray-800">
                            {pagination?.total || activeUsersCount}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm mb-6 min-h-[300px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 text-[#1E7D38] animate-spin" />
                        <p className="text-xs text-gray-400 font-bold">
                            Memuat daftar pengguna...
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead>
                                    <tr className="text-gray-400 uppercase font-black tracking-wider border-b border-gray-100/80">
                                        <th className="pb-3 pt-1">User ID</th>
                                        <th className="pb-3 pt-1">
                                            Nama Pengguna
                                        </th>
                                        <th className="pb-3 pt-1">Role</th>
                                        <th className="pb-3 pt-1">Status</th>
                                        <th className="pb-3 pt-1 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="py-10 text-center text-gray-400 font-bold"
                                            >
                                                Tidak ada data pengguna
                                                ditemukan
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((u) => (
                                            <tr
                                                key={u.id}
                                                className="border-b border-gray-100/50 hover:bg-gray-50/50 transition"
                                            >
                                                <td className="py-3.5 font-mono text-gray-500 font-bold">
                                                    #WL-
                                                    {u.id
                                                        .slice(0, 5)
                                                        .toUpperCase()}
                                                </td>
                                                <td className="py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[#EBEFFB] text-indigo-600 flex items-center justify-center font-bold">
                                                            {u.nama
                                                                .slice(0, 2)
                                                                .toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-gray-805">
                                                                {u.nama}
                                                            </div>
                                                            <div className="text-[10px] text-gray-400 font-semibold">
                                                                {u.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 font-semibold text-gray-500">
                                                    {ROLE_LABELS[u.role] ??
                                                        u.role}
                                                </td>
                                                <td className="py-3.5">
                                                    {u.status === "active" ? (
                                                        <span className="inline-flex items-center gap-1.5 text-[#287A38] font-bold">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#287A38]" />{" "}
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-gray-400 font-bold">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />{" "}
                                                            Nonaktif
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 text-right">
                                                    {u.status === "active" ? (
                                                        <button
                                                            onClick={() => {
                                                                setBlockUser(u);
                                                                setBlockReason(
                                                                    "",
                                                                );
                                                            }}
                                                            className="px-4 py-1.5 text-[10px] bg-red-50 text-red-600 border border-red-100 rounded-lg font-black hover:bg-red-100 transition"
                                                        >
                                                            Blokir
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleActivate(
                                                                    u,
                                                                )
                                                            }
                                                            disabled={updating}
                                                            className="px-4 py-1.5 text-[10px] bg-[#1E7D38] text-white rounded-lg font-black hover:bg-[#18652d] transition"
                                                        >
                                                            Aktivasi
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex justify-between items-center mt-5 pt-3 border-t border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400">
                                    Menampilkan 5 dari {pagination.total} user
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage((p) => p - 1)}
                                        className="w-8 h-8 rounded-lg border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition"
                                    >
                                        ‹
                                    </button>
                                    {Array.from(
                                        { length: pagination.totalPages },
                                        (_, i) => i + 1,
                                    ).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-8 h-8 rounded-lg font-black text-xs transition border ${
                                                p === page
                                                    ? "bg-[#1E7D38] border-[#1E7D38] text-white shadow-sm"
                                                    : "bg-white border-gray-150 text-gray-400 hover:bg-gray-50"
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        disabled={
                                            page === pagination.totalPages
                                        }
                                        onClick={() => setPage((p) => p + 1)}
                                        className="w-8 h-8 rounded-lg border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition"
                                    >
                                        ›
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={() => router.push("/admin/users/add")}
                className="fixed bottom-6 right-6 w-14 h-14 bg-[#1E7D38] hover:bg-[#18652d] active:scale-95 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 z-40"
                title="Tambah User Baru"
            >
                <Plus className="w-7 h-7" />
            </button>

            {blockUser && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <form
                        onSubmit={handleDeactivateSubmit}
                        className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100 space-y-5 text-left"
                    >
                        <div className="flex items-start gap-3.5 bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
                            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-black text-gray-805">
                                    Nonaktifkan Akun?
                                </h4>
                                <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                                    Tindakan ini akan membatasi akses{" "}
                                    <strong>{blockUser.nama}</strong> ke seluruh
                                    layanan WasteLens secara permanen hingga
                                    diaktifkan kembali.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                                Alasan Pemblokiran
                            </label>
                            <textarea
                                required
                                rows={3}
                                value={blockReason}
                                onChange={(e) => setBlockReason(e.target.value)}
                                placeholder="Contoh: Melanggar ketentuan penggunaan, penyalahgunaan sistem laporan..."
                                className="w-full bg-[#FAF9F5] border border-gray-150 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none h-24"
                            />
                            <span className="text-[9.5px] text-gray-400 font-bold flex items-center gap-1">
                                <svg
                                    className="w-3.5 h-3.5 fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M11 9H13V7H11V9M12 2C6.47 2 2 6.47 2 12S6.47 22 12 22 22 17.53 12 12 17.53 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M11 17H13V11H11V17Z" />
                                </svg>
                                Alasan ini akan dicatat dalam log sistem audit.
                            </span>
                        </div>

                        <div className="flex justify-end gap-2.5 pt-1">
                            <button
                                type="button"
                                onClick={() => setBlockUser(null)}
                                className="px-5 py-3 hover:bg-gray-100 text-gray-500 rounded-xl text-xs font-black transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={updating}
                                className="px-5 py-3 bg-[#E31E53] hover:bg-[#c11340] text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm"
                            >
                                {updating && (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                )}
                                Konfirmasi Blokir
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
