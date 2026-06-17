"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { Header } from "@/components/admin/Header";
import { toast } from "sonner";

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  new:     { bg: "#dcfce7", text: "#16a34a" },
  read:    { bg: "#f1f5f9", text: "#64748b" },
  replied: { bg: "#fef9c3", text: "#a16207" },
};

const TYPE_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  designer_enquiry: { bg: "#eff6ff", text: "#2563eb", label: "Designer" },
  project_interest: { bg: "#fdf4ff", text: "#7c3aed", label: "Project" },
};

function fmt(ts?: { seconds: number }) {
  if (!ts) return "—";
  return new Date(ts.seconds * 1000).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "replied">("all");

  useEffect(() => {
    getDocs(query(collection(db, "inquiries"), orderBy("createdAt", "desc")))
      .then(snap => setEnquiries(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const markStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "inquiries", id), { status });
      setEnquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
      if (selected?.id === id) setSelected((p: any) => ({ ...p, status }));
      toast.success(`Marked as ${status}`);
    } catch { toast.error("Failed to update"); }
  };

  const filtered = filter === "all" ? enquiries : enquiries.filter(i => i.status === filter);
  const newCount = enquiries.filter(i => i.status === "new").length;

  const breadcrumbs = [
    { label: "Home", href: "/dashboard/admin" },
    { label: "Enquiries" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header pageTitle="Enquiries" breadcrumbs={breadcrumbs} />

      <div className="px-6 py-8 max-w-6xl mx-auto">

        {/* ── Header row ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-800">All Client Enquiries</h2>
            {newCount > 0 && (
              <span className="text-xs font-bold text-white px-2.5 py-0.5 rounded-full bg-green-500">
                {newCount} new
              </span>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
            {(["all", "new", "read", "replied"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition"
                style={{
                  background: filter === f ? "#7593b4" : "transparent",
                  color: filter === f ? "#fff" : "#64748b",
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-slate-400">No enquiries found.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">

            {/* ── List ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden self-start">
              <div className="divide-y divide-slate-50">
                {filtered.map(inq => {
                  const s = STATUS_STYLE[inq.status] ?? STATUS_STYLE.new;
                  const t = TYPE_STYLE[inq.type] ?? TYPE_STYLE.designer_enquiry;
                  const active = selected?.id === inq.id;
                  return (
                    <button key={inq.id}
                      onClick={() => { setSelected(inq); if (inq.status === "new") markStatus(inq.id, "read"); }}
                      className="w-full text-left px-5 py-4 hover:bg-slate-50 transition"
                      style={{ background: active ? "#eff6ff" : undefined }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {inq.status === "new" && <span className="w-2 h-2 rounded-full flex-shrink-0 bg-green-500" />}
                            <span className="text-sm font-semibold text-slate-800 truncate">
                              {inq.userName || "Unknown"}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                              style={{ background: t.bg, color: t.text }}>{t.label}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                              style={{ background: s.bg, color: s.text }}>{inq.status}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-0.5">
                            {inq.type === "designer_enquiry" ? `Designer: ${inq.designerName || "—"}` : `Project: ${inq.projectName || "—"}`}
                          </p>
                          {inq.subject && <p className="text-xs text-slate-400 mb-0.5">{inq.subject}</p>}
                          <p className="text-xs text-slate-400 line-clamp-1">{inq.message}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5">{fmt(inq.createdAt)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Detail panel ── */}
            {selected ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden self-start sticky top-6">
                <div className="h-1.5 w-full bg-[#7593b4]" />
                <div className="p-5">
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {selected.type === "designer_enquiry" ? "Designer Enquiry" : "Project Interest"}
                      </p>
                      {selected.subject && <p className="text-xs text-slate-500 mt-0.5">{selected.subject}</p>}
                    </div>
                    <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Client info */}
                  <div className="rounded-xl p-4 mb-4" style={{ background: "#f8fafc" }}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Client Details</p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex gap-3">
                        <span className="w-14 text-slate-400 flex-shrink-0">Name</span>
                        <span className="text-slate-700 font-medium">{selected.userName || "—"}</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-14 text-slate-400 flex-shrink-0">Email</span>
                        <a href={`mailto:${selected.userEmail}`} className="text-blue-600 hover:underline truncate">{selected.userEmail || "—"}</a>
                      </div>
                      {selected.userPhone && (
                        <div className="flex gap-3">
                          <span className="w-14 text-slate-400 flex-shrink-0">Phone</span>
                          <span className="text-slate-700">{selected.userPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enquiry target */}
                  <div className="rounded-xl p-4 mb-4 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {selected.type === "designer_enquiry" ? "Designer" : "Project"}
                    </p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex gap-3">
                        <span className="w-14 text-slate-400 flex-shrink-0">
                          {selected.type === "designer_enquiry" ? "Designer" : "Project"}
                        </span>
                        <span className="text-slate-700 font-medium">
                          {selected.type === "designer_enquiry" ? (selected.designerName || "—") : (selected.projectName || "—")}
                        </span>
                      </div>
                      {selected.budget && (
                        <div className="flex gap-3">
                          <span className="w-14 text-slate-400 flex-shrink-0">Budget</span>
                          <span className="text-slate-700">{selected.budget}</span>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <span className="w-14 text-slate-400 flex-shrink-0">Received</span>
                        <span className="text-slate-700">{fmt(selected.createdAt)}</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-14 text-slate-400 flex-shrink-0">Status</span>
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{ background: STATUS_STYLE[selected.status]?.bg, color: STATUS_STYLE[selected.status]?.text }}>
                          {selected.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Message</p>
                    <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mb-3">
                    {selected.status !== "replied" && (
                      <button onClick={() => markStatus(selected.id, "replied")}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition hover:opacity-90 bg-[#7593b4]">
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

                  {selected.userEmail && (
                    <a href={`mailto:${selected.userEmail}?subject=Re: ${encodeURIComponent(selected.subject || "Your Enquiry on Interinest")}`}
                      className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Reply by Email
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex bg-white rounded-2xl border border-slate-200 shadow-sm items-center justify-center py-16 text-slate-300 self-start">
                <p className="text-xs">Click an enquiry to view details</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
