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
                <span style={{ color: '#ffffff' }}>Motion</span>
                <span style={{ color: '#ffffff' }}>Grace</span>
              </span>
            </Link>
            <p className="text-xs font-light max-w-[200px] leading-relaxed tracking-wide" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Cinematic CGI for modern beauty brands.
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {['Work', 'Services', 'Process', 'Studio', 'Privacy', 'Terms']?.map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs font-light hover:text-white transition-colors duration-500 tracking-wide" style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © 2026 MotionGrace. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Instagram', 'Behance', 'LinkedIn']?.map((social) => (
              <Link
                key={social}
                href="#"
                className="text-[10px] font-medium hover:text-white transition-colors duration-500 tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}
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
