"use client";

import React, { useState, useEffect } from "react";
import {
  X, LogOut, Home, Bookmark, MessageSquare, Globe, HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

const ACCENT = "#7593b4";

interface UserSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: "Overview",      path: "/dashboard/user-dashboard",            icon: Home,         exact: true },
  { name: "Saved",         path: "/dashboard/user-dashboard/saved",      icon: Bookmark },
  { name: "My Enquiries",  path: "/dashboard/user-dashboard/inquiries",  icon: MessageSquare },
];

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, onToggle }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* read uid cookie */
  const getUid = () => {
    if (typeof document === "undefined") return null;
    const m = document.cookie.match(/uid=([^;]+)/);
    return m ? m[1] : null;
  };

  useEffect(() => {
    const uid = getUid();
    if (!uid) { setLoading(false); return; }
    getDoc(doc(db, "interinestUsers", uid))
      .then((snap) => { if (snap.exists()) setUser(snap.data()); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    ["uid", "role", "authToken"].forEach((k) => {
      document.cookie = `${k}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    });
    router.push("/");
  };

  const isActive = (path: string, exact?: boolean) =>
    exact ? pathname === path : pathname?.startsWith(path);

  const initial = user?.fullName?.charAt(0)?.toUpperCase()
    || user?.email?.charAt(0)?.toUpperCase()
    || "U";

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">

          {/* ── Logo ── */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
              <Link href="/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-interinest.png"
                  alt="Interinest"
                  style={{ height: 46, width: "auto", display: "block",
                    filter: "contrast(1.3) brightness(1.1)",
                    mixBlendMode: "multiply" }}
                />
              </Link>
            </motion.div>
            <button onClick={onToggle} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* ── User profile ── */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 border-2" style={{ borderColor: `${ACCENT}40` }}>
                <AvatarFallback style={{ background: `${ACCENT}18`, color: ACCENT, fontWeight: 700, fontSize: 16 }}>
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {loading ? "Loading…" : user?.fullName || user?.email || "User"}
                </p>
                <p className="text-xs text-gray-400">User Account</p>
              </div>
            </div>
          </div>

          {/* ── Navigation ── */}
          <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
            <p className="px-3 mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Menu</p>
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => { if (window.innerWidth < 1024) onToggle(); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: active ? `${ACCENT}18` : "transparent",
                    color: active ? ACCENT : "#4b5563",
                    outline: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                >
                  <Icon className="w-4 h-4" strokeWidth={active ? 2.5 : 2} />
                  {item.name}
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />}
                </Link>
              );
            })}
          </nav>

          {/* ── Bottom ── */}
          <div className="p-4 border-t border-gray-100 space-y-1">
            {/* Help card */}
            <div className="rounded-xl p-3 mb-2" style={{ background: `${ACCENT}0d` }}>
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg mt-0.5" style={{ background: ACCENT }}>
                  <HelpCircle className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800 mb-0.5">Need help?</p>
                  <Link href="/contact" className="text-[11px] font-medium" style={{ color: ACCENT }}>
                    Contact support →
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition">
              <Globe className="w-4 h-4" />
              Back to site
            </Link>
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition">
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;
