"use client";

import { Separator } from "@/components/ui/separator";
import { P } from "@/components/ui/typography";
import { useWindowWidth } from "@react-hook/window-size/throttled";
import { bucket } from "src/data/store";
import FrozenAssignments from "./FrozenAssignments";

export default function FrozenBucket(params: {
  bucket: bucket;
  i: number;
  n: number;
}) {
  const { bucket, i, n } = params;

  const screenWidth = useWindowWidth();
  const widthBreakpoint = 240;
  const vertical = screenWidth / n <= widthBreakpoint;

  return (
    <div className="flex min-h-full flex-row">
      {i != 0 && !vertical && (
        <Separator orientation="vertical" className="mx-2" />
      )}
      <div className="align-start flex w-full flex-col gap-1">
        <P className="text-md font-bold">
          {bucket.name} ({bucket.percentage}%)
        </P>

        <FrozenAssignments bucket={bucket} />

        {/* {!vertical && <Separator className="mt-2"></Separator>} */}
      </div>
    </div>
  );
}
