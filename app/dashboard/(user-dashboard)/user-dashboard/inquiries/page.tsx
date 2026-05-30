"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import Link from "next/link";

const ACCENT = "#7593b4";

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  new:     { bg: "#dcfce7", text: "#16a34a", label: "Pending" },
  read:    { bg: "#f1f5f9", text: "#64748b", label: "Seen" },
  replied: { bg: "#dbeafe", text: "#2563eb", label: "Replied" },
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`${name}=([^;]+)`));
  return m ? m[1] : null;
}

function fmt(ts?: { seconds: number }) {
  if (!ts) return "—";
  return new Date(ts.seconds * 1000).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    const uid = getCookie("uid");
    if (!uid) { window.location.href = "/dashboard/login"; return; }

    getDocs(query(collection(db, "inquiries"), where("userId", "==", uid), orderBy("createdAt", "desc")))
      .then(snap => setInquiries(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-6 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">My Enquiries</h1>
        <p className="text-sm text-slate-500 mt-1">Track the enquiries you&apos;ve sent to designers.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Loading…</div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-sm text-slate-400 mb-4">No enquiries sent yet.</p>
          <Link href="/designers" className="text-sm font-semibold" style={{ color: ACCENT }}>Browse Designers to Enquire →</Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden self-start">
            <div className="divide-y divide-slate-50">
              {inquiries.map(inq => {
                const s = STATUS_STYLE[inq.status] ?? STATUS_STYLE.new;
                const active = selected?.id === inq.id;
                return (
                  <button key={inq.id} onClick={() => setSelected(inq)}
                    className="w-full text-left px-5 py-4 hover:bg-slate-50 transition"
                    style={{ background: active ? "#f0f5fa" : undefined }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-800">{inq.designerName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                            style={{ background: s.bg, color: s.text }}>{s.label}</span>
                        </div>
                        {inq.subject && <p className="text-xs text-slate-500 mb-0.5">{inq.subject}</p>}
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
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden self-start sticky top-6">
              <div className="h-1.5" style={{ background: ACCENT }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{selected.designerName}</p>
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
                    <span className="w-16 text-slate-400 flex-shrink-0">Sent</span>
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
                      style={{ background: (STATUS_STYLE[selected.status] ?? STATUS_STYLE.new).bg, color: (STATUS_STYLE[selected.status] ?? STATUS_STYLE.new).text }}>
                      {(STATUS_STYLE[selected.status] ?? STATUS_STYLE.new).label}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                </div>

                <Link href={`/designers/${selected.designerId}`}
                  className="flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl text-white transition hover:opacity-90"
                  style={{ background: ACCENT }}>
                  View Designer Profile →
                </Link>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex bg-white rounded-2xl border border-slate-100 shadow-sm items-center justify-center py-16 text-slate-300 self-start">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-xs">Select an enquiry to view</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
