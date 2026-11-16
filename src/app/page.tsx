'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Smartphone, 
  Tv, 
  Stethoscope, 
  Scissors, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  Printer, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  Zap, 
  PhoneCall, 
  QrCode, 
  Layers, 
  Download, 
  ChevronDown, 
  MessageCircle, 
  HelpCircle,
  Building,
  Check,
  Star,
  Users,
  Phone,
  Calculator,
  Shield,
  Crown,
  Flame,
  Award,
  Volume2,
  CalendarCheck
} from 'lucide-react';

const WHATSAPP_NUMBER = '0666568039';
const WHATSAPP_INTL = '213666568039';
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_INTL}`;

const screenshots = [
  {
    id: 'customer',
    title: '📱 هاتف المراجع',
    tag: 'شاشة الزبون التفاعلية',
    image: '/shots/customer-mobile-ticket.png',
    description: 'تذكرة رقمية متطورة على هاتف المراجع، تحسب وقت الدخول بالدقيقة وتنبّهه صوتياً عند اقتراب دوره (قبل شخصين) ليحضر للصالة مرتاحاً.',
    badge: 'متاحة في كل الباقات',
    highlights: ['بدون تحميل أي تطبيق', 'عد تنازلي لحظي بالدقيقة', 'تنبيه اهتزاز وصوت للحضور', 'تقييم فوري للخدمة عند الخروج'],
  },
  {
    id: 'admin',
    title: '💻 ريموت الطبيب والمسير',
    tag: 'لوحة التحكم الفائقة',
    image: '/shots/admin-dashboard-desktop.png',
    description: 'ريموت متطور يعمل من الهاتف أو الكمبيوتر: استدعاء المراجع، تأكيد دخوله، خروجه التلقائي، تأجيل المتأخر بضغطة زر، ورنة هاتفية سريعة.',
    badge: 'متاحة في كل الباقات',
    highlights: ['محمي برمز PIN خاص', 'تأجيل ذكي للمتأخر (Hold)', 'رنة هاتفية سريعة (Bip)', 'تسجيل تذكرة حضورية في ثوانٍ'],
  },
  {
    id: 'tv',
    title: '📺 شاشة صالة الانتظار',
    tag: 'عرض Full HD سينمائي',
    image: '/shots/tv-display-1080p.png',
    description: 'شاشة عرض سينمائية عالية الوضوح تعمل على أي تلفاز ذكي (Smart TV) بفتح الرابط فقط، مع نداء صوتي وقائمة انتظار مرتبة بدون كابلات.',
    badge: 'باقة المحترفين والنخبة',
    highlights: ['تعمل بدون كابلات أو حواسيب', 'جرس نداء صوتي عند الاستدعاء', 'عرض فائق الوضوح 1080p', 'تصميم داكن ومريح للعين'],
  },
  {
    id: 'stand',
    title: '📄 ملصق الطاولة الميداني',
    tag: 'ستاند A4 جاهز للطباعة',
    image: '/shots/admin-stand-modal.png',
    description: 'بوستر رسمي أنيق يطبع بضغطة زر واحدة على أي طابعة عادية ليوضع على طاولة الاستقبال أو باب العيادة متضمناً كود QR و3 خطوات واضحة.',
    badge: 'متاحة في كل الباقات',
    highlights: ['جاهز بضغطة زر (A4)', 'تعليمات مرقمة ومصورة', 'يغنيك عن شراء طابعة تذاكر', 'شكل رسمي احترافي للمؤسسة'],
  },
  {
    id: 'stats',
    title: '📊 تقارير Excel ورضا العملاء',
    tag: 'تحليلات يومية دقيقة',
    image: '/shots/admin-stats-modal.png',
    description: 'إحصائيات لحظية عن عدد المراجعين ومتوسط وقت كل خدمة وتقييمات الرضا الفورية (😄/😐/🙁)، مع تصدير تقرير كامل لـ Excel بنقرة واحدة.',
    badge: 'باقة المحترفين والنخبة',
    highlights: ['تصدير Excel/CSV بترميز عربي سليم', 'مؤشرات رضا المراجعين الحقيقية', 'حساب سرعة خدمة كل موظف', 'أرشيف كامل للمراجعات اليومية'],
  },
];

const demos = [
  {
    slug: 'clinic-amal',
    title: 'عيادة الأمل الطبية',
    subtitle: 'د. بوعلام - طب عام واستشارات',
    sector: 'مريض',
    staff: 'الطبيب',
    avgMins: 15,
    icon: Stethoscope,
    plan: 'باقة المحترفين (Pro)',
    planColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80',
    features: ['شاشة تلفاز صالة الانتظار مفعلة', 'تصدير تقارير Excel', 'نداء صوتي عربي'],
  },
  {
    slug: 'barber-elite',
    title: 'صالون إيليت للحلاقة الرجالية',
    subtitle: 'حلاقة عصرية وعناية شخصية',
    sector: 'زبون',
    staff: 'الحلاق',
    avgMins: 20,
    icon: Scissors,
    plan: 'الباقة الأساسية (Starter)',
    planColor: 'bg-slateNavy-900 text-slateNavy-300 border-slateNavy-700',
    features: ['ريموت الحلاق الذكي', 'ملصق QR للطاولة', 'حجز إلكتروني بدون أجهزة'],
  },
  {
    slug: 'univ-g2',
    title: 'مصلحة الشؤون الطلابية',
    subtitle: 'مدرج 2 - سحب الكشوفات والشهادات',
    sector: 'طالب',
    staff: 'مسؤول الشباك',
    avgMins: 10,
    icon: GraduationCap,
    plan: 'باقة النخبة (Elite VIP)',
    planColor: 'bg-amber-950/80 text-amber-300 border-amber-700/80',
    features: ['شاشات متعددة', 'أولوية قصوى ودعم دائم', 'إحصائيات تدفق المراجعين'],
  },
];

const faqs = [
  {
    q: 'كيف أشترك وأفعّل النظام لعيادتي أو صالوني؟',
    a: `الأمر فائق البساطة ويستغرق أقل من 10 دقائق! يكفي أن تتواصل معنا عبر واتساب على الرقم ${WHATSAPP_NUMBER}، وسنقوم بإنشاء حسابك الخاص وتحديد باقتك، وإرسال رابط النظام وملصق الـ QR الجاهز للطباعة فوراً.`,
  },
  {
    q: 'ما الفرق الجوهري بين الباقة الأساسية (1,500 دج) وباقة المحترفين (2,500 دج)؟',
    a: 'الباقة الأساسية ممتازة لمن يريد فقط إلغاء الطوابير الورقية والتحكم من الهاتف. بينما باقة المحترفين تفتح لك شاشة تلفاز صالة الانتظار Full HD مع جرس النداء الصوتي، وتصدير تقارير Excel اليومية، ونظام التأجيل الذكي (Hold) للزبائن المتأخرين، ومؤشرات تقييم رضا الزبائن.',
  },
  {
    q: 'هل يمكنني الدفع شهرياً أو الاستفادة من خصم الدفع السنوي؟',
    a: 'نعم بالتأكيد! يمكنك الدفع شهرياً بكل مرونة، أو اختيار الاشتراك السنوي لتحصل على شهرين مجاناً (توفر حتى 6,000 دج سنوياً) مع تثبيت السعر لعام كامل.',
  },
  {
    q: 'هل يحتاج المراجع أو المريض إلى تحميل أي تطبيق على هاتفه؟',
    a: 'إطلاقاً! يفتح المراجع كاميرا هاتفه العادية فقط ويمسح الرمز من الملصق، فيفتح له النظام فوراً كصفحة ويب سريعة جداً تعمل على أي هاتف (iPhone أو Android) بدون تسجيل أو تحميل أي تطبيق.',
  },
  {
    q: 'هل أحتاج لشراء شاشات باهظة أو طابعات تذاكر ورقية؟',
    a: 'لا نهائياً، تكلفة العتاد الإضافي 0 دج! أنت تتحكم من هاتفك الذكي أو حاسوبك المكتبي الحالي، وإذا أردت شاشة لصالة الانتظار، يكفي فتح رابط الشاشة في متصفح أي تلفاز Smart TV موجود لديك.',
  },
  {
    q: 'ماذا لو جاء مراجع كبير في السن أو لا يملك هاتفاً ذكياً؟',
    a: 'تم تزويد ريموت المسير بزر "تذكرة حضورية": يسجله المسير في 3 ثوانٍ فقط، ويظهر له النظام فوراً رقم التذكرة وساعة العودة التقريبية ليخبره بها، مع إمكانية كتابة رقم هاتفه لإجراء رنة سريعة (Bip) له وقت دوره.',
  },
  {
    q: 'ماذا يحدث إذا تأخر الزبون وكان جالساً في المقهى أو خارج العيادة؟',
    a: 'أولاً: يرسل له النظام تنبيهاً صوتياً واهتزازاً عندما يتبقى شخصين فقط أمامه ليحضر للقاعة. ثانياً: إذا نودي ولم يحضر، يضغط الطبيب على زر "تأجيل (Hold)" فيمر الذي بعده دون تعطيل القاعة، وعندما يعود الزبون يستدعيه الطبيب بنقرة زر واحدة فوراً.',
  },
];

export default function PromotionalLandingPage() {
  const [activeShot, setActiveShot] = useState('customer');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isYearly, setIsYearly] = useState<boolean>(true);
  const [dailyVisitors, setDailyVisitors] = useState<number>(40);

  const currentScreenshot = screenshots.find((s) => s.id === activeShot) || screenshots[0];

  // Pricing values based on psychology
  // Starter: 1500 / mo | 15000 / yr (Save 3,000)
  // Pro: 2500 / mo | 25000 / yr (Save 5,000)
  // Elite: 3000 / mo (was 3500) | 30000 / yr (Save 6,000)
  const pricing = {
    starter: isYearly ? { price: '15,000', period: 'سنوياً', subtext: 'ما يعادل 1,250 دج / شهر فقط (وفرت شهرين)' } : { price: '1,500', period: 'شهرياً', subtext: 'تجديد شهري مرن بدون التزام' },
    pro: isYearly ? { price: '25,000', period: 'سنوياً', subtext: 'ما يعادل 2,080 دج / شهر فقط (وفرت 5,000 دج)' } : { price: '2,500', period: 'شهرياً', subtext: 'الباقة الأكثر طلباً للعيادات النشطة' },
    elite: isYearly ? { price: '30,000', period: 'سنوياً', subtext: 'ما يعادل 2,500 دج / شهر فقط (وفرت 6,000 دج)' } : { price: '3,000', period: 'شهرياً', subtext: 'خصم خاص (كانت 3,500 دج) للمراكز الكبرى' },
  };

  // ROI calculations based on daily visitors
  const annualPaperSavings = Math.round(dailyVisitors * 300 * 12);
  const hoursSavedPerYear = Math.round((dailyVisitors * 300 * 25) / 60);

  return (
    <div className="min-h-screen bg-slateNavy-950 text-slateNavy-100 flex flex-col selection:bg-slateNavy-400 selection:text-slateNavy-950 font-sans relative overflow-x-hidden" dir="rtl">
      
      {/* 1. LUXURY TOP ANNOUNCEMENT / WHATSAPP BAR */}
      <div className="bg-gradient-to-r from-slateNavy-900 via-slateNavy-850 to-slateNavy-900 border-b border-slateNavy-800/80 py-2.5 px-4 text-center text-xs font-semibold text-slateNavy-200 relative z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-center flex-wrap gap-2 sm:gap-4">
          <span className="inline-flex items-center gap-1.5 text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>نظام إدارة الطوابير والمواعيد الذكي للعيادات والصالونات والمراكز</span>
          </span>
          <span className="hidden sm:inline text-slateNavy-600">•</span>
          <a
            href={`${WHATSAPP_BASE}?text=مرحباً،%20أريد%20الاشتراك%20في%20نظام%20طابوري%20الذكي`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-white hover:text-emerald-400 transition font-bold"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>للاشتراك الفوري اتصل بنا أو راسلنا واتساب:</span>
            <span className="font-mono text-emerald-400 text-sm tracking-wider dir-ltr font-black">{WHATSAPP_NUMBER}</span>
          </a>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <header className="sticky top-0 z-40 bg-slateNavy-950/90 backdrop-blur-2xl border-b border-slateNavy-800/80 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slateNavy-700 via-slateNavy-850 to-slateNavy-950 border border-slateNavy-700 flex items-center justify-center text-white font-black shadow-xl">
              <Zap className="w-5 h-5 text-slateNavy-200" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                طابوري الذكي
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">SAAS 2.0</span>
              </span>
              <p className="text-[11px] text-slateNavy-400 -mt-0.5">منصة إفراغ قاعات الانتظار السحابية</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slateNavy-300">
            <a href="#showcase" className="hover:text-white transition">معرض الشاشات</a>
            <a href="#how-it-works" className="hover:text-white transition">كيف يعمل</a>
            <a href="#calculator" className="hover:text-white transition">حاسبة التوفير</a>
            <a href="#demos" className="hover:text-white transition">تجربة حية (Demo)</a>
            <a href="#pricing" className="hover:text-white transition">الباقات والأسعار</a>
            <a href="#faq" className="hover:text-white transition">الأسئلة الشائعة</a>
          </nav>

          {/* WhatsApp Direct Header CTA */}
          <div className="flex items-center gap-2">
            <a
              href={`${WHATSAPP_BASE}?text=مرحباً،%20أريد%20الاشتراك%20في%20نظام%20طابوري%20الذكي`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-950/50 transition transform active:scale-95 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب: {WHATSAPP_NUMBER}</span>
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (High-Converting Luxury Aesthetic) */}
      <section className="relative pt-14 pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Glow ambient background meshes */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-slateNavy-700/25 via-slateNavy-800/10 to-transparent blur-[160px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-48 right-4 w-[350px] h-[350px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slateNavy-900/90 border border-slateNavy-700/60 text-slateNavy-300 text-xs font-bold shadow-xl backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white">أحدث نظام رقمي لإلغاء الاكتظاظ والتزاحم الميداني</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.2]">
            أفرغ صالة الانتظار تماماً.. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slateNavy-100 via-slateNavy-300 to-white">
              ودع زبائنك يتابعون دورهم أينما كانوا
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slateNavy-300 max-w-2xl mx-auto leading-relaxed">
            حوّل هاتف مراجعك إلى تذكرة رقمية حية تحسب ساعة دخوله بالدقيقة وتنبّهه صوتياً قبل دوره ليحضر للصالة مرتاحاً. بدون شراء طابعات ورقية مكلفة، وبدون كابلات أو صيانة.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <a
              href={`${WHATSAPP_BASE}?text=مرحباً،%20أريد%20الاشتراك%20وتفعيل%20حساب%20لعيادتي%20اليوم`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white text-sm font-black rounded-2xl shadow-xl shadow-emerald-950/60 transition transform active:scale-95 flex items-center justify-center gap-2.5"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span>اشترك الآن عبر واتساب ({WHATSAPP_NUMBER})</span>
            </a>

            <a
              href="#demos"
              className="w-full sm:w-auto px-7 py-4 bg-slateNavy-900/90 hover:bg-slateNavy-850 border border-slateNavy-700/80 text-slateNavy-100 text-sm font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>تجربة حية فورية للشاشات (Live Demo)</span>
            </a>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 max-w-3xl mx-auto text-center">
            <div className="p-3.5 bg-slateNavy-900/60 backdrop-blur-md border border-slateNavy-800 rounded-2xl shadow-sm">
              <p className="text-lg font-black text-white">0 دج</p>
              <p className="text-[11px] text-slateNavy-400 mt-0.5">تكلفة عتاد إضافي</p>
            </div>
            <div className="p-3.5 bg-slateNavy-900/60 backdrop-blur-md border border-slateNavy-800 rounded-2xl shadow-sm">
              <p className="text-lg font-black text-white">بدون تطبيق</p>
              <p className="text-[11px] text-slateNavy-400 mt-0.5">مسح QR بالكاميرا فقط</p>
            </div>
            <div className="p-3.5 bg-slateNavy-900/60 backdrop-blur-md border border-slateNavy-800 rounded-2xl shadow-sm">
              <p className="text-lg font-black text-white">تنبيه ذكي</p>
              <p className="text-[11px] text-slateNavy-400 mt-0.5">صوتي عند بقاء شخصين</p>
            </div>
            <div className="p-3.5 bg-slateNavy-900/60 backdrop-blur-md border border-slateNavy-800 rounded-2xl shadow-sm">
              <p className="text-lg font-black text-white">تقارير Excel</p>
              <p className="text-[11px] text-slateNavy-400 mt-0.5">وتقييم رضا لحظي</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REAL SHOWCASE GALLERY (High-Res Screenshots Mockup) */}
      <section id="showcase" className="py-20 px-4 sm:px-6 bg-slateNavy-900/40 border-y border-slateNavy-800/80">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">معرض الشاشات الواقعية</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">شاهد المنظومة الحقيقية أثناء العمل</h2>
            <p className="text-xs sm:text-sm text-slateNavy-300">
              انقر على أي شاشة لمشاهدة صور حقيقية عالية الدقة لكيفية عمل النظام في الميدان.
            </p>
          </div>

          {/* Interactive Screen Switcher Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2.5">
            {screenshots.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveShot(s.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 border ${
                  activeShot === s.id
                    ? 'bg-slateNavy-100 text-slateNavy-950 border-white shadow-xl scale-105 font-black'
                    : 'bg-slateNavy-900 hover:bg-slateNavy-850 text-slateNavy-300 border-slateNavy-800'
                }`}
              >
                <span>{s.title}</span>
              </button>
            ))}
          </div>

          {/* Active Screen Showcase Card */}
          <div className="bg-slateNavy-900/90 border border-slateNavy-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slateNavy-800 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-400">{currentScreenshot.tag}</span>
                  <span className="text-[10px] bg-slateNavy-800 text-slateNavy-300 px-2 py-0.5 rounded-full border border-slateNavy-700">
                    {currentScreenshot.badge}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">{currentScreenshot.title}</h3>
                <p className="text-xs sm:text-sm text-slateNavy-300 leading-relaxed max-w-2xl pt-1">
                  {currentScreenshot.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 lg:pt-0">
                {currentScreenshot.highlights.map((h, idx) => (
                  <span key={idx} className="text-[11px] bg-slateNavy-950 text-slateNavy-200 px-3 py-1 rounded-full border border-slateNavy-800 flex items-center gap-1 font-semibold">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Screen Mockup Frame */}
            <div className="relative rounded-2xl overflow-hidden border border-slateNavy-700/80 bg-slateNavy-950 shadow-2xl flex items-center justify-center min-h-[380px] max-h-[620px] p-2 sm:p-4">
              <img
                src={currentScreenshot.image}
                alt={currentScreenshot.title}
                className="w-full h-auto max-h-[580px] object-contain rounded-xl shadow-lg transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING & PACKAGES SECTION (Monthly vs Yearly Psychology) */}
      <section id="pricing" className="py-24 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>خطط اشتراك شفافة ومدروسة</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">اختر الباقة المناسبة لحجم نشاطك</h2>
            <p className="text-xs sm:text-sm text-slateNavy-300">
              ادفع شهرياً بمرونة كاملة، أو وفّر شهرين مجاناً عند اختيار الاشتراك السنوي.
            </p>

            {/* Monthly / Yearly Switcher */}
            <div className="pt-4 flex items-center justify-center">
              <div className="bg-slateNavy-900 border border-slateNavy-800 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                    !isYearly 
                      ? 'bg-slateNavy-100 text-slateNavy-950 shadow font-black' 
                      : 'text-slateNavy-400 hover:text-white'
                  }`}
                >
                  دفع شهري
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isYearly 
                      ? 'bg-emerald-500 text-slateNavy-950 shadow font-black' 
                      : 'text-slateNavy-400 hover:text-white'
                  }`}
                >
                  <span>دفع سنوي</span>
                  <span className="text-[10px] bg-slateNavy-950 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    وفر شهرين 🎁
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* TIER 1: STARTER */}
            <div className="bg-slateNavy-900/90 border border-slateNavy-800 rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slateNavy-400">العيادات الفردية والصالونات</span>
                  <span className="text-[10px] bg-slateNavy-950 text-slateNavy-300 px-2.5 py-0.5 rounded-full border border-slateNavy-800">
                    Starter
                  </span>
                </div>

                <h3 className="text-xl font-black text-white">الباقة الأساسية</h3>
                <p className="text-xs text-slateNavy-400 leading-relaxed">
                  مثالية للأطباء العامين، صالونات الحلاقة، ومكاتب الأعمال الفردية لإلغاء الطابور الورقي.
                </p>

                <div className="py-4 border-y border-slateNavy-800 space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white tracking-tight">{pricing.starter.price}</span>
                    <span className="text-xs text-slateNavy-400 font-bold">دج / {pricing.starter.period}</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-medium">{pricing.starter.subtext}</p>
                </div>

                <ul className="space-y-3 text-xs text-slateNavy-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>رابط خاص وملصق QR رسمي للعيادة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تذاكر رقمية غير محدودة طوال فترة الاشتراك</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تنبيه صوتي واهتزاز لحضور المراجعين</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>ريموت المسير (استدعاء، تأكيد، وإنهاء وخروج)</span>
                  </li>
                  <li className="flex items-center gap-2 text-slateNavy-600 line-through">
                    <XCircle className="w-4 h-4 shrink-0 text-slateNavy-600" />
                    <span>شاشة تلفاز صالة الانتظار (غير مشمولة)</span>
                  </li>
                  <li className="flex items-center gap-2 text-slateNavy-600 line-through">
                    <XCircle className="w-4 h-4 shrink-0 text-slateNavy-600" />
                    <span>تصدير تقارير Excel (غير مشمولة)</span>
                  </li>
                </ul>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=مرحباً،%20أريد%20الاشتراك%20في%20الباقة%20الأساسية%20(${pricing.starter.price}%20دج%20/${pricing.starter.period})`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-slateNavy-800 hover:bg-slateNavy-750 text-slateNavy-100 font-bold text-xs rounded-2xl border border-slateNavy-700 transition text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>طلب الباقة الأساسية عبر واتساب</span>
              </a>
            </div>

            {/* TIER 2: PRO (MOST POPULAR) */}
            <div className="bg-slateNavy-900/95 border-2 border-emerald-400/90 rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-emerald-950/40">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-emerald-400 text-slateNavy-950 font-black text-[11px] rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-slateNavy-950" />
                <span>الباقة الأكثر طلباً للعيادات</span>
              </span>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">العيادات النشطة والمراكز الطبية</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-800 font-bold">
                    PRO ⭐
                  </span>
                </div>

                <h3 className="text-xl font-black text-white">باقة المحترفين (Pro)</h3>
                <p className="text-xs text-slateNavy-400 leading-relaxed">
                  الحل المتكامل للعيادات التخصصية، طب الأسنان، والمراكز التي ترغب في صالة انتظار ذكية وشاشة تلفاز.
                </p>

                <div className="py-4 border-y border-slateNavy-800 space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white tracking-tight">{pricing.pro.price}</span>
                    <span className="text-xs text-slateNavy-400 font-bold">دج / {pricing.pro.period}</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-medium">{pricing.pro.subtext}</p>
                </div>

                <ul className="space-y-3 text-xs text-slateNavy-200">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white">شاشة صالة الانتظار للتلفاز Full HD 1080p مفعلة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white">جرس نداء صوتي عربي تلقائي عند الاستدعاء</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white">تصدير تقارير Excel/CSV اليومية بضغطة زر</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>نظام التأجيل الذكي (Hold) للزبائن المتأخرين</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تقييمات رضا المراجعين اللحظية (😄/😐/🙁)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>دعم فني وتدريب مجاني للفريق</span>
                  </li>
                </ul>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=مرحباً،%20أريد%20الاشتراك%20في%20باقة%20المحترفين%20Pro%20(${pricing.pro.price}%20دج%20/${pricing.pro.period})`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-emerald-950/60 transition text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>طلب باقة المحترفين عبر واتساب</span>
              </a>
            </div>

            {/* TIER 3: ELITE VIP */}
            <div className="bg-slateNavy-900/90 border border-slateNavy-800 rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">المجمعات والمؤسسات الكبرى</span>
                  <span className="text-[10px] bg-amber-950/70 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-800 font-bold">
                    Elite VIP 👑
                  </span>
                </div>

                <h3 className="text-xl font-black text-white">باقة النخبة (Elite)</h3>
                <p className="text-xs text-slateNavy-400 leading-relaxed">
                  للمجمعات الطبية الكبرى والمختبرات والمؤسسات التي تحتاج شاشات متعددة ودعماً استثنائياً.
                </p>

                <div className="py-4 border-y border-slateNavy-800 space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white tracking-tight">{pricing.elite.price}</span>
                    <span className="text-xs text-slateNavy-400 font-bold">دج / {pricing.elite.period}</span>
                  </div>
                  <p className="text-[11px] text-amber-300 font-medium">{pricing.elite.subtext}</p>
                </div>

                <ul className="space-y-3 text-xs text-slateNavy-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>كل مميزات باقة المحترفين بالكامل</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تخصيص كامل للشعار والرسالة الترحيبية</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>إحصائيات تدفق المراجعين المتقدمة بالساعة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>أولوية قصوى ودعم فني دائم على مدار الساعة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>ربط شاشات متعددة في نفس المؤسسة</span>
                  </li>
                </ul>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=مرحباً،%20أريد%20الاشتراك%20في%20باقة%20النخبة%20Elite%20VIP%20(${pricing.elite.price}%20دج%20/${pricing.elite.period})`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-slateNavy-800 hover:bg-slateNavy-750 text-slateNavy-100 font-bold text-xs rounded-2xl border border-slateNavy-700 transition text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-amber-400" />
                <span>طلب باقة النخبة VIP عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE SAVINGS & ROI CALCULATOR */}
      <section id="calculator" className="py-20 px-4 sm:px-6 bg-slateNavy-900/40 border-y border-slateNavy-800/80">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Calculator className="w-4 h-4" />
              <span>حاسبة التوفير الذكية للعيادات والمراكز</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">كم ستوفر عيادتك سنوياً بالانتقال لنظامنا؟</h2>
            <p className="text-xs sm:text-sm text-slateNavy-300 max-w-xl mx-auto">
              حرّك المؤشر بحسب متوسط عدد الزبائن أو المرضى الذين تستقبلهم يومياً وشاهد حجم التوفير المالي وراحة البال.
            </p>
          </div>

          <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
            <div className="space-y-3 text-center sm:text-right">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <label className="text-sm font-bold text-slateNavy-200">
                  متوسط عدد المراجعين أو الزبائن يومياً:
                </label>
                <span className="text-2xl font-black text-emerald-400 bg-slateNavy-950 px-4 py-1.5 rounded-xl border border-slateNavy-800">
                  {dailyVisitors} مراجع / يوم
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={150}
                step={5}
                value={dailyVisitors}
                onChange={(e) => setDailyVisitors(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slateNavy-950 h-3 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slateNavy-400 font-semibold px-1">
                <span>10 مراجعين (عيادة فردية)</span>
                <span>50 مراجعاً (عيادة نشطة)</span>
                <span>150 مراجعاً (مجمع طبي / مركز)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slateNavy-800">
              <div className="bg-slateNavy-950 p-4 rounded-2xl border border-slateNavy-800 text-center space-y-1">
                <span className="text-[11px] text-slateNavy-400 font-medium">توفير سنوي مباشر في بكرات الورق والصيانة</span>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {annualPaperSavings.toLocaleString('ar-DZ')} <span className="text-xs text-slateNavy-400 font-normal">دج</span>
                </p>
                <p className="text-[10px] text-emerald-400">تكلفة بكرات الورق وحبر الطابعات المحذوفة</p>
              </div>

              <div className="bg-slateNavy-950 p-4 rounded-2xl border border-slateNavy-800 text-center space-y-1">
                <span className="text-[11px] text-slateNavy-400 font-medium">ساعات انتظار وتوتر يتم إنقاذها سنوياً</span>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {hoursSavedPerYear.toLocaleString('ar-DZ')} <span className="text-xs text-slateNavy-400 font-normal">ساعة</span>
                </p>
                <p className="text-[10px] text-emerald-400">إلغاء الجلوس الممل في قاعة الانتظار</p>
              </div>

              <div className="bg-slateNavy-950 p-4 rounded-2xl border border-slateNavy-800 text-center space-y-1">
                <span className="text-[11px] text-slateNavy-400 font-medium">معدل رضا المراجعين والتقييمات الإيجابية</span>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  +98% <span className="text-xs text-slateNavy-400 font-normal">إيجابي</span>
                </p>
                <p className="text-[10px] text-emerald-400">انطباع راقٍ وتوصيات أكبر لأصدقائهم</p>
              </div>
            </div>

            <div className="bg-slateNavy-950/80 p-4 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-right">
                <p className="text-xs font-bold text-white">وفّر هذه الأموال واجعل عيادتك الأرقى في منطقتك اليوم</p>
                <p className="text-[11px] text-slateNavy-400">تفعيل فوري خلال 10 دقائق بدون أي أجهزة</p>
              </div>
              <a
                href={`${WHATSAPP_BASE}?text=مرحباً،%20أريد%20الاشتراك%20في%20نظام%20الطابور%20الذكي%20(حسابي%20حوالي%20${dailyVisitors}%20مراجع%20يومياً)`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slateNavy-950 font-black text-xs rounded-xl transition shadow flex items-center gap-1.5 shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>اشترك الآن عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS (3 Simple Steps) */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">بساطة تشغيل ميدانية</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">كيف يعمل النظام في 3 خطوات بسيطة؟</h2>
            <p className="text-xs sm:text-sm text-slateNavy-300 max-w-xl mx-auto">
              تجربة سهلة ومريحة تلغي الاكتظاظ والصراخ وتوفر وقت الجميع.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="w-12 h-12 bg-slateNavy-800 border border-slateNavy-700 rounded-2xl flex items-center justify-center text-white font-black text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-white">مسح كود الـ QR من الملصق</h3>
              <p className="text-xs sm:text-sm text-slateNavy-300 leading-relaxed">
                يصل المراجع ويجد ملصقاً رسمياً أنيقاً عند الباب أو الاستقبال. يمسح الكود بكاميرا هاتفه ويدخل رقم هاتفه فيأخذ دوره فوراً في 5 ثوانٍ.
              </p>
              <div className="pt-2 text-[11px] text-slateNavy-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>بدون تحميل أي تطبيق</span>
              </div>
            </div>

            <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="w-12 h-12 bg-slateNavy-800 border border-slateNavy-700 rounded-2xl flex items-center justify-center text-white font-black text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-white">الانتظار بحرية في أي مكان</h3>
              <p className="text-xs sm:text-sm text-slateNavy-300 leading-relaxed">
                يظهر للمراجع توقيت دخوله المقدر بالدقيقة وعدد الأشخاص قبله. يمكنه الانتظار في المقهى، سيارته، أو قضاء مشاويره براحة تامة.
              </p>
              <div className="pt-2 text-[11px] text-slateNavy-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>إفراغ تام لقاعة الانتظار</span>
              </div>
            </div>

            <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="w-12 h-12 bg-slateNavy-800 border border-slateNavy-700 rounded-2xl flex items-center justify-center text-white font-black text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-white">تنبيه ذكي ودخول فوري</h3>
              <p className="text-xs sm:text-sm text-slateNavy-300 leading-relaxed">
                عندما يتبقى شخصين أمامه، يرن هاتفه وينبهه صوتياً للحضور للصالة. وعندما يناديه الطبيب يدخل فوراً، ثم يقيّم الخدمة بلمسة واحدة عند خروجه.
              </p>
              <div className="pt-2 text-[11px] text-slateNavy-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>صفر تضييع لوقت الطبيب</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. LIVE INTERACTIVE DEMOS */}
      <section id="demos" className="py-20 px-4 sm:px-6 bg-slateNavy-900/40 border-y border-slateNavy-800/80">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">نماذج حية مهيأة بالباقات</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">جرّب النظام بنفسك الآن</h2>
            <p className="text-xs sm:text-sm text-slateNavy-300 max-w-xl mx-auto">
              شاهد كيف تعمل الميزات الحقيقية للباقات المختلفة في نماذج العيادة والصالون والمصلحة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demos.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.slug}
                  className="bg-slateNavy-900 border border-slateNavy-800 hover:border-slateNavy-700 rounded-3xl p-6 flex flex-col justify-between shadow-2xl transition space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-slateNavy-800 border border-slateNavy-700 flex items-center justify-center text-white shadow">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] px-3 py-1 rounded-full font-bold border ${d.planColor}`}>
                        {d.plan}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-white">{d.title}</h3>
                      <p className="text-xs text-slateNavy-400 mt-0.5">{d.subtitle}</p>
                    </div>

                    <div className="bg-slateNavy-950 p-2.5 rounded-xl border border-slateNavy-800 flex items-center justify-between text-xs text-slateNavy-300">
                      <span>متوسط وقت الخدمة:</span>
                      <span className="font-bold text-white">{d.avgMins} دقيقة / {d.sector}</span>
                    </div>

                    <ul className="space-y-1 pt-1 text-[11px] text-slateNavy-400">
                      {d.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slateNavy-800">
                    <Link
                      href={`/q/${d.slug}`}
                      target="_blank"
                      className="w-full py-2.5 px-3 bg-slateNavy-100 hover:bg-white text-slateNavy-950 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>تجربة حجز دور (شاشة الزبون)</span>
                    </Link>

                    <Link
                      href={`/admin/${d.slug}`}
                      target="_blank"
                      className="w-full py-2.5 px-3 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 text-xs font-bold rounded-xl border border-slateNavy-700 transition flex items-center justify-center gap-1.5"
                    >
                      <span>لوحة تحكم {d.staff} (PIN: 1234)</span>
                    </Link>

                    <Link
                      href={`/display/${d.slug}`}
                      target="_blank"
                      className="w-full py-2 px-3 bg-slateNavy-950 hover:bg-slateNavy-900 text-slateNavy-400 hover:text-white text-[11px] font-semibold rounded-xl border border-slateNavy-800 transition flex items-center justify-center gap-1.5"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      <span>شاشة صالة الانتظار للتلفاز</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section id="faq" className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">إجابات واضحة ومباشرة</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">الأسئلة الشائعة</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slateNavy-900 border border-slateNavy-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slateNavy-100"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slateNavy-400 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                {openFaq === idx && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slateNavy-300 leading-relaxed border-t border-slateNavy-800/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL CONTACT CALL TO ACTION & FOOTER */}
      <footer className="bg-slateNavy-900 border-t border-slateNavy-800 pt-16 pb-12 px-4 sm:px-6 mt-auto">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Big CTA Box */}
          <div className="bg-gradient-to-br from-slateNavy-950 via-slateNavy-900 to-slateNavy-950 border border-slateNavy-800 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 rounded-3xl flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
              <PhoneCall className="w-7 h-7" />
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-white">
              جاهز لإفراغ صالة الانتظار وتنظيم مواعيدك بذكاء؟
            </h3>
            <p className="text-xs sm:text-sm text-slateNavy-300 max-w-lg mx-auto leading-relaxed">
              تواصل معنا الآن، وسنقوم بتفعيل حساب مؤسستك وإرسال ملصق الـ QR الخاص بك لتبدأ العمل في أقل من 10 دقائق!
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`${WHATSAPP_BASE}?text=مرحباً،%20أريد%20تفعيل%20حساب%20لعيادتي%20اليوم`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>راسلنا على واتساب: {WHATSAPP_NUMBER}</span>
              </a>

              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="w-full sm:w-auto px-7 py-4 bg-slateNavy-900 hover:bg-slateNavy-850 text-slateNavy-200 font-bold text-sm rounded-2xl border border-slateNavy-700 transition flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-slateNavy-300" />
                <span>اتصال هاتفي مباشر</span>
              </a>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slateNavy-800 text-xs text-slateNavy-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slateNavy-200">طابوري الذكي (Smart Queue System)</span>
              <span>• جميع الحقوق محفوظة © {new Date().getFullYear()}</span>
            </div>

            <div className="flex items-center gap-6 text-xs text-slateNavy-400">
              <a href="#showcase" className="hover:text-white transition">معرض الشاشات</a>
              <a href="#pricing" className="hover:text-white transition">الباقات</a>
              <a href="#calculator" className="hover:text-white transition">حاسبة التوفير</a>
              <a href="#faq" className="hover:text-white transition">الأسئلة الشائعة</a>
              <a
                href={`${WHATSAPP_BASE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-bold"
              >
                واتساب: {WHATSAPP_NUMBER}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 11. FLOATING STICKY WHATSAPP WIDGET (Bottom-Left) */}
      <a
        href={`${WHATSAPP_BASE}?text=مرحباً،%20أريد%20الاستفسار%20عن%20نظام%20طابوري%20الذكي`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر واتساب"
        className="fixed bottom-5 left-5 z-50 group flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-3 px-4 rounded-full shadow-2xl shadow-emerald-950/70 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-emerald-400/30"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5" />
        <span className="text-xs font-black tracking-wide hidden sm:inline">اشترك الآن | {WHATSAPP_NUMBER}</span>
      </a>
    </div>
  );
}
