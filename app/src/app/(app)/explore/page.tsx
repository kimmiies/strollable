"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  SlidersHorizontal, AlignJustify, Map,
  Footprints, LockOpen, Baby, Armchair, DoorOpen, Navigation, Sofa, User, Users,
  type LucideIcon,
} from "lucide-react";
import { useMapStore } from "@/stores/mapStore";
import { useEstablishments } from "@/hooks/useEstablishments";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useSaved } from "@/hooks/useSaved";
import { DEMO_CENTER } from "@/lib/demo/data";
import MapFilters from "@/components/map/MapFilters";
import FilterPanel from "@/components/map/FilterPanel";
import SearchBar, { type EstablishmentSuggestion } from "@/components/map/SearchBar";
import MapControls from "@/components/map/MapControls";
import EstablishmentCard from "@/components/establishment/EstablishmentCard";
import EstablishmentList from "@/components/establishment/EstablishmentList";
import type { Establishment, FeatureType } from "@/types";
import { FEATURE_LABELS } from "@/types";
import { cn, getNeighbourhoodFromAddress } from "@/lib/utils";

const MapContainer = dynamic(() => import("@/components/map/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[var(--mist)] animate-pulse flex items-center justify-center">
      <span className="text-[var(--ink-faint)] text-sm">Loading map…</span>
    </div>
  ),
});

