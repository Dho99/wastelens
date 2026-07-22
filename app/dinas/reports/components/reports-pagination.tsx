import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function ReportsPagination({
  page,
  perPage,
  totalItems,
  totalPages,
  onPageChange,
  onPerPageChange,
}: Props) {
  const start = totalItems ? (page - 1) * perPage + 1 : 0;
  const end = Math.min(page * perPage, totalItems);

  return (
    <footer className="flex flex-col gap-4 border-t border-[#becdbf] px-6 py-4 text-xs text-[#536159] sm:flex-row sm:items-center">
      <p>
        Menampilkan {start}&ndash;{end} dari {totalItems || 0} laporan
      </p>
      <div className="ml-auto flex items-center gap-3">
        <label className="flex items-center gap-2">
          Baris per halaman:
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="rounded-full border border-[#b7c7bb] bg-[#edf7fb] px-3 py-1.5 outline-none"
          >
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </label>
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-full p-2 disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => onPageChange(item)}
            className={`grid size-8 place-items-center rounded-full font-bold ${page === item ? "bg-[#087529] text-white" : "hover:bg-[#e2f2ea]"}`}
          >
            {item}
          </button>
        ))}
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-full p-2 disabled:opacity-30"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </footer>
  );
}
