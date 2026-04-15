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
import type { FeatureType } from "@/types";

export const FEATURE_ICONS: Record<FeatureType, LucideIcon> = {
  step_free_entrance: Footprints,
  accessible_bathroom: LockOpen,
  change_table: Baby,
  high_chairs: Armchair,
  auto_door_opener: DoorOpen,
  stroller_friendly_layout: Navigation,
  booster_seats: Sofa,
  change_table_mens: User,
  change_table_family: Users,
};

export const STEP_2_FEATURES: FeatureType[] = [
  "step_free_entrance",
  "auto_door_opener",
];

export const STEP_3_FEATURES: FeatureType[] = [
  "accessible_bathroom",
  "change_table",
  "change_table_mens",
  "change_table_family",
];

export const STEP_4_FEATURES: FeatureType[] = [
  "high_chairs",
  "booster_seats",
  "stroller_friendly_layout",
];
