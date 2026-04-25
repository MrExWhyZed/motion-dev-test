'use client';

import { useRef, useState, useCallback } from 'react';
import type {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from 'react-hook-form';
import type { User } from '@supabase/supabase-js';
import type { FormValues } from './AddProjectClient';

interface ProjectFormProps {
  register: UseFormRegister<FormValues>;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  errors: FieldErrors<FormValues>;
  onSubmit: (data: FormValues) => Promise<void>;
  isSubmitting: boolean;
  submitError: string;
  user: User | null;
  handleInputFocus: (el: HTMLElement | null) => void;
  handleInputBlur: (el: HTMLElement | null) => void;
}

const PROJECT_TYPES = [
  { value: '', label: 'Select project type' },
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
  { value: '', label: 'Select budget range' },
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-15k', label: '$5,000 — $15,000' },
  { value: '15k-50k', label: '$15,000 — $50,000' },
  { value: '50k-100k', label: '$50,000 — $100,000' },
  { value: 'over-100k', label: 'Over $100,000' },
  { value: 'discuss', label: "Let\'s discuss" },
];

const inputBaseStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.12)',
  outline: 'none',
  color: '#ffffff',
  width: '100%',
  fontSize: '0.9375rem',
  fontWeight: 300,
  letterSpacing: '0.01em',
  padding: '12px 0',
  fontFamily: 'inherit',
  transition: 'border-color 0.3s ease',
  borderRadius: 0,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.6875rem',
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.35)',
  marginBottom: '10px',
};

const errorStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#f87171',
  marginTop: '6px',
  letterSpacing: '0.02em',
  fontWeight: 300,
};

interface ReferenceImage {
  id: string;
  file: File;
  preview: string;
  name: string;
}

