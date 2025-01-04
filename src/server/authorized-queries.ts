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

export async function createUserStore(data: serverDataStore) {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  await db.insert(savedStores).values({
    createdById: session.user.id,
    data: data,
  });

  return;
}

export async function updateUserStore(data: serverDataStore) {
  const session = await auth();

  console.log(
    "updating user store",
    data.classes["83d578ea-dfdd-40d0-a1f7-1ee820c37f12"]?.weights,
  );

  if (!session) {
    throw new Error("Not authenticated");
  }

  await db
    .update(savedStores)
    .set({
      data: data,
    })
    .where(eq(savedStores.createdById, session.user.id));

  return;
}
