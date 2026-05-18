import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ─────────────────────────────────────────────────────────────────────────────
# DATABASE: Schemes
# ─────────────────────────────────────────────────────────────────────────────
schemes = [
  {
    "id": "pm-kisan",
    "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    "description": "Direct income support to all landholding farmers' families in the country.",
    "benefits": "₹6,000 per year in three equal installments.",
    "url": "https://pmkisan.gov.in/",
    "validStates": ["ALL"]
  },
  {
    "id": "mudra-yojana",
    "name": "Pradhan Mantri Mudra Yojana (PMMY)",
    "description": "Loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises.",
    "benefits": "Financial support for starting or expanding micro-businesses.",
    "url": "https://www.mudra.org.in/",
    "validStates": ["ALL"]
  },
  {
    "id": "pm-scholarship",
    "name": "Prime Minister's Scholarship Scheme (PMSS)",
    "description": "To encourage higher technical and professional education for the dependent wards of Ex-Servicemen and Coast Guard personnel.",
    "benefits": "Financial assistance (₹2500/month for boys, ₹3000/month for girls).",
    "url": "https://www.myscheme.gov.in/schemes/pmss",
    "validStates": ["ALL"]
  },
  {
    "id": "skill-india",
    "name": "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
    "description": "Skill certification scheme to enable Indian youth to take up industry-relevant skill training.",
    "benefits": "Free skill training and certification.",
    "url": "https://www.pmkvyofficial.org/",
    "validStates": ["ALL"]
  },
  {
    "id": "digital-india-bpo",
    "name": "Digital India BPO Scheme",
    "description": "To incentivize BPO/ITES operations across the country, particularly in Tier 2/3 cities.",
    "benefits": "Financial support for youth employment in IT sectors.",
    "url": "https://www.digitalindia.gov.in/",
    "validStates": ["ALL"]
  },
  {
    "id": "stand-up-india",
    "name": "Stand-Up India",
    "description": "Facilitates bank loans between ₹10 lakh and ₹1 Crore to at least one SC/ST borrower and one woman borrower per bank branch.",
    "benefits": "Credit facility for setting up a greenfield enterprise.",
    "url": "https://www.standupmitra.in/",
    "validStates": ["ALL"]
  },
  {
    "id": "pm-jay",
    "name": "Ayushman Bharat (PM-JAY)",
    "description": "Health insurance cover of ₹5 lakhs per family per year for secondary and tertiary care hospitalization.",
    "benefits": "Free healthcare coverage for vulnerable families.",
    "url": "https://pmjay.gov.in/",
    "validStates": ["ALL"]
  },
  {
    "id": "nmms",
    "name": "National Means-cum-Merit Scholarship (NMMS)",
    "description": "For students of class 9 to 12. To check dropouts at class 8 and encourage them to continue studies.",
    "benefits": "₹12000 per annum to eligible students.",
    "url": "https://scholarships.gov.in/",
    "validStates": ["ALL"]
  },
  {
    "id": "pm-svanidhi",
    "name": "PM SVANidhi Yojana",
    "description": "A special micro-credit facility for street vendors to resume their livelihoods.",
    "benefits": "Working capital loan up to ₹10,000.",
    "url": "https://pmsvanidhi.mohua.gov.in/",
    "validStates": ["ALL"]
  },
  {
    "id": "ssy",
    "name": "Sukanya Samriddhi Yojana (SSY)",
    "description": "Targeted at the parents of girl children, encourages building a fund for future education and marriage expenses.",
    "benefits": "High interest rate and tax benefits.",
    "url": "https://www.india.gov.in/sukanya-samriddhi-yojna",
    "validStates": ["ALL"]
  },
  {
    "id": "pm-internship",
    "name": "Prime Minister Internship Scheme",
    "description": "Provides 12-month internship opportunities in top 500 companies with a monthly stipend of ₹5,000 and a one-time grant of ₹6,000.",
    "benefits": "₹5,000/month stipend + ₹6,000 grant + hands-on experience in top companies.",
    "url": "https://pminternship.mca.gov.in",
    "validStates": ["ALL"]
  }
]

