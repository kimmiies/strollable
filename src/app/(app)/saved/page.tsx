"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/layout/TopBar";
import EstablishmentCard from "@/components/establishment/EstablishmentCard";
import { useSaved } from "@/hooks/useSaved";
import { isDemoMode } from "@/lib/demo";
import type { Establishment } from "@/types";

export default function SavedPage() {
  const { savedIds, toggle } = useSaved();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      setEstablishments([]);
      setLoading(false);
      return;
    }
    fetch("/api/saved")
      .then((r) => r.json())
      .then((data) => {
        const saved = (data.saved ?? []).map(
          (s: { establishments: Establishment }) => s.establishments
        );
        setEstablishments(saved);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <TopBar title="Saved" />
      <div className="flex-1 overflow-y-auto pb-nav">
        {loading ? (
          <div className="px-4 pt-4 space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-24 bg-white rounded-2xl border border-[var(--border)] animate-pulse"
              />
            ))}
          </div>
        ) : establishments.length > 0 ? (
          <div className="px-4 pt-4 space-y-3">
            {establishments.map((e) => (
              <EstablishmentCard
                key={e.id}
                establishment={e}
                isSaved={savedIds.has(e.place_id)}
                onSaveToggle={toggle}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-4">
            <p className="text-4xl">❤️</p>
            <h2 className="font-semibold text-[var(--foreground)]">
              No saved places yet
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Tap the heart on any listing to save it here for quick access.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
