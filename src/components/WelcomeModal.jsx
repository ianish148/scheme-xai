import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeModal({ onClose }) {
  const navigate = useNavigate();

  const choose = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        padding: '2.5rem',
        maxWidth: '620px',
        width: '100%',
        boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        animation: 'fadeInUp 0.35s ease',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🇮🇳</div>
          <h2 style={{ fontSize: '1.6rem', margin: '0 0 0.4rem' }}>Welcome to <span style={{ color: 'var(--primary-color)' }}>Scheme AI</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Your one-stop hub for government benefits. What are you looking for today?
          </p>
        </div>

        {/* Choice Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Government Schemes */}
          <button onClick={() => choose('/form')} style={{
            background: 'var(--bg-color)', border: '2px solid var(--border-color)',
            borderRadius: '14px', padding: '1.5rem 1rem', cursor: 'pointer',
            textAlign: 'center', transition: 'all 0.2s', color: 'var(--text-primary)',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.background = 'var(--primary-faint)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-color)'; }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>🏛️</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>Government Schemes</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Find welfare schemes you're eligible for — PM-KISAN, Ayushman Bharat, scholarships & more
            </div>
            <div style={{ marginTop: '1rem', display: 'inline-block', background: 'var(--primary-color)', color: '#fff', borderRadius: '8px', padding: '0.4rem 1rem', fontSize: '0.82rem', fontWeight: 600 }}>
              Get Recommendations →
            </div>
          </button>

          {/* PM Internship */}
          <button onClick={() => choose('/internships')} style={{
            background: 'var(--bg-color)', border: '2px solid var(--border-color)',
            borderRadius: '14px', padding: '1.5rem 1rem', cursor: 'pointer',
            textAlign: 'center', transition: 'all 0.2s', color: 'var(--text-primary)',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#E8A020'; e.currentTarget.style.background = 'rgba(232,160,32,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-color)'; }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>💼</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>PM Internship Scheme</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              ₹5,000/month paid internships with India's top 500 companies for youth aged 21–24
            </div>
            <div style={{ marginTop: '1rem', display: 'inline-block', background: '#E8A020', color: '#fff', borderRadius: '8px', padding: '0.4rem 1rem', fontSize: '0.82rem', fontWeight: 600 }}>
              Explore Internships →
            </div>
          </button>
        </div>

        {/* Skip */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => choose('/')} style={{
            background: 'none', border: 'none', color: 'var(--text-secondary)',
            fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline',
          }}>
            Browse the home page instead
          </button>
        </div>
      </div>
    </div>
  );
}
