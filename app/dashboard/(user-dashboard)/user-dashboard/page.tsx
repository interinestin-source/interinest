"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from "firebase/firestore";
import Link from "next/link";

const ACCENT = "#7593b4";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`${name}=([^;]+)`));
  return m ? m[1] : null;
}

function fmt(ts?: { seconds: number }) {
  if (!ts) return "";
  return new Date(ts.seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function UserDashboardPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ designers: 0, projects: 0, inquiries: 0 });
  const [recentDesigners, setRecentDesigners] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookieUid = getCookie("uid");
    if (!cookieUid) { window.location.href = "/dashboard/login"; return; }
    setUid(cookieUid);

    const load = async () => {
      const [userSnap, dSnap, pSnap, iSnap] = await Promise.all([
        getDoc(doc(db, "interinestUsers", cookieUid)),
        getDocs(query(collection(db, "savedDesigners"), where("userId", "==", cookieUid), orderBy("savedAt", "desc"), limit(3))),
        getDocs(query(collection(db, "savedProjects"), where("userId", "==", cookieUid), orderBy("savedAt", "desc"), limit(3))),
        getDocs(query(collection(db, "inquiries"), where("userId", "==", cookieUid), orderBy("createdAt", "desc"), limit(3))),
      ]);

      if (userSnap.exists()) setUser(userSnap.data());

      const dAll = await getDocs(query(collection(db, "savedDesigners"), where("userId", "==", cookieUid)));
      const pAll = await getDocs(query(collection(db, "savedProjects"), where("userId", "==", cookieUid)));
      const iAll = await getDocs(query(collection(db, "inquiries"), where("userId", "==", cookieUid)));

      setStats({ designers: dAll.size, projects: pAll.size, inquiries: iAll.size });
      setRecentDesigners(dSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setRecentProjects(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setRecentInquiries(iSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };

    load().catch(console.error);
  }, []);

  const initial = user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U";

  const STATS = [
    { label: "Saved Designers", value: stats.designers, href: "/dashboard/user-dashboard/saved?tab=designers", color: "#7593b4" },
    { label: "Saved Projects", value: stats.projects, href: "/dashboard/user-dashboard/saved?tab=projects", color: "#6c9e7a" },
    { label: "Sent Enquiries", value: stats.inquiries, href: "/dashboard/user-dashboard/inquiries", color: "#c49a3c" },
  ];

  return (
    <div className="px-6 py-8 max-w-5xl">
      {/* Welcome banner */}
      <div className="rounded-2xl overflow-hidden mb-8" style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #a3bcd4 100%)` }}>
        <div className="px-8 py-7 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {initial}
          </div>
          <div>
            <p className="text-white/70 text-sm mb-0.5">Welcome back</p>
            <h1 className="text-white text-xl font-bold">{user?.fullName || user?.email || "User"}</h1>
            <p className="text-white/70 text-xs mt-1">Discover designers, save your favourites and track your enquiries.</p>
          </div>
          <div className="ml-auto hidden md:flex gap-3">
            <Link href="/designers" className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium px-4 py-2 rounded-xl transition">
              Browse Designers
            </Link>
            <Link href="/projects" className="inline-flex items-center gap-2 bg-white text-sm font-semibold px-4 py-2 rounded-xl transition" style={{ color: ACCENT }}>
              View Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {STATS.map(s => (
          <Link key={s.label} href={s.href} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition block" style={{ textDecoration: "none" }}>
            <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center" style={{ background: `${s.color}18` }}>
              <div className="w-4 h-4 rounded-full" style={{ background: s.color }} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{loading ? "—" : s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent saved designers */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h2 className="text-sm font-semibold text-slate-800">Saved Designers</h2>
            <Link href="/dashboard/user-dashboard/saved?tab=designers" className="text-xs font-medium" style={{ color: ACCENT }}>View all →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {loading ? (
              <p className="text-xs text-slate-400 p-5">Loading…</p>
            ) : recentDesigners.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-xs text-slate-400 mb-3">No saved designers yet.</p>
                <Link href="/designers" className="text-xs font-semibold" style={{ color: ACCENT }}>Browse Designers →</Link>
              </div>
            ) : recentDesigners.map(d => (
              <Link key={d.id} href={`/designers/${d.designerId}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition" style={{ textDecoration: "none" }}>
                <div className="w-9 h-9 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center text-sm font-bold" style={{ background: `${ACCENT}18`, color: ACCENT }}>
                  {d.designerPhoto ? <img src={d.designerPhoto} alt={d.designerName} className="w-full h-full object-cover" /> : d.designerName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{d.designerName}</p>
                  <p className="text-xs text-slate-400 truncate">{d.designerCity}</p>
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0">{fmt(d.savedAt)}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent saved projects */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h2 className="text-sm font-semibold text-slate-800">Saved Projects</h2>
            <Link href="/dashboard/user-dashboard/saved?tab=projects" className="text-xs font-medium" style={{ color: ACCENT }}>View all →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {loading ? (
              <p className="text-xs text-slate-400 p-5">Loading…</p>
            ) : recentProjects.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-xs text-slate-400 mb-3">No saved projects yet.</p>
                <Link href="/projects" className="text-xs font-semibold" style={{ color: ACCENT }}>Browse Projects →</Link>
              </div>
            ) : recentProjects.map(p => (
              <Link key={p.id} href={`/projects/${p.projectId}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition" style={{ textDecoration: "none" }}>
                <div className="w-12 h-9 rounded-lg flex-shrink-0 overflow-hidden bg-slate-100">
                  {p.projectImage && <img src={p.projectImage} alt={p.projectTitle} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{p.projectTitle}</p>
                  <p className="text-xs text-slate-400 truncate">{p.projectCategory}{p.projectLocation ? ` · ${p.projectLocation}` : ""}</p>
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0">{fmt(p.savedAt)}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent enquiries */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h2 className="text-sm font-semibold text-slate-800">Recent Enquiries</h2>
            <Link href="/dashboard/user-dashboard/inquiries" className="text-xs font-medium" style={{ color: ACCENT }}>View all →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {loading ? (
              <p className="text-xs text-slate-400 p-5">Loading…</p>
            ) : recentInquiries.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-xs text-slate-400 mb-3">No enquiries sent yet. Visit a designer&apos;s profile to send one.</p>
                <Link href="/designers" className="text-xs font-semibold" style={{ color: ACCENT }}>Browse Designers →</Link>
              </div>
            ) : recentInquiries.map(inq => (
              <div key={inq.id} className="px-5 py-3.5 flex items-start gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-800">{inq.designerName}</p>
                  {inq.subject && <p className="text-xs text-slate-500 mt-0.5">{inq.subject}</p>}
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{inq.message}</p>
                </div>
                <div className="ml-auto flex-shrink-0 flex flex-col items-end gap-1">
                  <span className="text-[10px] text-slate-400">{fmt(inq.createdAt)}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: inq.status === "replied" ? "#dbeafe" : inq.status === "read" ? "#f1f5f9" : "#dcfce7",
                      color: inq.status === "replied" ? "#2563eb" : inq.status === "read" ? "#64748b" : "#16a34a"
                    }}>
                    {inq.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
