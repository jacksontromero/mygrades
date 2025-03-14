"use server";

import { checkAlreadyReported, reportInaccurateSchema } from "@/server/authorized-queries";
import ReportInaccurateSchema_Client from "./ReportInaccurateSchema_Client";
import { auth } from "@/server/auth";

export async function reportAction(classId: string) {
  "use server";

  try {
    await reportInaccurateSchema(classId);
    return { success: true };
  } catch (error) {
    console.error("Error reporting inaccurate schema:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

async function checkIfAlreadyReported(classId: string): Promise<boolean> {
  "use server";

  try {
    // only check if user is authenticated
    const session = await auth();
    if (!session) {
      return false;
    }

    const alreadyReported = await checkAlreadyReported(classId);
    return alreadyReported;
  } catch (error) {
    console.error("Error checking if already reported:", error);
    return false;
  }
}

export default async function ReportInaccurateSchema({ classId }: { classId: string }) {
  const alreadyReported = await checkIfAlreadyReported(classId);
  return <ReportInaccurateSchema_Client classId={classId} reportAction={reportAction} initialHasReported={alreadyReported} />;
}
