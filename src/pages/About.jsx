import React from 'react';
import { Link } from 'react-router-dom';
import { Info, Settings, Database, Zap, Shield, ChevronRight } from 'lucide-react';

const sections = [
  {
    icon: Settings,
    color: '#3B82F6',
    title: 'The Expert System',
    content: [
      <>Our application operates using a sophisticated <strong style={{ color: 'var(--text-primary)' }}>Rule-Based Decision System</strong>. Unlike black-box machine learning models, our engine maps your profile attributes directly to predefined eligibility criteria established by official government directives.</>,
      'This ensures 100% determinism. If you qualify for a scheme, the system guarantees it will be presented — along with the exact conditions that triggered the match.',
    ],
  },
  {
    icon: Info,
    color: '#10B981',
    title: 'What is Explainable AI (XAI)?',
    content: [
      'Explainable AI is a branch of artificial intelligence focused on transparency. The overarching goal is to make the logic of an AI system visible and comprehensible to the end user.',
      <>Instead of just displaying "You are eligible for the PM Internship Scheme", the XAI layer provides a clear trace: <em style={{ color: 'var(--primary-color)' }}>"Recommended because age is between 21-24, education is Undergraduate, and not in full-time employment."</em> This builds trust and empowers users with knowledge.</>,
    ],
  },
  {
    icon: Database,
    color: '#F59E0B',
    title: 'Our Knowledge Base',
    content: [
      'We currently maintain verified eligibility parameters for 10 major Indian government schemes:',
    ],
    list: [
      'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      'Pradhan Mantri Mudra Yojana',
      'Ayushman Bharat (PM-JAY)',
      'PM Internship Scheme',
      'Skill India / PMKVY',
      'Digital India BPO Promotion Scheme',
      'Stand-Up India',
      'PM SVANidhi (Street Vendor Loan)',
      'NMMS (National Means-cum-Merit Scholarship)',
      'Sukanya Samriddhi Yojana (SSY)',
    ],
  },
  {
    icon: Zap,
    color: '#8B5CF6',
    title: 'Rule Types: HARD, SOFT & BONUS',
    content: [
      <>The engine uses three rule types. <strong style={{ color: 'var(--text-primary)' }}>HARD rules</strong> are mandatory — failing even one disqualifies the scheme entirely (e.g. must be a farmer for PM-KISAN). <strong style={{ color: 'var(--text-primary)' }}>SOFT rules</strong> are weighted scoring criteria (0–100 total). <strong style={{ color: 'var(--text-primary)' }}>BONUS rules</strong> reward special attributes like interests.</>,
    ],
  },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <div style={{
        textAlign: 'center', padding: '4rem 1.5rem 3rem',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, var(--primary-faint) 0%, transparent 70%)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <p style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.6rem' }}>Documentation</p>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>About XAI Recommender</h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto' }}>Understanding the logic, rules, and architecture behind your scheme eligibility.</p>
      </div>

      {/* Content */}
      <div className="container" style={{ maxWidth: '800px', paddingTop: '3rem', paddingBottom: '4rem' }}>
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card" style={{ marginBottom: '1.5rem', padding: '2rem', borderLeft: `3px solid ${s.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${s.color}18`, flexShrink: 0 }}>
                  <Icon size={20} color={s.color} />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{s.title}</h2>
              </div>

              {s.content.map((c, j) => (
                <p key={j} style={{ marginBottom: s.list || j < s.content.length - 1 ? '0.75rem' : 0 }}>{c}</p>
              ))}

              {s.list && (
                <ul style={{ margin: '0.5rem 0 0 0', padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.4rem' }}>
                  {s.list.map((item, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      <ChevronRight size={13} color={s.color} style={{ flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/form" className="btn btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1rem' }}>
            Try it now <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
