import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Database, 
  Trash2, 
  PhoneCall, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight,
  FileText,
  EyeOff,
  Server
} from 'lucide-react';
import NextDZLogo from '@/components/NextDZLogo';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | NextDZ',
  description: 'سياسة الخصوصية وحماية بيانات الزوار والمؤسسات في منصة NextDZ لإدارة طوابير الانتظار الذكية بدون أجهزة.',
};

const PHONE_NUMBER = '0666 56 80 39';
const WHATSAPP_URL = 'https://wa.me/213666568039?text=مرحباً،%20لدي%20استفسار%20بخصوص%20سياسة%20الخصوصية%20في%20NextDZ';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--canvas-bg)] text-[var(--text-primary)] font-sans antialiased selection:bg-[#778ca4]/30">
      
      {/* =========================================================================
          TOP HEADER
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[var(--canvas-bg)]/90 backdrop-blur-md border-b border-[var(--border-color)] transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="inline-block group" aria-label="NextDZ الصفحة الرئيسية">
            <NextDZLogo width={38} height={24} textSize="text-lg sm:text-xl" />
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-3 sm:gap-5 text-xs font-bold">
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </Link>
            
            <Link 
              href="/terms"
              className="hidden sm:inline-flex text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
            >
              شروط الاستخدام
            </Link>

            <ThemeToggle variant="compact" showLabel={false} />
          </div>
        </div>
      </header>

      {/* =========================================================================
          HERO BANNER
          ========================================================================= */}
      <section className="px-4 sm:px-6 pt-10 pb-8 sm:pt-14 sm:pb-12 border-b border-[var(--border-color)] bg-[var(--surface-elevated)]/40">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface-bg)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#778ca4]" />
            <span>الشفافية وحماية البيانات</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] heading-balance">
            سياسة الخصوصية (Privacy Policy)
          </h1>

          <p className="text-sm sm:text-base font-normal text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            نظام <strong className="font-bold text-[var(--text-primary)]">NextDZ</strong> مبني على فلسفة احترام الخصوصية المطلقة. نحن نجمع فقط الحد الأدنى الصارم الضروري لتنظيم طابور الانتظار وضمان راحة المراجعين والسكرتارية، بدون أي تطفل إعلاني أو تتبّع خفي.
          </p>

          <div className="text-xs text-[var(--text-muted)] pt-1">
            آخر تحديث رسمي: نوفمبر 2026
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN LEGAL SECTIONS
          ========================================================================= */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        
        {/* Section 1: البيانات التي نجمعها */}
        <section className="bg-[var(--surface-bg)] rounded-2xl p-6 sm:p-8 border border-[var(--border-color)] shadow-[0_2px_10px_rgba(49,60,69,0.04)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
              <Smartphone className="w-4 h-4 text-[#778ca4]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              1. البيانات التي نجمعها (Data Collection)
            </h2>
          </div>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            لتقديم خدمة طابور انتظار سلسة دون تعقيدات تسجيل، نطلب فقط البيانات الأساسية الآتية:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 rounded-xl bg-[var(--surface-elevated)]/50 border border-[var(--border-color)] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-primary)]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>رقم الهاتف (إلزامي لحجز التذكرة)</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                يُستخدم لمعرفة صاحب التذكرة، وإتاحة استرجاعها في حال إغلاق المتصفح، ولتنبيهك عند اقتراب دورك.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-elevated)]/50 border border-[var(--border-color)] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-primary)]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>الاسم الشخصي (اختياري تماماً)</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                يساعد السكرتيرة أو الطبيب في مناداتك باسمك إن رغبت في إدخاله، ويمكنك تركه فارغاً.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-elevated)]/50 border border-[var(--border-color)] space-y-1.5 sm:col-span-2">
              <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-primary)]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>بيانات تقييم الخدمة (اختياري)</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                إن اخترت إرسال تقييم للخدمة بعد انتهاء موعدك، يُحفظ التقييم والملاحظات لمساعدة المؤسسة في تحسين جودة الاستقبال.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] flex items-start gap-2.5">
            <EyeOff className="w-4 h-4 text-[#778ca4] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[var(--text-primary)]">ما لا نجمعه أبداً:</strong> لا نطلب ولا نخزن أي بطاقات بنكية، ولا هويات وطنية، ولا عناوين بريد إلكتروني، ولا نطلب تثبيت أي تطبيقات ولا نصل إلى كاميرا أو موقع هاتفك الجغرافي.
            </span>
          </div>
        </section>

        {/* Section 2: كيف نستخدم بياناتك */}
        <section className="bg-[var(--surface-bg)] rounded-2xl p-6 sm:p-8 border border-[var(--border-color)] shadow-[0_2px_10px_rgba(49,60,69,0.04)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
              <Server className="w-4 h-4 text-[#778ca4]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              2. كيف نستخدم بياناتك (How We Use Your Data)
            </h2>
          </div>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            تُعالج البيانات حصراً للأغراض التشغيلية المباشرة الآتية:
          </p>

          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#778ca4] mt-2 shrink-0" />
              <span>
                <strong className="text-[var(--text-primary)]">ربط واسترجاع التذكرة:</strong> يُستخدم رقم الهاتف لربط تذكرتك بالنظام لضمان استرجاع حالتها فورياً ومواصلة متابعة دورك حتى لو قمت بتحديث الصفحة أو إغلاق المتصفح عن طريق الخطأ.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#778ca4] mt-2 shrink-0" />
              <span>
                <strong className="text-[var(--text-primary)]">التنبيه والاتصال السريع (Bip):</strong> لإشعارك عند اقتراب دورك بالدخول أو لإجراء رنة سريعة عند حلول دورك حتى لا تضيع وقتك بالجلوس داخل قاعة الانتظار المزدحمة.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#778ca4] mt-2 shrink-0" />
              <span>
                <strong className="text-[var(--text-primary)]">التخزين المحلي على جهازك (LocalStorage):</strong> نقوم بحفظ حالة التذكرة محلياً في ذاكرة متصفحك لضمان بقاء العداد التنازلي وتفاصيل دورك تعمل بسلاسة حتى لو حدث ضعف أو تقطّع مؤقت في اتصال الإنترنت.
              </span>
            </li>
          </ul>
        </section>

        {/* Section 3: حماية البيانات وعدم مشاركتها */}
        <section className="bg-[var(--surface-bg)] rounded-2xl p-6 sm:p-8 border border-[var(--border-color)] shadow-[0_2px_10px_rgba(49,60,69,0.04)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
              <Lock className="w-4 h-4 text-[#778ca4]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              3. حماية البيانات وعدم مشاركتها (Data Protection & Confidentiality)
            </h2>
          </div>

          <div className="space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              <strong className="text-[var(--text-primary)]">لا بيع للبيانات نهائياً:</strong> تلتزم NextDZ بعدم بيع أو تأجير أو مشاركة أرقام الهواتف أو بيانات المراجعين مع أي شركات إعلانية، وسطاء تسويق، أو أطراف ثالثة لأي سبب من الأسباب.
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">حصر البيانات داخل المؤسسة المعنية:</strong> تبقى بيانات تذكرتك محصورة فقط ضمن سجلات المؤسسة (العيادة، الصالون، أو المكتب) التي حجزت لديها لغرض استقبالك، ولدى الطاقم التقني المشرف على أمان واستقرار المنصة.
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">التشفير والاتصال الآمن:</strong> كافة الاتصالات بين هاتفك وخوادم المنصة تتم عبر بروتوكول HTTPS المشفر لمنع أي تنصت أو اعتراض للبيانات.
            </p>
          </div>
        </section>

        {/* Section 4: الاحتفاظ بالبيانات وحذفها */}
        <section className="bg-[var(--surface-bg)] rounded-2xl p-6 sm:p-8 border border-[var(--border-color)] shadow-[0_2px_10px_rgba(49,60,69,0.04)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
              <Trash2 className="w-4 h-4 text-[#778ca4]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              4. الاحتفاظ بالبيانات وحذفها (Retention & Right to Erasure)
            </h2>
          </div>

          <div className="space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              تُستخدم أرقام الهواتف المسجلة لإدارة الطابور اليومي، واحتساب إحصائيات الأداء الداخلية للمؤسسة (مثل متوسط وقت الانتظار وعدد الزوار اليومي).
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">حق الحذف الفوري:</strong> يحق لأي مراجع أو صاحب مؤسسة طلب حذف بياناته وسجلاته بالكامل في أي وقت ودون أي شروط معقدة، عن طريق التواصل المباشر مع فريق الدعم.
            </p>
          </div>
        </section>

        {/* Section 5: التواصل والدعم المباشر */}
        <section className="bg-[var(--surface-elevated)] rounded-2xl p-6 sm:p-8 border border-[var(--border-color)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
              <PhoneCall className="w-4 h-4 text-[#778ca4]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              5. الاستفسارات وحذف البيانات (Contact & Support)
            </h2>
          </div>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            لأي استفسار حول سياسة الخصوصية، أو لتقديم طلب حذف فوري لرقم هاتفك وسجلاتك من قواعد بياناتنا، يسعدنا تواصلك المباشر مع إدارة المنصة:
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--surface-bg)] hover:opacity-90 font-bold text-xs transition shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تواصل واتساب: {PHONE_NUMBER}</span>
            </a>

            <a
              href={`tel:${PHONE_NUMBER.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] font-bold text-xs transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>اتصال هاتفي مباشر</span>
            </a>
          </div>
        </section>

      </main>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--surface-elevated)]/30 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[var(--text-secondary)]">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-block">
              <NextDZLogo width={32} height={20} textSize="text-sm" />
            </Link>
            <span>— قاعة هادئة، سكرتيرة مرتاحة، زبائن راضون.</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/" className="hover:text-[var(--text-primary)] transition">
              الرئيسية
            </Link>
            <span className="text-[var(--border-color)]">|</span>
            <Link href="/terms" className="hover:text-[var(--text-primary)] transition">
              شروط الاستخدام
            </Link>
            <span className="text-[var(--border-color)]">|</span>
            <span className="text-[var(--text-primary)] font-bold">
              سياسة الخصوصية
            </span>
          </div>

          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} NextDZ.
          </div>
        </div>
      </footer>

    </div>
  );
}
