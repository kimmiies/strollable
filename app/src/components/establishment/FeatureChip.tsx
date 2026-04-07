import type { FeatureType, FeatureStatus, FeatureValue } from "@/types";
import { FEATURE_LABELS, FEATURE_ICONS } from "@/types";
import { cn, getFeatureChipStyle } from "@/lib/utils";

interface FeatureChipProps {
  featureType: FeatureType;
  status: FeatureStatus;
  value: FeatureValue;
  size?: "sm" | "md";
  showLabel?: boolean;
  onClick?: () => void;
}

export default function FeatureChip({
  featureType,
  status,
  value,
  size = "sm",
  showLabel = true,
  onClick,
}: FeatureChipProps) {
  const { bg, text, label } = getFeatureChipStyle(status, value);
  const icon = FEATURE_ICONS[featureType];
  const featureLabel = FEATURE_LABELS[featureType];

  const displayLabel = status === "confirmed" ? label : status === "unknown" ? "?" : label;

  return (
    <span
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        bg,
        text,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        onClick && "cursor-pointer hover:opacity-80 transition-opacity"
      )}
      title={featureLabel}
    >
      <span>{icon}</span>
      {showLabel && <span>{displayLabel}</span>}
    </span>
  );
}
