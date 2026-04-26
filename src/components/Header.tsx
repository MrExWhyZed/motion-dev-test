'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Works', href: 'https://app.motiongraceco.com/gallery', external: true },
  { label: 'Process', href: '#how-it-works' },
];

const AI_STRATEGIST_HREF = 'https://app.motiongraceco.com/strategist';

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
  const [collapsed, setCollapsed] = useState(false);
  const [pillVisible, setPillVisible] = useState(false);
  const [pillMounted, setPillMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', company: '', service: '', budget: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setCollapsed(y > window.innerHeight * 0.75);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Decouple mount from visibility so CSS transition always fires
  useEffect(() => {
    if (collapsed) {
      setPillMounted(true);
      // Let browser paint the hidden state first, then transition in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPillVisible(true));
      });
    } else {
      // Fade out first, then unmount after transition completes
      setPillVisible(false);
      const t = setTimeout(() => setPillMounted(false), 650);
      return () => clearTimeout(t);
    }
  }, [collapsed]);

  useEffect(() => {
    document.body.style.overflow = (menuOpen || contactOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, contactOpen]);

  const handleLinkClick = (href: string, external?: boolean) => {
    setMenuOpen(false);
    setContactOpen(false);
    if (external) {
      window.open(href, '_blank', 'noopener noreferrer');
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHero = () => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          position: fixed; inset: 0; z-index: 55;
          opacity: 0; pointer-events: none;
          transition: opacity 0.45s cubic-bezier(0.22,1,0.36,1);
        }
        .mobile-menu-overlay.menu-open {
          opacity: 1; pointer-events: auto;
        }

        /* Nav items stagger in from below */
        .mobile-nav-item {
          opacity: 0;
          transform: translateY(22px);
          transition:
            opacity 0.5s cubic-bezier(0.22,1,0.36,1),
            transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .mobile-menu-overlay.menu-open .mobile-nav-item {
          opacity: 1;
          transform: translateY(0);
        }

        /* Large nav text */
        .mobile-nav-btn {
          font-size: clamp(2rem, 9vw, 2.8rem); font-weight: 700;
          letter-spacing: -0.04em; color: rgba(237,233,227,0.4);
          background: none; border: none; cursor: pointer; padding: 0; line-height: 1.1;
          font-family: inherit;
          transition: color 0.3s ease, letter-spacing 0.3s ease;
          display: block; width: 100%; text-align: center;
        }
        .mobile-nav-btn:hover, .mobile-nav-btn:active { color: rgba(237,233,227,0.9); letter-spacing: -0.02em; }

        /* Glass pill button (Contact Us) */
        .mobile-glass-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0.75rem 1.6rem; border-radius: 100px;
          background: rgba(237,233,227,0.04);
          border: 1px solid rgba(237,233,227,0.1);
          color: rgba(237,233,227,0.65); font-size: 9px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          cursor: pointer; font-family: inherit; text-decoration: none;
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .mobile-glass-pill:hover, .mobile-glass-pill:active {
          background: rgba(237,233,227,0.09);
          border-color: rgba(237,233,227,0.18);
          color: rgba(237,233,227,0.95);
        }

        /* Mobile AI Strategist pill */
        .mobile-ai-pill {
          display: inline-flex; align-items: center;
          padding: 0.75rem 1.6rem; border-radius: 100px;
          background: rgba(201,89,221,0.05);
          border: 1px solid rgba(201,89,221,0.22);
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          cursor: pointer; font-family: inherit; text-decoration: none;
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .mobile-ai-pill:hover, .mobile-ai-pill:active {
          background: rgba(201,89,221,0.1);
          border-color: rgba(201,89,221,0.4);
          box-shadow: 0 0 18px rgba(201,89,221,0.25), 0 0 36px rgba(8,148,255,0.12);
        }

        .mobile-footer-info {
          position: absolute; bottom: 2.25rem; left: 50%; transform: translateX(-50%);
          opacity: 0; transition: opacity 0.5s 0.4s; text-align: center; white-space: nowrap;
        }
        .mobile-menu-overlay.menu-open .mobile-footer-info { opacity: 1; }

        /* ─── Contact nav button ─── */
        .contact-nav-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 0.45rem 1.1rem 0.45rem 0.85rem; border-radius: 100px;
          background: rgba(237,233,227,0.04); border: 1px solid rgba(237,233,227,0.08);
          color: rgba(237,233,227,0.65); font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          cursor: pointer; transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          backdrop-filter: blur(16px) saturate(1.2);
          -webkit-backdrop-filter: blur(16px) saturate(1.2);
          font-family: inherit; margin-left: 0.35rem;
        }
        .contact-nav-btn:hover {
          background: rgba(237,233,227,0.08); border-color: rgba(237,233,227,0.14);
          color: rgba(237,233,227,0.9);
          transform: translateY(-1px);
        }
        .pulse-dot {
          width: 5px; height: 5px; border-radius: 50%; background: rgba(237,233,227,0.5);
          animation: dot-pulse 2.5s ease-in-out infinite;
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.65); }
        }

        /* ─── AI Strategist Nav Item ─── */
        .ai-strategist-nav-item {
          position: relative;
        }
        .ai-strategist-nav-text {
          background: linear-gradient(to right, #0894ff 0%, #c959dd 45%, #ff9004 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 6px rgba(201,89,221,0.5));
          animation: ai-text-glow 4s ease-in-out infinite;
        }
        @keyframes ai-text-glow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(201,89,221,0.45)) drop-shadow(0 0 8px rgba(8,148,255,0.2)); }
          50% { filter: drop-shadow(0 0 8px rgba(255,144,4,0.5)) drop-shadow(0 0 14px rgba(201,89,221,0.35)); }
        }
        .ai-strategist-nav-item:hover .ai-strategist-nav-text {
          filter: drop-shadow(0 0 10px rgba(201,89,221,0.7)) drop-shadow(0 0 20px rgba(8,148,255,0.4));
          animation: none;
        }
        .ai-strategist-nav-item:hover {
          background: rgba(201,89,221,0.06) !important;
        }

        /* ─── Collapsed Header ─── */
        .header-collapsed-pill {
          position: fixed;
          top: 1.1rem;
          left: 50%;
          transform: translateX(-50%) translateY(-22px);
          z-index: 50;
          opacity: 0;
          transition:
            opacity 0.65s cubic-bezier(0.22,1,0.36,1),
            transform 0.65s cubic-bezier(0.22,1,0.36,1);
          pointer-events: none;
        }
        .header-collapsed-pill.pill-visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
          pointer-events: auto;
        }
        .collapsed-nav {
          display: flex; align-items: center; gap: 0.25rem;
          padding: 0.35rem 0.5rem;
          border-radius: 100px;
          background: rgba(4,4,10,0.75);
          backdrop-filter: blur(24px) saturate(1.6);
          -webkit-backdrop-filter: blur(24px) saturate(1.6);
          border: 1px solid rgba(237,233,227,0.08);
          box-shadow: 0 4px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(237,233,227,0.03) inset;
        }
        .collapsed-nav-item {
          padding: 0.4rem 1.1rem;
          border-radius: 100px;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(237,233,227,0.55);
          background: none; border: none; cursor: pointer;
          font-family: inherit; text-decoration: none;
          transition: color 0.3s, background 0.3s;
          display: inline-flex; align-items: center;
        }
        .collapsed-nav-item:hover {
          color: rgba(237,233,227,0.9);
          background: rgba(237,233,227,0.05);
        }
        .collapsed-divider {
          width: 1px; height: 14px;
          background: rgba(237,233,227,0.1);
          flex-shrink: 0;
        }

        /* Full header fade */
        .header-full {
          transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1);
        }
        .header-full.header-faded {
          opacity: 0;
          pointer-events: none;
          transform: translateY(-10px);
        }
      `}</style>

      {/* ─── Collapsed Pill (appears after hero) ────────────────── */}
      {pillMounted && (
        <div className={`header-collapsed-pill ${pillVisible ? 'pill-visible' : ''}`}>
          <div className="collapsed-nav">
            <button className="collapsed-nav-item" onClick={scrollToHero}>
              Home
            </button>
            <div className="collapsed-divider" />
            <a
              href={AI_STRATEGIST_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="collapsed-nav-item"
            >
              <span className="ai-strategist-nav-text">AI Strategist</span>
            </a>
          </div>
        </div>
      )}

      {/* ─── Header ─────────────────────────────────────────────── */}
      <header
        className={`header-full absolute top-0 left-0 right-0 z-50 transition-all duration-1000 ${
          scrolled ? 'py-3.5' : 'bg-transparent py-6'
        } ${collapsed ? 'header-faded' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image src="/motion_grace_logo.png" alt="Motion Grace" fill className="logo-img object-contain" priority />
            </div>
            <span className="font-bold text-sm tracking-tight hidden sm:block">
              <span style={{ color: '#ffffff' }}>Motion</span>
              <span style={{ color: '#ffffff' }}>Grace</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <div className="glass-light rounded-full px-2 py-1.5 flex items-center gap-0.5">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.href, link.external)}
                  className="px-4 py-1.5 text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-all duration-500 rounded-full hover:bg-white/4"
                >
                  {link.label}
                </button>
              ))}
              <Link
                href="/pricing"
                className="px-4 py-1.5 text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-all duration-500 rounded-full hover:bg-white/4"
              >
                Pricing
              </Link>
              {/* AI Strategist — inside nav pill */}
              <a
                href={AI_STRATEGIST_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="ai-strategist-nav-item px-4 py-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase rounded-full transition-all duration-500"
              >
                <span className="ai-strategist-nav-text">AI Strategist</span>
              </a>
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Contact Us — desktop */}
            <a
              href="mailto:hello@motiongrace.com"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] transition-all duration-300"
              style={{
                background: 'rgba(237, 233, 227, 0.04)',
                backdropFilter: 'blur(16px) saturate(1.2)',
                WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
                border: '1px solid rgba(237, 233, 227, 0.08)',
                color: 'rgba(237,233,227,0.65)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(237,233,227,0.08)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(237,233,227,0.9)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(237,233,227,0.14)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(237,233,227,0.04)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(237,233,227,0.65)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(237,233,227,0.08)'; }}
              aria-label="Contact us"
            >
              Contact Us
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10 rounded-xl transition-all duration-300"
              style={{ background: menuOpen ? 'rgba(237,233,227,0.06)' : 'transparent' }}
              aria-label="Toggle menu"
            >
              <span className={`block h-[1.5px] w-5 transition-all duration-500 origin-center ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`}
                style={{ background: 'rgba(237,233,227,0.9)', boxShadow: '0 0 6px rgba(237,233,227,0.5)' }} />
              <span className={`block h-[1.5px] transition-all duration-500 ${menuOpen ? 'opacity-0 scale-x-0 w-3' : 'w-3 ml-auto'}`}
                style={{ background: 'rgba(237,233,227,0.9)', boxShadow: '0 0 6px rgba(237,233,227,0.5)' }} />
              <span className={`block h-[1.5px] w-5 transition-all duration-500 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`}
                style={{ background: 'rgba(237,233,227,0.9)', boxShadow: '0 0 6px rgba(237,233,227,0.5)' }} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Menu ─────────────────────────────────────────── */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'menu-open' : ''}`}>
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(4,4,10,0.96)', backdropFilter: 'blur(32px) saturate(1.4)', WebkitBackdropFilter: 'blur(32px) saturate(1.4)' }}
          onClick={() => setMenuOpen(false)}
        />
        {/* Ambient glow */}
        <div className="absolute pointer-events-none" style={{
          top: '35%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '70vw', height: '70vw', maxWidth: 360, maxHeight: 360,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(201,89,221,0.05) 0%, rgba(8,148,255,0.04) 40%, transparent 70%)',
        }} />

        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          className="mobile-nav-item"
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(237,233,227,0.05)',
            border: '1px solid rgba(237,233,227,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'rgba(237,233,227,0.5)',
            fontSize: 16, lineHeight: 1,
            transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
            transitionDelay: '0ms',
            zIndex: 10,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(237,233,227,0.1)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(237,233,227,0.95)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(90deg)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(237,233,227,0.05)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(237,233,227,0.5)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(0deg)';
          }}
        >
          ✕
        </button>

        <nav className="relative flex flex-col items-center justify-center h-full px-6" style={{ gap: 0 }}>

          {/* Label */}
          <p className="mobile-nav-item" style={{
            fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'rgba(201,169,110,0.35)', marginBottom: '2.2rem', transitionDelay: '0ms',
          }}>
            Navigation
          </p>

          {/* Nav links */}
          {navLinks.map((link, i) => (
            <div key={link.label} className="mobile-nav-item" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', transitionDelay: `${60 + i * 60}ms` }}>
              <button className="mobile-nav-btn" onClick={() => handleLinkClick(link.href, link.external)}>
                {link.label}
              </button>
            </div>
          ))}

          {/* Divider */}
          <div className="mobile-nav-item" style={{
            height: 1, width: 36, margin: '1.6rem 0',
            background: 'linear-gradient(90deg, transparent, rgba(237,233,227,0.12), transparent)',
            transitionDelay: `${60 + navLinks.length * 60}ms`,
          }} />

          {/* Pill buttons — Contact Us + AI Strategist only */}
          <div className="mobile-nav-item flex flex-col items-center gap-3" style={{ transitionDelay: `${80 + navLinks.length * 60}ms` }}>
            {/* Contact Us — glass pill */}
            <a
              href="mailto:hello@motiongrace.com"
              className="mobile-glass-pill"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </a>
            {/* AI Strategist */}
            <a
              href={AI_STRATEGIST_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-ai-pill"
              onClick={() => setMenuOpen(false)}
            >
              <span className="ai-strategist-nav-text">AI Strategist</span>
            </a>
          </div>

        </nav>

        {/* Footer tag */}
        <div className="mobile-footer-info">
          <p style={{ fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(237,233,227,0.12)' }}>
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