import type { FeatureMap, FeatureType } from "@/types";
import FeatureChip from "./FeatureChip";

const FEATURE_TYPES: FeatureType[] = [
  "step_free_entrance",
  "accessible_bathroom",
  "change_table",
];

interface FeatureChipRowProps {
  features: FeatureMap;
  size?: "sm" | "md";
}

export default function FeatureChipRow({
  features,
  size = "sm",
}: FeatureChipRowProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {FEATURE_TYPES.map((type) => {
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
