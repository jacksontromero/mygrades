import type { Metadata } from "next";
import "@/styles/globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { GeistSans } from "geist/font/sans";
import Topbar from "@/components/topbar/Topbar";
import { SessionProvider } from "next-auth/react";
import { cookies } from "next/headers";
import StoreManager from "@/data/StoreManager";

export const metadata: Metadata = {
  title: "Final Grade Calculator",
  description:
    "Calculator for what grade you need on an assignment to get a specific grade in a class.  Supports multiple classes, grading schemes that make use of buckets/weights for different types of assignments, dropping/drops for the lowest assignments per bucket, and simulating average performance on assignments. ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value !== "false";

  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      {/* <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          // disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            <SessionProvider>
              <AppSidebar />
              <StoreManager />
              <main className="w-full">
                <Topbar />
                {children}
              </main>
            </SessionProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
