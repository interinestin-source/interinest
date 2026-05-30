import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { toast } from 'sonner';

/* ─── constants ──────────────────────────────────────────────── */
const ACCENT = '#7593b4';

const BUDGET_OPTIONS = [
  'Under ₹2 Lakh',
  '₹2–5 Lakh',
  '₹5–10 Lakh',
  '₹10–20 Lakh',
  '₹20 Lakh+',
];

const s = {
  input: {
    width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10,
    padding: '10px 14px', fontSize: 13, outline: 'none', background: '#f9fafb',
    boxSizing: 'border-box', fontFamily: 'inherit', color: '#1e293b',
    transition: 'border-color 0.15s',
  },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' },
};

/**
 * context shape:
 *   type: 'designer' | 'project'
 *   id: string             — designerId or projectId
 *   name: string           — designer name or project title
 *   photoURL?: string      — avatar or project hero image
 *   city?: string          — designer city
 *   designerId?: string    — (project only) uid of the designer who owns the project
 *   designerName?: string  — (project only) designer's name
 *   category?: string      — (project only) project category
 *   location?: string      — (project only) project location
 *
 * onSuccess: ({ uid }) => void
 * onClose: () => void
 */
export default function AuthEnquiryModal({ context, onSuccess, onClose }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    subject: '', budget: '', message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  /* lock body scroll while modal is open */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    if (!form.message.trim()) errs.message = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      /* 1. Create Firebase Auth account */
      const cred = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      const uid = cred.user.uid;

      /* 2. Save user profile to Firestore */
      await setDoc(doc(db, 'interinestUsers', uid), {
        uid,
        fullName: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || '',
        role: 'user',
        status: 'approved',
        createdAt: serverTimestamp(),
      });

      /* 3. Set auth cookies (7-day session) */
      const maxAge = 60 * 60 * 24 * 7;
      const token = await cred.user.getIdToken();
      document.cookie = `uid=${uid}; path=/; max-age=${maxAge}`;
      document.cookie = `role=user; path=/; max-age=${maxAge}`;
      document.cookie = `authToken=${token}; path=/; max-age=${maxAge}`;

      /* 4. Save enquiry to Firestore */
      const inquiryData = {
        userId: uid,
        userName: form.name.trim(),
        userEmail: form.email.trim(),
        userPhone: form.phone.trim() || '',
        subject: form.subject.trim() || (context.type === 'project' ? `Interest in: ${context.name}` : ''),
        budget: form.budget,
        message: form.message.trim(),
        status: 'new',
        createdAt: serverTimestamp(),
      };

      if (context.type === 'designer') {
        await addDoc(collection(db, 'inquiries'), {
          ...inquiryData,
          designerId: context.id,
          designerName: context.name || '',
          type: 'designer_enquiry',
        });
        /* Also auto-save the designer to user's list */
        await addDoc(collection(db, 'savedDesigners'), {
          userId: uid,
          designerId: context.id,
          designerName: context.name || '',
          designerCity: context.city || '',
          designerPhoto: context.photoURL || null,
          savedAt: serverTimestamp(),
        });
      } else {
        /* Project interest */
        await addDoc(collection(db, 'inquiries'), {
          ...inquiryData,
          projectId: context.id,
          projectName: context.name || '',
          designerId: context.designerId || '',
          designerName: context.designerName || '',
          type: 'project_interest',
        });
        /* Auto-save the project */
        await addDoc(collection(db, 'savedProjects'), {
          userId: uid,
          projectId: context.id,
          projectTitle: context.name || '',
          projectImage: context.photoURL || null,
          projectCategory: context.category || '',
          projectLocation: context.location || '',
          savedAt: serverTimestamp(),
        });
      }

      setDone(true);
      onSuccess({ uid });
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrors((prev) => ({ ...prev, email: 'This email is already registered — please log in instead.' }));
      } else {
        toast.error(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isDesigner = context.type === 'designer';

  return (
    /* Backdrop */
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(15,23,42,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, backdropFilter: 'blur(3px)',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 24, width: '100%', maxWidth: 520,
        maxHeight: '92vh', overflow: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        animation: 'modal-in 0.2s ease',
      }}>
        <style>{`
          @keyframes modal-in { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        `}</style>

        {done ? (
          /* ── Success state ── */
          <div style={{ padding: '52px 36px', textAlign: 'center' }}>
            <div style={{
              width: 68, height: 68, borderRadius: '50%', background: '#dcfce7',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={{ fontSize: 21, fontWeight: 800, color: '#1e293b', marginBottom: 10 }}>
              {isDesigner ? 'Enquiry Sent!' : 'Interest Noted!'}
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 28 }}>
              Your account has been created and your {isDesigner ? 'enquiry' : 'interest'} has been saved.
              The designer will get in touch with you soon.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={onClose}
                style={{ padding: '11px 22px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 14, color: '#64748b', cursor: 'pointer', fontWeight: 500 }}
              >
                Stay on page
              </button>
              <a
                href="/dashboard/user-dashboard"
                style={{ padding: '11px 22px', borderRadius: 12, background: ACCENT, color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                View My Dashboard →
              </a>
            </div>
          </div>
        ) : (
          /* ── Form ── */
          <>
            {/* Modal header */}
            <div style={{ padding: '22px 28px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#1e293b', margin: '0 0 4px' }}>
                  {isDesigner ? `Enquire · ${context.name}` : `Show Interest · ${context.name}`}
                </h2>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                  Fill in your details to create a free account and submit your {isDesigner ? 'enquiry' : 'interest'} instantly.
                </p>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: '2px 4px', flexShrink: 0, marginTop: -2 }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '20px 28px 28px' }}>

              {/* Context chip */}
              {context.photoURL && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8f9fb', borderRadius: 14, padding: '10px 14px', marginBottom: 22, border: '1px solid #f1f5f9' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#e2e8f0' }}>
                    <img src={context.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', margin: 0 }}>{context.name}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                      {isDesigner ? context.city : context.category}
                    </p>
                  </div>
                  <div style={{ marginLeft: 'auto', background: `${ACCENT}18`, color: ACCENT, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {isDesigner ? 'Designer' : 'Project'}
                  </div>
                </div>
              )}

              {/* Section: Your Details */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                  Your Details
                  <span style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={s.label}>Full Name *</label>
                    <input
                      value={form.name} onChange={set('name')} placeholder="Rahul Sharma"
                      style={{ ...s.input, borderColor: errors.name ? '#fca5a5' : '#e2e8f0' }}
                    />
                    {errors.name && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label style={s.label}>Phone</label>
                    <input
                      value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" type="tel"
                      style={s.input}
                    />
                  </div>
                  <div>
                    <label style={s.label}>Email *</label>
                    <input
                      value={form.email} onChange={set('email')} placeholder="you@example.com" type="email"
                      style={{ ...s.input, borderColor: errors.email ? '#fca5a5' : '#e2e8f0' }}
                    />
                    {errors.email && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.email}</p>}
                  </div>
                  <div>
                    <label style={s.label}>Password *</label>
                    <input
                      value={form.password} onChange={set('password')} placeholder="Min 6 characters" type="password"
                      style={{ ...s.input, borderColor: errors.password ? '#fca5a5' : '#e2e8f0' }}
                    />
                    {errors.password && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.password}</p>}
                  </div>
                </div>
              </div>

              {/* Section: Enquiry Details */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                  {isDesigner ? 'Your Enquiry' : 'Your Interest'}
                  <span style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={s.label}>Subject</label>
                  <input
                    value={form.subject} onChange={set('subject')}
                    placeholder={isDesigner ? 'e.g. 3BHK Home Interior, Office Design' : `Interest in: ${context.name}`}
                    style={s.input}
                  />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={s.label}>Budget Range</label>
                  <select value={form.budget} onChange={set('budget')} style={s.input}>
                    <option value="">Select your budget (optional)</option>
                    {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={s.label}>Message *</label>
                  <textarea
                    value={form.message} onChange={set('message')} rows={3}
                    placeholder={isDesigner
                      ? 'Describe your project, space size, style preferences, timeline...'
                      : 'Tell us what excites you about this project or what you\'re looking for...'}
                    style={{ ...s.input, resize: 'vertical' }}
                  />
                  {errors.message && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
                    background: ACCENT, color: '#fff', fontWeight: 700, fontSize: 15,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1, transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  {submitting ? (
                    <>
                      <svg style={{ animation: 'spin 0.8s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/>
                        <path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
                      </svg>
                      Creating account &amp; sending…
                    </>
                  ) : (
                    isDesigner ? 'Send Enquiry & Create Account' : 'Show Interest & Create Account'
                  )}
                </button>

                <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 14 }}>
                  Already have an account?{' '}
                  <a href="/dashboard/login" style={{ color: ACCENT, fontWeight: 600, textDecoration: 'none' }}>Log in</a>
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
