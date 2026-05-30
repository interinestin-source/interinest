import DesignerSidebarClientWrapper from "@/components/designer/DesignerSidebarClientWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interinest — Designer Dashboard",
  description: "Manage your projects, enquiries and portfolio on Interinest.",
};

export default function DesignerDashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <DesignerSidebarClientWrapper>
      <div className="min-h-screen bg-slate-50">{children}</div>
    </DesignerSidebarClientWrapper>
  );
}
