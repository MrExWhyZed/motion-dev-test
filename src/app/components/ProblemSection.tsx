'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ─────────────── data ─────────────── */

const problemWords = [
  { text: 'Your', accent: false },
  { text: 'product', accent: false },
  { text: 'shoots', accent: false },
  { text: 'take', accent: false },
  { text: '6 weeks.', accent: true },
  { text: 'Cost you', accent: false },
  { text: '$80,000.', accent: true },
  { text: 'Deliver', accent: false },
  { text: '20 assets.', accent: true },
  { text: 'And go', accent: false },
  { text: 'out of date', accent: false },
  { text: 'in months.', accent: true },
];

const painPoints = [
  { label: 'Studio rental', value: '$4,200/day', color: '#ff6b6b' },
  { label: 'Photographer fees', value: '$8,000+', color: '#ffa94d' },
  { label: 'Reshoots & revisions', value: 'Endless', color: '#ff6b6b' },
  { label: 'Final asset count', value: '≈20 images', color: '#ffa94d' },
];

const revealLines = [
  { words: ['There', 'is', 'a'], type: 'plain' as const },
  { words: ['Better', 'Way.'], type: 'highlight' as const },
  { words: ['Try', 'MotionGrace.'], type: 'brand' as const },
];

const STORY_BEATS = [
  {
    eyebrow: 'Our Role',
    headline: 'The invisible\nCGI powerhouse.',
    body: 'We act as the invisible CGI powerhouse behind leading creative agencies and modern brands — taking the friction out of high-end production, transforming conceptual ideas into stunning visual experiences.',
    accent: '#C9A96E',
  },
  {
    eyebrow: 'What We Craft',
    headline: 'Every frame,\nengineered.',
    body: 'By crafting high-fidelity CGI product animations and design-driven narratives, we deliver scalable assets that transcend the limits of traditional photography. Cinematic storytelling fused with absolute product-focused precision.',
    accent: '#8B7FD4',
  },
  {
    eyebrow: 'Why It Matters',
    headline: 'Motion.\nEmotion.\nInteractivity.',
    body: 'Today\'s brands need more than visuals. Our CGI and 3D solutions allow products to be seen, felt, and explored from every angle — directly driving stronger engagement and measurable sales impact.',
    accent: '#4A9EFF',
  },
  {
    eyebrow: 'Our Promise',
    headline: 'Imagination\nmade precise.',
    body: 'From luxurious product commercials to immersive interactive CGI, Motion Grace merges artistic vision with cutting-edge technology — ensuring modern brands stand out in a crowded market.',
    accent: '#C9A96E',
  },
];

const SHAPES = [
  { size: 90,  x: 12,  y: 20, rotX: 25,  rotY: 40,  speed: 18, depth: 'far',  opacity: 0.12, color: 0 },
  { size: 60,  x: 80,  y: 15, rotX: -15, rotY: 55,  speed: 22, depth: 'far',  opacity: 0.10, color: 1 },
  { size: 110, x: 70,  y: 60, rotX: 35,  rotY: -20, speed: 26, depth: 'mid',  opacity: 0.15, color: 2 },
  { size: 45,  x: 25,  y: 72, rotX: -40, rotY: 30,  speed: 20, depth: 'mid',  opacity: 0.13, color: 0 },
  { size: 75,  x: 50,  y: 40, rotX: 20,  rotY: -50, speed: 30, depth: 'near', opacity: 0.18, color: 1 },
  { size: 55,  x: 88,  y: 78, rotX: -25, rotY: 15,  speed: 16, depth: 'near', opacity: 0.14, color: 2 },
  { size: 38,  x: 6,   y: 50, rotX: 50,  rotY: -35, speed: 24, depth: 'far',  opacity: 0.09, color: 0 },
  { size: 82,  x: 42,  y: 85, rotX: -10, rotY: 60,  speed: 19, depth: 'mid',  opacity: 0.12, color: 1 },
  { size: 48,  x: 62,  y: 30, rotX: 30,  rotY: -45, speed: 28, depth: 'near', opacity: 0.16, color: 2 },
  { size: 66,  x: 18,  y: 88, rotX: -35, rotY: 25,  speed: 21, depth: 'far',  opacity: 0.11, color: 0 },
  { size: 94,  x: 90,  y: 45, rotX: 15,  rotY: -65, speed: 17, depth: 'mid',  opacity: 0.13, color: 1 },
  { size: 52,  x: 35,  y: 10, rotX: -20, rotY: 45,  speed: 23, depth: 'near', opacity: 0.17, color: 2 },
];

