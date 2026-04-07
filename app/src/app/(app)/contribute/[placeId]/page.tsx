import { notFound } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import ContributionForm from "@/components/contribution/ContributionForm";
import { isDemoMode, DEMO_ESTABLISHMENTS } from "@/lib/demo";
import { createClient } from "@/lib/supabase/server";

async function getEstablishment(placeId: string) {
  if (isDemoMode) {
    return DEMO_ESTABLISHMENTS.find((e) => e.place_id === placeId) ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("establishments")
    .select("*, features(*)")
    .eq("place_id", placeId)
    .single();

  if (!data) return null;

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
    return f ?? {
      id: "",
      establishment_id: data.id,
      feature_type: type,
      value: null,
      status: "unknown",
      report_count: 0,
      yes_count: 0,
      no_count: 0,
    };
  };

  return {
    ...data,
    features: {
      step_free_entrance: makeFeature("step_free_entrance"),
      accessible_bathroom: makeFeature("accessible_bathroom"),
      change_table: makeFeature("change_table"),
    },
  };
}

export default async function ContributePage({
  params,
}: {
  params: Promise<{ placeId: string }>;
}) {
  const { placeId } = await params;
  const establishment = await getEstablishment(placeId);

  if (!establishment) notFound();

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[var(--background)]">
      <TopBar showBack title={establishment.name} />
      <ContributionForm establishment={establishment} />
    </div>
  );
}
