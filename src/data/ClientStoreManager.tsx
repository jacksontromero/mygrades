"use client";

import { useEffect } from "react";
import { useDataStore } from "./store";

export default function PopulateStore(params: {
  userStore: any;
  createUserStore: any;
}) {
  const { userStore, createUserStore } = params;

  const isHydrated = useDataStore((state) => state._hasHydrated);

  useEffect(() => {
    if (userStore) {
      console.log("loading state from server");
      useDataStore.setState(() => ({
        ...userStore,
      }));
    } else {
      if (isHydrated) {
        console.log("sending clinet state to server");
        // this gets rid of functions and other things that are not serializable
        const stateToStore = JSON.parse(
          JSON.stringify(useDataStore.getState()),
        );
        createUserStore(stateToStore);
      }
    }
  }, [isHydrated, userStore, createUserStore]);

  return <></>;
}
