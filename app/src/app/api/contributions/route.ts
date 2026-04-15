import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/demo";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { FeatureAnswer, FeatureType } from "@/types";

interface AnswerInput {
  feature_type: FeatureType;
  value: FeatureAnswer;
}

interface SubmitBody {
  place_id: string;
  rating: number;
  comment?: string;
  photo_url?: string;
  answers: AnswerInput[];
}

export async function POST(request: Request) {
  if (isDemoMode) {
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ success: true, newBadge: null });
  }

  const supabase = await createClient();
  const serviceClient = await createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as SubmitBody;
  const { place_id, rating, comment, photo_url, answers } = body;

  if (!place_id || !answers?.length) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
  }

  const { data: establishment } = await serviceClient
    .from("establishments")
    .select("id")
    .eq("place_id", place_id)
    .single();

  if (!establishment) {
    return NextResponse.json(
      { error: "Establishment not found" },
      { status: 404 }
    );
  }

  const establishmentId = establishment.id;

  const { data: features } = await serviceClient
    .from("features")
    .select("id, feature_type")
    .eq("establishment_id", establishmentId);

  if (!features) {
    return NextResponse.json({ error: "Features not found" }, { status: 500 });
  }

  const featureMap = Object.fromEntries(
    features.map((f: { id: string; feature_type: string }) => [f.feature_type, f.id])
  );

  const contributionRows = answers
    .filter((a) => featureMap[a.feature_type])
    .map((a) => ({
      user_id: user.id,
      establishment_id: establishmentId,
      feature_id: featureMap[a.feature_type],
      value: a.value,
    }));

  if (!contributionRows.length) {
    return NextResponse.json({ error: "No valid features" }, { status: 400 });
  }

  const { error: reviewError } = await serviceClient
    .from("reviews")
    .upsert(
      {
        user_id: user.id,
        establishment_id: establishmentId,
        rating,
        comment: comment ?? null,
        photo_url: photo_url ?? null,
      },
      { onConflict: "user_id,establishment_id" }
    );

  if (reviewError) {
    return NextResponse.json({ error: reviewError.message }, { status: 500 });
  }

  const { error: contributionError } = await serviceClient
    .from("contributions")
    .upsert(contributionRows, { onConflict: "user_id,feature_id" });

  if (contributionError) {
    return NextResponse.json({ error: contributionError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, newBadge: null });
}
