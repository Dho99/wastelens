"use client";

import { useEffect, useState, useCallback } from "react";
import { Edit, Trash2, ShieldAlert, Plus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

type EntityUser = {
  id: string;
  nama: string;
  email: string;
  role: string;
  status: string;
};

type EntityDinas = {
  id: string;
  nama_dinas: string;
  kontak: string;
  email: string;
  status: string;
};

type EntityKopdes = {
  id: string;
  nama: string;
  alamat: string;
  email: string;
  status: string;
};

export default function ManajemenEntitasPage() {
  const [activeTab, setActiveTab] = useState<"user" | "dinas" | "koperasi">("user");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data lists
  const [users, setUsers] = useState<EntityUser[]>([]);
  const [dinas, setDinas] = useState<EntityDinas[]>([]);
  const [kopdes, setKopdes] = useState<EntityKopdes[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);

  // Modals state
  const [addDinasModal, setAddDinasModal] = useState(false);
  const [addKopdesModal, setAddKopdesModal] = useState(false);
  
  const [editUserModal, setEditUserModal] = useState<EntityUser | null>(null);
  const [editDinasModal, setEditDinasModal] = useState<EntityDinas | null>(null);
  const [editKopdesModal, setEditKopdesModal] = useState<EntityKopdes | null>(null);
  
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ id: string; type: "dinas" | "koperasi"; name: string } | null>(null);
  const [blockUserModal, setBlockUserModal] = useState<EntityUser | null>(null);

  // Form states
  const [dinasForm, setDinasForm] = useState({ nama_dinas: "", kontak: "", email: "" });
  const [kopdesForm, setKopdesForm] = useState({ nama: "", alamat: "", email: "" });
  const [userEditForm, setUserEditForm] = useState({ nama: "", email: "" });
  const [blockReason, setBlockReason] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch functions
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users?limit=100");
      const json = await res.json();
      setUsers(json.data ?? []);
    } catch {
      toast.error("Gagal memuat data user");
    }
  }, []);

  const fetchDinas = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dinas");
      const json = await res.json();
      setDinas(json);
    } catch {
      toast.error("Gagal memuat data dinas");
    }
  }, []);

  const fetchKopdes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/kopdes");
      const json = await res.json();
      setKopdes(json);
    } catch {
      toast.error("Gagal memuat data koperasi");
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchDinas(), fetchKopdes()]);
    setLoading(false);
  }, [fetchUsers, fetchDinas, fetchKopdes]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        loadAll();
      }
    });
    return () => {
      active = false;
    };
  }, [loadAll]);

  // Dinas CRUD handlers
  async function handleAddDinas(e: React.FormEvent) {
    e.preventDefault();
    if (!dinasForm.nama_dinas.trim() || !dinasForm.kontak.trim() || !dinasForm.email.trim()) {
      toast.error("Mohon isi semua field");
      return;
    }
    setFormSubmitting(true);
    try {
      const res = await fetch("/api/admin/dinas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dinasForm),
      });
      if (res.ok) {
        toast.success("Dinas berhasil ditambahkan");
        setAddDinasModal(false);
        setDinasForm({ nama_dinas: "", kontak: "", email: "" });
        fetchDinas();
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Gagal menambahkan dinas");
      }
    } catch {
      toast.error("Kesalahan jaringan");
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleEditDinas(e: React.FormEvent) {
    e.preventDefault();
    if (!editDinasModal) return;
    if (!editDinasModal.nama_dinas.trim() || !editDinasModal.kontak.trim()) {
      toast.error("Mohon isi semua field");
      return;
    }
    setFormSubmitting(true);
    try {
      const res = await fetch("/api/admin/dinas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editDinasModal.id,
          nama_dinas: editDinasModal.nama_dinas,
          kontak: editDinasModal.kontak,
        }),
      });
      if (res.ok) {
        toast.success("Dinas berhasil diperbarui");
        setEditDinasModal(null);
        fetchDinas();
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Gagal memperbarui dinas");
      }
    } catch {
      toast.error("Kesalahan jaringan");
    } finally {
      setFormSubmitting(false);
    }
  }

  // Kopdes CRUD handlers
  async function handleAddKopdes(e: React.FormEvent) {
    e.preventDefault();
    if (!kopdesForm.nama.trim() || !kopdesForm.alamat.trim() || !kopdesForm.email.trim()) {
      toast.error("Mohon isi semua field");
      return;
    }
    setFormSubmitting(true);
    try {
      const res = await fetch("/api/admin/kopdes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kopdesForm),
      });
      if (res.ok) {
        toast.success("Koperasi berhasil ditambahkan");
        setAddKopdesModal(false);
        setKopdesForm({ nama: "", alamat: "", email: "" });
        fetchKopdes();
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Gagal menambahkan koperasi");
      }
    } catch {
      toast.error("Kesalahan jaringan");
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleEditKopdes(e: React.FormEvent) {
    e.preventDefault();
    if (!editKopdesModal) return;
    if (!editKopdesModal.nama.trim() || !editKopdesModal.alamat.trim()) {
      toast.error("Mohon isi semua field");
      return;
    }
    setFormSubmitting(true);
    try {
      const res = await fetch("/api/admin/kopdes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editKopdesModal.id,
          nama: editKopdesModal.nama,
          alamat: editKopdesModal.alamat,
        }),
      });
      if (res.ok) {
        toast.success("Koperasi berhasil diperbarui");
        setEditKopdesModal(null);
        fetchKopdes();
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Gagal memperbarui koperasi");
      }
    } catch {
      toast.error("Kesalahan jaringan");
    } finally {
      setFormSubmitting(false);
    }
  }

  // Delete Entity Handler
  async function handleDeleteConfirm() {
    if (!deleteConfirmModal) return;
    setFormSubmitting(true);
    try {
      const res = await fetch(`/api/admin/${deleteConfirmModal.type}?id=${deleteConfirmModal.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(`${deleteConfirmModal.type === "dinas" ? "Dinas" : "Koperasi"} berhasil dihapus`);
        setDeleteConfirmModal(null);
        if (deleteConfirmModal.type === "dinas") fetchDinas();
        else fetchKopdes();
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Gagal menghapus entitas");
      }
    } catch {
      toast.error("Kesalahan jaringan");
    } finally {
      setFormSubmitting(false);
    }
  }

  // Edit User Handler
  async function handleEditUser(e: React.FormEvent) {
    e.preventDefault();
    if (!editUserModal) return;
    if (!userEditForm.nama.trim() || !userEditForm.email.trim()) {
      toast.error("Nama dan email wajib diisi");
      return;
    }
    setFormSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${editUserModal.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: userEditForm.nama,
          email: userEditForm.email,
        }),
      });
      if (res.ok) {
        toast.success("Profil user berhasil diperbarui");
        setEditUserModal(null);
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Gagal memperbarui user");
      }
    } catch {
      toast.error("Kesalahan jaringan");
    } finally {
      setFormSubmitting(false);
    }
  }

  // Block/Deactivate User Account
  async function handleBlockUser(e: React.FormEvent) {
    e.preventDefault();
    if (!blockUserModal) return;
    setFormSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${blockUserModal.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "nonaktif", alasan: blockReason }),
      });
      if (res.ok) {
        toast.success("Akun berhasil dinonaktifkan");
        setBlockUserModal(null);
        setBlockReason("");
        fetchUsers();
        fetchDinas();
        fetchKopdes();
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Gagal menonaktifkan akun");
      }
    } catch {
      toast.error("Kesalahan jaringan");
    } finally {
      setFormSubmitting(false);
    }
  }

  // Activate User Account
  async function handleActivateUser(u: EntityUser) {
    try {
      const res = await fetch(`/api/admin/users/${u.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      });
      if (res.ok) {
        toast.success("Akun berhasil diaktifkan kembali");
        fetchUsers();
        fetchDinas();
        fetchKopdes();
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Gagal mengaktifkan akun");
      }
    } catch {
      toast.error("Kesalahan jaringan");
    }
  }

  // Search filter lists
  const filteredUsers = users.filter((u) =>
    u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.includes(searchQuery)
  );

  const filteredDinas = dinas.filter((d) =>
    d.nama_dinas.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.kontak.includes(searchQuery)
  );

  const filteredKopdes = kopdes.filter((k) =>
    k.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.alamat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#FAF9F5] min-h-screen p-8 text-neutral-800">
      
      {/* Top bar header dashboard console style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/60 pb-5 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1E7D38] tracking-tight">Superadmin Dashboard</h1>
          <p className="text-xs text-gray-500 font-bold mt-1">Konsol Utama Kelola Entitas & Layanan</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Top Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Global search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38] shadow-sm w-44 md:w-56"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          {/* Notification bell and status profile mock */}
          <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2A2 2 0 0 0 10 4V4.29C7.12 5.14 5 7.82 5 11V17L3 19V20H21V19L19 17V11C19 7.82 16.88 5.14 14 4.29V4A2 2 0 0 0 12 2M12 22A2 2 0 0 0 14 20H10A2 2 0 0 0 12 22Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Title section matching Screenshot 4 */}
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-805">Manajemen Entitas</h2>
        <p className="text-sm text-gray-500 font-semibold mt-1">
          Kelola data user, dinas kebersihan, dan mitra koperasi pengelola sampah.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200/80 mb-5 pb-0.5 gap-4">
        <div className="flex gap-1">
          <button
            onClick={() => { setActiveTab("user"); setSearchQuery(""); }}
            className={`px-5 py-3 font-black text-xs uppercase tracking-wider transition-all border-b-2 -mb-0.5 ${
              activeTab === "user" ? "border-[#1E7D38] text-[#1E7D38]" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Data User
          </button>
          <button
            onClick={() => { setActiveTab("dinas"); setSearchQuery(""); }}
            className={`px-5 py-3 font-black text-xs uppercase tracking-wider transition-all border-b-2 -mb-0.5 ${
              activeTab === "dinas" ? "border-[#1E7D38] text-[#1E7D38]" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Data Dinas
          </button>
          <button
            onClick={() => { setActiveTab("koperasi"); setSearchQuery(""); }}
            className={`px-5 py-3 font-black text-xs uppercase tracking-wider transition-all border-b-2 -mb-0.5 ${
              activeTab === "koperasi" ? "border-[#1E7D38] text-[#1E7D38]" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Data Koperasi
          </button>
        </div>

        {/* Action button on right of tabs */}
        <div>
          {activeTab === "dinas" && (
            <button
              onClick={() => setAddDinasModal(true)}
              className="bg-[#1E7D38] hover:bg-[#18652d] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Tambah Dinas
            </button>
          )}
          {activeTab === "koperasi" && (
            <button
              onClick={() => setAddKopdesModal(true)}
              className="bg-[#1E7D38] hover:bg-[#18652d] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Tambah Koperasi
            </button>
          )}
        </div>
      </div>

      {/* Main content table card layout */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm mb-6 min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-[#1E7D38] animate-spin" />
            <p className="text-xs text-gray-400 font-bold">Memproses data entitas...</p>
          </div>
        ) : (
          <div>
            {/* SEARCH FILTER */}
            <div className="mb-4 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, ID, atau instansi..."
                className="w-full bg-[#FAF9F5] border border-gray-150 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38] shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* DATA USER TAB */}
            {activeTab === "user" && (
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
                          Tidak ada data user cocok
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="border-b border-gray-100/50 hover:bg-gray-50/50 transition">
                          <td className="py-3.5 font-mono text-gray-500 font-bold">#USR-{u.id.slice(0, 5).toUpperCase()}</td>
                          <td className="py-3.5 font-bold text-gray-800">
                            <div>{u.nama}</div>
                            <div className="text-[10px] text-gray-400 font-semibold">{u.email}</div>
                          </td>
                          <td className="py-3.5">
                            <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider text-[9px]">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5">
                            {u.status === "active" ? (
                              <span className="inline-flex items-center gap-1 text-[#287A38] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#287A38]" /> Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-500 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Nonaktif
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 text-right flex justify-end items-center gap-2">
                            <button
                              onClick={() => {
                                setUserEditForm({ nama: u.nama, email: u.email });
                                setEditUserModal(u);
                              }}
                              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
                              title="Edit User"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            {u.status === "active" ? (
                              <button
                                onClick={() => {
                                  setBlockUserModal(u);
                                  setBlockReason("");
                                }}
                                className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500"
                                title="Block User"
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                  <path d="M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 18,16.5L6.5,5A8,8 0 0,1 12,4M12,20A8,8 0 0,1 6,7.5L17.5,19A8,8 0 0,1 12,20Z" />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivateUser(u)}
                                className="px-2.5 py-1 text-[10px] bg-emerald-50 text-[#287A38] border border-emerald-100 rounded-md font-bold hover:bg-emerald-100 transition"
                              >
                                Aktifkan
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* DATA DINAS TAB */}
            {activeTab === "dinas" && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="text-gray-400 uppercase font-black tracking-wider border-b border-gray-100/80">
                      <th className="pb-3 pt-1">Dinas ID</th>
                      <th className="pb-3 pt-1">Nama Dinas</th>
                      <th className="pb-3 pt-1">Kontak</th>
                      <th className="pb-3 pt-1">Status</th>
                      <th className="pb-3 pt-1 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDinas.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-gray-400 font-bold">
                          Tidak ada data dinas cocok
                        </td>
                      </tr>
                    ) : (
                      filteredDinas.map((d) => (
                        <tr key={d.id} className="border-b border-gray-100/50 hover:bg-gray-50/50 transition">
                          <td className="py-3.5 font-mono text-gray-500 font-bold">#DNS-{d.id.slice(0, 5).toUpperCase()}</td>
                          <td className="py-3.5 font-bold text-gray-800">
                            <div>{d.nama_dinas}</div>
                            <div className="text-[10px] text-gray-400 font-semibold">{d.email}</div>
                          </td>
                          <td className="py-3.5 font-bold text-gray-600">{d.kontak}</td>
                          <td className="py-3.5">
                            {d.status === "active" ? (
                              <span className="inline-flex items-center gap-1 text-[#287A38] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#287A38]" /> Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-500 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Nonaktif
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 text-right flex justify-end items-center gap-2">
                            <button
                              onClick={() => setEditDinasModal(d)}
                              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmModal({ id: d.id, type: "dinas", name: d.nama_dinas })}
                              className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* DATA KOPERASI TAB */}
            {activeTab === "koperasi" && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="text-gray-400 uppercase font-black tracking-wider border-b border-gray-100/80">
                      <th className="pb-3 pt-1">Koperasi ID</th>
                      <th className="pb-3 pt-1">Nama Koperasi</th>
                      <th className="pb-3 pt-1">Alamat</th>
                      <th className="pb-3 pt-1">Status</th>
                      <th className="pb-3 pt-1 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKopdes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-gray-400 font-bold">
                          Tidak ada data koperasi cocok
                        </td>
                      </tr>
                    ) : (
                      filteredKopdes.map((k) => (
                        <tr key={k.id} className="border-b border-gray-100/50 hover:bg-gray-50/50 transition">
                          <td className="py-3.5 font-mono text-gray-500 font-bold">#KOP-{k.id.slice(0, 5).toUpperCase()}</td>
                          <td className="py-3.5 font-bold text-gray-800">
                            <div>{k.nama}</div>
                            <div className="text-[10px] text-gray-400 font-semibold">{k.email}</div>
                          </td>
                          <td className="py-3.5 font-bold text-gray-600 truncate max-w-[200px]">{k.alamat}</td>
                          <td className="py-3.5">
                            {k.status === "active" ? (
                              <span className="inline-flex items-center gap-1 text-[#287A38] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#287A38]" /> Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-500 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Nonaktif
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 text-right flex justify-end items-center gap-2">
                            <button
                              onClick={() => setEditKopdesModal(k)}
                              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmModal({ id: k.id, type: "koperasi", name: k.nama })}
                              className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Summary & Health Row matching Screenshot 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1E7D38] flex items-center justify-center">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8A2.5,2.5 0 0,1 7.5,10.5A2.5,2.5 0 0,1 5,13A2.5,2.5 0 0,1 2.5,10.5A2.5,2.5 0 0,1 5,8M19,8A2.5,2.5 0 0,1 21.5,10.5A2.5,2.5 0 0,1 19,13A2.5,2.5 0 0,1 16.5,10.5A2.5,2.5 0 0,1 19,8M12,14C15.9,14 20,15.79 20,18V20H4V18C4,15.79 8.1,14 12,14M5,15.28C6.83,16.5 9,17 11.82,17C11.9,17 12,17 12.08,17C11.23,17.9 10.45,18.89 10.08,20H2.08V18.5C2.08,16.92 4,15.75 5,15.28M19,15.28C20,15.75 21.92,16.92 21.92,18.5V20H13.92C13.55,18.89 12.77,17.9 11.92,17C12,17 12.09,17 12.18,17C15,17 17.17,16.5 19,15.28Z" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total Users Terdaftar</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-2xl font-black text-gray-805">{users.length || "1,284"}</p>
              <span className="text-xs text-[#287A38] font-bold">▲ +12% bln ini</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Health Status</span>
            <span className="text-xs font-black text-[#1E7D38]">94%</span>
          </div>
          {/* Progress bar */}
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#1E7D38] rounded-full" style={{ width: "94%" }} />
          </div>
          <p className="text-[10px] text-gray-400 font-bold mt-1">
            94% entitas berstatus aktif dan sinkron dengan basis data pusat.
          </p>
        </div>
      </div>

      {/* ── MODALS SECTION ───────────────────────────────────── */}

      {/* 1. Modal Tambah Dinas */}
      {addDinasModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddDinas} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100 space-y-4">
            <div>
              <h3 className="text-lg font-black text-gray-805">Tambah Dinas Baru</h3>
              <p className="text-xs text-gray-500 font-bold mt-0.5">Buat entitas dinas kebersihan operasional baru.</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Nama Dinas</label>
                <input
                  type="text"
                  required
                  value={dinasForm.nama_dinas}
                  onChange={(e) => setDinasForm({ ...dinasForm, nama_dinas: e.target.value })}
                  placeholder="Contoh: DLH Kota Semarang"
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Kontak Dinas</label>
                <input
                  type="text"
                  required
                  value={dinasForm.kontak}
                  onChange={(e) => setDinasForm({ ...dinasForm, kontak: e.target.value })}
                  placeholder="Contoh: 024-7654321"
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Email Akun</label>
                <input
                  type="email"
                  required
                  value={dinasForm.email}
                  onChange={(e) => setDinasForm({ ...dinasForm, email: e.target.value })}
                  placeholder="Contoh: admin.dlh@semarang.go.id"
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAddDinasModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={formSubmitting}
                className="px-4 py-2 bg-[#1E7D38] hover:bg-[#18652d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Tambah
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Modal Tambah Koperasi */}
      {addKopdesModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddKopdes} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100 space-y-4">
            <div>
              <h3 className="text-lg font-black text-gray-805">Tambah Koperasi Baru</h3>
              <p className="text-xs text-gray-500 font-bold mt-0.5">Buat koperasi penukaran koin sampah baru.</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Nama Koperasi</label>
                <input
                  type="text"
                  required
                  value={kopdesForm.nama}
                  onChange={(e) => setKopdesForm({ ...kopdesForm, nama: e.target.value })}
                  placeholder="Contoh: Koperasi Harapan Sejahtera"
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Alamat Lengkap</label>
                <textarea
                  required
                  rows={2}
                  value={kopdesForm.alamat}
                  onChange={(e) => setKopdesForm({ ...kopdesForm, alamat: e.target.value })}
                  placeholder="Masukkan jalan, kecamatan, kota..."
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38] resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Email Akun</label>
                <input
                  type="email"
                  required
                  value={kopdesForm.email}
                  onChange={(e) => setKopdesForm({ ...kopdesForm, email: e.target.value })}
                  placeholder="Contoh: kopdes.sejahtera@email.com"
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAddKopdesModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={formSubmitting}
                className="px-4 py-2 bg-[#1E7D38] hover:bg-[#18652d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Tambah
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Modal Edit User */}
      {editUserModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleEditUser} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100 space-y-4">
            <div>
              <h3 className="text-lg font-black text-gray-850">Edit Profil User</h3>
              <p className="text-xs text-gray-500 font-bold mt-0.5">Ubah nama dan email dari akun pengguna.</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={userEditForm.nama}
                  onChange={(e) => setUserEditForm({ ...userEditForm, nama: e.target.value })}
                  placeholder="Nama lengkap"
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={userEditForm.email}
                  onChange={(e) => setUserEditForm({ ...userEditForm, email: e.target.value })}
                  placeholder="Email"
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditUserModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={formSubmitting}
                className="px-4 py-2 bg-[#1E7D38] hover:bg-[#18652d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Modal Edit Dinas */}
      {editDinasModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleEditDinas} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100 space-y-4">
            <div>
              <h3 className="text-lg font-black text-gray-805">Edit Dinas</h3>
              <p className="text-xs text-gray-500 font-bold mt-0.5">Ubah nama instansi dan kontak dari dinas kebersihan.</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Nama Dinas</label>
                <input
                  type="text"
                  required
                  value={editDinasModal.nama_dinas}
                  onChange={(e) => setEditDinasModal({ ...editDinasModal, nama_dinas: e.target.value })}
                  placeholder="Nama Dinas"
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Kontak Dinas</label>
                <input
                  type="text"
                  required
                  value={editDinasModal.kontak}
                  onChange={(e) => setEditDinasModal({ ...editDinasModal, kontak: e.target.value })}
                  placeholder="Kontak Dinas"
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditDinasModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={formSubmitting}
                className="px-4 py-2 bg-[#1E7D38] hover:bg-[#18652d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. Modal Edit Koperasi */}
      {editKopdesModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleEditKopdes} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100 space-y-4">
            <div>
              <h3 className="text-lg font-black text-gray-805">Edit Koperasi</h3>
              <p className="text-xs text-gray-500 font-bold mt-0.5">Ubah nama dan alamat dari koperasi pengelola.</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Nama Koperasi</label>
                <input
                  type="text"
                  required
                  value={editKopdesModal.nama}
                  onChange={(e) => setEditKopdesModal({ ...editKopdesModal, nama: e.target.value })}
                  placeholder="Nama Koperasi"
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Alamat Lengkap</label>
                <textarea
                  required
                  rows={2}
                  value={editKopdesModal.alamat}
                  onChange={(e) => setEditKopdesModal({ ...editKopdesModal, alamat: e.target.value })}
                  placeholder="Alamat Koperasi"
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditKopdesModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={formSubmitting}
                className="px-4 py-2 bg-[#1E7D38] hover:bg-[#18652d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. Modal Delete Confirmation */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-gray-805">Hapus Entitas?</h3>
            </div>
            
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong>{deleteConfirmModal.name}</strong>? Tindakan ini bersifat permanen dan akan menghapus akun user yang terkait dengannya.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={formSubmitting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal Block/Deactivate Account (Screenshot 2) */}
      {blockUserModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleBlockUser} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100 space-y-5 text-left">
            
            {/* Warning alert panel matching Screenshot 2 */}
            <div className="flex items-start gap-3.5 bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-gray-805">Nonaktifkan Akun?</h4>
                <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                  Tindakan ini akan membatasi akses <strong>{blockUserModal.nama}</strong> ke seluruh layanan WasteLens secara permanen hingga diaktifkan kembali.
                </p>
              </div>
            </div>

            {/* Block reason textarea input */}
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

            {/* Actions button controls */}
            <div className="flex justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setBlockUserModal(null)}
                className="px-5 py-3 hover:bg-gray-100 text-gray-500 rounded-xl text-xs font-black transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={formSubmitting}
                className="px-5 py-3 bg-[#E31E53] hover:bg-[#c11340] text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm"
              >
                {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Konfirmasi Blokir
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
