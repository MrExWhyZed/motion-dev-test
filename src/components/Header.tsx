'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const navLinks = [
  { label: 'Work', href: '#showreel' },
  { label: 'Services', href: '#services' },
  { label: 'Catalogue', href: '#catalogue' },
  { label: 'Process', href: '#process' },
  { label: 'Studio', href: '#why' },
];

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
}

const serviceOptions = [
  'Brand Motion Identity',
  'Product Showcase',
  'Social Media Content',
  'Explainer Animation',
  'Event / Campaign Film',
  'Other',
];

const budgetOptions = [
  'Under $2,000',
  '$2,000 – $5,000',
  '$5,000 – $15,000',
  '$15,000 – $50,000',
  '$50,000+',
];

export default function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', company: '', service: '', budget: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (menuOpen || contactOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, contactOpen]);

  const handleLinkClick = (href: string) => {
    setMenuOpen(false);
    setContactOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactOpen = () => {
    setMenuOpen(false);
    setContactOpen(true);
    setSubmitted(false);
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /*
   * TO MAKE THIS FORM DYNAMIC:
   * Replace the body of handleSubmit with your API call.
   * formData contains: { name, email, company, service, budget, message }
   * Example:
   *   const res = await fetch('/api/contact', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify(formData),
   *   });
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <>
      <style>{`
        .logo-img { filter: brightness(0) invert(1); transition: filter 0.4s ease; }

        /* ─── Contact Modal ─── */
        .contact-overlay {
          position: fixed; inset: 0; z-index: 60;
          display: flex; align-items: center; justify-content: center; padding: 1rem;
          transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .contact-overlay.hidden-modal { opacity: 0; pointer-events: none; }
        .contact-backdrop {
          position: absolute; inset: 0;
          background: rgba(4,4,10,0.88);
          backdrop-filter: blur(28px) saturate(1.6);
          -webkit-backdrop-filter: blur(28px) saturate(1.6);
        }
        .contact-card {
          position: relative; width: 100%; max-width: 640px;
          max-height: 92vh; overflow-y: auto;
          border-radius: 28px;
          background: linear-gradient(145deg,
            rgba(201,169,110,0.07) 0%, rgba(10,10,18,0.97) 40%, rgba(4,4,10,0.99) 100%);
          border: 1px solid rgba(201,169,110,0.2);
          box-shadow: 0 0 0 1px rgba(201,169,110,0.05) inset,
            0 48px 120px rgba(0,0,0,0.75), 0 0 80px rgba(201,169,110,0.07);
          padding: 2.5rem 2.5rem 2rem;
          transform: translateY(0) scale(1);
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s;
          scrollbar-width: thin;
          scrollbar-color: rgba(201,169,110,0.2) transparent;
        }
        .contact-overlay.hidden-modal .contact-card {
          transform: translateY(28px) scale(0.96); opacity: 0;
        }
        .contact-card::before {
          content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 55%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,169,110,0.55), transparent);
        }
        .contact-card::-webkit-scrollbar { width: 3px; }
        .contact-card::-webkit-scrollbar-thumb { background: rgba(201,169,110,0.25); border-radius: 2px; }

        @media (max-width: 640px) {
          .contact-card { padding: 2rem 1.4rem 1.75rem; border-radius: 22px; }
        }

        /* ─── Form fields ─── */
        .cf-field { position: relative; margin-bottom: 1rem; }
        .cf-label {
          display: block; font-size: 9px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(201,169,110,0.6); margin-bottom: 0.4rem; transition: color 0.3s;
        }
        .cf-field.focused .cf-label { color: #C9A96E; }
        .cf-input {
          width: 100%; background: rgba(237,233,227,0.03);
          border: 1px solid rgba(237,233,227,0.07);
          border-radius: 12px; padding: 0.75rem 1rem;
          color: #EDE9E3; font-size: 13px; font-family: inherit;
          outline: none; transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
          -webkit-appearance: none;
        }
        .cf-input::placeholder { color: rgba(237,233,227,0.18); }
        .cf-input:focus {
          border-color: rgba(201,169,110,0.45);
          background: rgba(201,169,110,0.025);
          box-shadow: 0 0 0 3px rgba(201,169,110,0.07), 0 2px 16px rgba(0,0,0,0.35);
        }
        select.cf-input option { background: #0A0A12; color: #EDE9E3; }
        textarea.cf-input { resize: none; height: 110px; line-height: 1.65; }
        .cf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 480px) { .cf-grid { grid-template-columns: 1fr; } }

        .cf-submit {
          width: 100%; padding: 1rem; border-radius: 14px;
          background: linear-gradient(135deg, #B8935A 0%, #E8D4A0 45%, #D4B87A 75%, #C9A96E 100%);
          color: #04040A; font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          border: none; cursor: pointer; position: relative; overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s;
          animation: pulse-glow-gold 5s ease-in-out infinite;
        }
        .cf-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 36px rgba(201,169,110,0.4), 0 0 70px rgba(201,169,110,0.18);
        }
        .cf-submit::after {
          content: ''; position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          transform: skewX(-20deg);
          animation: shimmer-sweep 3.5s ease-in-out infinite;
        }

        .cf-close {
          position: absolute; top: 1.25rem; right: 1.25rem;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(237,233,227,0.05); border: 1px solid rgba(237,233,227,0.1);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(237,233,227,0.45);
          transition: all 0.3s; font-size: 14px; line-height: 1;
        }
        .cf-close:hover {
          background: rgba(237,233,227,0.1); color: #EDE9E3; transform: rotate(90deg);
        }

        .cf-success { text-align: center; padding: 3rem 1rem; }
        .cf-success-icon {
          width: 72px; height: 72px; margin: 0 auto 1.5rem;
          border-radius: 50%; background: rgba(201,169,110,0.1);
          border: 1px solid rgba(201,169,110,0.3);
          display: flex; align-items: center; justify-content: center; font-size: 26px;
          animation: breathe 4s ease-in-out infinite;
        }

        /* ─── Mobile Menu ─── */
        .mobile-menu-overlay {
          position: fixed; inset: 0; z-index: 40;
          transition: opacity 0.55s cubic-bezier(0.16,1,0.3,1);
        }
        .mobile-menu-overlay.hidden-modal { opacity: 0; pointer-events: none; }

        .mobile-nav-item {
          opacity: 0; transform: translateY(18px);
          transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .mobile-menu-overlay:not(.hidden-modal) .mobile-nav-item { opacity: 1; transform: translateY(0); }

        .mobile-nav-btn {
          font-size: clamp(1.8rem, 8vw, 2.6rem); font-weight: 700;
          letter-spacing: -0.04em; color: rgba(237,233,227,0.45);
          background: none; border: none; cursor: pointer; padding: 0; line-height: 1.1;
          font-family: inherit;
          transition: color 0.35s ease, letter-spacing 0.35s ease;
          display: block; width: 100%; text-align: center;
        }
        .mobile-nav-btn:hover { color: #EDE9E3; letter-spacing: -0.02em; }

        .mobile-contact-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0.8rem 1.8rem; border-radius: 100px;
          background: rgba(201,169,110,0.07); border: 1px solid rgba(201,169,110,0.22);
          color: #C9A96E; font-size: 9px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          cursor: pointer; transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          font-family: inherit;
        }
        .mobile-contact-btn:hover {
          background: rgba(201,169,110,0.14); border-color: rgba(201,169,110,0.45);
          box-shadow: 0 0 28px rgba(201,169,110,0.14);
        }

        .mobile-footer-info {
          position: absolute; bottom: 2.25rem; left: 50%; transform: translateX(-50%);
          opacity: 0; transition: opacity 0.5s 0.45s; text-align: center; white-space: nowrap;
        }
        .mobile-menu-overlay:not(.hidden-modal) .mobile-footer-info { opacity: 1; }

        /* ─── Contact nav button ─── */
        .contact-nav-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 0.45rem 1.1rem 0.45rem 0.85rem; border-radius: 100px;
          background: rgba(201,169,110,0.07); border: 1px solid rgba(201,169,110,0.2);
          color: #C9A96E; font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          cursor: pointer; transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          font-family: inherit; margin-left: 0.35rem;
        }
        .contact-nav-btn:hover {
          background: rgba(201,169,110,0.14); border-color: rgba(201,169,110,0.42);
          box-shadow: 0 0 22px rgba(201,169,110,0.14); transform: translateY(-1px);
        }
        .pulse-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #C9A96E;
          animation: dot-pulse 2.5s ease-in-out infinite;
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.65); }
        }
      `}</style>

      {/* ─── Header ─────────────────────────────────────────────── */}
      <header
        className={`absolute top-0 left-0 right-0 z-50 transition-all duration-1000 ${
          scrolled ? 'py-3.5' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image src="/motion_grace_logo.png" alt="Motion Grace" fill className="logo-img object-contain" priority />
            </div>
            <span className="font-bold text-sm tracking-tight hidden sm:block">
              <span className="text-foreground">Motion</span>
              <span className="text-gradient-gold">Grace</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <div className="glass-light rounded-full px-2 py-1.5 flex items-center gap-0.5">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.href)}
                  className="px-4 py-1.5 text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-all duration-500 rounded-full hover:bg-white/4"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Add Project — desktop */}
            <Link href="/add-project" className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-semibold uppercase text-primary-foreground bg-primary hover:opacity-90 transition-all duration-700 animate-pulse-gold" aria-label="Add a new project">
              Add Project
            </Link>

            {/* Book a Call — desktop 
            <button
              onClick={() => handleLinkClick('#cta')}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-semibold tracking-[0.15em] uppercase text-primary-foreground bg-primary hover:opacity-90 transition-all duration-700 animate-pulse-gold"
            >
              Book a Call
            </button>*/}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-[5px] p-2.5 rounded-xl hover:bg-white/5 transition-colors duration-300 ml-1"
              aria-label="Toggle menu"
            >
              <span className={`block h-[1.5px] w-5 bg-foreground/80 transition-all duration-500 origin-center ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`block h-[1.5px] bg-foreground/80 transition-all duration-500 ${menuOpen ? 'opacity-0 scale-x-0 w-3' : 'w-3 ml-auto'}`} />
              <span className={`block h-[1.5px] w-5 bg-foreground/80 transition-all duration-500 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Menu ─────────────────────────────────────────── */}
      <div className={`mobile-menu-overlay ${menuOpen ? '' : 'hidden-modal'}`}>
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(4,4,10,0.97)', backdropFilter: 'blur(32px) saturate(1.4)', WebkitBackdropFilter: 'blur(32px) saturate(1.4)' }}
          onClick={() => setMenuOpen(false)}
        />
        {/* Glow orb */}
        <div className="absolute pointer-events-none" style={{
          top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '80vw', height: '80vw', maxWidth: 400, maxHeight: 400,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(201,169,110,0.07) 0%, transparent 65%)',
        }} />

        <nav className="relative flex flex-col items-center justify-center h-full px-6" style={{ gap: 0 }}>
          {/* Section label */}
          <p className="mobile-nav-item" style={{
            fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'rgba(201,169,110,0.38)', marginBottom: '2rem', transitionDelay: '0ms'
          }}>
            Navigation
          </p>

          {navLinks.map((link, i) => (
            <div key={link.label} className="mobile-nav-item" style={{ paddingTop: '0.4rem', paddingBottom: '0.4rem', transitionDelay: `${55 + i * 55}ms` }}>
              <button className="mobile-nav-btn" onClick={() => handleLinkClick(link.href)}>
                {link.label}
              </button>
            </div>
          ))}

          {/* Divider */}
          <div className="mobile-nav-item" style={{
            height: 1, width: 44, margin: '1.4rem 0',
            background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.35), transparent)',
            transitionDelay: `${55 + navLinks.length * 55}ms`
          }} />

          {/* Buttons */}
          <div className="mobile-nav-item flex flex-col items-center gap-3" style={{ transitionDelay: `${80 + navLinks.length * 55}ms` }}>
            <Link href="/add-project" className="mobile-contact-btn" onClick={() => setMenuOpen(false)}>
              <span className="pulse-dot" />
              Add Project
            </Link>
            <button
              onClick={() => handleLinkClick('#cta')}
              className="px-9 py-3.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground bg-primary hover:opacity-90 transition-all duration-700 animate-pulse-gold"
            >
              Book a Call
            </button>
          </div>
        </nav>

        {/* Footer tag */}
        <div className="mobile-footer-info">
          <p style={{ fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(237,233,227,0.14)' }}>
            Motion Grace · Premium Motion Studio
          </p>
        </div>
      </div>

      {/* ─── Contact Form Modal ──────────────────────────────────── */}
      <div className={`contact-overlay ${contactOpen ? '' : 'hidden-modal'}`} aria-modal="true" role="dialog">
        <div className="contact-backdrop" onClick={() => setContactOpen(false)} />
        <div className="contact-card">
          <button className="cf-close" onClick={() => setContactOpen(false)} aria-label="Close contact form">✕</button>

          {!submitted ? (
            <>
              {/* Header */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.6)', marginBottom: '0.5rem' }}>
                  Get in Touch
                </p>
                <h2 className="text-gradient-gold" style={{ fontSize: 'clamp(1.5rem,4vw,1.9rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.12 }}>
                  Let's Create Something<br />Extraordinary
                </h2>
                <p style={{ marginTop: '0.65rem', fontSize: 13, color: 'rgba(237,233,227,0.38)', lineHeight: 1.7 }}>
                  Tell us about your vision. We'll respond within 24 hours.
                </p>
              </div>

              {/* Thin decorative line */}
              <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(201,169,110,0.15), transparent)', marginBottom: '1.5rem' }} />

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="cf-grid">
                  <div className={`cf-field ${focusedField === 'name' ? 'focused' : ''}`}>
                    <label className="cf-label" htmlFor="cf-name">Full Name *</label>
                    <input id="cf-name" className="cf-input" type="text" required
                      value={formData.name} onChange={e => handleChange('name', e.target.value)}
                      onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} />
                  </div>
                  <div className={`cf-field ${focusedField === 'email' ? 'focused' : ''}`}>
                    <label className="cf-label" htmlFor="cf-email">Email Address *</label>
                    <input id="cf-email" className="cf-input" type="email" required
                      value={formData.email} onChange={e => handleChange('email', e.target.value)}
                      onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />
                  </div>
                </div>

                <div className={`cf-field ${focusedField === 'company' ? 'focused' : ''}`}>
                  <label className="cf-label" htmlFor="cf-company">Company / Brand</label>
                  <input id="cf-company" className="cf-input" type="text" placeholder="Your company name"
                    value={formData.company} onChange={e => handleChange('company', e.target.value)}
                    onFocus={() => setFocusedField('company')} onBlur={() => setFocusedField(null)} />
                </div>

                <div className="cf-grid">
                  <div className={`cf-field ${focusedField === 'service' ? 'focused' : ''}`}>
                    <label className="cf-label" htmlFor="cf-service">Service *</label>
                    <select id="cf-service" className="cf-input" required
                      value={formData.service} onChange={e => handleChange('service', e.target.value)}
                      onFocus={() => setFocusedField('service')} onBlur={() => setFocusedField(null)}>
                      <option value="" disabled>Select a service</option>
                      {serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className={`cf-field ${focusedField === 'budget' ? 'focused' : ''}`}>
                    <label className="cf-label" htmlFor="cf-budget">Budget Range</label>
                    <select id="cf-budget" className="cf-input"
                      value={formData.budget} onChange={e => handleChange('budget', e.target.value)}
                      onFocus={() => setFocusedField('budget')} onBlur={() => setFocusedField(null)}>
                      <option value="" disabled>Select budget</option>
                      {budgetOptions.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div className={`cf-field ${focusedField === 'message' ? 'focused' : ''}`}>
                  <label className="cf-label" htmlFor="cf-message">Project Brief *</label>
                  <textarea id="cf-message" className="cf-input" placeholder="Tell us about your project, goals, and timeline..." required
                    value={formData.message} onChange={e => handleChange('message', e.target.value)}
                    onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)} />
                </div>

                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.13), transparent)', margin: '1.1rem 0 1.25rem' }} />

                <button type="submit" className="cf-submit">Send Message →</button>

                <p style={{ textAlign: 'center', marginTop: '0.8rem', fontSize: 10, color: 'rgba(237,233,227,0.18)', letterSpacing: '0.06em' }}>
                  We typically respond within 24 hours · No spam, ever
                </p>
              </form>
            </>
          ) : (
            <div className="cf-success">
              <div className="cf-success-icon">✦</div>
              <p style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.65)', marginBottom: '0.65rem' }}>
                Message Sent
              </p>
              <h3 className="text-gradient-gold" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                Thank You, {formData.name.split(' ')[0] || 'Friend'}
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(237,233,227,0.38)', lineHeight: 1.75, maxWidth: 340, margin: '0 auto 2rem' }}>
                We've received your message and will be in touch within 24 hours.
              </p>
              <button onClick={() => setContactOpen(false)} style={{
                padding: '0.7rem 2rem', borderRadius: '100px',
                background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.25)',
                color: '#C9A96E', fontSize: 10, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.3s',
              }}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
