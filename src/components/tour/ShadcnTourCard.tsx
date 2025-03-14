"use client";

import React from "react";
import { Step } from "nextstepjs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ShadcnDarkModeCardProps {
  step: Step;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  skipTour?: () => void;
  arrow: React.ReactNode;
}

const ShadcnDarkModeCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: ShadcnDarkModeCardProps) => {
  if (!step) {
    return <></>;
  }

  return (
    <Card className="w-[300px]">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center gap-2">
          {step.icon && <span>{step.icon}</span>}
          {step.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="py-3">
        <div className="mb-0">{step.content}</div>
        {arrow}
      </CardContent>

      {step.showControls ? (
        <CardFooter className="flex justify-between py-3">
          <div className="text-sm text-muted-foreground">
            {/* {currentStep + 1} / {totalSteps} */}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" size="sm" onClick={prevStep}>
                Previous
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => {
                // remove focus from wherever it is currently by focusing on this button and blurring it
                (document.activeElement as HTMLElement | null)?.blur();
                nextStep();
              }}
            >
              {currentStep === totalSteps - 1 ? "Finish" : "Next"}
            </Button>

            {step.showSkip && (
              <Button variant="ghost" size="sm" onClick={skipTour}>
                Skip
              </Button>
            )}
          </div>
        </CardFooter>
      ) : (
        <CardFooter className="flex justify-between py-3">
          <div className="text-sm text-muted-foreground">
            {/* {currentStep + 1} / {totalSteps} */}
          </div>

          {step.showSkip && (
            <Button variant="ghost" size="sm" onClick={skipTour}>
              Skip
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default ShadcnDarkModeCard;
