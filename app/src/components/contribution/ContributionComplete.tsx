"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { BADGE_DEFINITIONS } from "@/types";
import type { BadgeType } from "@/types";

interface ContributionCompleteProps {
  establishmentName: string;
  placeId: string;
  newBadge: string | null;
  onContributeMore: () => void;
}

export default function ContributionComplete({
  establishmentName,
  placeId,
  newBadge,
  onContributeMore,
}: ContributionCompleteProps) {
  const badgeDef = newBadge
    ? BADGE_DEFINITIONS.find((b) => b.id === (newBadge as BadgeType))
    : null;

  return (
    <div className="flex flex-col items-center px-6 py-12 text-center gap-5">
      {/* Check mark */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: "var(--sage)" }}
      >
        <CheckCircle className="w-7 h-7 text-white" />
      </div>

      {/* Heading */}
      <div>
        <h2
          className="font-display font-normal tracking-[-0.02em]"
          style={{ fontSize: 24, color: "var(--sage-deep)" }}
        >
          Nice one.
        </h2>
        <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          That helps parents plan their outings in the neighbourhood. The community really appreciates it.
        </p>
      </div>

      {/* Badge earned */}
      {badgeDef && (
        <div
          className="w-full max-w-xs rounded-[var(--r-md)] px-4 py-3.5 flex items-center gap-4 text-left"
          style={{
            background: "var(--butter-light)",
            border: "1px solid rgba(212,149,42,0.2)",
          }}
        >
          <span className="text-2xl flex-shrink-0">{badgeDef.icon}</span>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
              {badgeDef.name} badge earned!
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--ink-faint)" }}>
              {badgeDef.description}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2.5 w-full max-w-xs mt-1">
        <Link
          href={`/place/${placeId}`}
          className="w-full py-3.5 rounded-[var(--r-pill)] text-sm font-medium text-white text-center transition-colors"
          style={{ background: "var(--sage)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sage-deep)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--sage)")}
        >
          Back to {establishmentName}
        </Link>
        <Link
          href="/profile"
          className="w-full py-3 rounded-[var(--r-pill)] text-sm font-medium text-center transition-colors"
          style={{
            background: "transparent",
            border: "1.5px solid rgba(26,31,27,0.1)",
            color: "var(--ink-soft)",
          }}
        >
          View my profile
        </Link>
        <button
          onClick={onContributeMore}
          className="text-sm transition-colors mt-1"
          style={{ color: "var(--ink-faint)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink-soft)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-faint)")}
        >
          Report another feature
        </button>
      </div>
    </div>
  );
}
