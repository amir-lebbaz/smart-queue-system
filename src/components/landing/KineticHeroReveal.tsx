'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowLeft, MessageCircle, ExternalLink, Sparkles, Check } from 'lucide-react';
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
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.1 } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1.0 },
          '-=0.5'
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.6'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          pillRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.4'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 max-w-4xl mx-auto text-center space-y-8 pt-8 sm:pt-14 pb-16">
      {/* 1. Calm Editorial Identity Pill */}
      <div ref={badgeRef} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#ffffff]/80 backdrop-blur-md border border-[#b3bfcb]/60 shadow-[0_2px_12px_rgba(119,140,164,0.12)]">
        <span className="w-2 h-2 rounded-full bg-[#778ca4] animate-pulse" />
        <span className="text-xs font-semibold text-[#313c45] tracking-wide">
          الجيل الجديد لإدارة الطوابير الذكية • بدون أجهزة
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
          <span className="text-[#4f6271] font-medium">وزبائن راضون دائماً.</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-base sm:text-lg text-[#4f6271] max-w-2xl mx-auto leading-relaxed heading-balance"
        >
          حوّل هاتف كل زائر إلى تذكرة انتظار ذكية. بدون أجهزة كشك باهظة، بدون طابعات ورقية تتعطل، وبملصق QR واحد أنيق على طاولتك.
        </p>
      </div>

      {/* 3. Magnetic Commercial CTAs */}
      <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <MagneticButton
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          className="text-sm sm:text-base px-7 py-4"
        >
          <MessageCircle className="w-5 h-5 text-[#b3bfcb]" />
          <span>اطلب التفعيل عبر واتساب</span>
        </MagneticButton>

        <MagneticButton
          href="#live-experience"
          variant="secondary"
          className="text-sm sm:text-base px-7 py-4"
        >
          <span>جرّب النظام مباشرة</span>
          <ArrowLeft className="w-4 h-4 text-[#778ca4]" />
        </MagneticButton>
      </div>

      {/* 4. Genuine Trust Marks (Zero Invented Stats) */}
      <div
        ref={pillRef}
        className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#4f6271]"
      >
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Check className="w-3.5 h-3.5 text-[#778ca4]" />
          <span>يعمل مباشرة في المتصفح دون تحميل أي تطبيق</span>
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Check className="w-3.5 h-3.5 text-[#778ca4]" />
          <span>صفر تكلفة صيانة ولا حاجة لورق طباعة</span>
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Check className="w-3.5 h-3.5 text-[#778ca4]" />
          <span>تنبيه صوتي ذكي للمراجع على هاتفه</span>
        </span>
      </div>
    </div>
  );
}
