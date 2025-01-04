"use client";

import { useEffect, useRef, useState } from "react";
import { schoolClass, serverDataStore, useDataStore } from "./store";

export default function ServerSync(params: {
  updateUserStore: (data: serverDataStore) => Promise<void>;
}) {
  const { updateUserStore } = params;

  // this triggers a re-render of this component whenever the store changes at all
  const wholeStore = useDataStore((state) => state);

  // need this ref so that the callback in setInterval has access to updated state and not state when it was created
  // this is stupid but idk how else to do it
  const currentClasses = useRef<Record<string, schoolClass>>(
    wholeStore.classes,
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mutated = useRef<boolean>(false);

  useEffect(() => {
    // every 10 seconds, send the whole store to the server
    if (wholeStore._hasHydrated) {
      console.log("starting sync");

      mutated.current = true;
      currentClasses.current = wholeStore.classes;

      console.log(mutated.current);

      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          console.log("sending store to server", mutated.current);
          if (mutated.current) {
            updateUserStore({
              classes: currentClasses.current,
              schemaVersion: 0,
            });
            mutated.current = false;
          }
        }, 10000);
      }
    }
  }, [wholeStore]);

  return <></>;
}
