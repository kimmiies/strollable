"use client";

import { useRef, useState } from "react";
import {
  Camera, X, AlertCircle,
  Footprints, LockOpen, Baby, Armchair,
  DoorOpen, Navigation, Sofa, User, Users,
  type LucideIcon,
} from "lucide-react";
import type { Establishment, FeatureType } from "@/types";
import { FEATURE_LABELS } from "@/types";
import { useContribution, type FeatureAnswer } from "@/hooks/useContribution";
import { cn } from "@/lib/utils";
import ContributionComplete from "./ContributionComplete";

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

const STEP_NAMES = ["Features", "Written review", "Photo"];

interface ContributionFormProps {
  establishment: Establishment;
}

export default function ContributionForm({ establishment }: ContributionFormProps) {
  const {
    state,
    allFeaturesAnswered,
    setAnswer,
    setComment,
    setPhotoFile,
    goToStep,
    goBack,
    submit,
    reset,
  } = useContribution(establishment.place_id);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showValidation, setShowValidation] = useState(false);

  // ── Success screen ──
  if (state.step === "success") {
    return (
      <ContributionComplete
        establishmentName={establishment.name}
        placeId={establishment.place_id}
        newBadge={state.newBadge}
        onContributeMore={reset}
      />
    );
  }

  const currentStep = state.step as 1 | 2 | 3;
  const progressPct = currentStep === 1 ? 33 : currentStep === 2 ? 66 : 88;

  function handleContinue() {
    if (currentStep === 1) {
      if (!allFeaturesAnswered()) {
        setShowValidation(true);
        // Scroll to first unanswered
        const firstMissing = FEATURE_TYPES.find((f) => state.answers[f] === undefined);
        if (firstMissing) {
          document.getElementById(`fq-${firstMissing}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
      setShowValidation(false);
      goToStep(2);
    } else if (currentStep === 2) {
      goToStep(3);
    } else {
      submit();
    }
  }

  function handleBack() {
    if (currentStep === 1) {
      window.history.back();
    } else {
      goBack();
    }
  }

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Progress header ── */}
      <div className="px-5 pt-5 pb-0 flex-shrink-0">
        {/* Bar */}
        <div
          className="h-[3px] rounded-full mb-2.5 overflow-hidden"
          style={{ background: "var(--mist)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, background: "var(--sage)" }}
          />
        </div>
        {/* Step labels */}
        <div className="flex justify-between">
          {STEP_NAMES.map((name, i) => {
            const stepNum = i + 1;
            const isActive = stepNum === currentStep;
            return (
              <div key={name} className="flex flex-col items-center gap-0.5 flex-1">
                <span
                  className="text-[10px] uppercase tracking-[0.1em] font-medium"
                  style={{ color: isActive ? "var(--sage)" : "var(--ink-faint)" }}
                >
                  Step {stepNum}
                </span>
                <span
                  className="text-[11px] text-center leading-tight"
                  style={{ color: isActive ? "var(--ink-soft)" : "var(--ink-faint)" }}
                >
                  {name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">

        {/* ── STEP 1: Strollability features — mandatory ── */}
        {currentStep === 1 && (
          <div>
            <h2
              className="font-display font-normal tracking-[-0.02em] mt-5 mb-1"
              style={{ fontSize: 22, color: "var(--ink)" }}
            >
              Strollability features
            </h2>
            <p className="text-sm mb-5" style={{ color: "var(--ink-faint)" }}>
              {establishment.name} · All nine are required to continue.
            </p>

            <div className="space-y-2.5">
              {FEATURE_TYPES.map((type) => {
                const answer = state.answers[type];
                const Icon = FEATURE_ICON_MAP[type];
                const isUnanswered = showValidation && answer === undefined;

                return (
                  <div
                    key={type}
                    id={`fq-${type}`}
                    className="rounded-[var(--r-md)] p-3.5"
                    style={{
                      background: "var(--warm-white)",
                      border: `1.5px solid ${isUnanswered ? "rgba(201,113,74,0.4)" : "rgba(122,158,126,0.1)"}`,
                    }}
                  >
                    {/* Label */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <div
                        className="w-7 h-7 rounded-[var(--r-sm)] flex items-center justify-center flex-shrink-0"
                        style={{ background: isUnanswered ? "var(--terra-light)" : "var(--mist)" }}
                      >
                        <Icon
                          className="w-3.5 h-3.5"
                          style={{ color: isUnanswered ? "var(--terracotta)" : "var(--sage-deep)" }}
                        />
                      </div>
                      <span
                        className="text-[11px] uppercase tracking-[0.09em] font-medium"
                        style={{ color: isUnanswered ? "var(--terracotta)" : "var(--sage)" }}
                      >
                        {FEATURE_LABELS[type]}
                      </span>
                    </div>

                    {/* Yes / No / Not sure */}
                    <div className="flex gap-1.5">
                      {(["yes", "no", "unsure"] as FeatureAnswer[]).map((val) => {
                        const isSelected = answer === val;
                        let selectedBg = "transparent";
                        let selectedBorder = "rgba(26,31,27,0.1)";
                        let selectedColor = "var(--ink-soft)";
                        if (isSelected) {
                          if (val === "yes") { selectedBg = "var(--mist)"; selectedBorder = "var(--sage)"; selectedColor = "var(--sage-deep)"; }
                          else if (val === "no") { selectedBg = "var(--terra-light)"; selectedBorder = "rgba(201,113,74,0.5)"; selectedColor = "var(--terracotta)"; }
                          else { selectedBg = "var(--cream)"; selectedBorder = "rgba(26,31,27,0.2)"; selectedColor = "var(--ink-soft)"; }
                        }
                        return (
                          <button
                            key={val}
                            onClick={() => {
                              setAnswer(type, val);
                              setShowValidation(false);
                            }}
                            className="flex-1 py-2.5 rounded-[var(--r-md)] text-sm font-medium transition-all min-h-[44px]"
                            style={{
                              background: isSelected ? selectedBg : "var(--warm-white)",
                              border: `1.5px solid ${isSelected ? selectedBorder : "rgba(26,31,27,0.1)"}`,
                              color: isSelected ? selectedColor : val === "unsure" ? "var(--ink-faint)" : "var(--ink-soft)",
                            }}
                          >
                            {val === "yes" ? "Yes" : val === "no" ? "No" : "Not sure"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Validation message */}
            {showValidation && !allFeaturesAnswered() && (
              <div
                className="mt-3 flex items-center gap-2.5 px-3.5 py-2.5 rounded-[var(--r-md)] text-sm"
                style={{ background: "var(--terra-light)", color: "var(--terracotta)" }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Please answer all nine features to continue.
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Written review — optional ── */}
        {currentStep === 2 && (
          <div>
            <h2
              className="font-display font-normal tracking-[-0.02em] mt-5 mb-1"
              style={{ fontSize: 22, color: "var(--ink)" }}
            >
              Written review
            </h2>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--ink-faint)" }}>
              Optional — but a short note goes a long way for other parents.
            </p>
            <textarea
              value={state.comment}
              onChange={(e) => setComment(e.target.value.slice(0, 280))}
              placeholder="e.g. Ramp at side entrance, staff moved chairs to help, plenty of room for a Bugaboo…"
              rows={4}
              maxLength={280}
              className="w-full text-sm rounded-[var(--r-md)] px-3.5 py-3 resize-none focus:outline-none transition-colors leading-relaxed"
              style={{
                background: "var(--cream)",
                border: "1.5px solid rgba(26,31,27,0.12)",
                color: "var(--ink)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--sage)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(26,31,27,0.12)")}
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-[11px]" style={{ color: "var(--ink-faint)" }}>
                Max 280 characters
              </span>
              <span className="text-[11px]" style={{ color: "var(--ink-faint)" }}>
                {state.comment.length} / 280
              </span>
            </div>
          </div>
        )}

        {/* ── STEP 3: Photo — optional ── */}
        {currentStep === 3 && (
          <div>
            <h2
              className="font-display font-normal tracking-[-0.02em] mt-5 mb-1"
              style={{ fontSize: 22, color: "var(--ink)" }}
            >
              Add a photo
            </h2>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--ink-faint)" }}>
              Optional — a photo of the entrance, bathroom, or change table helps parents know exactly what to expect.
            </p>

            {state.photoFile ? (
              <div>
                <div className="relative rounded-[var(--r-md)] overflow-hidden mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(state.photoFile)}
                    alt="Preview"
                    className="w-full object-cover"
                    style={{ maxHeight: 200 }}
                  />
                  <button
                    onClick={() => setPhotoFile(null)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(26,31,27,0.6)" }}
                    aria-label="Remove photo"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <p className="text-xs text-center" style={{ color: "var(--ink-faint)" }}>
                  {state.photoFile.name}
                </p>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 text-sm font-medium py-3.5 rounded-[var(--r-md)] transition-colors"
                style={{
                  border: "1.5px dashed rgba(122,158,126,0.4)",
                  color: "var(--sage-deep)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--mist)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Camera className="w-4 h-4" />
                Choose a photo
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

            <p className="text-xs text-center mt-4" style={{ color: "var(--ink-faint)" }}>
              Photos of entrances, bathrooms, and change tables are most useful.
            </p>

            {/* Error */}
            {state.status === "error" && state.errorMessage && (
              <div
                className="mt-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-[var(--r-md)] text-sm"
                style={{ background: "var(--terra-light)", color: "var(--terracotta)" }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {state.errorMessage}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Sticky footer ── */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-5 py-3 border-t"
        style={{
          background: "var(--warm-white)",
          borderColor: "rgba(122,158,126,0.1)",
          paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        }}
      >
        {/* Back / Close */}
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-sm transition-colors px-2 py-3 min-h-[44px]"
          style={{ color: "var(--ink-faint)", background: "none", border: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink-soft)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-faint)")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {currentStep === 1
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><path d="M19 12H5M12 19l-7-7 7-7"/></>}
          </svg>
          {currentStep === 1 ? "Close" : "Back"}
        </button>

        {/* Continue / Submit */}
        <button
          onClick={handleContinue}
          disabled={state.status === "submitting"}
          className={cn(
            "flex-1 py-3.5 rounded-[var(--r-pill)] text-sm font-medium text-white transition-colors min-h-[48px]",
            state.status === "submitting" ? "opacity-50 cursor-not-allowed" : ""
          )}
          style={{ background: "var(--ink)" }}
          onMouseEnter={(e) => {
            if (state.status !== "submitting") (e.currentTarget as HTMLButtonElement).style.background = "var(--ink-soft)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--ink)";
          }}
        >
          {state.status === "submitting"
            ? "Submitting…"
            : currentStep === 3 ? "Submit" : "Continue"}
        </button>
      </div>
    </div>
  );
}
