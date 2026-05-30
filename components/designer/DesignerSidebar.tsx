"use client";

import React, { useState, useEffect } from "react";
import {
  X, LogOut, Home, FolderOpen, MessageSquare, LayoutGrid, User, Globe, HelpCircle, FolderPlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

const ACCENT = "#CAAB06";
const ACCENT_BG = "#faf6e6";

interface DesignerSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: "Overview",      path: "/dashboard/designer-dashboard",              icon: Home,         exact: true },
  { name: "Projects",      path: "/dashboard/designer-dashboard/projects",     icon: FolderOpen,   exact: true },
  { name: "Add Project",   path: "/dashboard/designer-dashboard/projects/add", icon: FolderPlus,   exact: true },
  { name: "Enquiries",     path: "/dashboard/designer-dashboard/inquiries",    icon: MessageSquare, exact: false },
  { name: "My Portfolio",  path: "/dashboard/designer-dashboard/portfolio",    icon: LayoutGrid,   exact: false },
  { name: "Edit Profile",  path: "/dashboard/designer-dashboard/profile",      icon: User,         exact: false },
];

const DesignerSidebar: React.FC<DesignerSidebarProps> = ({ isOpen, onToggle }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [designer, setDesigner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getUid = () => {
    if (typeof document === "undefined") return null;
    const m = document.cookie.match(/uid=([^;]+)/);
    return m ? m[1] : null;
  };

  useEffect(() => {
    const uid = getUid();
    if (!uid) { setLoading(false); return; }
    // Try interinestUsers first, fall back to designers collection
    getDoc(doc(db, "interinestUsers", uid))
      .then((snap) => {
        if (snap.exists()) setDesigner(snap.data());
        else return getDoc(doc(db, "designers", uid)).then(s => { if (s.exists()) setDesigner(s.data()); });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    ["uid", "role", "authToken"].forEach((k) => {
      document.cookie = `${k}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    });
    router.push("/");
  };

  const isActive = (path: string, exact?: boolean) => {
    if (!pathname) return false;
    if (exact) return pathname === path;
    return pathname.startsWith(path);
  };

  const initial = designer?.fullName?.charAt(0)?.toUpperCase() || "D";

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onToggle} />
      )}

      <aside className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">

          {/* ── Logo ── */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
              <Link href="/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-interinest.png"
                  alt="Interinest"
                  style={{ height: 46, width: "auto", display: "block",
                    filter: "contrast(1.3) brightness(1.1)", mixBlendMode: "multiply" }}
                />
              </Link>
            </motion.div>
            <button onClick={onToggle} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* ── Designer profile ── */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 border-2" style={{ borderColor: `${ACCENT}60` }}>
                {designer?.photoURL && <AvatarImage src={designer.photoURL} alt={designer.fullName} />}
                <AvatarFallback style={{ background: ACCENT_BG, color: ACCENT, fontWeight: 700, fontSize: 16 }}>
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {loading ? "Loading…" : designer?.fullName || "Designer"}
                </p>
                <p className="text-xs text-gray-400">
                  {designer?.city ? `${designer.city} · ` : ""}Interior Designer
                </p>
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
                    background: active ? ACCENT_BG : "transparent",
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
          <div className="p-4 border-t border-gray-100 space-y-0.5">
            <div className="rounded-xl p-3 mb-2" style={{ background: ACCENT_BG }}>
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

export default DesignerSidebar;
