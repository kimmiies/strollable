import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

let initialized = false;

function initMaps() {
  if (initialized) return;
  setOptions({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    v: "weekly",
  });
  initialized = true;
}

export async function loadGoogleMaps(): Promise<typeof google.maps> {
  initMaps();
  await importLibrary("maps");
  await importLibrary("marker");
  await importLibrary("places");
  return google.maps;
}

export function isGoogleMapsAvailable(): boolean {
  return typeof google !== "undefined" && !!google.maps;
}
