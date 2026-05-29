"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { db } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Header } from "@/components/admin/Header";

const ACCENT = "#7593b4";

/* ── helpers ──────────────────────────────────────────────────── */
const img = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ── DESIGNERS (6) ────────────────────────────────────────────── */
const DESIGNERS = [
  {
    id: "seed_designer_001",
    fullName: "Priya Sharma",
    email: "priya.sharma@interinest-demo.com",
    phone: "+91 98765 43001",
    city: "Mumbai",
    role: "designer",
    profileRole: "solo",
    experience: "5+",
    services: [
      "Full Home Interior Design",
      "Living Room / Bedroom Styling",
      "Consultation Only",
    ],
    budgetRange: "5-10",
    portfolio: "https://behance.net/priyasharma",
    instagram: "@priyasharma.interiors",
    website: "https://priyasharma.design",
    styles: ["Modern", "Minimalist", "Contemporary"],
    leadsPreference: "yes",
    notes:
      "Specializing in warm, inviting spaces that blend modern aesthetics with Indian sensibilities. Known for signature boucle-and-teak palettes.",
    photoURL: img("1494790108755-2616b612b47c", 400),
    imageUrls: [
      img("1586023492125-27b2c045efd7"),
      img("1555041469-a586c61ea9bc"),
      img("1616486338812-3dadae4b4ace"),
      img("1583847268964-b28dc8f51f92"),
    ],
    status: "approved",
  },
  {
    id: "seed_designer_002",
    fullName: "Arjun Mehta",
    email: "arjun.mehta@interinest-demo.com",
    phone: "+91 98765 43002",
    city: "Delhi NCR",
    role: "designer",
    profileRole: "studio",
    experience: "3-5",
    services: [
      "Full Home Interior Design",
      "Commercial / Office Interiors",
      "Kitchen Design",
    ],
    budgetRange: "10-20",
    portfolio: "https://behance.net/arjunmehta",
    instagram: "@arjunmehta.studio",
    website: "https://arjunmehta.studio",
    styles: ["Contemporary", "Industrial", "Luxury Spaces"],
    leadsPreference: "yes-selectively",
    notes:
      "Award-winning studio known for bold material choices — corten steel, raw concrete, and reclaimed timber — creating transformative renovations across Delhi-NCR.",
    photoURL: img("1507003211169-0a1dd7228f2d", 400),
    imageUrls: [
      img("1600607687939-ce8a6c25118c"),
      img("1600047509807-ba8f99d2cdde"),
      img("1512917774080-9991f1c4c750"),
      img("1560448204-603b3fc33ddc"),
    ],
    status: "approved",
  },
  {
    id: "seed_designer_003",
    fullName: "Kavya Nair",
    email: "kavya.nair@interinest-demo.com",
    phone: "+91 98765 43003",
    city: "Bengaluru",
    role: "designer",
    profileRole: "solo",
    experience: "1-3",
    services: ["Living Room / Bedroom Styling", "Consultation Only"],
    budgetRange: "under5",
    portfolio: "https://behance.net/kavyanair",
    instagram: "@kavyanair.design",
    website: "",
    styles: ["Minimalist", "Scandinavian", "Budget Homes"],
    leadsPreference: "yes",
    notes:
      "Passionate about creating calm, clutter-free spaces on accessible budgets. Believes great design should not be a luxury.",
    photoURL: img("1438761681033-6461ffad8d80", 400),
    imageUrls: [
      img("1585771724684-38269d6639fd"),
      img("1593642632559-0c6d3fc62b89"),
      img("1522708323590-d24dbb6b0267"),
      img("1558618666-fcd25c85cd64"),
    ],
    status: "approved",
  },
  {
    id: "seed_designer_004",
    fullName: "Rohan Gupta",
    email: "rohan.gupta@interinest-demo.com",
    phone: "+91 98765 43004",
    city: "Hyderabad",
    role: "designer",
    profileRole: "solo",
    experience: "5+",
    services: [
      "Full Home Interior Design",
      "Living Room / Bedroom Styling",
      "Kitchen Design",
    ],
    budgetRange: "5-10",
    portfolio: "https://behance.net/rohangupta",
    instagram: "@rohangupta.interiors",
    website: "https://rohangupta.in",
    styles: ["Luxury Spaces", "Contemporary", "Traditional"],
    leadsPreference: "yes",
    notes:
      "Rohan brings a passion for luxury and detail — crafting spaces that feel both elevated and effortlessly liveable across Hyderabad and Secunderabad.",
    photoURL: img("1500648767791-00dcc994a43e", 400),
    imageUrls: [
      img("1631049307264-da0ec9d70304"),
      img("1583847268964-b28dc8f51f92"),
      img("1565182999561-18d7dc61c393"),
      img("1560448204-603b3fc33ddc"),
    ],
    status: "approved",
  },
  {
    id: "seed_designer_005",
    fullName: "Ananya Iyer",
    email: "ananya.iyer@interinest-demo.com",
    phone: "+91 98765 43005",
    city: "Chennai",
    role: "designer",
    profileRole: "studio",
    experience: "3-5",
    services: [
      "Full Home Interior Design",
      "Kitchen Design",
      "Cafe / Restaurant Interiors",
    ],
    budgetRange: "10-20",
    portfolio: "https://behance.net/ananyaiyer",
    instagram: "@ananyaiyer.studio",
    website: "https://ananyaiyer.com",
    styles: ["Traditional", "Contemporary", "Modern"],
    leadsPreference: "yes-selectively",
    notes:
      "Studio specializing in homes and hospitality spaces that honour South Indian craftsmanship through a contemporary lens — Chettinad tiles, teak joinery, and hand-crafted brass fittings.",
    photoURL: img("1544725176-7c40e5a71c5e", 400),
    imageUrls: [
      img("1567538096621-38d2284b23ff"),
      img("1616486338812-3dadae4b4ace"),
      img("1556909114-f6e7ad7d3136"),
      img("1586023492125-27b2c045efd7"),
    ],
    status: "approved",
  },
  {
    id: "seed_designer_006",
    fullName: "Vikram Patel",
    email: "vikram.patel@interinest-demo.com",
    phone: "+91 98765 43006",
    city: "Pune",
    role: "designer",
    profileRole: "student",
    experience: "0-1",
    services: ["Consultation Only", "Living Room / Bedroom Styling"],
    budgetRange: "below1",
    portfolio: "",
    instagram: "@vikrampatel.spaces",
    website: "",
    styles: ["Industrial", "Minimalist"],
    leadsPreference: "yes",
    notes:
      "Fresh graduate with a love for industrial-chic aesthetics and adaptive reuse. Currently taking on residential consultations and small commercial commissions.",
    photoURL: img("1472099645785-5658abf4ff4e", 400),
    imageUrls: [
      img("1554118811-1e0d58224f24"),
      img("1559925393-8be0ec4767c8"),
      img("1585771724684-38269d6639fd"),
    ],
    status: "approved",
  },
];

