"use client";
import { P } from "@/components/ui/typography";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { CheckIcon, ClipboardIcon, LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CopyLinkButton(params: { id: string }) {
  const { id } = params;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const copyToClipboard = async () => {
    setCopied(true);
    await navigator.clipboard.writeText(
      `https://mygrades.app/class-template/${id}`
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className="h-9 w-9 rounded-full p-0 text-primary hover:bg-primary/10"
          >
            {copied ? (
              <CheckIcon size={20} className="text-green-600" />
            ) : (
              <LinkIcon size={20} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <P>{copied ? "Copied!" : "Copy link to share this template"}</P>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
