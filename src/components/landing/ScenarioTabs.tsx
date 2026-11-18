'use client';

import React, { useState } from 'react';
import { PauseCircle, PhoneCall, Tv, ArrowRight, ShieldCheck } from 'lucide-react';

interface Scenario {
  id: string;
  tabLabel: string;
  icon: React.ElementType;
  headline: string;
  problem: string;
  solution: string;
  liveEvidence: string;
  previewCard: {
    badge: string;
    actionText: string;
    details: string[];
  };
}

export default function ScenarioTabs() {
  const [activeTab, setActiveTab] = useState<string>('hold');

  const scenarios: Scenario[] = [
    {
      id: 'hold',
      tabLabel: 'تأجيل ذكي دون تعطيل الدور (Hold)',
      icon: PauseCircle,
      headline: 'الزبون تأخر لدقائق؟ لا تعطل الطابور ولا تظلمه.',
      problem: 'في الأنظمة التقليدية، إذا ناديت مراجعاً ولم يكن حاضراً، إما أن تضيّع وقتاً في انتظاره، أو تلغي تذكرته فيحدث خلاف عند عودته.',
      solution: 'في NextDZ، بلمسة واحدة على زر التأجيل المؤقت، يمر الطابور للزبون التالي فوراً، ويبقى دور الزبون المتأخر محفوظاً في القائمة ليدخل في أول فرصة مناسبة فور حضوره.',
      liveEvidence: 'ميزة ميدانية مدمجة مباشرة في لوحة تحكم الطبيب والمسير.',
      previewCard: {
        badge: 'حالة الطابور اللحظية',
        actionText: 'تم تأجيل التذكرة بنجاح ونقل الدور للمراجع التالي',
        details: [
          'استمرار العمل دون توقف ثانية واحدة',
          'حفظ حق الزبون الأدبي دون إحراج السكرتيرة',
          'تحديث فوري لكل الشاشات في لحظتها',
        ],
      },
    },
    {
      id: 'seniors',
      tabLabel: 'دعم كبار السن والهواتف العادية',
      icon: PhoneCall,
      headline: 'لا يملك هاتفاً ذكياً؟ السكرتيرة تسجله في ثوانٍ.',
      problem: 'بعض الزوار كبار سن، أو لا يحملون هواتف ذكية لمسح كود الاستقبال.',
      solution: 'يمكن للسكرتيرة إدخال اسمه أو رقم هاتفه العادي في ثانية واحدة من لوحة التحكم، وإعطاؤه رقمه شفهياً مع وقت العودة بالدقيقة، أو إرسال رنة هاتفية سريعة لتنبيهه بالحضور دون أي تكلفة إضافية.',
      liveEvidence: 'شمولية كاملة لجميع فئات الزوار دون استثناء أحد.',
      previewCard: {
        badge: 'تسجيل يدوي سريع',
        actionText: 'إصدار تذكرة فورية حضورية بالاسم أو الهاتف',
        details: [
          'تسجيل سريع برقم الهاتف أو الاسم فقط',
          'حساب موعد الحضور الدقيق بناءً على سرعة العمل',
          'إمكانية الرنة الهاتفية أو النداء الشفهي',
        ],
      },
    },
    {
      id: 'tv-reports',
      tabLabel: 'شاشة التلفاز + تقارير السجلات',
      icon: Tv,
      headline: 'قاعة انتظار هادئة وسجل يومي للمحاسبة بلمسة زر.',
      problem: 'الحاجة لشاشة عرض واضحة في الصالة دون أسلاك أو وصلات معقدة، والحاجة لمعرفة عدد من تم استقبالهم اليوم.',
      solution: 'افتح رابط شاشة العرض على أي تلفاز متصل بالإنترنت لتعرض التذاكر والنداء الصوتي تلقائياً بدون كابلات. وفي نهاية اليوم، صدّر تقرير الدخول إلى جدول إكسل بضغطة زر واحدة لتدقيق السجلات وحسابات العمل.',
      liveEvidence: 'تعمل على كل الشاشات الحديثة عبر المتصفح مباشرة.',
      previewCard: {
        badge: 'ميزات إدارية مدمجة',
        actionText: 'تصدير سجلات اليوم كاملاً بصيغة جدول منظم',
        details: [
          'رابط شاشة التلفاز يعمل بدون حواسيب أو أسلاك',
          'نداء صوتي تلقائي لطيف عند استدعاء كل مراجع',
          'تقارير أوقات الانتظار ومعدل خدمة كل مراجع',
        ],
      },
    },
  ];

  const current = scenarios.find((s) => s.id === activeTab) || scenarios[0];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Editorial Scenario Navigation Tabs - Responsive Wrapping on 390px */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#b3bfcb]/40 pb-4">
        {scenarios.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-[#313c45] text-[#f7f9fb] shadow-[0_4px_16px_rgba(49,60,69,0.18)]'
                  : 'bg-[#ffffff] text-[#313c45] hover:bg-[#eef1f4] border border-[#b3bfcb]/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#b3bfcb]' : 'text-[#4f6271]'}`} />
              <span>{item.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Editorial Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#ffffff] rounded-3xl p-6 sm:p-10 border border-[#b3bfcb]/70 shadow-[0_4px_30px_rgba(119,140,164,0.06)]">
        {/* Text Description Column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef1f4] border border-[#b3bfcb]/50 text-[#313c45] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#313c45]" />
            <span>{current.liveEvidence}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#313c45] tracking-tight heading-balance leading-snug">
            {current.headline}
          </h3>

          <div className="space-y-3 text-sm text-[#4f6271] leading-relaxed">
            <p className="bg-[#eef1f4] p-3.5 rounded-xl border border-[#b3bfcb]/40 text-[#313c45]">
              <strong className="text-[#313c45] font-bold block mb-1">المشكلة الواقعية:</strong>
              {current.problem}
            </p>
            <p className="text-[#313c45]">
              <strong className="text-[#313c45] font-bold block mb-1">الحل مع NextDZ:</strong>
              {current.solution}
            </p>
          </div>
        </div>

        {/* Visual Scenario Card (Flat Luxury Container) */}
        <div className="lg:col-span-5 bg-[#eef1f4] rounded-2xl p-6 border border-[#b3bfcb]/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#b3bfcb]/50 pb-3">
            <span className="text-xs font-bold text-[#313c45] uppercase tracking-wider">
              {current.previewCard.badge}
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#4f6271]" />
          </div>

          <div className="p-3.5 rounded-xl bg-[#ffffff] border border-[#b3bfcb]/60 text-xs font-bold text-[#313c45]">
            {current.previewCard.actionText}
          </div>

          <ul className="space-y-2.5 text-xs text-[#313c45] font-medium">
            {current.previewCard.details.map((detail, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#313c45] text-[#f7f9fb] flex items-center justify-center flex-shrink-0 text-[10px]">
                  ✓
                </span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-[#b3bfcb]/40">
            <a
              href="/admin/clinic-amal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#313c45] hover:text-[#4f6271] transition"
            >
              <span>معاينة لوحة التحكم الحقيقية مباشرة</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
