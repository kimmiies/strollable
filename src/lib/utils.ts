import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { FeatureStatus, FeatureValue } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(meters?: number): string {
  if (!meters) return "";
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function getFeatureChipStyle(
  status: FeatureStatus,
  value: FeatureValue
): { bg: string; text: string; label: string } {
  if (status === "confirmed") {
    if (value === "yes") {
      return {
        bg: "bg-[var(--mist)] border border-[rgba(122,158,126,0.25)]",
        text: "text-[var(--sage-deep)]",
        label: "Yes",
      };
    }
    return {
      bg: "bg-[var(--terra-light)] border border-[rgba(201,113,74,0.25)]",
      text: "text-[var(--terracotta)]",
      label: "No",
    };
  }
  if (status === "reported") {
    return {
      bg: "bg-[var(--amber-light)] border border-[rgba(212,149,42,0.2)]",
      text: "text-[var(--amber)]",
      label: "Reported",
    };
  }
  if (status === "disputed") {
    return {
      bg: "bg-[var(--terra-light)] border border-[rgba(201,113,74,0.25)]",
      text: "text-[var(--terracotta)]",
      label: "Disputed",
    };
  }
  // unknown
  return {
    bg: "bg-[rgba(26,31,27,0.05)]",
    text: "text-[var(--ink-faint)]",
    label: "?",
  };
}

export function getEstablishmentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    cafe: "Café",
    restaurant: "Restaurant",
    bakery: "Bakery",
    bar: "Bar",
    other: "Other",
  };
  return labels[type] ?? "Other";
}

// CSS gradient + emoji for photo placeholders — aligned to design system palette
export function getTypePlaceholder(type: string): {
  gradient: string; // CSS background value (use as inline style)
  emoji: string;
} {
  const map: Record<string, { gradient: string; emoji: string }> = {
    cafe:       { gradient: "linear-gradient(145deg, #c8e0cb, #8fb593)", emoji: "☕" },
    restaurant: { gradient: "linear-gradient(145deg, #e8d5c0, #c9a882)", emoji: "🍽️" },
    bakery:     { gradient: "linear-gradient(145deg, #f5e8d0, #e8c898)", emoji: "🥐" },
    bar:        { gradient: "linear-gradient(145deg, #d6d0e8, #a89ec0)", emoji: "🍺" },
    other:      { gradient: "linear-gradient(145deg, #d4dcd5, #a8b8aa)", emoji: "🍴" },
  };
  return map[type] ?? map.other;
}

export function getBestFeatureStatus(
  features: Record<string, { status: FeatureStatus; value: FeatureValue }>
): FeatureStatus {
  const statuses = Object.values(features).map((f) => f.status);
  if (statuses.some((s) => s === "confirmed")) return "confirmed";
  if (statuses.some((s) => s === "reported")) return "reported";
  if (statuses.some((s) => s === "disputed")) return "disputed";
  return "unknown";
}

export function getNeighbourhoodFromAddress(address?: string | null): string {
  if (!address) return "";
  const street = address.split(",")[0].trim();
  return street.replace(/^\d+\s+/, "");
}

export function isBabyFriendly(features: {
  step_free_entrance?: { status: string; value: string | null };
}): boolean {
  const entrance = features.step_free_entrance;
  return entrance?.status === "confirmed" && entrance?.value === "yes";
}

export function formatRating(rating: number | null): string {
  if (!rating) return "";
  return rating.toFixed(1);
}

export function formatHours(hours: {
  open_now?: boolean;
  weekday_text?: string[];
} | null): { isOpen: boolean | null; todayHours: string | null } {
  if (!hours) return { isOpen: null, todayHours: null };
  const dayIndex = new Date().getDay();
  const todayText = hours.weekday_text?.[dayIndex === 0 ? 6 : dayIndex - 1];
  const todayHours = todayText
    ? todayText.replace(/^[A-Za-z]+:\s*/, "")
    : null;
  return {
    isOpen: hours.open_now ?? null,
    todayHours,
  };
}
