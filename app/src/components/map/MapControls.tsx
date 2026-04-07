"use client";

import { LocateFixed } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapControlsProps {
  onLocate: () => void;
  locating?: boolean;
  className?: string;
}

export default function MapControls({ onLocate, locating, className }: MapControlsProps) {
  return (
    <div className={cn("absolute bottom-4 right-4 flex flex-col gap-2", className)}>
      <button
        onClick={onLocate}
        className={cn(
          "w-11 h-11 rounded-full bg-white flex items-center justify-center",
          "border border-[rgba(122,158,126,0.2)] transition-colors",
          "shadow-[var(--shadow-sm)] hover:bg-[var(--mist)] active:scale-95",
          locating && "opacity-60"
        )}
        aria-label="Find my location"
      >
        <LocateFixed
          className={cn(
            "w-5 h-5",
            locating ? "text-[var(--sage)]" : "text-[var(--ink-soft)]"
          )}
        />
      </button>
    </div>
  );
}
