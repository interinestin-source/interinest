import React from 'react'
import Link from "next/link";
import Services from '../../api/service';
import Projects from '../../api/project'
import Image from 'next/image'


const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const Footer = (props) => {
    return (
        <footer className={`wpo-site-footer ${props.ftClass}`}>
            <div className="wpo-upper-footer">
                <div className="container">
                    <div className="row">
                        <div className="col col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="widget about-widget">
                                <div className="logo widget-title">
                                    <Link onClick={ClickHandler} className="logo" href="/">
                                        <div style={{ background: "rgba(255,255,255,0.92)", borderRadius: 10, padding: "6px 14px", display: "inline-block" }}>
                                          <Image src="/images/logo-interinest.png" width={150} height={46}
                                          className="object-contain" alt="Interinest" style={{ mixBlendMode: "multiply" }} />
                                        </div>
                                    </Link>
                                </div>
                                <p>Interinest is a curated marketplace for discovering and hiring independent interior designers in India. We empower design professionals and help clients bring their spaces to life.</p>
                                <ul>
                                    <li>
                                        <Link onClick={ClickHandler} href="/">
                                            <i className="ti-facebook"></i>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link onClick={ClickHandler} href="/">
                                            <i className="ti-twitter-alt"></i>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link onClick={ClickHandler} href="https://www.instagram.com/interinest/">
                                            <i className="ti-instagram"></i>
                                        </Link>
                                    </li>

                                </ul>
                            </div>
                        </div>
                        <div className="col col-xl-3  col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="widget link-widget">
                                <div className="widget-title">
                                    <h3>Our Services</h3>
                                </div>
                                <ul>
                                    {Services.slice(0, 5).map((service, srv) => (
                                        <li key={srv}><Link onClick={ClickHandler} href='/service/[slug]' as={`/service/${service.slug}`}>{service.sTitle}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {/* <div className="col col-xl-3  col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="widget wpo-service-link-widget">
                                <div className="widget-title">
                                    <h3>Contact </h3>
                                </div>
                                <div className="contact-ft">
                                    <ul>
                                        <li><i className="fi flaticon-location"></i>68D, Belsion Town 2365 <br /> Fna city, LH
                                            3656, USA</li>
                                        <li><i className="fi flaticon-telephone"></i>+ 8 (123) 123 456 789 <br />
                                            + 8 (123) 123 456 789</li>
                                        <li><i className="fi flaticon-email"></i>interinest.in@gmail.com</li>
                                    </ul>
                                </div>
                            </div>
                        </div> */}

                        <div className="col col-xl-3  col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="widget instagram">
                                <div className="widget-title">
                                    <h3>Our Gallery</h3>
                                </div>
                                <ul className="d-flex">
                                    {Projects.slice(0, 6).map((project, srv) => (
                                        <li key={srv}><Link onClick={ClickHandler} href='/project/[slug]' as={`/project/${project.slug}`}><Image src={project.pImg} alt="" /></Link></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="wpo-lower-footer">
                <div className="container">
                    <div className="row">
                        <div className="col col-xs-12">
                            <ul>
                                <li>&copy; 2026 Interinest. All Rights
                                    Reserved.</li>
                                <li><Link onClick={ClickHandler} href="/">Terms of use |</Link> <Link onClick={ClickHandler} href="/">Privacy Environmental Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;