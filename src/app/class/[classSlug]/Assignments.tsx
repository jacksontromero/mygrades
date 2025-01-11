"use client";

import { bucket, SelectingStates, useDataStore } from "@/data/store";
import { Input } from "../../../components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { P } from "../../../components/ui/typography";
import { Checkbox } from "../../../components/ui/checkbox";
import { Button } from "../../../components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function Assignments(params: {
  classId: string;
  bucket: bucket;
}) {
  const classId = params.classId;
  const bucket = params.bucket;

  const pickSelectedAssignment = useDataStore(
    (state) => state.pickSelectedAssignment,
  );
  const setAssignmentName = useDataStore((state) => state.setAssignmentName);
  const setAssignmentScore = useDataStore((state) => state.setAssignmentScore);
  const setAssignmentOutOf = useDataStore((state) => state.setAssignmentOutOf);
  const simulateAssignment = useDataStore((state) => state.simulateAssignment);
  const removeAssignment = useDataStore((state) => state.removeAssignment);
  const addNewAssignment = useDataStore((state) => state.addNewAssignment);

  const selectingState = useDataStore(
    (state) => state.classes[classId]!.selectingState,
  );
  const selectedAssignment = useDataStore(
    (state) => state.classes[classId]!.selectedAssignment,
  );

  return (
    <div className="mt-2 flex flex-col items-center gap-0">
      {bucket.assignments.map((x, i) => (
        <div
          key={x.id}
          className={`rounded-md bg-background px-1 py-1 ${
            selectingState == SelectingStates.FIRST_LOAD ||
            (selectingState == SelectingStates.SELECTED &&
            selectedAssignment!.id === x.id
              ? "bg-primary/20"
              : "")
          }`}
        >
          {selectingState != SelectingStates.SELECTING ? (
            <form>
              <div className="flex flex-row items-end gap-1">
                <div className="grid w-[35%] items-center gap-1.5">
                  {i == 0 && (
                    <Label
                      className="overflow-hidden text-clip text-muted-foreground"
                      htmlFor="assignment-name-0"
                    >
                      Assignment Name
                    </Label>
                  )}
                  <Input
                    id={`assignment-name-${i}`}
                    className="w-full"
                    onChange={(e) =>
                      setAssignmentName(classId, bucket.id, x, e.target.value)
                    }
                    placeholder="Name"
                    defaultValue={x.name}
                    onFocus={(e) => {
                      e.target.select();
                    }}
                  />
                </div>

                <div className="grid w-[28%] items-center gap-1.5">
                  {i == 0 && (
                    <Label
                      className="text-muted-foreground"
                      htmlFor="assignment-score-0"
                    >
                      Score
                    </Label>
                  )}
                  <Input
                    id={`assignment-score-${i}`}
                    className={cn(
                      "w-full",
                      x.score > x.outOf &&
                        "bg-destructive/10 hover:bg-destructive/20",
                    )}
                    disabled={x.simulated}
                    onChange={(e) =>
                      setAssignmentScore(
                        classId,
                        bucket.id,
                        x,
                        Number(e.target.value),
                      )
                    }
                    type="number"
                    defaultValue={x.score}
                    placeholder="Score"
                    min={0}
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                  />
                </div>

                <div className="grid w-[28%] items-center gap-1.5">
                  {i == 0 && (
                    <Label
                      className="text-muted-foreground"
                      htmlFor="assignment-out-of-0"
                    >
                      Out Of
                    </Label>
                  )}
                  <Input
                    id={`assignment-out-of-${i}`}
                    className="w-full"
                    onChange={(e) =>
                      setAssignmentOutOf(
                        classId,
                        bucket.id,
                        x,
                        Number(e.target.value),
                      )
                    }
                    disabled={x.simulated}
                    type="number"
                    defaultValue={x.outOf}
                    placeholder="Out Of"
                    min={0}
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                  />
                </div>

                <div className="flex w-[9%] flex-col items-center justify-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger
                        onClick={() =>
                          removeAssignment(classId, bucket.id, x.id)
                        }
                      >
                        <Trash2Icon className="text-destructive" size={20} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <P>Delete Assignment</P>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Checkbox
                          tabIndex={-1}
                          checked={x.simulated}
                          onCheckedChange={() =>
                            simulateAssignment(classId, bucket.id, x)
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <P>
                          Simulate score using average without drops of other
                          assignments
                        </P>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </form>
          ) : (
            <Button
              variant="outline"
              size="default"
              onClick={() => pickSelectedAssignment(classId, x, bucket)}
            >
              {x.name == "" ? `Unnamed Assignment ${i + 1}` : x.name}
            </Button>
          )}
        </div>
      ))}

      {selectingState != SelectingStates.SELECTING && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              onClick={() => addNewAssignment(classId, bucket.id)}
            >
              <PlusIcon className="mt-2 text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <P>Add Assignment</P>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
