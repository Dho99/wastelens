"use client";

import { useState } from "react";
import { ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { EntityUser } from "../../types/entities";

interface Props {
  user: EntityUser | null;
  onClose: () => void;
  onSubmit: (id: string, alasan: string) => Promise<void>;
}

export default function BlockUserModal({ user, onClose, onSubmit }: Props) {
  const [blockReason, setBlockReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await onSubmit(user.id, blockReason);
      toast.success("Akun berhasil dinonaktifkan");
      onClose();
      setBlockReason("");
    } catch {
      toast.error("Gagal menonaktifkan akun");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-gray-100 space-y-5 text-left">
        <div className="flex items-start gap-3.5 bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
          <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-gray-805">Nonaktifkan Akun?</h4>
            <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
              Tindakan ini akan membatasi akses <strong>{user.nama}</strong> ke seluruh layanan WasteLens secara permanen hingga diaktifkan kembali.
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Alasan Pemblokiran</label>
          <textarea
            required rows={3} value={blockReason}
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
          <button type="button" onClick={onClose}
            className="px-5 py-3 hover:bg-gray-100 text-gray-500 rounded-xl text-xs font-black transition"
          >Batal</button>
          <button type="submit" disabled={submitting}
            className="px-5 py-3 bg-[#E31E53] hover:bg-[#c11340] text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Konfirmasi Blokir
          </button>
        </div>
      </form>
    </div>
  );
}
