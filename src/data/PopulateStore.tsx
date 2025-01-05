"use client";

import { useEffect, useState } from "react";
import { schoolClass, serverDataStore, useDataStore } from "./store";
import { isEqual } from "lodash";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { P } from "@/components/ui/typography";

export default function PopulateStore(params: {
  serverStore: serverDataStore | null;
}) {
  const { serverStore } = params;
  const existingStore = useDataStore((state) => state);
  const [runOnce, setRunOnce] = useState(false);

  const [mismatechDialogOpen, setMismatchedDialogOpen] = useState(false);
  const [mismatchedClasses, setMismatchedClasses] = useState<schoolClass[]>([]);

  useEffect(() => {
    if (serverStore && existingStore._hasHydrated && !runOnce) {
      setRunOnce(true);
      for (const [id, serverClass] of Object.entries(serverStore.classes)) {
        if (!existingStore.classes.hasOwnProperty(id)) {
          useDataStore.setState((state) => {
            state.classes[id] = serverClass;
          });
        } else {
          // if the contents are equal, do nothing
          if (!isEqual(existingStore.classes[id], serverClass)) {
            setMismatchedClasses([
              ...mismatchedClasses,
              existingStore.classes[id]!,
            ]);
            setMismatchedDialogOpen(true);
          }
        }
      }
    }
  }, [serverStore, existingStore]);

  if (mismatchedClasses.length > 0) {
    return (
      <AlertDialog open={mismatechDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Out of Sync Classes Detected</AlertDialogTitle>
            <div className="text-sm text-muted-foreground">
              {/* <AlertDialogDescription> */}
              <P>
                Your browser's local classes are out of sync with what you've
                synced to the cloud previously. Would you like to with your
                current local classes or overwrite them with the cloud data?
              </P>
              <P>
                The out of sync classes are:{" "}
                {mismatchedClasses.map((x) => x.name).join(", ")}
              </P>
              {/* </AlertDialogDescription> */}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMismatchedDialogOpen(false)}>
              Continue With Local Classes
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                useDataStore.setState((state) => {
                  state.classes = serverStore!.classes;
                });
                setMismatchedDialogOpen(false);
              }}
            >
              Overwrite With Cloud Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return <></>;
}
