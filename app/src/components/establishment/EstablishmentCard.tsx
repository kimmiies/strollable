"use client";

import Link from "next/link";
import { Heart, Star, X } from "lucide-react";
import type { Establishment } from "@/types";
import {
  cn,
  formatDistance,
  formatRating,
  getEstablishmentTypeLabel,
  getNeighbourhoodFromAddress,
} from "@/lib/utils";

const PHOTO_GRADIENTS = [
  "linear-gradient(160deg,#c8b89a 0%,#a08060 40%,#6b5040 100%)",
  "linear-gradient(140deg,#b8c8b0 0%,#8aaa80 50%,#5a7850 100%)",
  "linear-gradient(150deg,#d0c0a8 0%,#b09878 40%,#806848 100%)",
  "linear-gradient(160deg,#c0d0d8 0%,#90b0c0 50%,#608098 100%)",
];

function pickGradient(placeId: string): string {
  let hash = 0;
  for (let i = 0; i < placeId.length; i++) hash = (hash * 31 + placeId.charCodeAt(i)) | 0;
  return PHOTO_GRADIENTS[Math.abs(hash) % PHOTO_GRADIENTS.length];
}
import FeatureChipRow from "./FeatureChipRow";

interface EstablishmentCardProps {
  establishment: Establishment;
  isSaved: boolean;
  onSaveToggle: (placeId: string) => void;
  onClick?: () => void;
  isSelected?: boolean;
  /** When provided, renders a dismiss (×) button in the top-left of the hero.
   *  Used when the card is overlaid on the map so it can be closed. */
  onDismiss?: () => void;
}

export default function EstablishmentCard({
  establishment,
  isSaved,
  onSaveToggle,
  onClick,
  isSelected = false,
  onDismiss,
}: EstablishmentCardProps) {
  const gradient = pickGradient(establishment.place_id);
  const neighbourhood = getNeighbourhoodFromAddress(establishment.address);

  const metaParts = [
    getEstablishmentTypeLabel(establishment.type),
    neighbourhood || null,
    establishment.distance_meters !== undefined
      ? formatDistance(establishment.distance_meters)
      : null,
  ].filter(Boolean);

  return (
    <Link
      href={`/place/${establishment.place_id}`}
      className={cn(
        "bg-[var(--warm-white)] rounded-[var(--r-lg)] overflow-hidden block",
        "transition-all flex flex-col",
        isSelected
          ? "shadow-[var(--shadow-float)]"
          : "shadow-[var(--shadow-card)] hover:-translate-y-[3px] hover:shadow-[var(--shadow-float)]"
      )}
      style={{
        transition:
          "transform 0.25s cubic-bezier(.16,1,.3,1), box-shadow 0.25s cubic-bezier(.16,1,.3,1)",
      }}
      onClick={onClick}
    >
      {/* Photo / gradient hero */}
      <div
        className="relative h-44 flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{ background: gradient }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(26,31,27,0.35) 0%, transparent 60%)",
          }}
        />

        {/* Dismiss button — top-left, only when onDismiss is provided */}
        {onDismiss && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDismiss();
            }}
            className="absolute top-3 left-3 z-[2] w-9 h-9 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-[var(--shadow-sm)] transition-transform hover:scale-110"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-[var(--ink-soft)]" />
          </button>
        )}

        {/* Save button — top-right, always */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSaveToggle(establishment.place_id);
          }}
          className={cn(
            "absolute top-3 right-3 z-[2] w-9 h-9 rounded-full flex items-center justify-center",
            "backdrop-blur-sm shadow-[var(--shadow-sm)]",
            "transition-transform hover:scale-110",
            isSaved ? "bg-[var(--terracotta)]" : "bg-white/90"
          )}
          aria-label={isSaved ? "Unsave" : "Save"}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isSaved ? "fill-white text-white" : "text-[var(--ink-soft)]"
            )}
          />
        </button>
      </div>

      {/* Card body */}
      <div className="px-[18px] pt-4 pb-3.5 space-y-2.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="font-display font-normal text-[18px] leading-snug tracking-[-0.02em] text-[var(--ink)] line-clamp-2">
            {establishment.name}
          </span>
          {establishment.google_rating && (
            <span className="flex items-center gap-0.5 text-[13px] font-medium text-[var(--amber)] flex-shrink-0 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-current" />
              {formatRating(establishment.google_rating)}
            </span>
          )}
        </div>

        <p className="text-xs text-[var(--ink-faint)] tracking-[0.02em]">
          {metaParts.join(" · ")}
        </p>

        <FeatureChipRow features={establishment.features} compact />
      </div>
    </Link>
  );
}
