"use server";

import {
  getAllUniversities,
  increaseNumUsers,
  searchPublishedClassesByName,
  searchPublishedClassesByNumber,
} from "@/server/unauthorized-queries";
import AddClassClient from "./AddClassClient";
import { SearchClassesClient } from "./SearchClassesClient";
import {
  getUserReportedInaccurateClasses,
  reportInaccurateSchema,
} from "@/server/authorized-queries";

export default async function AddClass() {
  return <AddClassClient searchClassesContent={<SearchClasses />} />;
}

export type RetunredCourseInfo = Awaited<
  ReturnType<typeof searchPublishedClassesByName>
>;

async function SearchClasses() {
  async function boundSearchName(
    name: string,
    university: string | null = null,
  ) {
    "use server";
    return await searchPublishedClassesByName(name, university);
  }
  async function boundSearchNumber(
    number: string,
    university: string | null = null,
  ) {
    "use server";
    return await searchPublishedClassesByNumber(number, university);
  }

  async function boundIncreaseNumUsers(classId: string) {
    "use server";
    return await increaseNumUsers(classId);
  }

  async function boundReportInaccurate(classId: string) {
    "use server";
    return await reportInaccurateSchema(classId);
  }

  const reportedInaccurateClasses = await getUserReportedInaccurateClasses();

  return (
    <SearchClassesClient
      searchName={boundSearchName}
      searchNumber={boundSearchNumber}
      increaseNumUsers={boundIncreaseNumUsers}
      reportInaccurate={boundReportInaccurate}
      reportedInaccurateClasses={reportedInaccurateClasses}
    />
  );
}
