"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const ROLES = ["user", "petugas", "kopdes", "dinas", "admin"] as const;
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
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ user: User } | null>(null);
  const [alasan, setAlasan] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (roleFilter) params.set("role", roleFilter);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/users?${params}`);
      const json = await res.json();
      setUsers(json.data ?? []);
      setPagination(json.pagination ?? null);
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, statusFilter]);

  useEffect(() => {
    // setLoading(true) is synchronous here, but loading is not in the
    // dependency array so it cannot trigger a cascading render loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  async function toggleStatus(u: User) {
    const newStatus = u.status === "active" ? "nonaktif" : "active";
    if (newStatus === "nonaktif") {
      setModal({ user: u });
      setAlasan("");
      return;
    }
    await submitStatus(u.id, newStatus);
  }

  async function submitStatus(id: string, newStatus: string) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setModal(null);
        setAlasan("");
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error ?? "Gagal mengubah status");
      }
    } catch {} finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Kelola Pengguna</h1>

      <div className="flex gap-3 mb-5 flex-wrap">
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Semua Role</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="p-3 font-medium">Nama</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Saldo Koin</th>
              <th className="p-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-neutral-400">Memuat...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-neutral-400">Tidak ada data</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-neutral-50">
                <td className="p-3">{u.nama}</td>
                <td className="p-3 text-neutral-500">{u.email}</td>
                <td className="p-3">
                  <span className="bg-neutral-100 px-2 py-0.5 rounded text-xs font-medium">
                    {ROLE_LABELS[u.role] ?? u.role}
                  </span>
                </td>
                <td className="p-3">
                  {u.status === "active" ? (
                    <span className="flex items-center gap-1 text-emerald-600 text-xs">
                      <CheckCircle size={14} /> Aktif
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 text-xs">
                      <XCircle size={14} /> Nonaktif
                    </span>
                  )}
                </td>
                <td className="p-3">{u.saldo_koin}</td>
                <td className="p-3">
                  <button
                    onClick={() => toggleStatus(u)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition ${
                      u.status === "active"
                        ? "text-red-600 border-red-200 hover:bg-red-50"
                        : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    }`}
                  >
                    {u.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                p === page ? "bg-neutral-900 text-white border-neutral-900" : "hover:bg-neutral-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-2">Nonaktifkan Akun</h2>
            <p className="text-sm text-neutral-500 mb-4">
              Pengguna: <strong>{modal.user.nama}</strong> ({modal.user.email})
            </p>
            <label className="text-sm font-medium block mb-1">Alasan Pemblokiran</label>
            <textarea
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm resize-none h-24"
              placeholder="Masukkan alasan..."
            />
            <div className="flex gap-3 mt-5 justify-end">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-neutral-50 transition"
              >
                Batal
              </button>
              <button
                onClick={() => submitStatus(modal.user.id, "nonaktif")}
                disabled={submitting}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
              >
                {submitting ? "Memproses..." : "Nonaktifkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
