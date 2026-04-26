import React from 'react';
import type { Metadata } from 'next';
import Preloader from '@/app/components/Preloader';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import HeroBridge from '@/app/components/HeroBridge';
// import ProblemSection from '@/app/components/ProblemSection';
import ServicesSection from '@/app/components/ServicesSection';
import ProcessSection from '@/app/components/ProcessSection';
import TransformationSection from '@/app/components/TransformationSection';
import ShowcaseSection from '@/app/components/ShowcaseSection';
// import FloatingTestimonialsSection from '@/app/components/FloatingTestimonialsSection';
import TestimonialsSection from '@/app/components/TestimonialsSection';
import FAQSection from '@/app/components/FAQSection';
// CTASection replaced by VideoShowcase
import HowItWorksSection from '@/app/components/HowItWorksSection';
import VideoShowcase from '@/app/components/VideoShowcase';
import ScrollAnimationInit from '@/app/components/ScrollAnimationInit';

export const metadata: Metadata = {
  title: 'MotionGrace | High-End Animation Studio for Ads, UI & Product Videos',
  icons: {
    icon: [
      { url: '/motion_grace_logo.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [{ url: '/motion_grace_logo.png', type: 'image/png' }],
    shortcut: '/motion_grace_logo.png',
  },
};


export default function HomePage() {
  return (
    <main data-page-shell="home" className="relative bg-background [overflow-x:clip]">
      <Preloader />
      <ScrollAnimationInit />
      <Header />

      {/* 1. Hero — cinematic entry */}
      <HeroSection />

      {/* Bridge: hero bleeds into next section with descending particles */}
      <HeroBridge />

      {/* 2. Problem — glitch / uneasy / frustration 
      <ProblemSection />*/}

      {/* 3. Services — the solution revealed */}
      <ServicesSection />


      <ShowcaseSection />

     

      {/* 4. Process — clarity / structure / sticky storytelling */}
      <ProcessSection />

      
      
      {/* 4b. How It Works — expandable order-to-delivery journey */}
      <HowItWorksSection />

      {/* 6. Transformation — before vs after, the upgrade */}
      <TransformationSection />

      {/* 7. Testimonials redesigned — marquee editorial rows */}
      <TestimonialsSection />

      {/* 7c. FAQ — collapsible two-column, single viewport */}
      <FAQSection />

      {/* Final CTA — video background */}
      <VideoShowcase />

      

      <Footer />
    </main>
  );
}