import React from "react";
import Link from "next/link";
import { Header } from "@/components/dashboard/Header";
import ProjectList from "@/components/Projects/projects/ProjectList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Instagram, Globe2, Pencil } from "lucide-react";

const designer = {
  name: "AiR Designer Studio",
  role: "Interior & Exterior Designer",
  city: "Mumbai, India",
  experience: "5+ years",
  budget: "₹5–20 Lakhs (typical)",
  styles: ["Modern", "Minimalist", "Contemporary", "Luxury Spaces"],
  services: ["Full Home Interiors", "Kitchen Design", "Living / Bedroom Styling", "Commercial / Office"],
  instagram: "https://instagram.com/yourstudio",
  website: "https://yourstudio.in",
};

export default function DesignerPortfolioPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard/designer-dashboard" },
    { label: "Portfolio" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f4ec] via-white to-[#f8f4ec]">
      <Header pageTitle="Designer Portfolio" breadcrumbs={breadcrumbs} />
      <main className="mx-auto flex max-w-full flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
          <div className="overflow-hidden rounded-2xl border border-[#e2d6c3] bg-white/90 shadow-sm">
            <div className="flex items-center gap-4 border-b border-[#e2d6c3] bg-gradient-to-r from-[#7593b4] to-[#607da0] px-5 py-4 text-[#f8f4ec] sm:px-6">
              <div className="h-16 w-16 rounded-full border-2 border-[#f8f4ec] bg-[#e7eef6] shadow-sm sm:h-20 sm:w-20" />
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold sm:text-xl">{designer.name}</h1>
                <p className="text-xs font-medium uppercase tracking-wide text-[#f8f4ec]/80">{designer.role}</p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-[#f8f4ec]/80">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{designer.city}</span>
                  <span className="mx-1 h-1 w-1 rounded-full bg-[#f8f4ec]/70" />
                  <span>{designer.experience}</span>
                </div>
              </div>
              <div className="ml-auto hidden sm:block">
                <Link href="/dashboard/designer-dashboard/profile">
                  <Button size="sm" variant="outline" className="inline-flex items-center gap-1 rounded-full border-[#f8f4ec]/70 bg-transparent text-xs text-[#f8f4ec] hover:bg-[#f8f4ec]/10">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit profile
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-5 px-5 py-5 sm:px-6">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Design styles</p>
                <div className="flex flex-wrap gap-1.5">
                  {designer.styles.map((style) => (
                    <Badge key={style} variant="outline" className="rounded-full border-[#d0c3b0] bg-[#f8f4ec] px-2 py-0.5 text-[11px] font-medium text-slate-800">{style}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Services</p>
                <div className="flex flex-wrap gap-1.5">
                  {designer.services.map((svc) => (
                    <Badge key={svc} variant="secondary" className="rounded-full px-2 py-0.5 text-[11px] font-medium text-[#435976]">{svc}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#efe3d3] pt-4 text-xs text-slate-600">
                <div>
                  <p className="font-medium text-slate-800">Typical budget range</p>
                  <p className="text-slate-500">{designer.budget}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={designer.instagram} target="_blank">
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-[#d0c3b0]"><Instagram className="h-4 w-4" /></Button>
                  </Link>
                  <Link href={designer.website} target="_blank">
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-[#d0c3b0]"><Globe2 className="h-4 w-4" /></Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-[#627da1] bg-gradient-to-br from-[#7593b4] to-[#627da1] text-[#f8f4ec] shadow-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#f8f4ec]/80">Portfolio snapshot</p>
              <h2 className="mt-1 text-lg font-semibold">24 completed projects</h2>
              <p className="mt-1 text-xs text-[#f8f4ec]/80">Residential, boutique commercial and cafe interiors across Mumbai, Pune & Bengaluru.</p>
            </div>
            <Link href="/dashboard/designer-dashboard/projects/add">
              <Button className="h-11 w-full rounded-xl bg-[#7593b4] text-xs font-medium text-[#f8f4ec] shadow-sm hover:bg-[#607da0]">
                Showcase a new project
              </Button>
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[#e2d6c3] bg-white/90 p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">Featured projects</h2>
              <p className="text-xs text-slate-500">A selection of recent interior and exterior projects from this studio.</p>
            </div>
            <Link href="/dashboard/designer-dashboard">
              <Button variant="outline" size="sm" className="rounded-full border-[#d0c3b0] bg-[#f8f4ec] text-xs text-[#435976] hover:bg-white">View dashboard</Button>
            </Link>
          </div>
          <ProjectList />
        </section>
      </main>
    </div>
  );
}
