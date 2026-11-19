'use client';

import React, { useState } from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

export default function BeforeAfterComparison() {
  const [activeMode, setActiveMode] = useState<'after' | 'before'>('after');

  const painPoints = [
    {
      title: 'اكتظاظ وتوتر دائم في القاعة',
      traditional: 'عشرات الأشخاص في غرفة ضيقة، توتر واحتكاك مستمر بين المراجعين على الأولوية.',
      nextdz: 'قاعة واسعة وهادئة تماماً، الزائر ينتظر في سيارته أو في مكان مريح ويعود في موعده بدقة.',
    },
    {
      title: 'مقاطعة السكرتيرة كل دقيقة',
      traditional: 'سؤال متكرر يشتت تركيز الموظف: كم بقي من شخص؟ متى يحين دوري؟ هل دوري بعد هذا؟',
      nextdz: 'شاشة الهاتف تُظهر للمراجع عدّاً تنازلياً دقيقاً لعدد المتبقين قبله ووقت الدخول المقدر.',
    },
    {
      title: 'أجهزة تذاكر باهظة وأعطال مستمرة',
      traditional: 'شراء أجهزة كشك تذاكر مكلفة، انحشار رول الورق، وحاجة مستمرة للصيانة وتغيير القطع.',
      nextdz: 'صفر أجهزة! ملصق كود واحد أنيق يُطبع على ورقة عادية ويوضع على طاولة الاستقبال.',
    },
    {
      title: 'زبائن يملّون ويغادرون دون رجعة',
      traditional: 'الانتظار غير المحسوب يجعل الزبون يمل ويغادر لعيادة أو صالون آخر يبحث عن راحة أكبر.',
      nextdz: 'حرية كاملة؛ يتحرك الزبون بارتياح ويصله تنبيه صوتي واهتزاز على هاتفه قبل دوره بدقائق.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Editorial Toggle Selector - Smooth Stacking on 390px Mobile */}
      <div className="flex items-center justify-center px-2">
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center p-1.5 rounded-2xl sm:rounded-full bg-slateNavy-850 border border-slateNavy-800 shadow-sm gap-1.5">
          <button
            type="button"
            onClick={() => setActiveMode('after')}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
              activeMode === 'after'
                ? 'bg-slateNavy-900 text-slateNavy-100 shadow-md border border-slateNavy-700'
                : 'bg-slateNavy-950 text-slateNavy-400 border border-slateNavy-800 hover:text-slateNavy-200'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${activeMode === 'after' ? 'text-slateNavy-100' : 'text-slateNavy-400'}`} />
            <span>مع NextDZ (قاعة هادئة وراقية)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('before')}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
              activeMode === 'before'
                ? 'bg-slateNavy-900 text-slateNavy-100 shadow-md border border-slateNavy-700'
                : 'bg-slateNavy-950 text-slateNavy-400 border border-slateNavy-800 hover:text-slateNavy-200'
            }`}
          >
            <XCircle className={`w-4 h-4 ${activeMode === 'before' ? 'text-slateNavy-100' : 'text-slateNavy-400'}`} />
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
              className={`relative overflow-hidden rounded-2xl p-6 sm:p-7 transition-all duration-500 border ${
                isNextdz
                  ? 'bg-slateNavy-900 border-slateNavy-800 shadow-sm'
                  : 'bg-slateNavy-850 border-slateNavy-800'
              }`}
            >
              <div className="flex items-start gap-3.5 mb-3">
                <span
                  className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    isNextdz
                      ? 'bg-slateNavy-800 text-slateNavy-100 border border-slateNavy-700'
                      : 'bg-slateNavy-950 text-slateNavy-400 border border-slateNavy-800'
                  }`}
                >
                  {isNextdz ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                </span>
                <h4 className="text-base font-bold text-slateNavy-100 tracking-tight">
                  {item.title}
                </h4>
              </div>

              <p className="text-sm font-medium text-slateNavy-400 leading-relaxed pr-9">
                {isNextdz ? item.nextdz : item.traditional}
              </p>

              {/* Status pill indicator */}
              <div className="mt-5 pr-9">
                <span
                  className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full ${
                    isNextdz
                      ? 'bg-slateNavy-800 text-slateNavy-100 border border-slateNavy-700'
                      : 'bg-slateNavy-950 text-slateNavy-400 border border-slateNavy-800'
                  }`}
                >
                  {isNextdz ? '✓ تجربة مريحة ومحسوبة' : '✕ استنزاف للمال والراحة'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Value Banner */}
      <div className="rounded-2xl p-6 bg-slateNavy-850 border border-slateNavy-800 text-center space-y-2">
        <p className="text-sm font-bold text-slateNavy-100">
          الفرق بين المكان الذي يفقد زبائنه والمكان الذي يُثني عليه الجميع هو احترام وقت المراجع.
        </p>
        <p className="text-xs font-medium text-slateNavy-400">
          لا يتطلب منك الأمر سوى وضع ملصق كود على طاولتك لتبدأ قاعتك عهداً جديداً من الهدوء.
        </p>
      </div>
    </div>
  );
}
