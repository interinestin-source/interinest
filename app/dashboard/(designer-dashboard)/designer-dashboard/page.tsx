"use client";

import React, { useEffect, useState } from "react";
import { DesignerHeader } from "@/components/designer/DesignerHeader";
import Stats, { StatItem } from "@/components/dashboard/Stats";
import Link from "next/link";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import {
  FolderPlus,
  LayoutGrid,
  User,
  FolderOpen,
  FileText,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────── */
function getUidFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/uid=([^;]+)/);
  return m ? m[1] : null;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ─── types ───────────────────────────────────────────────── */
type Project = {
  id: string;
  title: string;
  status?: string;
  category?: string;
  imageUrls?: string[];
  location?: string;
  budget?: string;
  createdAt?: any;
};

/* ─── quick action tiles ──────────────────────────────────── */
const quickActions = [
  {
    label: "Add New Project",
    desc: "Upload your latest work",
    href: "/dashboard/designer-dashboard/projects/add",
    icon: FolderPlus,
    primary: true,
  },
  {
    label: "My Projects",
    desc: "Manage all your projects",
    href: "/dashboard/designer-dashboard/projects",
    icon: FolderOpen,
    primary: false,
  },
  {
    label: "Client Enquiries",
    desc: "View messages from clients",
    href: "/dashboard/designer-dashboard/inquiries",
    icon: FileText,
    primary: false,
  },
  {
    label: "My E-Portfolio",
    desc: "View your public profile",
    href: "/dashboard/designer-dashboard/portfolio",
    icon: LayoutGrid,
    primary: false,
  },
  {
    label: "Edit Profile",
    desc: "Update your details",
    href: "/dashboard/designer-dashboard/profile",
    icon: User,
    primary: false,
  },
];

