"use client";

import { useState } from "react";
import type { FeatureType } from "@/types";

export type ContributionStep = 1 | 2 | 3 | "success";
export type FeatureAnswer = "yes" | "no" | "unsure";

export type ContributionStatus =
  | "idle"
  | "filling"
  | "submitting"
  | "complete"
  | "error";

export interface ContributionState {
  step: ContributionStep;
  status: ContributionStatus;
  answers: Partial<Record<FeatureType, FeatureAnswer>>;
  comment: string;
  photoFile: File | null;
  newBadge: string | null;
  errorMessage: string | null;
}

const ALL_FEATURES: FeatureType[] = [
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

export function useContribution(placeId: string) {
  const [state, setState] = useState<ContributionState>({
    step: 1,
    status: "filling",
    answers: {},
    comment: "",
    photoFile: null,
    newBadge: null,
    errorMessage: null,
  });

  function setAnswer(featureType: FeatureType, value: FeatureAnswer) {
    setState((s) => ({
      ...s,
      answers: { ...s.answers, [featureType]: value },
    }));
  }

  function clearAnswer(featureType: FeatureType) {
    setState((s) => {
      const next = { ...s.answers };
      delete next[featureType];
      return { ...s, answers: next };
    });
  }

  function setComment(comment: string) {
    setState((s) => ({ ...s, comment }));
  }

  function setPhotoFile(file: File | null) {
    setState((s) => ({ ...s, photoFile: file }));
  }

  /** All 9 features must have an answer to advance from step 1 */
  function allFeaturesAnswered(): boolean {
    return ALL_FEATURES.every((f) => state.answers[f] !== undefined);
  }

  function goToStep(step: ContributionStep) {
    setState((s) => ({ ...s, step }));
  }

  function goBack() {
    setState((s) => {
      if (s.step === 2) return { ...s, step: 1 };
      if (s.step === 3) return { ...s, step: 2 };
      return s;
    });
  }

  async function submit() {
    // Only submit "yes" and "no" answers — "unsure" is UI-only context
    const answeredFeatures = (
      Object.entries(state.answers) as [FeatureType, FeatureAnswer][]
    ).filter(([, v]) => v === "yes" || v === "no") as [
      FeatureType,
      "yes" | "no"
    ][];

    setState((s) => ({ ...s, status: "submitting", errorMessage: null }));

    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          place_id: placeId,
          contributions: answeredFeatures.map(([featureType, value]) => ({
            feature_type: featureType,
            value,
            comment: state.comment || undefined,
          })),
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
    setState({
      step: 1,
      status: "filling",
      answers: {},
      comment: "",
      photoFile: null,
      newBadge: null,
      errorMessage: null,
    });
  }

  return {
    state,
    allFeaturesAnswered,
    setAnswer,
    clearAnswer,
    setComment,
    setPhotoFile,
    goToStep,
    goBack,
    submit,
    reset,
  };
}
