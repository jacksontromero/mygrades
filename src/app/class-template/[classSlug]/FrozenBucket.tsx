"use client";

import { H3 } from "@/components/ui/typography";
import { useWindowWidth } from "@react-hook/window-size/throttled";
import { bucket } from "src/data/store";
import FrozenAssignments from "./FrozenAssignments";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
    <Card className="h-full overflow-hidden border shadow transition-all hover:border-primary/50 hover:shadow-md">
      <CardHeader className="bg-primary/10 p-3 pb-2">
        <div className="flex items-center justify-between">
          <H3 className="text-lg font-medium">{bucket.name}</H3>
          <span className="rounded-full bg-primary/20 px-2 py-1 text-sm font-semibold">
            {bucket.percentage}% {bucket.drops !== 0 && `(${bucket.drops} drops)`}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <FrozenAssignments bucket={bucket} />
      </CardContent>
    </Card>
  );
}
