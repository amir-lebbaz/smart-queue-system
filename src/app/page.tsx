'use client';

import React from 'react';
import { 
  QrCode, 
  Smartphone, 
  Volume2, 
  MessageCircle, 
  ExternalLink, 
  Stethoscope, 
  TestTube2, 
  Scissors, 
  Scale, 
  PhoneCall, 
  Tv, 
  Sparkles, 
  Users 
} from 'lucide-react';
import CalmMistCanvas from '@/components/landing/CalmMistCanvas';
import KineticHeroReveal from '@/components/landing/KineticHeroReveal';
import BeforeAfterComparison from '@/components/landing/BeforeAfterComparison';
import ScenarioTabs from '@/components/landing/ScenarioTabs';
import MagneticButton from '@/components/landing/MagneticButton';
import NextDZLogo from '@/components/NextDZLogo';

const PHONE_NUMBER = '0666 56 80 39';
const WHATSAPP_URL = 'https://wa.me/213666568039?text=مرحباً،%20أريد%20تفعيل%20نظام%20NextDZ%20لقاعة%20الانتظار%20لدي';

export default function Home() {
  React.useEffect(() => {
    // Isolate light Frozen Whisper palette strictly to landing page
    const prevBodyBg = document.body.style.backgroundColor;
    const prevHtmlBg = document.documentElement.style.backgroundColor;
    document.body.style.backgroundColor = '#f7f9fb';
    document.documentElement.style.backgroundColor = '#f7f9fb';
    return () => {
      document.body.style.backgroundColor = prevBodyBg;
      document.documentElement.style.backgroundColor = prevHtmlBg;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#313c45] font-sans antialiased overflow-x-hidden selection:bg-[#b3bfcb]/40 selection:text-[#313c45]">
      
      {/* =========================================================================
          TOP COMMERCIAL NOTIFICATION TICKER - Responsive 390px
          ========================================================================= */}
      <div className="bg-[#313c45] text-[#d5dbe2] text-xs py-2 px-3 sm:px-4 border-b border-[#4f6271]/30">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-3 text-center sm:text-right">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b3bfcb] inline-block animate-ping" />
            <span className="font-bold text-[#f7f9fb]">NextDZ</span>
            <span className="text-[#d5dbe2]">— قاعة هادئة، سكرتيرة مرتاحة، زبائن راضون</span>
          </span>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#d5dbe2] hover:text-[#f7f9fb] transition font-bold"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#b3bfcb]" />
            <span>طلب التفعيل الفوري عبر واتساب: {PHONE_NUMBER}</span>
          </a>
        </div>
      </div>

      {/* =========================================================================
          NAVIGATION HEADER
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#f7f9fb]/90 backdrop-blur-md border-b border-[#b3bfcb]/50 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Brand Logo & Wordmark */}
          <a href="#" className="inline-block group" aria-label="NextDZ الصفحة الرئيسية">
            <div className="flex items-center gap-2.5" dir="ltr">
              <svg width="40" height="26" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="NextDZ Queue Ticket Logo">
                <path d="M4 4H60V14C56.686 14 54 16.686 54 20C54 23.314 56.686 26 60 26V36H4V26C7.314 26 10 23.314 10 20C10 16.686 7.314 14 4 14V4Z" stroke="#313c45" strokeWidth="3.5" strokeLinejoin="round" fill="#eef1f5"/>
                <path d="M16 12H36L45 20L36 28H16L22 20L16 12Z" fill="#778ca4" fillOpacity="0.35"/>
                <path d="M18 20H40M40 20L32 12.5M40 20L32 27.5" stroke="#313c45" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-bold tracking-tight">
                <span style={{ color: '#313c45' }}>Next</span>
                <span style={{ color: '#778ca4' }}>DZ</span>
              </span>
            </div>
          </a>

          {/* Editorial Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-[#313c45]">
            <a href="#comparison" className="hover:text-[#4f6271] transition">المشاكل والحل</a>
            <a href="#how-it-works" className="hover:text-[#4f6271] transition">كيف يعمل</a>
            <a href="#real-scenarios" className="hover:text-[#4f6271] transition">حالات واقعية</a>
            <a href="#for-who" className="hover:text-[#4f6271] transition">لمن صُمم</a>
            <a href="#live-experience" className="hover:text-[#4f6271] transition">التجربة الحية</a>
          </nav>

          {/* Quick Header CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#live-experience"
              className="hidden sm:inline-flex text-xs font-bold text-[#313c45] hover:text-[#4f6271] px-3 py-2 transition"
            >
              معاينة حية
            </a>
            <MagneticButton
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="text-xs px-3.5 sm:px-4 py-2 sm:py-2.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#b3bfcb]" />
              <span>تواصل واتساب</span>
            </MagneticButton>
          </div>
        </div>
      </header>

      {/* =========================================================================
          SECTION 1: HERO (LIVING AMBIENT MIST + KINETIC REVEAL + PHYSICAL ARTIFACT)
          ========================================================================= */}
      <section className="relative min-h-[85vh] flex flex-col justify-center px-4 sm:px-6 pt-4 pb-16 overflow-hidden">
        {/* Living Calm Mist Procedural Wave */}
        <CalmMistCanvas />

        {/* Text Reveal Choreography */}
        <KineticHeroReveal />

        {/* Physical-to-Digital Minimalist Artifact Showcase */}
        <div className="max-w-4xl mx-auto w-full mt-2">
          <div className="bg-[#ffffff] rounded-3xl p-5 sm:p-8 border border-[#b3bfcb] shadow-[0_12px_40px_rgba(119,140,164,0.12)]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* The Physical Stand (Right in RTL) */}
              <div className="md:col-span-5 bg-[#eef1f4] rounded-2xl p-6 border border-[#b3bfcb]/70 text-center space-y-3.5">
                <div className="inline-block px-3 py-1 rounded-full bg-[#313c45] text-[#f7f9fb] text-[11px] font-bold">
                  ملصق الاستقبال الذكي
                </div>
                <div className="flex items-center justify-center pt-1" dir="ltr">
                  <NextDZLogo width={36} height={23} textSize="text-base" />
                </div>
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto bg-[#ffffff] rounded-2xl p-3 border border-[#b3bfcb] flex items-center justify-center shadow-sm">
                  <QrCode className="w-full h-full text-[#313c45]" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#313c45]">امسح الكود بهاتفك وخذ دورك</p>
                  <p className="text-[11px] text-[#4f6271] font-medium">بدون تحميل أي تطبيق • في ثوانٍ معدودة</p>
                </div>
              </div>

              {/* The Visitor Phone Screen (Left in RTL) */}
              <div className="md:col-span-7 bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#b3bfcb] shadow-sm space-y-4 text-right">
                <div className="flex items-center justify-between border-b border-[#b3bfcb]/50 pb-3">
                  <span className="text-xs font-bold text-[#313c45]">تذكرة انتظار رقمية تفاعلية</span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#313c45]">
                    <Volume2 className="w-3.5 h-3.5 text-[#4f6271]" />
                    <span>تنبيه صوتي مفعّل</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#f7f9fb] border border-[#b3bfcb]/60">
                    <span className="text-[11px] font-bold text-[#4f6271] block mb-1">تذكرتك الحالية</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#313c45] tracking-tight">دورك قادم</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f7f9fb] border border-[#b3bfcb]/60">
                    <span className="text-[11px] font-bold text-[#4f6271] block mb-1">حالة الاستدعاء</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#313c45] tracking-tight">المراجع الحالي داخل</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#eef1f4] border border-[#b3bfcb]/60 flex items-center justify-between text-xs">
                  <span className="text-[#313c45] font-bold">باقي أمامك القليل فقط</span>
                  <span className="text-[#4f6271] font-medium">تنبيه بالدخول فور اقتراب موعدك</span>
                </div>

                <p className="text-[11px] text-[#4f6271] font-medium leading-relaxed">
                  يمكن للزائر إغلاق هاتفه أو التنقل بحرية خارج القاعة؛ ستهتز شاشته ويصدر نغمة تنبيه لطيفة عندما يحين وقته للحضور.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: هل تعاني من هذه المشاكل يومياً؟ (THE PAIN VS SERENITY)
          ========================================================================= */}
      <section id="comparison" className="py-20 sm:py-24 px-4 sm:px-6 bg-[#eef1f4] border-t border-[#b3bfcb]/50">
        <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 mb-12 sm:mb-14">
          <span className="text-xs font-bold tracking-wider text-[#313c45] uppercase">
            مقارنة واقعية
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#313c45] tracking-tight heading-balance">
            هل تعاني من هذه المشاكل في قاعة انتظارك كل يوم؟
          </h2>
          <p className="text-sm sm:text-base font-medium text-[#4f6271] max-w-2xl mx-auto leading-relaxed">
            الفوضى والتوتر ليسا قدراً محتوماً في قاعات الاستقبال. انظر كيف يتحول يومك العملي مع NextDZ.
          </p>
        </div>

        <BeforeAfterComparison />
      </section>

      {/* =========================================================================
          SECTION 3: كيف يعمل في 3 خطوات بسيطة؟ (HOW IT WORKS)
          ========================================================================= */}
      <section id="how-it-works" className="py-20 sm:py-24 px-4 sm:px-6 bg-[#f7f9fb] border-t border-[#b3bfcb]/50">
        <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 mb-14 sm:mb-16">
          <span className="text-xs font-bold tracking-wider text-[#313c45] uppercase">
            بساطة مطلقة
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#313c45] tracking-tight heading-balance">
            كيف يعمل NextDZ في خطوات بسيطة؟
          </h2>
          <p className="text-sm sm:text-base font-medium text-[#4f6271] max-w-2xl mx-auto leading-relaxed">
            بدون فني تركيب، وبدون عقود صيانة معقدة. يبدأ النظام بالعمل في عيادتك أو محلك خلال دقائق معدودة.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#b3bfcb] shadow-sm space-y-4 text-right">
            <div className="w-10 h-10 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#313c45]">
              اطبع ملصق الكود وضعه في الاستقبال
            </h3>
            <p className="text-xs sm:text-sm text-[#4f6271] font-medium leading-relaxed">
              نوفر لك كود استقبال مخصص لنشاطك. اطبعه على ورقة عادية أو استاند أنيق وضعه على طاولة السكرتيرة. لا أسلاك، ولا أجهزة كشك مكلفة.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#b3bfcb] shadow-sm space-y-4 text-right">
            <div className="w-10 h-10 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#313c45]">
              يمسح الزائر الكود بهاتفه ويغادر بارتياح
            </h3>
            <p className="text-xs sm:text-sm text-[#4f6271] font-medium leading-relaxed">
              بدون تحميل تطبيق أو إنشاء حساب. يرى الزائر دوره ووقت دخوله التقريبي، وله كامل الحرية في الانتظار بالخارج أو في مكان مريح.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#b3bfcb] shadow-sm space-y-4 text-right">
            <div className="w-10 h-10 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center font-bold">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#313c45]">
              تناديه بضغطة زر ويصلك في وقته
            </h3>
            <p className="text-xs sm:text-sm text-[#4f6271] font-medium leading-relaxed">
              من هاتفك أو كمبيوترك، اضغط استدعاء التالي. يهتز هاتف المراجع بنغمة لطيفة ليدخل مباشرة، ثم يقيّم تجربته بلمسة واحدة عند خروجه.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: مصمم لكل الحالات الواقعية (REAL-WORLD SOLUTIONS)
          ========================================================================= */}
      <section id="real-scenarios" className="py-20 sm:py-24 px-4 sm:px-6 bg-[#eef1f4] border-t border-[#b3bfcb]/50">
        <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 mb-12 sm:mb-14">
          <span className="text-xs font-bold tracking-wider text-[#313c45] uppercase">
            حلول ميدانية واقعية
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#313c45] tracking-tight heading-balance">
            مصمم لكل الحالات الواقعية التي تحدث كل يوم
          </h2>
          <p className="text-sm sm:text-base font-medium text-[#4f6271] max-w-2xl mx-auto leading-relaxed">
            فهمنا تفاصيل العمل اليومي؛ لذلك صممنا حلولاً جاهزة للتأخير المؤقت، كبار السن، وشاشات العرض الكبيرة.
          </p>
        </div>

        <ScenarioTabs />
      </section>

      {/* =========================================================================
          SECTION 5: لمن صُمّم NextDZ؟ (WHO IT IS BUILT FOR)
          ========================================================================= */}
      <section id="for-who" className="py-20 sm:py-24 px-4 sm:px-6 bg-[#f7f9fb] border-t border-[#b3bfcb]/50">
        <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 mb-14 sm:mb-16">
          <span className="text-xs font-bold tracking-wider text-[#313c45] uppercase">
            القطاعات المستفيدة
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#313c45] tracking-tight heading-balance">
            لمن صُمّم NextDZ؟
          </h2>
          <p className="text-sm sm:text-base font-medium text-[#4f6271] max-w-2xl mx-auto leading-relaxed">
            لكل مؤسسة أو مهني يقدّر وقته ويريد تقديم تجربة استقبال تليق بمكانته وسمعته.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          
          {/* Card 1: Clinics */}
          <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-7 border border-[#b3bfcb] shadow-sm space-y-3 sm:space-y-4 text-right hover:border-[#4f6271] transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#313c45]">
              العيادات الطبية والمراكز الصحية
            </h3>
            <p className="text-xs text-[#4f6271] font-medium leading-relaxed">
              إنهاء الضجيج والتجمهر حول مكتب السكرتيرة، وتنظيم فترات الكشف بخصوصية وراحة نفسية للمرضى وذويهم.
            </p>
          </div>

          {/* Card 2: Labs */}
          <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-7 border border-[#b3bfcb] shadow-sm space-y-3 sm:space-y-4 text-right hover:border-[#4f6271] transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
              <TestTube2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#313c45]">
              مخابر التحاليل ومراكز الأشعة
            </h3>
            <p className="text-xs text-[#4f6271] font-medium leading-relaxed">
              توزيع سحب العينات وتسليم النتائج بسلاسة تامة، مع منع الاكتظاظ في الممرات الصباحية المزدحمة.
            </p>
          </div>

          {/* Card 3: Salons */}
          <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-7 border border-[#b3bfcb] shadow-sm space-y-3 sm:space-y-4 text-right hover:border-[#4f6271] transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#313c45]">
              صالونات الحلاقة ومراكز العناية
            </h3>
            <p className="text-xs text-[#4f6271] font-medium leading-relaxed">
              احترام وقت الزبون؛ يأخذ دوره وينتظر في سيارته أو يقضي مشاويره ويعود قبل كرسيه بدقائق.
            </p>
          </div>

          {/* Card 4: Notary */}
          <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-7 border border-[#b3bfcb] shadow-sm space-y-3 sm:space-y-4 text-right hover:border-[#4f6271] transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#313c45]">
              مكاتب التوثيق والاستشارات
            </h3>
            <p className="text-xs text-[#4f6271] font-medium leading-relaxed">
              تنظيم مراجعي المعاملات والعقود الرسمية في هدوء تام يحفظ للمكتب وقاره وهيبته المهنية.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5.5: جرّب بنفسك تجربة النظام الحقيقية (LIVE SYSTEM VERIFICATION)
          ========================================================================= */}
      <section id="live-experience" className="py-20 sm:py-24 px-4 sm:px-6 bg-[#eef1f4] border-t border-[#b3bfcb]/60">
        <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 mb-12 sm:mb-14">
          <span className="text-xs font-bold tracking-wider text-[#313c45] uppercase">
            معاينة فورية حقيقية
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#313c45] tracking-tight heading-balance">
            جرّب النظام الحقيقي بنفسك الآن
          </h2>
          <p className="text-sm sm:text-base font-medium text-[#4f6271] max-w-2xl mx-auto leading-relaxed">
            النظام يعمل بكامل طاقته الآن. اضغط على أي شاشة بالأسفل لتجربتها مباشرة في متصفحك.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Live Screen 1: Visitor Mobile Ticket */}
          <div className="bg-[#ffffff] rounded-3xl p-6 sm:p-7 border border-[#b3bfcb] shadow-sm space-y-5 text-right flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#313c45]">
                شاشة المراجع التفاعلية
              </h3>
              <p className="text-xs text-[#4f6271] font-medium leading-relaxed">
                افتح الرابط بهاتفك كأنك زائر مسح الكود، وشاهد التذكرة والعد التنازلي ونغمة التنبيه عند اقتراب دورك.
              </p>
            </div>

            <div className="pt-4 border-t border-[#b3bfcb]/50">
              <a
                href="/q/clinic-amal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#313c45] text-[#f7f9fb] text-xs font-bold hover:bg-[#232b32] transition"
              >
                <span>فتح تذكرة المراجع الحية</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Live Screen 2: Controller Dashboard */}
          <div className="bg-[#ffffff] rounded-3xl p-6 sm:p-7 border border-[#b3bfcb] shadow-sm space-y-5 text-right flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#313c45]">
                لوحة تحكم المسير والطبيب
              </h3>
              <p className="text-xs text-[#4f6271] font-medium leading-relaxed">
                لوحة سريعة محمية برمز دخول تجريبي خاص، تتيح لك الاستدعاء، التأجيل، وإنهاء الكشف بلمسة واحدة.
              </p>
            </div>

            <div className="pt-4 border-t border-[#b3bfcb]/50">
              <a
                href="/admin/clinic-amal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#313c45] text-[#f7f9fb] text-xs font-bold hover:bg-[#232b32] transition"
              >
                <span>فتح لوحة التحكم التجريبية</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Live Screen 3: Smart TV Waiting Hall */}
          <div className="bg-[#ffffff] rounded-3xl p-6 sm:p-7 border border-[#b3bfcb] shadow-sm space-y-5 text-right flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
                <Tv className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#313c45]">
                شاشة العرض لصالة الانتظار
              </h3>
              <p className="text-xs text-[#4f6271] font-medium leading-relaxed">
                شاشة سينمائية عالية الوضوح تعمل على أي شاشة متصلة بالإنترنت، مع جرس نداء صوتي عند استدعاء كل تذكرة.
              </p>
            </div>

            <div className="pt-4 border-t border-[#b3bfcb]/50">
              <a
                href="/display/clinic-amal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#313c45] text-[#f7f9fb] text-xs font-bold hover:bg-[#232b32] transition"
              >
                <span>معاينة شاشة الصالة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6: CLOSING COMMERCIAL CTA & HIGH-CONTRAST EDITORIAL FOOTER
          ========================================================================= */}
      <footer className="bg-[#313c45] text-[#d5dbe2] pt-16 sm:pt-20 pb-12 px-4 sm:px-6 border-t border-[#232b32]">
        <div className="max-w-4xl mx-auto text-center space-y-7 sm:space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4f6271]/30 border border-[#b3bfcb]/20 text-xs font-bold text-[#f7f9fb]">
            <Sparkles className="w-3.5 h-3.5 text-[#b3bfcb]" />
            <span>ابدأ التحول إلى الهدوء اليوم</span>
          </div>

          <h2 className="text-2xl sm:text-5xl font-bold text-[#f7f9fb] tracking-tight heading-balance leading-tight">
            اجعل قاعة انتظارك عنواناً للراحة والاحترافية.
          </h2>

          <p className="text-sm sm:text-base font-normal text-[#d5dbe2] max-w-xl mx-auto leading-relaxed">
            لا داعي لتأجيل راحة بالك وسكرتيرتك. تواصل معنا مباشرة لتجهيز كود عيادتك أو صالونك وبدء الاستخدام فوراً.
          </p>

          {/* Big WhatsApp Direct CTA Button */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto sm:max-w-none">
            <MagneticButton
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="w-full sm:w-auto bg-[#f7f9fb] text-[#313c45] hover:bg-[#eef1f4] hover:text-[#232b32] text-sm sm:text-base px-7 py-3.5 sm:py-4 shadow-[0_4px_25px_rgba(0,0,0,0.3)] border-transparent justify-center"
            >
              <MessageCircle className="w-5 h-5 text-[#313c45]" />
              <span>تواصل عبر واتساب: {PHONE_NUMBER}</span>
            </MagneticButton>

            <a
              href="tel:0666568039"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-full text-sm font-bold border border-[#b3bfcb]/40 text-[#f7f9fb] hover:bg-[#4f6271]/30 transition"
            >
              <PhoneCall className="w-4 h-4 text-[#b3bfcb]" />
              <span>اتصال هاتفي مباشر</span>
            </a>
          </div>

          {/* Brand Mark and Copyright */}
          <div className="pt-12 sm:pt-16 mt-12 sm:mt-16 border-t border-[#4f6271]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#d5dbe2]">
            <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
              <div className="bg-[#eef1f5] px-2.5 py-1 rounded-xl shadow-sm">
                <div className="flex items-center gap-2" dir="ltr">
                  <svg width="34" height="22" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="NextDZ Queue Ticket Logo">
                    <path d="M4 4H60V14C56.686 14 54 16.686 54 20C54 23.314 56.686 26 60 26V36H4V26C7.314 26 10 23.314 10 20C10 16.686 7.314 14 4 14V4Z" stroke="#313c45" strokeWidth="3.5" strokeLinejoin="round" fill="#eef1f5"/>
                    <path d="M16 12H36L45 20L36 28H16L22 20L16 12Z" fill="#778ca4" fillOpacity="0.35"/>
                    <path d="M18 20H40M40 20L32 12.5M40 20L32 27.5" stroke="#313c45" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-base font-bold tracking-tight">
                    <span style={{ color: '#313c45' }}>Next</span>
                    <span style={{ color: '#778ca4' }}>DZ</span>
                  </span>
                </div>
              </div>
              <span>— قاعة هادئة، سكرتيرة مرتاحة، زبائن راضون.</span>
            </div>

            <div>
              جميع الحقوق محفوظة © {new Date().getFullYear()} NextDZ.
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
