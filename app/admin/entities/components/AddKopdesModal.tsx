"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { KopdesForm } from "../../types/entities";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: KopdesForm) => Promise<void>;
}

export default function AddKopdesModal({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<KopdesForm>({ nama: "", alamat: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama.trim() || !form.alamat.trim() || !form.email.trim()) {
      toast.error("Mohon isi semua field");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(form);
      toast.success("Koperasi berhasil ditambahkan");
      onClose();
      setForm({ nama: "", alamat: "", email: "" });
    } catch {
      toast.error("Gagal menambahkan koperasi");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100 space-y-4">
        <div>
          <h3 className="text-lg font-black text-gray-805">Tambah Koperasi Baru</h3>
          <p className="text-xs text-gray-500 font-bold mt-0.5">Buat koperasi penukaran koin sampah baru.</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Nama Koperasi</label>
            <input
              type="text" required value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Contoh: Koperasi Harapan Sejahtera"
              className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Alamat Lengkap</label>
            <textarea
              required rows={2} value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              placeholder="Masukkan jalan, kecamatan, kota..."
              className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38] resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Email Akun</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Contoh: kopdes.sejahtera@email.com"
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
