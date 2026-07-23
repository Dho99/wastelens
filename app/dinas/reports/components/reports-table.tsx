import { Eye, MapPin, Trash2 } from "lucide-react";
import type { DinasReport } from "@/lib/services/dinas/types";
import type { ReportStatus } from "../hooks/use-reports-page";
import { STATUS_DISPLAY, statusStyles, fd } from "../hooks/use-reports-page";

interface Props {
  visibleReports: DinasReport[];
  selectedIds: string[];
  visibleSelected: boolean;
  onToggleAll: () => void;
  onToggleSelected: (id: string) => void;
  onView: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ReportsTable({
  visibleReports,
  selectedIds,
  visibleSelected,
  onToggleAll,
  onToggleSelected,
  onView,
  onRemove,
}: Props) {
  if (!visibleReports.length) {
    return (
      <section className="mt-6 overflow-hidden rounded-[24px] border border-[#b7cbbd] bg-white/35">
        <div className="py-14 text-center text-sm text-[#68756e]">
          Tidak ada laporan yang cocok.
        </div>
      </section>
    );
  }

  return (
    <section className="mt-6 overflow-hidden rounded-[24px] border border-[#b7cbbd] bg-white/35">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead className="bg-[#deeff8] text-xs font-extrabold uppercase tracking-wide text-[#4c5d54]">
            <tr>
              <th className="w-16 px-6 py-5">
                <input
                  type="checkbox"
                  checked={visibleSelected}
                  onChange={onToggleAll}
                  className="size-5 accent-[#087529]"
                  aria-label="Pilih semua laporan"
                />
              </th>
              <th className="px-4 py-5">ID Laporan</th>
              <th className="px-4 py-5">Tanggal</th>
              <th className="px-4 py-5">Lokasi</th>
              <th className="px-4 py-5">Kategori Sampah</th>
              <th className="px-4 py-5">Status</th>
              <th className="px-4 py-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visibleReports.map((report) => {
              const f = fd(report.createdAt);
              return (
                <tr key={report.id} className="border-t border-[#becdbf] text-sm">
                  <td className="px-6 py-6">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(report.id)}
                      onChange={() => onToggleSelected(report.id)}
                      className="size-5 accent-[#087529]"
                      aria-label={`Pilih ${report.id}`}
                    />
                  </td>
                  <td className="px-4 py-6 font-extrabold text-[#087529]">
                    #{report.id}
                  </td>
                  <td className="px-4 py-6">
                    <p className="font-semibold">
                      {f.date}
                      <br />
                      {f.year}
                    </p>
                    <p className="text-xs text-[#68756e]">{f.time}</p>
                  </td>
                  <td className="px-4 py-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 size-5 shrink-0 text-[#087529]" />
                      <div>
                        <p className="font-semibold">
                          {report.address_text ?? `${report.lokasi_lat?.toFixed(4)}, ${report.lokasi_lng?.toFixed(4)}`}
                        </p>
                        <p className="text-xs text-[#68756e]">{report.district}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-6">
                    <span
                      className={`inline-block min-w-20 rounded-full px-3 py-1 text-center text-[10px] font-extrabold ${report.kategori_ukuran === "BAHAYA" ? "bg-red-600 text-white" : "bg-[#bcebd1] text-[#47705b]"}`}
                    >
                      {report.kategori_ukuran}
                    </span>
                  </td>
                  <td className="px-4 py-6">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[STATUS_DISPLAY[report.status] as ReportStatus] ?? ""}`}
                    >
                      <span
                        className={`size-2 rounded-full ${STATUS_DISPLAY[report.status] === "Selesai" ? "bg-[#087529]" : "bg-[#698174]"}`}
                      />
                      {STATUS_DISPLAY[report.status] ?? report.status}
                    </span>
                  </td>
                  <td className="px-4 py-6">
                    <div className="flex justify-center gap-4">
                      <button
                        type="button"
                        onClick={() => onView(report.id)}
                        aria-label={`Lihat ${report.id}`}
                        className="rounded-full p-2 text-[#46594f] hover:bg-[#deeff8]"
                      >
                        <Eye className="size-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(report.id)}
                        aria-label={`Hapus ${report.id}`}
                        className="rounded-full p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
