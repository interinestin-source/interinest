import React, { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Link from 'next/link';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

const DesignerDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [designer, setDesigner] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null); // url or null

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'interinestUsers', id));
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };
          setDesigner(data);
          // fetch this designer's published projects
          const pq = query(collection(db, 'projects'), where('uid', '==', id), where('status', '==', 'Published'));
          const pSnap = await getDocs(pq);
          setProjects(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return (
    <Fragment>
      <Navbar />
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#7593b4' }}>
          <div style={{ width: 40, height: 40, border: '4px solid #7593b4', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p>Loading profile...</p>
        </div>
      </div>
      <Footer />
    </Fragment>
  );

  if (!designer) return (
    <Fragment>
      <Navbar />
      <PageTitle pageTitle="Designer Not Found" pagesub="Designers" />
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <p style={{ color: '#64748b', marginBottom: 24 }}>This designer profile could not be found.</p>
        <Link href="/designers" style={{ color: '#7593b4', fontWeight: 600 }}>← Back to Designers</Link>
      </div>
      <Footer />
    </Fragment>
  );

  const initial = designer.fullName?.charAt(0).toUpperCase() || 'D';
  const roleLabel = designer.profileRole === 'studio' ? 'Design Studio / Firm'
    : designer.profileRole === 'student' ? 'Interior Design Student / Fresher'
    : 'Solo Interior Designer';

  return (
    <Fragment>
      <Navbar />
      <PageTitle
        pageTitle={designer.fullName || 'Designer'}
        pagesub="Designer Profile"
        bgImage={designer.imageUrls?.[0] || designer.photoURL}
      />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .tag-chip { display:inline-block; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:500; background:#eef2f7; color:#7593b4; margin:3px; }
        .style-chip { background:#f0fdf4; color:#16a34a; }
        .img-thumb { cursor:pointer; overflow:hidden; border-radius:12px; aspect-ratio:1; background:#f1f5f9; }
        .img-thumb img { width:100%; height:100%; object-fit:cover; transition:transform 0.3s; }
        .img-thumb:hover img { transform:scale(1.06); }
        .info-row { display:flex; align-items:flex-start; gap:10px; padding:12px 0; border-bottom:1px solid #f1f5f9; }
        .info-label { min-width:130px; font-size:12px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.06em; padding-top:1px; }
        .info-value { font-size:14px; color:#1e293b; flex:1; }
      `}</style>

      <div style={{ background: '#f8f4ec', paddingBottom: 80 }}>
        <div className="container" style={{ paddingTop: 48 }}>

          {/* Breadcrumb */}
          <div style={{ marginBottom: 28, fontSize: 13, color: '#94a3b8' }}>
            <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <Link href="/designers" style={{ color: '#94a3b8', textDecoration: 'none' }}>Designers</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#1e293b' }}>{designer.fullName}</span>
          </div>

          <div className="row" style={{ gap: 0 }}>
            {/* ── Left: profile card ── */}
            <div className="col-lg-4" style={{ marginBottom: 24 }}>
              <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', position: 'sticky', top: 100 }}>
                {/* Banner */}
                <div style={{ height: 110, background: 'linear-gradient(135deg,#7593b4 0%,#a3bcd4 100%)', position: 'relative' }}>
                  {designer.imageUrls?.[0] && (
                    <img src={designer.imageUrls[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                  )}
                </div>

                {/* Avatar */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: -36 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: 18, border: '3px solid #fff',
                    background: 'linear-gradient(135deg,#e8f0f7,#cddbe9)',
                    overflow: 'hidden', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 26, fontWeight: 700, color: '#7593b4',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                  }}>
                    {designer.photoURL
                      ? <img src={designer.photoURL} alt={designer.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : initial}
                  </div>
                </div>

                <div style={{ padding: '14px 24px 24px', textAlign: 'center' }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: '0 0 4px' }}>{designer.fullName}</h2>
                  <p style={{ fontSize: 13, color: '#7593b4', fontWeight: 500, margin: '0 0 4px' }}>{roleLabel}</p>
                  {designer.city && (
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {designer.city}{designer.state ? `, ${designer.state}` : ''}
                    </p>
                  )}

                  {/* Contact buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {designer.phone && (
                      <a href={`tel:${designer.phone}`} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        background: '#7593b4', color: '#fff', borderRadius: 12, padding: '10px 0',
                        fontWeight: 600, fontSize: 14, textDecoration: 'none'
                      }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.18 19.79 19.79 0 01.22 4a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                        Call Now
                      </a>
                    )}
                    {designer.email && (
                      <a href={`mailto:${designer.email}`} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        background: '#fff', color: '#7593b4', border: '1.5px solid #7593b4',
                        borderRadius: 12, padding: '10px 0', fontWeight: 600, fontSize: 14, textDecoration: 'none'
                      }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        Send Email
                      </a>
                    )}
                    {designer.instagram && (
                      <a href={`https://instagram.com/${designer.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 13, color: '#7593b4', textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                        Instagram: {designer.instagram}
                      </a>
                    )}
                    {designer.portfolio && (
                      <a href={designer.portfolio} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 13, color: '#7593b4', textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                        View Portfolio ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: details ── */}
            <div className="col-lg-8">
              {/* About */}
              <div style={{ background: '#fff', borderRadius: 20, padding: '28px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>About</h3>

                <div className="info-row">
                  <span className="info-label">Experience</span>
                  <span className="info-value">{designer.experience || '—'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Designer Type</span>
                  <span className="info-value">{roleLabel}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Budget Range</span>
                  <span className="info-value">{designer.budgetRange || '—'}</span>
                </div>
                {designer.notes && (
                  <div className="info-row">
                    <span className="info-label">About</span>
                    <span className="info-value" style={{ lineHeight: 1.6 }}>{designer.notes}</span>
                  </div>
                )}
              </div>

              {/* Services */}
              {Array.isArray(designer.services) && designer.services.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 20, padding: '24px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Services Offered</h3>
                  <div>{designer.services.map(s => <span key={s} className="tag-chip">{s}</span>)}</div>
                </div>
              )}

              {/* Styles */}
              {Array.isArray(designer.styles) && designer.styles.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 20, padding: '24px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Design Styles</h3>
                  <div>{designer.styles.map(s => <span key={s} className={`tag-chip style-chip`}>{s}</span>)}</div>
                </div>
              )}

              {/* Portfolio images */}
              {Array.isArray(designer.imageUrls) && designer.imageUrls.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 20, padding: '24px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>
                    Portfolio <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400 }}>({designer.imageUrls.length} images)</span>
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
                    {designer.imageUrls.map((url, i) => (
                      <div key={i} className="img-thumb" onClick={() => setLightbox(url)}>
                        <img src={url} alt={`Portfolio ${i+1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {projects.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 20, padding: '24px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>Projects by this Designer</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
                    {projects.map(p => (
                      <Link key={p.id} href={`/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ borderRadius: 14, overflow: 'hidden', background: '#f8f4ec', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', transition: 'transform 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
                          onMouseLeave={e => e.currentTarget.style.transform='none'}>
                          <div style={{ height: 130, background: '#e2d6c3', overflow: 'hidden' }}>
                            {p.imageUrls?.[0] && <img src={p.imageUrls[0]} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                          </div>
                          <div style={{ padding: '12px 14px' }}>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', margin: '0 0 4px' }}>{p.title}</p>
                            <p style={{ fontSize: 12, color: '#7593b4', margin: 0 }}>{p.category} · {p.location || ''}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: 20
        }}>
          <img src={lightbox} alt="" style={{ maxWidth: '92vw', maxHeight: '90vh', borderRadius: 12, boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }} />
          <button onClick={() => setLightbox(null)} style={{
            position: 'fixed', top: 20, right: 24, background: 'rgba(255,255,255,0.15)',
            border: 'none', color: '#fff', fontSize: 28, width: 44, height: 44,
            borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>×</button>
        </div>
      )}

      <Footer ftClass="wpo-site-footer-s2" />
      <Scrollbar />
    </Fragment>
  );
};

export default DesignerDetailPage;
