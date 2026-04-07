export type FeatureType =
  | "step_free_entrance"
  | "accessible_bathroom"
  | "change_table";

export type FeatureStatus = "unknown" | "reported" | "confirmed" | "disputed";

export type FeatureValue = "yes" | "no" | null;

export type ContributionType = "report" | "verify" | "scout";

export type BadgeType =
  | "founding_reporter"
  | "reporter"
  | "verifier"
  | "scout";

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
  features: FeatureMap;
  distance_meters?: number;
}

export interface Contribution {
  id: string;
  user_id: string;
  establishment_id: string;
  feature_id: string;
  contribution_type: ContributionType;
  value: string;
  comment: string | null;
  photo_url: string | null;
  created_at: string;
}

export interface BadgeFlags {
  founding_reporter: boolean;
  reporter: boolean;
  verifier: boolean;
  scout: boolean;
}

export interface ContributionCounts {
  reports: number;
  verifications: number;
  scouts: number;
}

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  badge_flags: BadgeFlags;
  contribution_counts: ContributionCounts;
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
  value: "yes" | "no";
}

export interface ContributionSubmission {
  place_id: string;
  contributions: Array<{
    feature_type: FeatureType;
    value: "yes" | "no";
    comment?: string;
    photo_url?: string;
  }>;
}

export interface NearbyParams {
  lat: number;
  lng: number;
  radius?: number;
  type?: string;
}

export const FEATURE_LABELS: Record<FeatureType, string> = {
  step_free_entrance: "Step-free entrance",
  accessible_bathroom: "Accessible bathroom",
  change_table: "Change table",
};

export const FEATURE_ICONS: Record<FeatureType, string> = {
  step_free_entrance: "🚪",
  accessible_bathroom: "🚻",
  change_table: "👶",
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "founding_reporter",
    name: "Founding Reporter",
    description: "Helped build Strollable before launch.",
    icon: "⭐",
    requirement: "Join during the founding period",
  },
  {
    id: "reporter",
    name: "Reporter",
    description: "Submitted your first feature report.",
    icon: "✏️",
    requirement: "Submit your first report",
  },
  {
    id: "verifier",
    name: "Verifier",
    description: "Verified features at 3+ establishments.",
    icon: "✅",
    requirement: "Verify features at 3 establishments",
  },
  {
    id: "scout",
    name: "Scout",
    description: "First to report on 3+ establishments.",
    icon: "🔭",
    requirement: "Be first to report at 3 new places",
  },
];
