"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, doc, updateDoc, query, where, orderBy } from "firebase/firestore";
import { DesignerHeader as Header } from "@/components/designer/DesignerHeader";
import { toast } from "sonner";

const ACCENT = "#CAAB06";

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  new:     { bg: "#dcfce7", text: "#16a34a" },
  read:    { bg: "#f1f5f9", text: "#64748b" },
  replied: { bg: "#fef9c3", text: "#a16207" },
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`${name}=([^;]+)`));
  return m ? m[1] : null;
}

function fmt(ts?: { seconds: number }) {
  if (!ts) return "—";
  return new Date(ts.seconds * 1000).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function DesignerInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    const uid = getCookie("uid");
    if (!uid) return;

    getDocs(query(collection(db, "inquiries"), where("designerId", "==", uid), orderBy("createdAt", "desc")))
      .then(snap => setInquiries(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const markStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "inquiries", id), { status });
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
      if (selected?.id === id) setSelected((p: any) => ({ ...p, status }));
      toast.success(`Marked as ${status}`);
    } catch { toast.error("Failed to update"); }
  };

  const newCount = inquiries.filter(i => i.status === "new").length;

  const breadcrumbs = [
    { label: "Home", href: "/dashboard/designer-dashboard" },
    { label: "Enquiries" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header pageTitle="Enquiries" breadcrumbs={breadcrumbs} />
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Client Enquiries</h2>
          {newCount > 0 && (
            <span className="text-xs font-bold text-white px-2.5 py-0.5 rounded-full" style={{ background: ACCENT }}>
              {newCount} new
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Loading…</div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-slate-400">No enquiries yet. Keep your profile updated to attract clients.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            {/* List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden self-start">
              <div className="divide-y divide-slate-50">
                {inquiries.map(inq => {
                  const s = STATUS_STYLE[inq.status] ?? STATUS_STYLE.new;
                  const active = selected?.id === inq.id;
                  return (
                    <button key={inq.id} onClick={() => { setSelected(inq); if (inq.status === "new") markStatus(inq.id, "read"); }}
                      className="w-full text-left px-5 py-4 hover:bg-slate-50 transition"
                      style={{ background: active ? "#fffbeb" : undefined }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {inq.status === "new" && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#16a34a" }} />}
                            <span className="text-sm font-semibold text-slate-800 truncate">Client Enquiry</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                              style={{ background: s.bg, color: s.text }}>{inq.status}</span>
                          </div>
                          {inq.subject && <p className="text-xs text-slate-500 mb-0.5">{inq.subject}</p>}
                          {inq.budget && <p className="text-xs text-slate-400 mb-0.5">Budget: {inq.budget}</p>}
                          <p className="text-xs text-slate-400 line-clamp-1">{inq.message}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5">{fmt(inq.createdAt)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detail */}
            {selected ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden self-start sticky top-6">
                <div className="h-1.5 w-full" style={{ background: ACCENT }} />
                <div className="p-5">
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Client Enquiry</p>
                      {selected.subject && <p className="text-xs text-slate-500 mt-0.5">{selected.subject}</p>}
                    </div>
                    <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-2 text-xs mb-4">
                    <div className="flex gap-3">
                      <span className="w-16 text-slate-400 flex-shrink-0">Received</span>
                      <span className="text-slate-700">{fmt(selected.createdAt)}</span>
                    </div>
                    {selected.budget && (
                      <div className="flex gap-3">
                        <span className="w-16 text-slate-400 flex-shrink-0">Budget</span>
                        <span className="text-slate-700">{selected.budget}</span>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <span className="w-16 text-slate-400 flex-shrink-0">Status</span>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ background: STATUS_STYLE[selected.status]?.bg, color: STATUS_STYLE[selected.status]?.text }}>
                        {selected.status}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                  </div>

                  <div className="flex gap-2">
                    {selected.status !== "replied" && (
                      <button onClick={() => markStatus(selected.id, "replied")}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition hover:opacity-90"
                        style={{ background: ACCENT }}>
                        Mark Replied
                      </button>
                    )}
                    {selected.status !== "new" && (
                      <button onClick={() => markStatus(selected.id, "new")}
                        className="flex-1 py-2 rounded-xl text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                        Mark New
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex bg-white rounded-2xl border border-slate-200 shadow-sm items-center justify-center py-16 text-slate-300 self-start">
                <p className="text-xs">Click an enquiry to view</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
