'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  Users, 
  Clock, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  DoorOpen, 
  UserCheck, 
  PauseCircle,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { QueueState } from '@/lib/types';
import { playQueueChime } from '@/lib/audio';
import { speakArabicAnnouncement } from '@/lib/speech';

export default function TvDisplayPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [queueState, setQueueState] = useState<QueueState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sound & Fullscreen controls
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastAnnouncedNumber, setLastAnnouncedNumber] = useState<number | null>(null);

  // Digital clock
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  // QR Code
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Clock tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ar-DZ', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('ar-DZ', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate QR Code for TV screen
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}/q/${slug}`;
      QRCode.toDataURL(fullUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#06141B',
          light: '#CCD0CF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate TV QR', err));
    }
  }, [slug]);

  // Fetch queue state
  const fetchState = async () => {
    try {
      const res = await fetch(`/api/organizations/${slug}`);
      if (!res.ok) {
        if (res.status === 404) setError('المؤسسة غير موجودة');
        else setError('تعذر تحميل بيانات الطابور');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setQueueState(data.data);
        setError(null);
      }
    } catch {
      // Keep running
    } finally {
      setLoading(false);
    }
  };

  // Poll state every 3s
  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, [slug]);

  // Handle Audio announcement when called ticket changes
  useEffect(() => {
    const current = queueState?.currentTicket;
    if (current && current.status === 'called' && current.ticket_number !== lastAnnouncedNumber) {
      setLastAnnouncedNumber(current.ticket_number);

      if (soundEnabled) {
        playQueueChime();
        const staffTitle = queueState?.organization?.staff_title || 'المسير';
        speakArabicAnnouncement(`الرقم ${current.ticket_number}، تفضل بالدخول عند ${staffTitle} الآن`);
      }
    }
  }, [queueState?.currentTicket, lastAnnouncedNumber, soundEnabled, queueState?.organization?.staff_title]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const org = queueState?.organization;
  const currentTicket = queueState?.currentTicket;
  const waitingTickets = queueState?.waitingTickets || [];
  const heldTickets = queueState?.heldTickets || [];
  const staffTitle = org?.staff_title || 'المسير';
  const sectorLabel = org?.sector_label || 'زبون';

  if (loading && !queueState) {
    return (
      <div className="min-h-screen bg-slateNavy-950 flex flex-col items-center justify-center text-slateNavy-100" dir="rtl">
        <div className="w-16 h-16 border-4 border-slateNavy-400 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slateNavy-100">جاري تشغيل شاشة الصالة...</h2>
      </div>
    );
  }

  if (error && !queueState) {
    return (
      <div className="min-h-screen bg-slateNavy-950 flex flex-col items-center justify-center p-6 text-center text-slateNavy-100" dir="rtl">
        <h2 className="text-2xl font-bold text-rose-400 mb-2">{error}</h2>
        <p className="text-slateNavy-400 text-sm mb-6">يرجى التحقق من الرابط الصحيح للمؤسسة</p>
        <Link href="/" className="px-6 py-3 bg-slateNavy-900 border border-slateNavy-800 rounded-2xl text-slateNavy-100 font-bold">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  // Feature gate: TV Display requires 'pro' or 'elite' package
  if (org?.plan === 'starter') {
    return (
      <div className="min-h-screen bg-slateNavy-950 flex flex-col items-center justify-center p-6 text-center text-slateNavy-100" dir="rtl">
        <div className="max-w-md bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-8 space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-slateNavy-800 text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-slateNavy-700">
            <Tv className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white">{org?.name}</h2>
          <div className="bg-slateNavy-950 p-3 rounded-2xl border border-slateNavy-800">
            <span className="text-xs text-slateNavy-400">باقة اشتراك هذه العيادة:</span>
            <p className="text-sm font-bold text-slateNavy-200 mt-0.5">الباقة الأساسية (Starter - 1,500 دج/شهر)</p>
          </div>
          <p className="text-xs text-slateNavy-300 leading-relaxed">
            شاشة صالة الانتظار التلفزيونية والنداء الصوتي ميزة مخصصة لمشتركي <strong>باقة المحترفين (Pro)</strong> و <strong>باقة النخبة (Elite)</strong>.
          </p>
          <a
            href="https://wa.me/213666568039?text=مرحباً،%20أريد%20ترقية%20باقتي%20إلى%20باقة%20المحترفين%20(Pro)%20لتشغيل%20شاشة%20التلفاز"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slateNavy-950 font-black text-xs rounded-xl shadow transition inline-block text-center"
          >
            ترقية الباقة عبر واتساب (0666 56 80 39)
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slateNavy-950 text-slateNavy-100 flex flex-col select-none overflow-hidden font-sans" dir="rtl">
      {/* Top Header Bar */}
      <header className="bg-slateNavy-900 border-b border-slateNavy-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slateNavy-800 border border-slateNavy-700 rounded-2xl flex items-center justify-center text-slateNavy-100 font-black text-xl shadow-inner">
            {org?.name.charAt(0) || 'ط'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slateNavy-100 tracking-tight">
              {org?.name || 'نظام الطابور الذكي'}
            </h1>
            <p className="text-xs font-semibold text-slateNavy-400">
              خدمة {sectorLabel} • {staffTitle}
            </p>
          </div>
        </div>

        {/* Digital Clock & Date */}
        <div className="flex items-center gap-8">
          <div className="text-left hidden md:block">
            <p className="text-xs text-slateNavy-400 font-medium">{currentDate}</p>
            <p className="text-2xl font-black text-slateNavy-100 font-mono tracking-wider">{currentTime}</p>
          </div>

          {/* Quick TV Control Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!soundEnabled) {
                  playQueueChime();
                }
                setSoundEnabled(!soundEnabled);
              }}
              title={soundEnabled ? 'كتم الصوت' : 'تفعيل نداء الصوت التلقائي'}
              className={`p-3 rounded-2xl border transition flex items-center gap-2 text-xs font-bold ${
                soundEnabled
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                  : 'bg-slateNavy-800 border-slateNavy-700 text-slateNavy-400 hover:text-slateNavy-100'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5" />}
              <span className="hidden sm:inline">{soundEnabled ? 'الصوت مفعل' : 'انقر لتفعيل الصوت'}</span>
            </button>

            <button
              onClick={toggleFullscreen}
              title="ملء الشاشة"
              className="p-3 bg-slateNavy-800 hover:bg-slateNavy-700 border border-slateNavy-700 text-slateNavy-100 rounded-2xl transition"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 lg:p-8">
        {/* Left Column: Currently Called Ticket (Giant) */}
        <section className="lg:col-span-8 flex flex-col justify-between">
          <div className="flex-1 flex flex-col justify-center">
            {currentTicket ? (
              <div className={`relative bg-slateNavy-900 border-2 rounded-3xl p-8 lg:p-12 shadow-2xl transition-all text-center ${
                currentTicket.status === 'called' 
                  ? 'border-emerald-400/90 ring-8 ring-emerald-500/20 bg-gradient-to-b from-slateNavy-900 to-slateNavy-900/90' 
                  : 'border-slateNavy-700 ring-4 ring-slateNavy-800'
              }`}>
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-black mb-6 uppercase tracking-wider bg-slateNavy-800 border border-slateNavy-700 text-slateNavy-100">
                  {currentTicket.status === 'called' ? (
                    <>
                      <DoorOpen className="w-5 h-5 text-emerald-400 animate-bounce" />
                      <span className="text-emerald-300">تفضل بالدخول الآن</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-5 h-5 text-slateNavy-400" />
                      <span>بالداخل حالياً</span>
                    </>
                  )}
                </div>

                <p className="text-sm lg:text-base font-bold text-slateNavy-400 mb-2">رقم التذكرة الحالي</p>
                
                {/* Massive Number */}
                <div className="text-8xl sm:text-9xl lg:text-[140px] font-black tracking-tight text-white leading-none my-4">
                  #{currentTicket.ticket_number}
                </div>

                {currentTicket.customer_name ? (
                  <p className="text-2xl font-bold text-slateNavy-300 mt-2">
                    {currentTicket.customer_name}
                  </p>
                ) : (
                  <p className="text-lg font-medium text-slateNavy-400 mt-2">
                    {sectorLabel} محترم
                  </p>
                )}

                <div className="mt-8 pt-6 border-t border-slateNavy-800/80 flex items-center justify-center gap-4 text-slateNavy-400 text-sm">
                  <span>الموقع: مكتب {staffTitle}</span>
                  <span>•</span>
                  <span>الوتيرة التقريبية: {org?.avg_service_mins} دقيقة</span>
                </div>
              </div>
            ) : (
              /* Idle State */
              <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-12 text-center shadow-xl">
                <Clock className="w-20 h-20 text-slateNavy-700 mx-auto mb-4" />
                <h2 className="text-3xl font-black text-slateNavy-100 mb-2">
                  قاعة الاستقبال والانتظار
                </h2>
                <p className="text-base text-slateNavy-400 max-w-md mx-auto">
                  في انتظار بدء استدعاء الأدوار. يرجى مسح رمز QR بهاتفك لمتابعة دورك من أي مكان بحرية.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Reassurance Banner */}
          <div className="mt-6 bg-slateNavy-900/60 border border-slateNavy-800 rounded-2xl p-4 flex items-center justify-between text-slateNavy-400 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>الشاشة متصلة ومحدثة لحظياً</span>
            </div>
            <span>لا حاجة للبقاء في القاعة • يمكنك متابعة دورك عبر هاتفك الذكي</span>
          </div>
        </section>

        {/* Right Column: Upcoming Queue + QR Code */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* QR Code Card */}
          <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-6 text-center shadow-xl">
            <h3 className="text-base font-black text-slateNavy-100 mb-1">
              امسح بهاتفك وغادر القاعة
            </h3>
            <p className="text-xs text-slateNavy-400 mb-4">
              احجز دورك أو تابعه من المقهى أو السيارة وسننبهك صوتياً قبل وصولك
            </p>

            {qrDataUrl ? (
              <div className="bg-slateNavy-100 p-3 rounded-2xl inline-block shadow-inner mx-auto">
                <img 
                  src={qrDataUrl} 
                  alt="QR Code" 
                  className="w-48 h-48 rounded-xl object-contain"
                />
              </div>
            ) : (
              <div className="w-48 h-48 bg-slateNavy-800 rounded-2xl flex items-center justify-center mx-auto">
                <QrCode className="w-12 h-12 text-slateNavy-400" />
              </div>
            )}

            <p className="text-[11px] font-mono text-slateNavy-400 mt-3 dir-ltr">
              /q/{slug}
            </p>
          </div>

          {/* Next in Queue List */}
          <div className="flex-1 bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slateNavy-800 mb-4">
                <h3 className="text-sm font-bold text-slateNavy-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slateNavy-400" />
                  الأدوار القادمة بالترتيب
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-slateNavy-800 border border-slateNavy-700 text-slateNavy-100">
                  {waitingTickets.length} في الانتظار
                </span>
              </div>

              {waitingTickets.length === 0 ? (
                <div className="text-center py-8 text-slateNavy-700 text-xs font-medium">
                  لا توجد تذاكر انتظار حالياً
                </div>
              ) : (
                <div className="space-y-2.5">
                  {waitingTickets.slice(0, 5).map((t, idx) => (
                    <div 
                      key={t.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slateNavy-950 border border-slateNavy-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-slateNavy-800 text-slateNavy-100 text-xs font-black flex items-center justify-center border border-slateNavy-700">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-base font-black text-slateNavy-100">#{t.ticket_number}</p>
                          <p className="text-[11px] text-slateNavy-400">
                            {t.customer_name || `${sectorLabel} #${t.ticket_number}`}
                          </p>
                        </div>
                      </div>

                      <div className="text-left">
                        <p className="text-xs font-bold text-slateNavy-100 font-mono">
                          {t.estimated_clock_time}
                        </p>
                        <p className="text-[10px] text-slateNavy-400">
                          ~{t.estimated_wait_mins} د
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Held Tickets Notice if any */}
            {heldTickets.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slateNavy-800">
                <p className="text-[11px] font-semibold text-slateNavy-400 flex items-center gap-1.5 mb-2">
                  <PauseCircle className="w-3.5 h-3.5 text-amber-400" />
                  أدوار مجمدة ومحفوظة (Smart Hold):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {heldTickets.map((ht) => (
                    <span 
                      key={ht.id}
                      className="px-2.5 py-1 rounded-xl bg-slateNavy-950 border border-amber-500/30 text-amber-300 font-mono text-xs font-black"
                    >
                      #{ht.ticket_number}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
