import { NextResponse } from "next/server";
import { searchPlaces } from "@/lib/google/places";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "";
  const lat = parseFloat(searchParams.get("lat") ?? "43.65");
  const lng = parseFloat(searchParams.get("lng") ?? "-79.41");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchPlaces(query, lat, lng);
  return NextResponse.json({ results });
}
