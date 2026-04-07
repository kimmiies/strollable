import { NextResponse } from "next/server";
import { isDemoMode, DEMO_ESTABLISHMENTS } from "@/lib/demo";
import { createClient } from "@/lib/supabase/server";
import { fetchPlaceDetails } from "@/lib/google/places";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ placeId: string }> }
) {
  const { placeId } = await params;

  if (isDemoMode) {
    const found = DEMO_ESTABLISHMENTS.find((e) => e.place_id === placeId);
    if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ establishment: found });
  }

  const supabase = await createClient();

  // Try DB first
  const { data: existing } = await supabase
    .from("establishments")
    .select("*, features(*)")
    .eq("place_id", placeId)
    .single();

  if (existing) {
    const shaped = shapeEstablishment(existing);
    return NextResponse.json({ establishment: shaped });
  }

  // Not in DB — fetch from Google Places and upsert
  const placeData = await fetchPlaceDetails(placeId);
  if (!placeData) {
    return NextResponse.json({ error: "Place not found" }, { status: 404 });
  }

  const { data: inserted, error } = await supabase
    .from("establishments")
    .upsert({
      place_id: placeData.place_id,
      name: placeData.name,
      address: placeData.address,
      lat: placeData.lat,
      lng: placeData.lng,
      type: placeData.type,
      hours: placeData.hours,
      phone: placeData.phone,
      website: placeData.website,
      google_rating: placeData.google_rating,
      google_data_json: placeData.google_data_json,
    })
    .select("*, features(*)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ establishment: shapeEstablishment(inserted) });
}

function shapeEstablishment(row: {
  id: string;
  place_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  hours: unknown;
  phone: string | null;
  website: string | null;
  google_rating: number | null;
  google_data_json: unknown;
  features?: Array<{
    id: string;
    establishment_id: string;
    feature_type: string;
    value: string | null;
    status: string;
    report_count: number;
    yes_count: number;
    no_count: number;
  }>;
}) {
  const features = row.features ?? [];
  const makeFeature = (type: string) => {
    const f = features.find((x) => x.feature_type === type);
    return f ?? { id: "", establishment_id: row.id, feature_type: type, value: null, status: "unknown", report_count: 0, yes_count: 0, no_count: 0 };
  };
  return {
    ...row,
    features: {
      step_free_entrance: makeFeature("step_free_entrance"),
      accessible_bathroom: makeFeature("accessible_bathroom"),
      change_table: makeFeature("change_table"),
    },
  };
}
