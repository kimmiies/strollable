"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMapStore } from "@/stores/mapStore";

const NAV_LINKS = [
  { href: "/explore",       label: "Explore" },
  { href: "/saved",         label: "Saved" },
  { href: "/notifications", label: "Activity" },
];

export default function TopNav() {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery } = useMapStore();

  const isExplore = pathname === "/explore" || pathname.startsWith("/place/");

  return (
    <header
      className="hidden lg:flex items-center gap-0 flex-shrink-0 z-30"
      style={{
        background: "var(--warm-white)",
        borderBottom: "1px solid rgba(122,158,126,0.12)",
        height: 60,
        boxShadow: "var(--shadow-sm)",
        paddingLeft: 32,
        paddingRight: 32,
      }}
    >
      {/* Brand mark */}
      <Link
        href="/explore"
        className="font-display font-light text-[var(--ink)] flex-shrink-0 tracking-[-0.02em]"
        style={{ fontSize: 18, marginRight: 32 }}
      >
        Stroll<em className="not-italic text-[var(--sage-deep)]" style={{ fontStyle: "italic" }}>able</em>
      </Link>

      {/* Search — left-centre, max 320px */}
      <div className="relative flex-shrink-0" style={{ width: 320 }}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-faint)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search spots near you…"
          disabled={!isExplore}
          className={cn(
            "w-full pl-10 pr-10 text-sm",
            "focus:outline-none transition-colors",
            !isExplore && "opacity-40 cursor-not-allowed"
          )}
          style={{
            height: 38,
            borderRadius: "var(--r-pill)",
            border: "1.5px solid transparent",
            background: "var(--mist)",
            color: "var(--ink)",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.currentTarget.style.background = "var(--warm-white)";
            e.currentTarget.style.borderColor = "var(--sage)";
            e.currentTarget.style.boxShadow = "var(--focus-ring)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.background = "var(--mist)";
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {searchQuery && isExplore && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] hover:text-[var(--ink)]"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Page links — sit between search and actions */}
      <nav className="flex items-stretch ml-6">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive =
            href === "/explore"
              ? pathname === "/explore" || pathname.startsWith("/place/")
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center px-4 text-sm transition-colors border-b-2",
                isActive
                  ? "text-[var(--sage-deep)] border-[var(--sage)]"
                  : "text-[var(--ink-faint)] border-transparent hover:text-[var(--ink-soft)]"
              )}
              style={{ height: 60 }}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Push actions to the right */}
      <div className="flex-1" />

      {/* Right-side actions */}
      <div className="flex items-center gap-2">
        {/* Contribute CTA */}
        <Link
          href="/contribute"
          className="flex items-center gap-1.5 text-sm font-medium text-white transition-colors"
          style={{
            background: "var(--sage)",
            borderRadius: "var(--r-pill)",
            padding: "9px 18px",
            height: 38,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sage-deep)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--sage)")}
        >
          <Plus className="w-3.5 h-3.5" />
          Contribute
        </Link>

        {/* Avatar */}
        <Link
          href="/profile"
          aria-label="Profile"
          className="flex items-center justify-center rounded-full text-white font-display font-light text-sm flex-shrink-0 transition-opacity hover:opacity-80"
          style={{
            width: 34,
            height: 34,
            background: "linear-gradient(135deg, var(--sage-light), var(--sage))",
          }}
        >
          S
        </Link>
      </div>
    </header>
  );
}
