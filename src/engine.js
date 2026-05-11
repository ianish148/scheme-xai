/**
 * engine.js
 * Pure JavaScript port of the XAI recommendation engine (api/index.py).
 * Runs 100% in the browser — no backend required.
 */

// ─── Scheme Database ───────────────────────────────────────────────────────────
const SCHEMES = [
  { id: 'pm-kisan',          name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',         description: "Direct income support to all landholding farmers' families in the country.",                                                                                                 benefits: '₹6,000 per year in three equal installments.',                                 url: 'https://pmkisan.gov.in/',                          validStates: ['ALL'] },
  { id: 'mudra-yojana',      name: 'Pradhan Mantri Mudra Yojana (PMMY)',                   description: 'Loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises.',                                                                                               benefits: 'Financial support for starting or expanding micro-businesses.',                 url: 'https://www.mudra.org.in/',                        validStates: ['ALL'] },
  { id: 'pm-scholarship',    name: "Prime Minister's Scholarship Scheme (PMSS)",           description: 'To encourage higher technical and professional education for the dependent wards of Ex-Servicemen and Coast Guard personnel.',                                         benefits: 'Financial assistance (₹2500/month for boys, ₹3000/month for girls).',           url: 'https://www.myscheme.gov.in/schemes/pmss',         validStates: ['ALL'] },
  { id: 'skill-india',       name: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)',          description: 'Skill certification scheme to enable Indian youth to take up industry-relevant skill training.',                                                                       benefits: 'Free skill training and certification.',                                        url: 'https://www.pmkvyofficial.org/',                   validStates: ['ALL'] },
  { id: 'digital-india-bpo', name: 'Digital India BPO Scheme',                            description: 'To incentivize BPO/ITES operations across the country, particularly in Tier 2/3 cities.',                                                                             benefits: 'Financial support for youth employment in IT sectors.',                         url: 'https://www.digitalindia.gov.in/',                 validStates: ['ALL'] },
  { id: 'stand-up-india',    name: 'Stand-Up India',                                      description: 'Facilitates bank loans between ₹10 lakh and ₹1 Crore to at least one SC/ST borrower and one woman borrower per bank branch.',                                       benefits: 'Credit facility for setting up a greenfield enterprise.',                       url: 'https://www.standupmitra.in/',                     validStates: ['ALL'] },
  { id: 'pm-jay',            name: 'Ayushman Bharat (PM-JAY)',                            description: 'Health insurance cover of ₹5 lakhs per family per year for secondary and tertiary care hospitalization.',                                                            benefits: 'Free healthcare coverage for vulnerable families.',                             url: 'https://pmjay.gov.in/',                            validStates: ['ALL'] },
  { id: 'nmms',              name: 'National Means-cum-Merit Scholarship (NMMS)',          description: 'For students of class 9 to 12. To check dropouts at class 8 and encourage them to continue studies.',                                                                 benefits: '₹12000 per annum to eligible students.',                                       url: 'https://scholarships.gov.in/',                     validStates: ['ALL'] },
  { id: 'pm-svanidhi',       name: 'PM SVANidhi Yojana',                                  description: 'A special micro-credit facility for street vendors to resume their livelihoods.',                                                                                      benefits: 'Working capital loan up to ₹10,000.',                                          url: 'https://pmsvanidhi.mohua.gov.in/',                 validStates: ['ALL'] },
  { id: 'ssy',               name: 'Sukanya Samriddhi Yojana (SSY)',                      description: 'Targeted at the parents of girl children, encourages building a fund for future education and marriage expenses.',                                                      benefits: 'High interest rate and tax benefits.',                                          url: 'https://www.india.gov.in/sukanya-samriddhi-yojna', validStates: ['ALL'] },
  { id: 'pm-internship',     name: 'Prime Minister Internship Scheme (PMIS)',             description: '12-month paid internships with India\'s top 500 companies. Launched by Ministry of Corporate Affairs.',                                                               benefits: '₹5,000/month stipend + ₹6,000 one-time grant.',                                 url: '/internships',                                     validStates: ['ALL'] },
];

// ─── Validation constants ──────────────────────────────────────────────────────
const EDUCATION_AGE_BOUNDS = {
  school:      { min: 5,  max: 100, label: 'School' },
  college:     { min: 16, max: 100, label: 'Undergraduate College' },
  engineering: { min: 16, max: 100, label: 'Engineering' },
  medical:     { min: 17, max: 100, label: 'Medical' },
  graduate:    { min: 20, max: 100, label: 'Postgraduate' },
  none:        { min: 5,  max: 100, label: 'No formal education' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function incomeLimit(category, base) {
  if (category === 'sc' || category === 'st') return Math.floor(base * 1.5);
  if (category === 'obc') return Math.floor(base * 1.2);
  return base;
}

function incomePassMsg(category, base) {
  const lim = incomeLimit(category, base);
  if (category === 'sc')  return `SC relaxed income ceiling ≤₹${lim.toLocaleString('en-IN')} — qualifies`;
  if (category === 'st')  return `ST relaxed income ceiling ≤₹${lim.toLocaleString('en-IN')} — qualifies`;
  if (category === 'obc') return `OBC moderate income ceiling ≤₹${lim.toLocaleString('en-IN')} — qualifies`;
  return `Income within standard limit ≤₹${lim.toLocaleString('en-IN')}`;
}

function incomeFailMsg(category, base) {
  const lim = incomeLimit(category, base);
  if (category === 'sc')  return `Income exceeds SC relaxed ceiling ₹${lim.toLocaleString('en-IN')}`;
  if (category === 'st')  return `Income exceeds ST relaxed ceiling ₹${lim.toLocaleString('en-IN')}`;
  if (category === 'obc') return `Income exceeds OBC ceiling ₹${lim.toLocaleString('en-IN')}`;
  return `Income exceeds standard limit ₹${lim.toLocaleString('en-IN')}`;
}

// ─── Core evaluator ──────────────────────────────────────────────────────────
function evaluateScheme(user, schemeCtx, ruleset) {
  let score = 0;
  const passedConditions = [];
  const failedConditions = [];
  const hardFailures = [];
  let numSoftMatches = 0;

  // State check
  const validStates = schemeCtx.validStates || ['ALL'];
  if (!validStates.includes('ALL') && !validStates.includes(user.state)) {
    hardFailures.push(`State (${user.state || 'Unknown'}) is ineligible for this scheme.`);
  }

  for (const rule of ruleset) {
    const { type, category: rcat = 'General', passMessage = '', failMessage = '', weight = 0, condition } = rule;

    if (type === 'HARD') {
      if (condition(user)) {
        passedConditions.push({ category: rcat, awarded: 0, max: 0, status: '✔', message: passMessage, type: 'HARD' });
      } else {
        hardFailures.push(failMessage);
      }
    } else if (type === 'SOFT') {
      if (condition(user)) {
        score += weight;
        numSoftMatches++;
        passedConditions.push({ category: rcat, awarded: weight, max: weight, status: '✔', message: passMessage, type: 'SOFT' });
      } else {
        failedConditions.push({ category: rcat, awarded: 0, max: weight, status: '✖', message: failMessage, type: 'SOFT' });
      }
    } else if (type === 'BONUS') {
      if (condition(user)) {
        score += weight;
        passedConditions.push({ category: rcat, awarded: weight, max: weight, status: '✔', message: passMessage, type: 'BONUS' });
      }
    }
  }

  score = Math.min(score, 100);
  return { ...schemeCtx, score, passedConditions, failedConditions, hardFailures, numSoftMatches };
}

// ─── Validation ──────────────────────────────────────────────────────────────
export function validateProfile(profile) {
  const age    = parseInt(profile.age, 10);
  const income = parseInt(profile.income, 10);

  if (isNaN(age) || age < 5 || age > 100)
    return { valid: false, error: 'Invalid Age.' };
  if (isNaN(income) || income <= 0 || income > 50000000)
    return { valid: false, error: 'Invalid Income.' };

  const bound = EDUCATION_AGE_BOUNDS[profile.education];
  if (bound && (age < bound.min || age > bound.max))
    return { valid: false, error: `Age ${age} invalid for ${bound.label}` };

  return { valid: true };
}

// ─── Main engine ─────────────────────────────────────────────────────────────
export function evaluate(rawProfile) {
  const age        = parseInt(rawProfile.age, 10);
  const income     = parseInt(rawProfile.income, 10);
  const gender     = (rawProfile.gender     || '').toLowerCase();
  const education  = (rawProfile.education  || '').toLowerCase();
  const occupation = (rawProfile.occupation || '').toLowerCase();
  const interests  = rawProfile.interests   || [];
  const state      = rawProfile.state       || '';
  let   category   = (rawProfile.category   || 'general').toLowerCase();
  if (!['sc','st','obc','general'].includes(category)) category = 'general';

  const isFullTime            = rawProfile.isFullTime            || 'no';
  const isPremierGrad         = rawProfile.isPremierGrad         || 'no';
  const hasGovtFamily         = rawProfile.hasGovtFamily         || 'no';
  const hasProfessionalDegree = rawProfile.hasProfessionalDegree || 'no';
  const needsInternship       = rawProfile.needsInternship       || 'yes';
  const internshipSector      = rawProfile.internshipSector      || 'other';
  const hasGirlChild          = rawProfile.hasGirlChild          || 'no';
  const girlChildAge          = parseInt(rawProfile.girlChildAge, 10) || 0;

  const u = { age, income, gender, education, occupation, category, interests, state, isFullTime, isPremierGrad, hasGovtFamily, hasProfessionalDegree, needsInternship, internshipSector, hasGirlChild, girlChildAge };
  const cat = category;
  const evaluated = [];

  // ── PM-KISAN ──────────────────────────────────────────────────────────────
  const pmKisan = SCHEMES.find(s => s.id === 'pm-kisan');
  if (pmKisan) {
    evaluated.push(evaluateScheme(u, pmKisan, [
      { type: 'HARD', category: 'Occupation', condition: u => u.occupation === 'farmer',                                                  passMessage: 'Occupation matches Farmer',                                 failMessage: 'Occupation must be Farmer (mandatory condition failed)' },
      { type: 'SOFT', category: 'Income',     weight: 40, condition: u => u.income <= incomeLimit(cat, 250000),                           passMessage: incomePassMsg(cat, 250000),                                  failMessage: incomeFailMsg(cat, 250000) },
      { type: 'SOFT', category: 'Age',        weight: 30, condition: u => u.age >= 18,                                                    passMessage: 'Age verified for land ownership (≥ 18)',                    failMessage: 'Age under 18 — land ownership questionable' },
      { type: 'SOFT', category: 'Base Metric',weight: 20, condition: () => true,                                                          passMessage: 'General agricultural eligibility met',                      failMessage: '' },
      { type: 'BONUS',category: 'Interests',  weight: 10, condition: u => u.interests.includes('agriculture'),                            passMessage: 'Matches explicit interest in agriculture' },
    ]));
  }

  // ── MUDRA YOJANA ─────────────────────────────────────────────────────────
  const mudra = SCHEMES.find(s => s.id === 'mudra-yojana');
  if (mudra) {
    evaluated.push(evaluateScheme(u, mudra, [
      { type: 'HARD', category: 'Occupation',           condition: u => ['business','entrepreneur','unemployed'].includes(u.occupation),  passMessage: 'Occupation qualifies for micro-loans',                      failMessage: 'Must be seeking business / micro-enterprise support' },
      { type: 'SOFT', category: 'Age',          weight: 30, condition: u => u.age >= 18 && u.age <= 65,                                  passMessage: 'Age within active work demographic (18–65)',                failMessage: 'Age outside optimal target group' },
      { type: 'SOFT', category: 'Education',    weight: 20, condition: u => u.education !== 'school',                                    passMessage: 'Has basic higher education metrics',                        failMessage: 'Lacks higher educational background' },
      { type: 'SOFT', category: 'Gender',       weight: 20, condition: u => u.gender === 'female',                                       passMessage: 'Female applicant — entitled to superior interest rates',    failMessage: 'Not eligible for female-specific rate benefits' },
      { type: 'SOFT', category: 'Demographic Category', weight: 20, condition: u => ['sc','st','obc'].includes(u.category),              passMessage: 'SC/ST/OBC — priority processing',                          failMessage: 'General category — standard processing applies' },
      { type: 'BONUS',category: 'Interests',    weight: 10, condition: u => u.interests.includes('startup'),                             passMessage: 'Matches interest in entrepreneurship' },
    ]));
  }

  // ── PM SCHOLARSHIP ───────────────────────────────────────────────────────
  const pmSchol = SCHEMES.find(s => s.id === 'pm-scholarship');
  if (pmSchol) {
    evaluated.push(evaluateScheme(u, pmSchol, [
      { type: 'HARD', category: 'Education',            condition: u => ['college','engineering','medical','graduate'].includes(u.education),       passMessage: 'Actively pursuing higher-education degree',                 failMessage: 'Must be pursuing a professional / technical degree' },
      { type: 'SOFT', category: 'Occupation',   weight: 40, condition: u => u.occupation === 'student',                                  passMessage: 'Occupation is Student',                                     failMessage: 'Not primarily a student' },
      { type: 'SOFT', category: 'Age',          weight: 30, condition: u => u.age >= 17 && u.age <= 25,                                  passMessage: 'Age matches standard college demographic (17–25)',           failMessage: 'Age outside standard cohort' },
      { type: 'SOFT', category: 'Income',       weight: 20, condition: u => u.income < incomeLimit(cat, 500000),                        passMessage: incomePassMsg(cat, 500000),                                  failMessage: incomeFailMsg(cat, 500000) },
      { type: 'BONUS',category: 'Demographic Category', weight: 10, condition: u => ['sc','st','obc'].includes(u.category),             passMessage: 'SC/ST/OBC — extra priority for scholarship allocation' },
    ]));
  }

  // ── SKILL INDIA ──────────────────────────────────────────────────────────
  const skillIndia = SCHEMES.find(s => s.id === 'skill-india');
  if (skillIndia) {
    evaluated.push(evaluateScheme(u, skillIndia, [
      { type: 'HARD', category: 'Age',                  condition: u => u.age >= 18,                                                     passMessage: 'Age ≥ 18 for skill-labor enrollment',                      failMessage: 'Must be an adult (18+) for enrollment' },
      { type: 'SOFT', category: 'Occupation',   weight: 40, condition: u => ['unemployed','student','vendor'].includes(u.occupation),    passMessage: 'Target demographic for upskilling',                        failMessage: 'Currently in stable non-target employment' },
      { type: 'SOFT', category: 'Education',    weight: 20, condition: u => ['school','none'].includes(u.education),                    passMessage: 'Lower formal education — prioritised cohort',               failMessage: 'Already possesses advanced degree' },
      { type: 'SOFT', category: 'Demographic Category', weight: 30, condition: u => ['sc','st','obc'].includes(u.category),             passMessage: 'SC/ST/OBC — priority processing',                          failMessage: 'General category — unreserved' },
      { type: 'BONUS',category: 'Interests',    weight: 10, condition: u => u.interests.includes('technology'),                         passMessage: 'Technology upskilling interest recorded' },
    ]));
  }

  // ── DIGITAL INDIA BPO ────────────────────────────────────────────────────
  const bpo = SCHEMES.find(s => s.id === 'digital-india-bpo');
  if (bpo) {
    evaluated.push(evaluateScheme(u, bpo, [
      { type: 'HARD', category: 'Age',                  condition: u => u.age >= 18 && u.age <= 35,                                     passMessage: 'Age between 18–35 (core target)',                          failMessage: 'Age must be 18–35 for youth IT employment' },
      { type: 'HARD', category: 'Education',            condition: u => ['college','engineering','medical','graduate'].includes(u.education),      passMessage: 'Possesses required formal degree',                         failMessage: 'IT sector requires minimum collegiate background' },
      { type: 'HARD', category: 'Student Status',       condition: u => u.occupation !== 'student',                                     passMessage: 'Not currently a student',                                  failMessage: 'Full-time students are ineligible for BPO employment' },
      { type: 'SOFT', category: 'Occupation',   weight: 50, condition: u => ['unemployed'].includes(u.occupation),            passMessage: 'Actively seeking placement',                               failMessage: 'Not actively seeking entry-level jobs' },
      { type: 'SOFT', category: 'Income',       weight: 40, condition: u => u.income < 800000,                                          passMessage: 'Meets income equity band (< ₹8L)',                         failMessage: 'Exceeds standard income band' },
      { type: 'BONUS',category: 'Interests',    weight: 10, condition: u => u.interests.includes('technology'),                         passMessage: 'Interest aligns with BPO/IT sector' },
    ]));
  }

  // ── STAND UP INDIA ───────────────────────────────────────────────────────
  const standUp = SCHEMES.find(s => s.id === 'stand-up-india');
  if (standUp) {
    evaluated.push(evaluateScheme(u, standUp, [
      { type: 'HARD', category: 'Demography',           condition: u => u.gender === 'female' || ['sc','st'].includes(u.category),      passMessage: 'Meets diversity constraint (Women or SC/ST)',              failMessage: 'Scheme restricted to Women or SC/ST entrepreneurs only' },
      { type: 'HARD', category: 'Age',                  condition: u => u.age >= 18,                                                    passMessage: 'Applicant is a legal adult',                               failMessage: 'Must be 18+ to assume debt' },
      { type: 'SOFT', category: 'Occupation',   weight: 50, condition: u => ['business','entrepreneur','unemployed'].includes(u.occupation), passMessage: 'Seeking to establish enterprise',                     failMessage: 'Not matching primary commercial intent' },
      { type: 'SOFT', category: 'Income',       weight: 40, condition: u => u.income > 200000,                                          passMessage: 'Baseline assets for co-financing present',                 failMessage: 'Extremely low income — risk' },
      { type: 'BONUS',category: 'Interests',    weight: 10, condition: u => u.interests.includes('startup'),                            passMessage: 'Startup interest aligns with scheme focus' },
    ]));
  }

  // ── PM-JAY ───────────────────────────────────────────────────────────────
  const pmJay = SCHEMES.find(s => s.id === 'pm-jay');
  if (pmJay) {
    evaluated.push(evaluateScheme(u, pmJay, [
      { type: 'HARD', category: 'Income',               condition: u => u.income <= incomeLimit(cat, 250000),                           passMessage: incomePassMsg(cat, 250000),                                  failMessage: incomeFailMsg(cat, 250000) },
      { type: 'SOFT', category: 'Occupation',   weight: 30, condition: u => ['farmer','vendor','unemployed'].includes(u.occupation),    passMessage: 'Vulnerable occupational bracket confirmed',                failMessage: 'Occupation suggests financial stability' },
      { type: 'SOFT', category: 'Education',    weight: 20, condition: u => ['school','none'].includes(u.education),                   passMessage: 'Lower education level favors target',                      failMessage: 'Higher education usually implies private coverage' },
      { type: 'SOFT', category: 'Demographic Category', weight: 20, condition: u => ['sc','st','obc'].includes(u.category),            passMessage: 'SC/ST/OBC — priority enrolment',                           failMessage: 'General category' },
      { type: 'SOFT', category: 'Base Metric', weight: 30, condition: () => true,                                                      passMessage: 'Universal health-coverage scheme element satisfied',        failMessage: '' },
    ]));
  }

  // ── NMMS ─────────────────────────────────────────────────────────────────
  const nmms = SCHEMES.find(s => s.id === 'nmms');
  if (nmms) {
    evaluated.push(evaluateScheme(u, nmms, [
      { type: 'HARD', category: 'Education',            condition: u => u.education === 'school',                                       passMessage: 'Currently enrolled at school level',                       failMessage: 'Exclusively for Class 9–12 school students' },
      { type: 'HARD', category: 'Income',               condition: u => u.income <= incomeLimit(cat, 350000),                           passMessage: incomePassMsg(cat, 350000),                                  failMessage: incomeFailMsg(cat, 350000) },
      { type: 'SOFT', category: 'Age',          weight: 40, condition: u => u.age >= 13 && u.age <= 17,                                 passMessage: 'Age aligns with grades 9–12 (13–17)',                      failMessage: 'Age outside normal secondary school range' },
      { type: 'SOFT', category: 'Occupation',   weight: 40, condition: u => u.occupation === 'student',                                 passMessage: 'Confirmed full-time student',                              failMessage: 'Not a full-time student' },
      { type: 'BONUS',category: 'Demographic Category', weight: 20, condition: u => ['sc','st','obc'].includes(u.category),             passMessage: 'SC/ST/OBC — priority merit consideration in NMMS' },
    ]));
  }

  // ── PM SVANIDHI ──────────────────────────────────────────────────────────
  const svanidhi = SCHEMES.find(s => s.id === 'pm-svanidhi');
  if (svanidhi) {
    evaluated.push(evaluateScheme(u, svanidhi, [
      { type: 'HARD', category: 'Occupation',            condition: u => ['vendor','unemployed'].includes(u.occupation),                passMessage: 'Identifies as vendor/entrepreneur',                        failMessage: 'Scheme strictly targets vendors' },
      { type: 'SOFT', category: 'Income',       weight: 40, condition: u => u.income <= incomeLimit(cat, 300000),                      passMessage: incomePassMsg(cat, 300000),                                  failMessage: incomeFailMsg(cat, 300000) },
      { type: 'SOFT', category: 'Age',          weight: 30, condition: u => u.age >= 18,                                               passMessage: 'Legally able to manage micro-debt (18+)',                  failMessage: 'Underage for direct borrowing' },
      { type: 'SOFT', category: 'Demographic Category', weight: 30, condition: u => ['sc','st','obc'].includes(u.category),            passMessage: 'SC/ST/OBC — relaxed collateral norms',                     failMessage: 'General category — standard collateral norms' },
    ]));
  }

  // ── SSY ──────────────────────────────────────────────────────────────────
  const ssy = SCHEMES.find(s => s.id === 'ssy');
  if (ssy) {
    evaluated.push(evaluateScheme(u, ssy, [
      { type: 'HARD', category: 'Eligibility',          condition: u => (u.gender === 'female' && u.age <= 10) || (u.hasGirlChild === 'yes' && u.girlChildAge <= 10), passMessage: 'Eligible for SSY based on child age', failMessage: 'Requires a girl child aged 10 or younger' },
      { type: 'SOFT', category: 'Base Metric', weight: 80, condition: () => true,                                                      passMessage: 'All universal criteria satisfied',                         failMessage: '' },
      { type: 'BONUS',category: 'Demographic Category', weight: 20, condition: u => ['sc','st','obc'].includes(u.category),            passMessage: 'SC/ST/OBC — tax-exempt savings priority' },
    ]));
  }

  // ── PM INTERNSHIP ────────────────────────────────────────────────────────
  const pmInternship = SCHEMES.find(s => s.id === 'pm-internship');
  if (pmInternship) {
    evaluated.push(evaluateScheme(u, pmInternship, [
      { type: 'HARD', category: 'Age',                  condition: u => u.age >= 21 && u.age <= 24,                                     passMessage: 'Age between 21–24 (mandatory)',                          failMessage: 'Age must be 21–24 for PM Internship' },
      { type: 'HARD', category: 'Income',               condition: u => u.income <= 800000,                                             passMessage: 'Family income ≤ ₹8 lakh',                                failMessage: 'Family income exceeds ₹8 lakh' },
      { type: 'HARD', category: 'Employment Status',    condition: u => u.isFullTime === 'no',                                          passMessage: 'Not in full-time employment/education',                  failMessage: 'Must not be in full-time employment or full-time education' },
      { type: 'HARD', category: 'Education Institute',  condition: u => u.isPremierGrad === 'no',                                       passMessage: 'Not a graduate from IIT/IIM/NLU',                        failMessage: 'Graduates from premier institutes are ineligible' },
      { type: 'HARD', category: 'Family Employment',    condition: u => u.hasGovtFamily === 'no',                                       passMessage: 'No family in government service',                        failMessage: 'Family members in government service make you ineligible' },
      { type: 'HARD', category: 'Professional Degree',  condition: u => u.hasProfessionalDegree === 'no',                               passMessage: 'No professional degree (CA/MBA/MBBS)',                   failMessage: 'Holders of professional degrees are ineligible' },
      { type: 'SOFT', category: 'Base Metric', weight: 50, condition: () => true,                                                       passMessage: 'Universal scheme criteria met',                          failMessage: '' },
      { type: 'SOFT', category: 'Internship Metric', weight: 50, condition: () => true,                                                 passMessage: 'All mandatory criteria for PM Internship satisfied',     failMessage: '' },
      { type: 'BONUS',category: 'Sector Alignment', weight: 10, condition: u => u.internshipSector !== 'other',                         passMessage: `Specific sector (${u.internshipSector.toUpperCase()}) preference noted` },
    ]));
  }

  // ── Sort & split ──────────────────────────────────────────────────────────
  const recommended = [];
  const disqualified = [];

  for (const res of evaluated) {
    if (res.hardFailures.length === 0 && res.score >= 50 && res.numSoftMatches >= 2) {
      res.eligibilityLabel = res.score >= 80 ? 'Highly Eligible' : 'Eligible';
      res.confidence = res.score;
      recommended.push(res);
    } else {
      disqualified.push(res);
    }
  }

  recommended.sort((a, b) => b.score - a.score || b.passedConditions.length - a.passedConditions.length);
  disqualified.sort((a, b) => a.hardFailures.length - b.hardFailures.length || b.score - a.score);

  return { recommended, disqualified: disqualified.slice(0, 3) };
}
