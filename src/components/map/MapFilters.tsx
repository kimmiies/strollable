"use client";

import { cn } from "@/lib/utils";

interface MapFiltersProps {
  neighbourhoods: string[];
  activeNeighbourhood: string;
  onNeighbourhoodChange: (n: string) => void;
  className?: string;
}

export default function MapFilters({
  neighbourhoods,
  activeNeighbourhood,
  onNeighbourhoodChange,
  className,
}: MapFiltersProps) {
  const pills = [
    { value: "all", label: "All areas" },
    ...neighbourhoods.map((n) => ({ value: n, label: n })),
  ];

  return (
    <div className={cn("flex gap-2 overflow-x-auto no-scrollbar px-4 py-2.5", className)}>
      {pills.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onNeighbourhoodChange(value)}
          className={cn(
            "flex-shrink-0 px-3.5 py-1.5 rounded-[var(--r-pill)] text-[13px] transition-all",
            "border focus:outline-none min-h-[34px]",
            activeNeighbourhood === value
              ? "bg-[var(--ink)] text-white border-[var(--ink)]"
              : "bg-[var(--warm-white)] text-[var(--ink-soft)] border-[rgba(26,31,27,0.12)] hover:border-[var(--sage)] hover:text-[var(--sage-deep)]"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
