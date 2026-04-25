import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import HeroBridge from '@/app/components/HeroBridge';
{/*import ProblemSection from '@/app/components/ProblemSection';*/}
import ServicesSection from '@/app/components/ServicesSection';
import ProcessSection from '@/app/components/ProcessSection';
import TransformationSection from '@/app/components/TransformationSection';
import ShowcaseSection from '@/app/components/ShowcaseSection';
import FloatingTestimonialsSection from '@/app/components/FloatingTestimonialsSection';
import CTASection from '@/app/components/CTASection';
import ScrollAnimationInit from '@/app/components/ScrollAnimationInit';

export default function HomePage() {
  return (
    <main className="relative bg-background [overflow-x:clip]">
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

      {/* 4. Process — clarity / structure / sticky storytelling */}
      <ProcessSection />

      {/* 5. Transformation — before vs after, the upgrade */}
      <TransformationSection />

      {/* 6. Showcase — premium auto-scroll with 3D tilt + depth */}
      <ShowcaseSection />

      {/* 7. Testimonials — floating, drifting, alive social proof */}
      <FloatingTestimonialsSection />

      {/* 8. CTA */}
      <CTASection />

      <Footer />
    </main>
  );
}
