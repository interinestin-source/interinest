"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, deleteDoc, doc, query, where, orderBy } from "firebase/firestore";
import Link from "next/link";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ACCENT = "#7593b4";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`${name}=([^;]+)`));
  return m ? m[1] : null;
}

function SavedContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") === "projects" ? "projects" : "designers";
  const [tab, setTab] = useState<"designers" | "projects">(defaultTab as any);
  const [uid, setUid] = useState<string | null>(null);
  const [designers, setDesigners] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookieUid = getCookie("uid");
    if (!cookieUid) { window.location.href = "/dashboard/login"; return; }
    setUid(cookieUid);

    const load = async () => {
      const [dSnap, pSnap] = await Promise.all([
        getDocs(query(collection(db, "savedDesigners"), where("userId", "==", cookieUid), orderBy("savedAt", "desc"))),
        getDocs(query(collection(db, "savedProjects"), where("userId", "==", cookieUid), orderBy("savedAt", "desc"))),
      ]);
      setDesigners(dSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setProjects(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    load().catch(console.error);
  }, []);

  const removeDesigner = async (docId: string) => {
    try {
      await deleteDoc(doc(db, "savedDesigners", docId));
      setDesigners(prev => prev.filter(d => d.id !== docId));
      toast.success("Removed from saved");
    } catch { toast.error("Failed to remove"); }
  };

  const removeProject = async (docId: string) => {
    try {
      await deleteDoc(doc(db, "savedProjects", docId));
      setProjects(prev => prev.filter(p => p.id !== docId));
      toast.success("Removed from saved");
    } catch { toast.error("Failed to remove"); }
  };

  return (
    <div className="px-6 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Saved</h1>
        <p className="text-sm text-slate-500 mt-1">Designers and projects you&apos;ve bookmarked.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        {(["designers", "projects"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2 rounded-lg text-sm font-medium transition"
            style={{ background: tab === t ? "#fff" : "transparent", color: tab === t ? ACCENT : "#64748b", boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
            {t === "designers" ? `Designers (${designers.length})` : `Projects (${projects.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Loading…</div>
      ) : tab === "designers" ? (
        designers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm mb-4">No saved designers yet.</p>
            <Link href="/designers" className="text-sm font-semibold" style={{ color: ACCENT }}>Browse Designers →</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {designers.map(d => (
              <div key={d.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-20 relative" style={{ background: `linear-gradient(135deg, ${ACCENT}33 0%, ${ACCENT}18 100%)` }}>
                  <button onClick={() => removeDesigner(d.id)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-red-400 hover:bg-red-50 transition"
                    title="Remove">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="px-5 pb-5" style={{ marginTop: -28 }}>
                  <div className="w-14 h-14 rounded-xl border-2 border-white overflow-hidden flex items-center justify-center text-lg font-bold mb-3"
                    style={{ background: `${ACCENT}18`, color: ACCENT, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    {d.designerPhoto
                      ? <img src={d.designerPhoto} alt={d.designerName} className="w-full h-full object-cover" />
                      : d.designerName?.charAt(0)}
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mb-0.5">{d.designerName}</p>
                  <p className="text-xs text-slate-400 mb-4">{d.designerCity}</p>
                  <Link href={`/designers/${d.designerId}`}
                    className="block text-center text-xs font-semibold py-2 rounded-xl text-white transition hover:opacity-90"
                    style={{ background: ACCENT }}>
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm mb-4">No saved projects yet.</p>
            <Link href="/projects" className="text-sm font-semibold" style={{ color: ACCENT }}>Browse Projects →</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="relative h-40 bg-slate-100">
                  {p.projectImage && <img src={p.projectImage} alt={p.projectTitle} className="w-full h-full object-cover" />}
                  <button onClick={() => removeProject(p.id)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-red-400 hover:bg-red-50 transition"
                    title="Remove">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {p.projectCategory && (
                    <span className="absolute bottom-2 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 text-slate-600">{p.projectCategory}</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-slate-800 mb-0.5 truncate">{p.projectTitle}</p>
                  {p.projectLocation && <p className="text-xs text-slate-400 mb-3">{p.projectLocation}</p>}
                  <Link href={`/projects/${p.projectId}`}
                    className="block text-center text-xs font-semibold py-2 rounded-xl text-white transition hover:opacity-90"
                    style={{ background: ACCENT }}>
                    View Project
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default function SavedPage() {
  return (
    <Suspense>
      <SavedContent />
    </Suspense>
  );
}
