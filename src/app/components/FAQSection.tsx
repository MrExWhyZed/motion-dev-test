'use client';

import React, { useState, useRef, useEffect } from 'react';

const faqs = [
  {
    question: 'What do you need from us before production starts?',
    answer: 'We typically need product photos, dimensions, label artwork, finish references, and a brief brand direction note. CAD files or existing packaging accelerate setup significantly.',
  },
  {
    question: 'How long does a typical project take from brief to delivery?',
    answer: 'Most projects land in 3–5 business days. Rush turnarounds within 24–48 hours are available for select packages. Complex multi-SKU systems are scoped individually.',
  },
  {
    question: 'Can we request edits after the first delivery?',
    answer: 'Yes. Every package includes two structured revision rounds covering shot selection, lighting, material feel, and campaign polish. Additional rounds are available at an hourly rate.',
  },
  {
    question: 'Do we own the final digital twin and all delivered assets?',
    answer: 'Full ownership of approved exported assets transfers to you on delivery. The production-ready digital twin setup tied to your package is also yours to keep and reuse.',
  },
  {
    question: 'How is this different from a traditional product shoot?',
    answer: 'Traditional shoots lock you into one setup, one day, and one output window. We build a reusable digital production system — new angles, seasons, formats, and revisions happen without ever reshooting.',
  },
  {
    question: 'What file formats are included in the deliverables?',
    answer: 'We deliver production-ready assets in formats suited to your use case: PNG, JPEG, WebP, MP4, and USDZ (for AR). Source files are available on Studio and custom plans.',
  },
  {
    question: 'Can you match our existing brand guidelines and visual language?',
    answer: 'Absolutely. Brand alignment is central to our process. We study your existing visual identity — color profiles, lighting mood, composition style — and apply it across every asset before delivery.',
  },
  {
    question: 'Do you work with physical products outside beauty and fragrance?',
    answer: 'Yes. While we specialise in prestige beauty, fragrance, and lifestyle, our pipeline handles apparel, accessories, homeware, and consumer electronics. Contact us with your product category for a scoped proposal.',
  },
  {
    question: 'Can you support larger custom retainers or seasonal rollouts?',
    answer: 'Yes. The public packages cover common launch scopes. For ongoing campaigns, multi-SKU systems, retail refreshes, and monthly content engines, we build custom retainers priced to your cadence.',
  },
  {
    question: 'Is there a minimum commitment or contract length?',
    answer: 'No lock-in. All packages are project-based. Retainer arrangements offer volume pricing and priority scheduling, but are entirely optional after your first successful delivery.',
  },
  {
    question: 'What happens if we need assets in formats or sizes not in the package?',
    answer: 'We resize and reformat all approved assets for your channels as part of the standard delivery. If you need additional platform-specific cuts or print-ready outputs, we add those at no extra charge for active clients.',
  },
];

