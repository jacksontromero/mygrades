import { allUniversitiesView, publishedClasses } from "@/server/db/schema";

import { and, desc, eq, getTableColumns, gt, sql } from "drizzle-orm";
import { db } from "./db";

export async function searchPublishedClassesByName(
  name: string,
  university: string | null = null,
  paginationIdx = 0,
) {
  const paginationSize = 10;

  const res = await db
    .select({
      ...getTableColumns(publishedClasses),
      similarity: sql<number>`similarity(${name}, ${publishedClasses.name})`,
    })
    .from(publishedClasses)
    .where((x) =>
      and(
        gt(x.similarity, 0.2),
        university ? eq(x.university, university) : undefined,
      ),
    )
    .orderBy((x) => desc(x.similarity))
    .limit(paginationSize)
    .offset(paginationIdx * paginationSize);

  return res;
}

export async function searchPublishedClassesByNumber(
  number: string,
  university: string | null = null,
  paginationIdx = 0,
) {
  const paginationSize = 10;

  const res = await db
    .select({
      ...getTableColumns(publishedClasses),
      similarity: sql<number>`similarity(${number}, ${publishedClasses.number})`,
    })
    .from(publishedClasses)
    .where((x) =>
      and(
        gt(x.similarity, 0.2),
        university ? eq(x.university, university) : undefined,
      ),
    )
    .orderBy((x) => desc(x.similarity))
    .limit(paginationSize)
    .offset(paginationIdx * paginationSize);

  return res;
}

export async function getAllUniversities() {
  await db.refreshMaterializedView(allUniversitiesView);

  const res = await db.select().from(allUniversitiesView);

  return res.map((x) => x.university);
}

export async function increaseNumUsers(classId: string) {
  await db
    .update(publishedClasses)
    .set({ numUsers: sql`${publishedClasses.numUsers} + 1` })
    .where(eq(publishedClasses.id, classId));

  return;
}
