"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, HelpCircle, ShieldAlert, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ROLE_LABELS: Record<string, string> = {
  user: "Warga",
  petugas: "Petugas",
  kopdes: "Kopdes",
  dinas: "Dinas",
  admin: "Admin",
};

type User = {
  id: string;
  nama: string;
  email: string;
  role: string;
  status: string;
  saldo_koin: number;
  createdAt: string;
};

type Pagination = { page: number; limit: number; total: number; totalPages: number };

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [blockUser, setBlockUser] = useState<User | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "5" });
      if (roleFilter) params.set("role", roleFilter);
      if (searchQuery) params.set("search", searchQuery); // support API search if available
      const res = await fetch(`/api/admin/users?${params}`);
      const json = await res.json();
      setUsers(json.data ?? []);
      setPagination(json.pagination ?? null);
    } catch {
      toast.error("Gagal memuat daftar pengguna");
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, searchQuery]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        fetchUsers();
      }
    });
    return () => {
      active = false;
    };
  }, [fetchUsers]);

  // Activate action
  async function handleActivate(u: User) {
    try {
      const res = await fetch(`/api/admin/users/${u.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      });
      if (res.ok) {
        toast.success("Akun berhasil diaktifkan");
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Gagal mengaktifkan akun");
      }
    } catch {
      toast.error("Kesalahan jaringan");
    }
  }

  // Deactivate action
  async function handleDeactivateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!blockUser) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${blockUser.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "nonaktif", alasan: blockReason }),
      });
      if (res.ok) {
        toast.success("Akun berhasil dinonaktifkan");
        setBlockUser(null);
        setBlockReason("");
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Gagal menonaktifkan akun");
      }
    } catch {
      toast.error("Kesalahan jaringan");
    } finally {
      setSubmitting(false);
    }
  }

  // Client-side search fallback if API search isn't present
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
      
      {/* 1. Topbar console layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200/60 pb-5 mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-805 tracking-tight">Kelola User</h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">Monitor dan kelola status akun seluruh pengguna platform WasteLens.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Top Search bar */}
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
          {/* Help icon, notification bell, profile mock */}
          <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2A2 2 0 0 0 10 4V4.29C7.12 5.14 5 7.82 5 11V17L3 19V20H21V19L19 17V11C19 7.82 16.88 5.14 14 4.29V4A2 2 0 0 0 12 2M12 22A2 2 0 0 0 14 20H10A2 2 0 0 0 12 22Z" />
            </svg>
          </div>
          <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
      </div>

      {/* 2. Horizontal Filter pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Filter Berdasarkan Role</span>
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { value: "", label: "Semua User" },
              { value: "user", label: "Warga" },
              { value: "petugas", label: "Petugas" },
              { value: "kopdes", label: "Kopdes" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => { setRoleFilter(tab.value); setPage(1); }}
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

        {/* Small Active Count Box on right side */}
        <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm flex items-center gap-3 pr-6 pl-4 flex-shrink-0 self-start sm:self-center">
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#1E7D38] flex items-center justify-center">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4M12,18C8.9,18 7,16.5 7,15.5C7,14.5 8.9,13 12,13C15.1,13 17,14.5 17,15.5C17,16.5 15.1,18 12,18Z" />
            </svg>
          </div>
          <div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Aktif</span>
            <span className="text-sm font-black text-gray-800">{pagination?.total || activeUsersCount}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Data Table */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm mb-6 min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-[#1E7D38] animate-spin" />
            <p className="text-xs text-gray-400 font-bold">Memuat daftar pengguna...</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 uppercase font-black tracking-wider border-b border-gray-100/80">
                    <th className="pb-3 pt-1">User ID</th>
                    <th className="pb-3 pt-1">Nama Pengguna</th>
                    <th className="pb-3 pt-1">Role</th>
                    <th className="pb-3 pt-1">Status</th>
                    <th className="pb-3 pt-1 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-400 font-bold">
                        Tidak ada data pengguna ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-gray-100/50 hover:bg-gray-50/50 transition">
                        <td className="py-3.5 font-mono text-gray-500 font-bold">
                          #WL-{u.id.slice(0, 5).toUpperCase()}
                        </td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#EBEFFB] text-indigo-600 flex items-center justify-center font-bold">
                              {u.nama.slice(0,2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-black text-gray-805">{u.nama}</div>
                              <div className="text-[10px] text-gray-400 font-semibold">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 font-semibold text-gray-500">
                          {ROLE_LABELS[u.role] ?? u.role}
                        </td>
                        <td className="py-3.5">
                          {u.status === "active" ? (
                            <span className="inline-flex items-center gap-1.5 text-[#287A38] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#287A38]" /> Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-gray-400 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Nonaktif
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 text-right">
                          {u.status === "active" ? (
                            <button
                              onClick={() => {
                                setBlockUser(u);
                                setBlockReason("");
                              }}
                              className="px-4 py-1.5 text-[10px] bg-red-50 text-red-600 border border-red-100 rounded-lg font-black hover:bg-red-100 transition"
                            >
                              Blokir
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(u)}
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

            {/* Pagination Controls */}
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
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
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
                    disabled={page === pagination.totalPages}
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

      {/* 4. Bottom Row Stats Card (Screenshot 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left card: Statistik Registrasi */}
        <div className="bg-[#1E7D38] rounded-3xl p-6 shadow-sm text-white flex flex-col justify-between relative overflow-hidden h-44">
          <div className="space-y-1 relative z-10">
            <h4 className="text-sm font-black uppercase tracking-wider opacity-85">Statistik Registrasi</h4>
            <p className="text-xs font-semibold opacity-70 leading-relaxed max-w-[260px]">
              Pertumbuhan user baru meningkat sebesar 12% dalam 7 hari terakhir. Tetap pantau alur pendaftaran warga.
            </p>
          </div>
          <div className="mt-4 relative z-10">
            <p className="text-3xl font-black tracking-tight">+142 <span className="text-xs font-bold opacity-80 uppercase tracking-widest block mt-0.5">Warga Baru Minggu Ini</span></p>
          </div>
          {/* Mock background silhouette */}
          <div className="absolute right-4 bottom-2 opacity-15">
            <svg className="w-36 h-36 fill-current" viewBox="0 0 24 24">
              <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8A2.5,2.5 0 0,1 7.5,10.5A2.5,2.5 0 0,1 5,13A2.5,2.5 0 0,1 2.5,10.5A2.5,2.5 0 0,1 5,8M12,14C15.9,14 20,15.79 20,18V20H4V18C4,15.79 8.1,14 12,14Z" />
            </svg>
          </div>
        </div>

        {/* Right card: Petugas Lapangan */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-44">
          <div>
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider">Petugas Lapangan</h4>
              <span className="bg-emerald-50 text-[#1E7D38] text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                LIVE
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold mt-0.5">Monitor status keaktifan petugas lapangan WasteLens.</p>
            
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>Petugas Aktif</span>
                  <span>42</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1E7D38] rounded-full" style={{ width: "84%" }} />
                </div>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>Petugas Izin</span>
                <span className="font-black text-gray-700">8</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push("/admin/entities?tab=dinas")}
            className="w-full border border-gray-150 hover:bg-gray-50 text-gray-600 font-bold text-xs py-2 rounded-xl transition"
          >
            Lihat Detail Petugas
          </button>
        </div>
      </div>

      {/* 5. Floating Action Button (FAB) */}
      <button
        onClick={() => router.push("/admin/users/add")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#1E7D38] hover:bg-[#18652d] active:scale-95 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 z-40"
        title="Tambah User Baru"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* 6. Modal Block/Deactivate Account (Screenshot 2) */}
      {blockUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleDeactivateSubmit} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100 space-y-5 text-left">
            
            <div className="flex items-start gap-3.5 bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-gray-805">Nonaktifkan Akun?</h4>
                <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                  Tindakan ini akan membatasi akses <strong>{blockUser.nama}</strong> ke seluruh layanan WasteLens secara permanen hingga diaktifkan kembali.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Alasan Pemblokiran</label>
              <textarea
                required
                rows={3}
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Contoh: Melanggar ketentuan penggunaan, penyalahgunaan sistem laporan..."
                className="w-full bg-[#FAF9F5] border border-gray-150 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none h-24"
              />
              <span className="text-[9.5px] text-gray-400 font-bold flex items-center gap-1">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
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
                disabled={submitting}
                className="px-5 py-3 bg-[#E31E53] hover:bg-[#c11340] text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Konfirmasi Blokir
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
