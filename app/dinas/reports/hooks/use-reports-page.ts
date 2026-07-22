import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useReports, useDeleteReport } from "@/app/dinas/hooks/useReports";
import type { DinasReport } from "@/lib/services/dinas/types";

export type ReportStatus = "Menunggu" | "Diproses" | "Selesai";

export const STATUS_DISPLAY: Record<string, string> = {
  WAITING: "Menunggu",
  PENDING: "Diproses",
  SELESAI: "Selesai",
};

export const STATUS_TO_API: Record<string, string | undefined> = {
  Semua: undefined,
  Menunggu: "WAITING",
  Diproses: "PENDING",
  Selesai: "SELESAI",
};

export const statusStyles: Record<ReportStatus, string> = {
  Menunggu: "bg-[#e6f2f8] text-[#4c5d54]",
  Diproses: "bg-[#d8f3e5] text-[#47705b]",
  Selesai: "bg-[#bfe4ca] text-[#087529]",
};

export function fd(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", timeZone: "UTC" }),
    year: d.getFullYear().toString(),
    time: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " WIB",
    isoDate: iso.slice(0, 10),
  };
}

export function exportCsv(filtered: DinasReport[], selectedIds: string[]) {
  const source = selectedIds.length
    ? filtered.filter((r) => selectedIds.includes(r.id))
    : filtered;
  const rows = [
    "ID,Tanggal,Waktu,Lokasi,Kategori,Status",
    ...source.map((report) => {
      const f = fd(report.createdAt);
      return `${report.id},${f.date} ${f.year},${f.time},${report.address_text ?? `${report.lokasi_lat?.toFixed(4)}, ${report.lokasi_lng?.toFixed(4)}`},${report.kategori_ukuran},${STATUS_DISPLAY[report.status] ?? report.status}`;
    }),
  ];
  const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "laporan-sampah-dlh.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function useReportsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"Semua" | ReportStatus>("Semua");
  const [date, setDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletedReportId, setDeletedReportId] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const { data: reportsData } = useReports({ status: STATUS_TO_API[status] });
  const deleteMutation = useDeleteReport();
  const reports = useMemo(() => reportsData ?? [], [reportsData]);

  const filtered = useMemo(
    () => reports.filter((report) => {
      const term = query.toLowerCase();
      const searchMatch = `${report.id} ${report.address_text ?? ""} ${report.district ?? ""}`.toLowerCase().includes(term);
      const dateMatch = !date || report.createdAt.slice(0, 10) === date;
      return searchMatch && dateMatch;
    }),
    [date, query, reports],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visibleReports = filtered.slice((page - 1) * perPage, page * perPage);
  const visibleSelected = visibleReports.length > 0 && visibleReports.every((r) => selectedIds.includes(r.id));

  const setFilter = (next: "Semua" | ReportStatus) => {
    setStatus(next);
    setPage(1);
  };

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") input.showPicker();
    else { input.focus(); input.click(); }
  };

  const formattedDate = date
    ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`))
    : "Pilih Tanggal";

  const toggleAll = () => {
    const visibleIds = visibleReports.map((r) => r.id);
    setSelectedIds((current) =>
      visibleSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : [...new Set([...current, ...visibleIds])],
    );
  };

  const toggleSelected = (id: string) =>
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  const removeReport = (id: string) => setPendingDeleteId(id);

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    const deletedId = pendingDeleteId;
    deleteMutation.mutate(deletedId);
    setSelectedIds((current) => current.filter((item) => item !== deletedId));
    setPendingDeleteId(null);
    setDeletedReportId(deletedId);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    setPage(1);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setPage(1);
  };

  return {
    query,
    status,
    date,
    selectedIds,
    page,
    perPage,
    pendingDeleteId,
    deletedReportId,
    dateInputRef,
    reports,
    filtered,
    visibleReports,
    totalPages,
    visibleSelected,
    formattedDate,
    router,
    deleteMutation,
    setFilter,
    openDatePicker,
    toggleAll,
    toggleSelected,
    removeReport,
    confirmDelete,
    setPendingDeleteId,
    setDeletedReportId,
    setPage,
    handleQueryChange,
    handleDateChange,
    handlePerPageChange,
    setStatus,
    setDate,
  };
}
