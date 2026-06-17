"use client";

import { DesignerHeader as Header } from "@/components/designer/DesignerHeader";
import Link from "next/link";

const ACCENT = "#CAAB06";

export default function DesignerInquiriesPage() {
  const breadcrumbs = [
    { label: "Home", href: "/dashboard/designer-dashboard" },
    { label: "Enquiries" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header pageTitle="Enquiries" breadcrumbs={breadcrumbs} />
      <div className="px-6 py-16 max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: `${ACCENT}18` }}>
            <svg className="w-8 h-8" fill="none" stroke={ACCENT} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">
            Enquiries are managed by Interinest
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            All client enquiries sent through your profile and projects are reviewed
            by the Interinest team. We will connect you with interested clients directly.
            Keep your profile and portfolio up to date to attract more enquiries.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard/designer-dashboard/profile"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: ACCENT }}>
              Update Profile
            </Link>
            <Link href="/dashboard/designer-dashboard/projects/add"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
              Add New Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
