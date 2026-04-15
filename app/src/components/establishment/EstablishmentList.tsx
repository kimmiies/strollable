"use client";

import { SearchX } from "lucide-react";
import type { Establishment } from "@/types";
import EstablishmentCard from "./EstablishmentCard";
import EmptyState from "@/components/ui/EmptyState";
import { useSaved } from "@/hooks/useSaved";
import { useMapStore } from "@/stores/mapStore";

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
  const clearAllFilters = useMapStore((s) => s.clearAllFilters);

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
      <div className="px-4 py-8">
        <EmptyState
          Icon={SearchX}
          title="No spots found"
          body="Try widening your filters or searching a different neighbourhood."
          actionLabel="Clear filters"
          onAction={clearAllFilters}
        />
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
