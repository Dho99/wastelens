"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { EntityKopdes } from "../../types/entities";

interface Props {
  kopdes: EntityKopdes | null;
  onClose: () => void;
  onSubmit: (id: string, nama: string, alamat: string) => Promise<void>;
}

export default function EditKopdesModal({ kopdes, onClose, onSubmit }: Props) {
  const [form, setForm] = useState({ nama: "", alamat: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama.trim() || !form.alamat.trim()) {
      toast.error("Mohon isi semua field");
      return;
    }
    if (!kopdes) return;
    setSubmitting(true);
    try {
      await onSubmit(kopdes.id, form.nama, form.alamat);
      toast.success("Koperasi berhasil diperbarui");
      onClose();
    } catch {
      toast.error("Gagal memperbarui koperasi");
    } finally {
      setSubmitting(false);
    }
  }

  if (!kopdes) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100 space-y-4">
        <div>
          <h3 className="text-lg font-black text-gray-805">Edit Koperasi</h3>
          <p className="text-xs text-gray-500 font-bold mt-0.5">Ubah nama dan alamat dari koperasi pengelola.</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Nama Koperasi</label>
            <input
              type="text" required
              defaultValue={kopdes.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Nama Koperasi"
              className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Alamat Lengkap</label>
            <textarea
              required rows={2}
              defaultValue={kopdes.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              placeholder="Alamat Koperasi"
              className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E7D38] resize-none"
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
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
