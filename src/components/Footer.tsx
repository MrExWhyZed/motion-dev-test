import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer data-gsap-section="footer" className="border-t border-border/30 py-20 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Section divider */}
        <div className="section-divider mb-16" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10">
          {/* Left: Logo + Tagline */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src="/motion_grace_logo.png"
                  alt="Motion Grace"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span className="font-bold text-sm tracking-tight">
                <span className="text-foreground">Motion</span>
                <span className="text-gradient-gold">Grace</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground font-light max-w-[200px] leading-relaxed tracking-wide">
              Cinematic CGI for modern beauty brands.
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {['Work', 'Services', 'Process', 'Studio', 'Privacy', 'Terms']?.map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs font-light text-muted-foreground hover:text-foreground/80 transition-colors duration-500 tracking-wide"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-muted-foreground/60 tracking-wide">
            © 2026 MotionGrace. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Instagram', 'Behance', 'LinkedIn']?.map((social) => (
              <Link
                key={social}
                href="#"
                className="text-[10px] font-medium text-muted-foreground/60 hover:text-primary/80 transition-colors duration-500 tracking-wide"
              >
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
