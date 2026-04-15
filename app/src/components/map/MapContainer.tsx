"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { Establishment, FeatureStatus, FeatureValue } from "@/types";
import { loadGoogleMaps } from "@/lib/google/maps";
import { getBestFeatureStatus } from "@/lib/utils";

interface MapContainerProps {
  center: { lat: number; lng: number };
  zoom: number;
  establishments: Establishment[];
  selectedPlaceId: string | null;
  onMarkerClick: (establishment: Establishment) => void;
  onMapClick: () => void;
  className?: string;
}

// Design-system marker colors
const MARKER_COLORS = {
  selected:  "#7A9E7E", // sage  — active / selected
  confirmed: "#1A1F1B", // ink   — community verified
  reported:  "#D4952A", // amber — partial data
  unknown:   "#1A1F1B", // ink   — no data yet (same as confirmed)
  disputed:  "#D4952A", // amber — disputed
};

function getMarkerColor(establishment: Establishment, isSelected: boolean): string {
  if (isSelected) return MARKER_COLORS.selected;
  const status = getBestFeatureStatus(
    establishment.features as unknown as Record<string, { status: FeatureStatus; value: FeatureValue }>
  );
  return MARKER_COLORS[status] ?? MARKER_COLORS.unknown;
}

function truncateName(name: string, max = 20): string {
  return name.length > max ? name.slice(0, max - 1) + "…" : name;
}

function createMarkerElement(name: string, color: string, isSelected: boolean) {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(.16,1,.3,1);
    ${isSelected ? "transform: scale(1.1);" : ""}
  `;

  const bubble = document.createElement("div");
  bubble.className = "marker-bubble";
  bubble.textContent = truncateName(name);
  bubble.style.cssText = `
    padding: 6px 13px;
    border-radius: 100px;
    background: ${color};
    color: white;
    font-size: 12px;
    font-weight: 500;
    font-family: 'DM Sans', system-ui, sans-serif;
    letter-spacing: 0.01em;
    white-space: nowrap;
    box-shadow: 0 3px 12px rgba(26,31,27,.22);
    transition: background 0.2s, transform 0.2s;
    user-select: none;
  `;

  const pointer = document.createElement("div");
  pointer.className = "marker-pointer";
  pointer.style.cssText = `
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 7px solid ${color};
    margin-top: 1px;
    transition: border-top-color 0.2s;
  `;

  wrapper.appendChild(bubble);
  wrapper.appendChild(pointer);
  return wrapper;
}

export default function MapContainer({
  center,
  zoom,
  establishments,
  selectedPlaceId,
  onMarkerClick,
  onMapClick,
  className = "w-full h-full",
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const [mapReady, setMapReady] = useState(false);

  const initMap = useCallback(async () => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const mapsApi = await loadGoogleMaps();

    const map = new mapsApi.Map(mapRef.current, {
      center,
      zoom,
      mapId: "strollable-map",
      disableDefaultUI: true,
      gestureHandling: "greedy",
      clickableIcons: false,
    });

    map.addListener("click", () => onMapClick());
    mapInstanceRef.current = map;
    setMapReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    initMap();
  }, [initMap]);

  // Pan to center when it changes externally
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.panTo(center);
  }, [center]);

  // Sync markers
  useEffect(() => {
    if (!mapInstanceRef.current || typeof google === "undefined") return;

    const existingIds = new Set(markersRef.current.keys());
    const newIds = new Set(establishments.map((e) => e.place_id));

    // Remove stale markers
    for (const id of existingIds) {
      if (!newIds.has(id)) {
        markersRef.current.get(id)!.map = null;
        markersRef.current.delete(id);
      }
    }

    for (const establishment of establishments) {
      const isSelected = establishment.place_id === selectedPlaceId;
      const color = getMarkerColor(establishment, isSelected);

      if (markersRef.current.has(establishment.place_id)) {
        // Update color + scale for existing marker
        const marker = markersRef.current.get(establishment.place_id)!;
        const wrapper = marker.content as HTMLElement;
        const bubble = wrapper.querySelector(".marker-bubble") as HTMLElement;
        const pointer = wrapper.querySelector(".marker-pointer") as HTMLElement;
        if (bubble) {
          bubble.style.background = color;
          bubble.style.transform = isSelected ? "scale(1.08)" : "scale(1)";
        }
        if (pointer) pointer.style.borderTopColor = color;
        wrapper.style.transform = isSelected ? "scale(1.1)" : "scale(1)";
        continue;
      }

      const content = createMarkerElement(establishment.name, color, isSelected);

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapInstanceRef.current,
        position: { lat: establishment.lat, lng: establishment.lng },
        content,
        title: establishment.name,
      });

      marker.addListener("gmp-click", () => onMarkerClick(establishment));
      markersRef.current.set(establishment.place_id, marker);
    }
  }, [establishments, selectedPlaceId, onMarkerClick, mapReady]);

  // Pan to selected marker
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPlaceId) return;
    const establishment = establishments.find((e) => e.place_id === selectedPlaceId);
    if (establishment) {
      mapInstanceRef.current.panTo({ lat: establishment.lat, lng: establishment.lng });
    }
  }, [selectedPlaceId, establishments]);

  return <div ref={mapRef} className={className} />;
}
