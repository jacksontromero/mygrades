"use client";

import { useEffect, useState } from "react";
import { useWindowWidth } from "@react-hook/window-size/throttled";
import {
  assignment,
  bucket,
  SelectingStates,
  useDataStore,
} from "@/data/store";
import { Input } from "../../../components/ui/input";
import { H3, H4, P } from "../../../components/ui/typography";
import { Separator } from "../../../components/ui/separator";
import { Button } from "../../../components/ui/button";
import Bucket from "./Bucket";
import { useNextStep } from "nextstepjs";
import { Label } from "@/components/ui/label";

export function calculateScores(b: bucket): { dropped: number; raw: number } {
  const nonSim = b.assignments.filter((x) => !x.simulated);
  const totalNonSimScore = nonSim.reduce((acc, x) => acc + x.score, 0);
  const totalNonSimPoints = nonSim.reduce((acc, x) => acc + x.outOf, 0);

  const simulated = b.assignments.map((x) =>
    !x.simulated
      ? x
      : {
          ...x,
          score:
            totalNonSimPoints == 0
              ? 0
              : (totalNonSimScore / totalNonSimPoints) * x.outOf,
        },
  );

  const sorted = simulated.sort(
    (a1, a2) => a2.score / a2.outOf - a1.score / a1.outOf,
  );

  const totalScore = sorted.reduce((acc, x) => acc + x.score, 0);
  const totalPoints = sorted.reduce((acc, x) => acc + x.outOf, 0);

  const dropped = sorted.slice(0, sorted.length - b.drops);

  const totalDroppedScore = dropped.reduce((acc, x) => acc + x.score, 0);
  const totalDroppedPoints = dropped.reduce((acc, x) => acc + x.outOf, 0);

  return {
    dropped:
      totalDroppedPoints == 0 ? 0 : totalDroppedScore / totalDroppedPoints,
    raw: totalPoints == 0 ? 0 : totalScore / totalPoints,
  };
}

function calculateScoreNecessary(
  selectedAssignment: assignment | null,
  selectedBucketId: string | null,
  weights: bucket[],
  targetGrade: number,
): number {
  if (selectedAssignment == null || selectedBucketId == null) {
    return 0;
  }

  let totalPercentage = 0;

  for (const b of weights) {
    if (b.id !== selectedBucketId) {
      totalPercentage += calculateScores(b).dropped * b.percentage;
    }
  }

  totalPercentage /= 100;

  const selectedBucket = weights.find((x) => x.id === selectedBucketId);

  if (!selectedBucket) {
    return 0;
  }

  // what's the percentage needed in the final bucket to get the target grade?
  const percentFinalBucketNeeded =
    (targetGrade / 100 - totalPercentage) / (selectedBucket.percentage / 100);

  // calculate score needed for assignment within bucket
  const assignmentsWithoutSelected = selectedBucket.assignments.filter(
    (x) => x.id !== selectedAssignment?.id,
  );

  const nonSim = assignmentsWithoutSelected.filter((x) => !x.simulated);
  const totalNonSimScore = nonSim.reduce((acc, x) => acc + x.score, 0);
  const totalNonSimPoints = nonSim.reduce((acc, x) => acc + x.outOf, 0);

  const simulated = assignmentsWithoutSelected.map((x) =>
    !x.simulated
      ? x
      : {
          ...x,
          score:
            totalNonSimPoints == 0
              ? 0
              : (totalNonSimScore / totalNonSimPoints) * x.outOf,
        },
  );

  // TODO - this drops by percent instead of by num points lost? Is this right?
  const sorted = simulated.sort(
    (a1, a2) => a2.score / a2.outOf - a1.score / a1.outOf,
  );

  const dropped = sorted.slice(0, sorted.length - selectedBucket.drops);

  const totalDroppedScore = dropped.reduce((acc, x) => acc + x.score, 0);
  const totalDroppedPoints = dropped.reduce((acc, x) => acc + x.outOf, 0);

  const percentageAddNecessary =
    percentFinalBucketNeeded -
    totalDroppedScore / (totalDroppedPoints + selectedAssignment.outOf);

  const percentageForTarget =
    (percentageAddNecessary * (totalDroppedPoints + selectedAssignment.outOf)) /
    selectedAssignment.outOf;

  return percentageForTarget < 0 ? 0 : percentageForTarget;
}

