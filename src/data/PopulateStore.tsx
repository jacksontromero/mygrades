"use client";

import { useEffect } from "react";
import { serverDataStore, useDataStore } from "./store";

export default function PopulateStore(params: {
  serverStore: serverDataStore | null;
  createUserStore: (data: serverDataStore) => Promise<void>;
}) {
  const { serverStore, createUserStore } = params;

  const isHydrated = useDataStore((state) => state._hasHydrated);

  useEffect(() => {
    if (serverStore) {
      useDataStore.setState((state) => {
        state.classes = serverStore.classes;
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
  }, [isHydrated, serverStore, createUserStore]);

  return <></>;
}
