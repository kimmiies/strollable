import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/demo";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { BadgeType, FeatureType } from "@/types";

interface ContributionInput {
  feature_type: FeatureType;
  value: "yes" | "no";
  comment?: string;
  photo_url?: string;
}

export async function POST(request: Request) {
  if (isDemoMode) {
    // Demo mode: simulate success
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ success: true, newBadge: "reporter" });
  }

  const supabase = await createClient();
  const serviceClient = await createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { place_id, contributions } = body as {
    place_id: string;
    contributions: ContributionInput[];
  };

  if (!place_id || !contributions?.length) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Get the establishment
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

  // Determine if this establishment had any prior contributions (for scout badge)
  const { count: priorCount } = await serviceClient
    .from("contributions")
    .select("*", { count: "exact", head: true })
    .eq("establishment_id", establishmentId);

  const isScout = (priorCount ?? 0) === 0;

  // Get feature IDs
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

  // Determine contribution type per contribution
  const insertRows = contributions
    .filter((c) => featureMap[c.feature_type])
    .map((c) => {
      // Check if user previously voted on this feature
      return {
        user_id: user.id,
        establishment_id: establishmentId,
        feature_id: featureMap[c.feature_type],
        contribution_type: isScout ? "scout" : "report",
        value: c.value,
        comment: c.comment ?? null,
        photo_url: c.photo_url ?? null,
      };
    });

  if (!insertRows.length) {
    return NextResponse.json({ error: "No valid features" }, { status: 400 });
  }

  // Check if user has prior contributions at this establishment (to determine verify vs report)
  const { count: userPriorCount } = await serviceClient
    .from("contributions")
    .select("*", { count: "exact", head: true })
    .eq("establishment_id", establishmentId)
    .eq("user_id", user.id);

  const finalRows = insertRows.map((row) => ({
    ...row,
    contribution_type:
      isScout
        ? "scout"
        : (userPriorCount ?? 0) > 0
        ? "verify"
        : "report",
  }));

  // Upsert contributions (one per user per feature)
  const { error: upsertError } = await serviceClient
    .from("contributions")
    .upsert(finalRows, { onConflict: "user_id,feature_id" });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  // Update contribution counts and evaluate badges
  const newReports = finalRows.filter((r) => r.contribution_type === "report").length;
  const newVerifications = finalRows.filter((r) => r.contribution_type === "verify").length;
  const newScouts = isScout ? 1 : 0;

  const { data: currentUser } = await serviceClient
    .from("users")
    .select("badge_flags, contribution_counts")
    .eq("id", user.id)
    .single();

  if (!currentUser) {
    return NextResponse.json({ success: true, newBadge: null });
  }

  const flags = currentUser.badge_flags as Record<BadgeType, boolean>;
  const counts = currentUser.contribution_counts as {
    reports: number;
    verifications: number;
    scouts: number;
  };

  const earned: BadgeType[] = [];

  if (!flags.reporter && (counts.reports + newReports) >= 1) {
    earned.push("reporter");
  }
  if (!flags.verifier && (counts.verifications + newVerifications) >= 3) {
    earned.push("verifier");
  }
  if (!flags.scout && (counts.scouts + newScouts) >= 3) {
    earned.push("scout");
  }

  await serviceClient
    .from("users")
    .update({
      badge_flags: {
        ...flags,
        ...Object.fromEntries(earned.map((b) => [b, true])),
      },
      contribution_counts: {
        reports: counts.reports + newReports,
        verifications: counts.verifications + newVerifications,
        scouts: counts.scouts + newScouts,
      },
    })
    .eq("id", user.id);

  return NextResponse.json({
    success: true,
    newBadge: earned[0] ?? null,
  });
}
