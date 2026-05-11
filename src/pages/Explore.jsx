import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, SlidersHorizontal, ArrowUpDown, Users } from 'lucide-react';

const validStatesList = [
  'ALL','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli',
  'Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry',
];

const OCCUPATION_OPTIONS = [
  { value: 'ALL', label: 'All Occupations' },
  { value: 'farmer',     label: 'Farmer' },
  { value: 'student',    label: 'Student' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'business',   label: 'Business / Self-Employed' },
  { value: 'vendor',     label: 'Street Vendor' },
  { value: 'employee',   label: 'Salaried Employee' },
];

// Per-scheme static metadata: which occupations are targeted
const schemeOccupations = {
  'pm-kisan':         ['farmer'],
  'mudra-yojana':     ['business', 'unemployed'],
  'pm-scholarship':   ['student'],
  'skill-india':      ['unemployed', 'student', 'vendor'],
  'digital-india-bpo':['unemployed', 'student'],
  'stand-up-india':   ['business', 'unemployed'],
  'pm-jay':           ['farmer', 'vendor', 'unemployed'],
  'nmms':             ['student'],
  'pm-svanidhi':      ['vendor', 'unemployed'],
  'ssy':              [],
};

// Short eligibility summary per scheme
const schemeEligSummary = {
  'pm-kisan':         'Farmers with land ownership',
  'mudra-yojana':     'Micro-entrepreneurs, 18–65 yrs',
  'pm-scholarship':   'Higher education students, ≤₹5L income',
  'skill-india':      'Youth seeking skill certification, 18+',
  'digital-india-bpo':'College graduates, 18–35 yrs, unemployed',
  'stand-up-india':   'Women / SC/ST entrepreneurs',
  'pm-jay':           'BPL families, ≤₹2.5L income',
  'nmms':             'School students class 9–12, ≤₹3.5L income',
  'pm-svanidhi':      'Street vendors, ≤₹3L income',
  'ssy':              'Parents of girl children aged ≤10',
};

