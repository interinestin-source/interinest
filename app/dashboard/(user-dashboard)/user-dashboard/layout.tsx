"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, MessageSquare, Home, Globe } from "lucide-react";

const ACCENT = "#7593b4";

const NAV = [
  { href: "/dashboard/user-dashboard", label: "Overview", icon: Home, exact: true },
  { href: "/dashboard/user-dashboard/saved", label: "Saved", icon: Bookmark },
  { href: "/dashboard/user-dashboard/inquiries", label: "My Enquiries", icon: MessageSquare },
];

function logout() {
  ["uid", "role", "authToken"].forEach((k) => {
    document.cookie = `${k}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  });
  window.location.href = "/";
}

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Sidebar ── */}
      <aside
        className="w-56 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col fixed h-full z-20"
        style={{ boxShadow: "2px 0 12px rgba(0,0,0,0.04)" }}
      >
        {/* Brand */}
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-slate-100">
          <Link href="/" className="text-base font-bold" style={{ color: ACCENT }}>
            Interinest
          </Link>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">User</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? `${ACCENT}18` : "transparent",
                  color: active ? ACCENT : "#64748b",
                }}
              >
                <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-slate-100 space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-slate-50 transition"
          >
            <Globe size={15} />
            Back to site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log out
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <main className="ml-56 flex-1 min-h-screen">{children}</main>
    </div>
  );
}
