'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import SiteHeader from './SiteHeader';
import SuccessState from './SuccessState';

export type FormValues = {
  name: string;
  project_name: string;
  project_type: string;
  budget: string;
  description: string;
};

interface ReferenceImage {
  id: string;
  file: File;
  preview: string;
  name: string;
}

const PROJECT_TYPES = [
  { value: 'brand-film',             label: 'Brand Film' },
  { value: 'motion-identity',        label: 'Motion Identity' },
  { value: 'title-sequence',         label: 'Title Sequence' },
  { value: 'product-visualization',  label: 'Product Visualization' },
  { value: 'explainer-video',        label: 'Explainer Video' },
  { value: 'social-content',         label: 'Social Content Series' },
  { value: 'immersive-installation', label: 'Immersive Installation' },
  { value: 'other',                  label: 'Something else entirely' },
];

const BUDGET_RANGES = [
  { value: 'under-5k',  label: 'Under $5,000' },
  { value: '5k-15k',   label: '$5,000 — $15,000' },
  { value: '15k-50k',  label: '$15,000 — $50,000' },
  { value: '50k-100k', label: '$50,000 — $100,000' },
  { value: 'over-100k', label: 'Over $100,000' },
  { value: 'discuss',  label: "Let's discuss" },
];

const STEPS = [
  { id: 1, label: 'You' },
  { id: 2, label: 'Project' },
  { id: 3, label: 'Vision' },
  { id: 4, label: 'References' },
];

const GOLD  = '#C9A96E';
const BLUE  = '#68B4FF';
const CREAM = '#F7F1E2';

