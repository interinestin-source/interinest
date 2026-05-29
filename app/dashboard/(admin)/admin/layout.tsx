import SidebarClientWrapper from "@/components/admin/SidebarClientWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interinest Admin",
  description: "Interinest Admin Dashboard",
};

export default function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarClientWrapper>
      <div className="min-h-screen">{children}</div>
    </SidebarClientWrapper>
  );
}
