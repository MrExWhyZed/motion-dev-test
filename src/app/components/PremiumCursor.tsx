'use client';

import { useEffect, useRef } from 'react';
import type React from 'react';

/**
 * PremiumCursor — Luxury multi-layer animated cursor for MotionGrace
 *
 * Layers (back to front):
 *  1. Aura     — 140px soft gold diffuse glow, ultra-smooth lerp
 *  2. Trail    — 6 micro-dots with staggered lag
 *  3. Ring     — 36px gold ring, lerps with trailing; morphs per hover state
 *  4. Icon     — SVG icon inside ring (▶ play for video, ↗ arrow for links)
 *  5. Dot      — 6px sharp gold dot, instant snap, hides on hover
 *  6. Label    — text tag floats beside ring for data-cursor-label elements
 *  + Ripple    — burst circle spawned on each click (self-destructs)
 *
 * Hover states:
 *  default  → gold ring + dot + trail
 *  link     → expands to 48px, blue tint, arrow icon
 *  button   → expands to 60px, gold bg fill
 *  video    → expands to 80px, white border, slow spin, ▶ icon
 *  text     → collapses to thin vertical bar
 *  image    → expands to 64px, dashed border
 */

type HoverType = 'default' | 'link' | 'text' | 'video' | 'button' | 'image';

