"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { DinasForm } from "../../types/entities";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DinasForm) => Promise<void>;
}

export default function AddDinasModal({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<DinasForm>({ nama_dinas: "", kontak: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama_dinas.trim() || !form.kontak.trim() || !form.email.trim()) {
      toast.error("Mohon isi semua field");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(form);
      toast.success("Dinas berhasil ditambahkan");
      onClose();
      setForm({ nama_dinas: "", kontak: "", email: "" });
    } catch {
      toast.error("Gagal menambahkan dinas");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100 space-y-4">
        <div>
          <h3 className="text-lg font-black text-gray-805">Tambah Dinas Baru</h3>
          <p className="text-xs text-gray-500 font-bold mt-0.5">Buat entitas dinas kebersihan operasional baru.</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Nama Dinas</label>
            <input
              type="text" required value={form.nama_dinas}
              onChange={(e) => setForm({ ...form, nama_dinas: e.target.value })}
              placeholder="Contoh: DLH Kota Semarang"
              className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Kontak Dinas</label>
            <input
              type="text" required value={form.kontak}
              onChange={(e) => setForm({ ...form, kontak: e.target.value })}
              placeholder="Contoh: 024-7654321"
              className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Email Akun</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Contoh: admin.dlh@semarang.go.id"
              className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition"
          >Batal</button>
          <button type="submit" disabled={submitting}
            className="px-4 py-2 bg-[#1E7D38] hover:bg-[#18652d] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Tambah
          </button>
        </div>
      </form>
    </div>
  );
}
