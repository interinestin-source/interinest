import React, { Fragment, useState } from 'react';
import Logo from '/public/images/logo-2.svg'
import Link from "next/link";
import Image from 'next/image'
import MobileMenu from '../../components/MobileMenu/MobileMenu'
import Projects from '../../api/project'


const Header2 = (props) => {
    const [menuActive, setMenuState] = useState(false);

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    const SubmitHandler = (e) => {
        e.preventDefault()
    }

    return (
        <header id="header" >
            <div className={`wpo-site-header ${props.hclass}`}>
                <nav className="navigation navbar navbar-expand-lg navbar-light">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col-lg-3 col-md-3 col-3 d-lg-none dl-block">
                                <div className="mobail-menu">
                                    <MobileMenu />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-6 col-6">
                                <div className="navbar-header">
                                    <Link onClick={ClickHandler} className="navbar-brand" href="/home"><Image src={Logo}
                                        alt="" /></Link>
                                </div>
                            </div>
                            <div className="col-lg-9 col-md-1 col-1">
                                <div id="navbar" className="collapse navbar-collapse navigation-holder">
                                    <button className="menu-close"><i className="ti-close"></i></button>
                                    <ul className="nav navbar-nav mb-2 mb-lg-0">
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} href="/">Home</Link>
                                            <ul className="sub-menu">
                                                <li><Link onClick={ClickHandler} href="/home">Home Style 1</Link></li>
                                                <li><Link onClick={ClickHandler} href="/home2">Home Style 2</Link></li>
                                                <li><Link onClick={ClickHandler} href="/home3">Home Style 3</Link></li>
                                                <li><Link onClick={ClickHandler} href="/home4">Home Style 4</Link></li>
                                                <li><Link onClick={ClickHandler} href="/home5">Home Style 5</Link></li>
                                            </ul>
                                        </li>
                                        <li><Link onClick={ClickHandler} href="/about">About</Link></li>
                                        <li className="menu-item-has-children">
                                            <Link href="/service">Service</Link>
                                            <ul className="sub-menu">
                                                <li><Link onClick={ClickHandler} href="/service">Service</Link></li>
                                                <li><Link onClick={ClickHandler} href="/service-s2">Service S2</Link></li>
                                                <li><Link onClick={ClickHandler} href="/service/Perfect-Planning">Service Single</Link></li>
                                            </ul>
                                        </li>
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} href="/project">Project</Link>
                                            <ul className="sub-menu">
                                                <li><Link onClick={ClickHandler} href="/project">Project</Link></li>
                                                <li><Link onClick={ClickHandler} href="/project-s2">Project S2</Link></li>
                                                <li><Link onClick={ClickHandler} href="/project/Architecture-Design">Project Single</Link></li>
                                            </ul>
                                        </li>
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} href="/blog">Blog</Link>
                                            <ul className="sub-menu">
                                                <li><Link onClick={ClickHandler} href="/blog">Blog right sidebar</Link></li>
                                                <li><Link onClick={ClickHandler} href="/blog-left-sidebar">Blog left sidebar</Link></li>
                                                <li><Link onClick={ClickHandler} href="/blog-fullwidth">Blog fullwidth</Link></li>
                                                <li className="menu-item-has-children">
                                                    <Link onClick={ClickHandler} href="/">Blog details</Link>
                                                    <ul className="sub-menu">
                                                        <li><Link onClick={ClickHandler} href="/blog-single/Best-Architecture-Design">Blog details right sidebar</Link>
                                                        </li>
                                                        <li><Link onClick={ClickHandler} href="/blog-single-left-sidebar/Best-Architecture-Design">Blog details left
                                                            sidebar</Link></li>
                                                        <li><Link onClick={ClickHandler} href="/blog-single-fullwidth/Best-Architecture-Design">Blog details
                                                            fullwidth</Link></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} href="/">Pages</Link>
                                            <ul className="sub-menu">
                                                <li><Link onClick={ClickHandler} href="/shop">Shop</Link></li>
                                                <li><Link onClick={ClickHandler} href="/product-single/Black-Timber-Chairs">Shop Single</Link></li>
                                                <li><Link onClick={ClickHandler} href="/cart">Cart</Link></li>
                                                <li><Link onClick={ClickHandler} href="/checkout">Checkout</Link></li>
                                                <li><Link onClick={ClickHandler} href="/pricing">Pricing</Link></li>
                                                <li><Link onClick={ClickHandler} href="/team-single/William-Watson">Team Single</Link></li>
                                                <li><Link onClick={ClickHandler} href="/testimonial">Testimonial</Link></li>
                                                <li><Link onClick={ClickHandler} href="/404">404 Error</Link></li>
                                                <li><Link onClick={ClickHandler} href="/login">Login</Link></li>
                                                <li><Link onClick={ClickHandler} href="/register">Register</Link></li>
                                            </ul>
                                        </li>
                                        <li><Link onClick={ClickHandler} href="/contact">Contact</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-1 col-md-1 col-2">
                                <div className="header-right">
                                    <div className="header-right-menu-wrapper">
                                        <div className="header-right-menu">
                                            <div className="right-menu-toggle-btn" onClick={() => setMenuState(!menuActive)}>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                            <div className={`header-right-menu-wrap ${menuActive ? "right-menu-active" : ""}`}>
                                                <button onClick={() => setMenuState(!menuActive)} className="right-menu-close"><i className="ti-close"></i></button>
                                                <div className="logo"><Image src={Logo} alt="" /></div>
                                                <div className="header-right-sec">
                                                    <div className="project-widget widget">
                                                        <h3>Our Latest Projects</h3>
                                                        <ul>
                                                            {Projects.slice(0, 6).map((project, pot) => (
                                                                <li key={pot}><Link onClick={ClickHandler} href='/project/[slug]' as={`/project/${project.slug}`}><Image src={project.pImg} alt="" /></Link></li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="widget wpo-contact-widget">
                                                        <div className="widget-title">
                                                            <h3>Contact Us</h3>
                                                        </div>
                                                        <div className="contact-ft">
                                                            <ul>
                                                                <li><i className="fi flaticon-location"></i>68D, Belsion Town
                                                                    2365 <br /> Fna city, LH 3656, USA</li>
                                                                <li><i className="fi flaticon-telephone"></i>+ 8 (123) 123 456
                                                                    789 <br />
                                                                    + 8 (123) 123 456 789</li>
                                                                <li><i className="fi flaticon-email"></i>arkio@gmail.com</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="widget newsletter-widget">
                                                        <div className="widget-title">
                                                            <h3>Newsletter</h3>
                                                        </div>
                                                        <form onSubmit={SubmitHandler}>
                                                            <div className="input-1">
                                                                <input type="email" className="form-control"
                                                                    placeholder="Email Address *" required="" />
                                                                <div className="submit clearfix">
                                                                    <button type="submit"><i className="ti-email"></i></button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header2;