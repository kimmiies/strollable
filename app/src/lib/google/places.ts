interface PlacesResult {
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
  google_data_json: Record<string, unknown>;
}

const PLACE_TYPE_MAP: Record<string, string> = {
  cafe: "cafe",
  restaurant: "restaurant",
  bakery: "bakery",
  bar: "bar",
  park: "park",
  museum: "museum",
  shopping_mall: "shopping_mall",
  pharmacy: "pharmacy",
  library: "library",
  gym: "gym",
  store: "store",
};

function mapPlaceType(types: string[]): string {
  for (const t of types) {
    if (PLACE_TYPE_MAP[t]) return PLACE_TYPE_MAP[t];
  }
  return "other";
}

export async function fetchPlaceDetails(
  placeId: string
): Promise<PlacesResult | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  const fieldMask = [
    "id",
    "displayName",
    "formattedAddress",
    "location",
    "types",
    "regularOpeningHours",
    "nationalPhoneNumber",
    "websiteUri",
    "rating",
  ].join(",");

  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
      next: { revalidate: 60 * 60 * 24 * 7 }, // cache 7 days
    }
  );

  if (!res.ok) return null;

  const data = await res.json();

  return {
    place_id: placeId,
    name: data.displayName?.text ?? "",
    address: data.formattedAddress ?? "",
    lat: data.location?.latitude ?? 0,
    lng: data.location?.longitude ?? 0,
    type: mapPlaceType(data.types ?? []),
    hours: data.regularOpeningHours ?? null,
    phone: data.nationalPhoneNumber ?? null,
    website: data.websiteUri ?? null,
    google_rating: data.rating ?? null,
    google_data_json: data,
  };
}

export async function searchPlaces(
  query: string,
  lat: number,
  lng: number
): Promise<Array<{ place_id: string; name: string; address: string }>> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return [];

  const res = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        textQuery: query,
        locationBias: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 2000,
          },
        },
        maxResultCount: 10,
      }),
    }
  );

  if (!res.ok) return [];
  const data = await res.json();

  return (data.places ?? []).map(
    (p: { id: string; displayName: { text: string }; formattedAddress: string }) => ({
      place_id: p.id,
      name: p.displayName?.text ?? "",
      address: p.formattedAddress ?? "",
    })
  );
}
