"use server";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import AddClass from "./add_class/AddClass";
import { H1, P } from "../ui/typography";
import Link from "next/link";
import { Separator } from "@radix-ui/react-separator";
import { NavUser } from "./NavUser";
import SignIn from "../auth/SignIn";
import SidebarClasses from "./SidebarClasses";
import { auth } from "@/server/auth";
import { getAllUniversities } from "@/server/unauthorized-queries";
import SharedContextProvider from "./SharedContext";
import { publishClass, publishClassInput } from "@/server/authorized-queries";

export async function AppSidebar() {
  const session = await auth();

  const allUniversities = await getAllUniversities();

  async function boundPublishClass(data: publishClassInput) {
    "use server";
    return await publishClass(data);
  }

  return (
    <SharedContextProvider allUniversities={allUniversities}>
      <Sidebar id="sidebar-for-tour">
        <SidebarHeader>
          <Link href="/">
            <H1 className="!text-[1.5rem]">mygrades.app</H1>
          </Link>
          <div className="flex flex-row items-center justify-start">
            <P className="text-xs">Created by Jackson Romero</P>
            <Separator orientation="vertical" className="mx-2 h-full border" />
            <Link
              href={"https://github.com/jacksontromero/mygrades"}
              target="_blank"
            >
              <svg
                suppressHydrationWarning
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                width={18}
                className="fill-foreground"
              >
                <title>GitHub</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarSeparator className="mt-4" />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Classes</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                <SidebarClasses publishClass={boundPublishClass} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <AddClass />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            {session ? (
              <NavUser
                user={{
                  name: session.user.name!,
                  email: session.user.email!,
                  avatar: session.user.image!,
                }}
              />
            ) : (
              <div id="sign-in-button">
                <SignIn />
              </div>
            )}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SharedContextProvider>
  );
}
