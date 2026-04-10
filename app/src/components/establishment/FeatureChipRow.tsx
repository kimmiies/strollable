import type { FeatureMap, FeatureType } from "@/types";
import FeatureChip from "./FeatureChip";

// v1 launch features first, then v2
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
  /**
   * compact: card mode — show top 3 chips, prioritised by data richness.
   * Unknown chips get a "?" suffix so parents know the data is missing.
   */
  compact?: boolean;
  /** onlyConfirmed: peek card / map mode — show only confirmed-yes chips */
  onlyConfirmed?: boolean;
}

export default function FeatureChipRow({
  features,
  size = "sm",
  compact = false,
  onlyConfirmed = false,
}: FeatureChipRowProps) {
  let typesToShow: FeatureType[];

  if (onlyConfirmed) {
    // Map peek card: confirmed-yes only, no cap
    typesToShow = ALL_FEATURE_TYPES.filter(
      (type) => features[type]?.status === "confirmed" && features[type]?.value === "yes"
    );
  } else if (compact) {
    // Card: sort by richness, cap at 3
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

  if (typesToShow.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {typesToShow.map((type) => {
        const feature = features[type];
        const status = feature?.status ?? "unknown";
        // In compact mode, append "?" to unknown chip labels so parents
        // understand this field hasn't been checked yet
        const unknownSuffix = compact && status === "unknown";
        return (
          <FeatureChip
            key={type}
            featureType={type}
            status={status}
            value={feature?.value ?? null}
            size={size}
            labelSuffix={unknownSuffix ? "?" : undefined}
          />
        );
      })}
    </div>
  );
}
