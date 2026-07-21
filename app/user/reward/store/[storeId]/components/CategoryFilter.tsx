import React from "react";

export type StoreCategoryFilter = 'ALL' | 'SEMBAKO' | 'KEBERSIHAN';

interface CategoryFilterProps {
  activeFilter: StoreCategoryFilter;
  onFilterChange: (filter: StoreCategoryFilter) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const filters: { label: string; value: StoreCategoryFilter }[] = [
    { label: "Semua", value: "ALL" },
    { label: "Sembako", value: "SEMBAKO" },
    { label: "Kebutuhan Mandi", value: "KEBERSIHAN" },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto px-4 mb-5 scrollbar-none">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black transition-all duration-200 active:scale-95 border ${
              isActive
                ? "bg-[#287A38] border-[#287A38] text-white shadow-sm"
                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};
