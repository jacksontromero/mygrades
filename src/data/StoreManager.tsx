"use server";

import { auth } from "@/server/auth";
import { getUserStore } from "@/server/authorized-queries";
import PopulateStore from "./PopulateStore";
export default async function StoreManager() {
  const session = await auth();

  if (session) {
    const serverStore = await getUserStore();

    return (
      <div>
        <PopulateStore serverStore={serverStore} />
      </div>
    );
  }

  return <div> </div>;
}
