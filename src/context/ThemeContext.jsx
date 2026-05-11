import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('xai-theme') || 'dark';
  });

  const [uiColor, setUiColor] = useState(() => {
    return localStorage.getItem('xai-ui-color') || '#E05A30';
  });
  
  const [uiFont, setUiFont] = useState(() => {
    return localStorage.getItem('xai-ui-font') || "'Times New Roman', Times, serif";
  });
  
  const [uiFontSize, setUiFontSize] = useState(() => {
    return Number(localStorage.getItem('xai-ui-fontsize')) || 16;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('xai-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', uiColor);
    localStorage.setItem('xai-ui-color', uiColor);
  }, [uiColor]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-family', uiFont);
    localStorage.setItem('xai-ui-font', uiFont);
  }, [uiFont]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${uiFontSize}px`;
    localStorage.setItem('xai-ui-fontsize', uiFontSize.toString());
  }, [uiFontSize]);

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ 
      theme, toggle,
      uiColor, setUiColor,
      uiFont, setUiFont,
      uiFontSize, setUiFontSize
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
