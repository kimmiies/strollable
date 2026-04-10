"use client";

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
import { cn } from "@/lib/utils";
import { FEATURE_LABELS, type FeatureType } from "@/types";

const FEATURE_FILTERS: { value: FeatureType; Icon: LucideIcon }[] = [
  { value: "step_free_entrance",       Icon: Footprints },
  { value: "accessible_bathroom",      Icon: LockOpen },
  { value: "change_table",             Icon: Baby },
  { value: "high_chairs",              Icon: Armchair },
  { value: "auto_door_opener",         Icon: DoorOpen },
  { value: "stroller_friendly_layout", Icon: Navigation },
  { value: "booster_seats",            Icon: Sofa },
  { value: "change_table_mens",        Icon: User },
  { value: "change_table_family",      Icon: Users },
];

interface MapFiltersProps {
  activeFeatureFilters: string[];
  onToggleFeature: (feature: string) => void;
  className?: string;
}

export default function MapFilters({
  activeFeatureFilters,
  onToggleFeature,
  className,
}: MapFiltersProps) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto no-scrollbar", className)}>
      {FEATURE_FILTERS.map(({ value, Icon }) => {
        const active = activeFeatureFilters.includes(value);
        return (
          <button
            key={value}
            onClick={() => onToggleFeature(value)}
            className={cn(
              "flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-[var(--r-pill)] text-[13px] transition-all",
              "border focus:outline-none min-h-[34px]",
              active
                ? "bg-[var(--sage-deep)] text-white border-[var(--sage-deep)]"
                : "bg-[var(--warm-white)] text-[var(--ink-soft)] border-[rgba(26,31,27,0.12)] hover:border-[var(--sage)] hover:text-[var(--sage-deep)]"
            )}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            {FEATURE_LABELS[value]}
          </button>
        );
      })}
    </div>
  );
}
