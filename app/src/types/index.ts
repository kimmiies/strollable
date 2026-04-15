export type FeatureType =
  | "step_free_entrance"
  | "accessible_bathroom"
  | "change_table"
  | "high_chairs"
  | "auto_door_opener"
  | "stroller_friendly_layout"
  | "booster_seats"
  | "change_table_mens"
  | "change_table_family";

export type FeatureStatus = "unknown" | "reported" | "confirmed" | "disputed";

export type FeatureValue = "yes" | "no" | null;

export type FeatureAnswer = "yes" | "no" | "unsure";

export type BadgeType = "founding_reporter";

export interface Feature {
  id: string;
  establishment_id: string;
  feature_type: FeatureType;
  value: FeatureValue;
  status: FeatureStatus;
  report_count: number;
  yes_count: number;
  no_count: number;
}

export interface FeatureMap {
  step_free_entrance: Feature;
  accessible_bathroom: Feature;
  change_table: Feature;
  high_chairs: Feature;
  auto_door_opener: Feature;
  stroller_friendly_layout: Feature;
  booster_seats: Feature;
  change_table_mens: Feature;
  change_table_family: Feature;
}

export interface GoogleHours {
  open_now?: boolean;
  periods?: Array<{
    open: { day: number; time: string };
    close?: { day: number; time: string };
  }>;
  weekday_text?: string[];
}

export interface Establishment {
  id: string;
  place_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  hours: GoogleHours | null;
  phone: string | null;
  website: string | null;
  google_rating: number | null;
  google_data_json: Record<string, unknown> | null;
  community_rating: number | null;
  rating_count: number;
  features: FeatureMap;
  distance_meters?: number;
}

export interface Contribution {
  id: string;
  user_id: string;
  establishment_id: string;
  feature_id: string;
  value: FeatureAnswer;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  establishment_id: string;
  rating: number;
  comment: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BadgeFlags {
  founding_reporter: boolean;
}

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  badge_flags: BadgeFlags;
}

export interface BadgeDefinition {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  requirement: string;
}

export interface ContributionAnswer {
  feature_type: FeatureType;
  value: FeatureAnswer;
}

export interface ContributionSubmission {
  place_id: string;
  rating: number;
  comment?: string;
  photo_url?: string;
  answers: ContributionAnswer[];
}

export interface NearbyParams {
  lat: number;
  lng: number;
  radius?: number;
  type?: string;
}

export const FEATURE_LABELS: Record<FeatureType, string> = {
  step_free_entrance:       "Step-free entry",
  accessible_bathroom:      "Accessible bathroom",
  change_table:             "Change table",
  high_chairs:              "High chairs",
  auto_door_opener:         "Auto door opener",
  stroller_friendly_layout: "Stroller-friendly layout",
  booster_seats:            "Booster seats",
  change_table_mens:        "Change table (men's WC)",
  change_table_family:      "Change table (family WC)",
};

// Lucide icon names — used to render <LucideIcon name={FEATURE_ICON_NAMES[type]} />
// or imported directly via lucide-react
export const FEATURE_ICON_NAMES: Record<FeatureType, string> = {
  step_free_entrance:       "Footprints",
  accessible_bathroom:      "LockOpen",
  change_table:             "Baby",
  high_chairs:              "Armchair",
  auto_door_opener:         "DoorOpen",
  stroller_friendly_layout: "Navigation",
  booster_seats:            "Sofa",
  change_table_mens:        "User",
  change_table_family:      "Users",
};

// Kept for legacy compatibility — components should migrate to Lucide icons
export const FEATURE_ICONS: Record<FeatureType, string> = {
  step_free_entrance:       "🚪",
  accessible_bathroom:      "🚻",
  change_table:             "👶",
  high_chairs:              "🪑",
  auto_door_opener:         "🔁",
  stroller_friendly_layout: "🛤",
  booster_seats:            "🪑",
  change_table_mens:        "🚹",
  change_table_family:      "⚥",
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "founding_reporter",
    name: "Founding Reporter",
    description: "Helped build Strollable before launch.",
    icon: "⭐",
    requirement: "Join during the founding period",
  },
];
