import React, { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Link from 'next/link';
import { doc, getDoc, collection, getDocs, addDoc, deleteDoc, query, where, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'sonner';
import AuthEnquiryModal from '../../components/AuthEnquiryModal';

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp(`${name}=([^;]+)`));
  return m ? m[1] : null;
}

const ProjectDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [designer, setDesigner] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [uid, setUid] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saveDocId, setSaveDocId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const cookieUid = getCookie('uid');
    setUid(cookieUid);
  }, []);

  // Check if project already saved
  useEffect(() => {
    if (!uid || !id) return;
    const checkSaved = async () => {
      const q = query(collection(db, 'savedProjects'), where('userId', '==', uid), where('projectId', '==', id));
      const snap = await getDocs(q);
      if (!snap.empty) { setSaved(true); setSaveDocId(snap.docs[0].id); }
    };
    checkSaved().catch(console.error);
  }, [uid, id]);

  const handleModalSuccess = ({ uid: newUid }) => {
    setUid(newUid);
    setSaved(true);
    toast.success('Account created and interest saved!');
  };

  const handleSave = async () => {
    if (!uid) {
      setShowModal(true);
      return;
    }
    setSaving(true);
    try {
      if (saved) {
        await deleteDoc(doc(db, 'savedProjects', saveDocId));
        setSaved(false); setSaveDocId(null);
        toast.success('Removed from saved');
      } else {
        const ref = await addDoc(collection(db, 'savedProjects'), {
          userId: uid, projectId: id,
          projectTitle: project.title || '',
          projectImage: images[0] || null,
          projectCategory: project.category || '',
          projectLocation: project.location || '',
          savedAt: serverTimestamp(),
        });
        setSaved(true); setSaveDocId(ref.id);
        toast.success('Project saved!');
      }
    } catch (e) { console.error(e); toast.error('Something went wrong'); }
    finally { setSaving(false); }
  };

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'projects', id));
        if (!snap.exists()) { setLoading(false); return; }
        const data = { id: snap.id, ...snap.data() };
        setProject(data);

        // fetch designer
        if (data.uid) {
          const dSnap = await getDoc(doc(db, 'interinestUsers', data.uid));
          if (dSnap.exists()) setDesigner({ id: dSnap.id, ...dSnap.data() });
        }

        // related projects (same category, different id)
        const rq = query(
          collection(db, 'projects'),
          where('status', '==', 'Published'),
          where('category', '==', data.category || 'Interior'),
          limit(4)
        );
        const rSnap = await getDocs(rq);
        setRelated(rSnap.docs.filter(d => d.id !== id).slice(0, 3).map(d => ({ id: d.id, ...d.data() })));
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
          <p>Loading project...</p>
        </div>
      </div>
      <Footer />
    </Fragment>
  );

  if (!project) return (
    <Fragment>
      <Navbar />
      <PageTitle pageTitle="Project Not Found" pagesub="Projects" />
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <p style={{ color: '#64748b', marginBottom: 24 }}>This project could not be found.</p>
        <Link href="/projects" style={{ color: '#7593b4', fontWeight: 600 }}>← Back to Projects</Link>
      </div>
      <Footer />
    </Fragment>
  );

  const images = Array.isArray(project.imageUrls) ? project.imageUrls : [];
  const catColor = project.category === 'Interior' ? { bg: '#dcfce7', text: '#16a34a' }
    : project.category === 'Exterior' ? { bg: '#dbeafe', text: '#2563eb' }
    : { bg: '#f3e8ff', text: '#9333ea' };
  const designerInitial = designer?.fullName?.charAt(0).toUpperCase() || 'D';

  return (
    <Fragment>
      <Navbar />
      <PageTitle
        pageTitle={project.title || 'Project'}
        pagesub="Project Details"
        bgImage={images[0]}
      />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .thumb-img { cursor:pointer; border-radius:10px; overflow:hidden; aspect-ratio:1; flex-shrink:0; width:72px; height:72px; border:2px solid transparent; transition:border-color 0.2s; }
        .thumb-img.active { border-color:#7593b4; }
        .thumb-img img { width:100%; height:100%; object-fit:cover; }
        .detail-row { display:flex; padding:11px 0; border-bottom:1px solid #f1f5f9; gap:12px; }
        .detail-label { min-width:120px; font-size:12px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.06em; }
        .detail-value { font-size:14px; color:#1e293b; }
        .rel-card { border-radius:14px; overflow:hidden; background:#fff; box-shadow:0 2px 10px rgba(0,0,0,0.07); transition:transform 0.2s; }
        .rel-card:hover { transform:translateY(-3px); }
      `}</style>

      <div style={{ background: '#f8f4ec', paddingBottom: 80 }}>
        <div className="container" style={{ paddingTop: 48 }}>

          {/* Breadcrumb */}
          <div style={{ marginBottom: 28, fontSize: 13, color: '#94a3b8' }}>
            <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <Link href="/projects" style={{ color: '#94a3b8', textDecoration: 'none' }}>Projects</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#1e293b' }}>{project.title}</span>
          </div>

          <div className="row">
            {/* ── Main content ── */}
            <div className="col-lg-8" style={{ marginBottom: 32 }}>

              {/* Hero image viewer */}
              <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', marginBottom: 16 }}>
                <div style={{ position: 'relative', height: 420, background: '#e2d6c3', cursor: 'zoom-in' }}
                  onClick={() => images[activeImg] && setLightbox(images[activeImg])}>
                  {images.length > 0 ? (
                    <img src={images[activeImg]} alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b0a090' }}>
                      No images available
                    </div>
                  )}
                  <span style={{
                    position: 'absolute', top: 16, left: 16, padding: '5px 14px',
                    borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: catColor.bg, color: catColor.text
                  }}>{project.category}</span>
                  {images.length > 0 && (
                    <span style={{ position: 'absolute', bottom: 14, right: 16, background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: 8, padding: '3px 10px', fontSize: 12 }}>
                      {activeImg + 1} / {images.length}
                    </span>
                  )}
                  {/* Arrows */}
                  {images.length > 1 && (
                    <>
                      <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + images.length) % images.length); }}
                        style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 38, height: 38, cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                      <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % images.length); }}
                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 38, height: 38, cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div style={{ display: 'flex', gap: 10, padding: '14px 16px', overflowX: 'auto' }}>
                    {images.map((url, i) => (
                      <div key={i} className={`thumb-img ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                        <img src={url} alt={`View ${i+1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & description */}
              <div style={{ background: '#fff', borderRadius: 20, padding: '28px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>{project.title}</h1>
                {project.description && (
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, marginBottom: 0 }}>{project.description}</p>
                )}
              </div>

              {/* Related projects */}
              {related.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 20, padding: '24px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>Related Projects</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14 }}>
                    {related.map(p => (
                      <Link key={p.id} href={`/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                        <div className="rel-card">
                          <div style={{ height: 110, background: '#e2d6c3', overflow: 'hidden' }}>
                            {p.imageUrls?.[0] && <img src={p.imageUrls[0]} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                          </div>
                          <div style={{ padding: '10px 12px' }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 3px' }}>{p.title}</p>
                            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{p.category}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="col-lg-4">
              {/* Project details card */}
              <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                <div style={{ height: 4, background: '#7593b4', borderRadius: 2, marginBottom: 20, width: 40 }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Project Details</h3>

                {project.budget && (
                  <div className="detail-row">
                    <span className="detail-label">Budget</span>
                    <span className="detail-value" style={{ fontWeight: 700, color: '#7593b4' }}>{project.budget}</span>
                  </div>
                )}
                {project.category && (
                  <div className="detail-row">
                    <span className="detail-label">Category</span>
                    <span className="detail-value">{project.category}</span>
                  </div>
                )}
                {project.duration && (
                  <div className="detail-row">
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">{project.duration}</span>
                  </div>
                )}
                {project.location && (
                  <div className="detail-row">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{project.location}</span>
                  </div>
                )}
              </div>

              {/* Designer card */}
              {designer && (
                <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 18 }}>Designer</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, overflow: 'hidden', background: 'linear-gradient(135deg,#e8f0f7,#cddbe9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#7593b4', flexShrink: 0 }}>
                      {designer.photoURL
                        ? <img src={designer.photoURL} alt={designer.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : designerInitial
                      }
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: 0 }}>{designer.fullName}</p>
                      <p style={{ fontSize: 12, color: '#7593b4', margin: '2px 0 0', fontWeight: 500 }}>
                        {designer.city || 'Interior Designer'}
                      </p>
                    </div>
                  </div>
                  {designer.experience && (
                    <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
                      {designer.experience} experience
                    </p>
                  )}
                  <Link href={`/designers/${designer.id}`} style={{
                    display: 'block', textAlign: 'center', padding: '10px 0',
                    background: '#7593b4', color: '#fff', borderRadius: 12,
                    fontSize: 13, fontWeight: 600, textDecoration: 'none'
                  }}>
                    View Designer Profile
                  </Link>
                </div>
              )}

              {/* Save Project button */}
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '11px 0', borderRadius: 14, border: `1.5px solid ${saved ? '#e2d6c3' : '#7593b4'}`,
                  background: saved ? '#fdf8f0' : '#7593b4', color: saved ? '#9b8c77' : '#fff',
                  fontWeight: 600, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer',
                  marginBottom: 14, transition: 'all 0.2s'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? '#9b8c77' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {saving ? '...' : saved ? 'Saved' : 'Save Project'}
              </button>

              {!uid && (
                <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginBottom: 14, lineHeight: 1.5 }}>
                  No account needed — click Save to get started.
                </p>
              )}

              {/* Back link */}
              <Link href="/projects" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8', textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to all projects
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 9999,
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

      {/* Auth + Interest modal for guests */}
      {showModal && project && (
        <AuthEnquiryModal
          context={{
            type: 'project',
            id,
            name: project.title || 'Project',
            photoURL: images[0] || null,
            category: project.category || '',
            location: project.location || '',
            designerId: project.uid || '',
            designerName: designer?.fullName || '',
          }}
          onSuccess={handleModalSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </Fragment>
  );
};

export default ProjectDetailPage;
