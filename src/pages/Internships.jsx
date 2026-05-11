import React, { useState } from 'react';
import { Search, Briefcase, MapPin, Building2, CheckCircle, XCircle, ExternalLink, Filter, Star, IndianRupee, Clock, Shield } from 'lucide-react';

export const SECTORS = [
  { id: 'all', label: 'All Sectors' },
  { id: 'it', label: 'IT & Software' },
  { id: 'banking', label: 'Banking & Finance' },
  { id: 'oil', label: 'Oil, Gas & Energy' },
  { id: 'auto', label: 'Automotive' },
  { id: 'manufacturing', label: 'Manufacturing' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'telecom', label: 'Telecom' },
  { id: 'retail', label: 'Retail & FMCG' },
  { id: 'infra', label: 'Infrastructure' },
  { id: 'hospitality', label: 'Hospitality & Travel' },
];

export const INTERNSHIPS = [
  { id: 1, company: 'Reliance Industries Ltd', sector: 'oil', role: 'Business Operations Intern', location: 'Mumbai, Maharashtra', duration: '12 months', stipend: 5000, openings: 2000, skills: ['Communication', 'MS Office', 'Teamwork'], logo: 'https://icon.horse/icon/ril.com' },
  { id: 2, company: 'Tata Consultancy Services', sector: 'it', role: 'IT Support & Digital Intern', location: 'Multiple Cities', duration: '12 months', stipend: 5000, openings: 3000, skills: ['Basic IT', 'Problem Solving', 'Communication'], logo: 'https://icon.horse/icon/tcs.com' },
  { id: 3, company: 'HDFC Bank', sector: 'banking', role: 'Banking Operations Intern', location: 'Multiple Cities', duration: '12 months', stipend: 5000, openings: 1500, skills: ['Finance', 'Customer Service', 'MS Office'], logo: '/company_logos/hdfc.png' },
  { id: 4, company: 'Mahindra & Mahindra', sector: 'auto', role: 'Manufacturing Process Intern', location: 'Pune, Maharashtra', duration: '12 months', stipend: 5000, openings: 800, skills: ['Basic Engineering', 'Teamwork'], logo: 'https://icon.horse/icon/mahindra.com' },
  { id: 5, company: 'Larsen & Toubro', sector: 'infra', role: 'Infrastructure Project Intern', location: 'Multiple Cities', duration: '12 months', stipend: 5000, openings: 1000, skills: ['Civil/Mechanical Basics', 'Fieldwork'], logo: '/company_logos/Larsen & Toubro.png' },
  { id: 6, company: 'Infosys', sector: 'it', role: 'Digital & Technology Intern', location: 'Bengaluru, Karnataka', duration: '12 months', stipend: 5000, openings: 2500, skills: ['Basic Coding', 'Logical Reasoning'], logo: '/company_logos/infosys.png' },
  { id: 7, company: 'ICICI Bank', sector: 'banking', role: 'Financial Services Intern', location: 'Multiple Cities', duration: '12 months', stipend: 5000, openings: 1200, skills: ['Finance Basics', 'Communication'], logo: 'https://icon.horse/icon/icicibank.com' },
  { id: 8, company: 'Wipro', sector: 'it', role: 'IT & Business Process Intern', location: 'Multiple Cities', duration: '12 months', stipend: 5000, openings: 1800, skills: ['IT Literacy', 'Analytical Skills'], logo: '/company_logos/wipro.png' },
  { id: 9, company: 'Bajaj Auto', sector: 'auto', role: 'Automotive Manufacturing Intern', location: 'Aurangabad, Maharashtra', duration: '12 months', stipend: 5000, openings: 600, skills: ['Mechanical Basics', 'Teamwork'], logo: '/company_logos/bajaj.png' },
  { id: 10, company: 'Asian Paints', sector: 'manufacturing', role: 'Supply Chain & Operations Intern', location: 'Multiple Cities', duration: '12 months', stipend: 5000, openings: 400, skills: ['Logistics Basics', 'MS Office'], logo: '/company_logos/asian paints.png' },
  { id: 11, company: 'Airtel (Bharti)', sector: 'telecom', role: 'Telecom Field Operations Intern', location: 'Multiple States', duration: '12 months', stipend: 5000, openings: 1500, skills: ['Communication', 'Customer Service'], logo: 'https://icon.horse/icon/airtel.in' },
  { id: 12, company: 'HUL (Hindustan Unilever)', sector: 'retail', role: 'Sales & Distribution Intern', location: 'Multiple Cities', duration: '12 months', stipend: 5000, openings: 900, skills: ['Sales', 'Communication', 'Field Work'], logo: 'https://icon.horse/icon/hul.co.in' },
  { id: 13, company: 'ONGC', sector: 'oil', role: 'Operations & Technical Intern', location: 'Multiple States', duration: '12 months', stipend: 5000, openings: 700, skills: ['Science/Engineering Basics', 'Fieldwork'], logo: '/company_logos/ongc.png' },
  { id: 14, company: 'Apollo Hospitals', sector: 'healthcare', role: 'Healthcare Admin Intern', location: 'Multiple Cities', duration: '12 months', stipend: 5000, openings: 500, skills: ['Healthcare Basics', 'Communication'], logo: '/company_logos/Apollo Hospitals.png' },
  { id: 15, company: 'ITC Limited', sector: 'retail', role: 'FMCG & Agribusiness Intern', location: 'Multiple Cities', duration: '12 months', stipend: 5000, openings: 750, skills: ['Agriculture/FMCG Basics', 'Fieldwork'], logo: 'https://icon.horse/icon/itcportal.com' },
  { id: 16, company: 'Maruti Suzuki', sector: 'auto', role: 'Automobile Operations Intern', location: 'Gurugram, Haryana', duration: '12 months', stipend: 5000, openings: 850, skills: ['Mechanical Basics', 'Teamwork'], logo: 'https://icon.horse/icon/marutisuzuki.com' },
  { id: 17, company: 'Tata Steel', sector: 'manufacturing', role: 'Steel Plant Operations Intern', location: 'Jamshedpur, Jharkhand', duration: '12 months', stipend: 5000, openings: 600, skills: ['Engineering Basics', 'Safety Protocols'], logo: '/company_logos/Tata Steel.png' },
  { id: 18, company: 'Vodafone Idea', sector: 'telecom', role: 'Telecom Network Intern', location: 'Multiple Cities', duration: '12 months', stipend: 5000, openings: 1000, skills: ['Networking Basics', 'Communication'], logo: '/company_logos/vi.png' },
  { id: 19, company: 'Taj Hotels (IHCL)', sector: 'hospitality', role: 'Hospitality Operations Intern', location: 'Multiple Cities', duration: '12 months', stipend: 5000, openings: 400, skills: ['Customer Service', 'Communication', 'English'], logo: 'https://icon.horse/icon/tajhotels.com' },
  { id: 20, company: 'NTPC Limited', sector: 'oil', role: 'Power Plant Operations Intern', location: 'Multiple States', duration: '12 months', stipend: 5000, openings: 800, skills: ['Electrical/Mechanical Basics', 'Fieldwork'], logo: 'https://icon.horse/icon/ntpc.co.in' },
];

