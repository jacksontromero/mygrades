"use client";

import { useDataStore } from "@/data/store";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "../ui/sidebar";
import ClassOptions from "./ClassOptions";
import { publishClassInput } from "@/server/authorized-queries";

export default function SidebarClasses({
  publishClass,
}: {
  publishClass: (data: publishClassInput) => Promise<void>;
}) {
  const classIds = useDataStore(
    useShallow((state) => Object.keys(state.classes)),
  );
  const classes = useDataStore.getState().classes;
  const isHydrated = useDataStore((state) => state._hasHydrated);

  const router = useRouter();

  return (
    <>
      {isHydrated
        ? classIds.length != 0 &&
          Object.entries(classes).map(([_id, x]) => (
            <SidebarMenuItem key={x.id} className="">
              <div className="flex flex-row items-center justify-between">
                <SidebarMenuButton
                  className="h-auto"
                  onClick={() => router.push(`/class/${x.id}`)}
                >
                  <div>
                    {x.name} ({x.number})
                  </div>
                </SidebarMenuButton>
                <ClassOptions
                  existingClassId={x.id}
                  publishClass={publishClass}
                />
              </div>
            </SidebarMenuItem>
          ))
        : Array.from({ length: 5 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuSkeleton />
            </SidebarMenuItem>
          ))}
    </>
  );
}
