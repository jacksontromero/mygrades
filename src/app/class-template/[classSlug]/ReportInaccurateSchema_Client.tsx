"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ReportInaccurateSchema_Client({
  classId,
  reportAction,
  initialHasReported
}: {
  classId: string;
  reportAction: (classId: string) => Promise<{ success: boolean; error?: string }>
  initialHasReported: boolean
}) {
  const { status } = useSession();
  const router = useRouter();
  const [hasReported, setHasReported] = useState(initialHasReported);
  const [error, setError] = useState<string | null>(null);

  const handleReport = async () => {
    try {
      const result = await reportAction(classId);

      if (result.success) {
        setHasReported(true);
        router.refresh();
      } else {
        setError(result.error || "Unknown error occurred");
        // If it's an already reported error, still show as reported
        if (result.error?.includes("already reported")) {
          setHasReported(true);
        }
      }
    } catch (err) {
      console.error("Error during report:", err);
      setError("Failed to report. Please try again.");
    }
  };

  if (status !== "authenticated") {
    return (
      <Button variant="outline" disabled={true}>
        <div className="flex flex-row items-center gap-2">
          <AlertTriangle className="text-destructive" size={16} />
          <span className="text-destructive">
            Log In To Report Inaccurate Schema
          </span>
        </div>
      </Button>
    );
  }

  if (hasReported) {
    return (
      <Button variant="outline" disabled={true}>
        <div className="flex flex-row items-center gap-2">
          <AlertTriangle className="text-destructive" size={16} />
          <span className="text-destructive">
            You Have Already Reported This Class
          </span>
        </div>
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <div className="flex flex-row items-center gap-2">
            <AlertTriangle className="text-destructive" size={16} />
            <span className="text-destructive">
              Report Inaccurate Schema
            </span>
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Report Inaccurate Schema
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Please only
            report inaccurate schemas if you are sure that
            this schema is inaccurate. It is encouraged
            that you publish a corrected version.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-primary hover:bg-destructive"
            onClick={handleReport}
          >
            Report
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
