"use client";

import { useRef, useState, useEffect } from "react";
import { Search, X, Navigation, Briefcase, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EstablishmentSuggestion {
  id: string;
  name: string;
  type: string;
  neighbourhood?: string;
  distance?: string;
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  nearbyCount?: number;
  onNearby?: () => void;
  establishmentSuggestions?: EstablishmentSuggestion[];
  neighbourhoodSuggestions?: string[];
  onSelectEstablishment?: (id: string) => void;
  onSelectNeighbourhood?: (neighbourhood: string) => void;
  placeholder?: string;
  showKbd?: boolean;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  nearbyCount,
  onNearby,
  establishmentSuggestions = [],
  neighbourhoodSuggestions = [],
  onSelectEstablishment,
  onSelectNeighbourhood,
  placeholder = "Search spots near you…",
  showKbd = false,
  className,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasSuggestions =
    focused &&
    (nearbyCount !== undefined || establishmentSuggestions.length > 0 || neighbourhoodSuggestions.length > 0);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(fn?: () => void) {
    fn?.();
    setFocused(false);
    inputRef.current?.blur();
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Input pill */}
      <div
        className="flex items-center gap-3 px-5"
        style={{
          height: 50,
          borderRadius: "var(--r-pill)",
          background: "var(--warm-white)",
          border: focused
            ? "1.5px solid var(--sage)"
            : "1.5px solid rgba(122,158,126,0.25)",
          boxShadow: focused ? "var(--focus-ring)" : "var(--shadow-sm)",
          transition: `border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)`,
        }}
      >
        <Search
          className="flex-shrink-0 w-[18px] h-[18px]"
          style={{ color: focused ? "var(--sage)" : "var(--ink-faint)" }}
        />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent focus:outline-none text-[15px] min-w-0"
          style={{
            color: value ? "var(--ink)" : "var(--ink-faint)",
            fontFamily: "inherit",
            fontWeight: 300,
          }}
        />

        {value ? (
          <button
            onMouseDown={(e) => {
              e.preventDefault(); // keep focus
              onChange("");
            }}
            aria-label="Clear search"
            className="flex-shrink-0 text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : showKbd ? (
          <kbd
            className="flex-shrink-0 text-[11px] text-[var(--ink-faint)] px-2 py-0.5 rounded-[6px] font-mono"
            style={{ background: "var(--mist)" }}
          >
            ⌘K
          </kbd>
        ) : null}
      </div>

      {/* Suggestions dropdown */}
      {hasSuggestions && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden"
          style={{
            background: "var(--warm-white)",
            borderRadius: "var(--r-lg)",
            border: "1px solid rgba(122,158,126,0.15)",
            boxShadow: "var(--shadow-float)",
          }}
        >
          {/* Nearby row — always first */}
          {nearbyCount !== undefined && onNearby && (
            <button
              onMouseDown={(e) => { e.preventDefault(); handleSelect(onNearby); }}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors"
              style={{
                background: "rgba(122,158,126,0.06)",
                borderBottom: "1px solid rgba(122,158,126,0.08)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(122,158,126,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(122,158,126,0.06)")}
            >
              <div
                className="w-[34px] h-[34px] flex items-center justify-center flex-shrink-0"
                style={{ borderRadius: "var(--r-sm)", background: "var(--sage)" }}
              >
                <Navigation className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[14px] font-medium" style={{ color: "var(--sage-deep)" }}>
                  Near you now
                </div>
                <div className="text-[12px]" style={{ color: "var(--ink-faint)" }}>
                  {nearbyCount} step-free spot{nearbyCount !== 1 ? "s" : ""} within 1km
                </div>
              </div>
            </button>
          )}

          {/* Establishment suggestions */}
          {establishmentSuggestions.map((est, i) => {
            const isLast =
              i === establishmentSuggestions.length - 1 && neighbourhoodSuggestions.length === 0;
            return (
              <button
                key={est.id}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(() => onSelectEstablishment?.(est.id)); }}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors"
                style={{
                  borderBottom: isLast ? "none" : "1px solid rgba(122,158,126,0.08)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--mist)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div
                  className="w-[34px] h-[34px] flex items-center justify-center flex-shrink-0"
                  style={{ borderRadius: "var(--r-sm)", background: "var(--mist)" }}
                >
                  <Briefcase className="w-4 h-4" style={{ color: "var(--ink-soft)" }} />
                </div>
                <div>
                  <div className="text-[14px]" style={{ color: "var(--ink-soft)" }}>
                    {est.name}
                  </div>
                  <div className="text-[12px]" style={{ color: "var(--ink-faint)" }}>
                    {[est.type, est.neighbourhood, est.distance].filter(Boolean).join(" · ")}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Neighbourhood suggestions */}
          {neighbourhoodSuggestions.map((n, i) => (
            <button
              key={n}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(() => onSelectNeighbourhood?.(n)); }}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors"
              style={{
                borderBottom: i < neighbourhoodSuggestions.length - 1 ? "1px solid rgba(122,158,126,0.08)" : "none",
                background: "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--mist)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div
                className="w-[34px] h-[34px] flex items-center justify-center flex-shrink-0"
                style={{ borderRadius: "var(--r-sm)", background: "var(--mist)" }}
              >
                <MapPin className="w-4 h-4" style={{ color: "var(--ink-soft)" }} />
              </div>
              <div>
                <div className="text-[14px]" style={{ color: "var(--ink-soft)" }}>
                  {n} neighbourhood
                </div>
                <div className="text-[12px]" style={{ color: "var(--ink-faint)" }}>
                  Neighbourhood · Toronto
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
