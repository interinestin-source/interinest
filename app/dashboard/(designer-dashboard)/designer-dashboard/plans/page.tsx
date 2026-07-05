"use client";

import React, { useState } from "react";
import { DesignerHeader as Header } from "@/components/designer/DesignerHeader";
import Link from "next/link";
import { Check, X, Zap, Star, Building2 } from "lucide-react";

const ACCENT = "#7593b4";

type Billing = "monthly" | "yearly";

const plans = [
  {
    id: "free",
    name: "Starter",
    icon: Star,
    iconBg: "#f1f5f9",
    iconColor: "#64748b",
    tagline: "Get listed and start building your portfolio",
    monthlyPrice: 0,
    yearlyPrice: 0,
    badge: null,
    cta: "Current plan",
    ctaDisabled: true,
    features: [
      { text: "Up to 5 projects", included: true },
      { text: "Basic profile listing", included: true },
      { text: "Enquiry form on profile", included: true },
      { text: "Mobile-friendly portfolio", included: true },
      { text: "Featured badge", included: false },
      { text: "Priority in search results", included: false },
      { text: "Profile analytics", included: false },
      { text: "Unlimited projects", included: false },
      { text: "Custom portfolio URL", included: false },
      { text: "Dedicated account manager", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    icon: Zap,
    iconBg: "#eef2f7",
    iconColor: ACCENT,
    tagline: "For active designers ready to grow their client base",
    monthlyPrice: 999,
    yearlyPrice: 799,
    badge: "Most popular",
    cta: "Upgrade to Pro",
    ctaDisabled: false,
    features: [
      { text: "Unlimited projects", included: true },
      { text: "Basic profile listing", included: true },
      { text: "Enquiry form on profile", included: true },
      { text: "Mobile-friendly portfolio", included: true },
      { text: "Featured badge on profile", included: true },
      { text: "Priority in search results", included: true },
      { text: "Profile analytics (views & enquiries)", included: true },
      { text: "Custom portfolio URL", included: true },
      { text: "Instagram portfolio sync", included: false },
      { text: "Dedicated account manager", included: false },
    ],
  },
  {
    id: "studio",
    name: "Studio",
    icon: Building2,
    iconBg: "#1e293b",
    iconColor: "#fff",
    tagline: "For design firms and studios with multiple designers",
    monthlyPrice: 2499,
    yearlyPrice: 1999,
    badge: "Best value",
    cta: "Upgrade to Studio",
    ctaDisabled: false,
    features: [
      { text: "Unlimited projects", included: true },
      { text: "Basic profile listing", included: true },
      { text: "Enquiry form on profile", included: true },
      { text: "Mobile-friendly portfolio", included: true },
      { text: "Featured badge on profile", included: true },
      { text: "Priority in search results", included: true },
      { text: "Profile analytics (views & enquiries)", included: true },
      { text: "Custom portfolio URL", included: true },
      { text: "Instagram portfolio sync", included: true },
      { text: "Dedicated account manager", included: true },
    ],
  },
];

const faqs = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes. You can upgrade or downgrade at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at the end of your billing cycle.",
  },
  {
    q: "What happens to my projects if I downgrade from Pro to Free?",
    a: "Your projects are never deleted. If you go back to Free, only your 5 most recent projects will be publicly visible. The rest remain saved and will reappear if you upgrade again.",
  },
  {
    q: "Is there a free trial for Pro or Studio?",
    a: "We offer a 14-day free trial for the Pro plan — no credit card required. Studio trials are available on request.",
  },
  {
    q: "Do you offer refunds?",
    a: "If you're not satisfied within the first 7 days of a paid plan, we'll refund you in full, no questions asked.",
  },
];

