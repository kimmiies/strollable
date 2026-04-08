"use client";

import { useRef } from "react";
import { Camera, X, Footprints, LockOpen, Baby, Armchair, DoorOpen, Navigation, Sofa, User, Users, type LucideIcon } from "lucide-react";
import type { Establishment, FeatureType } from "@/types";
import { FEATURE_LABELS } from "@/types";
import { useContribution } from "@/hooks/useContribution";
import { cn } from "@/lib/utils";
import ContributionComplete from "./ContributionComplete";

// All 9 features — flat list, no hierarchy
const FEATURE_TYPES: FeatureType[] = [
  "step_free_entrance",
  "accessible_bathroom",
  "change_table",
  "high_chairs",
  "auto_door_opener",
  "stroller_friendly_layout",
  "booster_seats",
  "change_table_mens",
  "change_table_family",
];

const FEATURE_ICON_MAP: Record<FeatureType, LucideIcon> = {
  step_free_entrance:       Footprints,
  accessible_bathroom:      LockOpen,
  change_table:             Baby,
  high_chairs:              Armchair,
  auto_door_opener:         DoorOpen,
  stroller_friendly_layout: Navigation,
  booster_seats:            Sofa,
  change_table_mens:        User,
  change_table_family:      Users,
};

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
    <div className="flex flex-col gap-5 px-4 py-6 pb-nav">
      <div>
        <h2 className="font-display font-normal text-xl tracking-[-0.02em] text-[var(--ink)]">
          What did you notice?
        </h2>
        <p className="text-sm text-[var(--ink-faint)] mt-1">
          Answer any features you know about. All are optional.
        </p>
      </div>

      {/* Feature questions — all 9, flat list */}
      <div className="space-y-3">
        {FEATURE_TYPES.map((type) => {
          const currentAnswer = state.answers[type];
          const Icon = FEATURE_ICON_MAP[type];
          return (
            <div
              key={type}
              className="bg-[var(--warm-white)] rounded-[var(--r-md)] border border-[var(--border)] p-4"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-[var(--r-sm)] bg-[var(--mist)] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[var(--ink-soft)]" />
                </div>
                <p className="text-sm font-medium text-[var(--ink)]">
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
                    "flex-1 py-2.5 rounded-[var(--r-md)] text-sm font-medium transition-all",
                    "border focus:outline-none min-h-[44px]",
                    currentAnswer === "yes"
                      ? "bg-[var(--mist)] text-[var(--sage-deep)] border-[var(--sage)]"
                      : "bg-[var(--warm-white)] text-[var(--ink-soft)] border-[var(--border)] hover:border-[var(--sage-light)]"
                  )}
                >
                  Yes
                </button>
                <button
                  onClick={() =>
                    currentAnswer === "no"
                      ? clearAnswer(type)
                      : setAnswer(type, "no")
                  }
                  className={cn(
                    "flex-1 py-2.5 rounded-[var(--r-md)] text-sm font-medium transition-all",
                    "border focus:outline-none min-h-[44px]",
                    currentAnswer === "no"
                      ? "bg-[var(--terra-light)] text-[var(--terracotta)] border-[var(--terracotta)]"
                      : "bg-[var(--warm-white)] text-[var(--ink-soft)] border-[var(--border)] hover:border-[rgba(201,113,74,0.3)]"
                  )}
                >
                  No
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional comment */}
      <div className="bg-[var(--warm-white)] rounded-[var(--r-md)] border border-[var(--border)] p-4">
        <label className="block text-sm font-medium text-[var(--ink)] mb-2">
          Add a note{" "}
          <span className="text-[var(--ink-faint)] font-normal">(optional · max 280 characters)</span>
        </label>
        <textarea
          value={state.comment}
          onChange={(e) => setComment(e.target.value.slice(0, 280))}
          placeholder="e.g. Back entrance is flat, easier than the front door"
          rows={3}
          maxLength={280}
          className={cn(
            "w-full text-sm rounded-[var(--r-md)] border border-[var(--border)] px-3 py-2.5",
            "focus:outline-none focus:ring-2 focus:ring-[var(--sage)] focus:border-transparent",
            "resize-none text-[var(--ink)] placeholder:text-[var(--ink-faint)]",
            "bg-[var(--cream)]"
          )}
        />
        <p className="text-right text-[11px] text-[var(--ink-faint)] mt-1.5">
          {state.comment.length} / 280
        </p>
      </div>

      {/* Optional photo */}
      <div className="bg-[var(--warm-white)] rounded-[var(--r-md)] border border-[var(--border)] p-4">
        <p className="text-sm font-medium text-[var(--ink)] mb-3">
          Photo{" "}
          <span className="text-[var(--ink-faint)] font-normal">(optional)</span>
        </p>
        {state.photoFile ? (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--r-md)] bg-[var(--mist)]">
            <Camera className="w-4 h-4 text-[var(--sage-deep)] flex-shrink-0" />
            <span className="text-sm text-[var(--ink)] truncate flex-1">
              {state.photoFile.name}
            </span>
            <button
              onClick={() => setPhotoFile(null)}
              className="p-1 rounded-full hover:bg-[var(--border)] min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="Remove photo"
            >
              <X className="w-4 h-4 text-[var(--ink-faint)]" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "w-full flex items-center justify-center gap-2 text-sm text-[var(--sage-deep)] font-medium",
              "py-3 px-4 rounded-[var(--r-md)] border border-dashed border-[rgba(122,158,126,0.4)]",
              "hover:bg-[var(--mist)] transition-colors"
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
        <div className="p-3 rounded-[var(--r-md)] bg-[var(--terra-light)] text-[var(--terracotta)] text-sm">
          {state.errorMessage}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={submit}
        disabled={!hasAnyAnswer || state.status === "submitting"}
        className={cn(
          "w-full py-4 rounded-[var(--r-lg)] font-medium text-sm text-white",
          "bg-[var(--sage)] hover:bg-[var(--sage-deep)] transition-colors",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        {state.status === "submitting" ? "Submitting…" : "Submit"}
      </button>

      {!hasAnyAnswer && (
        <p className="text-xs text-center text-[var(--ink-faint)] -mt-2">
          Select Yes or No for at least one feature to submit.
        </p>
      )}
    </div>
  );
}
