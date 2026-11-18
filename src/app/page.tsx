'use client';

import React from 'react';
import { 
  QrCode, 
  Smartphone, 
  Volume2, 
  Check, 
  MessageCircle, 
  ExternalLink, 
  ArrowLeft, 
  Building2, 
  Sparkles, 
  Stethoscope, 
  TestTube2, 
  Scissors, 
  Scale, 
  PhoneCall, 
  Tv, 
  FileSpreadsheet, 
  Clock, 
  ShieldCheck, 
  Users 
} from 'lucide-react';
import CalmMistCanvas from '@/components/landing/CalmMistCanvas';
import KineticHeroReveal from '@/components/landing/KineticHeroReveal';
import BeforeAfterComparison from '@/components/landing/BeforeAfterComparison';
import ScenarioTabs from '@/components/landing/ScenarioTabs';
import MagneticButton from '@/components/landing/MagneticButton';

const PHONE_NUMBER = '0666 56 80 39';
const WHATSAPP_URL = 'https://wa.me/213666568039?text=مرحباً،%20أريد%20تفعيل%20نظام%20NextDZ%20لقاعة%20الانتظار%20لدي';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#313c45] font-sans antialiased overflow-x-hidden selection:bg-[#778ca4]/20 selection:text-[#313c45]">
      
      {/* =========================================================================
          TOP COMMERCIAL NOTIFICATION TICKER
          ========================================================================= */}
      <div className="bg-[#313c45] text-[#d5dbe2] text-xs py-2 px-4 border-b border-[#4f6271]/30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 text-center sm:text-right">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b3bfcb] inline-block animate-ping" />
            <span className="font-medium text-[#f7f9fb]">NextDZ</span>
            <span className="hidden md:inline text-[#b3bfcb]">— قاعة هادئة، سكرتيرة مرتاحة، زبائن راضون</span>
          </span>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#d5dbe2] hover:text-[#ffffff] transition font-semibold"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#b3bfcb]" />
            <span>طلب التفعيل الفوري عبر واتساب: {PHONE_NUMBER}</span>
          </a>
        </div>
      </div>

      {/* =========================================================================
          NAVIGATION HEADER
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#f7f9fb]/85 backdrop-blur-md border-b border-[#b3bfcb]/40 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          
          {/* Brand Wordmark */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#313c45] text-[#f7f9fb] flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-[#232b32] transition">
              ND
            </div>
            <div className="flex flex-col text-right">
              <span className="text-lg font-bold tracking-tight text-[#313c45]">NextDZ</span>
              <span className="text-[10px] text-[#4f6271] -mt-1 font-medium">Smart Queue Service</span>
            </div>
          </a>

          {/* Editorial Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#4f6271]">
            <a href="#comparison" className="hover:text-[#313c45] transition">المشاكل والحل</a>
            <a href="#how-it-works" className="hover:text-[#313c45] transition">كيف يعمل</a>
            <a href="#real-scenarios" className="hover:text-[#313c45] transition">حالات واقعية</a>
            <a href="#for-who" className="hover:text-[#313c45] transition">لمن صُمم</a>
            <a href="#live-experience" className="hover:text-[#313c45] transition">التجربة الحية</a>
          </nav>

          {/* Quick Header CTA */}
          <div className="flex items-center gap-3">
            <a
              href="#live-experience"
              className="hidden sm:inline-flex text-xs font-semibold text-[#4f6271] hover:text-[#313c45] px-3 py-2 transition"
            >
              معاينة حية
            </a>
            <MagneticButton
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="text-xs px-4 py-2.5"
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
      <section className="relative min-h-[85vh] flex flex-col justify-center px-4 sm:px-6 pt-6 pb-20 overflow-hidden">
        {/* Living Calm Mist Procedural Wave */}
        <CalmMistCanvas />

        {/* Text Reveal Choreography */}
        <KineticHeroReveal />

        {/* Physical-to-Digital Minimalist Artifact Showcase */}
        <div className="max-w-4xl mx-auto w-full mt-4">
          <div className="bg-[#ffffff]/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#b3bfcb]/70 shadow-[0_12px_40px_rgba(119,140,164,0.12)]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* The Physical Stand (Right in RTL) */}
              <div className="md:col-span-5 bg-[#eef1f4] rounded-2xl p-6 border border-[#b3bfcb]/60 text-center space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-[#313c45] text-[#f7f9fb] text-[11px] font-semibold">
                  ملصق الاستقبال الذكي
                </div>
                <div className="w-28 h-28 mx-auto bg-[#ffffff] rounded-2xl p-3 border border-[#b3bfcb]/80 flex items-center justify-center shadow-sm">
                  <QrCode className="w-full h-full text-[#313c45]" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#313c45]">امسح الكود بهاتفك وخذ دورك</p>
                  <p className="text-[11px] text-[#4f6271]">بدون تحميل أي تطبيق • في ثانية واحدة</p>
                </div>
              </div>

              {/* The Visitor Phone Screen (Left in RTL) */}
              <div className="md:col-span-7 bg-[#ffffff] rounded-2xl p-6 border border-[#b3bfcb]/80 shadow-sm space-y-4 text-right">
                <div className="flex items-center justify-between border-b border-[#b3bfcb]/40 pb-3">
                  <span className="text-xs font-bold text-[#313c45]">تذكرة انتظار رقمية تفاعلية</span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#4f6271]">
                    <Volume2 className="w-3.5 h-3.5 text-[#778ca4]" />
                    <span>تنبيه صوتي مفعّل</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#f7f9fb] border border-[#b3bfcb]/50">
                    <span className="text-[10px] text-[#4f6271] block mb-1">رقم تذكرتك</span>
                    <span className="text-2xl font-bold text-[#313c45] tracking-tight">#14</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#f7f9fb] border border-[#b3bfcb]/50">
                    <span className="text-[10px] text-[#4f6271] block mb-1">الرقم المستدعى الآن</span>
                    <span className="text-2xl font-bold text-[#778ca4] tracking-tight">#12</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#eef1f4] border border-[#b3bfcb]/40 flex items-center justify-between text-xs">
                  <span className="text-[#313c45] font-semibold">باقي أمامك شخصين فقط</span>
                  <span className="text-[#4f6271]">الدخول التقريبي: <strong className="text-[#313c45]">11:20 ص</strong></span>
                </div>

                <p className="text-[11px] text-[#4f6271] leading-relaxed">
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
      <section id="comparison" className="py-24 px-4 sm:px-6 bg-[#eef1f4]/70 border-t border-[#b3bfcb]/40">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-14">
          <span className="text-xs font-bold tracking-wider text-[#778ca4] uppercase">
            مقارنة واقعية
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#313c45] tracking-tight heading-balance">
            هل تعاني من هذه المشاكل في قاعة انتظارك كل يوم؟
          </h2>
          <p className="text-sm sm:text-base text-[#4f6271] max-w-2xl mx-auto leading-relaxed">
            الفوضى والتوتر ليسا قدراً محتوماً في قاعات الاستقبال. انظر كيف يتحول يومك العملي مع NextDZ.
          </p>
        </div>

        <BeforeAfterComparison />
      </section>

      {/* =========================================================================
          SECTION 3: كيف يعمل في 3 خطوات بسيطة؟ (HOW IT WORKS)
          ========================================================================= */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-[#f7f9fb] border-t border-[#b3bfcb]/40">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold tracking-wider text-[#778ca4] uppercase">
            بساطة مطلقة
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#313c45] tracking-tight heading-balance">
            كيف يعمل NextDZ في 3 خطوات بسيطة؟
          </h2>
          <p className="text-sm sm:text-base text-[#4f6271] max-w-2xl mx-auto leading-relaxed">
            بدون فني تركيب، وبدون عقود صيانة معقدة. يبدأ النظام بالعمل في عيادتك أو محلك خلال دقائق معدودة.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-[#ffffff] rounded-2xl p-8 border border-[#b3bfcb]/70 shadow-[0_4px_20px_rgba(119,140,164,0.06)] space-y-5 text-right relative">
            <div className="w-10 h-10 rounded-full bg-[#313c45] text-[#f7f9fb] font-bold text-sm flex items-center justify-center">
              01
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#313c45]">
              اطبع ملصق QR واحد وضعه في الاستقبال
            </h3>
            <p className="text-xs sm:text-sm text-[#4f6271] leading-relaxed">
              نوفر لك كود QR مخصص لنشاطك. اطبعه على ورقة عادية أو استاند أكريليك وضعه على طاولة السكرتيرة. لا أسلاك، ولا أجهزة كشك باهظة.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#ffffff] rounded-2xl p-8 border border-[#b3bfcb]/70 shadow-[0_4px_20px_rgba(119,140,164,0.06)] space-y-5 text-right relative">
            <div className="w-10 h-10 rounded-full bg-[#313c45] text-[#f7f9fb] font-bold text-sm flex items-center justify-center">
              02
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#313c45]">
              يمسح الزائر الكود بهاتفه ويغادر بارتياح
            </h3>
            <p className="text-xs sm:text-sm text-[#4f6271] leading-relaxed">
              بدون تحميل تطبيق أو إنشاء حساب. يرى الزائر رقمه ووقت دخوله التقريبي، وله كامل الحرية في الانتظار بالخارج أو في مقهى مجاور.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#ffffff] rounded-2xl p-8 border border-[#b3bfcb]/70 shadow-[0_4px_20px_rgba(119,140,164,0.06)] space-y-5 text-right relative">
            <div className="w-10 h-10 rounded-full bg-[#313c45] text-[#f7f9fb] font-bold text-sm flex items-center justify-center">
              03
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#313c45]">
              تناديه بضغطة زر ويصلك في وقته
            </h3>
            <p className="text-xs sm:text-sm text-[#4f6271] leading-relaxed">
              من هاتفك أو كمبيوترك، اضغط "استدعاء التالي". يهتز هاتف المراجع بنغمة لطيفة ليدخل مباشرة، ثم يقيّم تجربته بلمسة واحدة عند خروجه.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: مصمم لكل الحالات الواقعية (REAL-WORLD SOLUTIONS)
          ========================================================================= */}
      <section id="real-scenarios" className="py-24 px-4 sm:px-6 bg-[#eef1f4]/70 border-t border-[#b3bfcb]/40">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-14">
          <span className="text-xs font-bold tracking-wider text-[#778ca4] uppercase">
            حلول ميدانية ذكية
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#313c45] tracking-tight heading-balance">
            مصمم لكل الحالات الواقعية التي تحدث كل يوم
          </h2>
          <p className="text-sm sm:text-base text-[#4f6271] max-w-2xl mx-auto leading-relaxed">
            فهمنا أدق تفاصيل العمل اليومي؛ لذلك صممنا حلولاً جاهزة للتأخير، كبار السن، وشاشات العرض الكبيرة.
          </p>
        </div>

        <ScenarioTabs />
      </section>

      {/* =========================================================================
          SECTION 5: لمن صُمّم NextDZ؟ (WHO IT IS BUILT FOR)
          ========================================================================= */}
      <section id="for-who" className="py-24 px-4 sm:px-6 bg-[#f7f9fb] border-t border-[#b3bfcb]/40">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold tracking-wider text-[#778ca4] uppercase">
            القطاعات المستفيدة
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#313c45] tracking-tight heading-balance">
            لمن صُمّم NextDZ؟
          </h2>
          <p className="text-sm sm:text-base text-[#4f6271] max-w-2xl mx-auto leading-relaxed">
            لكل مؤسسة أو مهني يقدّر وقته ويريد تقديم تجربة استقبال تليق بمكانته وسمعته.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Clinics */}
          <div className="bg-[#ffffff] rounded-2xl p-7 border border-[#b3bfcb]/70 shadow-sm space-y-4 text-right hover:border-[#778ca4] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#313c45]">
              العيادات الطبية والمراكز الصحية
            </h3>
            <p className="text-xs text-[#4f6271] leading-relaxed">
              إنهاء الضجيج والتجمهر حول مكتب السكرتيرة، وتنظيم فترات الكشف بخصوصية وراحة نفسية للمرضى وذويهم.
            </p>
          </div>

          {/* Card 2: Labs */}
          <div className="bg-[#ffffff] rounded-2xl p-7 border border-[#b3bfcb]/70 shadow-sm space-y-4 text-right hover:border-[#778ca4] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
              <TestTube2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#313c45]">
              مخابر التحاليل ومراكز الأشعة
            </h3>
            <p className="text-xs text-[#4f6271] leading-relaxed">
              توزيع سحب العينات وتسليم النتائج بسلاسة تامة، مع منع الاكتظاظ في الممرات الصباحية المزدحمة.
            </p>
          </div>

          {/* Card 3: Salons */}
          <div className="bg-[#ffffff] rounded-2xl p-7 border border-[#b3bfcb]/70 shadow-sm space-y-4 text-right hover:border-[#778ca4] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
              <Scissors className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#313c45]">
              صالونات الحلاقة ومراكز العناية
            </h3>
            <p className="text-xs text-[#4f6271] leading-relaxed">
              احترام وقت الزبون العصري؛ يأخذ دوره وينتظر في سيارته أو يقضي مشاويره ويعود قبل كرسيه بدقائق.
            </p>
          </div>

          {/* Card 4: Notary */}
          <div className="bg-[#ffffff] rounded-2xl p-7 border border-[#b3bfcb]/70 shadow-sm space-y-4 text-right hover:border-[#778ca4] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#313c45]">
              مكاتب التوثيق والاستشارات
            </h3>
            <p className="text-xs text-[#4f6271] leading-relaxed">
              تنظيم مراجعي المعاملات والعقود الرسمية في هدوء تام يحفظ للمكتب وقاره وهيبته المهنية.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5.5: جرّب بنفسك تجربة النظام الحقيقية (LIVE SYSTEM VERIFICATION)
          ========================================================================= */}
      <section id="live-experience" className="py-24 px-4 sm:px-6 bg-[#eef1f4] border-t border-[#b3bfcb]/50">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-14">
          <span className="text-xs font-bold tracking-wider text-[#778ca4] uppercase">
            معاينة فورية حقيقية
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#313c45] tracking-tight heading-balance">
            جرّب النظام الحقيقي بنفسك الآن
          </h2>
          <p className="text-sm sm:text-base text-[#4f6271] max-w-2xl mx-auto leading-relaxed">
            لا نكتفي بالوعود؛ النظام يعمل بكامل قوته الآن. اضغط على أي شاشة بالأسفل لتجربتها مباشرة في متصفحك.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Live Screen 1: Visitor Mobile Ticket */}
          <div className="bg-[#ffffff] rounded-3xl p-7 border border-[#b3bfcb]/80 shadow-sm space-y-5 text-right flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#313c45]">
                1. شاشة المراجع التفاعلية
              </h3>
              <p className="text-xs text-[#4f6271] leading-relaxed">
                افتح الرابط بهاتفك كأنك زائر مسح الكود، وشاهد التذكرة والعد التنازلي ونغمة التنبيه عند اقتراب دورك.
              </p>
            </div>

            <div className="pt-4 border-t border-[#b3bfcb]/40">
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
          <div className="bg-[#ffffff] rounded-3xl p-7 border border-[#b3bfcb]/80 shadow-sm space-y-5 text-right flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#313c45]">
                2. لوحة تحكم المسير / الطبيب
              </h3>
              <p className="text-xs text-[#4f6271] leading-relaxed">
                لوحة سريعة محمية برمز PIN سري (<span className="font-mono font-bold text-[#313c45]">1234</span>)، تتيح لك النداء، التأجيل، وإتمام الخدمة بلمسة واحدة.
              </p>
            </div>

            <div className="pt-4 border-t border-[#b3bfcb]/40">
              <a
                href="/admin/clinic-amal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#313c45] text-[#f7f9fb] text-xs font-bold hover:bg-[#232b32] transition"
              >
                <span>فتح لوحة التحكم (PIN: 1234)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Live Screen 3: Smart TV Waiting Hall */}
          <div className="bg-[#ffffff] rounded-3xl p-7 border border-[#b3bfcb]/80 shadow-sm space-y-5 text-right flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#eef1f4] text-[#313c45] flex items-center justify-center">
                <Tv className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#313c45]">
                3. شاشة العرض للتلفاز (Smart TV)
              </h3>
              <p className="text-xs text-[#4f6271] leading-relaxed">
                شاشة سينمائية بدقة 1080p تعمل على أي تلفاز متصل بالإنترنت، مع جرس نداء صوتي عند استدعاء كل تذكرة.
              </p>
            </div>

            <div className="pt-4 border-t border-[#b3bfcb]/40">
              <a
                href="/display/clinic-amal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#313c45] text-[#f7f9fb] text-xs font-bold hover:bg-[#232b32] transition"
              >
                <span>معاينة شاشة التلفاز الذكي</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6: CLOSING COMMERCIAL CTA & HIGH-CONTRAST EDITORIAL FOOTER
          ========================================================================= */}
      <footer className="bg-[#313c45] text-[#d5dbe2] pt-20 pb-12 px-4 sm:px-6 border-t border-[#232b32]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4f6271]/30 border border-[#b3bfcb]/20 text-xs font-semibold text-[#f7f9fb]">
            <Sparkles className="w-3.5 h-3.5 text-[#b3bfcb]" />
            <span>ابدأ التحول إلى الهدوء اليوم</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-[#f7f9fb] tracking-tight heading-balance leading-tight">
            اجعل قاعة انتظارك عنواناً للراحة والاحترافية.
          </h2>

          <p className="text-sm sm:text-base text-[#b3bfcb] max-w-xl mx-auto leading-relaxed">
            لا داعي لتأجيل راحة بالك وسكرتيرتك. تواصل معنا مباشرة لتجهيز كود عيادتك أو صالونك وبدء الاستخدام فوراً.
          </p>

          {/* Big WhatsApp Direct CTA Button */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="bg-[#f7f9fb] text-[#313c45] hover:bg-[#eef1f4] hover:text-[#232b32] text-sm sm:text-base px-8 py-4 shadow-[0_4px_25px_rgba(0,0,0,0.3)] border-transparent"
            >
              <MessageCircle className="w-5 h-5 text-[#313c45]" />
              <span>تواصل معنا عبر واتساب: {PHONE_NUMBER}</span>
            </MagneticButton>

            <a
              href="tel:0666568039"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-sm font-semibold border border-[#b3bfcb]/30 text-[#f7f9fb] hover:bg-[#4f6271]/30 transition"
            >
              <PhoneCall className="w-4 h-4 text-[#b3bfcb]" />
              <span>اتصال هاتفي مباشر</span>
            </a>
          </div>

          {/* Brand Mark and Copyright */}
          <div className="pt-16 mt-16 border-t border-[#4f6271]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#b3bfcb]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#f7f9fb]">NextDZ</span>
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