export default function PlansPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Designer Dashboard", href: "/dashboard/designer-dashboard" },
    { label: "Plans & Pricing" },
  ];

  const [billing, setBilling] = useState<Billing>("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header pageTitle="Plans & Pricing" breadcrumbs={breadcrumbs} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">

        {/* ── Hero ── */}
        <div className="text-center space-y-4">
          <span style={{
            display: "inline-block", padding: "4px 14px", borderRadius: 999,
            background: "#eef2f7", color: ACCENT, fontSize: 12, fontWeight: 700,
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            Subscription Plans
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Grow your design business<br />at your own pace
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Start free and upgrade whenever you're ready. No hidden charges — cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 mt-2">
            <button
              onClick={() => setBilling("monthly")}
              style={{
                padding: "7px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: billing === "monthly" ? ACCENT : "transparent",
                color: billing === "monthly" ? "#fff" : "#64748b",
                border: `1.5px solid ${billing === "monthly" ? ACCENT : "#e2e8f0"}`,
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              style={{
                padding: "7px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: billing === "yearly" ? ACCENT : "transparent",
                color: billing === "yearly" ? "#fff" : "#64748b",
                border: `1.5px solid ${billing === "yearly" ? ACCENT : "#e2e8f0"}`,
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              Yearly
              <span style={{
                marginLeft: 8, padding: "1px 7px", borderRadius: 999,
                background: billing === "yearly" ? "rgba(255,255,255,0.25)" : "#dcfce7",
                color: billing === "yearly" ? "#fff" : "#16a34a",
                fontSize: 10, fontWeight: 700,
              }}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* ── Plans grid ── */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            const isPro = plan.id === "pro";

            return (
              <div
                key={plan.id}
                style={{
                  background: isPro ? "#fff" : "#fff",
                  borderRadius: 20,
                  border: isPro ? `2px solid ${ACCENT}` : "1.5px solid #e2e8f0",
                  padding: "28px 24px 24px",
                  boxShadow: isPro ? `0 8px 32px rgba(117,147,180,0.18)` : "0 2px 12px rgba(0,0,0,0.05)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div style={{
                    position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                    padding: "4px 16px", borderRadius: 999,
                    background: isPro ? ACCENT : "#1e293b",
                    color: "#fff", fontSize: 11, fontWeight: 700,
                    whiteSpace: "nowrap", letterSpacing: "0.04em",
                  }}>
                    {plan.badge}
                  </div>
                )}

                {/* Icon + name */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: plan.iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={22} color={plan.iconColor} />
                  </div>
                  <div>
                    <p style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", margin: 0 }}>{plan.name}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, marginTop: 2 }}>{plan.tagline}</p>
                  </div>
                </div>

                {/* Price */}
                <div style={{ marginBottom: 20 }}>
                  {price === 0 ? (
                    <p style={{ fontSize: 32, fontWeight: 800, color: "#1e293b", margin: 0 }}>Free</p>
                  ) : (
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>₹</span>
                      <span style={{ fontSize: 34, fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>{price.toLocaleString("en-IN")}</span>
                      <span style={{ fontSize: 13, color: "#94a3b8" }}>/mo</span>
                    </div>
                  )}
                  {billing === "yearly" && price > 0 && (
                    <p style={{ fontSize: 11, color: "#16a34a", fontWeight: 600, marginTop: 4 }}>
                      Billed ₹{(price * 12).toLocaleString("en-IN")}/year · 2 months free
                    </p>
                  )}
                </div>

                {/* CTA */}
                <button
                  disabled={plan.ctaDisabled}
                  style={{
                    width: "100%", padding: "11px 0", borderRadius: 12,
                    fontSize: 14, fontWeight: 700, cursor: plan.ctaDisabled ? "default" : "pointer",
                    border: isPro ? "none" : plan.ctaDisabled ? "1.5px solid #e2e8f0" : "1.5px solid #1e293b",
                    background: plan.ctaDisabled ? "#f8fafc" : isPro ? ACCENT : "#1e293b",
                    color: plan.ctaDisabled ? "#94a3b8" : "#fff",
                    transition: "opacity 0.2s",
                    marginBottom: 22,
                  }}
                  onMouseEnter={(e) => { if (!plan.ctaDisabled) (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                >
                  {plan.cta}
                </button>

                {/* Divider */}
                <div style={{ borderTop: "1px solid #f1f5f9", marginBottom: 18 }} />

                {/* Feature list */}
                <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                        background: f.included ? (isPro ? "#eef2f7" : "#f0fdf4") : "#f8fafc",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {f.included
                          ? <Check size={11} color={isPro ? ACCENT : "#16a34a"} strokeWidth={2.5} />
                          : <X size={10} color="#cbd5e1" strokeWidth={2.5} />
                        }
                      </span>
                      <span style={{
                        fontSize: 13, color: f.included ? "#1e293b" : "#94a3b8",
                        fontWeight: f.included ? 500 : 400,
                      }}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* ── Feature comparison note ── */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: "20px 28px", display: "flex", alignItems: "center",
          gap: 16, flexWrap: "wrap",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: "#eef2f7",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Zap size={18} color={ACCENT} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: "0 0 3px" }}>
              All plans include — SSL-secured portfolio, enquiry notifications, and listing on Interinest's designer directory.
            </p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
              Payments coming soon · Currently in early access — all plans are free during beta.
            </p>
          </div>
          <Link href="/dashboard/designer-dashboard" style={{
            padding: "9px 20px", borderRadius: 10, background: ACCENT,
            color: "#fff", fontSize: 13, fontWeight: 600,
            textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
          }}>
            Back to dashboard
          </Link>
        </div>

        {/* ── FAQ ── */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", marginBottom: 20, textAlign: "center" }}>
            Frequently asked questions
          </h2>
          <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
                  overflow: "hidden", cursor: "pointer",
                }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 20px", gap: 12,
                }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: 0 }}>{faq.q}</p>
                  <span style={{
                    fontSize: 18, color: ACCENT, fontWeight: 300, flexShrink: 0,
                    transform: openFaq === i ? "rotate(45deg)" : "none",
                    transition: "transform 0.2s",
                    lineHeight: 1,
                  }}>+</span>
                </div>
                {openFaq === i && (
                  <div style={{ padding: "0 20px 16px", borderTop: "1px solid #f1f5f9" }}>
                    <p style={{ fontSize: 13, color: "#64748b", margin: "12px 0 0", lineHeight: 1.7 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div style={{
          background: `linear-gradient(135deg, ${ACCENT} 0%, #5a7a9e 60%, #4a6a8e 100%)`,
          borderRadius: 20, padding: "40px 32px", textAlign: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -20, left: 40, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
          <p style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 10px", position: "relative" }}>
            Have questions? We'd love to help.
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: "0 0 24px", position: "relative" }}>
            Reach out to our team — we'll help you pick the right plan for your practice.
          </p>
          <Link href="/contact" style={{
            display: "inline-block", padding: "12px 28px", borderRadius: 12,
            background: "#fff", color: ACCENT, fontSize: 14, fontWeight: 700,
            textDecoration: "none", position: "relative",
          }}>
            Contact us →
          </Link>
        </div>

      </div>
    </div>
  );
}
