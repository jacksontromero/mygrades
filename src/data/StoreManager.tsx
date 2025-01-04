"use server";

import { auth } from "@/server/auth";
import {
  getUserStore,
  createUserStore,
  updateUserStore,
} from "@/server/authorized-queries";
import PopulateStore from "./ClientStoreManager";
import { serverDataStore } from "./store";
import ServerSync from "./ServerSync";

export default async function StoreManager() {
  const session = await auth();

  if (session) {
    const userStore = await getUserStore();

    async function passedCreateUserStoreFn(data: serverDataStore) {
      "use server";
      await createUserStore(data);
    }

    async function passedUpdateUserStoreFn(data: serverDataStore) {
      "use server";
      await updateUserStore(data);
    }

    return (
      <div>
        <PopulateStore
          userStore={userStore}
          createUserStore={passedCreateUserStoreFn}
        />
        <ServerSync updateUserStore={passedUpdateUserStoreFn} />
      </div>
    );
  }

  return <div> </div>;
}
