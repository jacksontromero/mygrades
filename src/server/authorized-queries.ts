import { auth } from "./auth";
import { db } from "./db";
import { savedStores } from "./db/schema";

export async function getUserStore(): Promise<any | null> {
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

export async function createUserStore(data: any) {
  const session = await auth();

  console.log("creating user store", data);

  if (!session) {
    throw new Error("Not authenticated");
  }

  await db.insert(savedStores).values({
    createdById: session.user.id,
    data: data,
  });

  return;
}
