import React from 'react';
import { Palette, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, toggle, uiColor, setUiColor, uiFont, setUiFont, uiFontSize, setUiFontSize } = useTheme();

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem', maxWidth: '850px' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Palette size={28} color="var(--primary-color)" /> Global Settings
      </h2>
      
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <Palette size={24} color="var(--primary-color)" style={{ marginTop: '0.2rem' }} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.25rem', fontWeight: 700 }}>Appearance</h3>
            <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-secondary)' }}>Customize how Scheme AI looks</p>
            
            {/* Dark Mode Toggle */}
            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Moon size={20} color="#E8A020" />
                <div>
                  <h4 style={{ margin: '0 0 0.1rem', fontSize: '1rem' }}>Dark Mode</h4>
                  <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-secondary)' }}>Switch between light and dark theme</p>
                </div>
              </div>
              <div 
                onClick={toggle}
                style={{
                  width: '44px', height: '24px', background: theme === 'dark' ? 'var(--primary-color)' : 'var(--border-bright)',
                  borderRadius: '99px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
                }}
              >
                <div style={{
                  width: '20px', height: '20px', background: '#fff', borderRadius: '50%',
                  position: 'absolute', top: '2px', left: theme === 'dark' ? '22px' : '2px', transition: 'left 0.3s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
              </div>
            </div>

            {/* Theme Color Swatches */}
            <div style={{ marginTop: '2.5rem' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Theme Color</h4>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {[
                  { bg: '#0D9488', name: 'Teal' },
                  { bg: '#2563EB', name: 'Blue' },
                  { bg: '#8B5CF6', name: 'Purple' },
                  { bg: '#EAB308', name: 'Yellow' },
                  { bg: '#E05A30', name: 'Orange' },
                  { bg: '#06B6D4', name: 'Cyan' },
                ].map(color => (
                  <button
                    key={color.bg}
                    onClick={() => setUiColor(color.bg)}
                    title={color.name}
                    style={{
                      width: '70px', height: '70px', borderRadius: '12px', background: color.bg,
                      border: uiColor === color.bg ? '3px solid var(--text-primary)' : '3px solid transparent',
                      cursor: 'pointer', transition: 'all 0.2s', padding: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Font Size Dropdown */}
            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>T</span>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>Font Size</h4>
              </div>
              <select 
                value={uiFontSize} 
                onChange={e => setUiFontSize(Number(e.target.value))}
                className="form-control"
                style={{ maxWidth: '100%', background: 'var(--bg-color)', padding: '0.75rem 1rem' }}
              >
                <option value={14}>Small</option>
                <option value={16}>Medium (Default)</option>
                <option value={18}>Large</option>
              </select>
            </div>

            {/* Font Style Dropdown */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'serif' }}>A</span>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>Font Style</h4>
              </div>
              <select 
                value={uiFont} 
                onChange={e => setUiFont(e.target.value)}
                className="form-control"
                style={{ maxWidth: '100%', background: 'var(--bg-color)', padding: '0.75rem 1rem' }}
              >
                <option value="'Times New Roman', Times, serif">Times New Roman (Default)</option>
                <option value="Inter, system-ui, sans-serif">Inter (Modern)</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="'Courier New', Courier, monospace">Monospace</option>
              </select>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
