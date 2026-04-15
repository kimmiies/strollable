"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import EstablishmentCard from "@/components/establishment/EstablishmentCard";
import EmptyState from "@/components/ui/EmptyState";
import { useSaved } from "@/hooks/useSaved";
import { isDemoMode } from "@/lib/demo";
import type { Establishment } from "@/types";

export default function SavedPage() {
  const router = useRouter();
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
      <div className="flex-1 overflow-y-auto pb-nav">
        <div className="max-w-[1180px] mx-auto w-full px-4 lg:px-10 pt-5">
          <div className="pb-3">
            <h1 className="font-display text-xl font-normal tracking-[-0.025em] text-[var(--ink)]">
              Saved places
            </h1>
            <p className="text-sm text-[var(--ink-faint)] mt-0.5">
              {loading
                ? "Loading…"
                : `${establishments.length} place${establishments.length !== 1 ? "s" : ""} saved`}
            </p>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-white rounded-2xl border border-[var(--border)] animate-pulse"
                />
              ))}
            </div>
          ) : establishments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
            <div className="pt-4">
              <EmptyState
                Icon={Heart}
                title="Nothing saved yet"
                body="Tap the heart on any spot to save it for your next outing."
                actionLabel="Explore spots nearby"
                onAction={() => router.push("/explore")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
