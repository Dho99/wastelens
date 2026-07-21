"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

type Dropdown = "vehicle" | "officer" | null;

interface Props {
    type: Exclude<Dropdown, null>;
    label: string;
    placeholder: string;
    active: Dropdown;
    onToggle: (type: Exclude<Dropdown, null>) => void;
    selected: string;
    onSelect: (id: string) => void;
    vehicles: { id: string; name: string; meta: string }[];
    officers: { id: string; initials: string; name: string; meta: string }[];
}

export function DropdownField({
    type,
    label,
    placeholder,
    active,
    onToggle,
    selected,
    onSelect,
    vehicles,
    officers,
}: Props) {
    const isOpen = active === type;
    const selectedItem =
        type === "vehicle"
            ? vehicles.find((item) => item.id === selected)
            : officers.find((item) => item.id === selected);

    return (
        <div className="relative">
            <label className="mb-2 block text-sm font-bold text-[#1f2924]">
                {label}
            </label>
            <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => onToggle(type)}
                className={`flex h-[47px] w-full items-center justify-between rounded-full border bg-white px-4 text-left text-sm transition-colors ${
                    isOpen ? "border-2 border-[#08752a]" : "border-[#859287]"
                }`}
            >
                <span className="truncate">
                    {selectedItem?.name ?? placeholder}
                </span>
                {isOpen ? (
                    <ChevronUp className="size-4 shrink-0" />
                ) : (
                    <ChevronDown className="size-4 shrink-0 text-[#657269]" />
                )}
            </button>

            {isOpen && (
                <div className="absolute inset-x-0 top-[77px] z-30 overflow-hidden rounded-[24px] border border-[#b9c7bd] bg-white py-1 shadow-[0_12px_28px_rgba(24,46,34,0.2)]">
                    {type === "vehicle"
                        ? vehicles.map((item) => (
                              <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => onSelect(item.id)}
                                  className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-[#f1faf5]"
                              >
                                  <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-extrabold">
                                          {item.name}
                                      </p>
                                      <p className="truncate text-[11px] text-[#667168]">
                                          {item.meta}
                                      </p>
                                  </div>
                                  <span className="size-2 rounded-full bg-[#08752a]" />
                              </button>
                          ))
                        : officers.map((item) => (
                              <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => onSelect(item.id)}
                                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#f1faf5]"
                              >
                                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#c9eed9] text-xs font-bold text-[#4b8b69]">
                                      {item.initials}
                                  </span>
                                  <div className="min-w-0">
                                      <p className="truncate text-sm font-extrabold">
                                          {item.name}
                                      </p>
                                      <p className="truncate text-[10px] text-[#187234]">
                                          {item.meta}
                                      </p>
                                  </div>
                              </button>
                          ))}
                </div>
            )}
        </div>
    );
}
