import React from 'react';

export default function Terms() {
  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Terms and Conditions</h1>
      <div className="card" style={{ padding: '2.5rem', lineHeight: 1.8 }}>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h3 style={{ marginTop: '2rem' }}>1. Agreement to Terms</h3>
        <p>By accessing Scheme AI, you agree to be bound by these Terms and Conditions and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site.</p>
        
        <h3 style={{ marginTop: '2rem' }}>2. Use License</h3>
        <p>Permission is granted to temporarily download one copy of the materials on Scheme AI's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
        
        <h3 style={{ marginTop: '2rem' }}>3. Disclaimer</h3>
        <p>All the materials on Scheme AI's website are provided "as is". Scheme AI makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Scheme AI does not make any representations concerning the accuracy or reliability of the use of the materials on its website.</p>

        <h3 style={{ marginTop: '2rem' }}>4. Limitations</h3>
        <p>Scheme AI or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on Scheme AI's website, even if Scheme AI or an authorize representative of this website has been notified, orally or written, of the possibility of such damage.</p>
      </div>
    </div>
  );
}
