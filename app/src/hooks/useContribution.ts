"use client";

import { useState } from "react";
import type { FeatureType } from "@/types";

export type ContributionStatus =
  | "idle"
  | "filling"
  | "submitting"
  | "complete"
  | "error";

export interface ContributionState {
  status: ContributionStatus;
  answers: Partial<Record<FeatureType, "yes" | "no">>;
  comment: string;
  photoFile: File | null;
  newBadge: string | null;
  errorMessage: string | null;
}

export function useContribution(placeId: string) {
  const [state, setState] = useState<ContributionState>({
    status: "filling",
    answers: {},
    comment: "",
    photoFile: null,
    newBadge: null,
    errorMessage: null,
  });

  function setAnswer(featureType: FeatureType, value: "yes" | "no") {
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

  async function submit() {
    const answeredFeatures = Object.entries(state.answers) as [
      FeatureType,
      "yes" | "no"
    ][];

    if (answeredFeatures.length === 0) return;

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
    setAnswer,
    clearAnswer,
    setComment,
    setPhotoFile,
    submit,
    reset,
  };
}
