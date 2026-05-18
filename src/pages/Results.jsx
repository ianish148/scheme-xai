import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Download, AlertCircle, Check, XCircle,
  RefreshCw, Target, Star, ThumbsUp, Settings2, TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { evaluate } from '../engine';
import { INTERNSHIPS } from './Internships';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

const validStatesList = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli',
  'Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
];

const educationAgeBounds = {
  school:      { min: 5,  max: 100, label: 'School' },
  college:     { min: 16, max: 100, label: 'Undergraduate' },
  engineering: { min: 16, max: 100, label: 'Engineering' },
  medical:     { min: 17, max: 100, label: 'Medical' },
  graduate:    { min: 20, max: 100, label: 'Postgraduate' },
  none:        { min: 5,  max: 100, label: 'No formal education' },
};

// ─── helpers ────────────────────────────────────────────────────────────────
function getScoreColor(score) {
  if (score >= 80) return '#10B981'; // green
  if (score >= 50) return '#F59E0B'; // amber
  return '#EF4444'; // red
}

function ScoreBar({ value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: 'var(--border-color)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: color, transition: 'width 0.5s ease-out', borderRadius: '3px' }} />
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, minWidth: '48px', textAlign: 'right', color }}>
        {value}/{max}
      </span>
    </div>
  );
}

// ─── AI Decision Summary auto-generator ─────────────────────────────────────
function buildAISummary(rec) {
  const lines = [];
  const passed = (rec.passedConditions || []).filter(c => c.type === 'SOFT' || c.type === 'HARD');
  const failed = (rec.failedConditions || []);

  // Strong matches (full score obtained)
  const strong = passed.filter(c => c.type === 'SOFT' && c.awarded === c.max);
  if (strong.length > 0)
    lines.push({ icon: 'check', text: `Strong match in ${strong.map(c => c.category.toLowerCase()).join(' and ')}` });

  // Partial matches
  const partial = passed.filter(c => c.type === 'SOFT' && c.awarded < c.max);
  if (partial.length > 0)
    lines.push({ icon: 'check', text: `Partially matches ${partial.map(c => c.category.toLowerCase()).join(', ')}` });

  // HARD conditions met
  const hardPassed = passed.filter(c => c.type === 'HARD');
  if (hardPassed.length > 0)
    lines.push({ icon: 'check', text: `Mandatory criteria satisfied: ${hardPassed.map(c => c.category).join(', ')}` });

  // Mismatches
  if (failed.length > 0)
    lines.push({ icon: 'warn', text: `Slight mismatch in ${failed.map(c => c.category.toLowerCase()).join(', ')}` });

  return lines;
}

