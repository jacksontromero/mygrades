import { getUserStore, updateUserStore } from "@/server/authorized-queries";
import { SidebarTrigger } from "../ui/sidebar";
import SaveChanges from "./SaveChanges";
import ThemeButton from "./ThemeButton";
import { serverDataStore } from "@/data/store";
import { auth } from "@/server/auth";

export default async function Topbar() {
  async function passedUpdateServerStore(data: serverDataStore) {
    "use server";
    await updateUserStore(data);
  }

  const session = await auth();

  let serverStore = null;

  if (session) {
    serverStore = await getUserStore();
  }

  return (
    <div className="mt-1 flex flex-row items-center justify-between">
      <SidebarTrigger />
      {session ? (
        <SaveChanges
          updateServerStore={passedUpdateServerStore}
          serverStore={serverStore}
        />
      ) : (
        <></>
      )}
      <ThemeButton />
    </div>
  );
}
