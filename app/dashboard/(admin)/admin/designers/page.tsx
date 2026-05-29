import Desingers from "@/components/admin/Desingers";
import { Header } from "@/components/admin/Header";
import Link from "next/link";

const DesignersPage = () => {
  const breadcrumbs = [
    { label: "Home", href: "/dashboard/admin" },
    { label: "Designers" },
  ];
  return (
    <div className="min-h-screen bg-slate-50">
      <Header pageTitle="Designers" breadcrumbs={breadcrumbs} />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">All Designers</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage and review designer accounts</p>
          </div>
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
        <Desingers showPagination pageSize={10} />
      </div>
    </div>
  );
};

export default DesignersPage;
