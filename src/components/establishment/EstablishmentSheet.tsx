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
        "absolute bottom-4 left-4 right-4 z-30 transition-all duration-300 ease-out",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      {establishment && (
        <div
          className="rounded-[var(--r-lg)] overflow-hidden"
          style={{
            background: "var(--warm-white)",
            boxShadow: "var(--shadow-float)",
            border: "1px solid rgba(122,158,126,0.12)",
          }}
        >
          {/* Main row: thumbnail + info + actions */}
          <div className="flex gap-4 p-4">
            {/* Gradient thumbnail */}
            <div
              className="w-16 h-16 rounded-[var(--r-md)] flex items-center justify-center flex-shrink-0 text-3xl"
              style={{ background: gradient }}
            >
              {emoji}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 py-0.5">
              <h2 className="font-display font-normal text-[17px] leading-snug tracking-[-0.02em] text-[var(--ink)] line-clamp-1">
                {establishment.name}
              </h2>
              <p className="text-xs text-[var(--ink-faint)] mt-0.5 tracking-[0.02em]">
                {getEstablishmentTypeLabel(establishment.type)}
                {establishment.distance_meters !== undefined && (
                  <> · {formatDistance(establishment.distance_meters)}</>
                )}
              </p>
            </div>

            {/* Close + save */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--mist)] text-[var(--ink-faint)]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggle(establishment.place_id)}
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
          </div>

          {/* Feature chips */}
          <div className="px-4 pb-3">
            <FeatureChipRow features={establishment.features} />
          </div>

          {/* Actions */}
          <div
            className="flex gap-2 px-4 py-3"
            style={{ borderTop: "1px solid rgba(122,158,126,0.1)" }}
          >
            <Link
              href={`/contribute/${establishment.place_id}`}
              className="flex-1 py-2.5 rounded-[var(--r-pill)] text-sm text-center transition-colors text-[var(--ink-soft)] hover:bg-[var(--mist)]"
              style={{ border: "1.5px solid rgba(26,31,27,0.12)" }}
            >
              Add info
            </Link>
            <Link
              href={`/place/${establishment.place_id}`}
              className="flex-1 py-2.5 rounded-[var(--r-pill)] text-sm font-medium text-center text-white flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
              style={{ background: "var(--sage)" }}
            >
              View details <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
