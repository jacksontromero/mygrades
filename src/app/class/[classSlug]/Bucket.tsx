import { bucket } from "@/data/store";
import { Separator } from "@/components/ui/separator";
import { P } from "@/components/ui/typography";
import Assignments from "./Assignments";
import { calculateScores } from "./ClassDetails";

export default function Bucket(params: {
  classId: string;
  x: bucket;
  i: number;
  vertical: boolean;
}) {
  const { classId, x, i, vertical } = params;

  return (
    <div className="flex min-h-full flex-row">
      {i != 0 && !vertical && (
        <Separator orientation="vertical" className="mx-2" />
      )}
      <div className="align-start flex w-full flex-col gap-1">
        <P className="text-md font-bold">
          {x.name} ({x.percentage}%)
        </P>

        <Assignments classId={classId} bucket={x} />

        {!vertical && <Separator className="mt-2"></Separator>}

        {x.assignments.length != 0 && (
          <div>
            {x.drops != 0 && (
              <P className="!mt-4">
                Average after {x.drops} drops:{" "}
                {(calculateScores(x).dropped * 100).toFixed(2)}%
              </P>
            )}
            <P className="!mt-2">
              Average without drops: {(calculateScores(x).raw * 100).toFixed(2)}
              %
            </P>
          </div>
        )}
      </div>
    </div>
  );
}
