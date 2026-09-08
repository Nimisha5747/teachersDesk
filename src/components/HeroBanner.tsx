'use client';

import Image from 'next/image';

export default function HeroBanner() {
  return (
    <div className="hero-banner" role="banner">
      <Image
        src="/banner.png"
        alt="A serene modern classroom with golden morning light"
        fill
        className="hero-banner-img"
        priority
        sizes="(max-width: 768px) 100vw, calc(100vw - 240px)"
      />
      <div className="hero-banner-overlay" aria-hidden="true" />
      <div className="hero-banner-content">
        <h1 className="hero-title">
          Teacher&apos;<span>sDesk</span>
        </h1>
        <p className="hero-subtitle">
          Your intelligent classroom companion — manage students, track progress,
          and stay organized effortlessly.
        </p>
      </div>
    </div>
  );
}
