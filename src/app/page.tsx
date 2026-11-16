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
  Users
} from 'lucide-react';

const screenshots = [
  {
    id: 'customer',
    title: '📱 هاتف المراجع',
    subtitle: 'تذكرة رقمية ذكية بالوقت المتبقي وتنبيه الحضور',
    image: '/shots/customer-mobile-ticket.png',
    description: 'يمسح المراجع كود QR بكاميرا هاتفه دون أي تطبيق، فيظهر له رقم دوره فوراً مع حساب دقيق لساعة دخوله وعدد الأشخاص قبله، وتنبيه صوتي لحثه على الحضور للصالة عندما يتبقى شخصين فقط.',
  },
  {
    id: 'admin',
    title: '💻 ريموت الطبيب / المسير',
    subtitle: 'تحكم فائق السرعة من الهاتف أو الكمبيوتر',
    image: '/shots/admin-dashboard-desktop.png',
    description: 'لوحة محمية برمز PIN تتيح للطبيب استدعاء التالي، تأكيد الدخول، تأكيد الخروج، تأجيل الزبون المتأخر (Smart Hold)، إجراء رنة سريعة، وإصدار تذاكر حضورية بنقرة واحدة.',
  },
  {
    id: 'tv',
    title: '📺 شاشة تلفاز الصالة',
    subtitle: 'عرض حي بدون كابلات على أي Smart TV',
    image: '/shots/tv-display-1080p.png',
    description: 'شاشة سينمائية بدقة 1080p Full HD تعمل على أي تلفاز متصل بالإنترنت بمجرد فتح الرابط في المتصفح. تعرض الرقم المستدعى بصوت جرس عالي وقائمة الانتظار بوضوح تام.',
  },
  {
    id: 'stand',
    title: '📄 ملصق A4 الميداني',
    subtitle: 'جاهز للطباعة والتعليق في 5 ثوانٍ',
    image: '/shots/admin-stand-modal.png',
    description: 'قالب رسمي عالي الدقة يطبع بضغطة زر واحدة على أي طابعة عادية ليوضع على طاولة الاستقبال أو باب العيادة متضمناً كود QR و3 خطوات إرشادية للمراجعين.',
  },
  {
    id: 'stats',
    title: '📊 تقارير Excel ورضا العملاء',
    subtitle: 'إحصائيات فورية وتصدير بنقرة واحدة',
    image: '/shots/admin-stats-modal.png',
    description: 'إحصائيات لحظية عن عدد المراجعين ومتوسط وقت كل خدمة وتقييمات الرضا الفورية (😄/😐/🙁)، مع إمكانية تحميل تقرير اليوم الكامل بصيغة Excel/CSV بترميز عربي سليم.',
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
    badge: 'الأكثر طلباً للعيادات',
  },
  {
    slug: 'barber-elite',
    title: 'صالون إيليت للحلاقة الرجالية',
    subtitle: 'حلاقة عصرية وعناية شخصية',
    sector: 'زبون',
    staff: 'الحلاق',
    avgMins: 20,
    icon: Scissors,
    badge: 'صالونات ومراكز التجميل',
  },
  {
    slug: 'univ-g2',
    title: 'مصلحة الشؤون الطلابية',
    subtitle: 'مدرج 2 - سحب الكشوفات والشهادات',
    sector: 'طالب',
    staff: 'مسؤول الشباك',
    avgMins: 10,
    icon: GraduationCap,
    badge: 'المؤسسات والإدارات',
  },
];

