import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/demo";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (isDemoMode) {
    return NextResponse.json({ saved: [] });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("saved_places")
    .select("id, establishment_id, establishments(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ saved: data ?? [] });
}

export async function POST(request: Request) {
  if (isDemoMode) {
    return NextResponse.json({ success: true });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { place_id } = await request.json();

  // Find establishment by place_id
  const { data: establishment } = await supabase
    .from("establishments")
    .select("id")
    .eq("place_id", place_id)
    .single();

  if (!establishment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("saved_places")
    .insert({ user_id: user.id, establishment_id: establishment.id });

  if (error && !error.message.includes("duplicate")) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  if (isDemoMode) {
    return NextResponse.json({ success: true });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { place_id } = await request.json();

  const { data: establishment } = await supabase
    .from("establishments")
    .select("id")
    .eq("place_id", place_id)
    .single();

  if (!establishment) {
    return NextResponse.json({ success: true });
  }

  await supabase
    .from("saved_places")
    .delete()
    .eq("user_id", user.id)
    .eq("establishment_id", establishment.id);

  return NextResponse.json({ success: true });
}
