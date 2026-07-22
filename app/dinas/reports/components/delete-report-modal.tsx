import { Trash2, X } from "lucide-react";

interface Props {
  pendingDeleteId: string | null;
  deletedReportId: string | null;
  onCancel: () => void;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function DeleteReportModal({
  pendingDeleteId,
  deletedReportId,
  onCancel,
  onConfirm,
  onDismiss,
}: Props) {
  return (
    <>
      {pendingDeleteId && (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-[#26363d]/45 p-4 backdrop-blur-[3px]"
          role="presentation"
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-delete-title"
            className="w-full max-w-[380px] rounded-[24px] bg-white px-6 py-7 text-center shadow-2xl"
          >
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#ffd8d5] text-[#b60e18]">
              <Trash2 className="size-8" strokeWidth={2.5} />
            </div>
            <h2 id="confirm-delete-title" className="mt-5 text-lg font-extrabold text-[#26312a]">
              Hapus laporan?
            </h2>
            <p className="mx-auto mt-2 max-w-[310px] text-sm leading-relaxed text-[#667169]">
              Laporan{" "}
              <span className="font-bold text-[#c51c21]">#{pendingDeleteId}</span>{" "}
              akan dihapus permanen dan tidak dapat dikembalikan.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                autoFocus
                onClick={onCancel}
                className="h-11 rounded-xl border border-[#b9c7be] bg-white text-sm font-bold text-[#465148] transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="h-11 rounded-xl bg-[#c7191d] text-sm font-bold text-white transition hover:bg-[#aa1116]"
              >
                Hapus
              </button>
            </div>
          </section>
        </div>
      )}

      {deletedReportId && (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-[#26363d]/45 p-4 backdrop-blur-[3px]"
          role="presentation"
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="deleted-report-title"
            className="w-full max-w-[380px] rounded-[24px] bg-white px-6 py-7 text-center shadow-2xl"
          >
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#ffd8d5] text-[#a6000d]">
              <span className="relative">
                <Trash2 className="size-8 fill-current" strokeWidth={2.5} />
                <X
                  className="absolute left-1/2 top-[46%] size-4 -translate-x-1/2 -translate-y-1/2 text-white"
                  strokeWidth={4}
                />
              </span>
            </div>
            <p
              id="deleted-report-title"
              className="mx-auto mt-6 max-w-[320px] text-sm font-medium leading-relaxed text-[#465148]"
            >
              Data laporan{" "}
              <span className="text-[#c51c21]">#{deletedReportId}</span>{" "}
              telah dihapus<br className="hidden sm:block" /> permanen dari
              sistem operasional.
            </p>
            <button
              type="button"
              autoFocus
              onClick={onDismiss}
              className="mt-6 h-11 w-full rounded-xl bg-[#c7191d] text-sm font-semibold text-white transition hover:bg-[#aa1116] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-red-200"
            >
              Tutup
            </button>
          </section>
        </div>
      )}
    </>
  );
}