# ─────────────────────────────────────────────────────────────────────────────
# LOGIC: Engine
# ─────────────────────────────────────────────────────────────────────────────
def income_limit(category, base):
    if category in ['sc', 'st']: return int(base * 1.5)
    if category == 'obc': return int(base * 1.2)
    return base

def income_pass_msg(category, base):
    limit = income_limit(category, base)
    if category == 'sc': return f"SC relaxed income ceiling ≤₹{limit:,} — qualifies"
    if category == 'st': return f"ST relaxed income ceiling ≤₹{limit:,} — qualifies"
    if category == 'obc': return f"OBC moderate income ceiling ≤₹{limit:,} — qualifies"
    return f"Income within standard limit ≤₹{limit:,}"

def income_fail_msg(category, base):
    limit = income_limit(category, base)
    if category == 'sc': return f"Income exceeds SC relaxed ceiling ₹{limit:,}"
    if category == 'st': return f"Income exceeds ST relaxed ceiling ₹{limit:,}"
    if category == 'obc': return f"Income exceeds OBC ceiling ₹{limit:,}"
    return f"Income exceeds standard limit ₹{limit:,}"

def evaluate_scheme(user, scheme_context, ruleset):
    score = 80
    max_score = 80
    passed_conditions = []
    failed_conditions = []
    hard_failures = []
    num_soft_matches = 0

    valid_states = scheme_context.get("validStates", ["ALL"])
    if "ALL" not in valid_states and user.get("state") not in valid_states:
        hard_failures.append(f"State ({user.get('state', 'Unknown')}) is ineligible for this scheme.")

    for rule in ruleset:
        rtype = rule['type']
        rcat = rule.get('category', 'General')
        pass_msg = rule.get('passMessage', '')
        fail_msg = rule.get('failMessage', '')

        if rtype == 'HARD':
            if rule['condition'](user):
                passed_conditions.append({
                    "category": rcat, "awarded": 0, "max": 0,
                    "status": "✔", "message": pass_msg, "type": "HARD"
                })
            else:
                hard_failures.append(fail_msg)

        elif rtype in ['SOFT', 'BONUS']:
            max_w = rule.get('weight', 0)
            max_score += max_w
            if rule['condition'](user):
                score += max_w
                num_soft_matches += 1
                passed_conditions.append({
                    "category": rcat, "awarded": max_w, "max": max_w,
                    "status": "✔", "message": pass_msg, "type": rtype
                })
            elif rtype == 'SOFT':
                failed_conditions.append({
                    "category": rcat, "awarded": 0, "max": max_w,
                    "status": "✖", "message": fail_msg, "type": "SOFT"
                })

    normalized_score = round((score / max_score) * 100) if max_score > 0 else 0
    res = dict(scheme_context)
    res['score'] = normalized_score
    res['passedConditions'] = passed_conditions
    res['failedConditions'] = failed_conditions
    res['hardFailures'] = hard_failures
    res['numSoftMatches'] = num_soft_matches
    return res

