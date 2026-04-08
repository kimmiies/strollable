import {
  Footprints,
  LockOpen,
  Baby,
  Armchair,
  DoorOpen,
  Navigation,
  Sofa,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { FeatureType, FeatureStatus, FeatureValue } from "@/types";
import { FEATURE_LABELS } from "@/types";
import { cn } from "@/lib/utils";

const FEATURE_ICON_MAP: Record<FeatureType, LucideIcon> = {
  step_free_entrance:       Footprints,
  accessible_bathroom:      LockOpen,
  change_table:             Baby,
  high_chairs:              Armchair,
  auto_door_opener:         DoorOpen,
  stroller_friendly_layout: Navigation,
  booster_seats:            Sofa,
  change_table_mens:        User,
  change_table_family:      Users,
};

// Pill colour reflects state only — label is always the feature name
function getChipStyle(
  status: FeatureStatus,
  value: FeatureValue
): { bg: string; text: string } {
  if (status === "confirmed") {
    if (value === "yes") {
      return {
        bg:   "bg-[var(--mist)] border border-[rgba(122,158,126,0.25)]",
        text: "text-[var(--sage-deep)]",
      };
    }
    // confirmed no
    return {
      bg:   "bg-[var(--terra-light)] border border-[rgba(201,113,74,0.25)]",
      text: "text-[var(--terracotta)]",
    };
  }
  if (status === "reported") {
    return {
      bg:   "bg-[var(--amber-light)] border border-[rgba(212,149,42,0.2)]",
      text: "text-[var(--amber)]",
    };
  }
  if (status === "disputed") {
    return {
      bg:   "bg-[var(--terra-light)] border border-[rgba(201,113,74,0.25)]",
      text: "text-[var(--terracotta)]",
    };
  }
  // unknown
  return {
    bg:   "bg-transparent border border-[rgba(26,31,27,0.18)]",
    text: "text-[var(--ink-faint)]",
  };
}

interface FeatureChipProps {
  featureType: FeatureType;
  status: FeatureStatus;
  value: FeatureValue;
  size?: "sm" | "md";
  onClick?: () => void;
}

export default function FeatureChip({
  featureType,
  status,
  value,
  size = "sm",
  onClick,
}: FeatureChipProps) {
  const { bg, text } = getChipStyle(status, value);
  const Icon = FEATURE_ICON_MAP[featureType];
  const label = FEATURE_LABELS[featureType];

  return (
    <span
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-normal whitespace-nowrap",
        bg,
        text,
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-sm",
        onClick && "cursor-pointer hover:opacity-80 transition-opacity"
      )}
      title={label}
    >
      <Icon className={cn("flex-shrink-0", size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
      <span>{label}</span>
    </span>
  );
}