export default function ProjectForm({
  register,
  handleSubmit,
  errors,
  onSubmit,
  isSubmitting,
  submitError,
  user,
  handleInputFocus,
  handleInputBlur,
}: ProjectFormProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleButtonHover = async (entering: boolean) => {
    const { gsap } = await import('gsap');
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      scale: entering && !isSubmitting ? 1.02 : 1,
      duration: 0.25,
      ease: 'power2.out',
    });
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addImages(e.dataTransfer.files);
  }, [addImages]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* User context strip */}
      {user && (
        <div
          data-field
          className="flex items-center gap-3 mb-6 pb-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium"
            style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#ffffff' }}
            aria-hidden="true"
          >
            {user.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-light" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}>
              Logged in as
            </span>
            <span className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.8)', letterSpacing: '0.01em' }}>
              {user.email}
            </span>
          </div>
          <div className="ml-auto">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.18)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#a855f7' }} aria-hidden="true" />
              <span className="text-xs font-light" style={{ color: 'rgba(168,85,247,0.85)', letterSpacing: '0.04em' }}>
                Unlocked
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Section: Contact */}
        <div data-field>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="text-xs font-medium tracking-[0.18em] uppercase"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              01
            </span>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <span
              className="text-xs font-medium tracking-[0.14em] uppercase"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              Contact
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="project-name" style={labelStyle}>Full Name</label>
              <input
                id="project-name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                style={inputBaseStyle}
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
                {...register('name', {
                  required: 'Your name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
                onFocus={(e) => handleInputFocus(e.currentTarget)}
                onBlur={(e) => handleInputBlur(e.currentTarget)}
              />
              {errors.name && (
                <p id="name-error" style={errorStyle} role="alert">{errors.name.message}</p>
              )}
            </div>
            {/* Email */}
            <div>
              <label htmlFor="project-email" style={labelStyle}>Email Address</label>
              <input
                id="project-email"
                type="email"
                placeholder="you@studio.com"
                autoComplete="email"
                style={inputBaseStyle}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email', {
                  required: 'Email address is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
                })}
                onFocus={(e) => handleInputFocus(e.currentTarget)}
                onBlur={(e) => handleInputBlur(e.currentTarget)}
              />
              {errors.email && (
                <p id="email-error" style={errorStyle} role="alert">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section: Project */}
        <div data-field>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-medium tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>02</span>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <span className="text-xs font-medium tracking-[0.14em] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>Project</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Project Type */}
            <div>
              <label htmlFor="project-type" style={labelStyle}>Project Type</label>
              <select
                id="project-type"
                style={{
                  ...inputBaseStyle,
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.25)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 4px center',
                  paddingRight: '24px',
                }}
                {...register('project_type')}
                onFocus={(e) => handleInputFocus(e.currentTarget)}
                onBlur={(e) => handleInputBlur(e.currentTarget)}
              >
                {PROJECT_TYPES.map((type) => (
                  <option key={`type-${type.value || 'placeholder'}`} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            {/* Budget */}
            <div>
              <label htmlFor="project-budget" style={labelStyle}>Budget Range</label>
              <select
                id="project-budget"
                style={{
                  ...inputBaseStyle,
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.25)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 4px center',
                  paddingRight: '24px',
                }}
                {...register('budget')}
                onFocus={(e) => handleInputFocus(e.currentTarget)}
                onBlur={(e) => handleInputBlur(e.currentTarget)}
              >
                {BUDGET_RANGES.map((range) => (
                  <option key={`budget-${range.value || 'placeholder'}`} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section: Brief */}
        <div data-field>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-medium tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>03</span>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <span className="text-xs font-medium tracking-[0.14em] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>Brief</span>
          </div>
          <label htmlFor="project-description" style={labelStyle}>Project Vision</label>
          <textarea
            id="project-description"
            rows={3}
            placeholder="Describe your vision, creative direction, timeline, and any references that inspire you..."
            style={{
              ...inputBaseStyle,
              resize: 'none',
              borderBottom: 'none',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '14px 16px',
              lineHeight: '1.75',
              transition: 'border-color 0.3s ease',
            }}
            aria-invalid={errors.description ? 'true' : 'false'}
            aria-describedby={errors.description ? 'desc-error' : undefined}
            {...register('description', {
              required: 'Please describe your project',
              minLength: { value: 20, message: 'Please provide at least 20 characters' },
            })}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          />
          {errors.description && (
            <p id="desc-error" style={errorStyle} role="alert">{errors.description.message}</p>
          )}
        </div>

        {/* Section: Reference Images */}
        <div data-field>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-medium tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>04</span>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <span className="text-xs font-medium tracking-[0.14em] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>References</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <label style={labelStyle}>Reference Images</label>
            <span
              className="text-xs font-light"
              style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.02em' }}
            >
              {referenceImages.length}/6 uploaded
            </span>
          </div>

          {/* Drop Zone */}
          <div
            ref={dropZoneRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className="relative cursor-pointer rounded-[14px] transition-all duration-300"
            style={{
              border: isDragging
                ? '1px dashed rgba(168,85,247,0.5)'
                : '1px dashed rgba(255,255,255,0.1)',
              background: isDragging
                ? 'rgba(168,85,247,0.05)'
                : 'rgba(255,255,255,0.02)',
              padding: '28px 20px',
              textAlign: 'center',
            }}
            role="button"
            aria-label="Upload reference images"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
          >
            {/* Upload icon */}
            <div className="flex justify-center mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: isDragging ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.04)',
                  border: isDragging ? '1px solid rgba(168,85,247,0.25)' : '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s ease',
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isDragging ? 'rgba(168,85,247,0.8)' : 'rgba(255,255,255,0.35)'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
            </div>
            <p
              className="text-sm font-light mb-1"
              style={{ color: isDragging ? 'rgba(168,85,247,0.9)' : 'rgba(255,255,255,0.45)', letterSpacing: '0.01em' }}
            >
              {isDragging ? 'Drop to upload' : 'Drag & drop or click to browse'}
            </p>
            <p
              className="text-xs font-light"
              style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.02em' }}
            >
              PNG, JPG, WEBP — up to 6 images
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              aria-hidden="true"
              onChange={(e) => { if (e.target.files) addImages(e.target.files); e.target.value = ''; }}
            />
          </div>

          {/* Image Previews */}
          {referenceImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {referenceImages.map((img) => (
                <div
                  key={img.id}
                  className="relative group rounded-[10px] overflow-hidden"
                  style={{
                    aspectRatio: '4/3',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.preview}
                    alt={`Reference: ${img.name}`}
                    className="w-full h-full object-cover"
                    style={{ display: 'block' }}
                  />
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'rgba(0,0,0,0.6)' }}
                  >
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        background: 'rgba(248,113,113,0.15)',
                        border: '1px solid rgba(248,113,113,0.3)',
                      }}
                      aria-label={`Remove ${img.name}`}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  {/* File name tooltip */}
                  <div
                    className="absolute bottom-0 left-0 right-0 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}
                  >
                    <p
                      className="text-xs font-light truncate"
                      style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.01em' }}
                    >
                      {img.name}
                    </p>
                  </div>
                </div>
              ))}
              {/* Add more slot */}
              {referenceImages.length < 6 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-[10px] flex items-center justify-center transition-all duration-200"
                  style={{
                    aspectRatio: '4/3',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px dashed rgba(255,255,255,0.08)',
                  }}
                  role="button"
                  aria-label="Add more images"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(168,85,247,0.3)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit error */}
        {submitError && (
          <div
            data-field
            className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
            style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}
            role="alert"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(248,113,113,0.9)', letterSpacing: '0.01em' }}>
              {submitError}
            </p>
          </div>
        )}

        {/* Submit button */}
        <div data-field className="pt-2">
          <button
            ref={buttonRef}
            type="submit"
            disabled={isSubmitting}
            onMouseEnter={() => handleButtonHover(true)}
            onMouseLeave={() => handleButtonHover(false)}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-full text-sm font-medium tracking-[0.05em] transition-all duration-200"
            style={{
              background: isSubmitting ? 'rgba(255,255,255,0.65)' : '#ffffff',
              color: '#080808',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              willChange: 'transform',
              boxShadow: isSubmitting ? 'none' : '0 8px 32px rgba(255,255,255,0.1)',
              letterSpacing: '0.04em',
            }}
            aria-label={isSubmitting ? 'Submitting project brief...' : 'Submit project brief'}
          >
            {isSubmitting ? (
              <>
                <SpinnerIcon />
                Submitting your brief...
              </>
            ) : (
              <>
                Submit Project Brief
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
          <p
            className="text-center text-xs font-light mt-3"
            style={{ color: 'rgba(255,255,255,0.18)', letterSpacing: '0.02em' }}
          >
            We typically respond within 24 hours with an initial assessment
          </p>
        </div>
      </div>
    </form>
  );
}

function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}