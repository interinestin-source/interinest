import React, { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Link from 'next/link';
import {
  doc, getDoc, collection, getDocs, addDoc, deleteDoc,
  query, where, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'sonner';
import AuthEnquiryModal from '../../components/AuthEnquiryModal';

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp(`${name}=([^;]+)`));
  return m ? m[1] : null;
}

const BUDGET_OPTIONS = ['Under ₹2 Lakh', '₹2–5 Lakh', '₹5–10 Lakh', '₹10–20 Lakh', '₹20 Lakh+'];

const DesignerDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [designer, setDesigner] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  // Auth + interaction state
  const [uid, setUid] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saveDocId, setSaveDocId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Auth+Enquiry modal (for guests)
  const [showModal, setShowModal] = useState(false);
  const [modalTrigger, setModalTrigger] = useState(null); // 'save' | 'enquiry'

  // Inline enquiry form (for already-logged-in users)
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiry, setInquiry] = useState({ subject: '', budget: '', message: '' });
  const [sendingInquiry, setSendingInquiry] = useState(false);

  useEffect(() => {
    const cookieUid = getCookie('uid');
    setUid(cookieUid);

    if (!id) return;

    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'interinestUsers', id));
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };
          setDesigner(data);
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

  // Check if already saved
  useEffect(() => {
    if (!uid || !id) return;
    const checkSaved = async () => {
      const q = query(
        collection(db, 'savedDesigners'),
        where('userId', '==', uid),
        where('designerId', '==', id)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setSaved(true);
        setSaveDocId(snap.docs[0].id);
      }
    };
    checkSaved().catch(console.error);
  }, [uid, id]);

  // Called when modal completes (guest account was created)
  const handleModalSuccess = ({ uid: newUid }) => {
    setUid(newUid);
    setSaved(true); // designer is auto-saved by modal
    toast.success('Account created and enquiry sent!');
  };

  const handleSave = async () => {
    if (!uid) {
      // Open modal — will create account + save designer
      setModalTrigger('save');
      setShowModal(true);
      return;
    }
    setSaving(true);
    try {
      if (saved) {
        await deleteDoc(doc(db, 'savedDesigners', saveDocId));
        setSaved(false);
        setSaveDocId(null);
        toast.success('Removed from saved');
      } else {
        const ref = await addDoc(collection(db, 'savedDesigners'), {
          userId: uid,
          designerId: id,
          designerName: designer.fullName || '',
          designerCity: designer.city || '',
          designerPhoto: designer.photoURL || null,
          designerRole: designer.profileRole || 'solo',
          savedAt: serverTimestamp(),
        });
        setSaved(true);
        setSaveDocId(ref.id);
        toast.success('Designer saved to your list!');
      }
    } catch (e) {
      console.error(e);
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!uid) { router.push('/dashboard/login'); return; }
    if (!inquiry.message.trim()) { toast.error('Please write a message'); return; }
    setSendingInquiry(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        userId: uid,
        designerId: id,
        designerName: designer.fullName || '',
        subject: inquiry.subject.trim(),
        budget: inquiry.budget,
        message: inquiry.message.trim(),
        status: 'new',
        createdAt: serverTimestamp(),
      });
      toast.success('Inquiry sent! The designer will get in touch.');
      setShowInquiry(false);
      setInquiry({ subject: '', budget: '', message: '' });
    } catch (e) {
      console.error(e);
      toast.error('Failed to send inquiry. Try again.');
    } finally {
      setSendingInquiry(false);
    }
  };

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
        .inq-input { width:100%; border:1.5px solid #e2e8f0; border-radius:10px; padding:10px 14px; font-size:13px; outline:none; background:#fff; }
        .inq-input:focus { border-color:#7593b4; }
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
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
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
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {designer.city}{designer.state ? `, ${designer.state}` : ''}
                    </p>
                  )}

                  {/* ── SAVE + INQUIRY BUTTONS ── */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '10px 0', borderRadius: 12, fontSize: 13, fontWeight: 600,
                        border: `1.5px solid ${saved ? '#e2d6c3' : '#7593b4'}`,
                        background: saved ? '#fdf8f0' : '#7593b4',
                        color: saved ? '#9b8c77' : '#fff',
                        cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? '#9b8c77' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      {saving ? '...' : saved ? 'Saved' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        if (!uid) {
                          setModalTrigger('enquiry');
                          setShowModal(true);
                        } else {
                          setShowInquiry(v => !v);
                        }
                      }}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '10px 0', borderRadius: 12, fontSize: 13, fontWeight: 600,
                        border: '1.5px solid #7593b4', background: showInquiry ? '#eef2f7' : '#fff',
                        color: '#7593b4', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      Enquire
                    </button>
                  </div>

                  {/* ── INQUIRY FORM ── */}
                  {showInquiry && (
                    <form onSubmit={handleSendInquiry} style={{
                      background: '#f8f4ec', borderRadius: 14, padding: 16,
                      marginBottom: 12, textAlign: 'left'
                    }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>Send an Enquiry</p>
                      <div style={{ marginBottom: 10 }}>
                        <input
                          className="inq-input"
                          placeholder="Subject (e.g. Home Renovation)"
                          value={inquiry.subject}
                          onChange={e => setInquiry(v => ({ ...v, subject: e.target.value }))}
                        />
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <select
                          className="inq-input"
                          value={inquiry.budget}
                          onChange={e => setInquiry(v => ({ ...v, budget: e.target.value }))}
                        >
                          <option value="">Budget range (optional)</option>
                          {BUDGET_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <textarea
                          className="inq-input"
                          rows={3}
                          placeholder="Describe your project or requirement..."
                          value={inquiry.message}
                          onChange={e => setInquiry(v => ({ ...v, message: e.target.value }))}
                          required
                          style={{ resize: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button type="button" onClick={() => setShowInquiry(false)}
                          style={{ flex: 1, padding: '9px 0', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontSize: 12, color: '#64748b', cursor: 'pointer' }}>
                          Cancel
                        </button>
                        <button type="submit" disabled={sendingInquiry}
                          style={{ flex: 2, padding: '9px 0', borderRadius: 10, border: 'none', background: '#7593b4', color: '#fff', fontSize: 12, fontWeight: 600, cursor: sendingInquiry ? 'not-allowed' : 'pointer' }}>
                          {sendingInquiry ? 'Sending…' : 'Send Enquiry'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Contact buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {designer.instagram && (
                      <a href={`https://instagram.com/${designer.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 12, color: '#7593b4', textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                        {designer.instagram}
                      </a>
                    )}
                    {designer.portfolio && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(designer.portfolio) && (
                      <a href={designer.portfolio} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 12, color: '#7593b4', textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                        View Portfolio ↗
                      </a>
                    )}
                  </div>

                  {!uid && (
                    <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 12, lineHeight: 1.5, textAlign: 'center' }}>
                      No account needed — just click Enquire or Save to get started.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right: details ── */}
            <div className="col-lg-8">
              <div style={{ background: '#fff', borderRadius: 20, padding: '28px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>About</h3>
                <div className="info-row"><span className="info-label">Experience</span><span className="info-value">{designer.experience || '—'}</span></div>
                <div className="info-row"><span className="info-label">Designer Type</span><span className="info-value">{roleLabel}</span></div>
                <div className="info-row"><span className="info-label">Budget Range</span><span className="info-value">{designer.budgetRange || '—'}</span></div>
                {designer.notes && (
                  <div className="info-row"><span className="info-label">About</span><span className="info-value" style={{ lineHeight: 1.6 }}>{designer.notes}</span></div>
                )}
              </div>

              {Array.isArray(designer.services) && designer.services.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 20, padding: '24px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Services Offered</h3>
                  <div>{designer.services.map(s => <span key={s} className="tag-chip">{s}</span>)}</div>
                </div>
              )}

              {Array.isArray(designer.styles) && designer.styles.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 20, padding: '24px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Design Styles</h3>
                  <div>{designer.styles.map(s => <span key={s} className="tag-chip style-chip">{s}</span>)}</div>
                </div>
              )}

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
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: 20 }}>
          <img src={lightbox} alt="" style={{ maxWidth: '92vw', maxHeight: '90vh', borderRadius: 12, boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }} />
          <button onClick={() => setLightbox(null)} style={{ position: 'fixed', top: 20, right: 24, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: 28, width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
      )}

      <Footer ftClass="wpo-site-footer-s2" />
      <Scrollbar />

      {/* Auth + Enquiry modal for guests */}
      {showModal && designer && (
        <AuthEnquiryModal
          context={{
            type: 'designer',
            id,
            name: designer.fullName || 'Designer',
            photoURL: designer.photoURL || designer.imageUrls?.[0] || null,
            city: designer.city || '',
          }}
          onSuccess={handleModalSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </Fragment>
  );
};

export default DesignerDetailPage;
