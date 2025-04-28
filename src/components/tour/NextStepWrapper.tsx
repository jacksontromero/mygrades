"use client";

import { NextStep, useNextStep } from "nextstepjs";
import ShadcnDarkModeCard from "./ShadcnTourCard";
import { tours } from "@/lib/tours";
import { useState } from "react";
import { useDataStore } from "@/data/store";
import { useIsMobile } from "@/hooks/use-mobile";
export default function NextStepWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opacity, setOpacity] = useState("0.0");

  const tourStatus = useDataStore((state) => state.tourStatus);
  const setTourStatus = useDataStore((state) => state.setTourStatus);

  const { closeNextStep } = useNextStep();

  const isMobile = useIsMobile();

  return (
    <NextStep
      disableConsoleLogs={true}
      steps={tours}
      shadowOpacity={opacity}
      cardComponent={ShadcnDarkModeCard}
      clickThroughOverlay={true}
      onStart={(tourName) => {
        if (isMobile) {
          closeNextStep();
          return;
        }

        // console.log("onStart", tourName);
        if (tourName && tourStatus[tourName]) {
          // console.log("skipping tour, already finished", tourName);
          closeNextStep();
          return;
        }

        if (tourName === "welcome-tour" || tourName === "publish-tour") {
          setOpacity("0.0");
        } else {
          // when moving onto any other tour, we're done with welcome tour
          if (tourName) {
            setTourStatus("welcome-tour", true);
          }
          setOpacity("0.2");
        }

        if (tourName === "create-class-tour") {
          // set focus to course name input
          // const courseNameInput = document.querySelector(
          //   "#class-info-container input[name='courseName']",
          // );
          // if (courseNameInput) {
          //   console.log("focusing on course name input");
          //   (courseNameInput as HTMLElement).focus();
          // }
        }
      }}
      onStepChange={(step, tourName) => {
        // console.log("onStepChange", step, tourName);
        if (tourName === "create-class-tour") {
          if (step === 1) {
            // set focus to weight name input
            const weightNameInput = document.querySelector(
              "#weights-container input[name='buckets.0.name']",
            );
            if (weightNameInput) {
              // console.log("focusing on weight name input");
              (weightNameInput as HTMLElement).focus();
            }
          }
        }
      }}
      onComplete={(tourName) => {
        // console.log("onComplete", tourName);
        if (tourName) {
          setTourStatus(tourName, true);
        }
      }}
    >
      {children}
    </NextStep>
  );
}
