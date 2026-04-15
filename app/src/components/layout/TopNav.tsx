"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, Menu, User as UserIcon, Compass, Bookmark, LogOut } from "lucide-react";
import { useMapStore } from "@/stores/mapStore";
import { createClient } from "@/lib/supabase/client";
import { isDemoMode } from "@/lib/demo";
import { DEMO_CENTER } from "@/lib/demo/data";
import { useEstablishments } from "@/hooks/useEstablishments";
import SearchBar, { type EstablishmentSuggestion } from "@/components/map/SearchBar";
import { cn, getNeighbourhoodFromAddress } from "@/lib/utils";

export default function TopNav() {
  const pathname = usePathname();
  const isExplore = pathname === "/explore";

  return (
    <header
      className="hidden lg:flex items-center flex-shrink-0 z-30 gap-6"
      style={{
        background: "var(--warm-white)",
        borderBottom: "1px solid rgba(122,158,126,0.12)",
        height: 72,
        boxShadow: "var(--shadow-sm)",
        paddingLeft: 32,
        paddingRight: 32,
      }}
    >
      {/* Brand */}
      <Link
        href="/explore"
        className="font-display font-light text-[var(--ink)] flex-shrink-0 tracking-[-0.02em]"
        style={{ fontSize: 20 }}
      >
        Stroll<em className="not-italic text-[var(--sage-deep)]" style={{ fontStyle: "italic" }}>able</em>
      </Link>

      {/* Center: search + filters */}
      <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
        <NavSearch isExplore={isExplore} />
        {isExplore && <NavFilters />}
      </div>

      {/* Right: menu */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <NavMenu />
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  NAV SEARCH                                                     */
/* ─────────────────────────────────────────────────────────────── */

function NavSearch({ isExplore }: { isExplore: boolean }) {
  const router = useRouter();
  const searchQuery = useMapStore((s) => s.searchQuery);
  const setSearchQuery = useMapStore((s) => s.setSearchQuery);

  // Fetch establishments so suggestions work on every page, not just /explore.
  // /explore owns its own fetch; its suggestions are driven by the page's filtered list,
  // so we only need our own fetch when we're *not* on /explore.
  const { establishments } = useEstablishments({
    lat: DEMO_CENTER.lat,
    lng: DEMO_CENTER.lng,
  });

  const establishmentSuggestions = useMemo<EstablishmentSuggestion[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return establishments
      .filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.address?.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((e) => ({
        id: e.place_id,
        name: e.name,
        type: e.type,
        neighbourhood: getNeighbourhoodFromAddress(e.address) ?? undefined,
      }));
  }, [establishments, searchQuery]);

  const nearbyCount = useMemo(() => {
    return establishments.filter((e) => {
      const f = e.features["step_free_entrance" as keyof typeof e.features];
      return f?.status === "confirmed" && f?.value === "yes";
    }).length;
  }, [establishments]);

  const neighbourhoodSuggestions = useMemo<string[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const seen = new Set<string>();
    const result: string[] = [];
    for (const e of establishments) {
      const n = getNeighbourhoodFromAddress(e.address);
      if (n && n.toLowerCase().includes(q) && !seen.has(n)) {
        seen.add(n);
        result.push(n);
      }
    }
    return result.slice(0, 3);
  }, [establishments, searchQuery]);

  return (
    <SearchBar
      value={searchQuery}
      onChange={setSearchQuery}
      showKbd
      nearbyCount={nearbyCount}
      onNearby={() => {
        if (!isExplore) router.push("/explore");
      }}
      establishmentSuggestions={establishmentSuggestions}
      neighbourhoodSuggestions={neighbourhoodSuggestions}
      onSelectEstablishment={(id) => router.push(`/place/${id}`)}
      onSelectNeighbourhood={(n) => {
        setSearchQuery(n);
        if (!isExplore) router.push("/explore");
      }}
      placeholder="Search spots in Toronto…"
      className="w-full max-w-[480px]"
    />
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  NAV FILTERS                                                    */
/* ─────────────────────────────────────────────────────────────── */

function NavFilters() {
  const setFilterPanelOpen = useMapStore((s) => s.setFilterPanelOpen);
  const activeTypeFilter = useMapStore((s) => s.activeTypeFilter);
  const activeNeighbourhood = useMapStore((s) => s.activeNeighbourhood);
  const activeFeatureFilters = useMapStore((s) => s.activeFeatureFilters);

  const activeFilterCount =
    (activeTypeFilter !== "all" ? 1 : 0) +
    (activeNeighbourhood !== "all" ? 1 : 0) +
    activeFeatureFilters.length;

  const active = activeFilterCount > 0;

  return (
    <button
      onClick={() => setFilterPanelOpen(true)}
      className={cn(
        "flex items-center gap-2 text-sm flex-shrink-0 transition-all",
        active
          ? "bg-[var(--ink)] text-white border-[var(--ink)]"
          : "bg-[var(--warm-white)] text-[var(--ink-soft)] hover:border-[var(--sage)] hover:text-[var(--sage-deep)]"
      )}
      style={{
        height: 50,
        padding: "0 18px",
        borderRadius: "var(--r-pill)",
        border: active ? "1.5px solid var(--ink)" : "1.5px solid rgba(122,158,126,0.25)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <SlidersHorizontal className="w-4 h-4" />
      Filters
      {active && (
        <span className="bg-white/25 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {activeFilterCount}
        </span>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  NAV MENU                                                       */
/* ─────────────────────────────────────────────────────────────── */

function NavMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    if (!isDemoMode) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/login");
  }

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  const items: { icon: typeof UserIcon; label: string; onClick: () => void; danger?: boolean }[] = [
    { icon: UserIcon, label: "Profile", onClick: () => go("/profile") },
    { icon: Compass,  label: "Explore", onClick: () => go("/explore") },
    { icon: Bookmark, label: "Saved",   onClick: () => go("/saved") },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        className="flex items-center gap-2 pl-3 pr-1.5 transition-all"
        style={{
          height: 44,
          borderRadius: "var(--r-pill)",
          background: "var(--warm-white)",
          border: "1px solid rgba(26,31,27,0.1)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-sm)")}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
      >
        <Menu className="w-4 h-4" style={{ color: "var(--ink-soft)" }} />
        <div
          className="flex items-center justify-center rounded-full text-white font-display font-light text-sm flex-shrink-0"
          style={{
            width: 32,
            height: 32,
            background: "linear-gradient(135deg, var(--sage-light), var(--sage))",
          }}
        >
          S
        </div>
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] z-50 overflow-hidden"
          style={{
            minWidth: 220,
            background: "var(--warm-white)",
            borderRadius: "var(--r-md)",
            border: "1px solid rgba(122,158,126,0.15)",
            boxShadow: "var(--shadow-float)",
          }}
        >
          {items.map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors"
              style={{ color: "var(--ink-soft)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--mist)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Icon className="w-4 h-4" style={{ color: "var(--ink-faint)" }} />
              {label}
            </button>
          ))}
          <div style={{ height: 1, background: "rgba(122,158,126,0.12)" }} />
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors"
            style={{ color: "var(--ink-soft)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--mist)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <LogOut className="w-4 h-4" style={{ color: "var(--ink-faint)" }} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
