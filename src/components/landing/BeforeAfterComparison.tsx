'use client';

import React, { useState } from 'react';
import { XCircle, CheckCircle2, SlidersHorizontal, ArrowLeftRight } from 'lucide-react';

export default function BeforeAfterComparison() {
  const [activeMode, setActiveMode] = useState<'after' | 'before'>('after');
  const [sliderPos, setSliderPos] = useState<number>(50); // for visual split

  const painPoints = [
    {
      title: 'اكتظاظ وتوتر دائم في القاعة',
      traditional: 'عشرات الأشخاص محشورون في غرفة ضيقة، توتر واحتكاك مستمر بين المراجعين على الأولوية.',
      nextdz: 'قاعة واسعة وهادئة تماماً، الزائر ينتظر في سيارته أو في مقهى قريب ويعود بكرامته في موعده.',
    },
    {
      title: 'مقاطعة السكرتيرة كل دقيقة',
      traditional: 'سؤال متكرر يدمّر تركيز الموظف: "شحال باقيلي؟"، "وقتاش ندخل؟"، "ياك أنا قبل هذا؟".',
      nextdz: 'شاشة الهاتف تُظهر للمراجع عدّاً تنازلياً بالدقيقة لعدد المتبقين قبله ووقت الدخول المقدر.',
    },
    {
      title: 'أجهزة تذاكر باهظة وأعطال مستمرة',
      traditional: 'شراء كشك تذاكر وشاشات بآلاف الدنانير، انحشار رول الورق، وحاجة مستمرة للصيانة وقطع الغيار.',
      nextdz: 'صفر أجهزة! ملصق كود QR واحد أنيق يُطبع على ورقة عادية ويوضع على طاولة الاستقبال.',
    },
    {
      title: 'زبائن يملّون ويغادرون دون رجعة',
      traditional: 'الانتظار الأعمى غير المحسوب يجعل الزبون ييأس بعد نصف ساعة ويغادر غاضباً لطبيب أو صالون آخر.',
      nextdz: 'حرية كاملة؛ يتحرك الزبون بارتياح ويصله تنبيه صوتي واهتزاز على هاتفه قبل دوره بمراجعين اثنين.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Editorial Toggle Selector */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center p-1.5 rounded-full bg-[#d5dbe2]/70 border border-[#b3bfcb]/60 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveMode('after')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeMode === 'after'
                ? 'bg-[#313c45] text-[#f7f9fb] shadow-[0_4px_16px_rgba(49,60,69,0.18)]'
                : 'text-[#4f6271] hover:text-[#313c45]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[#b3bfcb]" />
            <span>مع NextDZ (قاعة هادئة وراقية)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('before')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeMode === 'before'
                ? 'bg-[#b3bfcb] text-[#313c45] shadow-sm font-bold'
                : 'text-[#4f6271] hover:text-[#313c45]'
            }`}
          >
            <XCircle className="w-4 h-4 text-[#4f6271]" />
            <span>الطريقة التقليدية (فوضى وتوتر)</span>
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {painPoints.map((item, idx) => {
          const isNextdz = activeMode === 'after';
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl p-7 transition-all duration-500 border ${
                isNextdz
                  ? 'bg-[#ffffff]/85 border-[#b3bfcb]/80 shadow-[0_4px_24px_rgba(119,140,164,0.08)]'
                  : 'bg-[#eef1f4]/90 border-[#b3bfcb]/40 opacity-90'
              }`}
            >
              <div className="flex items-start gap-3.5 mb-3">
                <span
                  className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    isNextdz
                      ? 'bg-[#313c45] text-[#f7f9fb]'
                      : 'bg-[#b3bfcb] text-[#4f6271]'
                  }`}
                >
                  {isNextdz ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                </span>
                <h4 className="text-base font-bold text-[#313c45] tracking-tight">
                  {item.title}
                </h4>
              </div>

              <p className="text-sm text-[#4f6271] leading-relaxed pr-9">
                {isNextdz ? item.nextdz : item.traditional}
              </p>

              {/* Status pill indicator */}
              <div className="mt-5 pr-9">
                <span
                  className={`inline-flex items-center text-xs font-medium px-3 py-1 rounded-full ${
                    isNextdz
                      ? 'bg-[#778ca4]/15 text-[#313c45]'
                      : 'bg-[#4f6271]/10 text-[#4f6271]'
                  }`}
                >
                  {isNextdz ? '✓ تجربة مريحة ومحسوبة' : '✕ استنزاف للمال والأعصاب'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Value Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-[#d5dbe2]/60 via-[#eef1f4] to-[#d5dbe2]/60 border border-[#b3bfcb]/70 text-center space-y-2">
        <p className="text-sm font-semibold text-[#313c45]">
          الفرق بين العيادة التي تفقد مرضاها والعيادة التي يُثني عليها الجميع هو <span className="underline decoration-[#778ca4] decoration-2">احترام وقت المراجع</span>.
        </p>
        <p className="text-xs text-[#4f6271]">
          لا يتطلب منك الأمر سوى وضع ملصق QR على طاولتك اليوم لتبدأ عيادتك عهداً جديداً من الهدوء.
        </p>
      </div>
    </div>
  );
}
