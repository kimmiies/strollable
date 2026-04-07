"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Heart, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMapStore } from "@/stores/mapStore";

export default function TopNav() {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery } = useMapStore();

  const isExplore = pathname === "/explore" || pathname.startsWith("/place/");

  return (
    <header className="hidden lg:flex items-center gap-3 px-6 h-16 border-b border-[var(--border)] bg-white flex-shrink-0 z-30">
      {/* Logo */}
      <Link
        href="/explore"
        className="font-display text-xl font-normal italic text-[var(--sage-deep)] flex-shrink-0 mr-1 tracking-[-0.02em]"
      >
        Strollable
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-faint)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, neighbourhood, or type…"
          disabled={!isExplore}
          className={cn(
            "w-full pl-11 pr-20 py-2.5 text-sm rounded-[var(--r-pill)]",
            "border border-[rgba(122,158,126,0.2)] bg-[var(--warm-white)]",
            "shadow-[var(--shadow-sm)] placeholder:text-[var(--ink-faint)]",
            "focus:outline-none focus:border-[var(--sage)] focus:bg-white transition-colors",
            !isExplore && "opacity-40 cursor-not-allowed"
          )}
        />
        {/* Keyboard hint */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
          {searchQuery && isExplore ? (
            <button
              onClick={() => setSearchQuery("")}
              className="pointer-events-auto text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-0.5"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="text-[10px] font-mono bg-zinc-200 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-300">
              ⌘K
            </kbd>
          )}
        </span>
      </div>

      <div className="flex-1" />

      {/* Nav icons */}
      <nav className="flex items-center gap-1">
        {[
          { href: "/notifications", Icon: Bell, label: "Notifications" },
          { href: "/saved", Icon: Heart, label: "Saved" },
        ].map(({ href, Icon, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-full transition-colors",
                isActive
                  ? "bg-[var(--mist)] text-[var(--sage-deep)]"
                  : "text-[var(--ink-faint)] hover:bg-[var(--mist)] hover:text-[var(--ink)]"
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
            </Link>
          );
        })}

        {/* Profile avatar */}
        <Link
          href="/profile"
          aria-label="Profile"
          className={cn(
            "ml-1 flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-[var(--r-pill)] transition-colors",
            pathname.startsWith("/profile")
              ? "bg-[var(--mist)] text-[var(--sage-deep)]"
              : "hover:bg-[var(--mist)] text-[var(--ink-soft)]"
          )}
        >
          <div className="w-7 h-7 rounded-full bg-[var(--sage-light)]/40 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-[var(--sage-deep)]" />
          </div>
          <span className="text-sm font-normal">Profile</span>
        </Link>
      </nav>
    </header>
  );
}