function EligibilityChecker() {
  const [form, setForm] = useState({ age: '', income: '', education: 'tenth', employed: 'no', premierInstitute: 'no', govtFamily: 'no', professional: 'no' });
  const [result, setResult] = useState(null);

  const check = () => {
    const age = parseInt(form.age);
    const income = parseInt(form.income);
    const issues = [];

    if (isNaN(age) || age < 21 || age > 24) issues.push('Age must be between 21 and 24 years.');
    if (isNaN(income) || income > 800000) issues.push('Annual family income must be ≤ ₹8 lakh.');
    if (form.employed === 'yes') issues.push('Must not be in full-time employment.');
    if (form.premierInstitute === 'yes') issues.push('Graduates from IITs/IIMs/NLUs are not eligible.');
    if (form.govtFamily === 'yes') issues.push('Family members in government service make you ineligible.');
    if (form.professional === 'yes') issues.push('Holders of CA/MBA/MBBS degrees are not eligible.');

    setResult({ eligible: issues.length === 0, issues });
  };

  return (
    <div className="card" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--primary-faint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={20} color="var(--primary-color)" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>PM Internship Eligibility Checker</h3>
          <p style={{ margin: 0, fontSize: '0.82rem' }}>Check if you qualify in seconds</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Your Age</label>
          <input type="number" className="form-control" placeholder="e.g. 22" value={form.age}
            onChange={e => setForm(p => ({ ...p, age: e.target.value }))} style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }} />
        </div>
        <div>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Annual Family Income (₹)</label>
          <input type="number" className="form-control" placeholder="e.g. 500000" value={form.income}
            onChange={e => setForm(p => ({ ...p, income: e.target.value }))} style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }} />
        </div>
        <div>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Highest Education</label>
          <select className="form-control" value={form.education} onChange={e => setForm(p => ({ ...p, education: e.target.value }))} style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}>
            <option value="tenth">10th Pass</option>
            <option value="twelfth">12th Pass</option>
            <option value="iti">ITI Certificate</option>
            <option value="diploma">Polytechnic Diploma</option>
            <option value="degree">Bachelor's Degree</option>
          </select>
        </div>
        <div>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Full-time Employed?</label>
          <select className="form-control" value={form.employed} onChange={e => setForm(p => ({ ...p, employed: e.target.value }))} style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <div>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Studied at IIT/IIM/NLU?</label>
          <select className="form-control" value={form.premierInstitute} onChange={e => setForm(p => ({ ...p, premierInstitute: e.target.value }))} style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <div>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Family in Govt Service?</label>
          <select className="form-control" value={form.govtFamily} onChange={e => setForm(p => ({ ...p, govtFamily: e.target.value }))} style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <div>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Hold CA/MBA/MBBS?</label>
          <select className="form-control" value={form.professional} onChange={e => setForm(p => ({ ...p, professional: e.target.value }))} style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </div>

      <button className="btn btn-primary" onClick={check} style={{ marginBottom: result ? '1.25rem' : 0 }}>
        <CheckCircle size={16} /> Check My Eligibility
      </button>

      {result && (
        <div style={{
          borderRadius: '10px', padding: '1.25rem',
          background: result.eligible ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${result.eligible ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: result.issues.length ? '0.75rem' : 0 }}>
            {result.eligible
              ? <CheckCircle size={20} color="#16A34A" />
              : <XCircle size={20} color="#DC2626" />}
            <strong style={{ color: result.eligible ? '#16A34A' : '#DC2626', fontSize: '1rem' }}>
              {result.eligible ? '✅ You are eligible for PM Internship Scheme!' : '❌ Not currently eligible'}
            </strong>
          </div>
          {result.eligible && (
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              You qualify! Apply on the official portal below. You'll receive ₹5,000/month + ₹6,000 one-time grant.
            </p>
          )}
          {result.issues.map((iss, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', fontSize: '0.87rem', color: '#DC2626' }}>
              <span>•</span><span>{iss}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Internships() {
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('all');

  const filtered = INTERNSHIPS.filter(i => {
    const q = search.toLowerCase();
    const matchQ = !q || i.company.toLowerCase().includes(q) || i.role.toLowerCase().includes(q) || i.location.toLowerCase().includes(q);
    const matchS = sector === 'all' || i.sector === sector;
    return matchQ && matchS;
  });

  return (
    <div className="container mt-8 mb-8" style={{ maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary-faint)', border: '1px solid rgba(212,75,37,0.3)', borderRadius: '9999px', padding: '0.35rem 1rem', marginBottom: '1rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)' }}>
          🇮🇳 Government of India Initiative
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>PM Internship Scheme</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto 1.5rem' }}>
          12-month paid internships with India's top 500 companies. ₹5,000/month stipend + ₹6,000 one-time grant. Launched by Ministry of Corporate Affairs.
        </p>

        {/* Stats bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          {[
            { icon: '💰', label: '₹5,000/month', sub: 'Stipend' },
            { icon: '🎁', label: '₹6,000 Grant', sub: 'One-time joining' },
            { icon: '🏢', label: '500+ Companies', sub: 'Top India firms' },
            { icon: '📅', label: '12 Months', sub: 'Duration' },
            { icon: '🛡️', label: 'Free Insurance', sub: 'PM Bima Yojana' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.3rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{s.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Benefits Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg, var(--primary-faint) 0%, rgba(232,160,32,0.06) 100%)', borderColor: 'rgba(212,75,37,0.2)' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: 'var(--text-primary)' }}>📋 Key Benefits at a Glance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {[
            { icon: <IndianRupee size={15} />, text: '₹4,500/month from Government + ₹500 from company CSR' },
            { icon: <Shield size={15} />, text: 'PM Jeevan Jyoti Bima + PM Suraksha Bima (free insurance)' },
            { icon: <Clock size={15} />, text: '12-month internship — at least 6 months on actual job' },
            { icon: <Star size={15} />, text: '₹6,000 one-time incidental expense grant on joining' },
            { icon: <Building2 size={15} />, text: 'Top 500 companies across 25+ sectors' },
            { icon: <CheckCircle size={15} />, text: 'Real work experience, no full-time job required afterward' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '2px' }}>{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility Checker */}
      <EligibilityChecker />

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Search size={13} /> Keyword</label>
            <input type="text" className="form-control" placeholder="Search company, role, location…"
              value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '0.5rem 0.75rem', fontSize: '0.88rem' }} />
          </div>
          <div style={{ minWidth: '200px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Filter size={13} /> Sector</label>
            <select className="form-control" value={sector} onChange={e => setSector(e.target.value)} style={{ padding: '0.5rem 0.75rem', fontSize: '0.88rem' }}>
              {SECTORS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingBottom: '0.6rem' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> of {INTERNSHIPS.length} listings
          </div>
        </div>
      </div>

      {/* Internship Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {filtered.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No internships match your search. Try different keywords or sector.</p>
          </div>
        ) : filtered.map(intern => (
          <div key={intern.id} className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '56px', height: '56px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                  <img src={intern.logo} alt={intern.company} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                  <div style={{ display: 'none', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>{intern.company.charAt(0)}</div>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem' }}>{intern.company}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 600 }}>{intern.role}</p>
                </div>
              </div>
              <span style={{ backgroundColor: 'var(--primary-faint)', color: 'var(--primary-color)', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(212,75,37,0.25)', height: 'fit-content' }}>
                {SECTORS.find(s => s.id === intern.sector)?.label}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={13} />{intern.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={13} />{intern.duration}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><IndianRupee size={13} />₹{intern.stipend.toLocaleString('en-IN')}/month</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Briefcase size={13} />~{intern.openings.toLocaleString('en-IN')} openings</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {intern.skills.map(sk => (
                  <span key={sk} style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-secondary)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 600, border: '1px solid var(--border-color)' }}>
                    {sk}
                  </span>
                ))}
              </div>
              <a href="https://pminternship.mca.gov.in" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                Apply <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Apply CTA */}
      <div className="card" style={{ textAlign: 'center', padding: '2.5rem', background: 'linear-gradient(135deg, var(--primary-faint) 0%, rgba(232,160,32,0.06) 100%)', borderColor: 'rgba(212,75,37,0.2)' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>Ready to Apply?</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
          Register on the official PM Internship portal with your Aadhaar and academic details to apply.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://pminternship.mca.gov.in" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2rem', textDecoration: 'none' }}>
            <ExternalLink size={16} /> Apply on Official Portal
          </a>
          <a href="https://www.mca.gov.in" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ fontSize: '1rem', padding: '0.85rem 2rem', textDecoration: 'none' }}>
            MCA Guidelines ↗
          </a>
        </div>
      </div>
    </div>
  );
}
