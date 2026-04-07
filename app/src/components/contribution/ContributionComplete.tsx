"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { BADGE_DEFINITIONS } from "@/types";
import type { BadgeType } from "@/types";

interface ContributionCompleteProps {
  establishmentName: string;
  newBadge: string | null;
  onDone: () => void;
  onContributeMore: () => void;
}

export default function ContributionComplete({
  establishmentName,
  newBadge,
  onDone,
  onContributeMore,
}: ContributionCompleteProps) {
  const badgeDef = newBadge
    ? BADGE_DEFINITIONS.find((b) => b.id === (newBadge as BadgeType))
    : null;

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center gap-6 min-h-[60vh]">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          Nice one.
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          That helps parents in the neighbourhood plan better.
        </p>
      </div>

      {badgeDef && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 max-w-xs w-full">
          <div className="text-3xl mb-2">{badgeDef.icon}</div>
          <p className="font-bold text-amber-900">{badgeDef.name} badge earned!</p>
          <p className="text-sm text-amber-700 mt-1">{badgeDef.description}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href={`/explore`}
          className="w-full py-3.5 rounded-2xl bg-[var(--primary)] text-white font-semibold text-sm text-center hover:bg-[var(--primary-hover)] transition-colors"
        >
          Back to map
        </Link>
        <button
          onClick={onContributeMore}
          className="w-full py-3 rounded-2xl border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
        >
          Report another feature
        </button>
        <Link
          href={`/profile`}
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
        >
          View my badges →
        </Link>
      </div>
    </div>
  );
}
