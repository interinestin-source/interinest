"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const ACCENT = "#7593b4";
const ACCENT_DARK = "#5a7a9e";
const GOLD = "#CAAB06";

/* ── icons (inline SVG) ─────────────────────────────────────── */
const icons = {
  residential: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15v-6H9v6H3.75A.75.75 0 013 21V9.75z" />
    </svg>
  ),
  commercial: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  ),
  budget: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  style: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  student: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  ),
};

/* ── data ───────────────────────────────────────────────────── */
const services = [
  {
    id: 'residential',
    icon: 'residential',
    slug: 'Residential-Interior-Design',
    title: 'Residential Interior Design',
    intro: 'Find experienced interior designers for:',
    points: [
      '1BHK / 2BHK / 3BHK apartment interiors',
      'Villa and bungalow interior design',
      'Modular kitchen design',
      'Living room and bedroom interiors',
      'Space-saving solutions for small homes',
    ],
    tagline: 'Perfect for homeowners looking for affordable and modern interior design services.',
    subsections: [
      { title: 'Living Room Design', desc: 'Create welcoming and stylish living spaces that balance comfort and aesthetics. From furniture selection to lighting design, our designers help craft spaces where families connect and guests feel at home.' },
      { title: 'Bedroom Interior Design', desc: 'Design a relaxing retreat tailored to your needs. From modern minimalism to luxurious comfort, our designers focus on creating bedrooms that promote rest and well-being.' },
      { title: 'Kitchen Interior Design', desc: 'Optimize functionality and style with smart kitchen layouts, storage solutions, and contemporary finishes designed for modern living.' },
      { title: 'Dining Area Design', desc: 'Transform dining spaces into inviting environments for everyday meals and special gatherings.' },
      { title: "Children's Room Design", desc: "Create safe, practical, and inspiring spaces that grow with your child while maximizing storage and functionality." },
      { title: 'Complete Home Interior Design', desc: 'From concept development to final styling, our designers can manage the entire interior design process for apartments, villas, bungalows, and residential properties.' },
    ],
  },
  {
    id: 'commercial',
    icon: 'commercial',
    slug: 'Commercial-Interior-Design',
    title: 'Commercial Interior Design',
    intro: 'Hire interior designers for:',
    points: [
      'Cafe and restaurant interiors',
      'Retail store design',
      'Office interiors',
      'Salon and clinic design',
      'Co-working spaces',
    ],
    tagline: 'Connect with designers who understand branding, functionality, and customer experience.',
    subsections: [
      { title: 'Office Interior Design', desc: 'Design productive workspaces that encourage collaboration, creativity, and employee well-being. From corporate offices to startups and coworking spaces, our designers create environments that reflect your company culture.' },
      { title: 'Retail Store Design', desc: 'Create memorable shopping experiences through strategic layouts, visual merchandising, lighting, and customer-centric design that enhances engagement and sales.' },
      { title: 'Restaurant & Café Interior Design', desc: 'Build inviting dining environments that align with your brand identity while maximizing functionality, customer comfort, and operational efficiency.' },
      { title: 'Clinic & Healthcare Interior Design', desc: 'Design professional, welcoming healthcare spaces that prioritize patient comfort, workflow efficiency, and compliance requirements.' },
      { title: 'Hospitality Interior Design', desc: 'Transform hotels, resorts, lounges, and guest spaces into memorable experiences that leave lasting impressions on visitors.' },
      { title: 'Showroom & Experience Center Design', desc: 'Create immersive environments that effectively showcase products, strengthen brand perception, and drive customer interaction.' },
    ],
  },
  {
    id: 'budget',
    icon: 'budget',
    slug: 'Budget-Interior-Design',
    title: 'Budget Interior Design Services',
    intro: 'Looking for affordable interior designers?',
    points: [
      'Per room design',
      'Per sq. ft pricing',
      'Consultation-only services',
      'Renovation and makeover packages',
    ],
    tagline: 'Ideal for budget-conscious homeowners and startups.',
    subsections: [
      { title: 'Budget Home Interiors', desc: 'Transform your home with practical layouts, cost-effective materials, and creative design ideas that make the most of your available budget.' },
      { title: 'Apartment & Flat Interior Design', desc: 'Optimize compact spaces with smart storage solutions, multifunctional furniture, and modern design concepts that enhance both style and functionality.' },
      { title: 'Rental Property Makeovers', desc: 'Create attractive and durable interiors that improve the appeal of rental properties while keeping renovation costs under control.' },
      { title: 'Modular Kitchen Design', desc: 'Discover affordable kitchen solutions that combine functionality, organization, and modern aesthetics within your budget range.' },
      { title: 'Living Room & Bedroom Design', desc: 'Refresh your most-used spaces with carefully selected furniture, lighting, décor, and color schemes that create maximum impact for minimal investment.' },
      { title: 'Small Business Interior Design', desc: 'Find budget-conscious design solutions for cafés, salons, offices, retail stores, and other commercial spaces.' },
    ],
  },
  {
    id: 'style',
    icon: 'style',
    slug: 'Style-Based-Interior-Design',
    title: 'Style-Based Interior Design',
    intro: 'Discover designers specializing in:',
    points: [
      'Modern interiors',
      'Minimalist design',
      'Scandinavian style',
      'Luxury interiors',
      'Contemporary design',
      'Industrial style',
    ],
    tagline: 'Find a designer that matches your vision.',
    styles: [
      { name: 'Japandi', desc: 'A perfect blend of Japanese simplicity and Scandinavian warmth, Japandi focuses on natural materials, neutral palettes, clean lines, and functional living spaces.', ideal: 'Modern apartments, minimalist homes, calm and clutter-free interiors' },
      { name: 'Modern', desc: 'Characterized by sleek furniture, clean layouts, and sophisticated finishes, modern interiors create timeless spaces that balance style and functionality.', ideal: 'Urban homes, contemporary apartments, modern office spaces' },
      { name: 'Minimalist', desc: 'Less clutter. More purpose. Minimalist interiors focus on simplicity, functionality, and intentional design choices that create spacious and relaxing environments.', ideal: 'Compact apartments, professionals, modern family homes' },
      { name: 'Scandinavian', desc: 'Inspired by Nordic living, Scandinavian interiors combine comfort, functionality, natural light, and warm textures.', ideal: 'Cozy homes, open-plan living spaces, budget-friendly modern interiors' },
      { name: 'Contemporary', desc: 'Contemporary design embraces current trends while maintaining elegance and flexibility. It often combines clean lines, innovative materials, and sophisticated color palettes.', ideal: 'New homes, luxury apartments, commercial spaces' },
      { name: 'Industrial', desc: 'Raw textures, exposed materials, metal finishes, and urban-inspired aesthetics define industrial interiors.', ideal: 'Cafés, restaurants, creative offices, loft-style homes' },
      { name: 'Traditional & Classic', desc: 'Elegant detailing, timeless furniture, rich materials, and sophisticated craftsmanship create a sense of heritage and luxury.', ideal: 'Villas, bungalows, luxury residences' },
      { name: 'Luxury', desc: 'Premium finishes, custom furniture, layered textures, and thoughtful detailing come together to create exceptional living experiences.', ideal: 'High-end residences, luxury apartments, premium commercial projects' },
    ],
  },
  {
    id: 'student',
    icon: 'student',
    slug: 'Student-Emerging-Designers',
    title: 'Student & Emerging Designers',
    intro: 'Support fresh talent while staying within budget.',
    points: [
      'Connect with final-year interior design students',
      'Hire recent graduates and emerging professionals',
      'Creative, affordable solutions for homes and businesses',
      'Fresh perspectives and modern design thinking',
      'Flexible pricing and personalized attention',
    ],
    tagline: 'Great for homeowners wanting unique, creative spaces while supporting the next generation of design talent.',
    whyChoose: [
      { title: 'Fresh Ideas & Contemporary Design Thinking', desc: 'Emerging designers often bring new perspectives, modern aesthetics, and innovative approaches influenced by the latest design trends and technologies.' },
      { title: 'Personalized Attention', desc: 'Unlike larger firms managing multiple projects simultaneously, many early-career designers can dedicate significant attention to understanding your requirements and vision.' },
      { title: 'Budget-Friendly Solutions', desc: 'Student and emerging designers often provide cost-effective design services, making professional interior design more accessible for homeowners, startups, and small businesses.' },
      { title: 'Passion & Creativity', desc: 'Building a strong portfolio is crucial for designers starting their careers, which means many are highly motivated to deliver exceptional work and create meaningful client experiences.' },
    ],
  },
];

