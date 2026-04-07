import Anthropic from "@anthropic-ai/sdk";
import type { Establishment } from "@/types";
import { FEATURE_LABELS } from "@/types";

const client = new Anthropic();

export function buildSummaryPrompt(establishment: Establishment): string {
  const featureLines = (
    ["step_free_entrance", "accessible_bathroom", "change_table"] as const
  ).map((type) => {
    const f = establishment.features[type];
    const label = FEATURE_LABELS[type];
    if (!f || f.status === "unknown") return `- ${label}: Not yet reported`;
    if (f.status === "reported") return `- ${label}: Reported (1 parent, unverified)`;
    if (f.status === "confirmed")
      return `- ${label}: Confirmed ${f.value} by ${f.report_count} parent${f.report_count !== 1 ? "s" : ""}`;
    if (f.status === "disputed") return `- ${label}: Disputed (mixed reports)`;
    return `- ${label}: Unknown`;
  });

  return `You are a helpful assistant for parents navigating cities with strollers.

Summarize this place's baby-friendliness in 2-3 warm, practical sentences.
Be honest about unknowns. Focus on what parents with strollers actually need to know.
Do not start with the place name. Write in a friendly, direct tone.

Place: ${establishment.name} (${establishment.type})
Location: ${establishment.address}

Community-reported baby-friendly features:
${featureLines.join("\n")}
${establishment.google_rating ? `\nGoogle rating: ${establishment.google_rating}/5` : ""}`;
}

export async function generateSummaryStream(
  establishment: Establishment
): Promise<ReadableStream<Uint8Array>> {
  const prompt = buildSummaryPrompt(establishment);

  const stream = client.messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 256,
    messages: [{ role: "user", content: prompt }],
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`
              )
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });
}