/* ─── page ────────────────────────────────────────────────── */
export default function DesignerDashboard() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Designer Dashboard" },
  ];

  const [designer, setDesigner] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = getUidFromCookie();
    if (!uid) { setLoading(false); return; }

    const load = async () => {
      try {
        // fetch profile
        const profileSnap = await getDoc(doc(db, "designers", uid));
        if (profileSnap.exists()) setDesigner(profileSnap.data());

        // fetch this designer's projects
        const q = query(collection(db, "projects"), where("uid", "==", uid));
        const snap = await getDocs(q);
        const list: Project[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setProjects(list);
      } catch (err) {
        console.error("Dashboard load error", err);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  /* ── derived stats ── */
  const published = projects.filter((p) => p.status === "Published").length;
  const drafts = projects.filter((p) => p.status === "Draft").length;
  const totalImages = projects.reduce(
    (sum, p) => sum + (Array.isArray(p.imageUrls) ? p.imageUrls.length : 0),
    0
  );

  const COLOR = "#7593b4";
  const ACCENT_BG = "#eef2f7";

  const stats: StatItem[] = [
    {
      id: "total",
      title: "Total Projects",
      value: projects.length,
      sub: "All time",
      icon: FolderOpen,
      accent: ACCENT_BG,
      iconColor: COLOR,
      stripe: COLOR,
    },
    {
      id: "published",
      title: "Published",
      value: published,
      sub: "Live on portfolio",
      icon: CheckCircle,
      accent: "#f0fdf4",
      iconColor: "#16a34a",
      stripe: "#16a34a",
    },
    {
      id: "drafts",
      title: "Drafts",
      value: drafts,
      sub: "Not yet published",
      icon: FileText,
      accent: "#f1f5f9",
      iconColor: "#64748b",
      stripe: "#64748b",
    },
    {
      id: "images",
      title: "Portfolio Images",
      value: totalImages,
      sub: "Across all projects",
      icon: ImageIcon,
      accent: "#eff6ff",
      iconColor: "#2563eb",
      stripe: "#2563eb",
    },
  ];

  const name = designer?.fullName || "";
  const photoURL = designer?.photoURL || "";
  const initial = name.charAt(0).toUpperCase() || "D";
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  /* recent projects — last 3 */
  const recent = [...projects]
    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50">
      <DesignerHeader pageTitle="Designer Dashboard" breadcrumbs={breadcrumbs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Welcome banner ─────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl shadow-sm"
          style={{ background: `linear-gradient(135deg, ${COLOR} 0%, #5a7a9e 60%, #4a6a8e 100%)` }}>
          {/* decorative circles */}
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute bottom-0 right-32 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 px-7 py-7">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/40 overflow-hidden flex items-center justify-center flex-shrink-0">
                {photoURL
                  ? <img src={photoURL} alt={name} className="w-full h-full object-cover" />
                  : <span className="text-white text-xl font-bold">{initial}</span>
                }
              </div>
              <div>
                <p className="text-white/75 text-sm">{getGreeting()},</p>
                <h1 className="text-white text-xl font-bold leading-tight">
                  {loading ? "..." : name || "Designer"}
                </h1>
                {designer?.city && (
                  <p className="text-white/60 text-xs mt-0.5">{designer.city}</p>
                )}
                <p className="text-white/50 text-xs mt-0.5">{today}</p>
              </div>
            </div>

            <Link
              href="/dashboard/designer-dashboard/projects/add"
              className="inline-flex items-center gap-2 bg-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition shadow-sm flex-shrink-0"
              style={{ color: "#4a6a8e" }}
            >
              <FolderPlus className="w-4 h-4" />
              Add New Project
            </Link>
          </div>
        </div>

        {/* ── Stats ──────────────────────────────────────── */}
        <Stats stats={stats} loading={loading} />

        {/* ── Quick actions ──────────────────────────────── */}
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`group flex flex-col gap-3 p-5 rounded-2xl border transition hover:shadow-md hover:-translate-y-0.5 ${
                    action.primary
                      ? "border-transparent text-white"
                      : "bg-white border-slate-200 text-slate-800"
                  }`}
                  style={action.primary ? { backgroundColor: COLOR } : {}}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: action.primary ? "rgba(255,255,255,0.2)" : ACCENT_BG }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: action.primary ? "#fff" : COLOR }}
                    />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${action.primary ? "text-white" : "text-slate-800"}`}>
                      {action.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${action.primary ? "text-white/70" : "text-slate-400"}`}>
                      {action.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Recent projects ────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Recent Projects
            </h2>
            <Link
              href="/dashboard/designer-dashboard/projects"
              className="text-xs font-semibold hover:underline"
              style={{ color: COLOR }}
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 h-48 animate-pulse" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: ACCENT_BG }}
              >
                <FolderOpen className="w-7 h-7" style={{ color: COLOR }} />
              </div>
              <p className="text-slate-700 font-medium mb-1">No projects yet</p>
              <p className="text-slate-400 text-sm mb-5">Start building your portfolio by adding your first project.</p>
              <Link
                href="/dashboard/designer-dashboard/projects/add"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition hover:opacity-90"
                style={{ backgroundColor: COLOR }}
              >
                <FolderPlus className="w-4 h-4" />
                Add First Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {recent.map((project) => {
                const thumb = project.imageUrls?.[0];
                const statusColor =
                  project.status === "Published"
                    ? "bg-green-100 text-green-700"
                    : project.status === "Draft"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-500";

                return (
                  <Link
                    key={project.id}
                    href={`/dashboard/designer-dashboard/projects/${project.id}`}
                    className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition block"
                  >
                    <div className="h-36 bg-slate-100 overflow-hidden">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: ACCENT_BG }}
                        >
                          <ImageIcon className="w-8 h-8" style={{ color: COLOR, opacity: 0.5 }} />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">{project.title}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusColor}`}>
                          {project.status || "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        {project.category && <span>{project.category}</span>}
                        {project.location && <span>· {project.location}</span>}
                        {project.budget && <span>· {project.budget}</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
