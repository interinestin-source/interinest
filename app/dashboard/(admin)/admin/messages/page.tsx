"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Header } from "@/components/admin/Header";
import { toast } from "sonner";

const ACCENT = "#7593b4";

type Message = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt?: { seconds: number };
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new: { bg: "#dcfce7", text: "#16a34a" },
  read: { bg: "#f1f5f9", text: "#64748b" },
  replied: { bg: "#dbeafe", text: "#2563eb" },
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message)));
    } catch (e) {
      console.error(e);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const markAs = async (id: string, status: Message["status"]) => {
    try {
      await updateDoc(doc(db, "contactMessages", id), { status });
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status } : m));
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const formatDate = (ts?: { seconds: number }) => {
    if (!ts) return "—";
    return new Date(ts.seconds * 1000).toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const newCount = messages.filter((m) => m.status === "new").length;

  const breadcrumbs = [
    { label: "Home", href: "/dashboard/admin" },
    { label: "Contact Messages" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header pageTitle="Contact Messages" breadcrumbs={breadcrumbs} />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-800">All Messages</h2>
            {newCount > 0 && (
              <span className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: ACCENT }}>
                {newCount} new
              </span>
            )}
          </div>
          <button onClick={load} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-slate-400">
                <svg className="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading…
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">No messages yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {messages.map((msg) => {
                  const sc = STATUS_COLORS[msg.status] ?? STATUS_COLORS.read;
                  const isActive = selected?.id === msg.id;
                  return (
                    <button
                      key={msg.id}
                      onClick={() => setSelected(msg)}
                      className="w-full text-left px-5 py-4 hover:bg-slate-50 transition"
                      style={{ background: isActive ? "#f0f5fa" : undefined }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-semibold text-slate-800 truncate">{msg.name}</span>
                            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold flex-shrink-0"
                              style={{ background: sc.bg, color: sc.text }}>
                              {msg.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate mb-1">{msg.email}{msg.service ? ` · ${msg.service}` : ""}</p>
                          <p className="text-xs text-slate-400 line-clamp-1">{msg.message}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5">{formatDate(msg.createdAt)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden self-start sticky top-6">
              <div className="h-1.5 w-full" style={{ backgroundColor: ACCENT }} />
              <div className="px-6 py-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">{selected.name}</h3>
                    <a href={`mailto:${selected.email}`} className="text-xs text-blue-500 hover:underline">{selected.email}</a>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Meta rows */}
                <div className="space-y-2 mb-5">
                  {selected.phone && (
                    <div className="flex gap-3 text-xs">
                      <span className="w-16 text-slate-400 flex-shrink-0">Phone</span>
                      <span className="text-slate-700">{selected.phone}</span>
                    </div>
                  )}
                  {selected.service && (
                    <div className="flex gap-3 text-xs">
                      <span className="w-16 text-slate-400 flex-shrink-0">Service</span>
                      <span className="text-slate-700">{selected.service}</span>
                    </div>
                  )}
                  <div className="flex gap-3 text-xs">
                    <span className="w-16 text-slate-400 flex-shrink-0">Received</span>
                    <span className="text-slate-700">{formatDate(selected.createdAt)}</span>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className="w-16 text-slate-400 flex-shrink-0">Status</span>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ background: STATUS_COLORS[selected.status]?.bg, color: STATUS_COLORS[selected.status]?.text }}>
                      {selected.status}
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 mb-5">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`mailto:${selected.email}?subject=Re: Your enquiry on Interinest`}
                    onClick={() => markAs(selected.id, "replied")}
                    className="inline-flex items-center gap-1.5 h-9 rounded-xl px-4 text-xs font-semibold text-white transition hover:opacity-90"
                    style={{ backgroundColor: ACCENT }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Reply by Email
                  </a>
                  {selected.status !== "read" && (
                    <button onClick={() => markAs(selected.id, "read")}
                      className="inline-flex items-center gap-1.5 h-9 rounded-xl px-4 text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                      Mark as Read
                    </button>
                  )}
                  {selected.status !== "new" && (
                    <button onClick={() => markAs(selected.id, "new")}
                      className="inline-flex items-center gap-1.5 h-9 rounded-xl px-4 text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                      Mark as New
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex bg-white rounded-2xl border border-slate-200 shadow-sm items-center justify-center py-20 text-slate-400 self-start">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-xs">Click a message to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
