'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Users,
  Check,
  ChevronDown,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import CalmMistCanvas from '@/components/landing/CalmMistCanvas';
import KineticHeroReveal from '@/components/landing/KineticHeroReveal';
import BeforeAfterComparison from '@/components/landing/BeforeAfterComparison';
import ScenarioTabs from '@/components/landing/ScenarioTabs';
import MagneticButton from '@/components/landing/MagneticButton';
import NextDZLogo from '@/components/NextDZLogo';
import ThemeToggle from '@/components/ThemeToggle';
import PlanBadge from '@/components/PlanBadge';

const PHONE_NUMBER = '0666 56 80 39';
const WHATSAPP_INTL = '213666568039';
const WHATSAPP_URL = 'https://wa.me/213666568039?text=مرحباً،%20أريد%20تفعيل%20نظام%20NextDZ%20لقاعة%20الانتظار%20لدي';

export default function Home() {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const pricing = {
    starter: {
      title: 'الباقة الأساسية',
      subtitle: 'للعيادات الفردية، صالونات الحلاقة، ومكاتب الأعمال الفردية',
      price: isYearly ? '15,000' : '1,500',
      period: isYearly ? 'سنوياً' : 'شهرياً',
      subtext: isYearly ? 'ما يعادل 1,250 دج / شهر فقط (وفرت شهرين مجاناً)' : 'تجديد شهري مرن بدون أي التزام مسبق',
      features: [
        { text: 'رابط خاص وملصق QR رسمي للعيادة جاهز للطباعة (A4)', included: true },
        { text: 'تذاكر رقمية تفاعلية غير محدودة طوال فترة الاشتراك', included: true },
        { text: 'تنبيه صوتي واهتزاز على هاتف المراجع عند اقتراب دوره', included: true },
        { text: 'ريموت المسير للهاتف والكمبيوتر (استدعاء، تأكيد، إنهاء)', included: true },
        { text: 'دعم فني وإعداد أولي سريع في دقائق معدودة', included: true },
        { text: 'شاشة صالة الانتظار للتلفاز الذكي (Smart TV)', included: false },
        { text: 'نظام التأجيل الذكي (Hold) للزبائن المتأخرين', included: false },
        { text: 'تصدير تقارير Excel و CSV اليومية لحساب الإحصائيات', included: false },
      ],
      whatsappMsg: `مرحباً، أريد الاشتراك في الباقة الأساسية لنظام NextDZ (${isYearly ? '15,000 دج / سنوياً' : '1,500 دج / شهرياً'})`,
    },
    pro: {
      title: 'باقة المحترفين (Pro)',
      subtitle: 'الحل المتكامل للعيادات التخصصية، طب الأسنان، والمراكز النشطة',
      price: isYearly ? '25,000' : '2,500',
      period: isYearly ? 'سنوياً' : 'شهرياً',
      subtext: isYearly ? 'ما يعادل 2,080 دج / شهر فقط (وفرت 5,000 دج سنوياً)' : 'الباقة الأكثر طلباً للعيادات والمراكز النشطة',
      features: [
        { text: 'كل مميزات الباقة الأساسية بالكامل', included: true, highlight: true },
        { text: 'شاشة صالة الانتظار للتلفاز Full HD 1080p (بفتح الرابط فقط)', included: true, highlight: true },
        { text: 'جرس نداء صوتي عربي تلقائي عند استدعاء كل مراجع', included: true, highlight: true },
        { text: 'نظام التأجيل الذكي (Hold) للمتأخرين دون ضياع ترتيبهم', included: true, highlight: true },
        { text: 'تصدير تقارير Excel و CSV اليومية لسجلات المؤسسة بضغطة زر', included: true },
        { text: 'تقييمات رضا المراجعين الفورية (😄/😐/🙁) عند الخروج', included: true },
        { text: 'دعم فني وتدريب مجاني للسكرتيرة وطاقم العمل', included: true },
      ],
      whatsappMsg: `مرحباً، أريد الاشتراك في باقة المحترفين Pro لنظام NextDZ (${isYearly ? '25,000 دج / سنوياً' : '2,500 دج / شهرياً'})`,
    },
    elite: {
      title: 'باقة النخبة (Elite VIP)',
      subtitle: 'للمجمعات الطبية الكبرى، المختبرات، والمراكز متعددة المكاتب',
      price: isYearly ? '30,000' : '3,000',
      period: isYearly ? 'سنوياً' : 'شهرياً',
      subtext: isYearly ? 'ما يعادل 2,500 دج / شهر فقط (وفرت 6,000 دج سنوياً)' : 'خصم خاص للمجمعات الطبية والمؤسسات الكبرى',
      features: [
        { text: 'كل مميزات باقة المحترفين بالكامل', included: true, highlight: true },
        { text: 'ربط شاشات تلفاز متعددة في نفس المؤسسة (ممرات وقاعات مختلفة)', included: true, highlight: true },
        { text: 'تخصيص كامل للهوية (شعارك ورسالتك الترحيبية على كل الشاشات)', included: true, highlight: true },
        { text: 'إحصائيات تدفق المراجعين المتقدمة بالساعة وأوقات الذروة', included: true },
        { text: 'أولوية قصوى ودعم فني مخصص ومباشر على مدار الساعة (24/7)', included: true },
        { text: 'إشراف مباشر ومساعدة متقدمة في التجهيز الميداني والتدريب', included: true },
      ],
      whatsappMsg: `مرحباً، أريد الاشتراك في باقة النخبة Elite لنظام NextDZ (${isYearly ? '30,000 دج / سنوياً' : '3,000 دج / شهرياً'})`,
    },
  };

  const faqs = [
    {
      q: 'كيف أشترك وأفعّل النظام لعيادتي أو صالوني؟',
      a: 'الأمر فائق البساطة ويستغرق دقائق معدودة! يكفي أن تتواصل معنا عبر واتساب، وسنقوم بتفعيل حساب مؤسستك وتحديد الباقة المناسبة، وإرسال رابط لوحة التحكم وملصق الـ QR الجاهز للطباعة فوراً.',
    },
    {
      q: 'ما الفرق الجوهري بين الباقة الأساسية (1,500 دج) وباقة المحترفين (2,500 دج)؟',
      a: 'الباقة الأساسية ممتازة لمن يريد إلغاء التزاحم والطوابير الورقية والتحكم من الهاتف أو الكمبيوتر. بينما باقة المحترفين تشمل شاشة تلفاز صالة الانتظار Full HD مع جرس النداء الصوتي، وتصدير تقارير Excel، ونظام التأجيل الذكي (Hold) للزبائن المتأخرين، وتقييمات رضا المراجعين.',
    },
    {
      q: 'هل يمكنني الدفع شهرياً أو الاستفادة من خصم الدفع السنوي؟',
      a: 'نعم بالتأكيد! يمكنك الدفع شهرياً بكل مرونة دون التزام، أو اختيار الاشتراك السنوي لتحصل على شهرين كاملين مجاناً (توفير حتى 6,000 دج سنوياً) مع تثبيت السعر لعام كامل.',
    },
    {
      q: 'هل يحتاج المراجع أو المريض إلى تحميل أي تطبيق على هاتفه؟',
      a: 'إطلاقاً! يفتح المراجع كاميرا هاتفه ويمسح رمز QR الموجود على الملصق، فيفتح له النظام فوراً كصفحة ويب سريعة جداً تعمل على أي هاتف (iPhone أو Android) بدون تحميل تطبيق أو إنشاء حساب.',
    },
    {
      q: 'هل أحتاج لشراء شاشات باهظة أو طابعات تذاكر ورقية إضافية؟',
      a: 'لا نهائياً، تكلفة العتاد الإضافي 0 دج! تتحكم مباشرة من هاتفك الذكي أو حاسوبك المكتبي الحالي، وإذا أردت شاشة لصالة الانتظار، يكفي فتح رابط الشاشة في متصفح أي تلفاز Smart TV موجود لديك.',
    },
    {
      q: 'ماذا لو جاء مراجع كبير في السن أو لا يملك هاتفاً ذكياً؟',
      a: 'تم تزويد ريموت المسير بزر "تذكرة حضورية": يسجله المسير في ثوانٍ معدودة، ويظهر له النظام فوراً رقم التذكرة ووقت الدخول التقريبي ليخبره به، مع إمكانية إدخال رقم هاتفه لإجراء رنة سريعة (Bip) له عند اقتراب دوره.',
    },
    {
      q: 'ماذا يحدث إذا تأخر الزبون وكان خارج القاعة؟',
      a: 'يرسل النظام تنبيهاً واهتزازاً للمراجع عند اقتراب دوره ليحضر للقاعة. وإذا نودي ولم يحضر، يضغط الطبيب أو المسير على زر "تأجيل (Hold)" فيمر الذي بعده مباشرة دون تعطيل القاعة، وعندما يعود الزبون يُستدعى بنقرة واحدة.',
    },
  ];

  return (
    <div className="min-h-screen bg-slateNavy-950 text-slateNavy-100 font-sans antialiased overflow-x-hidden selection:bg-[#778ca4]/30 selection:text-slateNavy-100">
      
      {/* =========================================================================
          TOP COMMERCIAL NOTIFICATION TICKER - Responsive 390px
          ========================================================================= */}
      <div className="bg-slateNavy-900 text-slateNavy-400 text-xs py-2 px-3 sm:px-4 border-b border-slateNavy-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-3 text-center sm:text-right">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slateNavy-400 inline-block animate-ping" />
            <span className="font-bold text-slateNavy-100">NextDZ</span>
            <span className="text-slateNavy-400">— قاعة هادئة، سكرتيرة مرتاحة، زبائن راضون</span>
          </span>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slateNavy-300 hover:text-slateNavy-100 transition font-bold"
          >
            <MessageCircle className="w-3.5 h-3.5 text-slateNavy-400" />
            <span>طلب التفعيل الفوري عبر واتساب: {PHONE_NUMBER}</span>
          </a>
        </div>
      </div>

      {/* =========================================================================
          NAVIGATION HEADER
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-slateNavy-950/90 backdrop-blur-md border-b border-slateNavy-800 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Brand Logo & Wordmark */}
          <a href="#" className="inline-block group" aria-label="NextDZ الصفحة الرئيسية">
            <NextDZLogo width={40} height={26} />
          </a>

          {/* Editorial Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slateNavy-300">
            <a href="#comparison" className="hover:text-slateNavy-100 transition">المشاكل والحل</a>
            <a href="#how-it-works" className="hover:text-slateNavy-100 transition">كيف يعمل</a>
            <a href="#real-scenarios" className="hover:text-slateNavy-100 transition">حالات واقعية</a>
            <a href="#for-who" className="hover:text-slateNavy-100 transition">لمن صُمم</a>
            <a href="#live-experience" className="hover:text-slateNavy-100 transition">التجربة الحية</a>
            <a href="#pricing" className="hover:text-slateNavy-100 transition">باقات الاشتراك</a>
            <a href="#faq" className="hover:text-slateNavy-100 transition">الأسئلة الشائعة</a>
          </nav>

          {/* Quick Header CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle variant="compact" showLabel={false} />
            <a
              href="#live-experience"
              className="hidden sm:inline-flex text-xs font-bold text-slateNavy-300 hover:text-slateNavy-100 px-3 py-2 transition"
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
              <MessageCircle className="w-3.5 h-3.5 text-slateNavy-300" />
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
          <div className="bg-slateNavy-900 rounded-3xl p-5 sm:p-8 border border-slateNavy-800 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* The Physical Stand (Right in RTL) */}
              <div className="md:col-span-5 bg-slateNavy-850 rounded-2xl p-6 border border-slateNavy-800 text-center space-y-3.5">
                <div className="inline-block px-3 py-1 rounded-full bg-slateNavy-900 border border-slateNavy-800 text-slateNavy-100 text-[11px] font-bold">
                  ملصق الاستقبال الذكي
                </div>
                <div className="flex items-center justify-center pt-1" dir="ltr">
                  <NextDZLogo width={36} height={23} textSize="text-base" />
                </div>
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto bg-white rounded-2xl p-3 border border-slateNavy-800 flex items-center justify-center shadow-sm">
                  <QrCode className="w-full h-full text-slate-900" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slateNavy-100">امسح الكود بهاتفك وخذ دورك</p>
                  <p className="text-[11px] text-slateNavy-400 font-medium">بدون تحميل أي تطبيق • في ثوانٍ معدودة</p>
                </div>
              </div>

              {/* The Visitor Phone Screen (Left in RTL) */}
              <div className="md:col-span-7 bg-slateNavy-900 rounded-2xl p-5 sm:p-6 border border-slateNavy-800 shadow-sm space-y-4 text-right">
                <div className="flex items-center justify-between border-b border-slateNavy-800 pb-3">
                  <span className="text-xs font-bold text-slateNavy-100">تذكرة انتظار رقمية تفاعلية</span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slateNavy-100">
                    <Volume2 className="w-3.5 h-3.5 text-slateNavy-400" />
                    <span>تنبيه صوتي مفعّل</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slateNavy-850 border border-slateNavy-800">
                    <span className="text-[11px] font-bold text-slateNavy-400 block mb-1">تذكرتك الحالية</span>
                    <span className="text-xl sm:text-2xl font-bold text-slateNavy-100 tracking-tight">دورك قادم</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slateNavy-850 border border-slateNavy-800">
                    <span className="text-[11px] font-bold text-slateNavy-400 block mb-1">حالة الاستدعاء</span>
                    <span className="text-xl sm:text-2xl font-bold text-slateNavy-100 tracking-tight">المراجع الحالي داخل</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slateNavy-850 border border-slateNavy-800 flex items-center justify-between text-xs">
                  <span className="text-slateNavy-100 font-bold">باقي أمامك القليل فقط</span>
                  <span className="text-slateNavy-400 font-medium">تنبيه بالدخول فور اقتراب موعدك</span>
                </div>

                <p className="text-[11px] text-slateNavy-400 font-medium leading-relaxed">
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
      <section id="comparison" className="py-20 sm:py-24 px-4 sm:px-6 bg-slateNavy-950 border-t border-slateNavy-800">
        <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 mb-12 sm:mb-14">
          <span className="text-xs font-bold tracking-wider text-slateNavy-400 uppercase">
            مقارنة واقعية
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slateNavy-100 tracking-tight heading-balance">
            هل تعاني من هذه المشاكل في قاعة انتظارك كل يوم؟
          </h2>
          <p className="text-sm sm:text-base font-medium text-slateNavy-400 max-w-2xl mx-auto leading-relaxed">
            الفوضى والتوتر ليسا قدراً محتوماً في قاعات الاستقبال. انظر كيف يتحول يومك العملي مع NextDZ.
          </p>
        </div>

        <BeforeAfterComparison />
      </section>

      {/* =========================================================================
          SECTION 3: كيف يعمل في 3 خطوات بسيطة؟ (HOW IT WORKS)
          ========================================================================= */}
      <section id="how-it-works" className="py-20 sm:py-24 px-4 sm:px-6 bg-slateNavy-950 border-t border-slateNavy-800">
        <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 mb-14 sm:mb-16">
          <span className="text-xs font-bold tracking-wider text-slateNavy-400 uppercase">
            بساطة مطلقة
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slateNavy-100 tracking-tight heading-balance">
            كيف يعمل NextDZ في خطوات بسيطة؟
          </h2>
          <p className="text-sm sm:text-base font-medium text-slateNavy-400 max-w-2xl mx-auto leading-relaxed">
            بدون فني تركيب، وبدون عقود صيانة معقدة. يبدأ النظام بالعمل في عيادتك أو محلك خلال دقائق معدودة.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-slateNavy-900 rounded-2xl p-6 sm:p-8 border border-slateNavy-800 shadow-sm space-y-4 text-right">
            <div className="w-10 h-10 rounded-xl bg-slateNavy-850 border border-slateNavy-800 text-slateNavy-100 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slateNavy-100">
              اطبع ملصق الكود وضعه في الاستقبال
            </h3>
            <p className="text-xs sm:text-sm text-slateNavy-400 font-medium leading-relaxed">
              نوفر لك كود استقبال مخصص لنشاطك. اطبعه على ورقة عادية أو استاند أنيق وضعه على طاولة السكرتيرة. لا أسلاك، ولا أجهزة كشك مكلفة.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slateNavy-900 rounded-2xl p-6 sm:p-8 border border-slateNavy-800 shadow-sm space-y-4 text-right">
            <div className="w-10 h-10 rounded-xl bg-slateNavy-850 border border-slateNavy-800 text-slateNavy-100 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slateNavy-100">
              يمسح الزائر الكود بهاتفه ويغادر بارتياح
            </h3>
            <p className="text-xs sm:text-sm text-slateNavy-400 font-medium leading-relaxed">
              بدون تحميل تطبيق أو إنشاء حساب. يرى الزائر دوره ووقت دخوله التقريبي، وله كامل الحرية في الانتظار بالخارج أو في مكان مريح.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slateNavy-900 rounded-2xl p-6 sm:p-8 border border-slateNavy-800 shadow-sm space-y-4 text-right">
            <div className="w-10 h-10 rounded-xl bg-slateNavy-850 border border-slateNavy-800 text-slateNavy-100 flex items-center justify-center font-bold">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slateNavy-100">
              تناديه بضغطة زر ويصلك في وقته
            </h3>
            <p className="text-xs sm:text-sm text-slateNavy-400 font-medium leading-relaxed">
              من هاتفك أو كمبيوترك، اضغط استدعاء التالي. يهتز هاتف المراجع بنغمة لطيفة ليدخل مباشرة، ثم يقيّم تجربته بلمسة واحدة عند خروجه.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: مصمم لكل الحالات الواقعية (REAL-WORLD SOLUTIONS)
          ========================================================================= */}
      <section id="real-scenarios" className="py-20 sm:py-24 px-4 sm:px-6 bg-slateNavy-950 border-t border-slateNavy-800">
        <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 mb-12 sm:mb-14">
          <span className="text-xs font-bold tracking-wider text-slateNavy-400 uppercase">
            حلول ميدانية واقعية
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slateNavy-100 tracking-tight heading-balance">
            مصمم لكل الحالات الواقعية التي تحدث كل يوم
          </h2>
          <p className="text-sm sm:text-base font-medium text-slateNavy-400 max-w-2xl mx-auto leading-relaxed">
            فهمنا تفاصيل العمل اليومي؛ لذلك صممنا حلولاً جاهزة للتأخير المؤقت، كبار السن، وشاشات العرض الكبيرة.
          </p>
        </div>

        <ScenarioTabs />
      </section>

      {/* =========================================================================
          SECTION 5: لمن صُمّم NextDZ؟ (WHO IT IS BUILT FOR)
          ========================================================================= */}
      <section id="for-who" className="py-20 sm:py-24 px-4 sm:px-6 bg-slateNavy-950 border-t border-slateNavy-800">
        <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 mb-14 sm:mb-16">
          <span className="text-xs font-bold tracking-wider text-slateNavy-400 uppercase">
            القطاعات المستفيدة
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slateNavy-100 tracking-tight heading-balance">
            لمن صُمّم NextDZ؟
          </h2>
          <p className="text-sm sm:text-base font-medium text-slateNavy-400 max-w-2xl mx-auto leading-relaxed">
            لكل مؤسسة أو مهني يقدّر وقته ويريد تقديم تجربة استقبال تليق بمكانته وسمعته.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          
          {/* Card 1: Clinics */}
          <div className="bg-slateNavy-900 rounded-2xl p-6 sm:p-7 border border-slateNavy-800 shadow-sm space-y-3 sm:space-y-4 text-right hover:border-slateNavy-700 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-slateNavy-850 border border-slateNavy-800 text-slateNavy-100 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slateNavy-100">
              العيادات الطبية والمراكز الصحية
            </h3>
            <p className="text-xs text-slateNavy-400 font-medium leading-relaxed">
              إنهاء الضجيج والتجمهر حول مكتب السكرتيرة، وتنظيم فترات الكشف بخصوصية وراحة نفسية للمرضى وذويهم.
            </p>
          </div>

          {/* Card 2: Labs */}
          <div className="bg-slateNavy-900 rounded-2xl p-6 sm:p-7 border border-slateNavy-800 shadow-sm space-y-3 sm:space-y-4 text-right hover:border-slateNavy-700 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-slateNavy-850 border border-slateNavy-800 text-slateNavy-100 flex items-center justify-center">
              <TestTube2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slateNavy-100">
              مخابر التحاليل ومراكز الأشعة
            </h3>
            <p className="text-xs text-slateNavy-400 font-medium leading-relaxed">
              توزيع سحب العينات وتسليم النتائج بسلاسة تامة، مع منع الاكتظاظ في الممرات الصباحية المزدحمة.
            </p>
          </div>

          {/* Card 3: Salons */}
          <div className="bg-slateNavy-900 rounded-2xl p-6 sm:p-7 border border-slateNavy-800 shadow-sm space-y-3 sm:space-y-4 text-right hover:border-slateNavy-700 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-slateNavy-850 border border-slateNavy-800 text-slateNavy-100 flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slateNavy-100">
              صالونات الحلاقة ومراكز العناية
            </h3>
            <p className="text-xs text-slateNavy-400 font-medium leading-relaxed">
              احترام وقت الزبون؛ يأخذ دوره وينتظر في سيارته أو يقضي مشاويره ويعود قبل كرسيه بدقائق.
            </p>
          </div>

          {/* Card 4: Notary */}
          <div className="bg-slateNavy-900 rounded-2xl p-6 sm:p-7 border border-slateNavy-800 shadow-sm space-y-3 sm:space-y-4 text-right hover:border-slateNavy-700 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl bg-slateNavy-850 border border-slateNavy-800 text-slateNavy-100 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slateNavy-100">
              مكاتب التوثيق والاستشارات
            </h3>
            <p className="text-xs text-slateNavy-400 font-medium leading-relaxed">
              تنظيم مراجعي المعاملات والعقود الرسمية في هدوء تام يحفظ للمكتب وقاره وهيبته المهنية.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5.5: جرّب بنفسك تجربة النظام الحقيقية (LIVE SYSTEM VERIFICATION)
          ========================================================================= */}
      <section id="live-experience" className="py-20 sm:py-24 px-4 sm:px-6 bg-slateNavy-950 border-t border-slateNavy-800">
        <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 mb-12 sm:mb-14">
          <span className="text-xs font-bold tracking-wider text-slateNavy-400 uppercase">
            معاينة فورية حقيقية
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slateNavy-100 tracking-tight heading-balance">
            جرّب النظام الحقيقي بنفسك الآن
          </h2>
          <p className="text-sm sm:text-base font-medium text-slateNavy-400 max-w-2xl mx-auto leading-relaxed">
            النظام يعمل بكامل طاقته الآن. اضغط على أي شاشة بالأسفل لتجربتها مباشرة في متصفحك.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Live Screen 1: Visitor Mobile Ticket */}
          <div className="bg-slateNavy-900 rounded-3xl p-6 sm:p-7 border border-slateNavy-800 shadow-sm space-y-5 text-right flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slateNavy-850 border border-slateNavy-800 text-slateNavy-100 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slateNavy-100">
                شاشة المراجع التفاعلية
              </h3>
              <p className="text-xs text-slateNavy-400 font-medium leading-relaxed">
                افتح الرابط بهاتفك كأنك زائر مسح الكود، وشاهد التذكرة والعد التنازلي ونغمة التنبيه عند اقتراب دورك.
              </p>
            </div>

            <div className="pt-4 border-t border-slateNavy-800">
              <a
                href="/q/clinic-amal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slateNavy-950 hover:bg-slateNavy-850 text-slateNavy-100 text-xs font-bold border border-slateNavy-800 transition shadow-sm"
              >
                <span>فتح تذكرة المراجع الحية</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Live Screen 2: Controller Dashboard */}
          <div className="bg-slateNavy-900 rounded-3xl p-6 sm:p-7 border border-slateNavy-800 shadow-sm space-y-5 text-right flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slateNavy-850 border border-slateNavy-800 text-slateNavy-100 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slateNavy-100">
                لوحة تحكم المسير والطبيب
              </h3>
              <p className="text-xs text-slateNavy-400 font-medium leading-relaxed">
                لوحة سريعة محمية برمز دخول تجريبي خاص، تتيح لك الاستدعاء، التأجيل، وإنهاء الكشف بلمسة واحدة.
              </p>
            </div>

            <div className="pt-4 border-t border-slateNavy-800">
              <a
                href="/admin/clinic-amal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slateNavy-950 hover:bg-slateNavy-850 text-slateNavy-100 text-xs font-bold border border-slateNavy-800 transition shadow-sm"
              >
                <span>فتح لوحة التحكم التجريبية</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Live Screen 3: Smart TV Waiting Hall */}
          <div className="bg-slateNavy-900 rounded-3xl p-6 sm:p-7 border border-slateNavy-800 shadow-sm space-y-5 text-right flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slateNavy-850 border border-slateNavy-800 text-slateNavy-100 flex items-center justify-center">
                <Tv className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slateNavy-100">
                شاشة العرض لصالة الانتظار
              </h3>
              <p className="text-xs text-slateNavy-400 font-medium leading-relaxed">
                شاشة سينمائية عالية الوضوح تعمل على أي شاشة متصلة بالإنترنت، مع جرس نداء صوتي عند استدعاء كل تذكرة.
              </p>
            </div>

            <div className="pt-4 border-t border-slateNavy-800">
              <a
                href="/display/clinic-amal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slateNavy-950 hover:bg-slateNavy-850 text-slateNavy-100 text-xs font-bold border border-slateNavy-800 transition shadow-sm"
              >
                <span>معاينة شاشة الصالة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6: باقات الاشتراك وخطط الأسعار (PRICING & PACKAGES)
          ========================================================================= */}
      <section id="pricing" className="py-20 sm:py-24 px-4 sm:px-6 bg-slateNavy-950 border-t border-slateNavy-800">
        <div className="max-w-6xl mx-auto space-y-12 sm:space-y-14">
          
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4">
            <span className="text-xs font-bold tracking-wider text-slateNavy-400 uppercase inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slateNavy-300" />
              <span>خطط شفافة ومدروسة</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slateNavy-100 tracking-tight heading-balance">
              باقات تناسب حجم نشاطك وتضمن هدوء قاعتك
            </h2>
            <p className="text-sm sm:text-base font-medium text-slateNavy-400 leading-relaxed">
              ادفع شهرياً بمرونة كاملة بدون أي التزام، أو وفّر شهرين كاملين مجاناً عند اختيار الاشتراك السنوي.
            </p>

            {/* Monthly / Yearly Switcher */}
            <div className="pt-4 flex items-center justify-center">
              <div className="bg-slateNavy-900 border border-slateNavy-800 p-1 rounded-2xl flex items-center gap-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setIsYearly(false)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    !isYearly 
                      ? 'bg-slateNavy-800 text-slateNavy-100 shadow-sm' 
                      : 'text-slateNavy-400 hover:text-slateNavy-100'
                  }`}
                >
                  دفع شهري
                </button>
                <button
                  type="button"
                  onClick={() => setIsYearly(true)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isYearly 
                      ? 'bg-slateNavy-800 text-slateNavy-100 shadow-sm' 
                      : 'text-slateNavy-400 hover:text-slateNavy-100'
                  }`}
                >
                  <span>دفع سنوي</span>
                  <span className="text-[10px] bg-slateNavy-850 text-slateNavy-200 px-2 py-0.5 rounded-full font-bold border border-slateNavy-800">
                    وفر شهرين 🎁
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            
            {/* TIER 1: STARTER */}
            <div className="bg-slateNavy-900 rounded-3xl p-6 sm:p-8 border border-slateNavy-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <PlanBadge plan="starter" size="sm" />
                  <span className="text-[11px] font-bold text-slateNavy-400">العيادات الفردية والصالونات</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slateNavy-100">{pricing.starter.title}</h3>
                  <p className="text-xs text-slateNavy-400 font-medium mt-1 leading-relaxed">{pricing.starter.subtitle}</p>
                </div>

                <div className="py-4 border-y border-slateNavy-800/80 space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-bold text-slateNavy-100 tracking-tight">{pricing.starter.price}</span>
                    <span className="text-xs font-bold text-slateNavy-400">دج / {pricing.starter.period}</span>
                  </div>
                  <p className="text-[11px] text-slateNavy-400 font-medium">{pricing.starter.subtext}</p>
                </div>

                <ul className="space-y-3 text-xs">
                  {pricing.starter.features.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      {item.included ? (
                        <Check className="w-4 h-4 text-slateNavy-200 shrink-0 mt-0.5" />
                      ) : (
                        <span className="w-4 h-4 text-slateNavy-500 shrink-0 text-center font-bold text-xs select-none">—</span>
                      )}
                      <span className={item.included ? 'text-slateNavy-200 font-medium' : 'text-slateNavy-400 line-through decoration-slateNavy-500'}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(pricing.starter.whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slateNavy-800 text-slateNavy-100 bg-slateNavy-950 hover:bg-slateNavy-850 text-xs font-bold transition shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-slateNavy-300" />
                  <span>طلب الباقة الأساسية عبر واتساب</span>
                </a>
              </div>
            </div>

            {/* TIER 2: PRO (MOST POPULAR) */}
            <div className="bg-slateNavy-900 rounded-3xl p-6 sm:p-8 border-2 border-slateNavy-700 shadow-lg flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-slateNavy-800 text-slateNavy-100 text-[11px] font-bold rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap border border-slateNavy-700">
                <Sparkles className="w-3.5 h-3.5 text-slateNavy-300" />
                <span>الباقة الأكثر طلباً للعيادات والمراكز</span>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <PlanBadge plan="pro" size="sm" />
                  <span className="text-[11px] font-bold text-slateNavy-300">العيادات النشطة</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slateNavy-100">{pricing.pro.title}</h3>
                  <p className="text-xs text-slateNavy-400 font-medium mt-1 leading-relaxed">{pricing.pro.subtitle}</p>
                </div>

                <div className="py-4 border-y border-slateNavy-800/80 space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-bold text-slateNavy-100 tracking-tight">{pricing.pro.price}</span>
                    <span className="text-xs font-bold text-slateNavy-400">دج / {pricing.pro.period}</span>
                  </div>
                  <p className="text-[11px] text-slateNavy-200 font-bold">{pricing.pro.subtext}</p>
                </div>

                <ul className="space-y-3 text-xs">
                  {pricing.pro.features.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-slateNavy-100 shrink-0 mt-0.5" />
                      <span className={item.highlight ? 'text-slateNavy-100 font-bold' : 'text-slateNavy-200 font-medium'}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(pricing.pro.whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slateNavy-100 text-slateNavy-950 hover:bg-white text-xs font-bold transition shadow-md"
                >
                  <MessageCircle className="w-4 h-4 text-slateNavy-950" />
                  <span>طلب باقة المحترفين عبر واتساب</span>
                </a>
              </div>
            </div>

            {/* TIER 3: ELITE VIP */}
            <div className="bg-slateNavy-900 rounded-3xl p-6 sm:p-8 border border-slateNavy-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <PlanBadge plan="elite" size="sm" />
                  <span className="text-[11px] font-bold text-slateNavy-400">المجمعات الكبرى</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slateNavy-100">{pricing.elite.title}</h3>
                  <p className="text-xs text-slateNavy-400 font-medium mt-1 leading-relaxed">{pricing.elite.subtitle}</p>
                </div>

                <div className="py-4 border-y border-slateNavy-800/80 space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-bold text-slateNavy-100 tracking-tight">{pricing.elite.price}</span>
                    <span className="text-xs font-bold text-slateNavy-400">دج / {pricing.elite.period}</span>
                  </div>
                  <p className="text-[11px] text-slateNavy-400 font-medium">{pricing.elite.subtext}</p>
                </div>

                <ul className="space-y-3 text-xs">
                  {pricing.elite.features.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-slateNavy-200 shrink-0 mt-0.5" />
                      <span className={item.highlight ? 'text-slateNavy-100 font-bold' : 'text-slateNavy-200 font-medium'}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(pricing.elite.whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slateNavy-800 text-slateNavy-100 bg-slateNavy-950 hover:bg-slateNavy-850 text-xs font-bold transition shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-slateNavy-300" />
                  <span>طلب باقة النخبة عبر واتساب</span>
                </a>
              </div>
            </div>

          </div>

          {/* Zero-Hardware & Peace-of-Mind Guarantee Strip */}
          <div className="bg-slateNavy-900 rounded-2xl p-5 sm:p-6 border border-slateNavy-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slateNavy-850 border border-slateNavy-800 flex items-center justify-center text-slateNavy-100 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slateNavy-100">تكلفة العتاد الإضافي 0 دج • بدون أي التزام طويل الأجل</h4>
                <p className="text-xs text-slateNavy-400 font-medium">يعمل مباشرة على هاتفك وحاسوبك المكتبي وتلفازك الموجود حالياً، دون شراء أي أجهزة خاصة.</p>
              </div>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slateNavy-100 hover:text-slateNavy-300 underline underline-offset-4 shrink-0"
            >
              <span>استشارة سريعة لتحديد باقتك</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 7: الأسئلة الأكثر شيوعاً (FAQ ACCORDION)
          ========================================================================= */}
      <section id="faq" className="py-20 sm:py-24 px-4 sm:px-6 bg-slateNavy-950 border-t border-slateNavy-800">
        <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12">
          
          <div className="text-center space-y-3 sm:space-y-4">
            <span className="text-xs font-bold tracking-wider text-slateNavy-400 uppercase">
              إجابات واضحة ومباشرة
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slateNavy-100 tracking-tight heading-balance">
              الأسئلة الأكثر شيوعاً
            </h2>
            <p className="text-sm sm:text-base font-medium text-slateNavy-400 max-w-2xl mx-auto leading-relaxed">
              كل ما ترغب بمعرفته حول آلية التشغيل، شاشات العرض، وإلغاء الطابور الورقي نهائياً.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-slateNavy-900 border border-slateNavy-800 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slateNavy-100 hover:bg-slateNavy-850 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slateNavy-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-slateNavy-100' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slateNavy-300 font-medium leading-relaxed border-t border-slateNavy-800 bg-slateNavy-950/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 8: CLOSING COMMERCIAL CTA & HIGH-CONTRAST EDITORIAL FOOTER
          ========================================================================= */}
      <footer className="bg-slateNavy-950 text-slateNavy-400 pt-16 sm:pt-20 pb-12 px-4 sm:px-6 border-t border-slateNavy-800">
        <div className="max-w-4xl mx-auto text-center space-y-7 sm:space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slateNavy-900 border border-slateNavy-800 text-xs font-bold text-slateNavy-100">
            <Sparkles className="w-3.5 h-3.5 text-slateNavy-400" />
            <span>ابدأ التحول إلى الهدوء اليوم</span>
          </div>

          <h2 className="text-2xl sm:text-5xl font-bold text-slateNavy-100 tracking-tight heading-balance leading-tight">
            اجعل قاعة انتظارك عنواناً للراحة والاحترافية.
          </h2>

          <p className="text-sm sm:text-base font-normal text-slateNavy-400 max-w-xl mx-auto leading-relaxed">
            لا داعي لتأجيل راحة بالك وسكرتيرتك. تواصل معنا مباشرة لتجهيز كود عيادتك أو صالونك وبدء الاستخدام فوراً.
          </p>

          {/* Big WhatsApp Direct CTA Button */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto sm:max-w-none">
            <MagneticButton
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="inverted"
              className="w-full sm:w-auto text-sm sm:text-base px-7 py-3.5 sm:py-4 justify-center"
            >
              <MessageCircle className="w-5 h-5 text-slateNavy-950" />
              <span>تواصل عبر واتساب: {PHONE_NUMBER}</span>
            </MagneticButton>

            <a
              href="tel:0666568039"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-full text-sm font-bold border border-slateNavy-800 text-slateNavy-100 hover:bg-slateNavy-900 transition"
            >
              <PhoneCall className="w-4 h-4 text-slateNavy-400" />
              <span>اتصال هاتفي مباشر</span>
            </a>
          </div>

          {/* Brand Mark and Copyright */}
          <div className="pt-12 sm:pt-16 mt-12 sm:mt-16 border-t border-slateNavy-800/80 flex flex-col md:flex-row items-center justify-between gap-5 text-xs font-medium text-slateNavy-400">
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <div className="bg-slateNavy-900 border border-slateNavy-800 px-2.5 py-1 rounded-xl shadow-sm">
                <NextDZLogo width={34} height={22} textSize="text-base" />
              </div>
              <span className="text-slateNavy-400">— قاعة هادئة، سكرتيرة مرتاحة، زبائن راضون.</span>
            </div>

            {/* Discreet Legal & Policy Links */}
            <div className="flex items-center gap-4 text-xs font-normal text-slateNavy-400">
              <a href="#pricing" className="hover:text-slateNavy-100 transition hover:underline underline-offset-4">
                باقات الاشتراك
              </a>
              <span className="text-slateNavy-700 select-none">•</span>
              <a href="#faq" className="hover:text-slateNavy-100 transition hover:underline underline-offset-4">
                الأسئلة الشائعة
              </a>
              <span className="text-slateNavy-700 select-none">•</span>
              <Link 
                href="/terms" 
                className="hover:text-slateNavy-100 transition hover:underline underline-offset-4"
              >
                شروط الاستخدام
              </Link>
              <span className="text-slateNavy-700 select-none">•</span>
              <Link 
                href="/privacy" 
                className="hover:text-slateNavy-100 transition hover:underline underline-offset-4"
              >
                سياسة الخصوصية
              </Link>
            </div>

            <div className="text-center md:text-left text-slateNavy-400/80 text-[11px]">
              جميع الحقوق محفوظة © {new Date().getFullYear()} NextDZ.
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
