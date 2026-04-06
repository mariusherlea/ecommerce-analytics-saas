import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { auth } from "../../../auth";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

return (
  <div className="flex min-h-screen bg-black">
    <DashboardSidebar />

    <div className="flex min-w-0 flex-1 flex-col bg-black">
      <DashboardHeader />
      <main className="flex-1 bg-black p-6">{children}</main>
    </div>
  </div>
);
}