"use client";

import { useDataStore } from "@/data/store";
import { Button } from "../ui/button";
import { Book } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { P } from "../ui/typography";

export default function TourButton() {
  const resetTours = useDataStore((state) => state.resetTours);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => resetTours()}>
            <Book className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-destructive" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <P>Reset all walkthrough tours</P>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
