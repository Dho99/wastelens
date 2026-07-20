"use client";

import { useState } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { EntityUser, EntityDinas, EntityKopdes } from "../types/entities";
import UserTable from "./components/UserTable";
import DinasTable from "./components/DinasTable";
import KopdesTable from "./components/KopdesTable";
import {
    useEntityUsers,
    useDinasList,
    useKopdesList,
    useCreateDinas,
    useUpdateDinas,
    useDeleteDinas,
    useCreateKopdes,
    useUpdateKopdes,
    useDeleteKopdes,
} from "../hooks/useEntities";
import { useUpdateUserStatus } from "../hooks/useUsers";
import AddDinasModal from "./components/AddDinasModal";
import AddKopdesModal from "./components/AddKopdesModal";
import EditUserModal from "./components/EditUserModal";
import EditDinasModal from "./components/EditDinasModal";
import EditKopdesModal from "./components/EditKopdesModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import BlockUserModal from "./components/BlockUserModal";

export default function ManajemenEntitasPage() {
    const [activeTab, setActiveTab] = useState<"user" | "dinas" | "koperasi">(
        "user",
    );
    const [searchQuery, setSearchQuery] = useState("");

    const { data: users = [], isLoading: loadingUsers } = useEntityUsers();
    const { data: dinas = [], isLoading: loadingDinas } = useDinasList();
    const { data: kopdes = [], isLoading: loadingKopdes } = useKopdesList();
    const { mutateAsync: updateStatus } = useUpdateUserStatus();
    const { mutateAsync: createDinas } = useCreateDinas();
    const { mutateAsync: updateDinas } = useUpdateDinas();
    const { mutateAsync: deleteDinas } = useDeleteDinas();
    const { mutateAsync: createKopdes } = useCreateKopdes();
    const { mutateAsync: updateKopdes } = useUpdateKopdes();
    const { mutateAsync: deleteKopdes } = useDeleteKopdes();

    const loading = loadingUsers && loadingDinas && loadingKopdes;

    // Modal state
    const [addDinasModal, setAddDinasModal] = useState(false);
    const [addKopdesModal, setAddKopdesModal] = useState(false);
    const [editUserModal, setEditUserModal] = useState<EntityUser | null>(null);
    const [editDinasModal, setEditDinasModal] = useState<EntityDinas | null>(null);
    const [editKopdesModal, setEditKopdesModal] = useState<EntityKopdes | null>(null);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
        id: string;
        type: "dinas" | "koperasi";
        name: string;
    } | null>(null);
    const [blockUserModal, setBlockUserModal] = useState<EntityUser | null>(null);

    async function handleActivateUser(u: EntityUser) {
        try {
            await updateStatus({ id: u.id, status: "active" });
            toast.success("Akun berhasil diaktifkan kembali");
        } catch {
            toast.error("Gagal mengaktifkan akun");
        }
    }

    const filteredUsers = users.filter(
        (u) =>
            u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.id.includes(searchQuery),
    );

    const filteredDinas = dinas.filter(
        (d) =>
            d.nama_dinas.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.kontak.includes(searchQuery),
    );

    const filteredKopdes = kopdes.filter(
        (k) =>
            k.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            k.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            k.alamat.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="bg-[#FAF9F5] min-h-screen p-8 text-neutral-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/60 pb-5 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-[#1E7D38] tracking-tight">
                        Superadmin Dashboard
                    </h1>
                    <p className="text-xs text-gray-500 font-bold mt-1">
                        Konsol Utama Kelola Entitas & Layanan
                    </p>
                </div>
                <div className="flex items-center gap-3">
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
                    <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer shadow-sm">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2A2 2 0 0 0 10 4V4.29C7.12 5.14 5 7.82 5 11V17L3 19V20H21V19L19 17V11C19 7.82 16.88 5.14 14 4.29V4A2 2 0 0 0 12 2M12 22A2 2 0 0 0 14 20H10A2 2 0 0 0 12 22Z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-805">Manajemen Entitas</h2>
                <p className="text-sm text-gray-500 font-semibold mt-1">
                    Kelola data user, dinas kebersihan, dan mitra koperasi pengelola sampah.
                </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200/80 mb-5 pb-0.5 gap-4">
                <div className="flex gap-1">
                    {(["user", "dinas", "koperasi"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setSearchQuery(""); }}
                            className={`px-5 py-3 font-black text-xs uppercase tracking-wider transition-all border-b-2 -mb-0.5 ${
                                activeTab === tab
                                    ? "border-[#1E7D38] text-[#1E7D38]"
                                    : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            {tab === "user" ? "Data User" : tab === "dinas" ? "Data Dinas" : "Data Koperasi"}
                        </button>
                    ))}
                </div>
                <div>
                    {activeTab === "dinas" && (
                        <button
                            onClick={() => setAddDinasModal(true)}
                            className="bg-[#1E7D38] hover:bg-[#18652d] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all duration-200"
                        >
                            <Plus className="w-4 h-4" /> Tambah Dinas
                        </button>
                    )}
                    {activeTab === "koperasi" && (
                        <button
                            onClick={() => setAddKopdesModal(true)}
                            className="bg-[#1E7D38] hover:bg-[#18652d] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all duration-200"
                        >
                            <Plus className="w-4 h-4" /> Tambah Koperasi
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm mb-6 min-h-[300px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 text-[#1E7D38] animate-spin" />
                        <p className="text-xs text-gray-400 font-bold">Memproses data entitas...</p>
                    </div>
                ) : (
                    <div>
                        <div className="mb-4 relative">
                            <input
                                type="text" value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama, ID, atau instansi..."
                                className="w-full bg-[#FAF9F5] border border-gray-150 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38] shadow-inner"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>

                        {activeTab === "user" && (
                            <UserTable
                                users={filteredUsers}
                                onEdit={(u) => setEditUserModal(u)}
                                onBlock={(u) => setBlockUserModal(u)}
                                onActivate={handleActivateUser}
                            />
                        )}

                        {activeTab === "dinas" && (
                            <DinasTable
                                dinas={filteredDinas}
                                onEdit={(d) => setEditDinasModal(d)}
                                onDelete={(d) => setDeleteConfirmModal({ id: d.id, type: "dinas", name: d.nama_dinas })}
                            />
                        )}

                        {activeTab === "koperasi" && (
                            <KopdesTable
                                kopdes={filteredKopdes}
                                onEdit={(k) => setEditKopdesModal(k)}
                                onDelete={(k) => setDeleteConfirmModal({ id: k.id, type: "koperasi", name: k.nama })}
                            />
                        )}
                    </div>
                )}
            </div>

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
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1E7D38] rounded-full" style={{ width: "94%" }} />
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">94% entitas berstatus aktif dan sinkron dengan basis data pusat.</p>
                </div>
            </div>

            {/* ── MODALS ───────────────────────────────────── */}

            <AddDinasModal
                open={addDinasModal}
                onClose={() => { setAddDinasModal(false); }}
                onSubmit={async (data) => { await createDinas(data); }}
            />

            <AddKopdesModal
                open={addKopdesModal}
                onClose={() => { setAddKopdesModal(false); }}
                onSubmit={async (data) => { await createKopdes(data); }}
            />

            <EditUserModal
                user={editUserModal}
                onClose={() => setEditUserModal(null)}
                onSubmit={async (id, nama, email) => { await updateStatus({ id, status: "active", nama, email }); }}
            />

            <EditDinasModal
                dinas={editDinasModal}
                onClose={() => setEditDinasModal(null)}
                onSubmit={async (id, nama_dinas, kontak) => { await updateDinas({ id, nama_dinas, kontak }); }}
            />

            <EditKopdesModal
                kopdes={editKopdesModal}
                onClose={() => setEditKopdesModal(null)}
                onSubmit={async (id, nama, alamat) => { await updateKopdes({ id, nama, alamat }); }}
            />

            <DeleteConfirmModal
                data={deleteConfirmModal ? { id: deleteConfirmModal.id, name: deleteConfirmModal.name } : null}
                onClose={() => setDeleteConfirmModal(null)}
                onConfirm={async (id) => {
                    if (deleteConfirmModal?.type === "dinas") {
                        await deleteDinas(id);
                    } else {
                        await deleteKopdes(id);
                    }
                }}
            />

            <BlockUserModal
                user={blockUserModal}
                onClose={() => { setBlockUserModal(null); }}
                onSubmit={async (id, alasan) => { await updateStatus({ id, status: "nonaktif", alasan }); }}
            />

        </div>
    );
}
