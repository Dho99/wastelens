"use client";

import { FormEvent, useMemo, useState } from "react";
import { Pencil, Plus, Search, ShieldCheck, Trash2, UserCheck, UserCog, X } from "lucide-react";
import { DlhShell } from "./dlh-shell";
import { updateDlhStore, useDlhStore } from "@/lib/dlh-store";

type Account = { id: number; name: string; initials: string; email: string; phone: string; role: "Petugas Lapangan" | "Operator DLH"; active: boolean };

export function AccountsManagement() {
  const accounts = useDlhStore().accounts as Account[];
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Account | null>(null);
  const [notice, setNotice] = useState("");

  const filtered = useMemo(() => accounts.filter((item) => `${item.name} ${item.email} ${item.role}`.toLowerCase().includes(query.toLowerCase())), [accounts, query]);
  const setAccounts = (update: (items: Account[]) => Account[]) => updateDlhStore((draft) => { draft.accounts = update(draft.accounts); });
  const toggleAccount = (id: number) => setAccounts((items) => items.map((item) => item.id === id ? { ...item, active: !item.active } : item));

  const addAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name"));
    const email = String(data.get("email")).trim().toLowerCase();
    if (accounts.some((item) => item.id !== editing?.id && item.email.toLowerCase() === email)) {
      setNotice("Email sudah digunakan oleh akun lain.");
      return;
    }
    const account: Account = { id: editing?.id ?? Date.now(), name, initials: name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(), email, phone: String(data.get("phone")), role: String(data.get("role")) as Account["role"], active: editing?.active ?? true };
    setAccounts((items) => editing ? items.map((item) => item.id === editing.id ? account : item) : [...items, account]);
    setModal(false);
    setEditing(null);
    setNotice(editing ? "Akun berhasil diperbarui." : "Akun baru berhasil dibuat.");
  };

  return (
    <DlhShell>
      <main className="min-h-0 flex-1 overflow-y-auto bg-[#f5fbfe] p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-7xl"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#39815a]">Access Control</p><h2 className="mt-1 text-2xl font-extrabold">Kelola Akun</h2><p className="mt-1 text-sm text-slate-500">Kelola petugas lapangan dan operator DLH.</p></div><button type="button" onClick={() => { setEditing(null); setModal(true); }} className="flex items-center justify-center gap-2 rounded-full bg-[#087529] px-5 py-3 text-sm font-bold text-white"><Plus className="size-4" /> Tambah Akun</button></div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-[#d8e7df] bg-white p-5"><UserCog className="size-5 text-[#087529]" /><p className="mt-3 text-xs text-slate-500">Total akun</p><p className="text-2xl font-extrabold">{accounts.length}</p></div><div className="rounded-2xl border border-[#d8e7df] bg-white p-5"><UserCheck className="size-5 text-[#087529]" /><p className="mt-3 text-xs text-slate-500">Aktif</p><p className="text-2xl font-extrabold">{accounts.filter((item) => item.active).length}</p></div><div className="rounded-2xl border border-[#d8e7df] bg-white p-5"><ShieldCheck className="size-5 text-[#087529]" /><p className="mt-3 text-xs text-slate-500">Operator</p><p className="text-2xl font-extrabold">{accounts.filter((item) => item.role === "Operator DLH").length}</p></div></div>

        {notice && <div role="status" className="mt-5 flex items-center rounded-2xl bg-[#def5e8] px-4 py-3 text-sm font-semibold text-[#166734]">{notice}<button type="button" onClick={() => setNotice("")} className="ml-auto"><X className="size-4" /></button></div>}

        <div className="mt-6 rounded-3xl border border-[#d8e7df] bg-white p-4 shadow-sm sm:p-6"><label className="flex max-w-md items-center gap-3 rounded-full border border-[#c5d2cb] px-4"><Search className="size-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 w-full bg-transparent text-sm outline-none" placeholder="Cari nama, email, atau role" /></label><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[820px] text-left"><thead><tr className="border-b text-xs uppercase tracking-wider text-slate-400"><th className="px-3 py-4">Pengguna</th><th className="px-3 py-4">Kontak</th><th className="px-3 py-4">Role</th><th className="px-3 py-4">Status</th><th className="px-3 py-4 text-right">Aksi</th></tr></thead><tbody>{filtered.map((account) => <tr key={account.id} className="border-b border-slate-100 last:border-0"><td className="px-3 py-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-[#d8f1e3] text-xs font-extrabold text-[#267248]">{account.initials}</span><div><p className="text-sm font-extrabold">{account.name}</p><p className="text-xs text-slate-400">{account.email}</p></div></div></td><td className="px-3 py-4 text-sm text-slate-600">{account.phone}</td><td className="px-3 py-4"><span className="rounded-full bg-[#edf5f1] px-3 py-1 text-xs font-bold text-[#486257]">{account.role}</span></td><td className="px-3 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${account.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{account.active ? "Aktif" : "Nonaktif"}</span></td><td className="px-3 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => { setEditing(account); setModal(true); }} title="Edit akun" className="rounded-full border p-2 hover:bg-slate-50"><Pencil className="size-4" /></button><button type="button" onClick={() => toggleAccount(account.id)} className={`rounded-full px-3 py-2 text-xs font-bold ${account.active ? "bg-red-50 text-red-600" : "bg-[#e3f5ea] text-[#087529]"}`}>{account.active ? "Nonaktifkan" : "Aktifkan"}</button><button type="button" onClick={() => setPendingDelete(account)} title="Hapus akun" className="rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50"><Trash2 className="size-4" /></button></div></td></tr>)}</tbody></table>{!filtered.length && <p className="py-10 text-center text-sm text-slate-500">Akun tidak ditemukan.</p>}</div></div>
      </div></main>

      {modal && <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/45 p-4"><form onSubmit={addAccount} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-center"><h3 className="text-xl font-extrabold">{editing ? "Edit Akun" : "Tambah Akun"}</h3><button type="button" onClick={() => { setModal(false); setEditing(null); }} className="ml-auto rounded-full p-2 hover:bg-slate-100"><X className="size-5" /></button></div><div className="mt-5 space-y-4"><label className="block text-sm font-bold">Nama Lengkap<input name="name" required defaultValue={editing?.name} className="mt-2 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]" /></label><label className="block text-sm font-bold">Email<input name="email" type="email" required defaultValue={editing?.email} className="mt-2 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]" /></label><label className="block text-sm font-bold">Nomor Telepon<input name="phone" required defaultValue={editing?.phone} className="mt-2 h-11 w-full rounded-xl border px-4 font-normal outline-none focus:border-[#087529]" /></label><label className="block text-sm font-bold">Role<select name="role" defaultValue={editing?.role ?? "Petugas Lapangan"} className="mt-2 h-11 w-full rounded-xl border bg-white px-4 font-normal outline-none focus:border-[#087529]"><option>Petugas Lapangan</option><option>Operator DLH</option></select></label></div><button className="mt-6 w-full rounded-full bg-[#087529] py-3 text-sm font-extrabold text-white">{editing ? "Simpan Perubahan" : "Buat Akun"}</button></form></div>}
      {pendingDelete && <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 p-4"><section role="alertdialog" aria-modal="true" className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl"><Trash2 className="mx-auto size-12 text-red-600" /><h3 className="mt-4 text-lg font-extrabold">Hapus akun?</h3><p className="mt-2 text-sm text-slate-500">Akun {pendingDelete.name} akan dihapus dari daftar akses DLH.</p><div className="mt-6 grid grid-cols-2 gap-3"><button type="button" onClick={() => setPendingDelete(null)} className="rounded-full border py-3 text-sm font-bold">Batal</button><button type="button" onClick={() => { setAccounts((items) => items.filter((item) => item.id !== pendingDelete.id)); setNotice("Akun berhasil dihapus."); setPendingDelete(null); }} className="rounded-full bg-red-600 py-3 text-sm font-bold text-white">Hapus</button></div></section></div>}
    </DlhShell>
  );
}
