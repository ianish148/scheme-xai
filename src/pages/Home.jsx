import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Target, Search, CheckCircle, User, Cpu, FileText, ArrowRight, Shield, Zap, BookOpen, ChevronRight, Palette, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const stats = [
  { value: '10+', label: 'Government Schemes' },
  { value: '100%', label: 'Deterministic Logic' },
  { value: 'XAI', label: 'Fully Explainable' },
  { value: 'Free', label: 'Always Open Access' },
];

const features = [
  {
    icon: Target,
    color: '#E05A30',
    glow: 'rgba(224,90,48,0.15)',
    title: 'Explainable AI',
    desc: 'No black boxes. Every match shows you exactly which eligibility conditions were met — with a score breakdown for full transparency.',
  },
  {
    icon: Zap,
    color: '#E8A020',
    glow: 'rgba(232,160,32,0.15)',
    title: 'Real-Time What-If',
    desc: 'Change any input on the results page and watch recommendations update instantly. Simulate different scenarios without refilling the form.',
  },
  {
    icon: Shield,
    color: '#C43D18',
    glow: 'rgba(196,61,24,0.15)',
    title: 'Category-Aware Engine',
    desc: 'SC / ST / OBC applicants receive automatically relaxed income thresholds and priority scoring — reflecting real government policy.',
  },
  {
    icon: Search,
    color: '#B85C20',
    glow: 'rgba(184,92,32,0.15)',
    title: 'Scheme Explorer',
    desc: 'Browse the full catalog of schemes independently with keyword search, state, and occupation filters — no eligibility check required.',
  },
  {
    icon: BookOpen,
    color: '#D44B25',
    glow: 'rgba(212,75,37,0.15)',
    title: 'Structured PDF Report',
    desc: 'Export a clean A4 multi-page PDF summarising your profile, recommended schemes, XAI rationale, and disqualification reasons.',
  },
  {
    icon: CheckCircle,
    color: '#C87820',
    glow: 'rgba(200,120,32,0.15)',
    title: 'Cross-Field Validation',
    desc: 'Biologically-impossible inputs (like age 5 with an engineering degree) are caught and rejected before the engine even runs.',
  },
];

const steps = [
  { icon: User,     num: '01', title: 'Your Profile',     desc: 'Fill a 3-step form covering age, income, education, state, and category.', color: '#E05A30' },
  { icon: Cpu,      num: '02', title: 'AI Engine',        desc: 'Our deterministic expert system evaluates 10 schemes across HARD & SOFT criteria.', color: '#C43D18' },
  { icon: FileText, num: '03', title: 'Recommendations',  desc: 'Receive scored, segmented results with full XAI trace, badges, and a PDF report.', color: '#E8A020' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(212,75,37,0.12) 0%, transparent 70%)',
        paddingTop: '5rem', paddingBottom: '5rem',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>

          {/* Pill badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary-faint)', border: '1px solid rgba(212,75,37,0.3)', borderRadius: '9999px', padding: '0.35rem 1rem', marginBottom: '2rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)' }}>
            <Zap size={12} fill="#E05A30" /> Explainable AI · Deterministic · Open-Source
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', lineHeight: 1.15, marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto 1.5rem' }}>
            Find the Right{' '}
            <span className="gradient-text">Government Scheme</span>
            {' '}for You
          </h1>

          <p style={{ fontSize: '1.15rem', maxWidth: '560px', margin: '0 auto 2.5rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            Our rule-based expert system analyzes your profile and recommends the best scholarships and schemes — with{' '}
            <strong style={{ color: 'var(--text-primary)' }}>crystal-clear reasoning</strong> for every match.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2.25rem' }} onClick={() => navigate('/form')}>
              Get Recommendations <ChevronRight size={16} />
            </button>
            <button className="btn btn-secondary" style={{ fontSize: '1rem', padding: '0.85rem 2.25rem' }} onClick={() => navigate('/explore')}>
              Explore Schemes
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', marginTop: '4rem' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.3rem', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ──────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>How It Works</p>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Three steps to your results</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto' }}>From profile to fully-explainable recommendations in under 60 seconds.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="card" style={{ position: 'relative', borderTop: `3px solid ${step.color}`, padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${step.color}20` }}>
                      <Icon size={24} color={step.color} />
                    </div>
                    <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--border-bright)', lineHeight: 1 }}>{step.num}</span>
                  </div>
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{step.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0', background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(212,75,37,0.05) 0%, transparent 70%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ color: 'var(--secondary-color)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>Features</p>
            <h2 style={{ fontSize: '2.25rem' }}>Built for Academic Excellence</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0.5rem auto 0' }}>Every component reflects real expert-system principles.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card" style={{ padding: '1.75rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', flexShrink: 0, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: f.glow, border: `1px solid ${f.color}30` }}>
                    <Icon size={22} color={f.color} />
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '0.4rem', fontSize: '1.05rem' }}>{f.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.7 }}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(212,75,37,0.09) 0%, rgba(232,160,32,0.06) 100%)',
            border: '1px solid rgba(212,75,37,0.2)',
            borderRadius: '20px',
            padding: '3.5rem',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Ready to find your entitlements?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 2rem', fontSize: '1.05rem' }}>
              Fill in your profile once and let the expert system do the rest. Takes under a minute.
            </p>
            <button className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.95rem 2.75rem' }} onClick={() => navigate('/form')}>
              Start Free Analysis <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer style={{ padding: '4rem 0 2rem', background: 'var(--surface-color)', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '3rem', marginBottom: '3.5rem' }}>
          
          {/* Logo & Desc */}
          <div style={{ flex: '1 1 350px', maxWidth: '400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-color)', fontWeight: 800, fontSize: '1.2rem' }}>
               <img src="/logo.png" alt="SchemeAI Logo" style={{ height: '32px', objectFit: 'contain' }} />
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              Making scheme discovery effortless with AI-powered classification. Together, we can find the right entitlements for a better future.
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
              <Link to="/form">Get Recommendations</Link>
              <Link to="/explore">Explore Schemes</Link>
              <Link to="/settings">Settings</Link>
            </div>
          </div>

          {/* Resources */}
          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms & Conditions</Link>
            </div>
          </div>

        </div>

        <div className="container">
          <div style={{ textAlign: 'center', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem' }}>
            © {new Date().getFullYear()} Scheme AI. Making discovery smarter, one click at a time. 🌱
          </div>
        </div>
      </footer>
    </div>
  );
}
