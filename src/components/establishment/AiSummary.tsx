"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface AiSummaryProps {
  placeId: string;
}

export default function AiSummary({ placeId }: AiSummaryProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchSummary() {
      try {
        const res = await fetch(`/api/summary/${placeId}`);
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        setLoading(false);

        while (mounted) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.text) {
                  setText((prev) => prev + data.text);
                }
              } catch {
                // skip malformed line
              }
            }
          }
        }
      } catch {
        if (mounted) setError(true);
        setLoading(false);
      }
    }

    fetchSummary();
    return () => {
      mounted = false;
    };
  }, [placeId]);

  if (error) return null;

  return (
    <div className="bg-[var(--primary)]/5 rounded-2xl p-4 mx-4 my-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-[var(--primary)]" />
        <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wide">
          AI Summary
        </span>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-3 bg-[var(--primary)]/20 rounded animate-pulse w-full" />
          <div className="h-3 bg-[var(--primary)]/20 rounded animate-pulse w-4/5" />
        </div>
      ) : (
        <p className="text-sm text-[var(--foreground)] leading-relaxed">{text}</p>
      )}
    </div>
  );
}
