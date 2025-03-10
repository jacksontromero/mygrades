import { bucket } from "@/data/store";
import { Input } from "../../../components/ui/input";
import { P } from "../../../components/ui/typography";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function FrozenAssignments(params: { bucket: bucket }) {
  const { bucket } = params;

  return (
    <div className="mt-2 flex flex-col items-center gap-0">
      {bucket.assignments.map((x, i) => (
        <div
          key={x.id}
          className={`rounded-md bg-background bg-primary/20 px-1 py-1`}
        >
          (
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
                  disabled={true}
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
                  disabled={true}
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
                  disabled={true}
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
            </div>
          </form>
        </div>
      ))}
      {bucket.assignments.length === 0 ? (
        <>
          <P className="text-muted-foreground">No pre-filled assignments</P>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
