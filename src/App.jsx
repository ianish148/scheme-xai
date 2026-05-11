import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FormPage from './pages/Form';
import Results from './pages/Results';
import About from './pages/About';
import Explore from './pages/Explore';
import Internships from './pages/Internships';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import './index.css';

function AppInner() {
  const location = useLocation();

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/form"        element={<FormPage />} />
          <Route path="/results"     element={<Results />} />
          <Route path="/explore"     element={<Explore />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/about"       element={<About />} />
          <Route path="/settings"    element={<Settings />} />
          <Route path="/privacy"     element={<Privacy />} />
          <Route path="/terms"       element={<Terms />} />
          <Route path="/contact"     element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
