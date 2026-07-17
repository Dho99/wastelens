import React from "react";

export type FilterStatus = 'ALL' | 'PROSES' | 'SELESAI' | 'PERLU_DIPERIKSA';

interface FilterPillsProps {
  activeFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
}

export const FilterPills: React.FC<FilterPillsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const filters: { label: string; value: FilterStatus }[] = [
    { label: "Semua", value: "ALL" },
    { label: "Proses", value: "PROSES" },
    { label: "Selesai", value: "SELESAI" },
    { label: "Perlu Diperiksa", value: "PERLU_DIPERIKSA" },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto px-4 mb-4 scrollbar-none">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black transition-all duration-200 active:scale-95 ${
              isActive
                ? "bg-[#1E7D38] text-white shadow-sm shadow-emerald-700/10"
                : "bg-[#EFEFEA] text-gray-500 hover:bg-[#e4e4dd]"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};
