import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Link from 'next/link';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

const CATEGORIES = ['All', 'Interior', 'Exterior', 'Both'];

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, 'projects'), where('status', '==', 'Published'));
        const snap = await getDocs(q);
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = projects.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Fragment>
      <Navbar />
      <PageTitle pageTitle="Projects" pagesub="Projects" />

      <section style={{ padding: '60px 0 80px', background: '#f8f4ec' }}>
        <div className="container">

          {/* Filter bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 36,
            alignItems: 'center', justifyContent: 'space-between'
          }}>
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  style={{
                    padding: '8px 20px', borderRadius: 50, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                    background: category === cat ? '#7593b4' : '#fff',
                    color: category === cat ? '#fff' : '#64748b',
                    boxShadow: category === cat ? '0 2px 8px rgba(117,147,180,0.35)' : '0 1px 4px rgba(0,0,0,0.07)'
                  }}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                height: 40, border: '1px solid #e2d6c3', borderRadius: 10,
                padding: '0 14px', fontSize: 13, background: '#fff',
                minWidth: 220, outline: 'none'
              }}
            />
          </div>

          {/* Count */}
          {!loading && (
            <p style={{ fontSize: 13, color: '#9b8c77', marginBottom: 28 }}>
              {filtered.length} project{filtered.length !== 1 ? 's' : ''}
              {category !== 'All' ? ` · ${category}` : ''}
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ height: 340, borderRadius: 18, background: '#e8e0d5' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9b8c77' }}>
              <p style={{ fontSize: 16 }}>No projects found.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
              {filtered.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer ftClass="wpo-site-footer-s2" />
      <Scrollbar />
    </Fragment>
  );
};

function ProjectCard({ project }) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = Array.isArray(project.imageUrls) ? project.imageUrls : [];
  const catColor = project.category === 'Interior' ? { bg: '#dcfce7', text: '#16a34a' }
    : project.category === 'Exterior' ? { bg: '#dbeafe', text: '#2563eb' }
    : { bg: '#f3e8ff', text: '#9333ea' };

  return (
    <Link href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#fff', borderRadius: 18, overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)', transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer', display: 'flex', flexDirection: 'column'
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.13)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: 210, background: '#e2d6c3', overflow: 'hidden' }}>
          {images.length > 0 ? (
            <img src={images[imgIdx]} alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b0a090', fontSize: 13 }}>
              No image
            </div>
          )}
          {/* Category badge */}
          <span style={{
            position: 'absolute', top: 12, left: 12, padding: '4px 12px',
            borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: catColor.bg, color: catColor.text
          }}>{project.category}</span>

          {/* Image dots */}
          {images.length > 1 && (
            <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
              {images.map((_, i) => (
                <span key={i} onClick={e => { e.preventDefault(); setImgIdx(i); }}
                  style={{ width: 7, height: 7, borderRadius: '50%', background: i === imgIdx ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }} />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '0 0 6px', lineHeight: 1.3 }}>
            {project.title || 'Untitled Project'}
          </h3>
          {project.description && (
            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px', lineHeight: 1.5,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {project.description}
            </p>
          )}

          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
            <div>
              {project.budget && <p style={{ fontSize: 14, fontWeight: 700, color: '#7593b4', margin: 0 }}>{project.budget}</p>}
              {project.location && (
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {project.location}
                </p>
              )}
            </div>
            {project.duration && (
              <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {project.duration}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProjectsPage;