function totalGrade(weights: bucket[]): number {
  let total = 0;

  for (const b of weights) {
    total += calculateScores(b).dropped * b.percentage;
  }

  return total;
}

export default function ClassDetails(params: { classId: string }) {
  const classId = params.classId;

  const name = useDataStore((state) => state.classes[classId]!.name);
  const selectingState = useDataStore(
    (state) => state.classes[classId]!.selectingState,
  );
  const selectedAssignment = useDataStore(
    (state) => state.classes[classId]!.selectedAssignment,
  );
  const selectedBucketId = useDataStore(
    (state) => state.classes[classId]!.selectedBucketId,
  );

  const weights = useDataStore((state) => state.classes[classId]!.weights);
  const targetGrade = useDataStore(
    (state) => state.classes[classId]!.targetGrade,
  );

  const setTargetGrade = useDataStore((state) => state.setTargetGrade);
  const resetSelectAssignment = useDataStore(
    (state) => state.resetSelectAssignment,
  );

  const [targetGradeBox, setTargetGradeBox] = useState(
    null as JSX.Element | null,
  );

  useEffect(() => {
    setTargetGradeBox(
      <Input
        onChange={(e) => setTargetGrade(classId, Number(e.target.value))}
        type="number"
        defaultValue={targetGrade}
        placeholder="Target Grade %"
        min={0}
        onFocus={(e) => {
          e.target.select();
        }}
        onWheel={(e) => (e.target as HTMLElement).blur()}
        id="target-grade-box"
      />,
    );
  }, [targetGrade, classId, setTargetGrade]);

  const { startNextStep } = useNextStep();

  const tourStatus = useDataStore((state) => state.tourStatus);

  useEffect(() => {
    // if haven't had the sidebar tour, start that one, otherwise start the fill-in-class tour

    if (!tourStatus["sidebar-tour"]) {
      startNextStep("sidebar-tour");
    } else {
      startNextStep("fill-in-class-tour");
    }
  }, [startNextStep, tourStatus]);

  const screenWidth = useWindowWidth();
  const widthBreakpoint = 240;
  const vertical = screenWidth / weights.length <= widthBreakpoint;

  return (
    <div className={"w-full p-2" + (vertical ? " text-center" : "")}>
      <H4>{name} Details</H4>
      <div className="flex flex-col gap-2">
        <div
          className={`mt-4 ${
            vertical ? "flex flex-col items-center" : "flex flex-row flex-wrap"
          }`}
        >
          {weights.map((x, i) => (
            <div
              id={i == 0 ? "first-bucket" : ""}
              key={x.id}
              className={vertical ? "w-full" : "min-w-[200px] flex-1"}
            >
              <Bucket classId={classId} x={x} i={i} vertical={vertical} />
              {vertical && (
                <Separator
                  orientation="horizontal"
                  className="my-12 border-2"
                />
              )}
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 flex flex-col items-center justify-center gap-2 bg-background pb-2">
          <Separator className="mt-2 bg-gradient-to-t from-background" />
          <div id="select-target">
            <H3 className="mb-4 text-center">
              Total Grade: {totalGrade(weights).toFixed(2)}%
            </H3>
            <div className="flex flex-row items-end justify-center gap-4">
              <div>
                <Label htmlFor="target-grade-box">Target Class Grade</Label>
                {targetGradeBox}
              </div>
              <Button
                size="lg"
                variant={
                  selectingState == SelectingStates.SELECTING
                    ? "outline"
                    : "default"
                }
                onClick={() => {
                  if (selectingState == SelectingStates.SELECTING) {
                    resetSelectAssignment(classId, SelectingStates.FIRST_LOAD);
                  } else {
                    resetSelectAssignment(classId, SelectingStates.SELECTING);
                  }
                }}
              >
                {selectingState == SelectingStates.SELECTING
                  ? "Cancel Selection"
                  : "Select Target Assignment"}
              </Button>
            </div>
            {selectingState == SelectingStates.SELECTED && (
              <>
                <P className="text-center text-lg font-bold">
                  Score necessary on selected assignment to get ≥ {targetGrade}
                  %:{" "}
                </P>
                <P className="!mt-0 text-center text-lg font-bold">
                  {(
                    calculateScoreNecessary(
                      selectedAssignment,
                      selectedBucketId,
                      weights,
                      targetGrade,
                    ) * 100
                  ).toFixed(2)}
                  %
                </P>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
