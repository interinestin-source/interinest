import AdminStats from "@/components/admin/AdminStats";
import React from "react";
import { Header } from "@/components/admin/Header";
import Desingers from "@/components/admin/Desingers";
import Users from "@/components/admin/Users";
import Projects from "@/components/admin/Projects";
import Link from "next/link";

const AdminPage = () => {
  const breadcrumbs = [
    { label: "Home", href: "/dashboard/admin" },
    { label: "Dashboard" },
  ];
  return (
    <div className="min-h-screen bg-slate-50">
      <Header pageTitle="Admin Dashboard" breadcrumbs={breadcrumbs} />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Welcome, Admin</h2>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/admin/seed"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
              title="Add sample designers and projects"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Seed Demo Data
            </Link>
            <Link
              href="/dashboard/admin/designers/add"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: "#7593b4" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Designer
            </Link>
          </div>
        </div>
        <AdminStats />
        <div className="grid gap-4 lg:grid-cols-2">
          <Desingers recent pageSize={5} />
          <Users recent pageSize={5} />
        </div>
        <div className="mt-4">
          <Projects />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