const faqs = [
  {
    q: 'هل يحتاج المراجع أو المريض إلى تحميل أي تطبيق على هاتفه؟',
    a: 'إطلاقاً! يفتح المراجع كاميرا هاتفه العادية فقط ويمسح الرمز، فيفتح له النظام فوراً كصفحة ويب سريعة وخفيفة جداً تعمل على أي هاتف (iPhone أو Android).',
  },
  {
    q: 'هل نحتاج لشراء أجهزة خاصة، شاشات باهظة أو طابعات تذاكر ورقية؟',
    a: 'لا نهائياً، تكلفة العتاد الإضافي صفر دج. الطبيب أو المسير يتحكم من هاتفه أو كمبيوتر العيادة الحالي، وإذا رغبتم في شاشة صالة يكفي فتح رابط الشاشة في متصفح أي تلفاز Smart TV موجود لديكم.',
  },
  {
    q: 'ماذا لو جاء مراجع كبير في السن أو لا يملك هاتفاً ذكياً؟',
    a: 'تم تزويد ريموت المسير بزر "تذكرة حضورية": يسجله المسير في 3 ثوانٍ فقط، ويظهر له النظام فوراً رقم التذكرة وساعة العودة التقريبية ليخبره بها، مع إمكانية كتابة رقم هاتفه لإجراء رنة سريعة (Bip) له وقت دوره.',
  },
  {
    q: 'ماذا يحدث إذا تأخر الزبون وكان جالساً في المقهى أو خارج العيادة؟',
    a: 'أولاً: يرسل له النظام تنبيهاً صوتياً واهتزازاً عندما يتبقى شخصين فقط أمامه. ثانياً: إذا نودي ولم يحضر، يضغط المسير على زر "تأجيل (Hold)" فيمر الذي بعده دون تعطيل القاعة، وعندما يعود الزبون يستدعيه المسير بضغطة واحدة فوراً.',
  },
  {
    q: 'هل يتحمل النظام آلاف المراجعين في أوقات الذروة دون توقف؟',
    a: 'نعم، النظام مبني على خوادم سحابية عالمية (Vercel Edge Network) مع قاعدة بيانات PostgreSQL سريعة وكاش ذكي يخفض الضغط بنسبة 98%، مما يضمن استجابة فائقة السرعة واستقراراً تاماً.',
  },
  {
    q: 'هل يمكن تخصيص اسم العيادة وشعارها والرمز السري؟',
    a: 'نعم بكل تأكيد! تملك لوحة تحكم كاملة تتيح لك تغيير اسم المؤسسة، مدة الخدمة بالدقائق، رمز PIN السري، وتنزيل تقارير Excel اليومية في أي وقت.',
  },
];