const howItWorks = [
  { step: '01', title: 'Share Your Requirements', desc: 'Tell us about your project, property type, preferred style, budget, and timeline.' },
  { step: '02', title: 'Connect With Designers', desc: 'Receive responses from interior designers suited to your project needs.' },
  { step: '03', title: 'Review Portfolios', desc: 'Explore previous work, compare approaches, and evaluate design expertise.' },
  { step: '04', title: 'Start Your Design Journey', desc: 'Select the right designer and begin transforming your space.' },
];

/* ── sub-components ─────────────────────────────────────────── */
function ServiceCard({ service, index }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = icons[service.icon];
  const isEven = index % 2 === 0;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
      {/* accent top bar */}
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_DARK})` }} />

      <div className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">

          {/* left: icon + heading + bullets */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${ACCENT}15`, color: ACCENT }}>
                {Icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{service.title}</h2>
                <p className="text-sm text-slate-500 mt-0.5">{service.intro}</p>
              </div>
            </div>

            <ul className="space-y-2 mb-4">
              {service.points.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span style={{ color: ACCENT }}>{icons.check}</span>
                  {p}
                </li>
              ))}
            </ul>

            <p className="text-sm text-slate-500 italic mb-4">{service.tagline}</p>

            <div className="flex gap-3">
              <Link href={`/service/${service.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl text-white transition hover:opacity-90"
                style={{ background: ACCENT }}>
                Learn More →
              </Link>
              <button onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                {expanded ? '− Hide Details' : '+ View Details'}
              </button>
            </div>
          </div>

          {/* right: style grid (only for style-based service) */}
          {service.styles && (
            <div className="lg:w-72 flex-shrink-0">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Design Styles</p>
              <div className="grid grid-cols-2 gap-2">
                {service.styles.slice(0, 6).map((s, i) => (
                  <div key={i} className="rounded-xl px-3 py-2 text-xs font-medium text-center"
                    style={{ background: `${ACCENT}10`, color: ACCENT_DARK }}>
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* right: why choose (only for student) */}
          {service.whyChoose && (
            <div className="lg:w-72 flex-shrink-0">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Why Choose Emerging Designers?</p>
              <div className="space-y-2">
                {service.whyChoose.slice(0, 3).map((w, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-[10px] font-bold"
                      style={{ background: ACCENT }}>{i + 1}</span>
                    <p className="text-xs text-slate-600">{w.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* expanded detail panel */}
        {expanded && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            {service.subsections && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {service.subsections.map((sub, i) => (
                  <div key={i} className="rounded-2xl p-4" style={{ background: `${ACCENT}08` }}>
                    <h4 className="text-sm font-semibold text-slate-800 mb-1.5">{sub.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{sub.desc}</p>
                  </div>
                ))}
              </div>
            )}
            {service.styles && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {service.styles.map((s, i) => (
                  <div key={i} className="rounded-2xl p-4 border border-slate-100">
                    <h4 className="text-sm font-semibold mb-1.5" style={{ color: ACCENT_DARK }}>{s.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2">{s.desc}</p>
                    <p className="text-[11px] text-slate-400 italic">Ideal for: {s.ideal}</p>
                  </div>
                ))}
              </div>
            )}
            {service.whyChoose && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.whyChoose.map((w, i) => (
                  <div key={i} className="rounded-2xl p-4 border border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-800 mb-1.5">{w.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{w.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── main component ─────────────────────────────────────────── */
const ServiceSection = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container" style={{ maxWidth: 1120 }}>

        {/* ── Page intro ── */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: `${ACCENT}15`, color: ACCENT }}>
            What We Offer
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Our Interior Design Services
          </h1>
          <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Interinest connects you with professional interior designers for residential and commercial
            projects across India. Explore design services tailored to your space, style, and budget.
          </p>
        </div>

        {/* ── Service cards ── */}
        <div className="mb-12">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* ── How It Works ── */}
        <div className="rounded-3xl overflow-hidden mb-12"
          style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)` }}>
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">How It Works</h2>
              <p className="text-white/70 text-sm">Get connected with the right interior designer in 4 simple steps</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-lg font-black"
                    style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                    {step.step}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-white/65 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center bg-white rounded-3xl border border-slate-100 shadow-sm p-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Ready to Transform Your Space?</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-xl mx-auto">
            Browse portfolios, compare designers, and connect with the right interior design professional for your project — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/designers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: ACCENT }}>
              Browse Designers
            </Link>
            <Link href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition">
              View Projects
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ServiceSection;
