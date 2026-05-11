import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, Tag, ChevronRight, ChevronLeft, Loader2, Briefcase } from 'lucide-react';
import { evaluate, validateProfile } from '../engine';
import { SECTORS } from './Internships';

const validStatesList = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli',
  'Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry',
];

const STEPS = [
  { label: 'Profile & Goals',   icon: Tag },
  { label: 'Personal Info',   icon: User },
  { label: 'Financials', icon: GraduationCap },
  { label: 'Additional Details', icon: Briefcase },
];

export default function FormPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'male', state: 'Maharashtra',
    education: 'school', income: '', category: 'general',
    occupation: 'student', interests: [],
    hasGirlChild: 'no', girlChildAge: '',
    needsInternship: 'yes', internshipSector: 'it',
    isFullTime: 'no', isPremierGrad: 'no', hasGovtFamily: 'no', hasProfessionalDegree: 'no',
  });
  const [loading,  setLoading]  = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setErrorMsg('');
    if (type === 'checkbox') {
      const newInterests = checked
        ? [...formData.interests, value]
        : formData.interests.filter(i => i !== value);
      setFormData(prev => ({ ...prev, interests: newInterests }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = () => {
    if (step === 2) {
      const age = parseInt(formData.age, 10);
      if (!formData.age || isNaN(age) || age < 5 || age > 100) {
        setErrorMsg('Age must be between 5 and 100.'); return false;
      }
    }
    if (step === 3) {
      const inc = parseInt(formData.income, 10);
      if (!formData.income || isNaN(inc) || inc < 0 || inc > 50000000) {
        setErrorMsg('Income must be a valid amount (max ₹5 Crore).'); return false;
      }
    }
    return true;
  };

  const isHigherEdStudent = formData.occupation === 'student' && !['school', 'none'].includes(formData.education);
  const shouldSkipStep4 = !isHigherEdStudent;
  const totalSteps = shouldSkipStep4 ? 3 : 4;

  const nextStep = () => { 
    if (validateStep()) {
      if (step === 3 && shouldSkipStep4) {
        handleSubmitAPI();
      } else {
        setStep(s => s + 1);
      }
    }
  };
  const prevStep = () => { setErrorMsg(''); setStep(s => s - 1); };

  const handleSubmitAPI = () => {
    if (!validateStep()) return;

    setLoading(true);
    setErrorMsg('');

    // Validate with the same rules as the backend
    const validation = validateProfile(formData);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Validation failed. Check your inputs.');
      setLoading(false);
      return;
    }

    // Run the recommendation engine locally (no backend needed)
    try {
      const result = evaluate(formData);
      navigate('/results', {
        state: {
          recommendations: result.recommended,
          disqualified:    result.disqualified,
          userProfile:     formData,
        },
      });
    } catch (e) {
      setErrorMsg('Engine error: ' + e.message);
      setLoading(false);
    }
  };

  const accentColors = ['#E05A30', '#C43D18', '#E8A020', '#D97706'];

  return (
    <div className="container mt-8 mb-8" style={{ maxWidth: '680px' }}>

      {/* ── Step indicator ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {STEPS.map((s, i) => {
            const num      = i + 1;
            const active   = step === num;
            const done     = step > num;
            const accent   = accentColors[i];
            const Icon     = s.icon;
            return (
              <React.Fragment key={num}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: done ? accent : active ? `${accent}22` : 'var(--surface-color)',
                    border: `2px solid ${done || active ? accent : 'var(--border-color)'}`,
                    transition: 'all 0.3s',
                    boxShadow: active ? `0 0 16px ${accent}55` : 'none',
                  }}>
                    <Icon size={16} color={done ? '#fff' : active ? accent : 'var(--text-secondary)'} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: active ? accent : 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ height: '2px', flex: 1, marginBottom: '1.4rem', background: step > num ? accent : 'var(--border-color)', transition: 'background 0.3s' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Error banner ───────────────────────────────────────────────────── */}
      {errorMsg && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '1.5rem',
          color: '#FC8181', fontSize: '0.9rem', fontWeight: 500,
        }}>
          ⚠ {errorMsg}
        </div>
      )}

      {/* ── Form card ──────────────────────────────────────────────────────────── */}
      {/* onSubmit blocks Enter-key ghost-submits; all actions are onClick-driven */}
      <form onSubmit={e => e.preventDefault()} className="card" style={{ padding: '2.5rem' }}>

        {/* Step 1 — Profile & Goals */}
        {step === 1 && (
          <div className="fade-in-up">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>Profile &amp; Goals</h2>
            <p style={{ marginBottom: '2rem', fontSize: '0.875rem' }}>Tell us what you do so we can tailor the recommendations.</p>

            <div className="grid md:grid-cols-2">
              <div className="form-group">
                <label className="form-label">Current Occupation</label>
                <select name="occupation" value={formData.occupation} onChange={handleChange} className="form-control">
                  <option value="student">Student</option>
                  <option value="unemployed">Unemployed / Job Seeker</option>
                  <option value="employee">Salaried Employee</option>
                  <option value="business">Business / Self-Employed</option>
                  <option value="farmer">Farmer</option>
                  <option value="vendor">Street Vendor</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Highest Educational Qualification</label>
                <select name="education" value={formData.education} onChange={handleChange} className="form-control">
                  <option value="school">School (up to 12th)</option>
                  <option value="college">Undergraduate Degree</option>
                  <option value="engineering">Engineering / Professional</option>
                  <option value="medical">Medical Field</option>
                  <option value="graduate">Post-Graduate / Masters</option>
                  <option value="none">None / Other</option>
                </select>
              </div>
            </div>

            {/* Dynamic Internship Sector for Higher Ed Students */}
            {isHigherEdStudent && (
              <div className="grid md:grid-cols-2" style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--primary-faint)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Which internship sector do you prefer?</label>
                  <select name="internshipSector" value={formData.internshipSector} onChange={handleChange} className="form-control">
                    {SECTORS.map(s => (
                      <option key={s.id} value={s.id === 'all' ? 'other' : s.id}>
                        {s.label === 'All Sectors' ? 'Other / Any' : s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0, marginTop: '1.5rem' }}>
              <label className="form-label">Special Interests <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(optional — boosts relevant scheme scores)</span></label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                {[
                  { value: 'startup',     label: '🚀 Startup / Entrepreneurship' },
                  { value: 'agriculture', label: '🌾 Agriculture' },
                  { value: 'technology',  label: '💻 Technology' },
                ].map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    cursor: 'pointer', padding: '0.6rem 1rem',
                    borderRadius: '8px', border: `1px solid ${formData.interests.includes(opt.value) ? 'var(--primary-color)' : 'var(--border-color)'}`,
                    background: formData.interests.includes(opt.value) ? 'var(--primary-faint)' : 'transparent',
                    transition: 'all 0.2s', fontSize: '0.88rem', color: 'var(--text-primary)',
                  }}>
                    <input type="checkbox" name="interests" value={opt.value} checked={formData.interests.includes(opt.value)}
                      onChange={handleChange} style={{ display: 'none' }} />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Personal Info */}
        {step === 2 && (
          <div className="fade-in-up">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>Personal Information</h2>
            <p style={{ marginBottom: '2rem', fontSize: '0.875rem' }}>Basic details used to match your profile.</p>

            <div className="grid md:grid-cols-2">
              <div className="form-group">
                <label className="form-label">Full Name <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(optional)</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="e.g. Anish Sharma" />
              </div>
              <div className="form-group">
                <label className="form-label">Age <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="number" min="0" name="age" value={formData.age} onChange={handleChange} className="form-control" placeholder="e.g. 22" required />
              </div>
            </div>

            <div className="grid md:grid-cols-2">
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="form-control">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">State / UT <span style={{ color: '#EF4444' }}>*</span></label>
                <select name="state" value={formData.state} onChange={handleChange} className="form-control" required>
                  {validStatesList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {formData.occupation !== 'student' && (
              <div className="grid md:grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Do you have a girl child?</label>
                  <select name="hasGirlChild" value={formData.hasGirlChild} onChange={handleChange} className="form-control">
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                {formData.hasGirlChild === 'yes' && (
                  <div className="form-group">
                    <label className="form-label">Age of girl child <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="number" min="0" name="girlChildAge" value={formData.girlChildAge} onChange={handleChange} className="form-control" placeholder="e.g. 5" required />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3 — Financial & Social Category */}
        {step === 3 && (
          <div className="fade-in-up">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>Financial &amp; Category</h2>
            <p style={{ marginBottom: '2rem', fontSize: '0.875rem' }}>Used for eligibility thresholds.</p>

            <div className="grid md:grid-cols-2">
              <div className="form-group">
                <label className="form-label">Annual Family Income (₹) <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="number" min="0" name="income" value={formData.income} onChange={handleChange}
                  className="form-control" placeholder="e.g. 250000" required />
              </div>
              <div className="form-group">
                <label className="form-label">Social Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="form-control">
                  <option value="general">General</option>
                  <option value="obc">OBC (Other Backward Class)</option>
                  <option value="sc">SC (Scheduled Caste)</option>
                  <option value="st">ST (Scheduled Tribe)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Additional Details */}
        {step === 4 && (
          <div className="fade-in-up">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>Additional Details</h2>
            <p style={{ marginBottom: '2rem', fontSize: '0.875rem' }}>These questions help determine your eligibility for the PM Internship Scheme.</p>

            <div className="grid md:grid-cols-2">
              <div className="form-group">
                <label className="form-label">Are you a full-time employee or full-time student?</label>
                <select name="isFullTime" value={formData.isFullTime} onChange={handleChange} className="form-control">
                  <option value="no">No (Distance/Online is fine)</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Did you graduate from an IIT, IIM, NLU, or IISER?</label>
                <select name="isPremierGrad" value={formData.isPremierGrad} onChange={handleChange} className="form-control">
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2">
              <div className="form-group">
                <label className="form-label">Do you have family members in government service?</label>
                <select name="hasGovtFamily" value={formData.hasGovtFamily} onChange={handleChange} className="form-control">
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Do you hold a CA, MBA, or MBBS degree?</label>
                <select name="hasProfessionalDegree" value={formData.hasProfessionalDegree} onChange={handleChange} className="form-control">
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation buttons ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', gap: '1rem' }}>
          {step > 1 ? (
            <button type="button" onClick={prevStep} className="btn btn-secondary" style={{ gap: '0.4rem' }}>
              <ChevronLeft size={16} /> Back
            </button>
          ) : <div />}

          {step < totalSteps ? (
            <button type="button" onClick={nextStep} className="btn btn-primary" style={{ gap: '0.4rem' }}>
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmitAPI} className="btn btn-primary" disabled={loading} style={{ minWidth: '200px', gap: '0.5rem' }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</> : <>Get Recommendations <ChevronRight size={16} /></>}
            </button>
          )}
        </div>
      </form>

      {/* Hint text */}
      <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
        Step {step} of {totalSteps} · Your data is processed locally and never stored.
      </p>
    </div>
  );
}