// ─────────────────────────────────────────────────────────────
//  AddProjectClient
// ─────────────────────────────────────────────────────────────
export default function AddProjectClient() {
  /*
   * currentStep drives only React-side logic (validation, pill state,
   * pointer-events). It NEVER toggles display:none on panels.
   * All panels are permanently mounted — GSAP owns their visibility.
   */
  const [currentStep,    setCurrentStep]    = useState(1);
  const [isSuccess,      setIsSuccess]      = useState(false);
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [submitError,    setSubmitError]    = useState('');
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [isDragging,     setIsDragging]     = useState(false);
  const [selectedType,   setSelectedType]   = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  // Prevents overlapping transitions
  const isAnimating  = useRef(false);
  // All four step panel DOM nodes
  const stepRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // GSAP singleton loaded once
  const g            = useRef<typeof import('gsap').gsap | null>(null);

  const {
    register, handleSubmit, trigger, reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: '', project_name: '', project_type: '', budget: '', description: '' },
  });

  // ── Bootstrap ─────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    (async () => {
      const gsap = (await import('gsap')).gsap;
      if (!alive) return;
      g.current = gsap;

      // Instantly hide every panel — no flash.
      // We use autoAlpha so GSAP also manages visibility:hidden.
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { autoAlpha: 0, y: 48, scale: 0.97 });
      });

      // Animate step 1 in — cinematic curtain rise
      const el0 = stepRefs.current[0];
      if (!el0) return;

      const tl = gsap.timeline();

      // Panel rises up
      tl.to(el0, {
        autoAlpha: 1, y: 0, scale: 1,
        duration: 0.78, ease: 'expo.out',
        delay: 0.06,
      });

      // Children stagger in with a slight blur dissolve
      tl.fromTo(
        el0.querySelectorAll('[data-a]'),
        { autoAlpha: 0, y: 30, filter: 'blur(6px)' },
        { autoAlpha: 1, y: 0,  filter: 'blur(0px)', duration: 0.5, stagger: 0.07, ease: 'power3.out' },
        '-=0.42',
      );
    })();
    return () => { alive = false; };
  }, []);

  // ── Transition engine — pure GSAP, no mid-flight React state ──
  const transitionToStep = useCallback((next: number) => {
    const gsap = g.current;
    if (!gsap || isAnimating.current || next === currentStep) return;
    isAnimating.current = true;

    const fromEl   = stepRefs.current[currentStep - 1];
    const toEl     = stepRefs.current[next - 1];
    const forward  = next > currentStep;

    // Directional offsets give a story-book page-turn feeling
    const exitY  = forward ? -44 : 44;
    const enterY = forward ?  60 : -60;

    const tl = gsap.timeline({
      onComplete() {
        // React state update happens AFTER the full animation — zero layout flash
        setCurrentStep(next);
        isAnimating.current = false;
      },
    });

    // ── EXIT ────────────────────────────────────────────────
    if (fromEl) {
      const exitChildren = fromEl.querySelectorAll('[data-a]');

      // Children scatter first (overlap with panel fade)
      tl.to(exitChildren, {
        autoAlpha: 0,
        y: forward ? -14 : 14,
        filter: 'blur(3px)',
        duration: 0.22,
        stagger: { each: 0.03, from: forward ? 'start' : 'end' },
        ease: 'power2.in',
      });

      // Panel retreats
      tl.to(fromEl, {
        autoAlpha: 0,
        y: exitY,
        scale: forward ? 0.95 : 1.04,
        filter: 'blur(6px)',
        duration: 0.32,
        ease: 'power3.in',
      }, '-=0.12');
    }

    // ── CINEMATIC BEAT ─────────────────────────────────────
    tl.set({}, {}, '+=0.02');

    // ── ENTER ───────────────────────────────────────────────
    if (toEl) {
      // Snap incoming panel to off-screen position (no flicker — autoAlpha:0)
      tl.set(toEl, {
        autoAlpha: 0,
        y: enterY,
        scale: forward ? 1.04 : 0.95,
        filter: 'blur(10px)',
      });

      // Panel glides in
      tl.to(toEl, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.56,
        ease: 'expo.out',
      });

      // Children bloom in after the panel starts arriving
      const enterChildren = toEl.querySelectorAll('[data-a]');
      if (enterChildren.length) {
        tl.fromTo(
          enterChildren,
          { autoAlpha: 0, y: forward ? 28 : -28, filter: 'blur(5px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.44, stagger: 0.06, ease: 'power3.out' },
          '-=0.34',
        );
      }
    }
  }, [currentStep]);

  // ── Nav handlers ──────────────────────────────────────────
  const handleStep1Next = async () => {
    const ok = await trigger(['name', 'project_name']);
    if (ok) transitionToStep(2);
  };
  const handleStep2Next = () => transitionToStep(3);
  const handleStep3Next = async () => {
    const ok = await trigger(['description']);
    if (ok) transitionToStep(4);
  };
  const handlePrev = (n: number) => transitionToStep(n);

  // ── Submit ────────────────────────────────────────────────
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('projects').insert({
        user_id:      user?.id    ?? null,
        name:         data.name,
        email:        user?.email ?? null,
        project_name: data.project_name,
        project_type: selectedType   || data.project_type,
        description:  data.description,
        budget:       selectedBudget || data.budget,
        status:       'Draft',
      });
      if (error) throw error;

      // Elegant farewell before success screen
      const gsap = g.current;
      const el   = stepRefs.current[currentStep - 1];
      if (gsap && el) {
        gsap.to(el, {
          autoAlpha: 0, y: -44, scale: 0.95, filter: 'blur(8px)',
          duration: 0.52, ease: 'power3.in',
          onComplete: () => setIsSuccess(true),
        });
      } else {
        setIsSuccess(true);
      }
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Image helpers ──────────────────────────────────────────
  const addImages = useCallback((files: FileList | File[]) => {
    const imgs: ReferenceImage[] = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, 6 - referenceImages.length)
      .map(f => ({ id: `${f.name}-${f.lastModified}`, file: f, preview: URL.createObjectURL(f), name: f.name }));
    setReferenceImages(prev => [...prev, ...imgs].slice(0, 6));
  }, [referenceImages.length]);

  const removeImage = useCallback((id: string) => {
    setReferenceImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== id);
    });
  }, []);

  // ── Success ───────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <SceneBg />
        <SiteHeader />
        <main className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <SuccessState onStartNew={() => {
            setIsSuccess(false);
            setCurrentStep(1);
            reset();
            setSelectedType('');
            setSelectedBudget('');
            setReferenceImages([]);
            // Re-initialise panels so step 1 is visible again
            requestAnimationFrame(() => {
              const gsap = g.current;
              if (!gsap) return;
              stepRefs.current.forEach((el, i) => {
                if (!el) return;
                if (i === 0) gsap.set(el, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)' });
                else          gsap.set(el, { autoAlpha: 0, y: 48, scale: 0.97, filter: 'blur(0px)' });
              });
            });
          }} />
        </main>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  //  Render
  // ─────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .step-pill { transition: all 0.55s cubic-bezier(0.34,1.56,0.64,1); }

        .type-chip {
          display: flex; align-items: center; justify-content: center;
          width: 100%; min-height: 44px;
          padding: 9px 12px; border-radius: 18px;
          font-size: .68rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          cursor: pointer; font-family: inherit; line-height: 1.2;
          text-align: center; white-space: normal;
          border: 1px solid rgba(201,169,110,.18);
          background: rgba(201,169,110,.04);
          color: rgba(201,169,110,.45);
          transition: all .22s cubic-bezier(.34,1.56,.64,1);
          will-change: transform;
        }
        .type-chip:hover {
          border-color: rgba(201,169,110,.55); color: rgba(201,169,110,.95);
          background: rgba(201,169,110,.09); transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(201,169,110,.18);
        }
        .type-chip.active {
          background: rgba(201,169,110,.13); border-color: rgba(201,169,110,.6);
          color: ${GOLD}; box-shadow: 0 0 22px rgba(201,169,110,.25);
        }

        .budget-chip {
          display: flex; align-items: center; justify-content: center;
          width: 100%; min-height: 44px;
          padding: 9px 12px; border-radius: 18px;
          font-size: .68rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          cursor: pointer; font-family: inherit; line-height: 1.2;
          text-align: center; white-space: normal;
          border: 1px solid rgba(104,180,255,.18);
          background: rgba(104,180,255,.04);
          color: rgba(104,180,255,.45);
          transition: all .22s cubic-bezier(.34,1.56,.64,1);
          will-change: transform;
        }
        .budget-chip:hover {
          border-color: rgba(104,180,255,.55); color: rgba(104,180,255,.95);
          background: rgba(104,180,255,.09); transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(104,180,255,.18);
        }
        .budget-chip.active {
          background: rgba(104,180,255,.11); border-color: rgba(104,180,255,.55);
          color: ${BLUE}; box-shadow: 0 0 22px rgba(104,180,255,.22);
        }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 11px 22px; border-radius: 999px;
          font-size: 9px; font-weight: 900;
          letter-spacing: .22em; text-transform: uppercase;
          background: ${GOLD}; color: #04040a; border: none;
          cursor: pointer; font-family: inherit;
          box-shadow: 0 8px 28px rgba(201,169,110,.4);
          transition: transform .22s ease, box-shadow .22s ease;
          will-change: transform;
        }
        .btn-primary:hover  { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(201,169,110,.52); }
        .btn-primary:active { transform: translateY(0); }
        .btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 16px; border-radius: 999px;
          font-size: 9px; font-weight: 700;
          letter-spacing: .18em; text-transform: uppercase;
          background: rgba(255,255,255,.03); color: rgba(237,233,227,.4);
          border: 1px solid rgba(255,255,255,.09);
          cursor: pointer; font-family: inherit;
          transition: all .22s ease; will-change: transform;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,.07); color: rgba(237,233,227,.8);
          border-color: rgba(255,255,255,.22);
        }

        .field-input {
          background: transparent; border: none;
          border-bottom: 1px solid rgba(237,233,227,.1);
          outline: none; color: ${CREAM}; width: 100%;
          font-size: 1rem; font-weight: 300;
          letter-spacing: .01em; padding: 12px 0;
          font-family: inherit; border-radius: 0;
          transition: border-color .3s ease;
        }
        .field-input:focus        { border-bottom-color: rgba(201,169,110,.7); }
        .field-input::placeholder { color: rgba(237,233,227,.18); }

        .vision-textarea {
          background: rgba(255,255,255,.025);
          border: 1px solid rgba(237,233,227,.08);
          outline: none; color: ${CREAM}; width: 100%;
          font-size: .875rem; font-weight: 300;
          letter-spacing: .01em; padding: 16px 18px;
          font-family: inherit; border-radius: 18px;
          resize: none; line-height: 1.7;
          transition: border-color .3s ease, background .3s ease;
        }
        .vision-textarea:focus {
          border-color: rgba(201,169,110,.35);
          background: rgba(201,169,110,.03);
        }
        .vision-textarea::placeholder { color: rgba(237,233,227,.18); }

        .drop-zone {
          border: 1px dashed rgba(237,233,227,.1);
          border-radius: 20px; padding: 28px 20px;
          text-align: center; cursor: pointer;
          background: rgba(255,255,255,.015);
          transition: border-color .3s ease, background .3s ease;
        }
        .drop-zone:hover, .drop-zone.drag-over {
          border-color: rgba(201,169,110,.42);
          background: rgba(201,169,110,.045);
        }

        .gold-divider {
          height: 1px; margin: 22px 0;
          background: linear-gradient(90deg,rgba(201,169,110,.45),transparent 65%);
        }

        .error-box {
          padding: 14px 18px; border-radius: 16px;
          background: rgba(248,113,113,.06);
          border: 1px solid rgba(248,113,113,.18);
        }

        .selector-grid {
          display: grid;
          gap: 10px;
        }

        .selector-grid.project-grid,
        .selector-grid.budget-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @media (min-width: 640px) {
          .selector-grid.project-grid,
          .selector-grid.budget-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="relative min-h-screen w-full overflow-hidden">
        <SceneBg />
        <SiteHeader />

        {/* ── Progress pills ──────────────────────────────── */}
        <div style={{
          position: 'fixed', top: 28, left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {STEPS.map(step => {
            const active = currentStep === step.id;
            const done   = currentStep > step.id;
            return (
              <div key={step.id} className="step-pill" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                overflow: 'hidden', height: 26, borderRadius: 13,
                padding: active ? '0 12px' : '0 6px',
                minWidth: active ? 'auto' : 26,
                background: active
                  ? 'linear-gradient(135deg,rgba(201,169,110,.2),rgba(104,180,255,.15))'
                  : done ? 'rgba(201,169,110,.14)' : 'rgba(255,255,255,.06)',
                border: active
                  ? '1px solid rgba(201,169,110,.48)'
                  : done ? '1px solid rgba(201,169,110,.24)' : '1px solid rgba(255,255,255,.09)',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  background: active ? `linear-gradient(135deg,${GOLD},${BLUE})` : done ? 'rgba(201,169,110,.65)' : 'rgba(255,255,255,.2)',
                  boxShadow: active ? `0 0 8px ${GOLD}90` : 'none',
                  transition: 'all .55s ease',
                }} />
                {active && (
                  <span style={{
                    fontSize: '.6rem', fontWeight: 800,
                    letterSpacing: '.2em', textTransform: 'uppercase',
                    color: CREAM, whiteSpace: 'nowrap',
                  }}>
                    {step.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/*
          ── STEP STAGE ─────────────────────────────────────
          All 4 panels are always in the DOM.
          Panel 1 is position:relative (holds layout height).
          Panels 2–4 are position:absolute, stacked on top.
          GSAP controls autoAlpha/y/scale — React never toggles
          display, so there is zero layout recalculation mid-flight.
        ──────────────────────────────────────────────────── */}
        <main
          className="relative z-10 flex items-start justify-center px-4 sm:px-8"
          style={{ minHeight: '100svh', paddingTop: 72, paddingBottom: 14 }}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: 620 }}>
            {[1, 2, 3, 4].map(n => (
              <div
                key={n}
                ref={el => { stepRefs.current[n - 1] = el; }}
                style={{
                  position: n === currentStep ? 'relative' : 'absolute',
                  top: 0, left: 0, width: '100%',
                  // Start invisible — GSAP will reveal them
                  opacity: 0, visibility: 'hidden',
                  // Only the active step receives pointer events
                  pointerEvents: n === currentStep ? 'auto' : 'none',
                  // GPU layer — prevents subpixel flicker during compositing
                  willChange: 'transform, opacity',
                  transform: 'translateZ(0)',
                }}
              >
                <PanelContent
                  n={n}
                  currentStep={currentStep}
                  errors={errors}
                  register={register}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  selectedBudget={selectedBudget}
                  setSelectedBudget={setSelectedBudget}
                  isDragging={isDragging}
                  setIsDragging={setIsDragging}
                  referenceImages={referenceImages}
                  fileInputRef={fileInputRef}
                  addImages={addImages}
                  removeImage={removeImage}
                  submitError={submitError}
                  isSubmitting={isSubmitting}
                  handleStep1Next={handleStep1Next}
                  handleStep2Next={handleStep2Next}
                  handleStep3Next={handleStep3Next}
                  handlePrev={handlePrev}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                />
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
//  PanelContent — pure render, no animation code
// ─────────────────────────────────────────────────────────────
type PanelProps = {
  n: number;
  currentStep: number;
  errors: ReturnType<typeof useForm<FormValues>>['formState']['errors'];
  register: ReturnType<typeof useForm<FormValues>>['register'];
  selectedType: string; setSelectedType: (v: string) => void;
  selectedBudget: string; setSelectedBudget: (v: string) => void;
  isDragging: boolean; setIsDragging: (v: boolean) => void;
  referenceImages: ReferenceImage[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  addImages: (files: FileList | File[]) => void;
  removeImage: (id: string) => void;
  submitError: string; isSubmitting: boolean;
  handleStep1Next: () => void; handleStep2Next: () => void;
  handleStep3Next: () => void; handlePrev: (n: number) => void;
  handleSubmit: ReturnType<typeof useForm<FormValues>>['handleSubmit'];
  onSubmit: (data: FormValues) => void;
};

const COPY = [
  { h1: "Let's start",   h2: "with you.",     sub: "Tell us who you are and what you're building." },
  { h1: "What are we",   h2: "creating?",     sub: "Choose the type of work and your budget range." },
  { h1: "Describe your", h2: "vision.",       sub: "Share your creative direction, timeline, and what inspires you." },
  { h1: "Any visual",    h2: "references?",  sub: "Optional — share images that inspire your project aesthetic." },
];

function PanelContent({
  n, errors, register,
  selectedType, setSelectedType,
  selectedBudget, setSelectedBudget,
  isDragging, setIsDragging,
  referenceImages, fileInputRef, addImages, removeImage,
  submitError, isSubmitting,
  handleStep1Next, handleStep2Next, handleStep3Next, handlePrev,
  handleSubmit, onSubmit,
}: PanelProps) {
  const { h1, h2, sub } = COPY[n - 1];
  const accent = n <= 2 ? GOLD : BLUE;

  return (
    <div style={{
      minHeight: 'calc(100svh - 86px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      paddingTop: 10,
      paddingBottom: 8,
    }}>

      {/* Eyebrow */}
      <div data-a style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 28, height: 1, background: `linear-gradient(90deg,transparent,${GOLD}90)` }} />
        <span style={{ fontSize: '.6rem', fontWeight: 800, letterSpacing: '.3em', textTransform: 'uppercase', color: `${GOLD}cc` }}>
          {String(n).padStart(2, '0')} / 04
        </span>
      </div>

      {/* Headline */}
      <div data-a style={{ marginBottom: 20 }}>
        <h2 style={{
          fontSize: 'clamp(2.15rem,5.6vw,3.7rem)',
          fontWeight: 900, lineHeight: .92,
          letterSpacing: '-.055em', color: CREAM, marginBottom: 14,
        }}>
          {h1}<br />
          <span style={{
            background: `linear-gradient(120deg,#F5E5C1 0%,${GOLD} 45%,${BLUE} 100%)`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>{h2}</span>
        </h2>
        <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(237,233,227,.38)', letterSpacing: '.01em', lineHeight: 1.65, maxWidth: 560 }}>
          {sub}
        </p>
      </div>

      {/* Card */}
      <div data-a style={CARD}>
        <div style={topShine(accent)} />
        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* ── Step 1 ── */}
          {n === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <FL>Full Name</FL>
                <input
                  type="text" placeholder="Your name" autoComplete="name" autoFocus
                  className="field-input"
                  {...register('name', {
                    required: 'Your name is required',
                    minLength: { value: 2, message: 'At least 2 characters' },
                  })}
                />
                {errors.name && <FE>{errors.name.message}</FE>}
              </div>
              <div>
                <FL>Project Name</FL>
                <input
                  type="text" placeholder="What's this project called?" autoComplete="off"
                  className="field-input"
                  {...register('project_name', {
                    required: 'Project name is required',
                    minLength: { value: 2, message: 'At least 2 characters' },
                  })}
                />
                {errors.project_name && <FE>{errors.project_name.message}</FE>}
              </div>
            </div>
          )}

          {/* ── Step 2 ── */}
          {n === 2 && (
            <>
              <FL>Project Type</FL>
              <div className="selector-grid project-grid" style={{ marginTop: 10, marginBottom: 20 }}>
                {PROJECT_TYPES.map(t => (
                  <button key={t.value} type="button"
                    onClick={() => setSelectedType(t.value === selectedType ? '' : t.value)}
                    className={`type-chip${selectedType === t.value ? ' active' : ''}`}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="gold-divider" />
              <FL>Budget Range</FL>
              <div className="selector-grid budget-grid" style={{ marginTop: 10 }}>
                {BUDGET_RANGES.map(r => (
                  <button key={r.value} type="button"
                    onClick={() => setSelectedBudget(r.value === selectedBudget ? '' : r.value)}
                    className={`budget-chip${selectedBudget === r.value ? ' active' : ''}`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Step 3 ── */}
          {n === 3 && (
            <>
              <FL>Project Vision</FL>
              <textarea
                rows={6}
                placeholder="Describe your vision, creative direction, timeline, and any references that inspire you..."
                className="vision-textarea"
                style={{ marginTop: 10 }}
                {...register('description', {
                  required: 'Please describe your project',
                  minLength: { value: 20, message: 'Please write at least 20 characters' },
                })}
              />
              {errors.description && <FE>{errors.description.message}</FE>}
            </>
          )}

          {/* ── Step 4 ── */}
          {n === 4 && (
            <>
              <div
                className={`drop-zone${isDragging ? ' drag-over' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={e => { e.preventDefault(); setIsDragging(false); addImages(e.dataTransfer.files); }}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                role="button" tabIndex={0} aria-label="Upload reference images"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', margin: '0 auto 14px',
                  background: isDragging ? 'rgba(201,169,110,.1)' : 'rgba(255,255,255,.04)',
                  border: isDragging ? '1px solid rgba(201,169,110,.4)' : '1px solid rgba(255,255,255,.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .3s ease',
                  boxShadow: isDragging ? '0 0 24px rgba(201,169,110,.22)' : 'none',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke={isDragging ? GOLD : 'rgba(237,233,227,.35)'}
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p style={{ fontSize: '.75rem', fontWeight: 400, marginBottom: 6, letterSpacing: '.02em', color: isDragging ? GOLD : 'rgba(237,233,227,.4)' }}>
                  {isDragging ? 'Drop to upload' : 'Drag & drop or click to browse'}
                </p>
                <p style={{ fontSize: '.6875rem', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(237,233,227,.2)' }}>
                  PNG · JPG · WEBP &nbsp;·&nbsp; up to 6 images
                </p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                  onChange={e => { if (e.target.files) addImages(e.target.files); e.target.value = ''; }} />
              </div>

              {referenceImages.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 12 }}>
                  {referenceImages.map(img => (
                    <div key={img.id} style={{
                      position: 'relative', aspectRatio: '4/3', borderRadius: 14, overflow: 'hidden',
                      border: '1px solid rgba(237,233,227,.08)',
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.preview} alt={`Reference: ${img.name}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div
                        style={{
                          position: 'absolute', inset: 0, background: 'rgba(0,0,0,.65)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: 0, transition: 'opacity .2s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0'; }}
                      >
                        <button type="button" onClick={e => { e.stopPropagation(); removeImage(img.id); }}
                          style={{
                            width: 30, height: 30, borderRadius: '50%',
                            background: 'rgba(248,113,113,.15)',
                            border: '1px solid rgba(248,113,113,.35)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                          }}
                          aria-label={`Remove ${img.name}`}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Error (step 4 only) */}
      {n === 4 && submitError && (
        <div data-a className="error-box" style={{ marginTop: 14 }} role="alert">
          <p style={{ fontSize: '.8125rem', fontWeight: 300, color: 'rgba(248,113,113,.9)' }}>{submitError}</p>
        </div>
      )}

      {/* Navigation */}
      <div data-a style={{ marginTop: 18 }}>
        {n === 1 && (
          <button className="btn-primary" type="button" onClick={handleStep1Next}>
            Continue <A right />
          </button>
        )}
        {n === 2 && (
          <Row>
            <button className="btn-ghost" type="button" onClick={() => handlePrev(1)}><A left /> Previous</button>
            <button className="btn-primary" type="button" onClick={handleStep2Next}>Continue <A right /></button>
          </Row>
        )}
        {n === 3 && (
          <Row>
            <button className="btn-ghost" type="button" onClick={() => handlePrev(2)}><A left /> Previous</button>
            <button className="btn-primary" type="button" onClick={handleStep3Next}>Continue <A right /></button>
          </Row>
        )}
        {n === 4 && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <button className="btn-ghost" type="button" onClick={() => handlePrev(3)}><A left /> Previous</button>
              <button className="btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ animation: 'spin .85s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Submitting…
                  </>
                ) : <>Submit Brief <A right /></>}
              </button>
            </Row>
            <p style={{
              marginTop: 16, fontSize: '.6875rem', fontWeight: 700,
              color: 'rgba(237,233,227,.17)', letterSpacing: '.12em', textTransform: 'uppercase',
            }}>
              We typically respond within 24 hours
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Background
// ─────────────────────────────────────────────────────────────
function SceneBg() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
      <div style={{ position: 'absolute', inset: 0, background: '#020208' }} />

      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .025 }}>
        <defs>
          <pattern id="pg-f" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth=".6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pg-f)" />
      </svg>

      <div style={{
        position: 'absolute', top: '-22%', left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 600, borderRadius: '50%',
        background: 'radial-gradient(ellipse at center,rgba(201,169,110,.13) 0%,rgba(201,169,110,.04) 35%,transparent 70%)',
        filter: 'blur(60px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%', width: 600, height: 500, borderRadius: '50%',
        background: 'radial-gradient(ellipse at center,rgba(104,180,255,.1) 0%,transparent 70%)',
        filter: 'blur(90px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '5%', left: '-8%', width: 480, height: 380, borderRadius: '50%',
        background: 'radial-gradient(ellipse at center,rgba(104,180,255,.07) 0%,transparent 70%)',
        filter: 'blur(100px)',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(ellipse at center,rgba(255,255,255,.025) 0%,transparent 70%)',
        filter: 'blur(50px)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, opacity: .025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '128px 128px',
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Shared styles & atoms
// ─────────────────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  position: 'relative', borderRadius: 26, overflow: 'hidden',
  border: '1px solid transparent',
  background: `
    linear-gradient(170deg,rgba(12,12,22,.97) 0%,rgba(6,6,14,.99) 100%) padding-box,
    linear-gradient(135deg,rgba(255,255,255,.08) 0%,rgba(201,169,110,.25) 50%,rgba(104,180,255,.12) 100%) border-box
  `,
  boxShadow: '0 20px 60px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.04)',
  padding: '26px 24px',
};

function topShine(accent: string): React.CSSProperties {
  return {
    position: 'absolute', top: 0, left: '12%', right: '12%',
    height: 1, pointerEvents: 'none',
    background: `linear-gradient(90deg,transparent,${accent}80,transparent)`,
  };
}

function FL({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: 'block', fontSize: '.6rem', fontWeight: 800,
      letterSpacing: '.28em', textTransform: 'uppercase',
      color: `${GOLD}88`, marginBottom: 6,
    }}>{children}</label>
  );
}

function FE({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '.6875rem', marginTop: 7, color: '#f87171', letterSpacing: '.02em' }}>
      {children}
    </p>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>{children}</div>;
}

function A({ right, left }: { right?: boolean; left?: boolean }) {
  return right ? (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ) : (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}
