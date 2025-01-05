import { serverDataStore } from "@/data/store";
import { auth } from "./auth";
import { db } from "./db";
import { savedStores } from "./db/schema";
import { eq } from "drizzle-orm";

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
