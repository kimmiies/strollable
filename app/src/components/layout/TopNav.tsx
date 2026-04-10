"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/explore",       label: "Explore" },
  { href: "/saved",         label: "Saved" },
  { href: "/notifications", label: "Activity" },
];

export default function TopNav() {
  const pathname = usePathname();

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

      {/* Page links */}
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
