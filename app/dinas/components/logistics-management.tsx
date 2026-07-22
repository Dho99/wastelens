"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  History,
  Eye,
  Pencil,
  Phone,
  PlusCircle,
  Trash2,
  Truck,
  UserCog,
  UserPlus,
  X,
} from "lucide-react";
import { DlhShell } from "./dlh-shell";
import type { DinasVehicle as Vehicle, DinasOfficer as Officer } from "@/lib/services/dinas/types";
import { useVehicles, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from "../hooks/useVehicles";
import { useOfficers, useCreateOfficer, useUpdateOfficer, useDeleteOfficer } from "../hooks/useOfficers";

type Editor = { kind: "vehicle"; item?: Vehicle; draftId?: string } | { kind: "officer"; item?: Officer; draftId?: string };
type DeleteTarget = { kind: "vehicle" | "officer"; id: string; label: string };

const inputClass = "mt-2 h-11 w-full rounded-xl border border-[#c3d1c7] bg-[#f7fbfd] px-4 font-normal outline-none focus:border-[#087529]";

const OFFICER_COLORS = ["bg-[#bcebd1]", "bg-[#ffd9ae]", "bg-[#d7eafd]", "bg-[#e5ddfb]"] as const;

function getOfficerInitials(nama: string) {
  return nama.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export function LogisticsManagement() {
  const router = useRouter();
  const { data: vehiclesData } = useVehicles();
  const { data: officersData } = useOfficers();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const createOfficer = useCreateOfficer();
  const updateOfficer = useUpdateOfficer();
  const deleteOfficer = useDeleteOfficer();
  const vehicles = vehiclesData ?? [];
  const officers = officersData ?? [];
  const [vehiclePage, setVehiclePage] = useState(0);
  const [officerPage, setOfficerPage] = useState(0);
  const [vehiclePageSize, setVehiclePageSize] = useState(5);
  const [officerPageSize, setOfficerPageSize] = useState(5);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [notice, setNotice] = useState("");
  const visibleVehicles = vehicles.slice(vehiclePage * vehiclePageSize, vehiclePage * vehiclePageSize + vehiclePageSize);
  const visibleOfficers = officers.slice(officerPage * officerPageSize, officerPage * officerPageSize + officerPageSize);

  const saveItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editor) return;
    const data = new FormData(event.currentTarget);
    try {
      if (editor.kind === "vehicle") {
        const jenis = String(data.get("plate"));
        const kapasitas = Math.round(Number(data.get("capacity")) * 1000);
        if (editor.item) {
          await updateVehicle.mutateAsync({ id: editor.item.id, jenis, kapasitas });
          setNotice("Data armada berhasil diperbarui.");
        } else {
          await createVehicle.mutateAsync({ jenis, kapasitas });
          setNotice("Armada baru berhasil ditambahkan.");
        }
      } else {
        const nama = String(data.get("name"));
        const no_hp = String(data.get("phone"));
        if (editor.item) {
          await updateOfficer.mutateAsync({ id: editor.item.id, nama, no_hp });
          setNotice("Data petugas berhasil diperbarui.");
        } else {
          await createOfficer.mutateAsync({ nama, no_hp });
          setNotice("Petugas baru berhasil ditambahkan.");
        }
      }
      setEditor(null);
    } catch {
      setNotice("Gagal menyimpan data.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.kind === "vehicle") {
        await deleteVehicle.mutateAsync(deleteTarget.id);
      } else {
        await deleteOfficer.mutateAsync(deleteTarget.id);
      }
      setNotice(`${deleteTarget.label} berhasil dihapus.`);
    } catch {
      setNotice("Gagal menghapus data.");
    }
    setDeleteTarget(null);
  };

  return (
    <DlhShell>
      <main className="min-h-0 flex-1 overflow-y-auto bg-[#f5fbfe] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#39815a]">Fleet Operations</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">Manajemen Logistik</h2>
            <p className="mt-1 text-sm text-slate-500">Kelola armada dan petugas operasional dalam satu tempat.</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <SummaryCard icon={<Truck />} color="bg-[#dff4e8] text-[#087529]" label="Total Armada" value={`${vehicles.length} Unit`} />
            <SummaryCard icon={<UserCog />} color="bg-[#dceff8] text-[#35687e]" label="Petugas Aktif" value={`${officers.length} Orang`} />
            <SummaryCard icon={<History />} color="bg-[#ffd9ae] text-[#956100]" label="Update Terakhir" value={`${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`} />
          </div>

          {notice && <div role="status" className="mt-5 flex items-center rounded-2xl bg-[#dff5e9] px-4 py-3 text-sm font-bold text-[#176a35]">{notice}<button type="button" onClick={() => setNotice("")} className="ml-auto rounded-full p-1 hover:bg-white/60"><X className="size-4" /></button></div>}

          <div className="mt-8">
            <SectionHeading title="Kelola Armada" subtitle="Pantau dan kelola armada pengangkut sampah." button="Tambah Armada" icon="vehicle" onClick={() => router.push("/dinas/logistics/vehicles/new")} />
          </div>
          <section className="mt-4 overflow-hidden rounded-[20px] border border-[#b8cabc] bg-white/30 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#e2f2fa] text-[11px] font-extrabold uppercase tracking-wide text-[#4a5a51]"><tr><th className="px-7 py-4">ID Kendaraan</th><th className="px-5 py-4">Plat Nomor</th><th className="px-5 py-4">Kapasitas</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-center">Aksi</th></tr></thead>
                <tbody>{visibleVehicles.map((vehicle) => <tr key={vehicle.id} className="border-t border-[#bdcdbf] text-sm"><td className="px-7 py-4 font-extrabold">{vehicle.id}</td><td className="px-5 py-4 font-medium">{vehicle.jenis}</td><td className="px-5 py-4"><span className="rounded-full bg-[#bcebd1] px-3 py-1 text-[11px] font-bold text-[#547466]">{vehicle.kapasitas} kg</span></td><td className={`px-5 py-4 font-medium text-[#177735]`}><span className={`mr-2 inline-block size-2 rounded-full bg-[#087529]`} />Beroperasi</td><td className="px-5 py-4"><div className="flex justify-center gap-2"><ActionButton label={`Lihat ${vehicle.id}`} onClick={() => router.push(`/dinas/logistics/vehicles/${vehicle.id}`)}><Eye /></ActionButton><ActionButton label={`Edit ${vehicle.id}`} onClick={() => setEditor({ kind: "vehicle", item: vehicle })}><Pencil /></ActionButton><ActionButton danger label={`Hapus ${vehicle.id}`} onClick={() => setDeleteTarget({ kind: "vehicle", id: vehicle.id, label: `Armada ${vehicle.id}` })}><Trash2 /></ActionButton></div></td></tr>)}</tbody>
              </table>
            </div>
            <TableFooter shown={visibleVehicles.length} total={vehicles.length} noun="armada" page={vehiclePage} pageSize={vehiclePageSize} canNext={(vehiclePage + 1) * vehiclePageSize < vehicles.length} onPageSizeChange={(size) => { setVehiclePageSize(size); setVehiclePage(0); }} onPrevious={() => setVehiclePage((page) => Math.max(0, page - 1))} onNext={() => setVehiclePage((page) => page + 1)} />
          </section>

          <div className="mt-8"><SectionHeading title="Kelola Petugas" subtitle="Atur penugasan dan kontak petugas lapangan." button="Tambah Petugas" icon="officer" onClick={() => router.push("/dinas/logistics/officers/new")} /></div>
          <section className="mt-4 overflow-hidden rounded-[20px] border border-[#b8cabc] bg-white/30 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left">
                <thead className="bg-[#e2f2fa] text-[11px] font-extrabold uppercase tracking-wide text-[#4a5a51]"><tr><th className="px-7 py-4">Nama Petugas</th><th className="px-5 py-4">ID Petugas</th><th className="px-5 py-4">Wilayah Tugas</th><th className="px-5 py-4">No. HP</th><th className="px-5 py-4 text-center">Aksi</th></tr></thead>
                <tbody>{visibleOfficers.map((officer, idx) => <tr key={officer.id} className="border-t border-[#bdcdbf] text-sm"><td className="px-7 py-4"><div className="flex items-center gap-3"><span className={`grid size-9 place-items-center rounded-full text-xs font-extrabold ${OFFICER_COLORS[idx % OFFICER_COLORS.length]}`}>{getOfficerInitials(officer.nama)}</span><span className="font-extrabold">{officer.nama}</span></div></td><td className="px-5 py-4 font-medium">{officer.id}</td><td className="px-5 py-4"><span className="rounded-full border border-[#b7c9ba] bg-[#e8f2f4] px-3 py-1 text-[11px] font-semibold text-[#51645a]">-</span></td><td className="px-5 py-4 font-medium">{officer.no_hp}</td><td className="px-5 py-4"><div className="flex justify-center gap-2"><ActionButton label={`Lihat ${officer.nama}`} onClick={() => router.push(`/dinas/logistics/officers/${officer.id}`)}><Eye /></ActionButton><a href={`tel:${officer.no_hp.replace(/\s|-/g, "")}`} aria-label={`Telepon ${officer.nama}`} className="grid size-9 place-items-center rounded-lg border border-[#b9cabc] transition hover:bg-white"><Phone className="size-4" /></a><ActionButton label={`Edit ${officer.nama}`} onClick={() => router.push(`/dinas/logistics/officers/${officer.id}/edit`)}><Pencil /></ActionButton><ActionButton danger label={`Hapus ${officer.nama}`} onClick={() => setDeleteTarget({ kind: "officer", id: officer.id, label: `Petugas ${officer.nama}` })}><Trash2 /></ActionButton></div></td></tr>)}</tbody>
              </table>
            </div>
            <TableFooter shown={visibleOfficers.length} total={officers.length} noun="petugas" page={officerPage} pageSize={officerPageSize} canNext={(officerPage + 1) * officerPageSize < officers.length} onPageSizeChange={(size) => { setOfficerPageSize(size); setOfficerPage(0); }} onPrevious={() => setOfficerPage((page) => Math.max(0, page - 1))} onNext={() => setOfficerPage((page) => page + 1)} />
          </section>

        </div>
      </main>

      {editor && <EditorModal editor={editor} onClose={() => setEditor(null)} onSubmit={saveItem} />}
      {deleteTarget && <DeleteModal target={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
    </DlhShell>
  );
}

function SectionHeading({ title, subtitle, button, icon, onClick }: { title: string; subtitle: string; button: string; icon: "vehicle" | "officer"; onClick: () => void }) {
  return <div className="flex flex-col gap-3 sm:flex-row sm:items-end"><div><h2 className="text-xl font-extrabold tracking-[-0.03em] sm:text-2xl">{title}</h2><p className="mt-0.5 text-xs text-[#667169] sm:text-sm">{subtitle}</p></div><button type="button" onClick={onClick} className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#087529] px-6 text-sm font-extrabold text-white transition hover:bg-[#066421] sm:ml-auto">{icon === "vehicle" ? <PlusCircle className="size-4" /> : <UserPlus className="size-4" />}{button}</button></div>;
}

function ActionButton({ children, label, danger = false, onClick }: { children: React.ReactNode; label: string; danger?: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-label={label} className={`grid size-9 place-items-center rounded-lg border border-[#b9cabc] transition hover:bg-white [&_svg]:size-4 ${danger ? "text-red-600" : "text-[#465148]"}`}>{children}</button>;
}

function TableFooter({ shown, total, noun, page, pageSize, canNext, onPageSizeChange, onPrevious, onNext }: { shown: number; total: number; noun: string; page: number; pageSize: number; canNext: boolean; onPageSizeChange: (size: number) => void; onPrevious: () => void; onNext: () => void }) {
  const start = shown ? page * pageSize + 1 : 0;
  const end = page * pageSize + shown;
  return <footer className="flex flex-col gap-2 border-t border-[#bdcdbf] px-5 py-3 text-[11px] text-[#536159] sm:flex-row sm:items-center"><p>Menampilkan {start}–{end} dari {total} {noun}</p><div className="flex flex-wrap items-center gap-2 sm:ml-auto"><label className="flex items-center gap-2">Baris:<select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))} className="rounded-full border border-[#bdcdbf] bg-white px-2 py-1 font-bold outline-none"><option value="5">5</option><option value="10">10</option><option value="20">20</option></select></label><button type="button" disabled={page === 0} onClick={onPrevious} className="rounded-full border border-[#bdcdbf] px-4 py-1.5 font-bold disabled:opacity-35">Sebelumnya</button><button type="button" disabled={!canNext} onClick={onNext} className="rounded-full border border-[#aebfae] px-4 py-1.5 font-bold disabled:opacity-35">Selanjutnya</button></div></footer>;
}

