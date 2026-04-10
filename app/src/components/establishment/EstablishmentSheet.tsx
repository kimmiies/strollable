"use client";

import Link from "next/link";
import { X, Heart, ChevronRight } from "lucide-react";
import type { Establishment } from "@/types";
import {
  cn,
  formatDistance,
  getEstablishmentTypeLabel,
  getTypePlaceholder,
} from "@/lib/utils";
import FeatureChipRow from "./FeatureChipRow";
import { useSaved } from "@/hooks/useSaved";

interface EstablishmentSheetProps {
  establishment: Establishment | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EstablishmentSheet({
  establishment,
  isOpen,
  onClose,
}: EstablishmentSheetProps) {
  const { savedIds, toggle } = useSaved();
  const isSaved = establishment ? savedIds.has(establishment.place_id) : false;

  const { gradient, emoji } = establishment
    ? getTypePlaceholder(establishment.type)
    : { gradient: "", emoji: "" };

  return (
    <div
      className={cn(
        "absolute bottom-4 left-4 right-4 z-30",
        "transition-all duration-300",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      )}
      style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
    >
      {establishment && (
        <Link
          href={`/place/${establishment.place_id}`}
          className="flex gap-3.5 items-center p-4 rounded-[var(--r-lg)] block"
          style={{
            background: "var(--warm-white)",
            boxShadow: "var(--shadow-float)",
            border: "1px solid rgba(122,158,126,0.12)",
          }}
        >
          {/* Gradient thumbnail */}
          <div
            className="w-14 h-14 rounded-[var(--r-md)] flex items-center justify-center flex-shrink-0 text-2xl"
            style={{ background: gradient }}
          >
            {emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-display font-normal text-base leading-snug tracking-[-0.015em] text-[var(--ink)] line-clamp-1">
              {establishment.name}
            </p>
            <p className="text-xs text-[var(--ink-faint)] mt-0.5 tracking-[0.02em]">
              {getEstablishmentTypeLabel(establishment.type)}
              {establishment.distance_meters !== undefined && (
                <> · {formatDistance(establishment.distance_meters)}</>
              )}
            </p>
            <div className="mt-1.5">
              <FeatureChipRow
                features={establishment.features}
                onlyConfirmed
                size="sm"
              />
            </div>
          </div>

          {/* Right controls — stop propagation so they don't navigate */}
          <div
            className="flex flex-col items-end gap-1 flex-shrink-0 self-start"
            onClick={(e) => e.preventDefault()}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--mist)] text-[var(--ink-faint)]"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle(establishment.place_id);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--mist)]"
              aria-label={isSaved ? "Unsave" : "Save"}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-colors",
                  isSaved
                    ? "fill-[var(--terracotta)] text-[var(--terracotta)]"
                    : "text-[var(--ink-faint)]"
                )}
              />
            </button>
          </div>

          {/* Chevron — tap affordance */}
          <ChevronRight className="w-4 h-4 text-[var(--ink-faint)] flex-shrink-0 self-center -ml-1" />
        </Link>
      )}
    </div>
  );
}