const ACCENTS = ['#C9A96E', '#8B7FD4', '#4A9EFF'];

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/*
 * Architecture:
 *
 * Screen 1  — normal flow, min-height 100vh
 *
 * Combined  — ONE tall section = 340vh (s2) + 880vh (s3) = 1220vh
 *   Inside it, two sticky divs stacked at the same viewport position:
 *     • Screen 2 sticky  z-index:1  fades OUT when arrowRaw ≥ 0.99
 *     • Screen 3 sticky  z-index:2  fades IN  simultaneously
 *   The second sticky uses marginTop: -100vh to sit exactly on top.
 *   Both are driven by a single scroll calculation over the full 1220vh.
 */
const SCREEN2_VH  = 340;
const STORY_VH    = STORY_BEATS.length * 220; // 880
const TOTAL_VH    = SCREEN2_VH + STORY_VH;   // 1220
const S2_FRAC     = SCREEN2_VH / TOTAL_VH;
const S3_FRAC     = STORY_VH   / TOTAL_VH;

export default function ProblemSection() {
  const screen1Ref   = useRef<HTMLElement>(null);
  const combinedRef  = useRef<HTMLElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const mouseRef     = useRef({ x: 0.5, y: 0.5 });
  const rafRef       = useRef<number>(0);
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const s2RevealRef  = useRef<HTMLDivElement>(null);

  /* Screen 1 */
  const [visibleLines, setVisibleLines] = useState<boolean[]>(new Array(problemWords.length).fill(false));
  const [distortLevel, setDistortLevel] = useState(0);

  /* Screen 2 */
  const [wordProgress, setWordProgress]   = useState(0);
  const [glowPulse, setGlowPulse]         = useState(false);
  const [arrowFill, setArrowFill]         = useState(0);
  const [arrowDone, setArrowDone]         = useState(false);
  const [transitionOut, setTransitionOut] = useState(false);

  /* Screen 3 */
  const [storyProgress, setStoryProgress] = useState(0);

  /* Mouse */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  /* Canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0, h = 0;
    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const drawCube = (cx: number, cy: number, size: number, rotX: number, rotY: number, opacity: number, accent: string) => {
      const s = size / 2;
      const rxi = rotX * Math.PI / 180, ryi = rotY * Math.PI / 180;
      const cos = Math.cos, sin = Math.sin;
      const project = (px: number, py: number, pz: number): [number, number] => {
        const x1 = px * cos(ryi) + pz * sin(ryi);
        const z1 = -px * sin(ryi) + pz * cos(ryi);
        const y2 = py * cos(rxi) - z1 * sin(rxi);
        const z2 = py * sin(rxi) + z1 * cos(rxi);
        const sc = 500 / (500 + z2 + 200);
        return [cx + x1 * sc, cy + y2 * sc];
      };
      const v: [number,number,number][] = [[-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],[-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s]];
      const faces = [[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[0,3,7,4],[1,2,6,5]];
      const brightness = [0.55, 1.0, 0.65, 0.45, 0.75, 0.38];
      faces.forEach((face, fi) => {
        const pts = face.map(vi => project(...v[vi]));
        ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.closePath();
        const a0 = Math.round(opacity * brightness[fi] * 0.55 * 255).toString(16).padStart(2,'0');
        const a1 = Math.round(opacity * brightness[fi] * 0.12 * 255).toString(16).padStart(2,'0');
        const grd = ctx.createLinearGradient(pts[0][0], pts[0][1], pts[2][0], pts[2][1]);
        grd.addColorStop(0, `${accent}${a0}`); grd.addColorStop(1, `${accent}${a1}`);
        ctx.fillStyle = grd; ctx.fill();
        ctx.strokeStyle = `${accent}${Math.round(opacity * 0.5 * 255).toString(16).padStart(2,'0')}`;
        ctx.lineWidth = 0.7; ctx.stroke();
      });
    };

    const animate = (ts: number) => {
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      SHAPES.forEach((shape, i) => {
        const t = ts / 1000, dFar = shape.depth === 'far', dMid = shape.depth === 'mid';
        const mx2 = dFar ? 8 : dMid ? 20 : 40, my2 = dFar ? 6 : dMid ? 15 : 30;
        const px = (shape.x / 100) * w + Math.sin(t / shape.speed + i) * 30 + (mx - 0.5) * mx2;
        const py = (shape.y / 100) * h + Math.cos(t / shape.speed + i * 1.3) * 20 + (my - 0.5) * my2;
        const rotX = shape.rotX + Math.sin(t / (shape.speed * 0.8) + i) * 15 + (my - 0.5) * 25;
        const rotY = shape.rotY + Math.cos(t / (shape.speed * 0.9) + i * 0.7) * 20 + (mx - 0.5) * 30;
        drawCube(px, py, shape.size, rotX, rotY, shape.opacity, ACCENTS[shape.color]);
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  /* Screen 2 — word reveal driven by wordProgress (sticky-safe) */
  useEffect(() => {
    const block = s2RevealRef.current;
    if (!block) return;
    const wordEls = block.querySelectorAll<HTMLSpanElement>('.s2-reveal-word');
    // Spread reveal across first 55% of wordProgress so all words light up
    // well before the arrow/transition phase kicks in.
    const revealProgress = Math.max(0, Math.min(1, wordProgress / 0.55));
    const activeCount = Math.floor(revealProgress * wordEls.length);
    wordEls.forEach((w, i) =>
      i < activeCount ? w.classList.add('s2-active') : w.classList.remove('s2-active')
    );
  }, [wordProgress]);

  /* Unified scroll handler */
  const handleScroll = useCallback(() => {
    if (screen1Ref.current) {
      const rect = screen1Ref.current.getBoundingClientRect();
      const prog = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
      setVisibleLines(problemWords.map((_, i) => prog > (i / problemWords.length) * 0.7));
      setDistortLevel(Math.min(prog * 1.5, 1));
    }

    if (combinedRef.current) {
      const rect     = combinedRef.current.getBoundingClientRect();
      const vh       = window.innerHeight;
      const total    = combinedRef.current.offsetHeight - vh;
      const scrolled = -rect.top;
      const raw      = Math.max(0, Math.min(1, total > 0 ? scrolled / total : 0));

      /* ── Screen 2: raw 0 → S2_FRAC ── */
      const s2Raw  = Math.max(0, Math.min(1, raw / S2_FRAC));
      const wp     = Math.max(0, Math.min(1, s2Raw * 2));
      setWordProgress(wp);

      if (wp > 0.92) {
        if (glowTimerRef.current === null)
          glowTimerRef.current = setTimeout(() => setGlowPulse(true), 400);
      } else {
        if (glowTimerRef.current !== null) { clearTimeout(glowTimerRef.current); glowTimerRef.current = null; }
        setGlowPulse(false);
      }

      const arrowRaw = Math.max(0, Math.min(1, (s2Raw - 0.5) * 2));
      setArrowFill(arrowRaw);

      if (arrowRaw >= 0.99) { setArrowDone(true); setTransitionOut(true); }
      else if (arrowRaw < 0.92) { setArrowDone(false); setTransitionOut(false); }

      /* ── Screen 3: raw S2_FRAC → 1 ── */
      const s3Raw = Math.max(0, Math.min(1, (raw - S2_FRAC) / S3_FRAC));
      setStoryProgress(s3Raw);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (glowTimerRef.current !== null) clearTimeout(glowTimerRef.current);
    };
  }, [handleScroll]);

  /* Screen 3 derived */
  const BEAT_COUNT = STORY_BEATS.length;
  const BEAT_SLICE = 1 / BEAT_COUNT;
  const activeBeat = Math.min(BEAT_COUNT - 1, Math.floor(storyProgress / BEAT_SLICE));
  const localRaw   = Math.max(0, Math.min(1, (storyProgress - activeBeat * BEAT_SLICE) / BEAT_SLICE));
  const localP     = easeOutExpo(localRaw);
  const prevBeat   = activeBeat - 1;
  const beat       = STORY_BEATS[activeBeat];
  const prev       = prevBeat >= 0 ? STORY_BEATS[prevBeat] : null;
  const headlineLines     = beat.headline.split('\n');
  const prevHeadlineLines = prev ? prev.headline.split('\n') : [];
  const counterProgress   = (activeBeat + localP) / BEAT_COUNT;

  return (
    <>
      {/* ═══ SCREEN 1 ═══ */}
      <section
        ref={screen1Ref}
        className="relative overflow-hidden flex flex-col justify-center px-6 sm:px-10"
        style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #04040A 0%, #080810 50%, #0A0508 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          opacity: 0.04 + distortLevel * 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px', animation: 'noise-shift 0.5s steps(3) infinite',
        }} />
        <div className="relative z-10 w-full py-20" style={{ maxWidth: '96vw', margin: '0 auto' }}>
          <div className="mb-8 flex items-center gap-3" style={{
            opacity: distortLevel > 0.1 ? 1 : 0,
            transform: `translateY(${distortLevel > 0.1 ? 0 : 16}px)`,
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ff6b6b', boxShadow: '0 0 8px rgba(255,80,80,0.8)', animation: 'flicker-dot 1.8s ease-in-out infinite' }} />
            <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,107,107,0.6)' }}>The Reality Check</span>
          </div>
          <div className="mb-12" style={{ lineHeight: 1.05 }}>
            {problemWords.map((word, i) => (
              <span key={i} style={{
                fontSize: 'clamp(2.8rem, 7.2vw, 7rem)', fontWeight: word.accent ? 800 : 300,
                letterSpacing: '-0.03em', color: word.accent ? '#ff6b6b' : 'rgba(237,233,227,0.88)',
                transform: visibleLines[i] ? 'translateY(0)' : 'translateY(110%)',
                opacity: visibleLines[i] ? 1 : 0,
                transition: `transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s, opacity 0.5s ease ${i * 0.06}s`,
                display: 'inline-block', textShadow: word.accent ? '0 0 40px rgba(255,80,80,0.4)' : 'none',
                filter: word.accent && distortLevel > 0.6 ? 'drop-shadow(0 0 8px rgba(255,80,80,0.55))' : 'none',
                animation: word.accent && distortLevel > 0.7 ? 'glitch-text 3s ease-in-out infinite' : 'none',
                marginRight: '0.25em',
              }}>{word.text}</span>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" style={{
            opacity: distortLevel > 0.4 ? 1 : 0,
            transform: `translateY(${distortLevel > 0.4 ? 0 : 24}px)`,
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.2s',
          }}>
            {painPoints.map((point, i) => (
              <div key={i} className="rounded-xl p-5 relative overflow-hidden" style={{
                background: 'rgba(255,80,80,0.03)', border: '1px solid rgba(255,80,80,0.1)',
                animation: `pain-flicker ${2 + i * 0.7}s ease-in-out infinite, widget-float ${6 + i * 1.1}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s, ${i * 0.7}s`, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}>
                <div className="text-[9px] tracking-widest uppercase mb-2" style={{ color: 'rgba(237,233,227,0.3)' }}>{point.label}</div>
                <div className="text-2xl font-bold" style={{ color: point.color, textShadow: `0 0 20px ${point.color}60`, animation: 'value-flicker 2.5s ease-in-out infinite', animationDelay: `${i * 0.3}s` }}>{point.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          COMBINED — Screen 2 + Screen 3 in one scroll container.
          Two sticky layers at identical viewport position;
          Screen 3 (z:2) fades in over Screen 2 (z:1).
      ═══════════════════════════════════════════════════ */}
      <section
        ref={combinedRef}
        style={{ height: `${TOTAL_VH}vh`, position: 'relative', background: 'transparent' }}
      >

        {/* ── Screen 2: fades OUT ── */}
        <div
          className="sticky top-0 overflow-hidden"
          style={{
            height: '100vh',
            background: '#050508',
            opacity: transitionOut ? 0 : 1,
            transition: 'opacity 1.1s cubic-bezier(0.4,0,0.2,1)',
            zIndex: 1,
          }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.6 }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, rgba(5,5,8,0.75) 100%)' }} />
          <div className="absolute pointer-events-none" style={{
            left: 0, right: 0, top: '50%', height: '1px',
            background: `linear-gradient(90deg, transparent 0%, rgba(201,169,110,0) 15%, rgba(201,169,110,${wordProgress * 0.18}) 35%, rgba(255,240,200,${wordProgress * 0.28}) 50%, rgba(201,169,110,${wordProgress * 0.18}) 65%, rgba(201,169,110,0) 85%, transparent 100%)`,
            transform: 'translateY(-50%)', transition: 'none', filter: `blur(${wordProgress > 0.5 ? 0 : 1}px)`,
          }} />
          <div className="absolute pointer-events-none" style={{
            width: '55vw', height: '45vh', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            background: `radial-gradient(ellipse 80% 70% at 50% 50%, rgba(201,169,110,${glowPulse ? 0.055 : wordProgress * 0.025}) 0%, transparent 70%)`,
            filter: 'blur(60px)', transition: glowPulse ? 'background 2s ease' : 'background 0.3s ease',
            animation: glowPulse ? 'subtle-bloom 5s ease-in-out infinite' : 'none',
          }} />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6" style={{ gap: 0 }}>

            {/* Eyebrow */}
            <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '20px', height: '1px', background: 'rgba(201,169,110,0.5)' }} />
              <span style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.7)', fontWeight: 700 }}>The Alternative</span>
              <div style={{ width: '20px', height: '1px', background: 'rgba(201,169,110,0.5)' }} />
            </div>

            {/* Scroll-driven headline */}
            <div ref={s2RevealRef} style={{ textAlign: 'center', maxWidth: '820px' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 5.5vw, 4.2rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, margin: 0 }}>
                {/* "There is a" — plain small */}
                {['There', 'is', 'a'].map((word, i) => (
                  <span key={`plain-${i}`} className="s2-reveal-word" style={{ marginRight: '0.25em' }}>{word} </span>
                ))}
                {/* "Better Way." — highlight large */}
                {['Better', 'Way.'].map((word, i) => (
                  <span key={`hl-${i}`} className="s2-reveal-word s2-highlight" style={{ marginRight: '0.22em' }}>{word} </span>
                ))}
                {/* line break */}
                <br />
                {/* "Try" — plain */}
                <span className="s2-reveal-word" style={{ marginRight: '0.28em' }}>Try </span>
                {/* "MotionGrace." — brand gradient */}
                <span className="s2-reveal-word s2-brand">MotionGrace.</span>
              </h2>
            </div>

            {/* Sub-label */}
            <div style={{ marginTop: '2.5rem' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.38)', fontWeight: 400 }}>AI-powered product visuals</span>
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: '44px', left: '50%', transform: 'translateX(-50%)',
            opacity: arrowDone ? 0 : wordProgress > 0.72 ? Math.min(1, (wordProgress - 0.72) * 4) : 0,
            transition: arrowDone ? 'opacity 0.5s ease' : 'opacity 0.8s ease',
            pointerEvents: 'none', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '8px', letterSpacing: '0.32em', textTransform: 'uppercase', color: `rgba(201,169,110,${0.2 + arrowFill * 0.3})`, fontWeight: 400 }}>scroll</span>
            <div style={{ position: 'relative', width: '1px', height: '52px', background: 'rgba(201,169,110,0.12)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: `${arrowFill * 100}%`, background: `rgba(201,169,110,${0.4 + arrowFill * 0.5})`, transition: 'height 0.06s linear', boxShadow: arrowFill > 0.7 ? '0 0 6px rgba(201,169,110,0.5)' : 'none' }} />
              <div style={{ position: 'absolute', bottom: '-3px', left: '50%', transform: 'translateX(-50%)', width: '3px', height: '3px', borderRadius: '50%', background: `rgba(201,169,110,${0.25 + arrowFill * 0.6})` }} />
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(5,5,8,0.7) 0%, transparent 18%, transparent 82%, rgba(5,5,8,0.7) 100%)' }} />
        </div>

        {/* ── Screen 3: fades IN over Screen 2 ── */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            marginTop: '-100vh', /* overlap exactly with Screen 2 */
            overflow: 'hidden',
            background: 'linear-gradient(160deg, #03030A 0%, #060610 60%, #080508 100%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'flex-start', padding: '0 8vw',
            opacity: transitionOut ? 1 : 0,
            transition: 'opacity 1.1s cubic-bezier(0.4,0,0.2,1)',
            zIndex: 2,
            pointerEvents: transitionOut ? 'auto' : 'none',
          }}
        >
          {/* Ambient top line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: `linear-gradient(90deg, transparent 0%, ${beat.accent}22 30%, ${beat.accent}55 50%, ${beat.accent}22 70%, transparent 100%)`,
            transition: 'background 1.2s ease',
          }} />

          {/* Beat counter rail */}
          <div style={{ position: 'absolute', right: '6vw', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            {STORY_BEATS.map((b, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: i === activeBeat ? 1 : 0.2, transition: 'opacity 0.6s ease' }}>
                <div style={{ width: i === activeBeat ? '2px' : '1px', height: i === activeBeat ? `${24 + localP * 20}px` : '14px', background: i === activeBeat ? b.accent : 'rgba(237,233,227,0.3)', transition: 'height 0.4s ease, background 0.6s ease, width 0.3s ease', borderRadius: '1px' }} />
                <span style={{ fontSize: '8px', letterSpacing: '0.2em', color: i === activeBeat ? b.accent : 'rgba(237,233,227,0.25)', fontWeight: 400, transition: 'color 0.6s ease' }}>{String(i + 1).padStart(2,'0')}</span>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div style={{ width: '100%', maxWidth: '820px', position: 'relative', minHeight: '55vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

            {/* Previous beat exits upward */}
            {prev && localP < 0.85 && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, opacity: Math.max(0, 1 - localP * 2), transform: `translateY(${-localP * 15}%)`, pointerEvents: 'none', transition: 'none' }}>
                <span style={{ display: 'block', fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: `${prev.accent}55`, marginBottom: '1.5rem', fontWeight: 400 }}>{prev.eyebrow}</span>
                {prevHeadlineLines.map((line, li) => (
                  <div key={li} style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95, color: 'rgba(237,233,227,0.15)' }}>{line}</div>
                ))}
              </div>
            )}

            {/* Current beat enters */}
            <div style={{ opacity: localP, transform: `translateY(${(1 - localP) * 8}%)`, transition: 'none', willChange: 'transform, opacity' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '2rem', opacity: localP > 0.2 ? 1 : 0, transition: 'none' }}>
                <div style={{ width: `${20 + localP * 40}px`, height: '1px', background: beat.accent, transition: 'none' }} />
                <span style={{ fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: `${beat.accent}99`, fontWeight: 400 }}>{beat.eyebrow}</span>
              </div>

              <div style={{ marginBottom: '3rem' }}>
                {headlineLines.map((line, li) => {
                  const lineP = easeOutExpo(Math.max(0, Math.min(1, (localRaw - li * 0.12) / 0.65)));
                  return (
                    <div key={`${activeBeat}-${li}`} style={{ overflow: 'hidden', lineHeight: 0.92, marginBottom: '0.06em' }}>
                      <span style={{
                        display: 'block', fontSize: 'clamp(3.2rem, 8.2vw, 8rem)', fontWeight: 800,
                        letterSpacing: '-0.04em', lineHeight: 0.92,
                        color: li === headlineLines.length - 1 ? 'transparent' : `rgba(237,233,227,${0.6 + lineP * 0.4})`,
                        background: li === headlineLines.length - 1 ? `linear-gradient(118deg, ${beat.accent}99 0%, ${beat.accent} 40%, #F0D898 60%, ${beat.accent} 80%)` : 'none',
                        WebkitBackgroundClip: li === headlineLines.length - 1 ? 'text' : 'unset',
                        backgroundClip: li === headlineLines.length - 1 ? 'text' : 'unset',
                        transform: `translateY(${(1 - lineP) * 110}%) skewY(${(1 - lineP) * -3}deg)`,
                        opacity: lineP, filter: `blur(${(1 - lineP) * 10}px)`, transition: 'none',
                      }}>{line}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ height: '1px', width: `${localP * 100}%`, background: `linear-gradient(90deg, ${beat.accent}55 0%, ${beat.accent}11 100%)`, marginBottom: '2rem', transition: 'none' }} />

              <p style={{
                fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)', lineHeight: 1.75,
                color: `rgba(237,233,227,${0.2 + localP * 0.45})`,
                fontWeight: 300, maxWidth: '580px', letterSpacing: '0.01em', margin: 0,
              }}>{beat.body}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'rgba(237,233,227,0.05)' }}>
            <div style={{ height: '100%', width: `${counterProgress * 100}%`, background: `linear-gradient(90deg, ${STORY_BEATS[0].accent} 0%, ${beat.accent} 100%)`, transition: 'width 0.08s linear, background 1s ease', boxShadow: `0 0 12px ${beat.accent}55` }} />
          </div>

          {/* Scroll hint at story start */}
          <div style={{
            position: 'absolute', bottom: '44px', left: '8vw',
            opacity: storyProgress < 0.04 ? 1 : 0, transition: 'opacity 0.6s ease',
            display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'none',
          }}>
            <div style={{ width: '1px', height: '36px', background: 'rgba(201,169,110,0.2)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, width: '1px', height: '40%', background: 'rgba(201,169,110,0.7)', animation: 'scrollDrop 1.8s ease-in-out infinite' }} />
            </div>
            <span style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.35)' }}>scroll to explore</span>
          </div>

          {/* Grain + vignette */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '140px 140px' }} />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(3,3,10,0.65) 0%, transparent 20%, transparent 80%, rgba(3,3,10,0.65) 100%)' }} />
        </div>
      </section>

      <style>{`
        /* ── Screen 2 scroll-reveal words ── */
        .s2-reveal-word {
          display: inline;
          color: rgba(237,233,227,0.12);
          transition: color 0.55s cubic-bezier(0.16,1,0.3,1);
        }
        .s2-reveal-word.s2-active {
          color: rgba(237,233,227,0.9);
        }
        .s2-reveal-word.s2-highlight {
          font-size: clamp(2.6rem, 7vw, 6rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          color: rgba(237,233,227,0.12);
          transition: color 0.55s cubic-bezier(0.16,1,0.3,1);
        }
        .s2-reveal-word.s2-highlight.s2-active {
          color: rgba(237,233,227,1);
        }
        .s2-reveal-word.s2-brand {
          font-size: clamp(2.6rem, 7vw, 6rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          -webkit-text-fill-color: transparent;
          background: linear-gradient(135deg, #B8935A 0%, #E8D4A0 45%, #C9A96E 100%);
          -webkit-background-clip: text;
          background-clip: text;
          opacity: 0.15;
          transition: opacity 0.55s cubic-bezier(0.16,1,0.3,1);
        }
        .s2-reveal-word.s2-brand.s2-active {
          opacity: 1;
          -webkit-text-fill-color: transparent;
        }
        @keyframes noise-shift {
          0%   { background-position: 0 0 }
          33%  { background-position: -8px 12px }
          66%  { background-position: 5px -8px }
          100% { background-position: 0 0 }
        }
        @keyframes flicker-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          40% { opacity: 0.3; transform: scale(0.7); }
          60% { opacity: 0.8; transform: scale(1.2); }
        }
        @keyframes glitch-text {
          0%, 90%, 100% { transform: translateX(0); filter: none; }
          92% { transform: translateX(-3px); filter: hue-rotate(15deg); }
          94% { transform: translateX(3px); filter: hue-rotate(-15deg); }
          96% { transform: translateX(-2px); filter: hue-rotate(10deg); }
        }
        @keyframes pain-flicker {
          0%, 95%, 100% { opacity: 1; border-color: rgba(255,80,80,0.1); }
          97% { opacity: 0.85; border-color: rgba(255,80,80,0.2); }
        }
        @keyframes widget-float {
          0%, 100% { transform: translateY(0px); }
          40% { transform: translateY(-8px); }
          70% { transform: translateY(-4px); }
        }
        @keyframes value-flicker {
          0%, 88%, 100% { opacity: 1; }
          90% { opacity: 0.6; }
          93% { opacity: 1; }
        }
        @keyframes subtle-bloom {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @keyframes scrollDrop {
          0% { top: 0; opacity: 1; }
          70% { top: 60%; opacity: 0.3; }
          100% { top: 0; opacity: 1; }
        }
      `}</style>
    </>
  );
}
