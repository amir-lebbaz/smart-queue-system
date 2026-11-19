import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  FileText, 
  Scale, 
  Clock, 
  PauseCircle, 
  AlertTriangle, 
  KeyRound, 
  PhoneCall, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Smartphone
} from 'lucide-react';
import NextDZLogo from '@/components/NextDZLogo';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'شروط الاستخدام | NextDZ',
  description: 'شروط وأحكام استخدام منصة NextDZ لتنظيم طوابير الانتظار الذكية بدون أجهزة أو طابعات ورقية.',
};

const PHONE_NUMBER = '0666 56 80 39';
const WHATSAPP_URL = 'https://wa.me/213666568039?text=مرحباً،%20لدي%20استفسار%20بخصوص%20شروط%20الاستخدام%20في%20NextDZ';

export default function TermsOfServicePage() {
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
              href="/privacy"
              className="hidden sm:inline-flex text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
            >
              سياسة الخصوصية
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
            <Scale className="w-4 h-4 text-[#778ca4]" />
            <span>اتفاقية الاستخدام والضوابط الرسمية</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] heading-balance">
            شروط الاستخدام (Terms of Service)
          </h1>

          <p className="text-sm sm:text-base font-normal text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            تحدد هذه الشروط الضوابط المنظمة لاستخدام منصة <strong className="font-bold text-[var(--text-primary)]">NextDZ</strong> لتنظيم طوابير الانتظار الذكية عن بُعد، وتضمن العلاقة المتوازنة بين الزوار وأصحاب المؤسسات.
          </p>

          <div className="text-xs text-[var(--text-muted)] pt-1">
            ساري المفعول: نوفمبر 2026
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN LEGAL SECTIONS
          ========================================================================= */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        
        {/* Section 1: طبيعة الخدمة وتقدير الوقت */}
        <section className="bg-[var(--surface-bg)] rounded-2xl p-6 sm:p-8 border border-[var(--border-color)] shadow-[0_2px_10px_rgba(49,60,69,0.04)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
              <Clock className="w-4 h-4 text-[#778ca4]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              1. طبيعة الخدمة وتقدير الوقت (Nature of Service)
            </h2>
          </div>

          <div className="space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              منصة <strong className="text-[var(--text-primary)]">NextDZ</strong> هي أداة برمجية ذكية وسيطة تُقدّم للمؤسسات (عيادات، صالونات حلاقة، مكاتب توثيق، ومراكز خدمات) بهدف مساعدة المراجعين على تتبع دورهم في الطابور عن بُعد دون الحاجة للجلوس الإجباري داخل قاعة الانتظار.
            </p>
            <div className="p-4 rounded-xl bg-[var(--surface-elevated)]/60 border border-[var(--border-color)] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-primary)]">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>طبيعة التوقيت المتوقع (HH:MM):</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                إن توقيت الدخول المتوقع الظاهر على التذكرة الذكية هو <strong className="text-[var(--text-primary)]">تقدير خوارزمي تقريبي</strong> مبني على متوسط وتيرة العمل الفعلية داخل العيادة أو المكتب. هذا التوقيت لا يُعتبر موعداً دقيقاً بالثانية ولا يشكل التزاماً زمنياً صارماً، حيث يخضع لطبيعة كل كشف طبي أو معاملة إدارية والمستجدات الميدانية.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: تنظيم الدور والتأجيل */}
        <section className="bg-[var(--surface-bg)] rounded-2xl p-6 sm:p-8 border border-[var(--border-color)] shadow-[0_2px_10px_rgba(49,60,69,0.04)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
              <PauseCircle className="w-4 h-4 text-[#778ca4]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              2. تنظيم الدور وسياسة التأجيل (Queue Management & Hold Policy)
            </h2>
          </div>

          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>
                <strong className="text-[var(--text-primary)]">تذكرة واحدة نشطة لكل رقم:</strong> تمنح المنصة تذكرة نشطة واحدة فقط لكل رقم هاتف في المؤسسة الواحدة، وذلك منعاً للحجوزات الوهمية أو حجز أماكن متعددة بدون داعٍ.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>
                <strong className="text-[var(--text-primary)]">حق المؤسسة في التأجيل أو التمرير (Hold):</strong> تحتفظ المؤسسة بحق تأجيل تذكرة المراجع (Hold)، أو استدعاء الرقم التالي، أو إلغاء التذكرة إذا تعذر حضور المراجع عند مناداة دوره أو في حال تأخره عن وقت الحضور المطلوب.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" />
              <span>
                <strong className="text-[var(--text-primary)]">استرجاع الدور المؤجل:</strong> عند قيام المؤسسة بوضع التذكرة في حالة الانتظار المؤقت (Hold)، يمكن تفعيلها مجدداً عند وصول المراجع وفقاً للترتيب الميداني الذي تحدده السكرتارية.
              </span>
            </li>
          </ul>
        </section>

        {/* Section 3: حدود المسؤولية */}
        <section className="bg-[var(--surface-bg)] rounded-2xl p-6 sm:p-8 border border-[var(--border-color)] shadow-[0_2px_10px_rgba(49,60,69,0.04)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
              <ShieldAlert className="w-4 h-4 text-[#778ca4]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              3. حدود المسؤولية وإخلاء الطرف (Limitation of Liability)
            </h2>
          </div>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            NextDZ تسعى لتوفير أقصى درجات الدقة والاستقرار، ولكن لا تتحمل المنصة وإدارتها أي مسؤولية قانونية أو مادية عن:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)]/50 border border-[var(--border-color)] text-xs text-[var(--text-secondary)] space-y-1">
              <div className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>ظروف العمل الطارئة</span>
              </div>
              <p>تأخر المواعيد الناتج عن كشوفات مستعجلة، حالات حرجة، أو قرارات إدارية داخل المؤسسة.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)]/50 border border-[var(--border-color)] text-xs text-[var(--text-secondary)] space-y-1">
              <div className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>انقطاع شبكة الهاتف أو الإنترنت</span>
              </div>
              <p>ضعف أو انقطاع تغطية شبكة الاتصال أو بيانات الإنترنت لدى هاتف الزائر خارج نطاق سيطرتنا.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)]/50 border border-[var(--border-color)] text-xs text-[var(--text-secondary)] space-y-1">
              <div className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>إعدادات الهاتف والصامت</span>
              </div>
              <p>كتم الزائر لصوت هاتفه، أو تفعيل وضع عدم الإزعاج، مما يحول دون سماع رنة المناداة والتنبيه.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)]/50 border border-[var(--border-color)] text-xs text-[var(--text-secondary)] space-y-1">
              <div className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>نفاد بطارية الهاتف</span>
              </div>
              <p>انطفاء جهاز المستخدم بسبب نفاد الشحن أثناء فترة الانتظار مما يؤدي لفوات الدور.</p>
            </div>
          </div>
        </section>

        {/* Section 4: التزامات المؤسسات وأصحاب المشاريع */}
        <section className="bg-[var(--surface-bg)] rounded-2xl p-6 sm:p-8 border border-[var(--border-color)] shadow-[0_2px_10px_rgba(49,60,69,0.04)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
              <KeyRound className="w-4 h-4 text-[#778ca4]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              4. التزامات المؤسسات وأصحاب المشاريع (Merchant Obligations)
            </h2>
          </div>

          <div className="space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              يقع على عاتق المؤسسة المستفيدة (العيادة، الصالون، المكتب، أو المركز) الالتزام بما يلي:
            </p>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#778ca4] mt-2 shrink-0" />
                <span>
                  <strong className="text-[var(--text-primary)]">سرية رمز الدخول (PIN):</strong> الحفاظ التام على سرية رمز الدخول PIN الخاص بلوحة التحكم (<code className="text-xs bg-[var(--surface-elevated)] px-1.5 py-0.5 rounded border border-[var(--border-color)] font-mono">/admin</code>) وعدم إفشائه لغير المخولين بإدارة الطابور.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#778ca4] mt-2 shrink-0" />
                <span>
                  <strong className="text-[var(--text-primary)]">الاستخدام الحصري لأرقام الزوار:</strong> يُحظر تماماً استخدام أرقام هواتف المراجعين المسجلة في الطابور لأي أغراض دعائية، إعلانات تسويقية، أو إرسالها لأي طرف ثالث دون موافقة صريحة ومسبقة من المراجع.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#778ca4] mt-2 shrink-0" />
                <span>
                  <strong className="text-[var(--text-primary)]">النزاهة في إدارة الطابور:</strong> الالتزام بالترتيب العادل ومناداة الأدوار بحيادية لضمان رضا وثقة الزوار في المنظومة.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 5: التواصل والدعم الفني */}
        <section className="bg-[var(--surface-elevated)] rounded-2xl p-6 sm:p-8 border border-[var(--border-color)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
              <PhoneCall className="w-4 h-4 text-[#778ca4]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              5. التواصل والدعم الفني (Support & Inquiries)
            </h2>
          </div>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            لأي استفسارات قانونية، طلبات دعم فني، أو استفسارات تتعلق بالشروط والأحكام، فريق NextDZ متاح لمساعدتكم:
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--surface-bg)] hover:opacity-90 font-bold text-xs transition shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب الدعم: {PHONE_NUMBER}</span>
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
            <span className="text-[var(--text-primary)] font-bold">
              شروط الاستخدام
            </span>
            <span className="text-[var(--border-color)]">|</span>
            <Link href="/privacy" className="hover:text-[var(--text-primary)] transition">
              سياسة الخصوصية
            </Link>
          </div>

          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} NextDZ.
          </div>
        </div>
      </footer>

    </div>
  );
}
