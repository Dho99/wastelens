"use client";

import { ChevronRight, Download } from "lucide-react";
import { DlhShell } from "../components/dlh-shell";
import { useReportsPage, exportCsv } from "./hooks/use-reports-page";
import { ReportsStatCards } from "./components/reports-stat-cards";
import { ReportsFilters } from "./components/reports-filters";
import { ReportsTable } from "./components/reports-table";
import { ReportsPagination } from "./components/reports-pagination";
import { DeleteReportModal } from "./components/delete-report-modal";

export function ReportsPageClient() {
  const {
    query,
    status,
    date,
    selectedIds,
    page,
    perPage,
    pendingDeleteId,
    deletedReportId,
    reports,
    filtered,
    visibleReports,
    totalPages,
    visibleSelected,
    formattedDate,
    router,
    setFilter,
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
  } = useReportsPage();

  return (
    <DlhShell>
      <main className="min-h-0 flex-1 overflow-y-auto bg-[#f5fbfe] p-4 sm:p-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#53635a]">
                <span>Dashboard</span>
                <ChevronRight className="size-3" />
                <span>Kelola Laporan</span>
              </div>
              <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] sm:text-[30px]">
                Manajemen Laporan Sampah
              </h2>
            </div>
            <button
              type="button"
              onClick={() => exportCsv(filtered, selectedIds)}
              aria-label="Unduh laporan"
              className="grid size-12 shrink-0 place-items-center rounded-2xl border border-[#b8cbbd] bg-[#e8f5fc] text-[#3f5248] transition hover:bg-white"
            >
              <Download className="size-5" />
            </button>
          </div>

          <ReportsStatCards reports={reports} />

          <ReportsFilters
            query={query}
            status={status}
            date={date}
            formattedDate={formattedDate}
            onQueryChange={handleQueryChange}
            onStatusChange={setFilter}
            onDateChange={handleDateChange}
            onClearDate={() => {
              handleDateChange("");
            }}
          />

          <ReportsTable
            visibleReports={visibleReports}
            selectedIds={selectedIds}
            visibleSelected={visibleSelected}
            onToggleAll={toggleAll}
            onToggleSelected={toggleSelected}
            onView={(id) => router.push(`/dinas/reports/${id}`)}
            onRemove={removeReport}
          />

          {visibleReports.length > 0 && (
            <ReportsPagination
              page={page}
              perPage={perPage}
              totalItems={filtered.length}
              totalPages={totalPages}
              onPageChange={setPage}
              onPerPageChange={handlePerPageChange}
            />
          )}
        </div>
      </main>

      <DeleteReportModal
        pendingDeleteId={pendingDeleteId}
        deletedReportId={deletedReportId}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
        onDismiss={() => setDeletedReportId(null)}
      />
    </DlhShell>
  );
}
