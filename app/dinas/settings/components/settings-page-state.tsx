import { AlertTriangle, Loader2, Settings2 } from "lucide-react";
import { DlhShell } from "../../components/dlh-shell";

export function SettingsHeader() {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#39815a]">
          <Settings2 className="size-4" />
          Konfigurasi Portal
        </div>
        <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-[#17231d]">
          Pengaturan
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#68756e]">
          Kelola identitas instansi dan wilayah operasional dari satu tempat.
        </p>
      </div>
      <div className="flex items-center gap-2 self-start rounded-full border border-[#cfe0d6] bg-white px-3 py-2 text-xs font-bold text-[#287346] shadow-sm sm:self-auto">
        <span className="size-2 rounded-full bg-[#22a653]" />
        Sistem aktif
      </div>
    </header>
  );
}

export function SettingsLoading() {
  return (
    <DlhShell>
      <div className="flex flex-1 items-center justify-center bg-[#f4fbff] text-[#087529]">
        <div className="text-center">
          <Loader2 className="mx-auto size-8 animate-spin" />
          <p className="mt-3 text-sm font-semibold">Memuat pengaturan...</p>
        </div>
      </div>
    </DlhShell>
  );
}

export function SettingsError({ onRetry }: { onRetry: () => void }) {
  return (
    <DlhShell>
      <div className="flex flex-1 items-center justify-center bg-[#f4fbff] p-6">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertTriangle className="mx-auto size-10 text-red-500" />
          <h2 className="mt-4 text-lg font-extrabold text-slate-900">
            Pengaturan gagal dimuat
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Terjadi kendala saat mengambil konfigurasi portal.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 rounded-full bg-[#087529] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#066221]"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </DlhShell>
  );
}
