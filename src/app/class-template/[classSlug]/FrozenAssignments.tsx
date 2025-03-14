import { bucket } from "@/data/store";
import { P } from "../../../components/ui/typography";

export default function FrozenAssignments(params: { bucket: bucket }) {
  const { bucket } = params;

  return (
    <div className="flex flex-col gap-3">
      {bucket.assignments.length > 0 && (
        <div className="grid grid-cols-12 gap-2 px-1 text-sm font-medium text-muted-foreground">
          <div className="col-span-9">Assignment Name</div>
          {/* <div className="col-span-3 text-center">Score</div> */}
          <div className="col-span-3 text-center">Out Of</div>
        </div>
      )}

      {bucket.assignments.map((assignment) => (
        <div
          key={assignment.id}
          className="rounded-md bg-background p-2 transition-colors hover:bg-muted/20"
        >
          <div className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-9 truncate font-medium">
              {assignment.name}
            </div>
            {/* <div className="col-span-3 text-center">
              <span className={cn(
                "inline-block min-w-8 rounded bg-primary/10 py-1 text-center",
                assignment.score > assignment.outOf && "bg-destructive/20"
              )}>
                {assignment.score}
              </span>
            </div> */}
            <div className="col-span-3 text-center">
              <span className="inline-block min-w-8 rounded bg-muted/30 py-1 text-center">
                {assignment.outOf}
              </span>
            </div>
          </div>
        </div>
      ))}

      {bucket.assignments.length === 0 && (
        <div className="flex h-20 flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
          <P className="text-muted-foreground">No pre-filled assignments</P>
          <P className="text-xs text-muted-foreground">Assignments will be added when you add this class</P>
        </div>
      )}
    </div>
  );
}