// ─── Score Breakdown per category ───────────────────────────────────────────
function ScoreBreakdown({ rec }) {
  const softPassed = (rec.passedConditions || []).filter(c => c.type === 'SOFT');
  const softFailed = (rec.failedConditions || []).filter(c => c.type === 'SOFT');
  const allRows = [...softPassed, ...softFailed];
  if (allRows.length === 0) return null;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h5 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
        Score Breakdown
      </h5>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {softPassed.map((c, i) => (
          <div key={`sp-${i}`} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem' }}>
            <span style={{ color: '#10B981', fontWeight: 600 }}>✔ {c.category}</span>
            <ScoreBar value={c.awarded} max={c.max} color="#10B981" />
          </div>
        ))}
        {softFailed.map((c, i) => (
          <div key={`sf-${i}`} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem' }}>
            <span style={{ color: '#F59E0B', fontWeight: 600 }}>⚠ {c.category}</span>
            <ScoreBar value={0} max={c.max} color="#F59E0B" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Scheme Card ─────────────────────────────────────────────────────────────
function SchemeCard({ rec, index }) {
  const isHighly = rec.score >= 80;
  const accentColor = isHighly ? '#10B981' : '#F59E0B';
  const badgeBg     = isHighly ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)';
  const badgeIcon  = isHighly
    ? <Star  size={11} fill={accentColor} color={accentColor} />
    : <ThumbsUp size={11} color={accentColor} />;
  const badgeLabel  = isHighly ? 'Highly Eligible' : 'Eligible';
  const totalConds  = rec.numSoftMatches + (rec.failedConditions || []).length;
  const aiSummary   = buildAISummary(rec);

  return (
    <div
      className="scheme-card"
      style={{
        background: 'var(--surface-color)',
        border: `1px solid var(--border-color)`,
        borderTop: `4px solid ${accentColor}`,
        borderRadius: '12px',
        padding: '2rem',
        pageBreakInside: 'avoid',
        breakInside: 'avoid',
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <span className="scheme-badge" style={{
        position: 'absolute', top: '1.25rem', right: '1.25rem',
        backgroundColor: badgeBg, color: accentColor,
        padding: '0.3rem 0.85rem', borderRadius: '9999px',
        fontSize: '0.78rem', fontWeight: 700, border: `1px solid ${accentColor}33`,
        display: 'flex', alignItems: 'center', gap: '0.35rem',
      }}>
        {badgeIcon}{badgeLabel}
      </span>

      {/* Header */}
      <div className="scheme-card-header" style={{ marginBottom: '1.25rem', paddingRight: '10rem' }}>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', marginBottom: '0.25rem' }}>{rec.name}</h3>
        <a href={rec.url} target="_blank" rel="noreferrer"
           style={{ fontSize: '0.8rem', color: 'var(--secondary-color)', textDecoration: 'underline' }}>
          {rec.url}
        </a>
      </div>

      {/* Total confidence bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Confidence Score &nbsp;·&nbsp; {rec.numSoftMatches}/{totalConds} conditions
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: accentColor }}>{rec.score}%</span>
        </div>
        <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--border-color)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${rec.score}%`, backgroundColor: accentColor, transition: 'width 0.6s ease-out', borderRadius: '4px' }} />
        </div>
      </div>

      {/* AI Decision Summary */}
      {aiSummary.length > 0 && (
        <div style={{
          backgroundColor: 'var(--primary-faint)', border: '1px solid var(--border-bright)',
          borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.5rem',
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
            AI Decision Summary
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {aiSummary.map((line, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem' }}>
                {line.icon === 'check'
                  ? <Check size={14} color="#10B981" style={{ flexShrink: 0, marginTop: '3px' }} />
                  : <AlertCircle size={14} color="#F59E0B" style={{ flexShrink: 0, marginTop: '3px' }} />}
                <span style={{ color: 'var(--text-primary)' }}>{line.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-category score breakdown */}
      <ScoreBreakdown rec={rec} />

      {/* Description + Benefits */}
      <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '0.5rem' }}>
        <strong>Description:</strong> {rec.description}
      </p>
      <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
        <strong>Benefits:</strong> {rec.benefits}
      </p>

      {/* Full XAI trace */}
      <div style={{
        backgroundColor: 'rgba(20,184,166,0.05)', border: '1px solid rgba(20,184,166,0.25)',
        borderLeft: '4px solid var(--secondary-color)', borderRadius: '8px', padding: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <CheckCircle2 color="var(--secondary-color)" size={18} />
          <h4 style={{ color: 'var(--secondary-color)', margin: 0, fontSize: '0.95rem' }}>
            Why Recommended (Full Trace)
          </h4>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(rec.passedConditions || []).map((c, i) => (
            <div key={`pc-${i}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Check size={14} color="#10B981" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span style={{ color: 'var(--text-primary)' }}>
                {c.type === 'HARD'
                  ? <><strong>[{c.category} — HARD] ✔</strong> {c.message}</>
                  : <><strong>[{c.category}: {c.awarded}/{c.max}] ✔</strong> {c.message}</>}
              </span>
            </div>
          ))}
          {(rec.failedConditions || []).map((c, i) => (
            <div key={`fc-${i}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.85 }}>
              <XCircle size={14} color="#F59E0B" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>
                <strong>[{c.category}: 0/{c.max}] ⚠</strong> {c.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Simulator impact indicator ───────────────────────────────────────────────
function ImpactIndicator({ prev, current, label }) {
  if (prev === undefined || prev === current) return null;
  const up = current > prev;
  return (
    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: up ? '#10B981' : '#EF4444', marginLeft: '0.4rem' }}>
      {up ? <TrendingUp size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> : <TrendingDown size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />}
      {' '}{up ? '↑' : '↓'}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Results() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const prevScore = useRef(null);

  const [userProfile,    setUserProfile]    = useState(location.state?.userProfile);
  const [recommendations,setRecommendations]= useState(location.state?.recommendations || []);
  const [disqualified,   setDisqualified]   = useState(location.state?.disqualified || []);
  const [isExporting,    setIsExporting]    = useState(false);
  const [simulatorError, setSimulatorError] = useState('');
  const [isSimulating,   setIsSimulating]   = useState(false);
  const [prevProfile,    setPrevProfile]    = useState(null);

  // Cross-field validation (client-side, mirrors server)
  const validateProfile = (p) => {
    const age  = parseInt(p.age, 10);
    const inc  = parseInt(p.income, 10);
    if (isNaN(age) || age < 5 || age > 100) return 'Age must be between 5 and 100.';
    if (isNaN(inc) || inc <= 0 || inc > 600000) return 'Income must be a valid positive number under ₹6 Lakh.';
    const bound = educationAgeBounds[p.education];
    if (bound && (age < bound.min || age > bound.max))
      return `Cross-field error: ${bound.label} students must be between ${bound.min} and ${bound.max} years old.`;
    return null;
  };

  // Re-run on profile change (debounced)
  useEffect(() => {
    if (!userProfile) return;
    const clientError = validateProfile(userProfile);
    if (clientError) { setSimulatorError(clientError); return; }

    setIsSimulating(true);
    setSimulatorError('');

    const id = setTimeout(() => {
      try {
        const result = evaluate(userProfile);
        setRecommendations(result.recommended);
        setDisqualified(result.disqualified);
      } catch (e) {
        setSimulatorError('Engine error: ' + e.message);
      } finally {
        setIsSimulating(false);
      }
    }, 350);
    return () => clearTimeout(id);
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrevProfile(userProfile);
    setUserProfile(p => ({ ...p, [name]: value }));
  };

  // ── PDF Export ──────────────────────────────────────────────────────────────
  const handleDownload = async () => {
    setIsExporting(true);
    await new Promise(r => setTimeout(r, 600)); // let DOM update

    const el = document.getElementById('pdf-content');
    if (!el) { setIsExporting(false); return; }

    el.classList.add('print-mode');
    try {
      if (Capacitor.isNativePlatform()) {
        const pdfBase64 = await html2pdf().set({
          margin:      [10, 10, 10, 10],
          image:       { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, windowWidth: 1100, scrollY: 0 },
          jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak:   { mode: ['avoid-all', 'css', 'legacy'] },
        }).from(el).outputPdf('datauristring');
        
        const base64Data = pdfBase64.split(',')[1];
        
        const result = await Filesystem.writeFile({
          path: 'XAI_Scheme_Report.pdf',
          data: base64Data,
          directory: Directory.Cache
        });
        
        await Share.share({
          title: 'XAI Scheme Report',
          url: result.uri,
          dialogTitle: 'Save or Share your report'
        });
      } else {
        await html2pdf().set({
          margin:      [10, 10, 10, 10],
          filename:    'XAI_Scheme_Report.pdf',
          image:       { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, windowWidth: 1100, scrollY: 0 },
          jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak:   { mode: ['avoid-all', 'css', 'legacy'] },
        }).from(el).save();
      }
    } catch (err) {
      console.error("PDF Export failed:", err);
      if (Capacitor.isNativePlatform()) {
        alert("Failed to export PDF. Please try again.");
      }
    } finally {
      el.classList.remove('print-mode');
      setIsExporting(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="container mt-8 text-center">
        <h2>No session data found</h2>
        <p>Please fill in your profile first.</p>
        <button className="btn btn-primary" onClick={() => navigate('/form')}>Go to Form</button>
      </div>
    );
  }

  // Segment recommendations
  const pmInternship = recommendations.find(r => r.id === 'pm-internship');
  const regularRecs  = recommendations.filter(r => r.id !== 'pm-internship');
  const regularDisq  = disqualified.filter(r => r.id !== 'pm-internship');

  const highlyRec = regularRecs.filter(r => r.score >= 80);
  const eligible  = regularRecs.filter(r => r.score >= 50 && r.score < 80);
  const bestMatch = highlyRec[0] || eligible[0] || null;

  const recommendedInternships = pmInternship && userProfile.needsInternship === 'yes'
    ? INTERNSHIPS.filter(i => userProfile.internshipSector === 'other' || i.sector === userProfile.internshipSector).slice(0, 3)
    : [];

  const topScore  = bestMatch?.score ?? 0;

  return (
    <div className="container mb-8" style={{ maxWidth: '1400px', marginTop: '2rem' }}>

      {/* ── Top Controls ─────────────────────────────────────────────────── */}
      {!isExporting && (
        <div className="top-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="top-controls-left" style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/form')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowLeft size={16} /> Back to Form
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/explore')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Explore All Schemes
            </button>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleDownload}
            disabled={recommendations.length === 0 && disqualified.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={16} />
            {isExporting ? 'Generating PDF...' : 'Export PDF Report'}
          </button>
        </div>
      )}

      <div className={`results-layout ${isExporting ? 'exporting' : ''}`}>

        {/* ── LEFT: What-If Simulator ──────────────────────────────────────── */}
        {!isExporting && (
          <div className="simulator-panel">
            <div className="card" style={{ position: 'sticky', top: '1.5rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Settings2 size={16} color="var(--primary-color)" /> What-If Simulator
                </h3>
                {isSimulating && <RefreshCw size={14} color="var(--primary-color)" style={{ animation: 'spin 1s linear infinite' }} />}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Adjust inputs to see live eligibility changes. Invalid combinations show an error.
              </p>

              {simulatorError && (
                <div style={{
                  backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid #EF4444',
                  borderRadius: '6px', padding: '0.75rem', marginBottom: '1rem',
                  fontSize: '0.82rem', color: '#EF4444', fontWeight: 600, lineHeight: 1.4,
                }}>
                  ⚠ {simulatorError}
                </div>
              )}

              {[
                { label: 'Age', name: 'age', type: 'number' },
                { label: 'Annual Income (₹)', name: 'income', type: 'number' },
              ].map(f => (
                <div key={f.name} style={{ marginBottom: '0.9rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>{f.label}</label>
                  <input
                    type={f.type} name={f.name} value={userProfile[f.name]}
                    onChange={handleChange} className="form-control"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                  />
                  {prevProfile && prevProfile[f.name] !== userProfile[f.name] && (
                    <div style={{ fontSize: '0.72rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {parseInt(userProfile[f.name]) > parseInt(prevProfile[f.name])
                        ? <><TrendingUp size={11} color="#10B981" /><span style={{ color: '#10B981' }}>Increased from {prevProfile[f.name]}</span></>
                        : <><TrendingDown size={11} color="#F59E0B" /><span style={{ color: '#F59E0B' }}>Decreased from {prevProfile[f.name]}</span></>}
                    </div>
                  )}
                </div>
              ))}

              <div style={{ marginBottom: '0.9rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Highest Education</label>
                <select name="education" value={userProfile.education} onChange={handleChange}
                  className="form-control" style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}>
                  <option value="school">School (up to 12th)</option>
                  <option value="college">Undergraduate Degree</option>
                  <option value="engineering">Engineering / Professional</option>
                  <option value="medical">Medical Field</option>
                  <option value="graduate">Post-Graduate / Masters</option>
                  <option value="none">None / Other</option>
                </select>
              </div>
              <div style={{ marginBottom: '0.9rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Occupation</label>
                <select name="occupation" value={userProfile.occupation} onChange={handleChange}
                  className="form-control" style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}>
                  <option value="student">Student</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="employee">Salaried Employee</option>
                  <option value="business">Business / Self-Employed</option>
                  <option value="farmer">Farmer</option>
                  <option value="vendor">Street Vendor</option>
                </select>
              </div>
              <div style={{ marginBottom: '0.9rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Category</label>
                <select name="category" value={userProfile.category} onChange={handleChange}
                  className="form-control" style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}>
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC (Scheduled Caste)</option>
                  <option value="st">ST (Scheduled Tribe)</option>
                </select>
                {prevProfile && prevProfile.category !== userProfile.category && (
                  <div style={{ fontSize: '0.72rem', marginTop: '2px', color: 'var(--primary-color)' }}>
                    ↪ Changed from <strong>{prevProfile.category?.toUpperCase()}</strong> — rules recalculated
                  </div>
                )}
              </div>
              <div style={{ marginBottom: '0.9rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>State</label>
                <select name="state" value={userProfile.state} onChange={handleChange}
                  className="form-control" style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}>
                  {validStatesList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Current result count summary */}
              <div style={{
                marginTop: '1rem', padding: '0.75rem', borderRadius: '6px',
                backgroundColor: 'var(--primary-faint)', border: '1px solid var(--border-color)',
                fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6,
              }}>
                <strong style={{ color: 'var(--text-primary)' }}>Live Results:</strong><br />
                {pmInternship && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#E8A020', fontWeight: 600 }}>💼 PM Internship Eligible!</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Star size={12} color="#10B981" /> Highly Eligible: {highlyRec.length}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ThumbsUp size={12} color="#F59E0B" /> Eligible: {eligible.length}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><XCircle size={12} color="#EF4444" /> Disqualified: {regularDisq.length}</div>
              </div>
            </div>
          </div>
        )}

        {/* ── RIGHT: PDF Content Area ──────────────────────────────────────── */}
        <div className="results-content-panel">
          <div id="pdf-content" style={{ padding: isExporting ? '24px' : '0' }}>

            {/* User Profile Summary */}
            <div className="profile-summary" style={{
              marginBottom: '2rem', padding: '1.5rem',
              background: 'var(--surface-color)', borderRadius: '10px',
              border: '1px solid var(--border-color)',
            }}>
              <h2 style={{ color: 'var(--text-primary)', fontSize: '1.6rem', marginBottom: '0.25rem' }}>
                Personalized Scheme Recommendations
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Based on your profile — expert system analysis
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {[
                  ['Age',        userProfile.age],
                  ['State',       userProfile.state],
                  ['Education',   userProfile.education],
                  ['Income',      `₹${Number(userProfile.income).toLocaleString('en-IN')}`],
                  ['Category',    (userProfile.category || 'general').toUpperCase()],
                  ['Occupation',  userProfile.occupation],
                ].map(([k, v]) => (
                  <span key={k} style={{
                    backgroundColor: 'var(--primary-faint)', border: '1px solid var(--border-color)',
                    borderRadius: '6px', padding: '0.3rem 0.75rem', fontSize: '0.82rem',
                    color: 'var(--text-primary)', fontWeight: 500,
                  }}>
                    {k}: <strong style={{ color: 'var(--text-primary)' }}>{v}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* PM Internship Hero (If Eligible) */}
            {pmInternship && !isExporting && (
              <div style={{
                marginBottom: '2.5rem', padding: '1.75rem',
                background: 'linear-gradient(135deg, rgba(232,160,32,0.1) 0%, rgba(232,160,32,0.02) 100%)',
                border: '1px solid rgba(232,160,32,0.3)', borderRadius: '12px',
                borderLeft: '4px solid #E8A020',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                      <span style={{ backgroundColor: '#E8A020', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Special Program
                      </span>
                    </div>
                    <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', margin: '0 0 0.5rem' }}>
                      {pmInternship.name}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 1rem', maxWidth: '600px', lineHeight: 1.5 }}>
                      You are eligible for the Prime Minister Internship Scheme! Receive a stipend of <strong>₹5,000/month</strong> + ₹6,000 one-time grant for a 12-month internship with India's top 500 companies.
                    </p>
                  </div>
                  <button className="btn btn-primary" onClick={() => navigate('/internships')} style={{ backgroundColor: '#E8A020', color: '#fff', border: 'none' }}>
                    Explore All Internships →
                  </button>
                </div>

                {recommendedInternships.length > 0 && (
                  <div style={{ marginTop: '1.5rem', width: '100%', borderTop: '1px solid rgba(232,160,32,0.2)', paddingTop: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>Top Matches in Your Sector</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      {recommendedInternships.map(intern => (
                        <div key={intern.id} style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <div style={{ width: '48px', height: '48px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                              <img src={intern.logo} alt={intern.company} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                              <div style={{ display: 'none', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>{intern.company.charAt(0)}</div>
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{intern.role}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{intern.company} • {intern.location}</div>
                            </div>
                          </div>
                          <a href="https://pminternship.mca.gov.in" target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none', flexShrink: 0, padding: '0.2rem 0.5rem', border: '1px solid var(--primary-color)', borderRadius: '4px' }}>
                            Apply ↗
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 🎯 Best Match Hero */}
            {bestMatch && !isExporting && (
              <div style={{
                marginBottom: '2.5rem', padding: '1.75rem',
                background: 'linear-gradient(135deg, var(--primary-faint) 0%, rgba(20,184,166,0.08) 100%)',
                border: '1px solid var(--border-bright)', borderRadius: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <Target size={22} color="var(--primary-color)" />
                  <h3 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Best Match for You
                  </h3>
                </div>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {bestMatch.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: getScoreColor(bestMatch.score) }}>
                    {bestMatch.score}%
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Confidence Score</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {buildAISummary(bestMatch).slice(0, 3).map((line, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                      {line.icon === 'check'
                        ? <Check size={14} color="#10B981" />
                        : <AlertCircle size={14} color="#F59E0B" />}
                      <span style={{ color: 'var(--text-primary)' }}>{line.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Highly Recommended (≥80) ─────────────────────── */}
            {highlyRec.length > 0 && (
              <section style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '2px solid #10B981' }}>
                  <Star size={22} color="#10B981" fill="#10B981" />
                  <h2 style={{ margin: 0, color: '#10B981', fontSize: '1.2rem' }}>Highly Recommended (Score ≥ 80)</h2>
                  <span style={{ marginLeft: 'auto', backgroundColor: 'rgba(16,185,129,0.12)', color: '#10B981', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700 }}>
                    {highlyRec.length} scheme{highlyRec.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {highlyRec.map((rec, i) => <SchemeCard key={rec.id} rec={rec} index={i} />)}
                </div>
              </section>
            )}

            {/* ── Eligible (50–79) ─────────────────────────────── */}
            {eligible.length > 0 && (
              <section style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '2px solid #F59E0B' }}>
                  <ThumbsUp size={22} color="#F59E0B" />
                  <h2 style={{ margin: 0, color: '#F59E0B', fontSize: '1.2rem' }}>Eligible (Score 50–79)</h2>
                  <span style={{ marginLeft: 'auto', backgroundColor: 'rgba(245,158,11,0.12)', color: '#F59E0B', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700 }}>
                    {eligible.length} scheme{eligible.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {eligible.map((rec, i) => <SchemeCard key={rec.id} rec={rec} index={i} />)}
                </div>
              </section>
            )}

            {/* No results fallback */}
            {recommendations.length === 0 && (
              <div className="card text-center" style={{ padding: '3rem 2rem', marginBottom: '2rem', border: '1px solid rgba(239,68,68,0.4)' }}>
                <AlertCircle size={44} color="#EF4444" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ color: '#EF4444' }}>No Eligible Schemes Found</h3>
                <p>Your current profile does not satisfy the minimum criteria for any scheme. Try adjusting parameters in the simulator.</p>
              </div>
            )}



          </div>{/* end #pdf-content */}
        </div>

      </div>
    </div>
  );
}
