"use client";

import { useRef } from "react";
import { Camera, X } from "lucide-react";
import type { Establishment, FeatureType } from "@/types";
import { FEATURE_LABELS, FEATURE_ICONS } from "@/types";
import { useContribution } from "@/hooks/useContribution";
import { cn } from "@/lib/utils";
import ContributionComplete from "./ContributionComplete";

const FEATURE_TYPES: FeatureType[] = [
  "step_free_entrance",
  "accessible_bathroom",
  "change_table",
];

interface ContributionFormProps {
  establishment: Establishment;
}

export default function ContributionForm({
  establishment,
}: ContributionFormProps) {
  const {
    state,
    setAnswer,
    clearAnswer,
    setComment,
    setPhotoFile,
    submit,
    reset,
  } = useContribution(establishment.place_id);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasAnyAnswer = Object.keys(state.answers).length > 0;

  if (state.status === "complete") {
    return (
      <ContributionComplete
        newBadge={state.newBadge}
        establishmentName={establishment.name}
        onDone={() => window.history.back()}
        onContributeMore={reset}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 pb-nav">
      <div>
        <h2 className="font-semibold text-base text-[var(--foreground)]">
          What did you notice?
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          Answer as many as you know. Your info helps other parents.
        </p>
      </div>

      {/* Feature questions */}
      <div className="space-y-4">
        {FEATURE_TYPES.map((type) => {
          const currentAnswer = state.answers[type];
          return (
            <div
              key={type}
              className="bg-white rounded-2xl border border-[var(--border)] p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{FEATURE_ICONS[type]}</span>
                <p className="font-medium text-sm text-[var(--foreground)]">
                  {FEATURE_LABELS[type]}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    currentAnswer === "yes"
                      ? clearAnswer(type)
                      : setAnswer(type, "yes")
                  }
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                    "border focus:outline-none min-h-[44px]",
                    currentAnswer === "yes"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-white text-[var(--foreground)] border-[var(--border)] hover:border-green-300"
                  )}
                >
                  ✓ Yes
                </button>
                <button
                  onClick={() =>
                    currentAnswer === "no"
                      ? clearAnswer(type)
                      : setAnswer(type, "no")
                  }
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                    "border focus:outline-none min-h-[44px]",
                    currentAnswer === "no"
                      ? "bg-red-100 text-red-800 border-red-300"
                      : "bg-white text-[var(--foreground)] border-[var(--border)] hover:border-red-300"
                  )}
                >
                  ✗ No
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional comment */}
      <div className="bg-white rounded-2xl border border-[var(--border)] p-4">
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Comment <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
        </label>
        <textarea
          value={state.comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="e.g. Change table is in the back, past the counter"
          rows={2}
          className={cn(
            "w-full text-sm rounded-xl border border-[var(--border)] px-3 py-2.5",
            "focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent",
            "resize-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
          )}
        />
      </div>

      {/* Optional photo */}
      <div className="bg-white rounded-2xl border border-[var(--border)] p-4">
        <p className="text-sm font-medium text-[var(--foreground)] mb-2">
          Photo <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
        </p>
        {state.photoFile ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--foreground)] truncate flex-1">
              {state.photoFile.name}
            </span>
            <button
              onClick={() => setPhotoFile(null)}
              className="p-1 rounded-full hover:bg-[var(--muted)] min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="Remove photo"
            >
              <X className="w-4 h-4 text-[var(--muted-foreground)]" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex items-center gap-2 text-sm text-[var(--primary)] font-medium",
              "py-2 px-3 rounded-xl border border-dashed border-[var(--primary)]/40",
              "hover:bg-[var(--primary)]/5 transition-colors"
            )}
          >
            <Camera className="w-4 h-4" />
            Add a photo
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {/* Error */}
      {state.status === "error" && state.errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">
          {state.errorMessage}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={submit}
        disabled={!hasAnyAnswer || state.status === "submitting"}
        className={cn(
          "w-full py-4 rounded-2xl font-semibold text-sm text-white",
          "bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        {state.status === "submitting" ? "Submitting…" : "Submit"}
      </button>

      {!hasAnyAnswer && (
        <p className="text-xs text-center text-[var(--muted-foreground)] -mt-3">
          Select Yes or No for at least one feature above.
        </p>
      )}
    </div>
  );
}