// Static scheme data (mirrors the Flask backend — no server required)
const SCHEMES_DATA = [
  { id: 'pm-kisan',          name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',          description: "Direct income support to all landholding farmers' families in the country.",                                                                                                   benefits: '₹6,000 per year in three equal installments.',                                   url: 'https://pmkisan.gov.in/',                             validStates: ['ALL'] },
  { id: 'mudra-yojana',      name: 'Pradhan Mantri Mudra Yojana (PMMY)',                    description: 'Loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises.',                                                                                                benefits: 'Financial support for starting or expanding micro-businesses.',                   url: 'https://www.mudra.org.in/',                           validStates: ['ALL'] },
  { id: 'pm-scholarship',    name: "Prime Minister's Scholarship Scheme (PMSS)",            description: 'To encourage higher technical and professional education for the dependent wards of Ex-Servicemen and Coast Guard personnel.',                                           benefits: 'Financial assistance (₹2500/month for boys, ₹3000/month for girls).',             url: 'https://www.myscheme.gov.in/schemes/pmss',            validStates: ['ALL'] },
  { id: 'skill-india',       name: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)',           description: 'Skill certification scheme to enable Indian youth to take up industry-relevant skill training.',                                                                        benefits: 'Free skill training and certification.',                                          url: 'https://www.pmkvyofficial.org/',                      validStates: ['ALL'] },
  { id: 'digital-india-bpo', name: 'Digital India BPO Scheme',                             description: 'To incentivize BPO/ITES operations across the country, particularly in Tier 2/3 cities.',                                                                              benefits: 'Financial support for youth employment in IT sectors.',                           url: 'https://www.digitalindia.gov.in/',                    validStates: ['ALL'] },
  { id: 'stand-up-india',    name: 'Stand-Up India',                                       description: 'Facilitates bank loans between ₹10 lakh and ₹1 Crore to at least one SC/ST borrower and one woman borrower per bank branch.',                                         benefits: 'Credit facility for setting up a greenfield enterprise.',                        url: 'https://www.standupmitra.in/',                        validStates: ['ALL'] },
  { id: 'pm-jay',            name: 'Ayushman Bharat (PM-JAY)',                             description: 'Health insurance cover of ₹5 lakhs per family per year for secondary and tertiary care hospitalization.',                                                              benefits: 'Free healthcare coverage for vulnerable families.',                               url: 'https://pmjay.gov.in/',                               validStates: ['ALL'] },
  { id: 'nmms',              name: 'National Means-cum-Merit Scholarship (NMMS)',           description: 'For students of class 9 to 12. To check dropouts at class 8 and encourage them to continue studies.',                                                                  benefits: '₹12000 per annum to eligible students.',                                         url: 'https://scholarships.gov.in/',                        validStates: ['ALL'] },
  { id: 'pm-svanidhi',       name: 'PM SVANidhi Yojana',                                   description: 'A special micro-credit facility for street vendors to resume their livelihoods.',                                                                                       benefits: 'Working capital loan up to ₹10,000.',                                            url: 'https://pmsvanidhi.mohua.gov.in/',                    validStates: ['ALL'] },
  { id: 'ssy',               name: 'Sukanya Samriddhi Yojana (SSY)',                       description: 'Targeted at the parents of girl children, encourages building a fund for future education and marriage expenses.',                                                       benefits: 'High interest rate and tax benefits.',                                            url: 'https://www.india.gov.in/sukanya-samriddhi-yojna',    validStates: ['ALL'] },
];

export default function Explore() {
  const [schemes,      setSchemes]     = useState([]);
  const [loading,      setLoading]     = useState(true);
  const [error,        setError]       = useState(null);
  const [searchQuery,  setSearchQuery] = useState('');
  const [selectedState,setSelectedState]=useState('ALL');
  const [selectedOcc,  setSelectedOcc] = useState('ALL');
  const [minAge,       setMinAge]      = useState(5);
  const [maxAge,       setMaxAge]      = useState(100);
  const [maxIncome,    setMaxIncome]   = useState(5000000);
  const [sortBy,       setSortBy]      = useState('default');

  useEffect(() => {
    // Use local data directly — no backend required
    setSchemes(SCHEMES_DATA);
    setLoading(false);
  }, []);

  if (loading) return (
    <div className="container mt-8 text-center">
      <p style={{ color: 'var(--primary-color)', fontSize: '1.1rem' }}>Loading scheme database…</p>
    </div>
  );
  if (error) return (
    <div className="container mt-8 text-center">
      <p style={{ color: '#EF4444' }}>Error: {error}</p>
    </div>
  );

  const filtered = schemes.filter(s => {
    const q    = searchQuery.toLowerCase();
    const text = (s.name + s.description + s.benefits).toLowerCase();
    if (q && !text.includes(q)) return false;
    if (selectedState !== 'ALL' && !s.validStates.includes('ALL') && !s.validStates.includes(selectedState)) return false;
    if (selectedOcc !== 'ALL') {
      const targets = schemeOccupations[s.id] || [];
      if (targets.length > 0 && !targets.includes(selectedOcc)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="container mt-8 mb-8" style={{ maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Scheme Knowledge Explorer</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Browse all {schemes.length} government schemes. Use filters to find schemes relevant to you — no eligibility check required.
        </p>
      </div>

      {/* Filters Panel */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <SlidersHorizontal size={18} color="var(--primary-color)" />
          <h3 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Filters &amp; Sorting</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>

          {/* Keyword */}
          <div>
            <label className="form-label" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Search size={13} /> Keyword
            </label>
            <input type="text" placeholder="Search name or benefit…" className="form-control"
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.88rem' }}
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>

          {/* State */}
          <div>
            <label className="form-label" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={13} /> State / UT
            </label>
            <select className="form-control" style={{ padding: '0.5rem 0.75rem', fontSize: '0.88rem' }}
              value={selectedState} onChange={e => setSelectedState(e.target.value)}>
              {validStatesList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Occupation */}
          <div>
            <label className="form-label" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Briefcase size={13} /> Target Occupation
            </label>
            <select className="form-control" style={{ padding: '0.5rem 0.75rem', fontSize: '0.88rem' }}
              value={selectedOcc} onChange={e => setSelectedOcc(e.target.value)}>
              {OCCUPATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="form-label" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ArrowUpDown size={13} /> Sort By
            </label>
            <select className="form-control" style={{ padding: '0.5rem 0.75rem', fontSize: '0.88rem' }}
              value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="default">Default Order</option>
              <option value="name-asc">Name A → Z</option>
              <option value="name-desc">Name Z → A</option>
            </select>
          </div>

        </div>

        <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{sorted.length}</strong> of {schemes.length} schemes
        </div>
      </div>

      {/* Results Grid */}
      {sorted.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>No schemes match your filters. Try broadening the criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {sorted.map(sch => {
            const occ = schemeOccupations[sch.id] || [];
            const eli = schemeEligSummary[sch.id] || 'Varies by conditions';
            return (
              <div key={sch.id} className="card" style={{
                padding: '1.75rem',
                borderLeft: '4px solid var(--primary-color)',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>{sch.name}</h3>
                    <a href={sch.url} target="_blank" rel="noreferrer"
                      style={{ fontSize: '0.78rem', color: 'var(--secondary-color)', textDecoration: 'underline' }}>
                      Official Website ↗
                    </a>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                    <span style={{
                      backgroundColor: 'rgba(37,99,235,0.1)', color: 'var(--primary-color)',
                      padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700,
                      border: '1px solid rgba(37,99,235,0.3)',
                    }}>
                      {sch.validStates.includes('ALL') ? 'Pan-India' : `${sch.validStates.length} state(s)`}
                    </span>
                  </div>
                </div>

                {/* Eligibility Quick Summary */}
                <div style={{
                  backgroundColor: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.2)',
                  borderRadius: '6px', padding: '0.6rem 1rem', marginBottom: '1rem',
                  fontSize: '0.83rem', color: 'var(--secondary-color)',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <Users size={14} />
                  <strong>Eligibility Summary:</strong>&nbsp;{eli}
                </div>

                <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1rem' }}>
                  {sch.description}
                </p>

                <div style={{
                  backgroundColor: 'var(--surface-2)', padding: '1rem',
                  borderRadius: '8px', border: '1px solid var(--border-color)',
                }}>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.4rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Briefcase size={14} color="var(--accent-color)" /> Key Benefits
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{sch.benefits}</p>
                </div>

                {occ.length > 0 && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {occ.map(o => (
                      <span key={o} style={{
                        backgroundColor: 'rgba(245,158,11,0.08)', color: '#F59E0B',
                        padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem',
                        fontWeight: 600, border: '1px solid rgba(245,158,11,0.25)',
                      }}>
                        {o}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
