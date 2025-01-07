import { serverDataStore } from "@/data/store";
import { auth } from "./auth";
import { db } from "./db";
import {
  publishedClasses,
  savedStores,
  usersToInaccurateReports,
} from "./db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function getUserStore(): Promise<serverDataStore | null> {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const userStore = await db.query.savedStores.findFirst({
    where: (model, { eq }) => eq(model.createdById, session.user.id),
  });

  if (!userStore) {
    return null;
  }

  return userStore.data;
}

export async function updateUserStore(data: serverDataStore) {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  // check that the current user is in the store, if not add them
  const res = await db.query.savedStores.findFirst({
    where: (model, { eq }) => eq(model.createdById, session.user.id),
  });

  if (!res) {
    await db.insert(savedStores).values({
      createdById: session.user.id,
      data: data,
    });
  } else {
    await db
      .update(savedStores)
      .set({
        data: data,
      })
      .where(eq(savedStores.createdById, session.user.id));
  }

  return;
}

/**
 *
 * @returns A set of class IDs that the user has reported as inaccurate,
or an empty set if the user has not reported any classes.
 */
export async function getUserReportedInaccurateClasses() {
  const session = await auth();

  if (!session) {
    return new Set([]);
  }

  const res = await db.query.usersToInaccurateReports.findMany({
    where: (model, { eq }) => eq(model.userId, session.user.id),
  });

  return new Set(res.map((x) => x.classId));
}

async function checkAlreadyReported(classId: string) {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  // check that the current user has not already reported this class
  const alreadyReported = await db.query.usersToInaccurateReports.findFirst({
    where: (model, { eq }) =>
      and(eq(model.classId, classId), eq(model.userId, session.user.id)),
  });

  return !!alreadyReported;
}

export async function reportInaccurateSchema(classId: string) {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const alreadyReported = await checkAlreadyReported(classId);

  if (alreadyReported) {
    throw new Error("User has already reported this class");
  }

  // increment count
  await db
    .update(publishedClasses)
    .set({
      numInaccurateReports: sql`${publishedClasses.numInaccurateReports} + 1`,
    })
    .where(eq(publishedClasses.id, classId));

  // add user to list of users who have reported this class
  await db.insert(usersToInaccurateReports).values({
    userId: session.user.id,
    classId: classId,
  });

  return;
}
