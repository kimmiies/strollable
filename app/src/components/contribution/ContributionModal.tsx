"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { X, Star, Camera, Check, AlertCircle } from "lucide-react";
import type { Establishment, FeatureType } from "@/types";
import { FEATURE_LABELS } from "@/types";
import {
  FEATURE_ICONS,
  STEP_2_FEATURES,
  STEP_3_FEATURES,
  STEP_4_FEATURES,
} from "@/lib/contribution/features";
import {
  useContribution,
  type ContributionStep,
  type FeatureAnswer,
} from "@/hooks/useContribution";
import { cn, getNeighbourhoodFromAddress } from "@/lib/utils";

interface ContributionModalProps {
  establishment: Establishment;
  open: boolean;
  onClose: () => void;
}

const STAR_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

export default function ContributionModal({
  establishment,
  open,
  onClose,
}: ContributionModalProps) {
  const {
    state,
    canAdvance,
    setRating,
    setAnswer,
    setComment,
    setPhotoFile,
    goToStep,
    goBack,
    submit,
    reset,
  } = useContribution(establishment.place_id);

  const [showValidation, setShowValidation] = useState(false);

  // Reset state on open transition (fresh flow each time the modal opens)
  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      reset();
      setShowValidation(false);
    }
    prevOpenRef.current = open;
  }, [open, reset]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const step = state.step;
  const isSuccess = step === "success";
  const isSubmitting = state.status === "submitting";

  function handleNext() {
    if (typeof step !== "number") return;
    if (!canAdvance(step)) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    if (step === 6) {
      submit();
      return;
    }
    goToStep((step + 1) as ContributionStep);
  }

  function handleBack() {
    setShowValidation(false);
    goBack();
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{
        background: "rgba(26,31,27,0.5)",
        animation: "contribFade var(--dur-slow) var(--ease-out)",
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col overflow-hidden"
        style={{
          width: "min(480px, calc(100vw - 32px))",
          maxHeight: "88vh",
          background: "var(--warm-white)",
          borderRadius: "var(--r-xl)",
          boxShadow: "var(--shadow-float)",
          animation: "contribIn var(--dur-slow) var(--ease-spring)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-[14px] right-[14px] z-[2] w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "var(--mist)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,31,27,0.12)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--mist)")}
        >
          <X className="w-[14px] h-[14px]" style={{ color: "var(--ink-soft)" }} />
        </button>

        {/* Body */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="px-6 pt-10 pb-5">
            {step === 1 && (
              <StepRating
                establishmentName={establishment.name}
                rating={state.rating}
                setRating={setRating}
              />
            )}

            {step === 2 && (
              <StepFeatures
                title="Getting in"
                sub="Can a stroller get through the door?"
                features={STEP_2_FEATURES}
                answers={state.answers}
                setAnswer={setAnswer}
                showValidation={showValidation && !canAdvance(2)}
              />
            )}

            {step === 3 && (
              <StepFeatures
                title="Bathroom"
                sub="What's the washroom situation?"
                features={STEP_3_FEATURES}
                answers={state.answers}
                setAnswer={setAnswer}
                showValidation={showValidation && !canAdvance(3)}
              />
            )}

            {step === 4 && (
              <StepFeatures
                title="Seating & space"
                sub="Can your little one sit and your stroller fit?"
                features={STEP_4_FEATURES}
                answers={state.answers}
                setAnswer={setAnswer}
                showValidation={showValidation && !canAdvance(4)}
              />
            )}

            {step === 5 && (
              <StepNotes comment={state.comment} setComment={setComment} />
            )}

            {step === 6 && (
              <StepPhoto
                photoFile={state.photoFile}
                setPhotoFile={setPhotoFile}
              />
            )}

            {isSuccess && (
              <StepSuccess
                establishment={establishment}
                newBadge={state.newBadge}
                onClose={onClose}
              />
            )}

            {state.status === "error" && state.errorMessage && (
              <div
                className="mt-4 px-4 py-3 rounded-[var(--r-md)] flex items-center gap-2 text-[13px]"
                style={{
                  background: "var(--terra-light)",
                  color: "var(--terracotta)",
                }}
              >
                <AlertCircle className="w-[14px] h-[14px] flex-shrink-0" />
                {state.errorMessage}
              </div>
            )}
          </div>
        </div>

        {/* Segmented progress bar */}
        {!isSuccess && (
          <div className="flex gap-1 px-6 flex-shrink-0">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="flex-1 h-[3px] rounded-[2px] transition-colors"
                style={{
                  background:
                    typeof step === "number" && step >= n
                      ? "var(--ink)"
                      : "rgba(26,31,27,0.08)",
                }}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {!isSuccess && (
          <div className="px-6 pt-4 pb-6 flex gap-2.5 items-center justify-end flex-shrink-0">
            {typeof step === "number" && step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-[14px] rounded-[var(--r-pill)] text-[14px] font-normal transition-colors"
                style={{
                  background: "var(--mist)",
                  color: "var(--ink-soft)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(26,31,27,0.08)";
                  e.currentTarget.style.color = "var(--ink)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--mist)";
                  e.currentTarget.style.color = "var(--ink-soft)";
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className={cn(
                "px-7 py-[14px] rounded-[var(--r-pill)] text-[14px] font-medium text-white transition-all active:scale-[0.97]",
                isSubmitting && "opacity-[0.35] pointer-events-none"
              )}
              style={{
                background: step === 6 ? "var(--sage)" : "var(--ink)",
              }}
            >
              {step === 6 ? (isSubmitting ? "Submitting…" : "Submit") : "Next"}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes contribFade {
          from {
            background: rgba(26, 31, 27, 0);
          }
          to {
            background: rgba(26, 31, 27, 0.5);
          }
        }
        @keyframes contribIn {
          from {
            transform: scale(0.95) translateY(12px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  STEP 1 — RATING                                                */
/* ─────────────────────────────────────────────────────────────── */

function StepRating({
  establishmentName,
  rating,
  setRating,
}: {
  establishmentName: string;
  rating: number | null;
  setRating: (n: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? rating ?? 0;

  return (
    <div>
      <SheetQuestion>How baby-friendly is this place?</SheetQuestion>
      <SheetSub>
        Help other parents know what to expect at {establishmentName}.
      </SheetSub>

      <div className="flex gap-1.5 justify-center mb-4" onMouseLeave={() => setHover(null)}>
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= display;
          return (
            <button
              key={n}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              className="p-1 transition-transform active:scale-[0.88]"
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
            >
              <Star
                className="w-9 h-9 transition-colors"
                style={{
                  fill: filled ? "var(--amber)" : "transparent",
                  color: filled ? "var(--amber)" : "var(--ink-faint)",
                  strokeWidth: 1.2,
                }}
              />
            </button>
          );
        })}
      </div>
      <div
        className="text-center text-[13px] min-h-[20px] transition-colors"
        style={{ color: display > 0 ? "var(--ink)" : "var(--ink-faint)" }}
      >
        {STAR_LABELS[display] ?? ""}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  STEPS 2–4 — FEATURE GROUPS                                     */
/* ─────────────────────────────────────────────────────────────── */

function StepFeatures({
  title,
  sub,
  features,
  answers,
  setAnswer,
  showValidation,
}: {
  title: string;
  sub: string;
  features: FeatureType[];
  answers: Partial<Record<FeatureType, FeatureAnswer>>;
  setAnswer: (f: FeatureType, v: FeatureAnswer) => void;
  showValidation: boolean;
}) {
  return (
    <div>
      <SheetQuestion>{title}</SheetQuestion>
      <SheetSub>{sub}</SheetSub>

      <div className="flex flex-col">
        {features.map((f) => (
          <FeatureQuestionRow
            key={f}
            featureType={f}
            value={answers[f]}
            onChange={(v) => setAnswer(f, v)}
            missing={showValidation && answers[f] === undefined}
          />
        ))}
      </div>

      {showValidation && (
        <div
          className="mt-2 px-3.5 py-2.5 rounded-[var(--r-md)] flex items-center gap-2 text-[13px]"
          style={{ background: "var(--terra-light)", color: "var(--terracotta)" }}
        >
          <AlertCircle className="w-[14px] h-[14px] flex-shrink-0" />
          Please answer all features to continue.
        </div>
      )}
    </div>
  );
}

function FeatureQuestionRow({
  featureType,
  value,
  onChange,
  missing,
}: {
  featureType: FeatureType;
  value: FeatureAnswer | undefined;
  onChange: (v: FeatureAnswer) => void;
  missing: boolean;
}) {
  const Icon = FEATURE_ICONS[featureType];

  return (
    <div className="mb-3">
      <div
        className="flex items-center gap-2 mb-2 text-[14px] font-normal transition-colors"
        style={{ color: missing ? "var(--terracotta)" : "var(--ink)" }}
      >
        <div
          className="w-7 h-7 rounded-[var(--r-sm)] flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--mist)" }}
        >
          <Icon className="w-[13px] h-[13px]" style={{ color: "var(--sage-deep)" }} />
        </div>
        {FEATURE_LABELS[featureType]}
      </div>
      <div className="flex gap-1.5">
        {(["yes", "no", "unsure"] as const).map((v) => {
          const selected = value === v;
          return (
            <button
              key={v}
              onClick={() => onChange(v)}
              className={cn(
                "flex-1 px-2 py-3 rounded-[var(--r-md)] text-[13px] font-normal transition-all min-h-[44px]",
                "border-[1.5px]"
              )}
              style={{
                borderColor: selected
                  ? v === "yes"
                    ? "var(--sage)"
                    : v === "no"
                      ? "var(--terracotta)"
                      : "rgba(26,31,27,0.25)"
                  : missing
                    ? "rgba(201,113,74,0.35)"
                    : "rgba(26,31,27,0.1)",
                background: selected
                  ? v === "yes"
                    ? "var(--mist)"
                    : v === "no"
                      ? "var(--terra-light)"
                      : "var(--mist)"
                  : "var(--warm-white)",
                color: selected
                  ? v === "yes"
                    ? "var(--sage-deep)"
                    : v === "no"
                      ? "var(--terracotta)"
                      : "var(--ink-soft)"
                  : v === "unsure"
                    ? "var(--ink-faint)"
                    : "var(--ink-soft)",
                fontWeight: selected ? 500 : 400,
              }}
            >
              {v === "yes" ? "Yes" : v === "no" ? "No" : "Not sure"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  STEP 5 — NOTES                                                 */
/* ─────────────────────────────────────────────────────────────── */

function StepNotes({
  comment,
  setComment,
}: {
  comment: string;
  setComment: (c: string) => void;
}) {
  return (
    <div>
      <SheetQuestion>Anything else to share?</SheetQuestion>
      <SheetSub>A short note goes a long way for other parents.</SheetSub>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, 280))}
        maxLength={280}
        placeholder="e.g. Ramp at side entrance, staff moved chairs to help, plenty of room for a Bugaboo…"
        className="w-full p-3.5 text-[14px] font-light resize-none focus:outline-none"
        style={{
          background: "var(--cream)",
          border: "1.5px solid rgba(26,31,27,0.12)",
          borderRadius: "var(--r-md)",
          color: "var(--ink)",
          minHeight: 120,
        }}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-[11px]" style={{ color: "var(--ink-faint)" }}>
          Optional · max 280 characters
        </span>
        <span className="text-[11px]" style={{ color: "var(--ink-faint)" }}>
          {comment.length} / 280
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  STEP 6 — PHOTO                                                 */
/* ─────────────────────────────────────────────────────────────── */

function StepPhoto({
  photoFile,
  setPhotoFile,
}: {
  photoFile: File | null;
  setPhotoFile: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!photoFile) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  return (
    <div>
      <SheetQuestion>Add a photo</SheetQuestion>
      <SheetSub>
        A photo of the entrance, bathroom, or change table helps parents know what to expect.
      </SheetSub>

      <button
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 py-4 text-[14px] font-medium transition-colors"
        style={{
          background: "var(--mist)",
          color: "var(--sage-deep)",
          border: "1.5px dashed rgba(122,158,126,0.4)",
          borderRadius: "var(--r-md)",
        }}
      >
        <Camera className="w-5 h-5" strokeWidth={1.5} />
        <span>{photoFile ? "Choose different photo" : "Choose a photo"}</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          setPhotoFile(f);
        }}
      />

      {preview && (
        <div
          className="relative mt-3 overflow-hidden"
          style={{ borderRadius: "var(--r-md)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-full block"
            style={{ maxHeight: 200, objectFit: "cover" }}
          />
          <button
            onClick={() => setPhotoFile(null)}
            aria-label="Remove photo"
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "rgba(26,31,27,0.6)" }}
          >
            <X className="w-3 h-3 text-white" strokeWidth={2} />
          </button>
        </div>
      )}

      <p
        className="text-center text-[12px] leading-[1.5] mt-4"
        style={{ color: "var(--ink-faint)" }}
      >
        Optional — photos of entrances, bathrooms, and change tables are most useful.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  STEP 7 — SUCCESS                                               */
/* ─────────────────────────────────────────────────────────────── */

function StepSuccess({
  establishment,
  newBadge,
  onClose,
}: {
  establishment: Establishment;
  newBadge: string | null;
  onClose: () => void;
}) {
  const neighbourhood = getNeighbourhoodFromAddress(establishment.address);

  return (
    <div className="flex flex-col items-center text-center py-4">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{ background: "var(--sage)" }}
      >
        <Check className="w-6 h-6 text-white" strokeWidth={2} />
      </div>
      <div
        className="font-display text-[24px] font-normal mb-2"
        style={{ color: "var(--ink)", letterSpacing: "-0.02em" }}
      >
        Nice one.
      </div>
      <div
        className="text-[14px] leading-[1.5] mb-5"
        style={{ color: "var(--ink-faint)" }}
      >
        That helps parents{neighbourhood ? ` in ${neighbourhood}` : ""} plan their outings. The community really appreciates it.
      </div>

      <div
        className="w-full flex items-center gap-3 px-4 py-3 mb-5"
        style={{
          background: "var(--mist)",
          borderRadius: "var(--r-md)",
        }}
      >
        <div style={{ fontSize: 24 }}>🏆</div>
        <div className="text-left">
          <div className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>
            {newBadge ? `You earned: ${newBadge}` : "7 / 10 to Pathfinder"}
          </div>
          <div className="text-[11px]" style={{ color: "var(--ink-faint)" }}>
            {newBadge ? "A new badge just for you" : "3 more contributions to earn it"}
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-3 mb-2.5 rounded-[var(--r-pill)] text-[14px] font-medium text-white transition-colors"
        style={{ background: "var(--sage)" }}
      >
        Back to {establishment.name}
      </button>
      <Link
        href="/profile"
        onClick={onClose}
        className="w-full py-3 rounded-[var(--r-pill)] text-[14px] text-center transition-colors"
        style={{
          color: "var(--ink-soft)",
          border: "1.5px solid rgba(26,31,27,0.1)",
        }}
      >
        View my profile
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  SHARED TYPOGRAPHY                                              */
/* ─────────────────────────────────────────────────────────────── */

function SheetQuestion({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-display text-[24px] lg:text-[26px] leading-[1.2] mb-1.5"
      style={{
        color: "var(--ink)",
        fontWeight: 400,
        letterSpacing: "-0.02em",
      }}
    >
      {children}
    </div>
  );
}

function SheetSub({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[14px] leading-[1.5] mb-6"
      style={{ color: "var(--ink-faint)" }}
    >
      {children}
    </div>
  );
}
