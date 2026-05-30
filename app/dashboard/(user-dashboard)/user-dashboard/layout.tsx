import UserSidebarClientWrapper from "@/components/user/UserSidebarClientWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interinest — My Dashboard",
  description: "Save designers, track enquiries and manage your Interinest account.",
};

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserSidebarClientWrapper>
      <div className="min-h-screen bg-slate-50">{children}</div>
    </UserSidebarClientWrapper>
  );
}
