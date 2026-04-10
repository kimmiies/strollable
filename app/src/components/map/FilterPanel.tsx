"use client";

import { useEffect } from "react";
import { X, Footprints, LockOpen, Baby, Armchair, DoorOpen, Navigation, Sofa, User, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMapStore } from "@/stores/mapStore";
import { FEATURE_LABELS, type FeatureType } from "@/types";

const TYPES = [
  { value: "all",        label: "All types"   },
  { value: "cafe",       label: "Café"        },
  { value: "restaurant", label: "Restaurant"  },
  { value: "bakery",     label: "Bakery"      },
  { value: "bar",        label: "Bar"         },
  { value: "other",      label: "Other"       },
];

const FEATURES: { value: FeatureType; Icon: LucideIcon }[] = [
  { value: "step_free_entrance",       Icon: Footprints },
  { value: "accessible_bathroom",      Icon: LockOpen   },
  { value: "change_table",             Icon: Baby       },
  { value: "high_chairs",              Icon: Armchair   },
  { value: "auto_door_opener",         Icon: DoorOpen   },
  { value: "stroller_friendly_layout", Icon: Navigation },
  { value: "booster_seats",            Icon: Sofa       },
  { value: "change_table_mens",        Icon: User       },
  { value: "change_table_family",      Icon: Users      },
];

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  neighbourhoods: string[];
  /** Live count of establishments matching the current filters — shown in the footer CTA */
  filteredCount: number;
}

export default function FilterPanel({
  isOpen,
  onClose,
  neighbourhoods,
  filteredCount,
}: FilterPanelProps) {
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

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  function handleClearAll() {
    clearAllFilters();
    onClose();
  }

  if (!isOpen) return null;

  const spotLabel = `${filteredCount} spot${filteredCount !== 1 ? "s" : ""}`;

  return (
    /* Full-screen backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="relative w-full sm:w-[580px] sm:max-h-[85vh] flex flex-col"
        style={{
          background: "var(--warm-white)",
          borderRadius: "var(--r-xl) var(--r-xl) 0 0",
          boxShadow: "var(--shadow-float)",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(26,31,27,0.15)" }} />
        </div>

        {/* Header — title + close only, no Clear all here */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(122,158,126,0.12)" }}
        >
          <h2 className="font-display font-normal text-xl tracking-[-0.02em] text-[var(--ink)]">
            Filter spots
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[var(--mist)] text-[var(--ink-faint)]"
            aria-label="Close filters"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto min-h-0">

          {/* ── Strollability features ── */}
          <section className="px-6 py-6" style={{ borderBottom: "6px solid var(--cream)" }}>
            <div
              className="text-[10px] tracking-[.14em] uppercase mb-4 flex items-center gap-2"
              style={{ color: "var(--ink-faint)" }}
            >
              <Footprints className="w-3 h-3" />
              Strollability features
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {FEATURES.map(({ value, Icon }) => {
                const active = activeFeatureFilters.includes(value);
                return (
                  <button
                    key={value}
                    onClick={() => toggleFeatureFilter(value)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-[var(--r-md)] border-[1.5px] transition-all text-left",
                      active
                        ? "border-[var(--sage-deep)] bg-[var(--mist)]"
                        : "border-[rgba(122,158,126,0.2)] bg-[var(--warm-white)] hover:border-[var(--sage)]"
                    )}
                  >
                    <div
                      className="w-9 h-9 rounded-[var(--r-sm)] flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        background: active ? "var(--sage-deep)" : "var(--mist)",
                        color: active ? "white" : "var(--ink-soft)",
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] text-[var(--ink-soft)] leading-snug">
                      {FEATURE_LABELS[value]}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Establishment type ── */}
          <section className="px-6 py-6" style={{ borderBottom: "6px solid var(--cream)" }}>
            <div
              className="text-[10px] tracking-[.14em] uppercase mb-4"
              style={{ color: "var(--ink-faint)" }}
            >
              Establishment type
            </div>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(({ value, label }) => {
                const active = activeTypeFilter === value;
                return (
                  <button
                    key={value}
                    onClick={() => setActiveTypeFilter(value)}
                    className={cn(
                      "px-4 py-2 rounded-[var(--r-pill)] text-sm border-[1.5px] transition-all",
                      active
                        ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                        : "bg-[var(--warm-white)] text-[var(--ink-soft)] border-[rgba(26,31,27,0.12)] hover:border-[var(--sage)] hover:text-[var(--sage-deep)]"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Neighbourhood ── */}
          {neighbourhoods.length > 0 && (
            <section className="px-6 py-6">
              <div
                className="text-[10px] tracking-[.14em] uppercase mb-4"
                style={{ color: "var(--ink-faint)" }}
              >
                Neighbourhood
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[{ value: "all", label: "All areas" }, ...neighbourhoods.map((n) => ({ value: n, label: n }))].map(
                  ({ value, label }) => {
                    const active = activeNeighbourhood === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setActiveNeighbourhood(value)}
                        className={cn(
                          "py-2.5 px-4 rounded-[var(--r-md)] text-sm border-[1.5px] transition-all text-center",
                          active
                            ? "bg-[var(--mist)] border-[var(--sage)] text-[var(--sage-deep)]"
                            : "bg-[var(--warm-white)] text-[var(--ink-soft)] border-[rgba(26,31,27,0.1)] hover:border-[var(--sage)] hover:text-[var(--sage-deep)]"
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
        </div>

        {/* Sticky footer — Clear all bottom-left, CTA bottom-right */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(122,158,126,0.12)" }}
        >
          {activeCount > 0 ? (
            <button
              onClick={handleClearAll}
              className="text-sm text-[var(--ink-soft)] underline underline-offset-2 transition-colors hover:text-[var(--ink)]"
            >
              Clear all
            </button>
          ) : (
            <span />
          )}
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-[var(--r-pill)] text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--ink)" }}
          >
            Show {spotLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
