import React from 'react'
import Services from '../../../api/service';
import Link from 'next/link'

const ServiceSidebar = (props) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <div className="col-lg-4 col-12">
            <div className="blog-sidebar">
                <div className="widget category-widget">
                    <h3>Our Services</h3>
                    <ul>
                        {Services.slice(0, 6).map((service, i) => (
                            <li key={i}>
                                <Link onClick={ClickHandler} href='/service/[slug]' as={`/service/${service.slug}`}>
                                    {service.sTitle}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="widget" style={{ background: '#f8fafc', borderRadius: 16, padding: '24px 20px', marginTop: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>
                        Ready to Start?
                    </h3>
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 16 }}>
                        Connect with professional interior designers across India for your home or commercial project.
                    </p>
                    <Link href="/designers" onClick={ClickHandler}
                        style={{ display: 'block', textAlign: 'center', padding: '10px 0', background: '#7593b4', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                        Browse Designers
                    </Link>
                    <Link href="/contact" onClick={ClickHandler}
                        style={{ display: 'block', textAlign: 'center', padding: '10px 0', marginTop: 10, border: '1.5px solid #7593b4', color: '#7593b4', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ServiceSidebar;
