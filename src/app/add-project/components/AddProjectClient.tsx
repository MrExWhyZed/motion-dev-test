'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import BackgroundGlow from './BackgroundGlow';
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
  { value: 'brand-film', label: 'Brand Film' },
  { value: 'motion-identity', label: 'Motion Identity' },
  { value: 'title-sequence', label: 'Title Sequence' },
  { value: 'product-visualization', label: 'Product Visualization' },
  { value: 'explainer-video', label: 'Explainer Video' },
  { value: 'social-content', label: 'Social Content Series' },
  { value: 'immersive-installation', label: 'Immersive Installation' },
  { value: 'other', label: 'Something else entirely' },
];

const BUDGET_RANGES = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-15k', label: '$5,000 — $15,000' },
  { value: '15k-50k', label: '$15,000 — $50,000' },
  { value: '50k-100k', label: '$50,000 — $100,000' },
  { value: 'over-100k', label: 'Over $100,000' },
  { value: 'discuss', label: "Let's discuss" },
];

const STEPS = [
  { id: 1, label: 'You' },
  { id: 2, label: 'Project' },
  { id: 3, label: 'Vision' },
  { id: 4, label: 'References' },
];

export default function AddProjectClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [transitioning, setTransitioning] = useState(false);

  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gsapRef = useRef<typeof import('gsap').gsap | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: '', project_name: '', project_type: '', budget: '', description: '' },
  });

  // Init GSAP and animate first step in
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const { gsap } = await import('gsap');
      if (!isMounted) return;
      gsapRef.current = gsap;

      const el = stepRefs.current[0];
      if (!el) return;

      // Curtain reveal: clip-path from bottom
      gsap.set(el, { opacity: 1 });
      gsap.fromTo(el,
        { clipPath: 'inset(100% 0% 0% 0%)', filter: 'blur(12px)', scale: 0.97 },
        { clipPath: 'inset(0% 0% 0% 0%)', filter: 'blur(0px)', scale: 1, duration: 1.0, ease: 'power4.out', delay: 0.15 }
      );
      const children = el.querySelectorAll('[data-animate]');
      gsap.fromTo(children,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out', delay: 0.35 }
      );
    };
    init();
    return () => { isMounted = false; };
  }, []);

  const transitionToStep = useCallback(async (nextStep: number) => {
    if (transitioning) return;
    setTransitioning(true);

    const gsap = gsapRef.current;
    const currentEl = stepRefs.current[currentStep - 1];
    const nextEl = stepRefs.current[nextStep - 1];
    const goingForward = nextStep > currentStep;

    if (!gsap) {
      setCurrentStep(nextStep);
      setTransitioning(false);
      return;
    }

    // Exit: curtain close (wipe direction depends on forward/back)
    if (currentEl) {
      await new Promise<void>((resolve) => {
        gsap.to(currentEl, {
          clipPath: goingForward ? 'inset(0% 0% 100% 0%)' : 'inset(0% 100% 0% 0%)',
          filter: 'blur(8px)',
          scale: goingForward ? 0.96 : 1.02,
          duration: 0.55,
          ease: 'power3.inOut',
          onComplete: resolve,
        });
      });
    }

    setCurrentStep(nextStep);

    // Slight pause — cinematic beat
    await new Promise<void>((r) => setTimeout(r, 60));

    // Enter: curtain open from opposite edge
    if (nextEl) {
      gsap.set(nextEl, {
        clipPath: goingForward ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 0% 100%)',
        filter: 'blur(12px)',
        scale: goingForward ? 1.03 : 0.97,
        opacity: 1,
      });
      gsap.to(nextEl, {
        clipPath: 'inset(0% 0% 0% 0%)',
        filter: 'blur(0px)',
        scale: 1,
        duration: 0.75,
        ease: 'power4.out',
      });
      const children = nextEl.querySelectorAll('[data-animate]');
      gsap.fromTo(children,
        { opacity: 0, y: goingForward ? 22 : -22 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out', delay: 0.1 }
      );
    }

    setTransitioning(false);
  }, [currentStep, transitioning]);

  const handleStep1Next = async () => {
    const valid = await trigger(['name', 'project_name']);
    if (valid) transitionToStep(2);
  };
  const handleStep2Next = () => transitionToStep(3);
  const handleStep3Next = async () => {
    const valid = await trigger(['description']);
    if (valid) transitionToStep(4);
  };
  const handlePrev = (prevStep: number) => transitionToStep(prevStep);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('projects').insert({
        user_id: user?.id ?? null,
        name: data.name,
        email: user?.email ?? null,
        project_name: data.project_name,
        project_type: selectedType || data.project_type,
        description: data.description,
        budget: selectedBudget || data.budget,
        status: 'Draft',
      });
      if (error) throw error;

      const gsap = gsapRef.current;
      const currentEl = stepRefs.current[currentStep - 1];
      if (gsap && currentEl) {
        gsap.to(currentEl, {
          clipPath: 'inset(0% 0% 100% 0%)',
          filter: 'blur(8px)',
          scale: 0.96,
          duration: 0.55,
          ease: 'power3.inOut',
        });
      }
      setTimeout(() => setIsSuccess(true), 560);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImages = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter((f) => f.type.startsWith('image/'));
    const newImages: ReferenceImage[] = imageFiles.slice(0, 6 - referenceImages.length).map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setReferenceImages((prev) => [...prev, ...newImages].slice(0, 6));
  }, [referenceImages.length]);

  const removeImage = useCallback((id: string) => {
    setReferenceImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  /* ── Shared styles ────────────────────────────────────────────────── */
  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.13)',
    outline: 'none',
    color: '#ffffff',
    width: '100%',
    fontSize: '1.125rem',
    fontWeight: 300,
    letterSpacing: '0.01em',
    padding: '14px 0',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease',
    borderRadius: 0,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.6875rem',
    fontWeight: 600,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.28)',
    marginBottom: '10px',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.75)';
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.13)';
  };

  if (isSuccess) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <BackgroundGlow />
        <SiteHeader />
        <main className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <SuccessState onStartNew={() => {
            setIsSuccess(false);
            setCurrentStep(1);
            reset();
            setSelectedType('');
            setSelectedBudget('');
            setReferenceImages([]);
          }} />
        </main>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* Step progress pill */
        .step-pill {
          transition: all 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }

        /* Pill chip selectors */
        .type-chip {
          padding: 9px 18px;
          border-radius: 999px;
          font-size: 0.8125rem;
          font-weight: 400;
          letter-spacing: 0.01em;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.45);
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          font-family: inherit;
          line-height: 1;
        }
        .type-chip:hover {
          border-color: rgba(168,85,247,0.4);
          color: rgba(168,85,247,0.9);
          background: rgba(168,85,247,0.07);
          transform: translateY(-1px);
        }
        .type-chip.active {
          background: rgba(168,85,247,0.13);
          border-color: rgba(168,85,247,0.55);
          color: rgba(168,85,247,0.95);
          box-shadow: 0 0 16px rgba(168,85,247,0.18);
        }

        .budget-chip {
          padding: 9px 18px;
          border-radius: 999px;
          font-size: 0.8125rem;
          font-weight: 400;
          letter-spacing: 0.01em;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.45);
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          font-family: inherit;
          line-height: 1;
        }
        .budget-chip:hover {
          border-color: rgba(236,72,153,0.4);
          color: rgba(236,72,153,0.9);
          background: rgba(236,72,153,0.07);
          transform: translateY(-1px);
        }
        .budget-chip.active {
          background: rgba(236,72,153,0.11);
          border-color: rgba(236,72,153,0.5);
          color: rgba(236,72,153,0.95);
          box-shadow: 0 0 16px rgba(236,72,153,0.15);
        }

        /* CTA buttons */
        .btn-continue {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          border-radius: 999px;
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          background: #ffffff;
          color: #080808;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 28px rgba(255,255,255,0.12);
          font-family: inherit;
        }
        .btn-continue:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 36px rgba(255,255,255,0.18);
        }
        .btn-continue:active { transform: translateY(0); }

        .btn-prev {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 24px;
          border-radius: 999px;
          font-size: 0.8125rem;
          font-weight: 400;
          letter-spacing: 0.04em;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.45);
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
        }
        .btn-prev:hover {
          background: rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.75);
          border-color: rgba(255,255,255,0.2);
        }

        .btn-submit {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          border-radius: 999px;
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          background: #ffffff;
          color: #080808;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 28px rgba(255,255,255,0.12);
          font-family: inherit;
        }
        .btn-submit:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }
        .btn-submit:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 36px rgba(255,255,255,0.2);
        }

        /* Textarea */
        .vision-textarea {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          outline: none;
          color: #ffffff;
          width: 100%;
          font-size: 1rem;
          font-weight: 300;
          letter-spacing: 0.01em;
          padding: 18px;
          font-family: inherit;
          border-radius: 16px;
          resize: none;
          line-height: 1.8;
          transition: border-color 0.3s ease;
        }
        .vision-textarea:focus { border-color: rgba(255,255,255,0.32); }
        .vision-textarea::placeholder { color: rgba(255,255,255,0.15); }

        /* Drop zone */
        .drop-zone {
          border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 18px;
          padding: 36px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .drop-zone:hover, .drop-zone.drag-over {
          border-color: rgba(168,85,247,0.45);
          background: rgba(168,85,247,0.05);
        }

        /* Headline gradient */
        .headline-gradient {
          background: linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.75) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Spin keyframe */
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <div className="relative min-h-screen w-full overflow-hidden" ref={containerRef}>
        <BackgroundGlow />
        <SiteHeader />

        {/* Step progress — top center */}
        <div className="fixed top-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="step-pill flex items-center gap-1.5 overflow-hidden"
              style={{
                height: '26px',
                borderRadius: '13px',
                padding: currentStep === step.id ? '0 12px' : '0 6px',
                width: currentStep === step.id ? 'auto' : '26px',
                background: currentStep === step.id
                  ? 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(236,72,153,0.2))'
                  : currentStep > step.id
                    ? 'rgba(168,85,247,0.18)'
                    : 'rgba(255,255,255,0.07)',
                border: currentStep === step.id
                  ? '1px solid rgba(168,85,247,0.4)'
                  : currentStep > step.id
                    ? '1px solid rgba(168,85,247,0.25)'
                    : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                background: currentStep === step.id
                  ? 'linear-gradient(135deg, #a855f7, #ec4899)'
                  : currentStep > step.id
                    ? 'rgba(168,85,247,0.6)'
                    : 'rgba(255,255,255,0.2)',
              }} />
              {currentStep === step.id && (
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.85)',
                  whiteSpace: 'nowrap',
                }}>
                  {step.label}
                </span>
              )}
            </div>
          ))}
        </div>

        <main className="relative z-10 min-h-screen flex items-center justify-center px-6 sm:px-10">
          <div className="w-full max-w-lg">

            {/* ── Step 1: Name + Project Name ──────────────── */}
            <div
              ref={(el) => { stepRefs.current[0] = el; }}
              style={{ display: currentStep === 1 ? 'block' : 'none', opacity: 1 }}
            >
              <StepCounter step={1} total={4} />
              <div data-animate>
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 7vw, 4rem)',
                  fontWeight: 800,
                  lineHeight: 1.0,
                  letterSpacing: '-0.035em',
                  color: '#ffffff',
                  marginBottom: '12px',
                }}>
                  Let&apos;s start<br />
                  <span style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>with you.</span>
                </h2>
                <p style={{ fontSize: '0.875rem', fontWeight: 300, color: 'rgba(255,255,255,0.32)', marginBottom: '44px', letterSpacing: '0.01em', lineHeight: 1.7 }}>
                  Tell us who you are and what you&apos;re building.
                </p>
              </div>

              <div className="space-y-8">
                <div data-animate>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    autoComplete="name"
                    autoFocus
                    style={inputStyle}
                    {...register('name', {
                      required: 'Your name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    })}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  {errors.name && <p style={{ fontSize: '0.7rem', marginTop: '6px', color: '#f87171' }}>{errors.name.message}</p>}
                </div>

                <div data-animate>
                  <label style={labelStyle}>Project Name</label>
                  <input
                    type="text"
                    placeholder="What&apos;s this project called?"
                    autoComplete="off"
                    style={inputStyle}
                    {...register('project_name', {
                      required: 'Project name is required',
                      minLength: { value: 2, message: 'Project name must be at least 2 characters' },
                    })}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  {errors.project_name && <p style={{ fontSize: '0.7rem', marginTop: '6px', color: '#f87171' }}>{errors.project_name.message}</p>}
                </div>

                <div data-animate className="pt-2">
                  <button className="btn-continue" onClick={handleStep1Next} type="button">
                    Continue
                    <ArrowRight />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Step 2: Project Type + Budget ────────────── */}
            <div
              ref={(el) => { stepRefs.current[1] = el; }}
              style={{ display: currentStep === 2 ? 'block' : 'none', opacity: 1 }}
            >
              <StepCounter step={2} total={4} />
              <div data-animate>
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 7vw, 4rem)',
                  fontWeight: 800,
                  lineHeight: 1.0,
                  letterSpacing: '-0.035em',
                  color: '#ffffff',
                  marginBottom: '12px',
                }}>
                  What are we<br />
                  <span style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>creating?</span>
                </h2>
                <p style={{ fontSize: '0.875rem', fontWeight: 300, color: 'rgba(255,255,255,0.32)', marginBottom: '44px', letterSpacing: '0.01em', lineHeight: 1.7 }}>
                  Choose the type of work and your budget range.
                </p>
              </div>

              <div className="space-y-10">
                <div data-animate>
                  <label style={labelStyle}>Project Type</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                    {PROJECT_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setSelectedType(type.value === selectedType ? '' : type.value)}
                        className={`type-chip${selectedType === type.value ? ' active' : ''}`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div data-animate>
                  <label style={labelStyle}>Budget Range</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                    {BUDGET_RANGES.map((range) => (
                      <button
                        key={range.value}
                        type="button"
                        onClick={() => setSelectedBudget(range.value === selectedBudget ? '' : range.value)}
                        className={`budget-chip${selectedBudget === range.value ? ' active' : ''}`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div data-animate className="pt-1">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button className="btn-prev" type="button" onClick={() => handlePrev(1)}>
                      <ArrowLeft /> Previous
                    </button>
                    <button className="btn-continue" type="button" onClick={handleStep2Next}>
                      Continue <ArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Step 3: Vision / Description ─────────────── */}
            <div
              ref={(el) => { stepRefs.current[2] = el; }}
              style={{ display: currentStep === 3 ? 'block' : 'none', opacity: 1 }}
            >
              <StepCounter step={3} total={4} />
              <div data-animate>
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 7vw, 4rem)',
                  fontWeight: 800,
                  lineHeight: 1.0,
                  letterSpacing: '-0.035em',
                  color: '#ffffff',
                  marginBottom: '12px',
                }}>
                  Describe your<br />
                  <span style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>vision.</span>
                </h2>
                <p style={{ fontSize: '0.875rem', fontWeight: 300, color: 'rgba(255,255,255,0.32)', marginBottom: '44px', letterSpacing: '0.01em', lineHeight: 1.7 }}>
                  Share your creative direction, timeline, and what inspires you.
                </p>
              </div>

              <div className="space-y-8">
                <div data-animate>
                  <label style={labelStyle}>Project Vision</label>
                  <textarea
                    rows={6}
                    placeholder="Describe your vision, creative direction, timeline, and any references that inspire you..."
                    className="vision-textarea"
                    {...register('description', {
                      required: 'Please describe your project',
                      minLength: { value: 20, message: 'Please provide at least 20 characters' },
                    })}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.32)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  />
                  {errors.description && <p style={{ fontSize: '0.7rem', marginTop: '6px', color: '#f87171' }}>{errors.description.message}</p>}
                </div>

                <div data-animate className="pt-1">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button className="btn-prev" type="button" onClick={() => handlePrev(2)}>
                      <ArrowLeft /> Previous
                    </button>
                    <button className="btn-continue" type="button" onClick={handleStep3Next}>
                      Continue <ArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Step 4: Reference Images + Submit ────────── */}
            <div
              ref={(el) => { stepRefs.current[3] = el; }}
              style={{ display: currentStep === 4 ? 'block' : 'none', opacity: 1 }}
            >
              <StepCounter step={4} total={4} />
              <div data-animate>
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 7vw, 4rem)',
                  fontWeight: 800,
                  lineHeight: 1.0,
                  letterSpacing: '-0.035em',
                  color: '#ffffff',
                  marginBottom: '12px',
                }}>
                  Any visual<br />
                  <span style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>references?</span>
                </h2>
                <p style={{ fontSize: '0.875rem', fontWeight: 300, color: 'rgba(255,255,255,0.32)', marginBottom: '36px', letterSpacing: '0.01em', lineHeight: 1.7 }}>
                  Optional — share images that inspire your project aesthetic.
                </p>
              </div>

              <div className="space-y-6">
                <div data-animate>
                  {/* Drop zone */}
                  <div
                    className={`drop-zone${isDragging ? ' drag-over' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); addImages(e.dataTransfer.files); }}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload reference images"
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                  >
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%', margin: '0 auto 14px',
                      background: isDragging ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.04)',
                      border: isDragging ? '1px solid rgba(168,85,247,0.35)' : '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s ease',
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke={isDragging ? 'rgba(168,85,247,0.9)' : 'rgba(255,255,255,0.4)'}
                        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 300, color: isDragging ? 'rgba(168,85,247,0.9)' : 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                      {isDragging ? 'Drop to upload' : 'Drag & drop or click to browse'}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.03em' }}>
                      PNG, JPG, WEBP — up to 6 images
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={(e) => { if (e.target.files) addImages(e.target.files); e.target.value = ''; }}
                    />
                  </div>

                  {/* Image previews */}
                  {referenceImages.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '10px' }}>
                      {referenceImages.map((img) => (
                        <div
                          key={img.id}
                          style={{
                            position: 'relative', aspectRatio: '4/3', borderRadius: '12px',
                            overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)',
                          }}
                          className="group"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.preview} alt={`Reference: ${img.name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{
                            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: 0, transition: 'opacity 0.2s',
                          }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '0'; }}
                          >
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                              style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                              }}
                              aria-label={`Remove ${img.name}`}
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Error */}
                {submitError && (
                  <div data-animate style={{
                    display: 'flex', padding: '14px 16px', borderRadius: '14px',
                    background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)',
                  }} role="alert">
                    <p style={{ fontSize: '0.8125rem', fontWeight: 300, color: 'rgba(248,113,113,0.9)' }}>{submitError}</p>
                  </div>
                )}

                {/* Submit */}
                <div data-animate className="pt-1">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button className="btn-prev" type="button" onClick={() => handlePrev(3)}>
                        <ArrowLeft /> Previous
                      </button>
                      <button className="btn-submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          <>Submit Brief <ArrowRight /></>
                        )}
                      </button>
                    </div>
                    <p style={{ marginTop: '16px', fontSize: '0.7rem', fontWeight: 300, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.04em' }}>
                      We typically respond within 24 hours
                    </p>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

/* ── Small helpers ─────────────────────────────────────────────── */

function StepCounter({ step, total }: { step: number; total: number }) {
  return (
    <div data-animate style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
      <div style={{
        width: '28px', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.6))',
      }} />
      <span style={{
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'rgba(168,85,247,0.65)',
      }}>
        {String(step).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}
