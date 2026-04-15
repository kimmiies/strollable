"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/explore", label: "Explore", Icon: Search },
  { href: "/saved", label: "Saved", Icon: Heart },
  { href: "/profile", label: "Profile", Icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  // On establishment detail pages, EstablishmentDetail renders its own
  // sticky footer with the two primary CTAs. Hide the bottom nav there.
  if (pathname.startsWith("/place/")) return null;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: "var(--warm-white)",
        borderTop: "1px solid rgba(122, 158, 126, 0.15)",
        boxShadow: "0 -4px 24px rgba(26,31,27,0.06)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around h-16 px-1">
        {tabs.map(({ href, label, Icon }) => {
          const isActive =
            href === "/explore"
              ? pathname === "/explore" || pathname.startsWith("/place/")
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] flex-1 rounded-[var(--r-md)] transition-colors hover:bg-[var(--mist)]"
              aria-label={label}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-all",
                  isActive ? "text-[var(--sage-deep)] scale-110" : "text-[var(--ink-faint)]"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-[10px] tracking-[0.06em] transition-colors",
                  isActive ? "text-[var(--sage-deep)] font-medium" : "text-[var(--ink-faint)]"
                )}
              >
                {label}
              </span>
              {isActive && (
                <span
                  className="w-1 h-1 rounded-full -mt-0.5"
                  style={{ background: "var(--sage)" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
