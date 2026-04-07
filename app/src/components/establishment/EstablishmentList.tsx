"use client";

import type { Establishment } from "@/types";
import EstablishmentCard from "./EstablishmentCard";
import { useSaved } from "@/hooks/useSaved";

interface EstablishmentListProps {
  establishments: Establishment[];
  loading?: boolean;
  selectedPlaceId?: string | null;
  onSelect?: (establishment: Establishment) => void;
  /** Use a 2-column grid instead of a single column */
  grid?: boolean;
}

export default function EstablishmentList({
  establishments,
  loading,
  selectedPlaceId,
  onSelect,
  grid = false,
}: EstablishmentListProps) {
  const { savedIds, toggle } = useSaved();

  if (loading) {
    return (
      <div className={grid ? "grid grid-cols-2 gap-3 p-4" : "px-4 space-y-3 pt-2"}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden animate-pulse"
          >
            <div className="h-40 bg-zinc-100" />
            <div className="p-3.5 space-y-2">
              <div className="h-4 bg-zinc-100 rounded w-3/4" />
              <div className="h-3 bg-zinc-100 rounded w-1/2" />
              <div className="flex gap-1.5">
                <div className="h-5 bg-zinc-100 rounded-full w-16" />
                <div className="h-5 bg-zinc-100 rounded-full w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!establishments.length) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-4xl mb-3">🗺️</p>
        <h3 className="font-semibold text-[var(--foreground)] mb-1">
          No places found
        </h3>
        <p className="text-sm text-[var(--muted-foreground)]">
          Try a different filter or search term.
        </p>
      </div>
    );
  }

  if (grid) {
    return (
      <div className="grid grid-cols-2 gap-3 p-4">
        {establishments.map((establishment) => (
          <EstablishmentCard
            key={establishment.id}
            establishment={establishment}
            isSaved={savedIds.has(establishment.place_id)}
            onSaveToggle={toggle}
            isSelected={selectedPlaceId === establishment.place_id}
            onClick={() => onSelect?.(establishment)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 space-y-3 pt-2 pb-4">
      {establishments.map((establishment) => (
        <EstablishmentCard
          key={establishment.id}
          establishment={establishment}
          isSaved={savedIds.has(establishment.place_id)}
          onSaveToggle={toggle}
          isSelected={selectedPlaceId === establishment.place_id}
          onClick={() => onSelect?.(establishment)}
        />
      ))}
    </div>
  );
}
