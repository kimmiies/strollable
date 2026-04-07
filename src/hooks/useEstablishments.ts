"use client";

import { useEffect, useState, useCallback } from "react";
import type { Establishment } from "@/types";

interface UseEstablishmentsOptions {
  lat: number;
  lng: number;
  radius?: number;
  type?: string;
}

export function useEstablishments({
  lat,
  lng,
  radius = 1500,
  type,
}: UseEstablishmentsOptions) {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        lat: String(lat),
        lng: String(lng),
        radius: String(radius),
        ...(type && type !== "all" ? { type } : {}),
      });
      const res = await window.fetch(`/api/establishments/nearby?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEstablishments(data.establishments ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [lat, lng, radius, type]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { establishments, loading, error, refetch: fetch };
}
