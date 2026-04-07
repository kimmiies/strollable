"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { isDemoMode } from "@/lib/demo";
import { useUser } from "./useUser";

export function useSaved() {
  const { user, isLoggedIn } = useUser();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const fetchSaved = useCallback(async () => {
    if (isDemoMode || !user) return;
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("saved_places")
      .select("establishment_id, establishments!inner(place_id)")
      .eq("user_id", user.id);

    if (data) {
      const ids = new Set(
        data.map(
          (row: { establishments: { place_id: string } | { place_id: string }[] }) =>
            Array.isArray(row.establishments)
              ? row.establishments[0]?.place_id
              : row.establishments?.place_id
        ).filter(Boolean) as string[]
      );
      setSavedIds(ids);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  async function toggle(placeId: string) {
    if (!isLoggedIn) return;

    // Optimistic update
    const next = new Set(savedIds);
    if (next.has(placeId)) {
      next.delete(placeId);
    } else {
      next.add(placeId);
    }
    setSavedIds(next);

    if (isDemoMode) return;

    try {
      const res = await fetch("/api/saved", {
        method: savedIds.has(placeId) ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place_id: placeId }),
      });
      if (!res.ok) {
        // Revert on error
        setSavedIds(savedIds);
      }
    } catch {
      setSavedIds(savedIds);
    }
  }

  return { savedIds, loading, toggle, refetch: fetchSaved };
}
