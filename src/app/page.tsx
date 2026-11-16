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
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    slug: 'barber-elite',
    title: 'صالون إيليت للحلاقة الرجالية',
    subtitle: 'حلاقة عصرية وعناية شخصية',
    sector: 'زبون',
    staff: 'الحلاق',
    avgMins: 20,
    icon: Scissors,
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    slug: 'univ-g2',
    title: 'مصلحة الشؤون الطلابية',
    subtitle: 'مدرج 2 - سحب الكشوفات والشهادات',
    sector: 'طالب',
    staff: 'مسؤول الشباك',
    avgMins: 10,
    icon: GraduationCap,
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  },
];

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col justify-between p-4 sm:p-8 max-w-5xl mx-auto w-full" dir="rtl">
      {/* Header & Hero */}
      <div className="space-y-6 pt-4 pb-8 text-center sm:text-right">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xl">
              ⚡
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">نظام الطابور الذكي العام</h1>
              <p className="text-xs text-slate-400">إفراغ قاعات الانتظار • صفر تكلفة عتاد إضافي</p>
            </div>
          </div>

          <Link
            href="/super-admin"
            className="text-xs font-semibold px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition flex items-center gap-1.5"
          >
            <span>لوحة مالك النظام (Super Admin)</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            بدون شاشات تلفاز وبدون طابعات تذاكر ورقية
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            دع الزبائن يغادرون القاعة مطمئنين.. وادعهم وقت حضور دورهم بدقة
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
            حل فائق الخفة مخصص للعيادات، صالونات الحلاقة، مكاتب التوثيق، والمصالح الإدارية. يعمل بالكامل عبر هاتف المسير وملصق QR جداري واحد.
          </p>
        </div>
      </div>

      {/* 3 Seeded Demo Sectors */}
      <section className="space-y-4 my-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>اختر قطاعاً لتجربة النظام مباشرة:</span>
          </h3>
          <span className="text-xs text-slate-500">3 نماذج مهيأة مسبقاً</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demos.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.slug}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-slate-700 transition shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${d.badgeColor}`}>
                      {d.sector} • {d.staff}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-1">{d.title}</h4>
                  <p className="text-xs text-slate-400 mb-4">{d.subtitle}</p>

                  <div className="text-[11px] text-slate-400 space-y-1 mb-4 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <p>• رمز PIN للمسير: <strong className="font-mono text-amber-400">1234</strong></p>
                    <p>• متوسط الخدمة: <strong className="text-sky-400">{d.avgMins} دقيقة</strong></p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <Link
                    href={`/admin/${d.slug}`}
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <span>فتح ريموت المسير (PWA)</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </Link>

                  <Link
                    href={`/q/${d.slug}`}
                    className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
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
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3">
          <PhoneCall className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-white">أصحاب الهاتف البسيط (هاتف حطبة)</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              يسجل المسير تذكرة حضورية ويخبر الزبون بساعة العودة الدقيقة، مع رنة سريعة Bip أو SMS بنقرة واحدة.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3">
          <WifiOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-white">يعمل حتى بعد انقطاع الإنترنت</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              تحفظ التذكرة محلياً، ويدير الهاتف عداداً ذاتياً مع إطلاق نغمة Chime واهتزاز فور اقتراب الدور.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-white">تجميد وحفظ الدور (Smart Hold)</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              إذا تأخر الزبون، ينقر المسير "تأجيل خطوة" لاستدعاء التالي فوراً مع إبقاء الزبون في أولوية الدخول فور وصوله.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 border-t border-slate-900 text-xs text-slate-500">
        مشروع الطابور الذكي العام • Next.js & SQLite • صُمم خصيصاً للتطبيق الميداني الفوري
      </footer>
    </main>
  );
}