function SummaryCard({ icon, color, label, value }: { icon: React.ReactNode; color: string; label: string; value: string }) {
  return <div className="flex min-h-24 items-center gap-4 rounded-[22px] border border-[#d8e7df] bg-white p-5 shadow-sm"><span className={`grid size-12 shrink-0 place-items-center rounded-2xl [&_svg]:size-5 ${color}`}>{icon}</span><div className="min-w-0"><p className="text-xs font-medium text-[#667169]">{label}</p><p className="mt-1 truncate text-2xl font-extrabold tracking-[-0.025em]">{value}</p></div></div>;
}

function EditorModal({ editor, onClose, onSubmit }: { editor: Editor; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const isVehicle = editor.kind === "vehicle";
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"><form onSubmit={onSubmit} className="w-full max-w-md rounded-[26px] bg-white p-6 shadow-2xl"><div className="flex items-center"><h3 className="text-xl font-extrabold">{editor.item ? "Edit" : "Tambah"} {isVehicle ? "Armada" : "Petugas"}</h3><button type="button" onClick={onClose} className="ml-auto rounded-full p-2 hover:bg-slate-100"><X className="size-5" /></button></div>{isVehicle ? <div className="mt-5 space-y-4"><label className="block text-sm font-bold">ID Kendaraan<input name="id" required defaultValue={editor.item?.id ?? editor.draftId} className={inputClass} /></label><label className="block text-sm font-bold">Plat Nomor<input name="plate" required defaultValue={editor.item?.jenis} className={inputClass} /></label><label className="block text-sm font-bold">Kapasitas (ton)<input name="capacity" type="number" step="0.5" min="1" required defaultValue={editor.item ? editor.item.kapasitas / 1000 : 5} className={inputClass} /></label><label className="block text-sm font-bold">Status<select name="status" defaultValue="Beroperasi" className={inputClass}><option>Beroperasi</option><option>Maintenance</option></select></label></div> : <div className="mt-5 space-y-4"><label className="block text-sm font-bold">Nama Petugas<input name="name" required defaultValue={editor.item?.nama} className={inputClass} /></label><label className="block text-sm font-bold">ID Petugas<input name="id" required defaultValue={editor.item?.id ?? editor.draftId} className={inputClass} /></label><label className="block text-sm font-bold">Wilayah Tugas<input name="zone" required defaultValue={""} className={inputClass} /></label><label className="block text-sm font-bold">No. HP<input name="phone" type="tel" required defaultValue={editor.item?.no_hp} className={inputClass} /></label></div>}<button type="submit" className="mt-6 h-12 w-full rounded-xl bg-[#087529] text-sm font-bold text-white">Simpan</button></form></div>;
}

function DeleteModal({ target, onCancel, onConfirm }: { target: DeleteTarget; onCancel: () => void; onConfirm: () => void }) {
  return <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"><section role="alertdialog" aria-modal="true" className="w-full max-w-[380px] rounded-[24px] bg-white p-7 text-center shadow-2xl"><span className="mx-auto grid size-16 place-items-center rounded-full bg-red-100 text-red-600"><Trash2 className="size-8" /></span><h3 className="mt-5 text-lg font-extrabold">Hapus data?</h3><p className="mt-2 text-sm leading-relaxed text-[#667169]">{target.label} akan dihapus dan tidak dapat dikembalikan.</p><div className="mt-6 grid grid-cols-2 gap-3"><button type="button" autoFocus onClick={onCancel} className="h-11 rounded-xl border border-[#bdcdbf] text-sm font-bold">Batal</button><button type="button" onClick={onConfirm} className="h-11 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-700">Hapus</button></div></section></div>;
}
