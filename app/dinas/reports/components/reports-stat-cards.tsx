import { CheckCircle2, FileWarning, RefreshCw } from "lucide-react";
import type { DinasReport } from "@/lib/services/dinas/types";

interface Props {
  reports: DinasReport[];
}

export function ReportsStatCards({ reports }: Props) {
  const masuk = reports.length;
  const diproses = reports.filter((r) => r.status === "PENDING").length;
  const selesai = reports.filter((r) => r.status === "SELESAI").length;

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      <div className="flex items-center gap-4 rounded-[22px] border border-[#b7cbbd] bg-white p-5">
        <span className="grid size-12 place-items-center rounded-2xl bg-[#d4ecec] text-[#087529]">
          <FileWarning className="size-5" />
        </span>
        <div>
          <p className="text-xs text-[#68756e]">Laporan Masuk</p>
          <p className="text-2xl font-extrabold">{masuk}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 rounded-[22px] border border-[#b7cbbd] bg-white p-5">
        <span className="grid size-12 place-items-center rounded-2xl bg-[#bcebd1] text-[#47705b]">
          <RefreshCw className="size-5" />
        </span>
        <div>
          <p className="text-xs text-[#68756e]">Sedang Diproses</p>
          <p className="text-2xl font-extrabold">{diproses}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 rounded-[22px] border border-[#b7cbbd] bg-white p-5">
        <span className="grid size-12 place-items-center rounded-2xl bg-[#258237] text-white">
          <CheckCircle2 className="size-5" />
        </span>
        <div>
          <p className="text-xs text-[#68756e]">Terselesaikan</p>
          <p className="text-2xl font-extrabold">{selesai}</p>
        </div>
      </div>
    </div>
  );
}
