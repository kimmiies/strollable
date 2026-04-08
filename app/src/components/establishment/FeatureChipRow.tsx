import type { FeatureMap, FeatureType } from "@/types";
import FeatureChip from "./FeatureChip";

// All 9 features — flat list, no hierarchy
const ALL_FEATURE_TYPES: FeatureType[] = [
  "step_free_entrance",
  "accessible_bathroom",
  "change_table",
  "high_chairs",
  "auto_door_opener",
  "stroller_friendly_layout",
  "booster_seats",
  "change_table_mens",
  "change_table_family",
];

interface FeatureChipRowProps {
  features: FeatureMap;
  size?: "sm" | "md";
  // compact: on cards — cap at 3 chips, prioritise features with data
  compact?: boolean;
}

export default function FeatureChipRow({
  features,
  size = "sm",
  compact = false,
}: FeatureChipRowProps) {
  let typesToShow: FeatureType[];

  if (compact) {
    // Sort: confirmed first, then reported, then disputed, then unknown
    const priority = (type: FeatureType) => {
      const s = features[type]?.status;
      if (s === "confirmed") return 0;
      if (s === "reported")  return 1;
      if (s === "disputed")  return 2;
      return 3;
    };
    typesToShow = [...ALL_FEATURE_TYPES]
      .sort((a, b) => priority(a) - priority(b))
      .slice(0, 3);
  } else {
    typesToShow = ALL_FEATURE_TYPES;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {typesToShow.map((type) => {
        const feature = features[type];
        return (
          <FeatureChip
            key={type}
            featureType={type}
            status={feature?.status ?? "unknown"}
            value={feature?.value ?? null}
            size={size}
          />
        );
      })}
    </div>
  );
}
