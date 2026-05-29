import { Header } from "@/components/dashboard/Header";
import AddProject from "@/components/Projects/projects/AddProject";
import React from "react";

const AddProjectPage = () => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Designer Dashboard", href: "/dashboard/designer-dashboard" },
    { label: "Add Project" },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <Header pageTitle="Add Designer Project" breadcrumbs={breadcrumbs} />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-3">
        <AddProject />
      </div>
    </div>
  );
};

export default AddProjectPage;
