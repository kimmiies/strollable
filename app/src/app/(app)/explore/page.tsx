"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Search, X, SlidersHorizontal, ArrowLeft, AlignJustify, Map,
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
    showList,
    searchQuery,
    setCenter,
    toggleFeatureFilter,
    setSelectedPlaceId,
    setShowList,
    setSearchQuery,
  } = useMapStore();

  const { coords, loading: geoLoading, requestLocation } = useGeolocation();
  const { savedIds, toggle: toggleSaved } = useSaved();
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(searchQuery);

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
        <div className="flex items-end justify-between px-6 pt-5 pb-3 flex-shrink-0">
          <div>
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
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-sm font-normal text-[var(--ink-soft)]">Show map</span>
            <button
              role="switch"
              aria-checked={showMap}
              onClick={() => setShowMap((v) => !v)}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors duration-200",
                showMap ? "bg-[var(--sage)]" : "bg-zinc-300"
              )}
            >
              <span className={cn(
                "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
                showMap ? "translate-x-5" : "translate-x-0"
              )} />
            </button>
          </label>
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
          <div className={cn("overflow-y-auto flex-shrink-0 transition-all duration-300", showMap ? "w-[580px]" : "flex-1")}>
            <EstablishmentList
              establishments={filtered}
              loading={estLoading}
              selectedPlaceId={selectedPlaceId}
              onSelect={(e) => setSelectedPlaceId(e.place_id)}
              grid
            />
          </div>
          {showMap && (
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

              {/* Desktop peek card — flex row so justify-center works inside overflow-hidden parent */}
              {selectedEstablishment && (
                <div
                  className="absolute bottom-4 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none"
                >
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
          )}
        </div>
      </div>

      {/* Filter panel (shared desktop + mobile) */}
      <FilterPanel
        isOpen={filterPanelOpen}
        onClose={() => setFilterPanelOpen(false)}
        neighbourhoods={neighbourhoods}
      />

      {/* ── MOBILE LAYOUT (<lg) ─────────────────────────────────────── */}
      <div className="lg:hidden relative h-full overflow-hidden">

        {/* Map always rendered as base layer */}
        <div className="absolute inset-0">
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
            className="bottom-[168px] right-4"
          />
        </div>

        {/* Floating: search pill + feature chips */}
        {!showList && (
          <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-3 space-y-2 pointer-events-none">
            <div className="flex gap-2 pointer-events-auto">
              <div
                className="flex-1 flex items-center gap-2 px-4 rounded-[var(--r-pill)] bg-[var(--warm-white)]"
                style={{ border: "1.5px solid rgba(122,158,126,0.2)", boxShadow: "var(--shadow-float)" }}
              >
                <Search className="w-4 h-4 text-[var(--ink-faint)] flex-shrink-0" />
                <input
                  type="text"
                  value={mobileSearch}
                  onChange={(e) => { setMobileSearch(e.target.value); setSearchQuery(e.target.value); }}
                  placeholder="Search neighbourhoods or cafés…"
                  className="flex-1 py-3 text-sm bg-transparent placeholder:text-[var(--ink-faint)] focus:outline-none text-[var(--ink)]"
                />
                {mobileSearch ? (
                  <button onClick={() => { setMobileSearch(""); setSearchQuery(""); }} className="text-[var(--ink-faint)] flex-shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <kbd className="text-[10px] font-mono bg-[var(--mist)] text-[var(--ink-faint)] px-1.5 py-0.5 rounded-[4px] flex-shrink-0">⌘K</kbd>
                )}
              </div>
              <button
                onClick={() => setShowList(true)}
                className="w-12 h-12 rounded-[var(--r-md)] flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--warm-white)", border: "1.5px solid rgba(122,158,126,0.2)", boxShadow: "var(--shadow-float)" }}
                aria-label="List view"
              >
                <AlignJustify className="w-5 h-5 text-[var(--ink-soft)]" />
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto pb-0.5">
              {FEATURE_CHIPS.map(({ value, Icon }) => {
                const active = activeFeatureFilters.includes(value);
                return (
                  <button
                    key={value}
                    onClick={() => toggleFeatureFilter(value)}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--r-pill)] text-[13px] transition-all",
                      active ? "text-white" : "text-[var(--ink-soft)]"
                    )}
                    style={{
                      background: active ? "var(--sage-deep)" : "rgba(255,254,249,0.92)",
                      border: active ? "1.5px solid var(--sage-deep)" : "1.5px solid rgba(26,31,27,0.12)",
                      boxShadow: "var(--shadow-sm)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{FEATURE_LABELS[value]}</span>
                  </button>
                );
              })}
              <button
                onClick={() => setFilterPanelOpen(true)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--r-pill)] text-[13px] transition-all"
                style={{
                  background: activeFilterCount > 0 ? "var(--sage)" : "rgba(255,254,249,0.92)",
                  border: `1.5px solid ${activeFilterCount > 0 ? "var(--sage)" : "rgba(26,31,27,0.12)"}`,
                  color: activeFilterCount > 0 ? "white" : "var(--ink-soft)",
                  boxShadow: "var(--shadow-sm)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : "Filters"}
              </button>
            </div>
          </div>
        )}

        {/* Mobile peek card — full width, above toggle */}
        {!showList && selectedEstablishment && (
          <div
            className="absolute left-4 right-4 z-20 transition-all duration-300"
            style={{
              bottom: 148,
              transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
            }}
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

        {/* Map / List toggle pill */}
        {!showList && (
          <div
            className="absolute left-1/2 -translate-x-1/2 z-20 flex p-[3px] rounded-[var(--r-pill)]"
            style={{ bottom: 84, background: "var(--ink)", boxShadow: "var(--shadow-float)" }}
          >
            <span className="flex items-center gap-1.5 px-5 py-2.5 rounded-[var(--r-pill)] bg-white text-[var(--ink)] text-sm font-medium">
              <Map className="w-4 h-4" /> Map
            </span>
            <button
              onClick={() => setShowList(true)}
              className="flex items-center gap-1.5 px-5 py-2.5 text-sm text-white/50"
            >
              <AlignJustify className="w-4 h-4" /> List
            </button>
          </div>
        )}

        {/* List view overlay */}
        {showList && (
          <div className="absolute inset-0 z-30 overflow-y-auto pb-nav" style={{ background: "var(--cream)" }}>
            <div
              className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3"
              style={{ background: "var(--cream)", borderBottom: "1px solid rgba(122,158,126,0.15)" }}
            >
              <button
                onClick={() => setShowList(false)}
                className="flex items-center gap-1 text-sm text-[var(--sage-deep)] font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Map
              </button>
              <div className="flex-1 text-center">
                <span className="font-display text-sm font-normal text-[var(--ink)]">
                  {estLoading ? "Finding places…" : `${filtered.length} place${filtered.length !== 1 ? "s" : ""}`}
                </span>
              </div>
              <button
                onClick={() => setFilterPanelOpen(true)}
                className={cn(
                  "flex items-center gap-1.5 text-sm transition-colors",
                  activeFilterCount > 0 ? "text-[var(--sage-deep)]" : "text-[var(--ink-faint)]"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {activeFilterCount > 0 && <span className="font-medium">{activeFilterCount}</span>}
              </button>
            </div>

            <div className="px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-faint)]" />
                <input
                  type="text"
                  value={mobileSearch}
                  onChange={(e) => { setMobileSearch(e.target.value); setSearchQuery(e.target.value); }}
                  placeholder="Search by name, neighbourhood, or type…"
                  className="w-full pl-9 pr-8 py-2.5 text-sm rounded-[var(--r-pill)] bg-[var(--warm-white)] placeholder:text-[var(--ink-faint)] focus:outline-none text-[var(--ink)]"
                  style={{ border: "1.5px solid rgba(122,158,126,0.2)" }}
                />
                {mobileSearch && (
                  <button
                    onClick={() => { setMobileSearch(""); setSearchQuery(""); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <EstablishmentList
              establishments={filtered}
              loading={estLoading}
              selectedPlaceId={selectedPlaceId}
              onSelect={(e) => {
                setSelectedPlaceId(e.place_id);
                setShowList(false);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
