"use server";

import {
  increaseNumUsers,
  searchPublishedClasses,
} from "@/server/unauthorized-queries";
import AddClassClient from "./AddClassClient";
import { SearchClassesClient } from "./SearchClassesClient";

export default async function AddClass() {
  return <AddClassClient searchClassesContent={<SearchClasses />} />;
}

export type RetunredCourseInfo = Awaited<
  ReturnType<typeof searchPublishedClasses>
>;

async function SearchClasses() {
  async function boundSearch(
    query: string,
    university: string | null = null,
  ) {
    "use server";
    return await searchPublishedClasses(query, university);
  }

  async function boundIncreaseNumUsers(classId: string) {
    "use server";
    return await increaseNumUsers(classId);
  }

  return (
    <SearchClassesClient
      search={boundSearch}
      increaseNumUsers={boundIncreaseNumUsers}
    />
  );
}
