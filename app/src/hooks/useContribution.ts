"use client";

import { useState } from "react";
import type { FeatureType, FeatureAnswer } from "@/types";

export type ContributionStep = 1 | 2 | 3 | 4 | 5 | 6 | "success";
export type { FeatureAnswer };

export type ContributionStatus =
  | "idle"
  | "filling"
  | "submitting"
  | "complete"
  | "error";

export interface ContributionState {
  step: ContributionStep;
  status: ContributionStatus;
  rating: number | null;
  answers: Partial<Record<FeatureType, FeatureAnswer>>;
  comment: string;
  photoFile: File | null;
  newBadge: string | null;
  errorMessage: string | null;
}

const STEP_FEATURES: Record<2 | 3 | 4, FeatureType[]> = {
  2: ["step_free_entrance", "auto_door_opener"],
  3: [
    "accessible_bathroom",
    "change_table",
    "change_table_mens",
    "change_table_family",
  ],
  4: ["high_chairs", "booster_seats", "stroller_friendly_layout"],
};

const INITIAL_STATE: ContributionState = {
  step: 1,
  status: "filling",
  rating: null,
  answers: {},
  comment: "",
  photoFile: null,
  newBadge: null,
  errorMessage: null,
};

export function useContribution(placeId: string) {
  const [state, setState] = useState<ContributionState>(INITIAL_STATE);

  function setRating(rating: number) {
    setState((s) => ({ ...s, rating }));
  }

  function setAnswer(featureType: FeatureType, value: FeatureAnswer) {
    setState((s) => ({
      ...s,
      answers: { ...s.answers, [featureType]: value },
    }));
  }

  function setComment(comment: string) {
    setState((s) => ({ ...s, comment }));
  }

  function setPhotoFile(file: File | null) {
    setState((s) => ({ ...s, photoFile: file }));
  }

  /** Per-step gate: steps 2/3/4 require all their features answered. Others are optional. */
  function canAdvance(step: ContributionStep): boolean {
    if (step === 2 || step === 3 || step === 4) {
      return STEP_FEATURES[step].every((f) => state.answers[f] !== undefined);
    }
    return true;
  }

  function goToStep(step: ContributionStep) {
    setState((s) => ({ ...s, step }));
  }

  function goBack() {
    setState((s) => {
      if (typeof s.step === "number" && s.step > 1) {
        return { ...s, step: (s.step - 1) as ContributionStep };
      }
      return s;
    });
  }

  async function submit() {
    if (state.rating === null) {
      setState((s) => ({
        ...s,
        status: "error",
        errorMessage: "Please add a rating before submitting.",
      }));
      return;
    }

    const answers = (
      Object.entries(state.answers) as [FeatureType, FeatureAnswer][]
    ).map(([feature_type, value]) => ({ feature_type, value }));

    setState((s) => ({ ...s, status: "submitting", errorMessage: null }));

    try {
      // TODO: upload photoFile to storage and pass the resulting URL.
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          place_id: placeId,
          rating: state.rating,
          comment: state.comment || undefined,
          answers,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Submission failed");
      }

      const data = await res.json();
      setState((s) => ({
        ...s,
        status: "complete",
        step: "success",
        newBadge: data.newBadge ?? null,
      }));
    } catch (e) {
      setState((s) => ({
        ...s,
        status: "error",
        errorMessage: e instanceof Error ? e.message : "Something went wrong",
      }));
    }
  }

  function reset() {
    setState(INITIAL_STATE);
  }

  return {
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
  };
}
