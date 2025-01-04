"use client";

import { useEffect } from "react";
import { serverDataStore, useDataStore } from "./store";

export default function PopulateStore(params: {
  userStore: serverDataStore | null;
  createUserStore: (data: serverDataStore) => Promise<void>;
}) {
  const { userStore, createUserStore } = params;

  const isHydrated = useDataStore((state) => state._hasHydrated);

  useEffect(() => {
    if (userStore) {
      useDataStore.setState((state) => {
        state.classes = userStore.classes;
      });
    } else {
      // if user authenticated, local state hydrated, and no existing store, send state to server
      if (isHydrated) {
        // this gets rid of functions and other things that are not serializable
        const stateToStore = {
          classes: useDataStore.getState().classes,
          schemaVersion: 0,
        };

        createUserStore(stateToStore);
      }
    }
  }, [isHydrated, userStore, createUserStore]);

  return <></>;
}
