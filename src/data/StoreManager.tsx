"use server";

import { auth } from "@/server/auth";
import { getUserStore, createUserStore } from "@/server/authorized-queries";
import PopulateStore from "./ClientStoreManager";

export default async function StoreManager() {
  const session = await auth();

  if (session) {
    const userStore = await getUserStore();

    async function passedCreateUserStoreFn(data: any) {
      "use server";
      await createUserStore(data);
    }

    return (
      <PopulateStore
        userStore={userStore}
        createUserStore={passedCreateUserStoreFn}
      />
    );
  }

  return <div></div>;
}
