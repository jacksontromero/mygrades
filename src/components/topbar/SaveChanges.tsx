"use client";

import { serverDataStore, useDataStore } from "@/data/store";
import { useEffect, useState } from "react";
import { Small } from "../ui/typography";
import { Button } from "../ui/button";
import { CloudUpload, LoaderIcon } from "lucide-react";
import { isEqual } from "lodash";

export default function SaveChanges(params: {
  updateServerStore: (data: serverDataStore) => Promise<void>;
  serverStore: serverDataStore | null;
}) {
  const { updateServerStore } = params;

  // this triggers a re-render of this component whenever the store changes at all
  const wholeStore = useDataStore((state) => state);
  const [mutated, setMutated] = useState(false);

  // TODO - use react query to handle this?
  const [syncing, setSyncing] = useState(false);

  // set mutations after hydration
  useEffect(() => {
    if (!isEqual(wholeStore.classes, params.serverStore?.classes)) {
      setMutated(true);
    } else {
      setMutated(false);
    }
  }, [wholeStore, params.serverStore?.classes]);

  // popup on trying to close page if unsaved changes
  const listener = (e: BeforeUnloadEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (mutated) {
      window.addEventListener("beforeunload", listener);
      return () => window.removeEventListener("beforeunload", listener);
    }
  }, [mutated]);

  if (mutated && !syncing) {
    return (
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          const res = updateServerStore({
            classes: wholeStore.classes,
            schemaVersion: 0,
          });

          setMutated(false);
          setSyncing(true);

          res.then(
            () => {
              setSyncing(false);
            },
            () => {
              setSyncing(false);
              throw new Error("Error saving changes");
            },
          );
        }}
      >
        <div className="flex flex-row items-center gap-1">
          <CloudUpload />

          <div>Save Changes</div>
        </div>
      </Button>
    );
  } else if (!mutated && !syncing) {
    return (
      <div>
        <Small className="text-xs text-muted-foreground">
          All changes synced
        </Small>
      </div>
    );
  } else if (syncing) {
    return <LoaderIcon className="animate-spin" />;
  }
}
