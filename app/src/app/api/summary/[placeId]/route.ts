import { NextResponse } from "next/server";
import { isDemoMode, DEMO_ESTABLISHMENTS } from "@/lib/demo";
import { createClient } from "@/lib/supabase/server";
import { generateSummaryStream } from "@/lib/anthropic/summary";
import type { Establishment } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ placeId: string }> }
) {
  const { placeId } = await params;

  let establishment: Establishment | null = null;

  if (isDemoMode) {
    establishment =
      DEMO_ESTABLISHMENTS.find((e) => e.place_id === placeId) ?? null;
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("establishments")
      .select("*, features(*)")
      .eq("place_id", placeId)
      .single();

    if (data) {
      const makeFeature = (type: string) => {
        const f = (data.features as Array<{
          id: string;
          establishment_id: string;
          feature_type: string;
          value: string | null;
          status: string;
          report_count: number;
          yes_count: number;
          no_count: number;
        }>)?.find((x) => x.feature_type === type);
        return f ?? { id: "", establishment_id: data.id, feature_type: type, value: null, status: "unknown", report_count: 0, yes_count: 0, no_count: 0 };
      };
      establishment = {
        ...data,
        features: {
          step_free_entrance: makeFeature("step_free_entrance"),
          accessible_bathroom: makeFeature("accessible_bathroom"),
          change_table: makeFeature("change_table"),
        },
      };
    }
  }

  if (!establishment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI summaries not configured" },
      { status: 503 }
    );
  }

  const stream = await generateSummaryStream(establishment);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
