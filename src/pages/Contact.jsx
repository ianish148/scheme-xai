import React from 'react';
import { Mail, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '1rem', textAlign: 'center' }}>Get in Touch</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        Have questions about our expert system or need help with recommendations? We'd love to hear from you.
      </p>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <Mail size={32} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Email Us</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>For general inquiries and support.</p>
          <a href="mailto:anishr2024@gmail.com" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>anishr2024@gmail.com</a>
        </div>

        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <MapPin size={32} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Visit Us</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>Headquarters</p>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>New Delhi, India</span>
        </div>

      </div>

      <div className="card" style={{ padding: '3rem', marginTop: '3rem' }}>
        <h3 style={{ marginBottom: '2rem' }}>Send a Message</h3>
        <form onSubmit={e => e.preventDefault()}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
            <input type="text" className="form-control" placeholder="John Doe" />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
            <input type="email" className="form-control" placeholder="john@example.com" />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Message</label>
            <textarea className="form-control" rows="5" placeholder="How can we help you?"></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Send Message
          </button>
        </form>
      </div>

    </div>
  );
}