export default function PromotionalLandingPage() {
  const [activeShot, setActiveShot] = useState('customer');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const currentScreenshot = screenshots.find((s) => s.id === activeShot) || screenshots[0];

  return (
    <div className="min-h-screen bg-slateNavy-950 text-slateNavy-100 flex flex-col selection:bg-slateNavy-400 selection:text-slateNavy-950 font-sans" dir="rtl">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-slateNavy-900 border-b border-slateNavy-800 py-2 px-4 text-center text-xs font-medium text-slateNavy-300">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>النسخة التجارية الميدانية 2.0 أصبحت جاهزة للتشغيل والتعاقد الفوري مع العيادات والمراكز!</span>
        </span>
      </div>

      {/* 2. MAIN NAVBAR */}
      <header className="sticky top-0 z-40 bg-slateNavy-950/85 backdrop-blur-md border-b border-slateNavy-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slateNavy-700 to-slateNavy-900 border border-slateNavy-700 flex items-center justify-center text-slateNavy-100 font-black shadow-lg">
              <Zap className="w-5 h-5 text-slateNavy-100" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                طابوري الذكي
                <span className="text-[10px] bg-slateNavy-800 text-slateNavy-300 px-2 py-0.5 rounded-full border border-slateNavy-700">SaaS</span>
              </span>
              <p className="text-[10px] text-slateNavy-400 -mt-0.5">نظام إدارة الطوابير بدون أجهزة ورقية</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slateNavy-300">
            <a href="#features" className="hover:text-white transition">المزايا الميدانية</a>
            <a href="#how-it-works" className="hover:text-white transition">كيف يعمل</a>
            <a href="#showcase" className="hover:text-white transition">معرض الشاشات</a>
            <a href="#demos" className="hover:text-white transition">نماذج حية (Demo)</a>
            <a href="#comparison" className="hover:text-white transition">مقارنة التكلفة</a>
            <a href="#faq" className="hover:text-white transition">الأسئلة الشائعة</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/super-admin"
              className="hidden sm:inline-flex text-xs font-semibold px-3 py-2 bg-slateNavy-900 hover:bg-slateNavy-800 border border-slateNavy-800 text-slateNavy-300 hover:text-white rounded-xl transition"
            >
              لوحة المشرف
            </Link>

            <a
              href="#demos"
              className="text-xs font-bold px-4 py-2 bg-slateNavy-100 hover:bg-white text-slateNavy-950 rounded-xl transition shadow-sm active:scale-95"
            >
              جرّب النظام الآن
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-slateNavy-800/30 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slateNavy-900 border border-slateNavy-800 text-slateNavy-300 text-xs font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>وداعاً للاكتظاظ والضجيج في قاعات الانتظار</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.25]">
            أفرغ صالة الانتظار تماماً.. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slateNavy-200 via-slateNavy-400 to-white">
              ودع زبائنك يتابعون دورهم أينما كانوا
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slateNavy-300 max-w-2xl mx-auto leading-relaxed">
            حوّل هاتف مراجعك إلى تذكرة إلكترونية ذكية تحسب ساعة دخوله بالدقيقة وتنبّهه صوتياً قبل دوره. بدون شراء طابعات ورقية مكلفة، وبدون كابلات أو شاشات معقدة.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <a
              href="#demos"
              className="w-full sm:w-auto px-7 py-3.5 bg-slateNavy-100 hover:bg-white text-slateNavy-950 text-sm font-black rounded-2xl shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-slateNavy-950" />
              <span>ابدأ التجربة الحية الفورية (Live Demo)</span>
            </a>

            <a
              href="https://wa.me/213550000000?text=مرحباً،%20أريد%20الاستفسار%20عن%20نظام%20إدارة%20الطوابير%20الذكي%20لعيادتي"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-slateNavy-900 hover:bg-slateNavy-800 border border-slateNavy-700 text-slateNavy-100 text-sm font-bold rounded-2xl transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>اطلب النظام لعيادتك عبر واتساب</span>
            </a>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 max-w-3xl mx-auto text-center">
            <div className="p-3 bg-slateNavy-900/60 border border-slateNavy-800 rounded-2xl">
              <p className="text-lg font-black text-white">0 دج</p>
              <p className="text-xs text-slateNavy-400 mt-0.5">تكلفة عتاد إضافي</p>
            </div>
            <div className="p-3 bg-slateNavy-900/60 border border-slateNavy-800 rounded-2xl">
              <p className="text-lg font-black text-white">بدون تطبيق</p>
              <p className="text-xs text-slateNavy-400 mt-0.5">مسح QR بالكاميرا فقط</p>
            </div>
            <div className="p-3 bg-slateNavy-900/60 border border-slateNavy-800 rounded-2xl">
              <p className="text-lg font-black text-white">تنبيه ذكي</p>
              <p className="text-xs text-slateNavy-400 mt-0.5">صوتي عند بقاء شخصين</p>
            </div>
            <div className="p-3 bg-slateNavy-900/60 border border-slateNavy-800 rounded-2xl">
              <p className="text-lg font-black text-white">تقارير Excel</p>
              <p className="text-xs text-slateNavy-400 mt-0.5">وتقييم رضا فوري</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE SHOWCASE SECTION (Real Screenshots Mockups) */}
      <section id="showcase" className="py-16 px-4 sm:px-6 bg-slateNavy-900/40 border-y border-slateNavy-800">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-slateNavy-400 uppercase tracking-wider">شاهد النظام الحقيقي أثناء العمل</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">واجهات أنيقة صُممت لتسهيل حياة الجميع</h2>
            <p className="text-xs sm:text-sm text-slateNavy-300">
              اختر الشاشة التي تريد معاينتها واكتشف كيف يربط النظام بين المراجع، الطبيب، وشاشة صالة الانتظار بتناغم فوري.
            </p>
          </div>

          {/* Device Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2">
            {screenshots.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveShot(s.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 border ${
                  activeShot === s.id
                    ? 'bg-slateNavy-100 text-slateNavy-950 border-white shadow-lg scale-105'
                    : 'bg-slateNavy-900 hover:bg-slateNavy-800 text-slateNavy-300 border-slateNavy-800'
                }`}
              >
                <span>{s.title}</span>
              </button>
            ))}
          </div>

          {/* Active Screen Display Card */}
          <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slateNavy-800 pb-5">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>{currentScreenshot.title}</span>
                  <span className="text-xs bg-slateNavy-800 text-slateNavy-300 px-2.5 py-0.5 rounded-full font-normal">
                    {currentScreenshot.subtitle}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slateNavy-300 mt-1 max-w-2xl leading-relaxed">
                  {currentScreenshot.description}
                </p>
              </div>

              <a
                href="#demos"
                className="shrink-0 text-xs font-bold px-4 py-2 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 rounded-xl border border-slateNavy-700 transition flex items-center gap-1.5"
              >
                <span>جربها حية في الـ Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Screen Mockup Frame */}
            <div className="relative rounded-2xl overflow-hidden border border-slateNavy-700/80 bg-slateNavy-950 shadow-inner flex items-center justify-center min-h-[350px] max-h-[600px] p-2">
              <img
                src={currentScreenshot.image}
                alt={currentScreenshot.title}
                className="w-full h-auto max-h-[560px] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (3 Simple Steps) */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-slateNavy-400 uppercase tracking-wider">بساطة تشغيل مذهلة</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">كيف يعمل النظام في الميدان؟</h2>
            <p className="text-xs sm:text-sm text-slateNavy-300 max-w-xl mx-auto">
              3 خطوات سلسة تختصر ساعات الانتظار وتلغي الفوضى نهائياً داخل العيادة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-6 space-y-4 relative">
              <div className="w-12 h-12 bg-slateNavy-800 border border-slateNavy-700 rounded-2xl flex items-center justify-center text-white font-black text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-white">مسح كود QR عند الوصول</h3>
              <p className="text-xs sm:text-sm text-slateNavy-300 leading-relaxed">
                يصل المراجع ويجد ملصقاً أنيقاً على طاولة الاستقبال. يمسح الكود بكاميرا هاتفه دون أي تطبيق، ويدخل رقم هاتفه ليحجز دوره فوراً.
              </p>
              <div className="pt-2 text-[11px] text-slateNavy-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>يستغرق الحجز 5 ثوانٍ فقط</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-6 space-y-4 relative">
              <div className="w-12 h-12 bg-slateNavy-800 border border-slateNavy-700 rounded-2xl flex items-center justify-center text-white font-black text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-white">الانتظار بحرية أينما يريد</h3>
              <p className="text-xs sm:text-sm text-slateNavy-300 leading-relaxed">
                يعرض الهاتف للمراجع ساعة دخوله التقريبية وعدد المنتظرين قبله. يمكنه مغادرة العيادة إلى المقهى، السيارة، أو قضاء مشاويره براحة تامة.
              </p>
              <div className="pt-2 text-[11px] text-slateNavy-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>إفراغ كامل لصالة العيادة</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-6 space-y-4 relative">
              <div className="w-12 h-12 bg-slateNavy-800 border border-slateNavy-700 rounded-2xl flex items-center justify-center text-white font-black text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-white">تنبيه ذكي ودخول فوري</h3>
              <p className="text-xs sm:text-sm text-slateNavy-300 leading-relaxed">
                عندما يتبقى شخصين أمامه، يرن هاتفه وينبهه صوتياً للحضور للصالة. وعند استدعائه يدخل مباشرة، ثم يقيّم الخدمة بلمسة واحدة عند خروجه.
              </p>
              <div className="pt-2 text-[11px] text-slateNavy-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>صفر تضييع لوقت الطبيب</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMPARISON: TRADITIONAL vs SMART QUEUE */}
      <section id="comparison" className="py-16 px-4 sm:px-6 bg-slateNavy-900/40 border-y border-slateNavy-800">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-slateNavy-400 uppercase tracking-wider">لماذا هذا النظام استثمار رابح؟</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">الأنظمة القديمة مقابل "طابوري الذكي"</h2>
          </div>

          <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-2 text-center border-b border-slateNavy-800 py-3 bg-slateNavy-950/80 font-bold text-xs sm:text-sm">
              <div className="text-rose-400">أجهزة الطوابير والورق التقليدية ❌</div>
              <div className="text-emerald-400">نظام "طابوري الذكي" السحابي ⚡</div>
            </div>

            <div className="divide-y divide-slateNavy-800/60 text-xs sm:text-sm">
              <div className="grid grid-cols-2 p-4 items-center">
                <div className="text-slateNavy-400 text-center sm:text-right">شراء جهاز طابعة تذاكر باهظ الثمن (120,000+ دج)</div>
                <div className="text-slateNavy-100 font-bold text-center sm:text-right flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>0 دج، ملصق QR يطبع على أي ورقة عادية</span>
                </div>
              </div>

              <div className="grid grid-cols-2 p-4 items-center">
                <div className="text-slateNavy-400 text-center sm:text-right">تكلفة شهرية مستمرة لبكرات الورق والصيانة والأحبار</div>
                <div className="text-slateNavy-100 font-bold text-center sm:text-right flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>صفر استهلاك للورق، هاتف الزبون هو التذكرة</span>
                </div>
              </div>

              <div className="grid grid-cols-2 p-4 items-center">
                <div className="text-slateNavy-400 text-center sm:text-right">قاعة انتظار مكتظة، ضجيج، وتوتر وعدوى بين المرضى</div>
                <div className="text-slateNavy-100 font-bold text-center sm:text-right flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>قاعة هادئة وفارغة، المراجع ينتظر حيث يشاء</span>
                </div>
              </div>

              <div className="grid grid-cols-2 p-4 items-center">
                <div className="text-slateNavy-400 text-center sm:text-right">المراجع لا يعرف متى سيدخل، فيغادر غاضباً أو يسأل كل دقيقة</div>
                <div className="text-slateNavy-100 font-bold text-center sm:text-right flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>عدّاد حي بالدقيقة ورنة تنبيه قبل دوره بشخصين</span>
                </div>
              </div>

              <div className="grid grid-cols-2 p-4 items-center">
                <div className="text-slateNavy-400 text-center sm:text-right">لا توجد إحصائيات دقيقة عن عدد المراجعين ورضاهم</div>
                <div className="text-slateNavy-100 font-bold text-center sm:text-right flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>تقارير Excel يومية وتقييم خدمة بلمسة واحدة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LIVE INTERACTIVE DEMOS */}
      <section id="demos" className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-slateNavy-400 uppercase tracking-wider">جرب كل شيء بنفسك الآن</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">اختر نشاطاً واختبر المنظومة مباشرة</h2>
            <p className="text-xs sm:text-sm text-slateNavy-300 max-w-xl mx-auto">
              يمكنك فتح شاشة هاتف الزبون وتجربة أخذ دور، وفي نفس الوقت فتح ريموت الطبيب لاستدعائه ومتابعة شاشة الصالة!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demos.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.slug}
                  className="bg-slateNavy-900 border border-slateNavy-800 hover:border-slateNavy-700 rounded-3xl p-5 flex flex-col justify-between shadow-xl transition space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-slateNavy-800 border border-slateNavy-700 flex items-center justify-center text-slateNavy-100">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] bg-slateNavy-800 text-slateNavy-300 px-2.5 py-1 rounded-full font-bold border border-slateNavy-700">
                        {d.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-white">{d.title}</h3>
                      <p className="text-xs text-slateNavy-400 mt-0.5">{d.subtitle}</p>
                    </div>

                    <div className="bg-slateNavy-950 p-2.5 rounded-xl border border-slateNavy-800/80 flex items-center justify-between text-xs text-slateNavy-300">
                      <span>وقت الخدمة المقدر:</span>
                      <span className="font-bold text-white">{d.avgMins} دقيقة / {d.sector}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slateNavy-800">
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
                      <span>شاشة صالة الانتظار الكبيرة</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. PACKAGES & PRICING */}
      <section className="py-16 px-4 sm:px-6 bg-slateNavy-900/40 border-y border-slateNavy-800">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-slateNavy-400 uppercase tracking-wider">خيارات مرنة ومربحة</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">باقات الاشتراك والتشغيل المقترحة</h2>
            <p className="text-xs sm:text-sm text-slateNavy-300 max-w-xl mx-auto">
              استثمر في راحة مرضاك وزبائنك بأقل من تكلفة فاتورة الورق الشهرية للأجهزة القديمة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1 */}
            <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slateNavy-400">باقة العيادة الفردية</span>
                <h3 className="text-xl font-black text-white">الأساسية (Starter)</h3>
                <p className="text-xs text-slateNavy-400">مناسبة لعيادة طبيب عام أو صالون حلاقة فردي.</p>

                <div className="py-2 border-y border-slateNavy-800">
                  <span className="text-3xl font-black text-white">15,000</span>
                  <span className="text-xs text-slateNavy-400 mr-1.5">دج / سنوياً</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slateNavy-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>رابط خاص وملصق QR رسمي للعيادة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تذاكر غير محدودة طوال العام</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تنبيه صوتي لحضور المراجعين</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تأكيد الدخول والخروج التلقائي</span>
                  </li>
                </ul>
              </div>

              <a
                href="https://wa.me/213550000000?text=أريد%20الاشتراك%20في%20الباقة%20الأساسية"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 font-bold text-xs rounded-xl border border-slateNavy-700 transition text-center"
              >
                طلب الباقة الأساسية
              </a>
            </div>

            {/* Tier 2: Most Popular */}
            <div className="bg-slateNavy-900 border-2 border-slateNavy-100 rounded-3xl p-6 space-y-6 flex flex-col justify-between relative shadow-2xl">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-slateNavy-100 text-slateNavy-950 font-black text-[10px] rounded-full uppercase tracking-wider">
                الأكثر اختياراً للمراكز
              </span>

              <div className="space-y-4">
                <span className="text-xs font-bold text-slateNavy-300">باقة المراكز والمجمعات</span>
                <h3 className="text-xl font-black text-white">المحترفة (Pro)</h3>
                <p className="text-xs text-slateNavy-400">مثالية للمراكز الطبية ومكاتب التوثيق والخدمات.</p>

                <div className="py-2 border-y border-slateNavy-800">
                  <span className="text-3xl font-black text-white">28,000</span>
                  <span className="text-xs text-slateNavy-400 mr-1.5">دج / سنوياً</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slateNavy-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>كل مميزات الباقة الأساسية</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>شاشة تلفاز صالة الانتظار Full HD مع نداء صوتي</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تصدير تقارير Excel اليومية ورضا العملاء</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>نظام التأجيل الذكي (Smart Hold) والرنة الهاتفية</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>دعم فني مخصص وأولوية في التحديثات</span>
                  </li>
                </ul>
              </div>

              <a
                href="https://wa.me/213550000000?text=أريد%20الاشتراك%20في%20باقة%20المحترفين%20Pro"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-slateNavy-100 hover:bg-white text-slateNavy-950 font-black text-xs rounded-xl shadow-lg transition text-center"
              >
                طلب باقة المحترفين الآن
              </a>
            </div>

            {/* Tier 3: Enterprise */}
            <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slateNavy-400">باقة المستشفيات والمؤسسات</span>
                <h3 className="text-xl font-black text-white">المؤسسية (Enterprise)</h3>
                <p className="text-xs text-slateNavy-400">للمؤسسات الكبرى متعددة العيادات والأقسام.</p>

                <div className="py-2 border-y border-slateNavy-800">
                  <span className="text-2xl font-black text-white">حسب الطلب</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slateNavy-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>ربط مئات الأقسام والشبابيك في منصة واحدة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>نطاق مخصص خاص بمؤسستكم (Domain)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تخصيص كامل للألوان والشعار والنداءات</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>عقد صيانة ودعم ميداني وتدريب الفريق</span>
                  </li>
                </ul>
              </div>

              <a
                href="https://wa.me/213550000000?text=طلب%20عرض%20سعر%20لباقة%20المؤسسات"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 font-bold text-xs rounded-xl border border-slateNavy-700 transition text-center"
              >
                طلب عرض سعر خاص
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section id="faq" className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-slateNavy-400 uppercase tracking-wider">إجابات واضحة</span>
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

      {/* 10. FINAL CTA & FOOTER */}
      <footer className="bg-slateNavy-900 border-t border-slateNavy-800 pt-12 pb-8 px-4 sm:px-6 mt-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="bg-gradient-to-r from-slateNavy-950 via-slateNavy-900 to-slateNavy-950 border border-slateNavy-800 rounded-3xl p-6 sm:p-10 text-center space-y-4 shadow-2xl">
            <h3 className="text-xl sm:text-3xl font-black text-white">
              جاهز لإفراغ صالة الانتظار وتنظيم مواعيدك بذكاء؟
            </h3>
            <p className="text-xs sm:text-sm text-slateNavy-300 max-w-lg mx-auto">
              تواصل معنا الآن، وسنقوم بتفعيل حساب عيادتك وإرسال ملصق الـ QR الخاص بك لتبدأ العمل في أقل من 10 دقائق!
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/213550000000?text=مرحباً،%20أريد%20تفعيل%20حساب%20لعيادتي%20اليوم"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-slateNavy-100 hover:bg-white text-slateNavy-950 font-black text-xs rounded-xl shadow transition"
              >
                تحدث مع المبيعات عبر واتساب
              </a>
              <Link
                href="/super-admin"
                className="px-5 py-3 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-200 font-bold text-xs rounded-xl border border-slateNavy-700 transition"
              >
                لوحة إضافة مؤسسة جديدة (Super Admin)
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slateNavy-800 text-xs text-slateNavy-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slateNavy-200">طابوري الذكي (Smart Queue System)</span>
              <span>• جميع الحقوق محفوظة {new Date().getFullYear()}</span>
            </div>

            <div className="flex items-center gap-4">
              <a href="#features" className="hover:text-white transition">المزايا</a>
              <a href="#demos" className="hover:text-white transition">النماذج</a>
              <a href="#faq" className="hover:text-white transition">الأسئلة</a>
              <Link href="/super-admin" className="hover:text-white transition">بوابة الإدارة</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
