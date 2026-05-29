"use client";

import { FormEvent, useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Header } from "@/components/admin/Header";
import { auth, db, storage } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FirebaseError } from "firebase/app";

/* ── constants ─────────────────────────────────────────────── */
const ACCENT = "#7593b4";
const ACCENT_BG = "#eef2f7";

const ROLE_OPTIONS = [
  { label: "Solo Interior Designer", value: "solo" },
  { label: "Design Studio / Firm", value: "studio" },
  { label: "Interior Design Student / Fresher", value: "student" },
];
const SERVICE_OPTIONS = [
  "Full Home Interior Design",
  "Kitchen Design",
  "Living Room / Bedroom Styling",
  "Commercial / Office Interiors",
  "Cafe / Restaurant Interiors",
  "Consultation Only",
];
const STYLE_OPTIONS = [
  "Modern", "Minimalist", "Contemporary", "Traditional",
  "Industrial", "Budget Homes", "Luxury Spaces",
];
const BUDGET_OPTIONS = [
  { label: "Below ₹1 Lakhs", value: "below1" },
  { label: "Under ₹5 Lakhs", value: "under5" },
  { label: "₹5–10 Lakhs", value: "5-10" },
  { label: "₹10–20 Lakhs", value: "10-20" },
  { label: "₹20 Lakhs+", value: "20+" },
  { label: "Depends on project", value: "depends" },
];
const LEAD_OPTIONS = [
  { label: "Yes", value: "yes" },
  { label: "Yes, but selectively", value: "yes-selectively" },
  { label: "Not right now", value: "not-now" },
];

/* ── shared input class ────────────────────────────────────── */
const IC = "h-10 rounded-xl border-slate-200 bg-slate-50 text-sm focus-visible:ring-[#7593b4]";
const SC = "h-10 rounded-xl border-slate-200 bg-slate-50 text-sm";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="h-px flex-1 bg-slate-100" />
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
        {children}
      </h3>
      <span className="h-px flex-1 bg-slate-100" />
    </div>
  );
}

