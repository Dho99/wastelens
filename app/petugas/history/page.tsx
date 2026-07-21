"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@mdi/react";
import {
  mdiMagnify,
  mdiChevronRight,
  mdiScaleBalance,
} from "@mdi/js";
import { usePetugasHistory, type HistoryTask } from "../hooks/useHistory";

type FilterKey = "all" | "today" | "week";

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "today", label: "Hari Ini" },
  { key: "week", label: "Minggu Ini" },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PetugasHistoryPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const { data, isLoading, isError, error, refetch } = usePetugasHistory({
    search: search || undefined,
    filter: filter === "all" ? undefined : filter,
  });

  const handleSearch = () => {
    setSearch(searchInput.trim());
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  // --- Loading state ---
  if (isLoading) {
    return (
      <div className="min-h-screen pb-8 font-sans">
        <div className="space-y-6 py-4">
          <div className="h-12 animate-pulse rounded-xl bg-neutral-100" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-neutral-100" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 animate-pulse rounded-xl bg-neutral-100" />
            <div className="h-20 animate-pulse rounded-xl bg-neutral-100" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-neutral-100" />
          ))}
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (isError || !data) {
    return (
      <div className="min-h-screen pb-8 font-sans">
        <div className="py-8 text-center">
          <p className="text-sm font-medium text-red-800">
            {error instanceof Error ? error.message : "Gagal memuat riwayat"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const { tasks, summary } = data;

  return (
    <div className="min-h-screen pb-8 font-sans">
      <div className="space-y-6 py-4">
        {/* Search Input */}
        <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-3 shadow-sm">
          <Icon path={mdiMagnify} className="h-5 w-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Cari alamat atau ID tugas..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="flex-1 border-none bg-transparent text-[14px] text-neutral-800 outline-none placeholder:text-neutral-400"
          />
          {searchInput && (
            <button
              onClick={handleSearch}
              className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-white"
            >
              Cari
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`whitespace-nowrap rounded-full px-5 py-1.5 text-sm font-medium shadow-sm ${
                filter === opt.key
                  ? "bg-primary text-white"
                  : "border border-neutral-300 bg-white text-neutral-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col justify-center rounded-xl bg-primary/20 p-4 shadow-sm">
            <p className="mb-1 text-sm font-medium text-[#4a7759]">Total Tugas</p>
            <p className="text-2xl font-bold text-[#4e342e]">
              {summary.total_tasks}
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-xl bg-primary/20 p-4 shadow-sm">
            <p className="mb-1 text-sm font-medium text-[#3e684a]">Estimasi Beban</p>
            <p className="text-2xl font-bold text-[#1b5e20]">
              {summary.total_load}{" "}
              <span className="text-[14px] font-semibold">Unit</span>
            </p>
          </div>
        </div>

        {/* List Section */}
        <section>
          <h3 className="mb-3 font-bold text-neutral-800">Selesai Baru-baru Ini</h3>

          {tasks.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-neutral-200 p-8 text-center">
              <p className="text-sm font-medium text-neutral-500">
                Belum ada tugas selesai
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Riwayat akan muncul setelah Anda menyelesaikan tugas
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <HistoryCard
                  key={task.id}
                  task={task}
                  onClick={() => router.push(`/petugas/history/${task.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function HistoryCard({
  task,
  onClick,
}: {
  task: HistoryTask;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full flex-col rounded-xl border border-neutral-200 bg-white p-3.5 text-left shadow-sm transition-colors hover:border-emerald-300"
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span className="rounded-full bg-primary px-2 py-1 text-xs font-bold text-white">
          SELESAI
        </span>
        <span className="text-sm font-medium text-neutral-500">
          {formatDate(task.updatedAt)}
        </span>
      </div>

      <div className="mt-1 flex items-center justify-between">
        <h4 className="font-bold text-neutral-800">{task.address}</h4>
        <Icon path={mdiChevronRight} className="h-5 w-5 text-neutral-400" />
      </div>

      <div className="mt-1 flex items-center gap-1.5 text-neutral-600">
        <Icon path={mdiScaleBalance} className="h-4 w-4" />
        <span className="text-sm font-medium">
          {task.estimated_load_unit != null
            ? `${task.estimated_load_unit} Unit`
            : task.kategori_ukuran}
        </span>
      </div>
    </button>
  );
}