/* ── PROJECTS (8) ─────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: "seed_project_001",
    uid: "seed_designer_001",
    title: "Modern 3BHK Apartment – Warm Minimal",
    category: "Interior",
    budget: "₹8,50,000",
    duration: "10-12 weeks",
    location: "Mumbai",
    style: "Minimalist",
    status: "Published",
    description:
      "A complete interior transformation of a 1,450 sq ft apartment in Bandra West. We rebuilt from a palette of warm whites, aged teak, and brass accents. The living room anchors around a custom boucle sofa facing a fluted-panel TV wall. The kitchen uses open shelving and matte-finish modular cabinets in dusty sage. Bedrooms follow a clutter-free approach with full-height wardrobes and hidden storage.",
    tags: ["3BHK", "Mumbai", "Warm Minimal", "Teak", "Boucle"],
    imageUrls: [
      img("1586023492125-27b2c045efd7"),
      img("1555041469-a586c61ea9bc"),
      img("1616486338812-3dadae4b4ace"),
      img("1583847268964-b28dc8f51f92"),
      img("1560448204-603b3fc33ddc"),
    ],
  },
  {
    id: "seed_project_002",
    uid: "seed_designer_002",
    title: "Contemporary Villa Exterior & Landscape",
    category: "Exterior",
    budget: "₹18,00,000",
    duration: "12+ weeks",
    location: "Delhi NCR",
    style: "Contemporary",
    status: "Published",
    description:
      "A complete exterior redesign of a 400 sq yd farmhouse in Gurugram. The brief was to bring a Rajasthani stone-and-plaster vernacular into conversation with clean contemporary lines. Local Dholpur stone lines the base plinth, laser-cut corten screens run across the first floor, and the flat roof features native planting. The courtyard was repaved in buff sandstone around a sculpted water element.",
    tags: ["Villa", "Exterior", "Delhi NCR", "Corten Steel", "Landscape"],
    imageUrls: [
      img("1600607687939-ce8a6c25118c"),
      img("1600047509807-ba8f99d2cdde"),
      img("1512917774080-9991f1c4c750"),
      img("1558618666-fcd25c85cd64"),
    ],
  },
  {
    id: "seed_project_003",
    uid: "seed_designer_003",
    title: "Minimalist Home Office for Tech Founder",
    category: "Interior",
    budget: "₹3,20,000",
    duration: "4-6 weeks",
    location: "Bengaluru",
    style: "Minimalist",
    status: "Published",
    description:
      "A 200 sq ft spare bedroom in Koramangala converted into a calm, focused work environment. A custom desk in white-lacquered MDF spans the full window wall. A pegboard organiser replaces bulky drawer units. The accent wall uses limewash paint in sage green. Ergonomic chair, acoustic panel on the ceiling, and soft indirect lighting complete the setup.",
    tags: ["Home Office", "Bengaluru", "Minimalist", "WFH", "Limewash"],
    imageUrls: [
      img("1585771724684-38269d6639fd"),
      img("1593642632559-0c6d3fc62b89"),
      img("1522708323590-d24dbb6b0267"),
    ],
  },
  {
    id: "seed_project_004",
    uid: "seed_designer_004",
    title: "Luxury Master Suite with Walk-in Wardrobe",
    category: "Interior",
    budget: "₹6,75,000",
    duration: "8-10 weeks",
    location: "Hyderabad",
    style: "Luxury",
    status: "Published",
    description:
      "A 550 sq ft master suite in Jubilee Hills designed to feel like a five-star retreat. The custom king headboard in channel-tufted velvet integrates reading lights. Wardrobes are in matte champagne laminate with smoked glass panels. The en-suite features a freestanding tub, herringbone marble floor tile, and a heated brass towel rail. A private dressing area connects the bedroom to the bathroom.",
    tags: ["Bedroom", "Luxury", "Hyderabad", "Velvet", "Walk-in Wardrobe"],
    imageUrls: [
      img("1631049307264-da0ec9d70304"),
      img("1583847268964-b28dc8f51f92"),
      img("1565182999561-18d7dc61c393"),
      img("1560448204-603b3fc33ddc"),
    ],
  },
  {
    id: "seed_project_005",
    uid: "seed_designer_005",
    title: "Scandinavian Kitchen Makeover – Open Plan",
    category: "Interior",
    budget: "₹4,50,000",
    duration: "6-8 weeks",
    location: "Chennai",
    style: "Scandinavian",
    status: "Published",
    description:
      "A tight galley kitchen in T Nagar transformed by removing a partition wall and opening it to the dining area. Shaker-style cabinets in white with brushed-steel handles, a handmade zellige tile backsplash in matte cream, and a flush-mounted induction hob create a clean, airy workspace. Open wooden shelving and a hanging pot rack bring Scandinavian warmth.",
    tags: ["Kitchen", "Chennai", "Scandinavian", "Zellige", "Open Plan"],
    imageUrls: [
      img("1556909114-f6e7ad7d3136"),
      img("1565183928294-7063f23ce0f8"),
      img("1616486338812-3dadae4b4ace"),
    ],
  },
  {
    id: "seed_project_006",
    uid: "seed_designer_006",
    title: "Industrial-Chic Cafe – Koregaon Park",
    category: "Both",
    budget: "₹12,50,000",
    duration: "12+ weeks",
    location: "Pune",
    style: "Industrial",
    status: "Published",
    description:
      "A 1,800 sq ft specialty coffee cafe in Koregaon Park designed around 'raw but refined'. Exposed brick, concrete surfaces, and visible ductwork are balanced against warm Edison lighting and custom furniture. Reclaimed railway sleepers form the bar top. Booth seating in brown leather, a hand-painted menu wall, and a mezzanine co-working zone complete the space.",
    tags: ["Cafe", "Pune", "Industrial", "Commercial", "Reclaimed Wood"],
    imageUrls: [
      img("1554118811-1e0d58224f24"),
      img("1559925393-8be0ec4767c8"),
      img("1600047509807-ba8f99d2cdde"),
      img("1555041469-a586c61ea9bc"),
    ],
  },
  {
    id: "seed_project_007",
    uid: "seed_designer_001",
    title: "Cosy Studio Apartment – Andheri West",
    category: "Interior",
    budget: "₹2,80,000",
    duration: "6-8 weeks",
    location: "Mumbai",
    style: "Boho",
    status: "Published",
    description:
      "A 380 sq ft studio in Andheri West designed for a young professional who needed every square foot to multi-task. The sofa converts to a queen bed; a fold-down dining table serves as a standing desk. A jute rug, macramé wall panel, and printed cotton throw bring boho warmth. The kitchen uses cane-front cabinet panels and open shelving with terracotta pots.",
    tags: ["Studio", "Mumbai", "Small Space", "Boho", "Multi-functional"],
    imageUrls: [
      img("1522708323590-d24dbb6b0267"),
      img("1502005229762-cf1b2da7c5d6"),
      img("1586023492125-27b2c045efd7"),
    ],
  },
  {
    id: "seed_project_008",
    uid: "seed_designer_005",
    title: "Heritage Bungalow Restoration – Mylapore",
    category: "Interior",
    budget: "₹24,00,000",
    duration: "12+ weeks",
    location: "Chennai",
    style: "Traditional",
    status: "Published",
    description:
      "A 4,200 sq ft heritage bungalow in Mylapore restored for a multigenerational family. The mandate: preserve the Chettinad-tiled floors, carved teak doors, and courtyard skylight while quietly introducing modern amenities. Local craftsmen repaired the stucco ceiling mouldings. Period-appropriate brass fittings were sourced from Kumbakonam. The modular kitchen and all new bathrooms are concealed behind traditional joinery.",
    tags: ["Heritage", "Chennai", "Traditional", "Restoration", "Chettinad"],
    imageUrls: [
      img("1567538096621-38d2284b23ff"),
      img("1558618666-fcd25c85cd64"),
      img("1560448204-603b3fc33ddc"),
      img("1583847268964-b28dc8f51f92"),
      img("1586023492125-27b2c045efd7"),
    ],
  },
];

/* ── Page ─────────────────────────────────────────────────────── */
export default function SeedDataPage() {
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState<{ designers: number; projects: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    setSeeding(true);
    setResult(null);
    setError(null);

    try {
      let dCount = 0;
      let pCount = 0;

      /* Write designers */
      for (const { id, ...data } of DESIGNERS) {
        await setDoc(doc(db, "interinestUsers", id), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        dCount++;
        toast.loading(`Adding designers… ${dCount}/${DESIGNERS.length}`, { id: "seed-progress" });
      }

      /* Write projects */
      for (const { id, ...data } of PROJECTS) {
        await setDoc(doc(db, "projects", id), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        pCount++;
        toast.loading(`Adding projects… ${pCount}/${PROJECTS.length}`, { id: "seed-progress" });
      }

      toast.dismiss("seed-progress");
      toast.success(`Done! ${dCount} designers + ${pCount} projects added.`);
      setResult({ designers: dCount, projects: pCount });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      console.error("Seed error:", e);
      setError(msg);
      toast.dismiss("seed-progress");
      toast.error("Seeding failed — check console");
    } finally {
      setSeeding(false);
    }
  };

  const breadcrumbs = [
    { label: "Home", href: "/dashboard/admin" },
    { label: "Seed Demo Data" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header pageTitle="Seed Demo Data" breadcrumbs={breadcrumbs} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Warning card */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-800">Development tool — do not use in production</p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                This page writes sample data directly to Firestore. Running it multiple times will overwrite
                existing seed records (same document IDs are reused). Real user data will not be affected.
              </p>
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-1.5 w-full" style={{ backgroundColor: ACCENT }} />
          <div className="px-6 py-6">
            <h2 className="text-base font-semibold text-slate-800 mb-1">Add Sample Designers &amp; Projects</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Populates Firestore with <strong>6 approved designers</strong> and <strong>8 published projects</strong>
              using realistic Indian interior design data and Unsplash imagery.
              These will immediately appear on the public <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">/designers</code> and{" "}
              <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">/projects</code> pages.
            </p>

            {/* Preview table */}
            <div className="rounded-xl border border-slate-100 overflow-hidden mb-6">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-2.5 font-semibold text-slate-500 uppercase tracking-wide text-[10px]">Type</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-slate-500 uppercase tracking-wide text-[10px]">Count</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-slate-500 uppercase tracking-wide text-[10px]">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr>
                    <td className="px-4 py-3 font-medium text-slate-700">Designers</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-white text-xs font-bold" style={{ backgroundColor: ACCENT }}>6</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">Priya (Mumbai), Arjun (Delhi NCR), Kavya (Bengaluru), Rohan (Hyderabad), Ananya (Chennai), Vikram (Pune)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-slate-700">Projects</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-white text-xs font-bold" style={{ backgroundColor: "#7ab893" }}>8</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">Modern 3BHK, Villa Exterior, Home Office, Luxury Suite, Scandi Kitchen, Industrial Cafe, Studio Apt, Heritage Bungalow</td>
                  </tr>
                  <tr className="bg-slate-50/60">
                    <td className="px-4 py-3 font-medium text-slate-700">Collection</td>
                    <td className="px-4 py-3 text-slate-400" colSpan={2}>
                      <code className="text-[11px]">interinestUsers</code> (designers) &amp; <code className="text-[11px]">projects</code> (Firestore)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Success result */}
            {result && (
              <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 mb-5">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-green-800">Seed complete!</p>
                  <p className="text-xs text-green-700 mt-0.5">
                    {result.designers} designers and {result.projects} projects are now live in Firestore.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Link href="/designers" target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-medium text-green-700 hover:underline">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      View /designers
                    </Link>
                    <span className="text-green-300">·</span>
                    <Link href="/projects" target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-medium text-green-700 hover:underline">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      View /projects
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 mb-5">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-800">Seeding failed</p>
                  <p className="text-xs text-red-600 mt-0.5 font-mono">{error}</p>
                  <p className="text-xs text-red-600 mt-1">Check browser console for full details. Common causes: Firestore security rules blocking writes, or missing Firebase config.</p>
                </div>
              </div>
            )}

            {/* Action */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
              <Link
                href="/dashboard/admin"
                className="text-sm text-slate-500 hover:text-slate-700 transition"
              >
                ← Back to dashboard
              </Link>
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="inline-flex items-center justify-center gap-2 h-11 rounded-xl px-7 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: ACCENT }}
              >
                {seeding ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Seeding…
                  </>
                ) : result ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Re-seed (overwrite)
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Seed Sample Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
