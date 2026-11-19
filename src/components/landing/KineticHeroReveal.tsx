'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowLeft, MessageCircle, Check } from 'lucide-react';
import MagneticButton from './MagneticButton';

const WHATSAPP_URL = 'https://wa.me/213666568039?text=مرحباً،%20أريد%20تفعيل%20نظام%20NextDZ%20لقاعة%20الانتظار%20لدي';

export default function KineticHeroReveal() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.6 } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0.4, y: 10 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0.4, y: 15 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0.4, y: 12 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0.8, y: 10 },
          { opacity: 1, y: 0, duration: 0.4 },
          '-=0.2'
        )
        .fromTo(
          pillRef.current,
          { opacity: 0.6, y: 10 },
          { opacity: 1, y: 0, duration: 0.4 },
          '-=0.2'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 max-w-4xl mx-auto text-center space-y-7 pt-4 sm:pt-10 pb-12 sm:pb-16 px-2">
      {/* 1. Calm Editorial Identity Pill */}
      <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffffff] border border-[#b3bfcb] shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#4f6271]" />
        <span className="text-xs font-bold text-[#313c45] tracking-wide">
          الجيل الجديد لتنظيم قاعات الانتظار • بدون أجهزة
        </span>
      </div>

      {/* 2. Official Slogan & Headline */}
      <div className="space-y-4">
        <h1
          ref={titleRef}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#313c45] tracking-tight heading-balance leading-[1.25]"
        >
          قاعة هادئة، سكرتيرة مرتاحة،
          <br />
          <span className="text-[#4f6271] font-semibold">وزبائن راضون دائماً.</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-base sm:text-lg text-[#313c45] max-w-2xl mx-auto leading-relaxed heading-balance font-normal"
        >
          حوّل هاتف كل زائر إلى تذكرة انتظار ذكية. بدون أجهزة كشك مكلفة، بدون طابعات ورقية تتعطل، وبملصق كود واحد أنيق على طاولتك.
        </p>
      </div>

      {/* 3. Magnetic Commercial CTAs - Responsive 390px */}
      <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-md mx-auto sm:max-w-none">
        <MagneticButton
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          className="w-full sm:w-auto text-sm sm:text-base px-7 py-3.5 sm:py-4 justify-center"
        >
          <MessageCircle className="w-5 h-5 text-[#b3bfcb]" />
          <span>اطلب التفعيل عبر واتساب</span>
        </MagneticButton>

        <MagneticButton
          href="#live-experience"
          variant="secondary"
          className="w-full sm:w-auto text-sm sm:text-base px-7 py-3.5 sm:py-4 justify-center"
        >
          <span>جرّب النظام مباشرة</span>
          <ArrowLeft className="w-4 h-4 text-[#4f6271]" />
        </MagneticButton>
      </div>

      {/* 4. Genuine Trust Marks (Zero Invented Stats) */}
      <div
        ref={pillRef}
        className="pt-4 flex flex-wrap items-center justify-center gap-y-2.5 gap-x-6 text-xs text-[#313c45] font-semibold"
      >
        <span className="inline-flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-[#4f6271]" />
          <span>يعمل مباشرة في المتصفح دون تحميل تطبيق</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-[#4f6271]" />
          <span>صفر تكلفة صيانة وبدون ورق طباعة</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-[#4f6271]" />
          <span>تنبيه صوتي ذكي للمراجع على هاتفه</span>
        </span>
      </div>
    </div>
  );
}
