import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const links = [
  { to: '/',            label: 'Home' },
  { to: '/form',        label: 'Get Recommendations' },
  { to: '/explore',     label: 'Explore Schemes' },
  { to: '/internships', label: 'Internships', accent: '#E8A020' },
  { to: '/about',       label: 'About' },
];

export default function Navbar() {
  const location        = useLocation();
  const { theme, toggle } = useTheme();
  const isDark          = theme === 'dark';

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/logo.png" 
            alt="SchemeAI Logo" 
            style={{ height: '35px', width: 'auto', objectFit: 'contain' }} 
          />
        </Link>

        <div className="navbar-actions">
          <div className="nav-links">
            {links.map(l => {
              const active  = location.pathname === l.to;
              const color   = l.accent || 'var(--primary-color)';
              const bgFaint = l.accent ? `${l.accent}18` : 'var(--primary-faint)';
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className="nav-link"
                  style={active ? { color, background: bgFaint } : {}}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--surface-color)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0,
              marginLeft: '0.5rem',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--primary-color)';
              e.currentTarget.style.background   = 'var(--primary-faint)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.background   = 'var(--surface-color)';
            }}
          >
            {isDark
              ? <Sun  size={17} color="#E8A020" />
              : <Moon size={17} color="var(--primary-color)" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