export default function PremiumCursor() {
  const dotRef    = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const auraRef   = useRef<HTMLDivElement>(null);
  const iconRef   = useRef<HTMLDivElement>(null);
  const labelRef  = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;

    let mounted = true;
    let doCleanup = () => {};

    void (async () => {
      const { gsap } = await import('gsap');
      if (!mounted) return;

      const dot    = dotRef.current;
      const ring   = ringRef.current;
      const aura   = auraRef.current;
      const icon   = iconRef.current;
      const label  = labelRef.current;
      const trails = trailRefs.current;
      if (!dot || !ring || !aura || !icon || !label) return;

      // ── Hide native cursor globally ─────────────────────────────────────
      const styleEl = document.createElement('style');
      styleEl.textContent = `*, *::before, *::after { cursor: none !important; }`;
      document.head.appendChild(styleEl);

      // ── Position state ──────────────────────────────────────────────────
      const mouse    = { x: -300, y: -300 };
      const ringPos  = { x: -300, y: -300 };
      const auraPos  = { x: -300, y: -300 };
      const trailPos = trails.map(() => ({ x: -300, y: -300 }));

      let hoverType: HoverType = 'default';
      let isHovering  = false;
      let isDown      = false;
      let isVisible   = false;
      let ringW       = 36;
      let spinTween: gsap.core.Tween | null = null;

      const RING_LERP  = 0.13;
      const AURA_LERP  = 0.055;
      const TRAIL_LERP = [0.28, 0.22, 0.17, 0.13, 0.09, 0.065];

      // ── rAF loop ────────────────────────────────────────────────────────
      let rafId: number;
      const tick = () => {
        const hw = ringW / 2;

        dot.style.transform  = `translate(${mouse.x - 3}px,${mouse.y - 3}px)`;

        ringPos.x += (mouse.x - ringPos.x) * RING_LERP;
        ringPos.y += (mouse.y - ringPos.y) * RING_LERP;
        ring.style.transform  = `translate(${ringPos.x - hw}px,${ringPos.y - hw}px)`;
        icon.style.transform  = `translate(${ringPos.x - hw}px,${ringPos.y - hw}px)`;
        label.style.transform = `translate(${ringPos.x + hw + 10}px,${ringPos.y - 8}px)`;

        auraPos.x += (mouse.x - auraPos.x) * AURA_LERP;
        auraPos.y += (mouse.y - auraPos.y) * AURA_LERP;
        aura.style.transform = `translate(${auraPos.x - 70}px,${auraPos.y - 70}px)`;

        let px = mouse.x, py = mouse.y;
        for (let i = 0; i < trails.length; i++) {
          trailPos[i].x += (px - trailPos[i].x) * TRAIL_LERP[i];
          trailPos[i].y += (py - trailPos[i].y) * TRAIL_LERP[i];
          trails[i].style.transform = `translate(${trailPos[i].x - 2}px,${trailPos[i].y - 2}px)`;
          px = trailPos[i].x; py = trailPos[i].y;
        }

        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);

      // ── Show cursor on first move ───────────────────────────────────────
      const showCursor = () => {
        if (isVisible) return;
        isVisible = true;
        gsap.to([dot, ring, aura], { opacity: 1, duration: 0.5, ease: 'power2.out' });
        gsap.to(trails, { opacity: 1, duration: 0.4, stagger: 0.04, ease: 'power2.out' });
      };

      // ── Ripple burst on click ───────────────────────────────────────────
      const spawnRipple = (x: number, y: number) => {
        const r = document.createElement('div');
        r.style.cssText = [
          'position:fixed;top:0;left:0;',
          'width:40px;height:40px;border-radius:50%;',
          'border:1px solid rgba(74,158,255,0.72);',
          'pointer-events:none;z-index:99993;',
          `transform:translate(${x - 20}px,${y - 20}px) scale(0);`,
          'will-change:transform,opacity;',
        ].join('');
        document.body.appendChild(r);
        gsap.to(r, {
          scale: 3.5, opacity: 0,
          duration: 0.7, ease: 'expo.out',
          onComplete: () => r.parentNode && r.parentNode.removeChild(r),
        });
      };

      // ── Get hover type ──────────────────────────────────────────────────
      const getType = (el: Element | null): HoverType => {
        if (!el) return 'default';
        const tag  = el.tagName.toLowerCase();
        const role = el.getAttribute('role') || '';
        const own  = el.getAttribute('data-cursor') as HoverType | null;
        if (own) return own;
        const anc = el.closest('[data-cursor]');
        if (anc) return (anc.getAttribute('data-cursor') as HoverType) || 'default';
        if (tag === 'video') return 'video';
        if (tag === 'a' || role === 'link') return 'link';
        if (tag === 'button' || role === 'button') return 'button';
        if (tag === 'input' || tag === 'textarea') return 'text';
        if (tag === 'img') return 'image';
        return 'default';
      };

      // ── Icons ───────────────────────────────────────────────────────────
      const ICONS: Record<HoverType, string> = {
        default: '',
        link:    `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="rgba(74,158,255,0.9)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="8 5 19 5 19 16"/></svg>`,
        button:  '',
        video:   `<svg viewBox="0 0 24 24" width="16" height="16" fill="rgba(255,255,255,0.92)"><polygon points="9,7 17,12 9,17"/></svg>`,
        text:    '',
        image:   `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="rgba(74,158,255,0.85)" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>`,
      };

      // ── Enter hover ─────────────────────────────────────────────────────
      const enterHover = (el: Element) => {
        isHovering = true;
        hoverType  = getType(el);
        const lbl  = el.getAttribute('data-cursor-label')
                  || el.closest('[data-cursor-label]')?.getAttribute('data-cursor-label')
                  || '';

        type RingCfg = { w: number; h?: number; br: string; border: string; bg: string; bStyle?: string };
        const cfgs: Record<HoverType, RingCfg> = {
          default: { w: 36, br: '50%',  border: 'rgba(74,158,255,0.65)', bg: 'transparent' },
          link:    { w: 48, br: '50%',  border: 'rgba(74,158,255,0.85)',  bg: 'rgba(74,158,255,0.06)' },
          button:  { w: 60, br: '50%',  border: 'rgba(74,158,255,0.85)', bg: 'rgba(74,158,255,0.07)' },
          video:   { w: 80, br: '50%',  border: 'rgba(255,255,255,0.85)', bg: 'rgba(255,255,255,0.05)' },
          text:    { w: 2,  h: 28, br: '2px', border: 'rgba(74,158,255,0.55)', bg: 'transparent' },
          image:   { w: 64, br: '50%',  border: 'rgba(74,158,255,0.55)', bg: 'transparent', bStyle: 'dashed' },
        };
        const c = cfgs[hoverType];
        ringW = c.w;

        gsap.to(ring, {
          width: c.w, height: c.h ?? c.w,
          borderRadius: c.br,
          borderColor: c.border,
          borderStyle: c.bStyle ?? 'solid',
          backgroundColor: c.bg,
          duration: 0.38, ease: 'expo.out',
        });

        gsap.to(dot,  { scale: 0, duration: 0.18, ease: 'power2.out' });
        gsap.to(aura, { scale: 1.55, opacity: 0.55, duration: 0.5, ease: 'power2.out' });

        if (ICONS[hoverType]) {
          icon.innerHTML = ICONS[hoverType];
          icon.style.width  = `${c.w}px`;
          icon.style.height = `${c.h ?? c.w}px`;
          gsap.fromTo(icon, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.32, ease: 'back.out(2.5)' });
        } else {
          gsap.to(icon, { opacity: 0, duration: 0.12 });
        }

        if (lbl) {
          label.textContent = lbl;
          gsap.fromTo(label, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' });
        }

        if (hoverType === 'video' && !spinTween) {
          spinTween = gsap.to(ring, { rotation: 360, repeat: -1, duration: 4.5, ease: 'none' });
        }

        gsap.to(trails, { opacity: 0, duration: 0.18 });
      };

      // ── Leave hover ─────────────────────────────────────────────────────
      const leaveHover = () => {
        isHovering = false;
        hoverType  = 'default';
        ringW      = 36;

        if (spinTween) {
          spinTween.kill();
          spinTween = null;
          gsap.to(ring, { rotation: 0, duration: 0.3, ease: 'power2.out' });
        }

        gsap.to(ring, {
          width: 36, height: 36,
          borderRadius: '50%',
          borderColor: 'rgba(74,158,255,0.65)',
          borderStyle: 'solid',
          backgroundColor: 'transparent',
          duration: 0.42, ease: 'expo.out',
        });

        gsap.to(dot,   { scale: 1,   duration: 0.28, ease: 'back.out(2)' });
        gsap.to(aura,  { scale: 1,   opacity: 0.3,   duration: 0.4,  ease: 'power2.out' });
        gsap.to(icon,  { opacity: 0, scale: 0.6,     duration: 0.18, ease: 'power2.in',
          onComplete: () => { icon.innerHTML = ''; } });
        gsap.to(label, { opacity: 0, duration: 0.15 });
        gsap.to(trails, { opacity: 1, duration: 0.35, stagger: 0.04 });
      };

      // ── Events ──────────────────────────────────────────────────────────
      const onMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        showCursor();
      };

      const onOver = (e: MouseEvent) => {
        const el = (e.target as Element).closest(
          'a, button, [role="button"], [role="link"], input, textarea, video, [data-cursor]'
        );
        if (el && !isHovering)  enterHover(el);
        if (!el && isHovering)  leaveHover();
      };

      const onOut = (e: MouseEvent) => {
        if (!e.relatedTarget) leaveHover();
      };

      const onDown = (e: MouseEvent) => {
        isDown = true;
        spawnRipple(e.clientX, e.clientY);
        gsap.to(ring, { scale: 0.75, duration: 0.1,  ease: 'power3.out' });
        gsap.to(dot,  { scale: 3,    opacity: 0.25,   duration: 0.1 });
        gsap.to(aura, { scale: 0.8,  opacity: 0.75,   duration: 0.1 });
      };

      const onUp = () => {
        if (!isDown) return;
        isDown = false;
        gsap.to(ring, { scale: 1, duration: 0.6, ease: 'elastic.out(1.1, 0.42)' });
        gsap.to(dot,  { scale: isHovering ? 0 : 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' });
        gsap.to(aura, { scale: isHovering ? 1.55 : 1, opacity: isHovering ? 0.55 : 0.3, duration: 0.4, ease: 'power2.out' });
      };

      const onLeave = () => gsap.to([dot, ring, aura, icon, label, ...trails], { opacity: 0, duration: 0.3 });
      const onEnter = () => { if (isVisible) gsap.to([dot, ring, aura, ...trails], { opacity: 1, duration: 0.3 }); };

      document.addEventListener('mousemove',  onMove,  { passive: true });
      document.addEventListener('mouseover',  onOver,  { passive: true });
      document.addEventListener('mouseout',   onOut,   { passive: true });
      document.addEventListener('mousedown',  onDown);
      document.addEventListener('mouseup',    onUp);
      document.addEventListener('mouseleave', onLeave);
      document.addEventListener('mouseenter', onEnter);

      doCleanup = () => {
        cancelAnimationFrame(rafId);
        document.removeEventListener('mousemove',  onMove);
        document.removeEventListener('mouseover',  onOver);
        document.removeEventListener('mouseout',   onOut);
        document.removeEventListener('mousedown',  onDown);
        document.removeEventListener('mouseup',    onUp);
        document.removeEventListener('mouseleave', onLeave);
        document.removeEventListener('mouseenter', onEnter);
        spinTween?.kill();
        if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
      };
    })();

    return () => {
      mounted = false;
      doCleanup();
    };
  }, []);

  const base: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0,
    pointerEvents: 'none', willChange: 'transform',
  };

  return (
    <>
      {/* Aura */}
      <div ref={auraRef} aria-hidden="true" style={{
        ...base, width: 140, height: 140, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74,158,255,0.13) 0%, rgba(74,158,255,0.05) 45%, transparent 68%)',
        zIndex: 99994, opacity: 0, mixBlendMode: 'screen',
      }} />

      {/* Trail dots */}
      {[0,1,2,3,4,5].map(i => (
        <div key={i} ref={el => { if (el) trailRefs.current[i] = el; }} aria-hidden="true" style={{
          ...base,
          width:  Math.max(1.2, 4 - i * 0.45),
          height: Math.max(1.2, 4 - i * 0.45),
          borderRadius: '50%',
          background: `rgba(74,158,255,${Math.max(0.08, 0.52 - i * 0.08)})`,
          zIndex: 99995, opacity: 0,
        }} />
      ))}

      {/* Ring */}
      <div ref={ringRef} aria-hidden="true" style={{
        ...base, width: 36, height: 36, borderRadius: '50%',
        border: '1.5px solid rgba(74,158,255,0.65)',
        zIndex: 99997, opacity: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 16px rgba(74,158,255,0.12), inset 0 0 10px rgba(74,158,255,0.04)',
      }} />

      {/* Icon (same position as ring, layered above) */}
      <div ref={iconRef} aria-hidden="true" style={{
        ...base, width: 36, height: 36,
        zIndex: 99998, opacity: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }} />

      {/* Dot */}
      <div ref={dotRef} aria-hidden="true" style={{
        ...base, width: 6, height: 6, borderRadius: '50%',
        background: '#4A9EFF',
        zIndex: 99999, opacity: 0,
        boxShadow: '0 0 8px rgba(74,158,255,0.95), 0 0 22px rgba(74,158,255,0.45)',
      }} />

      {/* Label */}
      <div ref={labelRef} aria-hidden="true" style={{
        ...base, zIndex: 100000, opacity: 0,
        fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'rgba(74,158,255,0.92)',
        fontFamily: 'var(--font-inter), sans-serif', whiteSpace: 'nowrap',
        textShadow: '0 0 14px rgba(74,158,255,0.55)',
      }} />
    </>
  );
}
