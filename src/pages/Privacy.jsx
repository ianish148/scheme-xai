import React from 'react';

export default function Privacy() {
  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Privacy Policy</h1>
      <div className="card" style={{ padding: '2.5rem', lineHeight: 1.8 }}>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h3 style={{ marginTop: '2rem' }}>1. Introduction</h3>
        <p>Welcome to Scheme AI. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
        
        <h3 style={{ marginTop: '2rem' }}>2. Data We Collect</h3>
        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows: Identity Data, Contact Data, Technical Data, and Usage Data. Because we are an open-source, deterministic expert system, much of the data you input is processed locally on your device.</p>
        
        <h3 style={{ marginTop: '2rem' }}>3. How We Use Your Data</h3>
        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to provide the recommendations and expert system analysis you request.</p>

        <h3 style={{ marginTop: '2rem' }}>4. Data Security</h3>
        <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorised way, altered, or disclosed.</p>
      </div>
    </div>
  );
}
