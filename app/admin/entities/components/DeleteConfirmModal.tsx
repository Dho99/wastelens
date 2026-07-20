"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  data: { id: string; name: string } | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export default function DeleteConfirmModal({ data, onClose, onConfirm }: Props) {
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    if (!data) return;
    setSubmitting(true);
    try {
      await onConfirm(data.id);
      toast.success("Entitas berhasil dihapus");
      onClose();
    } catch {
      toast.error("Gagal menghapus entitas");
    } finally {
      setSubmitting(false);
    }
  }

  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl border border-gray-100 space-y-4">
        <div className="flex items-center gap-3 text-red-500">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-gray-805">Hapus Entitas?</h3>
        </div>
        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
          Apakah Anda yakin ingin menghapus <strong>{data.name}</strong>? Tindakan ini bersifat permanen dan akan menghapus akun user yang terkait dengannya.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition"
          >Batal</button>
          <button onClick={handleConfirm} disabled={submitting}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
