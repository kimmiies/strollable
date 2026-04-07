"use client";

import TopBar from "@/components/layout/TopBar";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_ESTABLISHMENTS } from "@/lib/demo/data";
import { isDemoMode } from "@/lib/demo";

export default function ContributeIndexPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    Array<{ place_id: string; name: string; address: string }>
  >([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(q: string) {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      return;
    }

    if (isDemoMode) {
      const filtered = DEMO_ESTABLISHMENTS.filter(
        (e) =>
          e.name.toLowerCase().includes(q.toLowerCase()) ||
          e.address.toLowerCase().includes(q.toLowerCase())
      );
      setResults(filtered.map((e) => ({ place_id: e.place_id, name: e.name, address: e.address })));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/places/search?query=${encodeURIComponent(q)}&lat=43.65&lng=-79.41`
      );
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <TopBar title="Add info" />
      <div className="px-4 pt-4 pb-nav overflow-y-auto">
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Search for a place to report baby-friendly features.
        </p>

        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search cafés, restaurants…"
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>

        {/* Results */}
        {loading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white rounded-xl border border-[var(--border)] animate-pulse" />
            ))}
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-2">
            {results.map((r) => (
              <button
                key={r.place_id}
                onClick={() => router.push(`/contribute/${r.place_id}`)}
                className="w-full text-left p-3 bg-white rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
              >
                <p className="font-medium text-sm text-[var(--foreground)]">{r.name}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{r.address}</p>
              </button>
            ))}
          </div>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-[var(--muted-foreground)]">
              No results found. Try a different search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
