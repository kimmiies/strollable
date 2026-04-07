import type { BadgeDefinition } from "@/types";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
  badge: BadgeDefinition;
  earned: boolean;
}

export default function BadgeCard({ badge, earned }: BadgeCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center p-4 rounded-2xl border",
        earned
          ? "bg-amber-50 border-amber-200"
          : "bg-[var(--muted)] border-[var(--border)] opacity-60"
      )}
    >
      <div className="text-3xl mb-2">{badge.icon}</div>
      <p
        className={cn(
          "font-semibold text-sm",
          earned ? "text-amber-900" : "text-[var(--muted-foreground)]"
        )}
      >
        {badge.name}
      </p>
      <p
        className={cn(
          "text-xs mt-1",
          earned ? "text-amber-700" : "text-[var(--muted-foreground)]"
        )}
      >
        {earned ? badge.description : badge.requirement}
      </p>
      {!earned && (
        <span className="mt-2 text-[10px] font-medium bg-[var(--border)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-full">
          Locked
        </span>
      )}
    </div>
  );
}
