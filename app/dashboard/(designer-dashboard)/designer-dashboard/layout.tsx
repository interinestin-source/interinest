import SidebarClientWrapper from "@/components/dashboard/SidebarClientWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interinest Designer Dashboard",
  description: "Interinest - Nested Freelance Marketplace for Designers",
};

export default function DesignerDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarClientWrapper>
      <div className="min-h-screen">{children}</div>
    </SidebarClientWrapper>
  );
}
