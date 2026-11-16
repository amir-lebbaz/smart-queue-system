import Link from 'next/link';
import { 
  Building2, 
  Smartphone, 
  Scissors, 
  Stethoscope, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  WifiOff, 
  PhoneCall, 
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

const demos = [
  {
    slug: 'clinic-amal',
    title: 'عيادة الأمل الطبية',
    subtitle: 'د. بوعلام - طب عام واستشارات',
    sector: 'مريض',
    staff: 'الطبيب',
    avgMins: 15,
    icon: Stethoscope,
  },
  {
    slug: 'barber-elite',
    title: 'صالون إيليت للحلاقة الرجالية',
    subtitle: 'حلاقة عصرية وعناية شخصية',
    sector: 'زبون',
    staff: 'الحلاق',
    avgMins: 20,
    icon: Scissors,
  },
  {
    slug: 'univ-g2',
    title: 'مصلحة الشؤون الطلابية',
    subtitle: 'مدرج 2 - سحب الكشوفات والشهادات',
    sector: 'طالب',
    staff: 'مسؤول الشباك',
    avgMins: 10,
    icon: GraduationCap,
  },
];

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col justify-between p-4 sm:p-8 max-w-5xl mx-auto w-full bg-slateNavy-950 text-slateNavy-100" dir="rtl">
      {/* Header & Hero */}
      <div className="space-y-6 pt-4 pb-8 text-center sm:text-right">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slateNavy-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slateNavy-900 border border-slateNavy-800 flex items-center justify-center text-slateNavy-100 font-black text-xl">
              ⚡
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slateNavy-100">نظام الطابور الذكي العام</h1>
              <p className="text-xs text-slateNavy-400">إفراغ قاعات الانتظار • صفر تكلفة عتاد إضافي</p>
            </div>
          </div>

          <Link
            href="/super-admin"
            className="text-xs font-semibold px-4 py-2 bg-slateNavy-900 hover:bg-slateNavy-800 border border-slateNavy-800 text-slateNavy-100 rounded-xl transition flex items-center gap-1.5"
          >
            <span>لوحة مالك النظام (Super Admin)</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-slateNavy-900 border border-slateNavy-800 text-slateNavy-100 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-slateNavy-400" />
            بدون شاشات تلفاز وبدون طابعات تذاكر ورقية
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slateNavy-100 tracking-tight leading-tight">
            دع الزبائن يغادرون القاعة مطمئنين.. وادعهم وقت حضور دورهم بدقة
          </h2>
          <p className="text-sm sm:text-base text-slateNavy-400 mt-2 leading-relaxed">
            حل فائق الخفة مخصص للعيادات، صالونات الحلاقة، ومكاتب الإدارة. مع تأكيد دقيق لمراحل: (استدعاء ← تأكيد الدخول ← إنهاء وخروج الزبون).
          </p>
        </div>
      </div>

      {/* 3 Seeded Demo Sectors */}
      <section className="space-y-4 my-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slateNavy-100 flex items-center gap-2">
            <span>اختر قطاعاً لتجربة النظام مباشرة:</span>
          </h3>
          <span className="text-xs text-slateNavy-400">3 نماذج مهيأة مسبقاً</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demos.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.slug}
                className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-5 flex flex-col justify-between hover:border-slateNavy-700 transition shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-slateNavy-800 border border-slateNavy-700 flex items-center justify-center text-slateNavy-100">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-slateNavy-950 border-slateNavy-800 text-slateNavy-400">
                      {d.sector} • {d.staff}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slateNavy-100 mb-1">{d.title}</h4>
                  <p className="text-xs text-slateNavy-400 mb-4">{d.subtitle}</p>

                  <div className="text-[11px] text-slateNavy-400 space-y-1 mb-4 bg-slateNavy-950 p-2.5 rounded-xl border border-slateNavy-800">
                    <p>• رمز PIN للمسير: <strong className="font-mono text-slateNavy-100">1234</strong></p>
                    <p>• متوسط الخدمة: <strong className="text-slateNavy-100">{d.avgMins} دقيقة</strong></p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slateNavy-800">
                  <Link
                    href={`/admin/${d.slug}`}
                    className="w-full py-2.5 px-3 bg-slateNavy-100 hover:bg-white text-slateNavy-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <span>فتح ريموت المسير (PWA)</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </Link>

                  <Link
                    href={`/q/${d.slug}`}
                    className="w-full py-2.5 px-3 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-slateNavy-700"
                  >
                    <span>شاشة حجز تذكرة الزبون</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Edge-Cases Highlight Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
        <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-2xl p-4 flex items-start gap-3">
          <PhoneCall className="w-5 h-5 text-slateNavy-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slateNavy-100">أصحاب الهاتف البسيط (هاتف حطبة)</h4>
            <p className="text-[11px] text-slateNavy-400 mt-1 leading-relaxed">
              تذكرة حضورية سريعة مع وقت عودة تقريبي بدقة ورنة مجانية أو SMS بنقرة واحدة.
            </p>
          </div>
        </div>

        <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-2xl p-4 flex items-start gap-3">
          <WifiOff className="w-5 h-5 text-slateNavy-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slateNavy-100">يعمل بدون إنترنت (Offline PWA)</h4>
            <p className="text-[11px] text-slateNavy-400 mt-1 leading-relaxed">
              تخزين محلي للتذكرة مع عداد زمني مستقل وتنبيهات صوتية واهتزاز.
            </p>
          </div>
        </div>

        <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-slateNavy-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slateNavy-100">تأكيد الحضور وتجميد الدور</h4>
            <p className="text-[11px] text-slateNavy-400 mt-1 leading-relaxed">
              استدعاء ← تأكيد الدخول ← إنهاء وخروج الزبون، مع ميزة حفظ الدور في حال التأخر.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 border-t border-slateNavy-800 text-xs text-slateNavy-400">
        مشروع الطابور الذكي العام • تصميم مبسط وهادئ • Next.js & SQLite
      </footer>
    </main>
  );
}
