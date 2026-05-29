import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "../MobileMenu/MobileMenu";
import { totalPrice } from "../../utils";
import { connect } from "react-redux";
import { removeFromCart } from "../../store/actions/action";

const Header = (props) => {
  const [menuActive, setMenuState] = useState(false);
  const [cartActive, setcartState] = useState(false);
  const [authUser, setAuthUser] = useState(null); // { uid, role, initial }
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Read auth cookies on mount
  useEffect(() => {
    const getCookie = (name) => {
      const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return m ? decodeURIComponent(m[2]) : null;
    };
    const uid = getCookie("uid");
    const role = getCookie("role");
    if (uid && role) {
      setAuthUser({ uid, role });
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getDashboardHref = (role) => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "designer") return "/dashboard/designer-dashboard";
    return "/dashboard/login";
  };

  const handleLogout = () => {
    document.cookie = "uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setAuthUser(null);
    setDropdownOpen(false);
    window.location.href = "/";
  };

  const SubmitHandler = (e) => {
    e.preventDefault();
  };

  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };
  const { carts } = props;

  return (
    <header id="header">
      <div className={`wpo-site-header ${props.hclass}`}>
        <nav className="navigation navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-lg-3 col-md-3 col-3 d-lg-none dl-block">
                <div className="mobail-menu">
                  <MobileMenu />
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-6">
                <div className="navbar-header">
                  <Link
                    onClick={ClickHandler}
                    className="navbar-brand"
                    href="/home"
                  >
                    {/* <Image src={props.Logo} alt="logo" /> */}
                    {/* <Image src="/images/home.png"  width={200} height={200} 
                                        className="w-5 h-5 object-fit" alt="logo" /> */}
                    <Image
                      src="/images/logo-interinest-bg.png"
                      width={200}
                      height={200}
                      className=""
                      alt="logo"
                    />
                  </Link>
                </div>
              </div>
              <div className="col-lg-6 col-md-1 col-1">
                <div
                  id="navbar"
                  className="collapse navbar-collapse navigation-holder"
                >
                  <button className="menu-close">
                    <i className="ti-close"></i>
                  </button>
                  <ul className="nav navbar-nav mb-2 mb-lg-0">
                    <li className="menu-item-has-children">
                      <Link onClick={ClickHandler} href="/">
                        Home
                      </Link>
                      {/* <ul className="sub-menu">
                                                <li><Link onClick={ClickHandler} href="/home">Home Style 1</Link></li>
                                                <li><Link onClick={ClickHandler} href="/home2">Home Style 2</Link></li>
                                                <li><Link onClick={ClickHandler} href="/home3">Home Style 3</Link></li>
                                                <li><Link onClick={ClickHandler} href="/home4">Home Style 4</Link></li>
                                                <li><Link onClick={ClickHandler} href="/home5">Home Style 5</Link></li>
                                            </ul> */}
                    </li>
                    <li>
                      <Link onClick={ClickHandler} href="/home#about-us">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link onClick={ClickHandler} href="/designers">
                        Designers
                      </Link>
                    </li>
                    <li>
                      <Link onClick={ClickHandler} href="/projects">
                        Projects
                      </Link>
                    </li>
                    {/* <li className="menu-item-has-children">
                      <Link href="/service">Service</Link>
                      <ul className="sub-menu">
                        <li>
                          <Link onClick={ClickHandler} href="/service">
                            Service
                          </Link>
                        </li>
                        <li>
                          <Link onClick={ClickHandler} href="/service-s2">
                            Service S2
                          </Link>
                        </li>
                        <li>
                          <Link
                            onClick={ClickHandler}
                            href="/service/Perfect-Planning"
                          >
                            Service Single
                          </Link>
                        </li>
                      </ul>
                    </li> */}
                    {/* <li className="menu-item-has-children">
                      <Link onClick={ClickHandler} href="/project">
                        Project
                      </Link>
                      <ul className="sub-menu">
                        <li>
                          <Link onClick={ClickHandler} href="/project">
                            Project
                          </Link>
                        </li>
                        <li>
                          <Link onClick={ClickHandler} href="/project-s2">
                            Project S2
                          </Link>
                        </li>
                        <li>
                          <Link
                            onClick={ClickHandler}
                            href="/project/Architecture-Design"
                          >
                            Project Single
                          </Link>
                        </li>
                      </ul>
                    </li> */}
                    {/* <li className="menu-item-has-children">
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
                                        </li> */}
                    {/* <li className="menu-item-has-children">
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
                                        </li> */}
                    <li>
                      <Link onClick={ClickHandler} href="/contact">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-2 col-2">
                <div className="header-right">
                  {authUser ? (
                    /* ── Logged-in: profile avatar + dropdown ── */
                    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
                      <button
                        onClick={() => setDropdownOpen((o) => !o)}
                        style={{
                          display: "flex", alignItems: "center", gap: "8px",
                          background: "none", border: "1px solid rgba(255,255,255,0.35)",
                          borderRadius: "50px", padding: "6px 14px 6px 6px",
                          cursor: "pointer", color: "inherit",
                        }}
                        aria-label="Account menu"
                      >
                        {/* Avatar circle */}
                        <span style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: "#7593b4", color: "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 700, fontSize: 14, flexShrink: 0,
                        }}>
                          {authUser.role === "admin" ? "A"
                            : authUser.role === "designer" ? "D"
                            : "U"}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 500, textTransform: "capitalize" }}>
                          {authUser.role}
                        </span>
                        {/* Chevron */}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                          style={{ transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "none" }}>
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>

                      {/* Dropdown */}
                      {dropdownOpen && (
                        <div style={{
                          position: "absolute", top: "calc(100% + 10px)", right: 0,
                          minWidth: 180, background: "#fff", borderRadius: 14,
                          boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid #e8edf2",
                          overflow: "hidden", zIndex: 9999,
                        }}>
                          {/* Role badge */}
                          <div style={{
                            padding: "10px 16px 8px", borderBottom: "1px solid #f0f0f0",
                            fontSize: 11, color: "#7593b4", fontWeight: 600,
                            textTransform: "uppercase", letterSpacing: "0.08em",
                          }}>
                            Signed in as {authUser.role}
                          </div>

                          {/* Dashboard link */}
                          <Link
                            href={getDashboardHref(authUser.role)}
                            onClick={() => setDropdownOpen(false)}
                            style={{
                              display: "flex", alignItems: "center", gap: 10,
                              padding: "11px 16px", fontSize: 14, color: "#1e293b",
                              textDecoration: "none", transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#f5f8fb"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                              stroke="#7593b4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="7" height="7" rx="1" />
                              <rect x="14" y="3" width="7" height="7" rx="1" />
                              <rect x="3" y="14" width="7" height="7" rx="1" />
                              <rect x="14" y="14" width="7" height="7" rx="1" />
                            </svg>
                            Dashboard
                          </Link>

                          {/* Divider */}
                          <div style={{ height: 1, background: "#f0f0f0", margin: "0 12px" }} />

                          {/* Logout */}
                          <button
                            onClick={handleLogout}
                            style={{
                              display: "flex", alignItems: "center", gap: 10,
                              width: "100%", padding: "11px 16px",
                              fontSize: 14, color: "#dc2626",
                              background: "none", border: "none", cursor: "pointer",
                              textAlign: "left", transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                              stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                              <polyline points="16 17 21 12 16 7" />
                              <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* ── Not logged in: Login button ── */
                    <div data-swiper-parallax="400" className="slide-btn">
                      <Link href="/dashboard/login" className="theme-btn">
                        Login
                      </Link>
                    </div>
                  )}

                  {/* <div className="header-search-form-wrapper">
                                        <div className="cart-search-contact">
                                            <button onClick={() => setMenuState(!menuActive)} className="search-toggle-btn"><i
                                                className={`fi ti-search ${menuActive ? "ti-close" : "fi "}`}></i></button>
                                            <div className={`header-search-form ${menuActive ? "header-search-content-toggle" : ""}`}>
                                                <form onSubmit={SubmitHandler}>
                                                    <div>
                                                        <input type="text" className="form-control"
                                                            placeholder="Search here..." />
                                                        <button type="submit"><i
                                                            className="fi ti-search"></i></button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div> */}
                  {/* <div className="mini-cart">
                                        <button className="cart-toggle-btn" onClick={() => setcartState(!cartActive)}>
                                            {" "}
                                            <i className="fi flaticon-shopping-cart"></i>{" "}
                                            <span className="cart-count">{carts.length}</span>
                                        </button>
                                        <div className={`mini-cart-content ${cartActive ? "mini-cart-content-toggle" : ""}`}>
                                            <button className="mini-cart-close" onClick={() => setcartState(!cartActive)}><i className="ti-close"></i></button>
                                            <div className="mini-cart-items">
                                                {carts &&
                                                    carts.length > 0 &&
                                                    carts.map((catItem, crt) => (
                                                        <div className="mini-cart-item clearfix" key={crt}>
                                                            <div className="mini-cart-item-image">
                                                                <span>
                                                                    <img src={catItem.proImg} alt="icon" />
                                                                </span>
                                                            </div>
                                                            <div className="mini-cart-item-des">
                                                                <p>{catItem.title} </p>
                                                                <span className="mini-cart-item-price">
                                                                    ${catItem.price} x {" "} {catItem.qty}
                                                                </span>
                                                                <span className="mini-cart-item-quantity">
                                                                    <button
                                                                        onClick={() =>
                                                                            props.removeFromCart(catItem.id)
                                                                        }
                                                                        className="btn btn-sm btn-danger"
                                                                    >
                                                                        <i className="ti-close"></i>
                                                                    </button>{" "}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                            <div className="mini-cart-action clearfix">
                                                <span className="mini-checkout-price">Subtotal: <span> ${totalPrice(carts)}</span></span>
                                                <div className="mini-btn">
                                                    <Link href="/checkout" className="view-cart-btn s1">Checkout</Link>
                                                    <Link href="/cart" className="view-cart-btn">View Cart</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

const mapStateToProps = (state) => {
  return {
    carts: state.cartList.cart,
  };
};
export default connect(mapStateToProps, { removeFromCart })(Header);
