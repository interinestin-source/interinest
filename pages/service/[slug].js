import React, { Fragment } from 'react';
import { useRouter } from 'next/router'
import Services from '../../api/service'
import ServiceSidebar from './single/sidebar';
import PageTitle from '../../components/pagetitle/PageTitle';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import RelatedService from './single/related';
import Discuss from './single/discuss';
import Logo from '@/public/images/logo-interinest.png'
import Image from 'next/image'

import pImg1 from '@/public/images/service-single/2.jpg'
import pImg2 from '@/public/images/service-single/3.jpg'

const ACCENT = "#7593b4";

const ServiceSinglePage = (props) => {
    const router = useRouter()
    const serviceDetails = Services.find(item => item.slug === router.query.slug)

    return (
        <Fragment>
            <Navbar Logo={Logo} />
            <PageTitle pageTitle={serviceDetails?.sTitle} pagesub={serviceDetails?.sTitle} />
            <div className="wpo-service-single-area section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-12">
                            <div className="wpo-service-single-wrap">

                                {/* ── Main hero image ── */}
                                <div className="wpo-service-single-item">
                                    <div className="wpo-service-single-main-img">
                                        <Image src={serviceDetails?.sImg} alt={serviceDetails?.sTitle || 'service'} />
                                    </div>

                                    {/* ── Intro text ── */}
                                    <div className="wpo-service-single-title mt-4">
                                        <h3>{serviceDetails?.sTitle}</h3>
                                    </div>
                                    <p>{serviceDetails?.description}</p>
                                    {serviceDetails?.des2 && <p>{serviceDetails.des2}</p>}

                                    {/* ── Two supporting images (only when no rich content) ── */}
                                    {!serviceDetails?.subsections && !serviceDetails?.styles && (
                                        <div className="row mt-4">
                                            <div className="col-md-6 col-sm-6 col-12">
                                                <div className="wpo-p-details-img">
                                                    <Image src={pImg1} alt="" />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-12">
                                                <div className="wpo-p-details-img">
                                                    <Image src={pImg2} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ── Sub-solutions grid (rich content) ── */}
                                {serviceDetails?.subsections && (
                                    <div className="wpo-service-single-item">
                                        <div className="wpo-service-single-title">
                                            <h3>Our {serviceDetails.sTitle} Solutions</h3>
                                        </div>
                                        <div className="row mt-3">
                                            {serviceDetails.subsections.map((sub, i) => (
                                                <div className="col-md-6 col-12 mb-4" key={i}>
                                                    <div style={{
                                                        background: '#f8fafc',
                                                        borderRadius: 14,
                                                        padding: '20px 22px',
                                                        borderLeft: `3px solid ${ACCENT}`,
                                                        height: '100%',
                                                    }}>
                                                        <h5 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                                                            {sub.title}
                                                        </h5>
                                                        <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
                                                            {sub.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ── How It Works (rich content) ── */}
                                {serviceDetails?.howItWorks && (
                                    <div className="wpo-service-single-item">
                                        <div className="wpo-service-single-title">
                                            <h3>How It Works</h3>
                                        </div>
                                        <div className="row mt-3">
                                            {serviceDetails.howItWorks.map((step, i) => (
                                                <div className="col-md-6 col-12 mb-4" key={i}>
                                                    <div style={{
                                                        display: 'flex',
                                                        gap: 16,
                                                        alignItems: 'flex-start',
                                                        background: '#fff',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: 14,
                                                        padding: '18px 20px',
                                                        height: '100%',
                                                    }}>
                                                        <div style={{
                                                            width: 44,
                                                            height: 44,
                                                            borderRadius: 12,
                                                            background: ACCENT,
                                                            color: '#fff',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 800,
                                                            fontSize: 14,
                                                            flexShrink: 0,
                                                        }}>
                                                            {step.step}
                                                        </div>
                                                        <div>
                                                            <h5 style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
                                                                {step.title}
                                                            </h5>
                                                            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                                                                {step.desc}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ── Style cards (style-based service) ── */}
                                {serviceDetails?.styles && (
                                    <div className="wpo-service-single-item">
                                        <div className="wpo-service-single-title">
                                            <h3>{serviceDetails.stylesTitle || 'Explore Interior Designers by Style'}</h3>
                                        </div>
                                        <div className="row mt-3">
                                            {serviceDetails.styles.map((style, i) => (
                                                <div className="col-md-6 col-12 mb-4" key={i}>
                                                    <div style={{
                                                        background: '#f8fafc',
                                                        borderRadius: 14,
                                                        padding: '20px 22px',
                                                        borderLeft: `3px solid ${ACCENT}`,
                                                        height: '100%',
                                                    }}>
                                                        <h5 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                                                            {style.name}
                                                        </h5>
                                                        <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.7, marginBottom: 10 }}>
                                                            {style.desc}
                                                        </p>
                                                        {style.idealFor && (
                                                            <div>
                                                                <p style={{ fontSize: 11.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                                                                    Ideal for
                                                                </p>
                                                                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                                    {style.idealFor.map((tag, j) => (
                                                                        <li key={j} style={{
                                                                            fontSize: 12,
                                                                            background: `${ACCENT}15`,
                                                                            color: ACCENT,
                                                                            borderRadius: 20,
                                                                            padding: '3px 10px',
                                                                            fontWeight: 600,
                                                                        }}>
                                                                            {tag}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ── Fallback: Capabilities (only for services without rich content) ── */}
                                {!serviceDetails?.subsections && !serviceDetails?.styles && (
                                    <>
                                        <div className="wpo-service-single-item list-widget">
                                            <div className="wpo-service-single-title">
                                                <h3>Our Capabilities</h3>
                                            </div>
                                            <p>{serviceDetails?.des3}</p>
                                        </div>
                                        <div className="wpo-service-single-item">
                                            <div className="wpo-service-single-title">
                                                <h3>Our Approach</h3>
                                            </div>
                                            <p>We begin with a deep understanding of your space, lifestyle, and vision. Every design decision is guided by your requirements, resulting in spaces that are both beautiful and highly functional.</p>
                                        </div>
                                    </>
                                )}

                                <RelatedService />
                                <Discuss />
                            </div>
                        </div>
                        <ServiceSidebar />
                    </div>
                </div>
            </div>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};

export default ServiceSinglePage;
