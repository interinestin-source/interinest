import React, { useState } from 'react';
import Link from "next/link";

const ACCENT = "#7593b4";

const menus = [
    { id: 1, title: 'Home',      link: '/' },
    { id: 2, title: 'About',     link: '/home#about-us' },
    { id: 3, title: 'Designers', link: '/designers' },
    { id: 4, title: 'Projects',  link: '/projects' },
    { id: 5, title: 'Services',  link: '/service' },
    { id: 6, title: 'Contact',   link: '/contact' },
    { id: 7, title: 'Login',     link: '/dashboard/login' },
];

const MobileMenu = () => {
    const [menuActive, setMenuState] = useState(false);

    const close = () => setMenuState(false);

    return (
        <>
            {/* Backdrop */}
            {menuActive && (
                <div
                    onClick={close}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.45)',
                        zIndex: 9998,
                    }}
                />
            )}

            {/* Drawer */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0,
                height: '100vh',
                width: 270,
                background: '#fff',
                zIndex: 9999,
                transform: menuActive ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease',
                boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 20px',
                    borderBottom: '1px solid #f0f0f0',
                }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/logo-interinest.png"
                        alt="Interinest"
                        style={{ height: 36, width: 'auto', mixBlendMode: 'multiply' }}
                    />
                    <button
                        onClick={close}
                        aria-label="Close menu"
                        style={{
                            background: '#f5f5f5', border: 'none',
                            borderRadius: '50%', width: 34, height: 34,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: 16, color: '#555',
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Nav items */}
                <nav style={{ flex: 1, padding: '12px 0' }}>
                    {menus.map((item) => (
                        <Link
                            key={item.id}
                            href={item.link}
                            onClick={close}
                            style={{
                                display: 'block',
                                padding: '13px 24px',
                                fontSize: 15,
                                fontWeight: 500,
                                color: item.title === 'Login' ? ACCENT : '#1e293b',
                                textDecoration: 'none',
                                borderBottom: '1px solid #f8f8f8',
                                transition: 'background 0.15s, color 0.15s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = '#f0f5fa';
                                e.currentTarget.style.color = ACCENT;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = item.title === 'Login' ? ACCENT : '#1e293b';
                            }}
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>

                {/* Footer CTA */}
                <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f0f0' }}>
                    <Link
                        href="/dashboard/register"
                        onClick={close}
                        style={{
                            display: 'block', textAlign: 'center',
                            padding: '11px 0',
                            background: ACCENT, color: '#fff',
                            borderRadius: 10, fontWeight: 600, fontSize: 14,
                            textDecoration: 'none',
                        }}
                    >
                        Join as Designer
                    </Link>
                </div>
            </div>

            {/* Hamburger button */}
            <button
                type="button"
                onClick={() => setMenuState(true)}
                aria-label="Open menu"
                style={{
                    background: ACCENT,
                    border: 'none',
                    borderRadius: 8,
                    width: 38, height: 36,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 5, cursor: 'pointer', padding: '0 9px',
                }}
            >
                <span style={{ display: 'block', width: '100%', height: 2, background: '#fff', borderRadius: 2 }} />
                <span style={{ display: 'block', width: '100%', height: 2, background: '#fff', borderRadius: 2 }} />
                <span style={{ display: 'block', width: '100%', height: 2, background: '#fff', borderRadius: 2 }} />
            </button>
        </>
    );
};

export default MobileMenu;
