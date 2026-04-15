import { notFound } from "next/navigation";
import EstablishmentDetail from "@/components/establishment/EstablishmentDetail";
import { isDemoMode, DEMO_ESTABLISHMENTS } from "@/lib/demo";
import { createClient } from "@/lib/supabase/server";
import type { FeatureType } from "@/types";

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

async function getEstablishment(placeId: string) {
  if (isDemoMode) {
    return DEMO_ESTABLISHMENTS.find((e) => e.place_id === placeId) ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("establishments")
    .select("*, features(*)")
    .eq("place_id", placeId)
    .single();

  if (!data) return null;

  type RawFeature = {
    id: string;
    establishment_id: string;
    feature_type: string;
    value: string | null;
    status: string;
    report_count: number;
    yes_count: number;
    no_count: number;
  };

  const makeFeature = (type: FeatureType) => {
    const f = (data.features as RawFeature[])?.find(
      (x) => x.feature_type === type
    );
    return f ?? {
      id: "",
      establishment_id: data.id,
      feature_type: type,
      value: null,
      status: "unknown",
      report_count: 0,
      yes_count: 0,
      no_count: 0,
    };
  };

  return {
    ...data,
    features: Object.fromEntries(
      ALL_FEATURE_TYPES.map((t) => [t, makeFeature(t)])
    ),
  };
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ placeId: string }>;
}) {
  const { placeId } = await params;
  const establishment = await getEstablishment(placeId);

  if (!establishment) notFound();

  // TopBar intentionally removed — EstablishmentDetail renders its own
  // mobile nav bar (brand + back + save) consistent with the design system.
  // TopNav handles desktop navigation globally via the app layout.
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: "var(--cream)" }}>
      <EstablishmentDetail establishment={establishment as never} />
    </div>
  );
}
