import React from "react";
import DesignerProfile from "@/components/profile/DesignerProfile";
import { Header } from "@/components/dashboard/Header";

export default function DesignerProfilePage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Designer Dashboard", href: "/dashboard/designer-dashboard" },
    { label: "Profile" },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <Header pageTitle="Designer Profile" breadcrumbs={breadcrumbs} />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-3">
        <DesignerProfile />
      </div>
    </div>
  );
}