def evaluate(user):
    age = int(user.get('age', 0))
    income = int(user.get('income', 0))
    gender = user.get('gender', '').lower()
    education = user.get('education', '').lower()
    occupation = user.get('occupation', '').lower()
    category = user.get('category', 'general').lower()
    interests = user.get('interests', [])
    state = user.get('state', '')

    if category not in ['sc', 'st', 'obc', 'general']:
        category = 'general'

    u = {
        'age': age, 'income': income, 'gender': gender, 'education': education,
        'occupation': occupation, 'category': category, 'interests': interests, 'state': state
    }
    cat = category
    evaluated = []

    s = next((x for x in schemes if x['id'] == 'pm-kisan'), None)
    if s:
        evaluated.append(evaluate_scheme(u, s, [
            { 'type': 'HARD', 'category': 'Occupation', 'condition': lambda u: u['occupation'] == 'farmer', 'passMessage': 'Occupation matches Farmer', 'failMessage': 'Occupation must be Farmer (mandatory condition failed)' },
            { 'type': 'HARD', 'category': 'Age', 'condition': lambda u: u['age'] >= 18, 'passMessage': 'Age ≥ 18 for land ownership', 'failMessage': 'Age under 18 — land ownership questionable' },
            { 'type': 'SOFT', 'category': 'Base Metric', 'weight': 20, 'condition': lambda u: True, 'passMessage': 'General agricultural eligibility met', 'failMessage': '' },
            { 'type': 'BONUS', 'category': 'Interests', 'weight': 10, 'condition': lambda u: 'agriculture' in u['interests'], 'passMessage': 'Matches explicit interest in agriculture' }
        ]))

    s = next((x for x in schemes if x['id'] == 'mudra-yojana'), None)
    if s:
        evaluated.append(evaluate_scheme(u, s, [
            { 'type': 'HARD', 'category': 'Occupation', 'condition': lambda u: u['occupation'] in ['business', 'unemployed'], 'passMessage': 'Occupation qualifies for micro-loans', 'failMessage': 'Must be Business / Self-Employed or Unemployed' },
            { 'type': 'HARD', 'category': 'Age', 'condition': lambda u: 18 <= u['age'] <= 65, 'passMessage': 'Age within active work demographic (18–65)', 'failMessage': 'Age outside optimal target group' },
            { 'type': 'SOFT', 'category': 'Gender', 'weight': 20, 'condition': lambda u: u['gender'] == 'female', 'passMessage': 'Female applicant — entitled to superior interest rates', 'failMessage': 'Not eligible for female-specific rate benefits' },
            { 'type': 'SOFT', 'category': 'Demographic Category', 'weight': 20, 'condition': lambda u: u['category'] in ['sc', 'st', 'obc'], 'passMessage': 'SC/ST/OBC — priority processing', 'failMessage': 'General category — standard processing applies' },
            { 'type': 'BONUS', 'category': 'Interests', 'weight': 10, 'condition': lambda u: 'startup' in u['interests'], 'passMessage': 'Matches interest in entrepreneurship' }
        ]))

    s = next((x for x in schemes if x['id'] == 'pm-scholarship'), None)
    if s:
        evaluated.append(evaluate_scheme(u, s, [
            { 'type': 'HARD', 'category': 'Occupation', 'condition': lambda u: u['occupation'] == 'student', 'passMessage': 'Occupation is Student', 'failMessage': 'Must be a student' },
            { 'type': 'HARD', 'category': 'Age', 'condition': lambda u: u['age'] >= 17, 'passMessage': 'Age meets college entry requirement (17+)', 'failMessage': 'Age outside standard cohort' },
            { 'type': 'HARD', 'category': 'Income', 'condition': lambda u: u['income'] <= 500000, 'passMessage': 'Family income <= ₹5 lakh/year', 'failMessage': 'Income exceeds limit' },
            { 'type': 'BONUS', 'category': 'Demographic Category', 'weight': 10, 'condition': lambda u: u['category'] in ['sc', 'st', 'obc'], 'passMessage': 'SC/ST/OBC — extra priority for scholarship allocation' }
        ]))

    s = next((x for x in schemes if x['id'] == 'skill-india'), None)
    if s:
        evaluated.append(evaluate_scheme(u, s, [
            { 'type': 'HARD', 'category': 'Age', 'condition': lambda u: u['age'] >= 18, 'passMessage': 'Age ≥ 18 for skill-labor enrollment', 'failMessage': 'Must be an adult (18+) for enrollment' },
            { 'type': 'HARD', 'category': 'Occupation', 'condition': lambda u: u['occupation'] in ['unemployed', 'student'], 'passMessage': 'Target demographic for upskilling', 'failMessage': 'Must be Student or Unemployed' },
            { 'type': 'SOFT', 'category': 'Demographic Category', 'weight': 30, 'condition': lambda u: u['category'] in ['sc', 'st', 'obc'], 'passMessage': 'SC/ST/OBC — priority processing', 'failMessage': 'General category — unreserved' },
            { 'type': 'BONUS', 'category': 'Interests', 'weight': 10, 'condition': lambda u: 'technology' in u['interests'], 'passMessage': 'Technology upskilling interest recorded' }
        ]))

    s = next((x for x in schemes if x['id'] == 'digital-india-bpo'), None)
    if s:
        evaluated.append(evaluate_scheme(u, s, [
            { 'type': 'HARD', 'category': 'Age', 'condition': lambda u: 18 <= u['age'] <= 35, 'passMessage': 'Age between 18–35', 'failMessage': 'Age must be 18–35' },
            { 'type': 'HARD', 'category': 'Occupation', 'condition': lambda u: u['occupation'] in ['unemployed', 'student'], 'passMessage': 'Actively seeking placement', 'failMessage': 'Must be Student or Unemployed' },
            { 'type': 'BONUS', 'category': 'Interests', 'weight': 10, 'condition': lambda u: 'technology' in u['interests'], 'passMessage': 'Interest aligns with BPO/IT sector' }
        ]))

    s = next((x for x in schemes if x['id'] == 'stand-up-india'), None)
    if s:
        evaluated.append(evaluate_scheme(u, s, [
            { 'type': 'HARD', 'category': 'Age', 'condition': lambda u: u['age'] >= 18, 'passMessage': 'Applicant is a legal adult', 'failMessage': 'Must be 18+' },
            { 'type': 'HARD', 'category': 'Occupation', 'condition': lambda u: u['occupation'] in ['business', 'unemployed'], 'passMessage': 'Seeking to establish enterprise', 'failMessage': 'Must be Business / Self-Employed or Unemployed' },
            { 'type': 'BONUS', 'category': 'Interests', 'weight': 10, 'condition': lambda u: 'startup' in u['interests'], 'passMessage': 'Startup interest aligns with scheme focus' }
        ]))

    s = next((x for x in schemes if x['id'] == 'pm-jay'), None)
    if s:
        evaluated.append(evaluate_scheme(u, s, [
            { 'type': 'HARD', 'category': 'Income', 'condition': lambda u: u['income'] <= 250000, 'passMessage': 'Typically vulnerable families <= ₹2.5 lakh/year', 'failMessage': 'Income exceeds limit' },
            { 'type': 'HARD', 'category': 'Occupation', 'condition': lambda u: u['occupation'] in ['farmer', 'vendor', 'unemployed', 'employee'], 'passMessage': 'Vulnerable occupational bracket confirmed', 'failMessage': 'Must be Farmer, Street Vendor, Unemployed, or Salaried' },
            { 'type': 'SOFT', 'category': 'Demographic Category', 'weight': 20, 'condition': lambda u: u['category'] in ['sc', 'st', 'obc'], 'passMessage': 'SC/ST/OBC — priority enrolment', 'failMessage': 'General category' }
        ]))

    s = next((x for x in schemes if x['id'] == 'nmms'), None)
    if s:
        evaluated.append(evaluate_scheme(u, s, [
            { 'type': 'HARD', 'category': 'Income', 'condition': lambda u: u['income'] <= 350000, 'passMessage': 'Family income <= ₹3.5 lakh/year', 'failMessage': 'Income exceeds limit' },
            { 'type': 'HARD', 'category': 'Age', 'condition': lambda u: 13 <= u['age'] <= 18, 'passMessage': 'Age aligns with grades 9–12 (13–18)', 'failMessage': 'Age outside normal secondary school range' },
            { 'type': 'HARD', 'category': 'Occupation', 'condition': lambda u: u['occupation'] == 'student', 'passMessage': 'Confirmed full-time student', 'failMessage': 'Not a full-time student' },
            { 'type': 'BONUS', 'category': 'Demographic Category', 'weight': 20, 'condition': lambda u: u['category'] in ['sc', 'st', 'obc'], 'passMessage': 'SC/ST/OBC — priority merit consideration in NMMS' }
        ]))

    s = next((x for x in schemes if x['id'] == 'pm-svanidhi'), None)
    if s:
        evaluated.append(evaluate_scheme(u, s, [
            { 'type': 'HARD', 'category': 'Occupation', 'condition': lambda u: u['occupation'] in ['vendor', 'unemployed'], 'passMessage': 'Identifies as vendor/entrepreneur', 'failMessage': 'Must be Street Vendor or Unemployed' },
            { 'type': 'HARD', 'category': 'Income', 'condition': lambda u: u['income'] <= 300000, 'passMessage': 'Income <= ₹3 lakh/year', 'failMessage': 'Income exceeds limit' },
            { 'type': 'HARD', 'category': 'Age', 'condition': lambda u: u['age'] >= 18, 'passMessage': 'Legally able to manage micro-debt (18+)', 'failMessage': 'Underage for direct borrowing' },
            { 'type': 'SOFT', 'category': 'Demographic Category', 'weight': 30, 'condition': lambda u: u['category'] in ['sc', 'st', 'obc'], 'passMessage': 'SC/ST/OBC — relaxed collateral norms', 'failMessage': 'General category — standard collateral norms' }
        ]))

    s = next((x for x in schemes if x['id'] == 'ssy'), None)
    if s:
        evaluated.append(evaluate_scheme(u, s, [
            { 'type': 'HARD', 'category': 'Occupation', 'condition': lambda u: u['occupation'] in ['employee', 'business', 'farmer'], 'passMessage': 'Target occupation confirmed', 'failMessage': 'Must be Salaried Employee, Business, or Farmer' },
            { 'type': 'HARD', 'category': 'Eligibility', 'condition': lambda u: (u['gender'] == 'female' and u['age'] <= 10) or (u.get('hasGirlChild') == 'yes' and int(u.get('girlChildAge', 0)) <= 10), 'passMessage': 'Eligible for SSY based on child age', 'failMessage': 'Requires a girl child aged 10 or younger' },
            { 'type': 'BONUS', 'category': 'Demographic Category', 'weight': 20, 'condition': lambda u: u['category'] in ['sc', 'st', 'obc'], 'passMessage': 'SC/ST/OBC — tax-exempt savings priority' }
        ]))

    s = next((x for x in schemes if x['id'] == 'pm-internship'), None)
    if s:
        evaluated.append(evaluate_scheme(u, s, [
            { 'type': 'HARD', 'category': 'Education', 'condition': lambda u: u['education'] not in ['school', 'none'], 'passMessage': 'Enrolled in Higher Education', 'failMessage': 'Only higher education students (College/Engineering/Medical/Graduate) are eligible' },
            { 'type': 'HARD', 'category': 'Occupation', 'condition': lambda u: u['occupation'] == 'student', 'passMessage': 'Must be a student to qualify for the student internship tracks', 'failMessage': 'Only open to current students' },
            { 'type': 'HARD', 'category': 'Interest', 'condition': lambda u: u.get('needsInternship') == 'yes', 'passMessage': 'Actively seeking internship opportunities', 'failMessage': 'Did not opt-in for internships' },
            { 'type': 'HARD', 'category': 'Age', 'condition': lambda u: 21 <= u['age'] <= 24, 'passMessage': 'Age 21-24', 'failMessage': 'Must be 21-24 years old' },
            { 'type': 'HARD', 'category': 'Full Time Check', 'condition': lambda u: u.get('isFullTime') == 'no', 'passMessage': 'Not currently engaged in full-time employment/education', 'failMessage': 'Cannot be engaged in full-time employment or full-time education' },
            { 'type': 'HARD', 'category': 'Premier Institute', 'condition': lambda u: u.get('isPremierGrad') == 'no', 'passMessage': 'Not from premier institutes (IIT/IIM/NLU/IISER)', 'failMessage': 'Graduates from premier institutes are ineligible' },
            { 'type': 'HARD', 'category': 'Government Family', 'condition': lambda u: u.get('hasGovtFamily') == 'no', 'passMessage': 'No immediate family in government service', 'failMessage': 'Ineligible due to family member in government service' },
            { 'type': 'HARD', 'category': 'Professional Degree', 'condition': lambda u: u.get('hasProfessionalDegree') == 'no', 'passMessage': 'Does not hold CA/MBA/MBBS qualifications', 'failMessage': 'Professionals (CA/MBA/MBBS) are ineligible' }
        ]))

    recommended = []
    disqualified = []

    for res in evaluated:
        if len(res['hardFailures']) == 0:
            res['eligibilityLabel'] = 'Highly Eligible' if res['score'] >= 80 else 'Eligible'
            res['confidence'] = res['score']
            recommended.append(res)
        else:
            disqualified.append(res)

    recommended.sort(key=lambda x: (x['score'], len(x['passedConditions'])), reverse=True)
    disqualified.sort(key=lambda x: (len(x['hardFailures']), -x['score']))
    return {"recommended": recommended, "disqualified": disqualified[:3]}


