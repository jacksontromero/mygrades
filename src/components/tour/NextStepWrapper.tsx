"use client";

import { NextStep } from "nextstepjs";
import ShadcnDarkModeCard from "./ShadcnTourCard";
import { tours } from "@/lib/tours";
import { useState } from "react";
export default function NextStepWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opacity, setOpacity] = useState("0.0");

  return (
    <NextStep
      steps={tours}
      shadowOpacity={opacity}
      cardComponent={ShadcnDarkModeCard}
      clickThroughOverlay={true}
      onStart={(tourName) => {
        if (tourName === "welcome-tour") {
          setOpacity("0.0");
        } else {
          setOpacity("0.2");
        }

        if (tourName === "create-class-tour") {
          // set focus to course name input
          const courseNameInput = document.querySelector(
            "#class-info-container input[name='courseName']",
          );
          if (courseNameInput) {
            (courseNameInput as HTMLElement).focus();
          }
        }
      }}
      onStepChange={(step, tourName) => {
        if (tourName === "create-class-tour") {
          if (step === 1) {
            // set focus to weight name input
            const weightNameInput = document.querySelector(
              "#weights-container input[name='buckets.0.name']",
            );
            if (weightNameInput) {
              (weightNameInput as HTMLElement).focus();
            }
          }
        }
      }}
    >
      {children}
    </NextStep>
  );
}