const FEATURE_CHIPS: { value: FeatureType; Icon: LucideIcon }[] = [
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

export default function ExplorePage() {
  const {
    center,
    zoom,
    activeTypeFilter,
    activeNeighbourhood,
    activeFeatureFilters,
    selectedPlaceId,
    searchQuery,
    setCenter,
    toggleFeatureFilter,
    setSelectedPlaceId,
    setSearchQuery,
  } = useMapStore();

  const { coords, loading: geoLoading, requestLocation } = useGeolocation();
  const { savedIds, toggle: toggleSaved } = useSaved();
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(searchQuery);
  const [mobileView, setMobileView] = useState<"both" | "map" | "list">("both");

  const mapCenter = coords ?? center;

  const { establishments, loading: estLoading } = useEstablishments({
    lat: mapCenter.lat,
    lng: mapCenter.lng,
    type: activeTypeFilter,
  });

  const neighbourhoods = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const e of establishments) {
      const n = getNeighbourhoodFromAddress(e.address);
      if (n && !seen.has(n)) { seen.add(n); result.push(n); }
    }
    return result;
  }, [establishments]);

  const filtered = useMemo(() => {
    let list = establishments;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.address?.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q)
      );
    }
    if (activeNeighbourhood !== "all") {
      list = list.filter((e) => getNeighbourhoodFromAddress(e.address) === activeNeighbourhood);
    }
    if (activeFeatureFilters.length > 0) {
      list = list.filter((e) =>
        activeFeatureFilters.every((feat) => {
          const f = e.features[feat as keyof typeof e.features];
          return f?.status === "confirmed" && f?.value === "yes";
        })
      );
    }
    return list;
  }, [establishments, searchQuery, activeNeighbourhood, activeFeatureFilters]);

  // Suggestions for SearchBar
  const searchSuggestions = useMemo<EstablishmentSuggestion[]>(() => {
    if (!searchQuery.trim()) return [];
    return filtered.slice(0, 4).map((e) => ({
      id: e.place_id,
      name: e.name,
      type: e.type,
      neighbourhood: getNeighbourhoodFromAddress(e.address) ?? undefined,
    }));
  }, [filtered, searchQuery]);

  const neighbourhoodSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return neighbourhoods.filter((n) => n.toLowerCase().includes(q)).slice(0, 3);
  }, [neighbourhoods, searchQuery]);

  const nearbyCount = useMemo(() => {
    return filtered.filter((e) => {
      const f = e.features["step_free_entrance" as keyof typeof e.features];
      return f?.status === "confirmed" && f?.value === "yes";
    }).length;
  }, [filtered]);

  const activeFilterCount =
    (activeTypeFilter !== "all" ? 1 : 0) +
    (activeNeighbourhood !== "all" ? 1 : 0) +
    activeFeatureFilters.length;

  useEffect(() => {
    if (coords) setCenter(coords);
    else setCenter(DEMO_CENTER);
  }, [coords, setCenter]);

  useEffect(() => {
    if (selectedPlaceId) {
      const found = filtered.find((e) => e.place_id === selectedPlaceId);
      setSelectedEstablishment(found ?? null);
    } else {
      setSelectedEstablishment(null);
    }
  }, [selectedPlaceId, filtered]);

  useEffect(() => {
    setMobileSearch(searchQuery);
  }, [searchQuery]);

  function handleMarkerClick(establishment: Establishment) {
    setSelectedPlaceId(establishment.place_id);
  }

  function handleDismiss() {
    setSelectedPlaceId(null);
    setSelectedEstablishment(null);
  }

  return (
    <>
      {/* ── DESKTOP LAYOUT (lg+) ────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col h-full overflow-hidden">
        {/* Title row */}
        <div className="px-6 pt-5 pb-3 flex-shrink-0">
          <h1 className="font-display text-xl font-normal tracking-[-0.025em] text-[var(--ink)]">
            Places in Toronto
          </h1>
          <p className="text-sm text-[var(--ink-faint)] mt-0.5">
            {estLoading
              ? "Finding places…"
              : `${filtered.length} place${filtered.length !== 1 ? "s" : ""} nearby`}
            {searchQuery && !estLoading && (
              <span className="ml-1">for <span className="font-medium">"{searchQuery}"</span></span>
            )}
          </p>
        </div>

        {/* Desktop search bar */}
        <div className="px-6 pb-3 flex-shrink-0">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            showKbd
            nearbyCount={nearbyCount}
            onNearby={() => {}}
            establishmentSuggestions={searchSuggestions}
            neighbourhoodSuggestions={neighbourhoodSuggestions}
            onSelectEstablishment={(id) => setSelectedPlaceId(id)}
            onSelectNeighbourhood={(n) => setSearchQuery(n)}
            placeholder="Search spots near you…"
          />
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 border-b border-[rgba(122,158,126,0.15)] pr-4 flex-shrink-0">
          <MapFilters
            activeFeatureFilters={activeFeatureFilters}
            onToggleFeature={toggleFeatureFilter}
            className="flex-1 px-6 py-2"
          />
          <button
            onClick={() => setFilterPanelOpen(true)}
            className={cn(
              "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-[var(--r-pill)] border text-sm transition-all",
              activeFilterCount > 0
                ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                : "bg-[var(--warm-white)] text-[var(--ink-soft)] border-[rgba(26,31,27,0.12)] hover:border-[var(--sage)] hover:text-[var(--sage-deep)]"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-white/25 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[580px] overflow-y-auto flex-shrink-0">
            <EstablishmentList
              establishments={filtered}
              loading={estLoading}
              selectedPlaceId={selectedPlaceId}
              onSelect={(e) => setSelectedPlaceId(e.place_id)}
              grid
            />
          </div>
          <div className="flex-1 relative border-l border-[rgba(122,158,126,0.15)]">
            <MapContainer
              center={mapCenter}
              zoom={zoom}
              establishments={filtered}
              selectedPlaceId={selectedPlaceId}
              onMarkerClick={handleMarkerClick}
              onMapClick={() => setSelectedPlaceId(null)}
              className="w-full h-full"
            />
            <MapControls onLocate={requestLocation} locating={geoLoading} />

            {selectedEstablishment && (
              <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
                <div
                  className="w-[360px] pointer-events-auto transition-all duration-300"
                  style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
                >
                  <EstablishmentCard
                    establishment={selectedEstablishment}
                    isSaved={savedIds.has(selectedEstablishment.place_id)}
                    onSaveToggle={toggleSaved}
                    isSelected
                    onDismiss={handleDismiss}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter panel (shared desktop + mobile) */}
      <FilterPanel
        isOpen={filterPanelOpen}
        onClose={() => setFilterPanelOpen(false)}
        neighbourhoods={neighbourhoods}
      />

      {/* ── MOBILE LAYOUT (<lg) ─────────────────────────────────────── */}
      <div className="lg:hidden flex flex-col h-full">

        {/* ── Persistent header — always the same ── */}
        <div
          className="flex-shrink-0 px-4 pt-3 pb-2 space-y-2"
          style={{ background: "var(--warm-white)", borderBottom: "1px solid rgba(122,158,126,0.12)" }}
        >
          <div className="flex gap-2">
            <SearchBar
              value={mobileSearch}
              onChange={(v) => { setMobileSearch(v); setSearchQuery(v); }}
              nearbyCount={nearbyCount}
              onNearby={() => setMobileView("both")}
              establishmentSuggestions={searchSuggestions}
              neighbourhoodSuggestions={neighbourhoodSuggestions}
              onSelectEstablishment={(id) => { setSelectedPlaceId(id); setMobileView("both"); }}
              onSelectNeighbourhood={(n) => { setMobileSearch(n); setSearchQuery(n); }}
              placeholder="Search spots near you…"
              className="flex-1"
            />
            <button
              onClick={() => setFilterPanelOpen(true)}
              className="w-12 h-12 rounded-[var(--r-md)] flex items-center justify-center flex-shrink-0 relative"
              style={{ background: "var(--mist)", border: "1.5px solid rgba(122,158,126,0.2)" }}
              aria-label="Filters"
            >
              <SlidersHorizontal className="w-5 h-5 text-[var(--ink-soft)]" />
              {activeFilterCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: "var(--sage-deep)" }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {FEATURE_CHIPS.map(({ value, Icon }) => {
              const active = activeFeatureFilters.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => toggleFeatureFilter(value)}
                  className={cn(
                    "flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--r-pill)] text-[13px] transition-all border",
                    active
                      ? "bg-[var(--sage-deep)] text-white border-[var(--sage-deep)]"
                      : "bg-[var(--warm-white)] text-[var(--ink-soft)] border-[rgba(26,31,27,0.12)]"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{FEATURE_LABELS[value]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Content: map + list together (Airbnb-style) ── */}
        <div className="flex-1 overflow-y-auto" style={{ background: "var(--cream)" }}>

          {/* Map — fixed height, always visible */}
          {mobileView !== "list" && (
            <div className="relative flex-shrink-0" style={{ height: "45vh" }}>
              <MapContainer
                center={mapCenter}
                zoom={zoom}
                establishments={filtered}
                selectedPlaceId={selectedPlaceId}
                onMarkerClick={handleMarkerClick}
                onMapClick={() => setSelectedPlaceId(null)}
                className="w-full h-full"
              />
              <MapControls
                onLocate={requestLocation}
                locating={geoLoading}
                className="bottom-4 right-4"
              />
              {/* Compact peek card on map when marker selected */}
              {selectedEstablishment && (
                <div
                  className="absolute left-4 right-4 z-10 transition-all duration-300"
                  style={{ bottom: 12, transitionTimingFunction: "var(--ease-spring)" }}
                >
                  <EstablishmentCard
                    establishment={selectedEstablishment}
                    isSaved={savedIds.has(selectedEstablishment.place_id)}
                    onSaveToggle={toggleSaved}
                    isSelected
                    onDismiss={handleDismiss}
                  />
                </div>
              )}
            </div>
          )}

          {/* Count + view toggle bar */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(122,158,126,0.12)", background: "var(--cream)" }}
          >
            <span className="text-sm font-medium text-[var(--ink)]">
              {estLoading ? "Finding places…" : `${filtered.length} place${filtered.length !== 1 ? "s" : ""} nearby`}
            </span>
            <div
              className="flex p-0.5 rounded-[var(--r-pill)]"
              style={{ background: "var(--mist)", border: "1px solid rgba(122,158,126,0.15)" }}
            >
              <button
                onClick={() => setMobileView("both")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--r-pill)] text-xs font-medium transition-colors",
                  mobileView !== "list" ? "bg-white text-[var(--ink)] shadow-sm" : "text-[var(--ink-faint)]"
                )}
              >
                <Map className="w-3.5 h-3.5" /> Map
              </button>
              <button
                onClick={() => setMobileView("list")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--r-pill)] text-xs font-medium transition-colors",
                  mobileView === "list" ? "bg-white text-[var(--ink)] shadow-sm" : "text-[var(--ink-faint)]"
                )}
              >
                <AlignJustify className="w-3.5 h-3.5" /> List
              </button>
            </div>
          </div>

          {/* Establishment cards */}
          <EstablishmentList
            establishments={filtered}
            loading={estLoading}
            selectedPlaceId={selectedPlaceId}
            onSelect={(e) => setSelectedPlaceId(e.place_id)}
          />
        </div>
      </div>
    </>
  );
}
