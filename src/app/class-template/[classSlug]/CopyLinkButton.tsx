"use client";
import { P } from "@/components/ui/typography";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import { useState } from "react";

export default function CopyLinkButton(params: { id: string }) {
  const { id } = params;

  const clip = navigator.clipboard;

  const [copied, setCopied] = useState(false);

  return (
    <>
      {!copied ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              onClick={() => {
                setCopied(true);
                clip.writeText(`https://mygrades.app/class-template/${id}`);
              }}
            >
              <ClipboardIcon className="text-primary" size={28} />
            </TooltipTrigger>
            <TooltipContent>
              <P>Copy Link to this Template</P>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <CheckIcon className="text-primary" size={28} />
      )}
    </>
  );
}
