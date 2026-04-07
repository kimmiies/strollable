import { NextResponse } from "next/server";
import { isDemoMode, filterDemoEstablishments, DEMO_ESTABLISHMENTS } from "@/lib/demo";
import { createClient } from "@/lib/supabase/server";
import type { Establishment } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") ?? "0");
  const lng = parseFloat(searchParams.get("lng") ?? "0");
  const radius = parseInt(searchParams.get("radius") ?? "1500");
  const type = searchParams.get("type") ?? undefined;

  if (isDemoMode) {
    const establishments = filterDemoEstablishments(DEMO_ESTABLISHMENTS, type);
    return NextResponse.json({ establishments });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_establishments_near", {
    p_lat: lat,
    p_lng: lng,
    p_radius: radius,
    p_type: type ?? null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Reshape DB rows into Establishment shape
  const establishments: Establishment[] = (data ?? []).map(
    (row: {
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
      distance_meters: number;
      features: Record<string, {
        id: string;
        establishment_id: string;
        feature_type: string;
        value: string | null;
        status: string;
        report_count: number;
        yes_count: number;
        no_count: number;
      }>;
    }) => ({
      ...row,
      google_data_json: null,
      features: {
        step_free_entrance: row.features?.step_free_entrance ?? defaultFeature(row.id, "step_free_entrance"),
        accessible_bathroom: row.features?.accessible_bathroom ?? defaultFeature(row.id, "accessible_bathroom"),
        change_table: row.features?.change_table ?? defaultFeature(row.id, "change_table"),
      },
    })
  );

  return NextResponse.json({ establishments });
}

function defaultFeature(establishmentId: string, featureType: string) {
  return {
    id: "",
    establishment_id: establishmentId,
    feature_type: featureType,
    value: null,
    status: "unknown",
    report_count: 0,
    yes_count: 0,
    no_count: 0,
  };
}