function FAQItem({ faq, index, isOpen, onToggle }: {
  faq: typeof faqs[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      style={{
        borderRadius: '14px',
        overflow: 'hidden',
        border: `1px solid ${isOpen ? 'rgba(201,169,110,0.22)' : 'rgba(255,255,255,0.065)'}`,
        background: isOpen ? 'rgba(201,169,110,0.035)' : 'rgba(255,255,255,0.018)',
        transition: 'border-color 280ms ease, background 280ms ease',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: '16px', padding: '14px 18px',
          textAlign: 'left', cursor: 'pointer',
          background: 'none', border: 'none', color: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
          <span style={{
            fontSize: '9px', fontWeight: 800, color: isOpen ? 'rgba(201,169,110,0.8)' : 'rgba(255,255,255,0.2)',
            letterSpacing: '0.05em', flexShrink: 0, width: '20px', textAlign: 'right',
            transition: 'color 280ms ease',
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span style={{
            fontSize: '13px', fontWeight: 600,
            color: isOpen ? '#F7F1E2' : 'rgba(237,233,227,0.78)',
            letterSpacing: '-0.02em', lineHeight: 1.4,
            transition: 'color 280ms ease',
          }}>
            {faq.question}
          </span>
        </div>
        <span style={{
          fontSize: '16px', lineHeight: 1,
          color: isOpen ? 'rgba(201,169,110,0.9)' : 'rgba(255,255,255,0.3)',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 320ms cubic-bezier(0.16,1,0.3,1), color 280ms ease',
          flexShrink: 0, fontWeight: 300,
        }}>+</span>
      </button>

      <div style={{
        maxHeight: `${height}px`,
        overflow: 'hidden',
        transition: 'max-height 380ms cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div ref={bodyRef} style={{
          padding: '0 18px 14px 50px',
          fontSize: '12.5px', lineHeight: 1.72,
          color: 'rgba(237,233,227,0.5)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '12px',
        }}>
          {faq.answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  const col1 = faqs.slice(0, 6);
  const col2 = faqs.slice(6);

  if (isMobile) {
    return (
      <section
        data-gsap-section="default"
        style={{
          background: 'linear-gradient(180deg, #020208 0%, #04040c 50%, #030309 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: '64px 0 80px',
          isolation: 'isolate',
          zIndex: 1,
        }}
      >
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
          width: '120vw', height: '50vh',
          background: 'radial-gradient(ellipse, rgba(201,169,110,0.04) 0%, transparent 65%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        {/* Bottom glow */}
        <div style={{
          position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '80vw', height: '30vh',
          background: 'radial-gradient(ellipse, rgba(74,158,255,0.03) 0%, transparent 65%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '0 16px' }}>

          {/* Header */}
          <div style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3))' }} />
              <span style={{ fontSize: '7.5px', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.65)', fontWeight: 800, whiteSpace: 'nowrap' }}>Questions</span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(270deg, transparent, rgba(201,169,110,0.3))' }} />
            </div>

            <h2 style={{
              fontSize: 'clamp(2.2rem, 10vw, 3rem)', fontWeight: 900,
              letterSpacing: '-0.055em', color: '#F7F1E2', margin: '0 0 12px',
              lineHeight: 0.95,
            }}>
              FAQs
              <span style={{ color: '#C9A96E', textShadow: '0 0 24px rgba(201,169,110,0.7)' }}>.</span>
            </h2>
            <p style={{
              fontSize: '13px', color: 'rgba(237,233,227,0.38)',
              lineHeight: 1.65, letterSpacing: '-0.01em', margin: 0, maxWidth: '32ch',
            }}>
              Everything you need to know, from brief to delivery.
            </p>
          </div>

          {/* All FAQs in a single column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '32px' }}>
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.018)',
            border: '1px solid rgba(255,255,255,0.065)',
            borderRadius: '18px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Subtle gold line */}
            <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)' }} />

            <p style={{ fontSize: '14px', fontWeight: 700, color: '#F7F1E2', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              Still have questions?
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(237,233,227,0.38)', margin: '0 0 16px', lineHeight: 1.5 }}>
              Our team responds within one business day.
            </p>
            <a
              href="mailto:hello@motiongrace.com"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                width: '100%', padding: '13px 22px', borderRadius: '100px',
                background: 'rgba(201,169,110,0.1)',
                border: '1px solid rgba(201,169,110,0.28)',
                color: '#C9A96E', fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                textDecoration: 'none',
                boxSizing: 'border-box',
              }}
            >
              Get in touch
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

        </div>
      </section>
    );
  }

  return (
    <section
      data-gsap-section="default"
      style={{
        background: 'linear-gradient(180deg, #020208 0%, #04040c 50%, #030309 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 24px 96px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        isolation: 'isolate',
        zIndex: 1,
      }}
    >
      {/* Subtle ambient glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '60vw', height: '40vh',
        background: 'radial-gradient(ellipse, rgba(74,158,255,0.03) 0%, transparent 65%)',
        filter: 'blur(100px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>

        {/* Header row */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: '24px', marginBottom: '40px', flexWrap: 'wrap',
        }}>
          <div>
            
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900,
              letterSpacing: '-0.05em', color: '#F7F1E2', margin: 0, lineHeight: 1.05,
            }}>
              FAQs.
            </h2>
          </div>
          <p style={{
            fontSize: '13px', color: 'rgba(237,233,227,0.38)', maxWidth: '260px',
            lineHeight: 1.65, letterSpacing: '-0.01em', margin: 0,
          }}>
            Everything you need to know about working with Motion Grace — from brief to asset delivery.
          </p>
        </div>

        {/* Two-column FAQ grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
          gap: '8px 24px',
        }}>
          {/* Column 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {col1.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>

          {/* Column 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {col2.map((faq, i) => (
              <FAQItem
                key={i + 6}
                faq={faq}
                index={i + 6}
                isOpen={openIndex === i + 6}
                onToggle={() => setOpenIndex(openIndex === i + 6 ? null : i + 6)}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA strip */}
        <div style={{
          marginTop: '36px', padding: '20px 24px',
          background: 'rgba(255,255,255,0.018)',
          border: '1px solid rgba(255,255,255,0.065)',
          borderRadius: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '16px', flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#F7F1E2', margin: '0 0 3px', letterSpacing: '-0.02em' }}>
              Still have questions?
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(237,233,227,0.4)', margin: 0 }}>
              Our team responds within one business day.
            </p>
          </div>
          <a
            href="mailto:hello@motiongrace.com"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 22px', borderRadius: '100px',
              background: 'rgba(201,169,110,0.1)',
              border: '1px solid rgba(201,169,110,0.25)',
              color: '#C9A96E', fontSize: '12px', fontWeight: 700,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'background 200ms ease, border-color 200ms ease',
              cursor: 'pointer',
            }}
          >
            Get in touch
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

