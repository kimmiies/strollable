"use client";

import { X, Check, Footprints, LockOpen, Baby, Armchair, DoorOpen, Navigation, Sofa, User, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMapStore } from "@/stores/mapStore";
import { FEATURE_LABELS, type FeatureType } from "@/types";

const TYPES = [
  { value: "all", label: "All types" },
  { value: "cafe", label: "Café" },
  { value: "restaurant", label: "Restaurant" },
  { value: "bakery", label: "Bakery" },
  { value: "bar", label: "Bar" },
  { value: "other", label: "Other" },
];

const FEATURES: { value: FeatureType; Icon: LucideIcon }[] = [
  { value: "step_free_entrance",       Icon: Footprints },
  { value: "accessible_bathroom",      Icon: LockOpen },
  { value: "change_table",             Icon: Baby },
  { value: "high_chairs",              Icon: Armchair },
  { value: "auto_door_opener",         Icon: DoorOpen },
  { value: "stroller_friendly_layout", Icon: Navigation },
  { value: "booster_seats",            Icon: Sofa },
  { value: "change_table_mens",        Icon: User },
  { value: "change_table_family",      Icon: Users },
];

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  neighbourhoods: string[];
}

export default function FilterPanel({ isOpen, onClose, neighbourhoods }: FilterPanelProps) {
  const {
    activeTypeFilter,
    activeNeighbourhood,
    activeFeatureFilters,
    setActiveTypeFilter,
    setActiveNeighbourhood,
    toggleFeatureFilter,
    clearAllFilters,
  } = useMapStore();

  const activeCount =
    (activeTypeFilter !== "all" ? 1 : 0) +
    (activeNeighbourhood !== "all" ? 1 : 0) +
    activeFeatureFilters.length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-80 flex flex-col" style={{ background: "var(--warm-white)", boxShadow: "var(--shadow-float)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(122,158,126,0.15)]">
          <h2 className="font-display font-normal text-xl tracking-[-0.02em] text-[var(--ink)]">Filters</h2>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-[var(--primary)] font-medium hover:underline"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
              aria-label="Close filters"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

          {/* Establishment type */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] mb-3">
              Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(({ value, label }) => {
                const active = activeTypeFilter === value;
                return (
                  <button
                    key={value}
                    onClick={() => setActiveTypeFilter(value)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all",
                      active
                        ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                        : "bg-[var(--warm-white)] text-[var(--ink-soft)] border-[rgba(26,31,27,0.1)] hover:border-[var(--sage)] hover:text-[var(--sage-deep)]"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Neighbourhood */}
          {neighbourhoods.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] mb-3">
                Neighbourhood
              </h3>
              <div className="flex flex-wrap gap-2">
                {[{ value: "all", label: "All areas" }, ...neighbourhoods.map((n) => ({ value: n, label: n }))].map(
                  ({ value, label }) => {
                    const active = activeNeighbourhood === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setActiveNeighbourhood(value)}
                        className={cn(
                          "px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all",
                          active
                            ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                            : "bg-white text-[var(--foreground)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                        )}
                      >
                        {label}
                      </button>
                    );
                  }
                )}
              </div>
            </section>
          )}

          {/* Baby-friendly features */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] mb-1">
              Baby-friendly features
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mb-3">
              Show only places with these confirmed features
            </p>
            <div className="space-y-2">
              {FEATURES.map(({ value, Icon }) => {
                const active = activeFeatureFilters.includes(value);
                return (
                  <button
                    key={value}
                    onClick={() => toggleFeatureFilter(value)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-[var(--r-md)] border-[1.5px] transition-all text-left",
                      active
                        ? "border-[var(--sage)] bg-[var(--mist)]"
                        : "border-[rgba(26,31,27,0.1)] bg-[var(--warm-white)] hover:border-[var(--sage-light)]"
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0 text-[var(--sage-deep)]" />
                    <span className="flex-1 text-sm font-medium">{FEATURE_LABELS[value]}</span>
                    {active && <Check className="w-4 h-4 text-green-600" />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
