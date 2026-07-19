import React from "react";
import { FunnelIcon } from "lucide-react";

interface HistorySearchProps {
    value: string;
    onChange: (val: string) => void;
    onFilterClick?: () => void;
}

export const HistorySearch: React.FC<HistorySearchProps> = ({
    value,
    onChange,
    onFilterClick,
}) => {
    return (
        <div className="px-4 mb-6 flex gap-3 items-center">
            {/* Search Input bar */}
            <div className="relative flex-1">
                <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                    {/* MDI magnify */}
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                    </svg>
                </span>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Cari item atau merchant..."
                    className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-semibold placeholder-gray-400 text-gray-800 shadow-sm"
                />
            </div>

            {/* Filter square button */}
            <button
                onClick={onFilterClick}
                className="w-12 h-12 rounded-2xl bg-white border border-gray-150 flex items-center justify-center text-gray-650 shadow-sm active:scale-95 transition-all duration-200"
                aria-label="Filter"
            >
                {/* MDI tune */}
                <FunnelIcon className="w-5 h-5" />
            </button>
        </div>
    );
};