/* ── page ──────────────────────────────────────────────────── */
export default function AddDesignerPage() {
  const [loading, setLoading] = useState(false);
  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  /** Tracks which button triggered submit: 'navigate' → go to list, 'addAnother' → reset & stay */
  const intentRef = useRef<"navigate" | "addAnother">("navigate");
  const router = useRouter();

  const MAX_FILES = 5;
  const MIN_FILES = 2;
  const MAX_SIZE = 10 * 1024 * 1024;

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    setFileError(null);
    const next = [...projectImages];
    for (const f of Array.from(files)) {
      if (next.length >= MAX_FILES) break;
      if (!f.type.startsWith("image/")) {
        const msg = "Only image files are allowed.";
        setFileError(msg); toast.error(msg); continue;
      }
      if (f.size > MAX_SIZE) {
        const msg = `"${f.name}" exceeds 10 MB.`;
        setFileError(msg); toast.error(msg); continue;
      }
      if (!next.some((e) => e.name === f.name && e.size === f.size)) next.push(f);
    }
    setProjectImages(next);
  };

  const removeFile = (i: number) =>
    setProjectImages((prev) => prev.filter((_, idx) => idx !== i));

  const uploadImages = async (uid: string) => {
    const urls: string[] = [];
    for (const file of projectImages) {
      const storageRef = ref(storage, `designers/${uid}/${crypto.randomUUID()}-${file.name}`);
      await uploadBytes(storageRef, file, { contentType: file.type || "image/*", cacheControl: "public,max-age=3600" });
      urls.push(await getDownloadURL(storageRef));
    }
    return urls;
  };

  const getErrorMsg = (err: unknown) => {
    if (err instanceof FirebaseError) {
      const map: Record<string, string> = {
        "auth/email-already-in-use": "This email is already registered.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/operation-not-allowed": "Email/password sign-up is disabled.",
      };
      return map[err.code] ?? "Registration failed. Please try again.";
    }
    return "Registration failed. Please try again.";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFileError(null);

    if (projectImages.length < MIN_FILES || projectImages.length > MAX_FILES) {
      const msg = "Please upload 2–5 images (max 10 MB each).";
      setFileError(msg); toast.error(msg); setLoading(false); return;
    }

    try {
      const fd = new FormData(e.currentTarget);
      const email = String(fd.get("email") || "").trim();
      const phone = String(fd.get("phone") || "").trim();
      const password = String(fd.get("password") || "");

      // check duplicate phone
      const phoneSnap = await getDocs(query(collection(db, "interinestUsers"), where("phone", "==", phone)));
      if (!phoneSnap.empty) {
        toast.error("This phone number is already registered.");
        setLoading(false); return;
      }

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      const imageUrls = await uploadImages(uid);

      await setDoc(doc(db, "interinestUsers", uid), {
        email,
        fullName: String(fd.get("fullName") || ""),
        phone,
        city: String(fd.get("city") || ""),
        role: "designer",
        profileRole: String(fd.get("profileRole") || ""),
        experience: String(fd.get("experience") || ""),
        services: fd.getAll("services").map(String),
        budgetRange: String(fd.get("budgetRange") || ""),
        portfolio: String(fd.get("portfolio") || ""),
        instagram: String(fd.get("instagram") || ""),
        website: String(fd.get("website") || ""),
        styles: fd.getAll("styles").map(String),
        leadsPreference: String(fd.get("leadsPreference") || ""),
        notes: String(fd.get("notes") || ""),
        imageUrls,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      formRef.current?.reset();
      setProjectImages([]);

      if (intentRef.current === "addAnother") {
        setSavedCount((c) => c + 1);
        toast.success("Designer created! Fill in the details below to add another.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.success("Designer account created successfully.");
        router.push("/dashboard/admin/designers");
      }
    } catch (err) {
      console.error(err);
      toast.error(getErrorMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: "Home", href: "/dashboard/admin" },
    { label: "Designers", href: "/dashboard/admin/designers" },
    { label: "Add New Designer" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header pageTitle="Add New Designer" breadcrumbs={breadcrumbs} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Page header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-1.5 w-full" style={{ backgroundColor: ACCENT }} />
          <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-800">New Designer Account</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Fill in the details below to create a designer account. The designer can log in immediately after creation.
              </p>
            </div>
            <Link
              href="/dashboard/admin/designers"
              className="inline-flex items-center gap-2 text-sm text-slate-600 border border-slate-200 bg-white rounded-xl px-4 py-2 hover:bg-slate-50 transition flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Designers
            </Link>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 text-sm text-slate-900">

            {/* ── About ── */}
            <section>
              <SectionHeading>About the designer</SectionHeading>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required className={IC} placeholder="designer@studio.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" name="fullName" required className={IC} placeholder="Aarav Mehta" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone (WhatsApp preferred) *</Label>
                  <Input id="phone" name="phone" required className={IC} placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" name="city" required className={IC} placeholder="Mumbai" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password *</Label>
                  <Input id="password" name="password" type="password" required className={IC} placeholder="Min 6 characters" />
                </div>
                <div className="space-y-1.5">
                  <Label>Designer Type *</Label>
                  <Select name="profileRole" required>
                    <SelectTrigger className={SC}>
                      <SelectValue placeholder="Select designer type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* ── Experience & services ── */}
            <section>
              <SectionHeading>Experience &amp; services</SectionHeading>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Years of Experience *</Label>
                  <Select name="experience" required>
                    <SelectTrigger className={SC}>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0–1 years</SelectItem>
                      <SelectItem value="1-3">1–3 years</SelectItem>
                      <SelectItem value="3-5">3–5 years</SelectItem>
                      <SelectItem value="5+">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Typical Budget Range *</Label>
                  <Select name="budgetRange" required>
                    <SelectTrigger className={SC}>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <Label>Services Offered *</Label>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  {SERVICE_OPTIONS.map((opt) => (
                    <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input type="checkbox" name="services" value={opt}
                        className="h-3.5 w-3.5 rounded" style={{ accentColor: ACCENT }} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Online presence ── */}
            <section>
              <SectionHeading>Online presence</SectionHeading>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="portfolio">Portfolio Link</Label>
                  <Input id="portfolio" name="portfolio" className={IC} placeholder="Behance / personal site" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="instagram">Instagram Handle</Label>
                  <Input id="instagram" name="instagram" className={IC} placeholder="@yourstudio" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" className={IC} placeholder="https://" />
                </div>
              </div>
            </section>

            {/* ── Style & leads ── */}
            <section>
              <SectionHeading>Style &amp; leads</SectionHeading>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Design Styles *</Label>
                  <div className="grid sm:grid-cols-3 gap-x-6 gap-y-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    {STYLE_OPTIONS.map((opt) => (
                      <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm">
                        <input type="checkbox" name="styles" value={opt}
                          className="h-3.5 w-3.5" style={{ accentColor: ACCENT }} />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Open to client leads? *</Label>
                  <Select name="leadsPreference" required>
                    <SelectTrigger className={SC}>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea id="notes" name="notes" rows={3}
                    className="rounded-2xl border-slate-200 bg-slate-50 text-sm focus-visible:ring-[#7593b4]"
                    placeholder="Anything else to note about this designer..." />
                </div>
              </div>
            </section>

            {/* ── Project images ── */}
            <section>
              <SectionHeading>Project images (2–5)</SectionHeading>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-slate-600 font-medium">
                    {projectImages.length} / {MAX_FILES} files selected
                    <span className="text-rose-500 ml-1">*</span>
                  </p>
                  <span className="text-[11px] text-slate-400">Max 10 MB per file</span>
                </div>

                {/* File chips */}
                {projectImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {projectImages.map((file, idx) => (
                      <div key={file.name + idx}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-sm">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="max-w-[160px] truncate">{file.name}</span>
                        <button type="button" onClick={() => removeFile(idx)}
                          className="ml-1 text-slate-400 hover:text-red-500 transition text-base leading-none">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => { addFiles(e.currentTarget.files); e.currentTarget.value = ""; }} />

                <button type="button" onClick={() => fileInputRef.current?.click()}
                  disabled={projectImages.length >= MAX_FILES}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#7593b4] px-4 py-2.5 text-sm text-slate-500 hover:text-[#7593b4] transition disabled:opacity-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {projectImages.length >= MAX_FILES ? "Maximum files reached" : "Upload images"}
                </button>

                {fileError && <p className="mt-2 text-xs text-rose-600">{fileError}</p>}
              </div>
            </section>

            {/* ── Submit ── */}
            <div className="flex flex-col gap-4 pt-2 border-t border-slate-100">
              {/* Saved session counter */}
              {savedCount > 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-xs text-green-700">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    <strong>{savedCount} designer{savedCount > 1 ? "s" : ""}</strong> created this session — the form has been reset so you can add another.
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-[11px] text-slate-400">
                  The designer account will be created immediately and set to <strong>pending</strong> status.
                </p>
                <div className="flex gap-3 flex-shrink-0 flex-wrap justify-end">
                  <Link href="/dashboard/admin/designers"
                    className="inline-flex items-center justify-center h-10 rounded-xl border border-slate-200 px-5 text-sm text-slate-600 hover:bg-slate-50 transition">
                    Cancel
                  </Link>
                  {/* Create & Add Another */}
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={() => { intentRef.current = "addAnother"; }}
                    className="inline-flex items-center justify-center gap-2 h-10 rounded-xl px-5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-60 border"
                    style={{ borderColor: ACCENT, color: ACCENT, background: "#fff" }}>
                    {loading && intentRef.current === "addAnother" ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Creating…
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create & Add Another
                      </>
                    )}
                  </button>
                  {/* Create Designer (navigate away) */}
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={() => { intentRef.current = "navigate"; }}
                    className="inline-flex items-center justify-center gap-2 h-10 rounded-xl px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: ACCENT }}>
                    {loading && intentRef.current === "navigate" ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Creating…
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Create Designer
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