# ─────────────────────────────────────────────────────────────────────────────
# ROUTES: API Endpoints
# ─────────────────────────────────────────────────────────────────────────────
valid_states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli', 
  'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
]

education_age_bounds = {
    'school': { 'min': 5, 'max': 18, 'label': 'School' },
    'college': { 'min': 16, 'max': 35, 'label': 'Undergraduate College' },
    'engineering': { 'min': 16, 'max': 35, 'label': 'Engineering' },
    'graduate': { 'min': 20, 'max': 40, 'label': 'Postgraduate' },
    'none': { 'min': 5, 'max': 100, 'label': 'No formal education' }
}

@app.route('/', methods=['GET'])
@app.route('/api', methods=['GET'])
@app.route('/api/index.py', methods=['GET'])
def health():
    return jsonify({"success": True, "message": "API is robustly online."})

@app.route('/api/recommend', methods=['POST'])
@app.route('/recommend', methods=['POST'])
@app.route('/api/index.py/recommend', methods=['POST'])
def recommend():
    try:
        user_profile = request.get_json()
        if not user_profile:
            return jsonify({"success": False, "error": "Invalid payload."}), 400

        try:
            age = int(user_profile.get('age', 0))
            income = int(user_profile.get('income', 0))
        except ValueError:
            return jsonify({"success": False, "error": "Age and Income must be valid."}), 400

        if age < 5 or age > 100:
            return jsonify({"success": False, "error": "Invalid Age."}), 400
        if income <= 0 or income > 600000:
            return jsonify({"success": False, "error": "Invalid Income. Max ₹6 Lakh."}), 400

        state = user_profile.get('state', '')
        if state not in valid_states:
            return jsonify({"success": False, "error": f"Invalid State: '{state}'."}), 400

        valid_categories = ['general', 'obc', 'sc', 'st']
        category = user_profile.get('category', 'general').lower().strip()
        if category not in valid_categories: category = 'general'
        user_profile['category'] = category

        education = user_profile.get('education', '').lower()
        bound = education_age_bounds.get(education)
        if bound and (age < bound['min'] or age > bound['max']):
            return jsonify({"success": False, "error": f"Age {age} invalid for {bound['label']}"}), 400

        result = evaluate(user_profile)
        return jsonify({"success": True, "recommendations": result['recommended'], "disqualified": result['disqualified']})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/schemes', methods=['GET'])
@app.route('/schemes', methods=['GET'])
@app.route('/api/index.py/schemes', methods=['GET'])
def get_schemes():
    return jsonify({"success": True, "data": schemes})

# ─────────────────────────────────────────────────────────────────────────────
# CATCH ALL ERROR HANDLER
# ─────────────────────────────────────────────────────────────────────────────
@app.errorhandler(Exception)
def handle_exception(e):
    # This guarantees that if ANY Python failure occurs, it returns JSON instead of a 500 crash!
    return jsonify({"success": False, "error": str(e), "trace": "Caught by Flask global handler"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
