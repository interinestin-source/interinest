import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Link from 'next/link';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

const DesignersPage = () => {
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(
          collection(db, 'interinestUsers'),
          where('role', '==', 'designer'),
          where('status', '==', 'approved')
        );
        const snap = await getDocs(q);
        setDesigners(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const cities = [...new Set(designers.map(d => d.city).filter(Boolean))].sort();

  const filtered = designers.filter(d => {
    const matchSearch = !search ||
      d.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      d.city?.toLowerCase().includes(search.toLowerCase()) ||
      d.designerType?.toLowerCase().includes(search.toLowerCase());
    const matchCity = !filterCity || d.city === filterCity;
    return matchSearch && matchCity;
  });

  return (
    <Fragment>
      <Navbar />
      <PageTitle pageTitle="Our Designers" pagesub="Designers" />

      <section style={{ padding: '60px 0', background: '#f8f4ec' }}>
        <div className="container">

          {/* Search & filter bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40,
            background: '#fff', borderRadius: 16, padding: '16px 20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)', alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="Search by name, city or type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: '1 1 240px', height: 42, border: '1px solid #e2d6c3',
                borderRadius: 10, padding: '0 14px', fontSize: 14,
                background: '#fdf9f2', outline: 'none'
              }}
            />
            <select
              value={filterCity}
              onChange={e => setFilterCity(e.target.value)}
              style={{
                height: 42, border: '1px solid #e2d6c3', borderRadius: 10,
                padding: '0 14px', fontSize: 14, background: '#fdf9f2',
                minWidth: 160, outline: 'none'
              }}
            >
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {(search || filterCity) && (
              <button
                onClick={() => { setSearch(''); setFilterCity(''); }}
                style={{
                  height: 42, padding: '0 18px', borderRadius: 10, border: 'none',
                  background: '#7593b4', color: '#fff', fontSize: 13,
                  fontWeight: 600, cursor: 'pointer'
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Results count */}
          {!loading && (
            <p style={{ fontSize: 13, color: '#9b8c77', marginBottom: 24 }}>
              Showing {filtered.length} designer{filtered.length !== 1 ? 's' : ''}
              {filterCity ? ` in ${filterCity}` : ''}
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ height: 320, borderRadius: 16, background: '#e8e0d5', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9b8c77' }}>
              <p style={{ fontSize: 16 }}>No designers found.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
              {filtered.map(designer => (
                <DesignerCard key={designer.id} designer={designer} />
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

function DesignerCard({ designer }) {
  const initial = designer.fullName?.charAt(0).toUpperCase() || 'D';
  const services = Array.isArray(designer.services) ? designer.services.slice(0, 2) : [];

  return (
    <Link href={`/designers/${designer.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#fff', borderRadius: 18, overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column'
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.13)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; }}
      >
        {/* Cover + avatar */}
        <div style={{ position: 'relative', height: 120, background: 'linear-gradient(135deg, #7593b4 0%, #a3bcd4 100%)' }}>
          {designer.imageUrls?.[0] && (
            <img src={designer.imageUrls[0]} alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
          )}
          <div style={{
            position: 'absolute', bottom: -30, left: 20,
            width: 60, height: 60, borderRadius: 14,
            border: '3px solid #fff',
            background: designer.photoURL ? 'transparent' : 'linear-gradient(135deg,#e8f0f7,#cddbe9)',
            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, color: '#7593b4', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            {designer.photoURL
              ? <img src={designer.photoURL} alt={designer.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initial
            }
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '38px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '0 0 2px' }}>
            {designer.fullName || 'Designer'}
          </h3>
          <p style={{ fontSize: 13, color: '#7593b4', margin: '0 0 8px', fontWeight: 500 }}>
            {designer.profileRole === 'studio' ? 'Design Studio / Firm'
              : designer.profileRole === 'student' ? 'Interior Design Student'
              : 'Interior Designer'}
          </p>

          {/* City & experience */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            {designer.city && (
              <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {designer.city}
              </span>
            )}
            {designer.experience && (
              <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {designer.experience}
              </span>
            )}
          </div>

          {/* Service tags */}
          {services.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
              {services.map(s => (
                <span key={s} style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 20,
                  background: '#eef2f7', color: '#7593b4', fontWeight: 500
                }}>{s}</span>
              ))}
              {Array.isArray(designer.services) && designer.services.length > 2 && (
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#f1f5f9', color: '#94a3b8' }}>
                  +{designer.services.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px', borderTop: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            {designer.imageUrls?.length || 0} portfolio images
          </span>
          <span style={{ fontSize: 12, color: '#7593b4', fontWeight: 600 }}>
            View Profile →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default DesignersPage;
