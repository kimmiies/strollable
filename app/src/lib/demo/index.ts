export const isDemoMode =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
  !process.env.NEXT_PUBLIC_SUPABASE_URL;

export { DEMO_ESTABLISHMENTS, DEMO_CENTER, filterDemoEstablishments } from "./data";
