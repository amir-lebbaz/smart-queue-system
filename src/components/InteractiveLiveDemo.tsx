'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  Volume2, 
  UserPlus, 
  CheckCircle, 
  RotateCcw, 
  Sparkles,
  Smartphone,
  Laptop,
  Check,
  ChevronRight,
  Wifi
} from 'lucide-react';

export default function InteractiveLiveDemo() {
  const [currentCalled, setCurrentCalled] = useState<number>(4);
  const [waitingCount, setWaitingCount] = useState<number>(2);
  const [completedCount, setCompletedCount] = useState<number>(14);
  const [userTicket] = useState<number>(5);
  const [isServing, setIsServing] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<string>('انقر على الأزرار في لوحة الموظف لتجربة النظام مباشرة');
  const [isChiming, setIsChiming] = useState<boolean>(false);

  // Play subtle web audio chime on call
  const triggerAudioChime = () => {
    try {
      if (typeof window === 'undefined') return;
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // AudioContext policy fallback
    }
  };

  const handleNext = () => {
    if (waitingCount <= 0) {
      setLastAction('الطابور فارغ حالياً! اضغط "+ تذكرة حضورية" لإضافة مراجعين.');
      return;
    }
    const nextNum = currentCalled + 1;
    setCurrentCalled(nextNum);
    setWaitingCount((prev) => Math.max(0, prev - 1));
    setIsServing(false);
    setIsChiming(true);
    triggerAudioChime();
    setTimeout(() => setIsChiming(false), 1200);

    if (nextNum === userTicket) {
      setLastAction(`🔔 تم نداء الرقم (${nextNum})! انظر شاشة العميل على اليسار — تحولت للأخضر ونبّهت الزبون!`);
    } else {
      setLastAction(`تم استدعاء الرقم (${nextNum}) بنجاح.`);
    }
  };

  const handleWalkin = () => {
    setWaitingCount((prev) => prev + 1);
    const issuedNumber = currentCalled + waitingCount + 1;
    setLastAction(`✓ تم إصدار تذكرة حضورية سريعة #${issuedNumber} وإضافتها للطابور.`);
  };

  const handleEnter = () => {
    setIsServing(true);
    setLastAction(`✓ تم تأكيد دخول المراجع (${currentCalled}) لغرفة الفحص.`);
  };

  const handleComplete = () => {
    setCompletedCount((prev) => prev + 1);
    setIsServing(false);
    setLastAction(`✓ تم إنهاء خدمة المراجع (${currentCalled}). جاهز للنداء التالي.`);
  };

  const handleReset = () => {
    setCurrentCalled(4);
    setWaitingCount(2);
    setCompletedCount(14);
    setIsServing(false);
    setLastAction('تمت إعادة ضبط المعاينة التفاعلية.');
  };

  const isUserTurn = currentCalled === userTicket;
  const isUserPast = currentCalled > userTicket;
  const peopleAhead = Math.max(0, userTicket - currentCalled);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Outer Border Beam Frame */}
      <div className="border-beam-card p-[1px] shadow-2xl shadow-emerald-950/20">
        <div className="border-beam-card-inner p-4 sm:p-7 space-y-6">
          
          {/* Top Live Demo Badge & Controller Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                معاينة تفاعلية حية (Live Interactive Simulator)
              </span>
              <span className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-gray-400 hidden sm:inline">
                جرب الضغط بنفسك
              </span>
            </div>

            <button
              onClick={handleReset}
              className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1.5 transition px-2.5 py-1 rounded-lg hover:bg-white/5"
              title="إعادة ضبط المعاينة"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة التجربة</span>
            </button>
          </div>

          {/* Interactive Split View: Staff Remote vs Customer Phone */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* 1. DOCTOR / RECEPTIONIST CONSOLE (RIGHT 7 COLS) */}
            <div className="lg:col-span-7 bg-[#0E1017] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-5 relative">
              <div className="space-y-4">
                {/* Device Title */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">لوحة تحكم الطبيب / السكرتيرة</h4>
                      <p className="text-[10px] text-gray-400">تعمل على الهاتف، التابلت أو حاسوب المكتب</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                    جاهز للنداء
                  </span>
                </div>

                {/* Main Called Ticket Box */}
                <div className={`p-5 rounded-2xl border text-center transition-all duration-300 ${
                  isChiming 
                    ? 'bg-emerald-500/20 border-emerald-400 scale-[1.02] shadow-lg shadow-emerald-500/20' 
                    : 'bg-[#141722] border-white/10'
                }`}>
                  <span className="text-[11px] font-semibold text-gray-400 block mb-1">
                    {isServing ? 'المراجع الحالي في الفحص' : 'الرقم المستدعى الآن'}
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                      رقم {currentCalled}
                    </span>
                    {isChiming && (
                      <Volume2 className="w-6 h-6 text-emerald-400 animate-bounce" />
                    )}
                  </div>
                  <span className={`inline-block mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isServing ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  }`}>
                    {isServing ? '✓ في غرفة الطبيب' : '🔔 تم النداء (جاري الحضور)'}
                  </span>
                </div>

                {/* Queue Stats Mini Row */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-[#141722] border border-white/5 rounded-xl">
                    <span className="text-gray-400 text-[10px] block">في الانتظار</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">{waitingCount}</span>
                  </div>
                  <div className="p-2.5 bg-[#141722] border border-white/5 rounded-xl">
                    <span className="text-gray-400 text-[10px] block">المكتملون</span>
                    <span className="text-base font-bold text-white font-mono">{completedCount}</span>
                  </div>
                  <div className="p-2.5 bg-[#141722] border border-white/5 rounded-xl">
                    <span className="text-gray-400 text-[10px] block">متوسط الفحص</span>
                    <span className="text-base font-bold text-gray-300 font-mono">6 د</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Visitor to click */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleNext}
                    className="py-3 px-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl shadow-lg shadow-emerald-950/60 transition transform active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>استدعاء التالي 🔔</span>
                  </button>

                  <button
                    onClick={handleWalkin}
                    className="py-3 px-3 bg-[#1A1E2C] hover:bg-[#23283B] border border-white/10 hover:border-white/20 text-white font-bold text-xs rounded-xl transition transform active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <span>+ تذكرة حضورية</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleEnter}
                    disabled={isServing}
                    className="py-2.5 px-3 bg-white/5 hover:bg-white/10 disabled:opacity-40 border border-white/5 text-gray-300 text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
                    <span>تأكيد الدخول</span>
                  </button>

                  <button
                    onClick={handleComplete}
                    className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>إنهاء الخدمة</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. CUSTOMER SMARTPHONE LIVE DISPLAY (LEFT 5 COLS) */}
            <div className="lg:col-span-5 bg-[#0A0B0F] border-2 border-white/15 rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              {/* Phone Notch/Island */}
              <div className="w-20 h-4 bg-white/10 rounded-full mx-auto mb-3" />

              <div className="space-y-4">
                {/* Phone Header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                  <span className="font-bold text-white flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تذكرة الزبون بالهاتف</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Wifi className="w-2.5 h-2.5" />
                    مباشر
                  </span>
                </div>

                {/* Customer Ticket Card */}
                <div className={`p-5 rounded-2xl border text-center transition-all duration-300 ${
                  isUserTurn
                    ? 'bg-gradient-to-b from-emerald-950/80 to-[#0A0B0F] border-emerald-400 shadow-xl shadow-emerald-500/20 scale-[1.02]'
                    : isUserPast
                    ? 'bg-white/5 border-white/10'
                    : 'bg-[#10121A] border-white/10'
                }`}>
                  <span className="text-[10px] text-gray-400 block mb-0.5">تذكرتك المحجوزة</span>
                  <span className="text-3xl font-black font-mono text-white tracking-tight">
                    تذكرة #{userTicket}
                  </span>

                  {/* Dynamic Status Message */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    {isUserTurn ? (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-black font-black text-xs animate-bounce shadow">
                          <Volume2 className="w-3.5 h-3.5" />
                          حان دورك الآن! ادخل للطبيب
                        </span>
                        <p className="text-[11px] text-emerald-300 font-medium pt-1">
                          رنت الشاشة وصدر التنبيه الصوتي بهاتفك.
                        </p>
                      </div>
                    ) : isUserPast ? (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-gray-400 block">
                          ✓ تمت خدمتك بنجاح
                        </span>
                        <div className="flex items-center justify-center gap-2 pt-1 text-sm">
                          <span>😍</span>
                          <span>😄</span>
                          <span>😐</span>
                          <span>😞</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-amber-300 block">
                          أمامك {peopleAhead} {peopleAhead === 1 ? 'مراجع' : 'مراجعين'} في الطابور
                        </span>
                        <p className="text-[10px] text-gray-400">
                          الدخول المتوقع: <span className="font-mono text-white font-bold">11:42 ص</span>
                        </p>
                        <p className="text-[10px] text-gray-500 pt-1">
                          يمكنك الانتظار في سيارتك أو المقهى؛ سننبهك قبل وصول دورك.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone Footer */}
              <div className="pt-3 text-center text-[10px] text-gray-500">
                <span>تحديث لحظي بدون إعادة تحميل الصفحة • NextDz</span>
              </div>
            </div>

          </div>

          {/* Interactive Guidance Bar */}
          <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-xs text-gray-300">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{lastAction}</span>
            </span>
            <span className="text-[10px] text-gray-500 hidden sm:inline">نظام سحابي حقيقي</span>
          </div>

        </div>
      </div>
    </div>
  );
}
