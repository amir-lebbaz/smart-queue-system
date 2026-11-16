'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Users, 
  Wifi, 
  WifiOff, 
  Volume2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  User, 
  RefreshCw, 
  Share2, 
  Check,
  DoorOpen,
  UserCheck
} from 'lucide-react';
import { QueueState } from '@/lib/types';
import { playQueueChime } from '@/lib/audio';
import { speakArabicAnnouncement } from '@/lib/speech';

interface CachedTicket {
  ticketNumber: number;
  orgSlug: string;
  orgName: string;
  sectorLabel: string;
  estimatedTargetTimestamp: number;
  initialEstimatedClockTime: string;
  customerName?: string;
  createdAt: number;
}

export default function CustomerTicketPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [queueState, setQueueState] = useState<QueueState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for booking
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active ticket in localStorage
  const [myTicket, setMyTicket] = useState<CachedTicket | null>(null);

  // Offline status & timer
  const [isOnline, setIsOnline] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [calledSpoken, setCalledSpoken] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load cached ticket on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const stored = localStorage.getItem(`smart_queue_ticket_${slug}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as CachedTicket;
          setMyTicket(parsed);
        } catch (e) {
          console.error('Failed to parse cached ticket', e);
        }
      }

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [slug]);

  // Fetch queue state from server
  const fetchState = async () => {
    try {
      const res = await fetch(`/api/organizations/${slug}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError('المؤسسة غير موجودة');
        } else {
          setError('تعذر تحميل بيانات الطابور');
        }
        return;
      }
      const data = await res.json();
      if (data.success) {
        setQueueState(data.data);
        setError(null);
      }
    } catch {
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  };

  // Poll state every 3.5s when online
  useEffect(() => {
    fetchState();
    const interval = setInterval(() => {
      if (navigator.onLine) {
        fetchState();
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [slug]);

  // Autonomous Countdown Timer (works completely offline)
  useEffect(() => {
    if (!myTicket) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const diffMs = myTicket.estimatedTargetTimestamp - now;
      const secondsLeft = Math.max(0, Math.floor(diffMs / 1000));
      setRemainingSeconds(secondsLeft);

      if (secondsLeft > 0 && secondsLeft <= 600 && !alertTriggered) {
        playQueueChime();
        setAlertTriggered(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [myTicket, alertTriggered]);

  const org = queueState?.organization;
  const sectorLabel = org?.sector_label || 'زبون';
  const staffTitle = org?.staff_title || 'المسير';
  const activeCurrent = queueState?.currentTicket;

  // Determine ticket real presence status
  let isMyTurnCalled = false;
  let isMyTurnInside = false;
  let isCompletedForMe = false;
  let livePeopleAhead = 0;

  if (myTicket && activeCurrent) {
    if (activeCurrent.ticket_number === myTicket.ticketNumber) {
      if (activeCurrent.status === 'called') {
        isMyTurnCalled = true;
      } else if (activeCurrent.status === 'serving') {
        isMyTurnInside = true;
      }
    } else if (activeCurrent.ticket_number > myTicket.ticketNumber) {
      isCompletedForMe = true;
    } else {
      livePeopleAhead = myTicket.ticketNumber - activeCurrent.ticket_number;
    }
  } else if (myTicket && org) {
    if (org.current_ticket_number > myTicket.ticketNumber) {
      isCompletedForMe = true;
    } else if (org.current_ticket_number > 0) {
      livePeopleAhead = Math.max(0, myTicket.ticketNumber - org.current_ticket_number);
    }
  }

  // Voice announcement when customer is called
  useEffect(() => {
    if (isMyTurnCalled && !calledSpoken) {
      playQueueChime();
      speakArabicAnnouncement(`الرقم ${myTicket?.ticketNumber}، تفضل بالدخول عند ${staffTitle} الآن`);
      setCalledSpoken(true);
    }
  }, [isMyTurnCalled, calledSpoken, myTicket, staffTitle]);

  // Handle Book Ticket
  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgSlug: slug,
          customerName: name,
          customerPhone: phone,
          ticketType: 'qr',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const ticket = json.data;
        const targetTimestamp = Date.now() + ticket.estimated_wait_mins * 60 * 1000;
        const cached: CachedTicket = {
          ticketNumber: ticket.ticket_number,
          orgSlug: slug,
          orgName: queueState?.organization.name || 'المؤسسة',
          sectorLabel: queueState?.organization.sector_label || 'زبون',
          estimatedTargetTimestamp: targetTimestamp,
          initialEstimatedClockTime: ticket.estimated_clock_time,
          customerName: name || undefined,
          createdAt: Date.now(),
        };

        localStorage.setItem(`smart_queue_ticket_${slug}`, JSON.stringify(cached));
        setMyTicket(cached);
        setAlertTriggered(false);
        setCalledSpoken(false);
        playQueueChime();
        fetchState();
      } else {
        alert(json.error || 'حدث خطأ أثناء حجز التذكرة');
      }
    } catch {
      alert('تعذر الاتصال بالخادم لحجز التذكرة');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Share Ticket Link
  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `تذكرتي #${myTicket?.ticketNumber} لدى ${myTicket?.orgName}`,
        text: `تذكرتي رقم #${myTicket?.ticketNumber} لدى ${myTicket?.orgName}. يمكنك متابعة الدور مباشرة.`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Leave queue
  const handleLeaveQueue = () => {
    if (confirm('هل أنت متأكد من مغادرة الطابور وإلغاء متابعة التذكرة؟')) {
      localStorage.removeItem(`smart_queue_ticket_${slug}`);
      setMyTicket(null);
      setRemainingSeconds(null);
      setCalledSpoken(false);
    }
  };

  // Format countdown mm:ss
  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading && !myTicket) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slateNavy-950 text-slateNavy-100">
        <div className="w-10 h-10 border-2 border-slateNavy-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slateNavy-400 text-sm font-medium">جاري فحص حالة الطابور...</p>
      </div>
    );
  }

  if (error && !queueState && !myTicket) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slateNavy-950 text-slateNavy-100">
        <AlertCircle className="w-12 h-12 text-slateNavy-400 mb-3" />
        <h2 className="text-lg font-bold text-slateNavy-100 mb-2">{error}</h2>
        <p className="text-slateNavy-400 text-xs mb-6">يرجى التأكد من مسح رمز QR الصحيح للمؤسسة</p>
        <Link href="/" className="px-5 py-2.5 bg-slateNavy-900 border border-slateNavy-800 hover:bg-slateNavy-800 text-slateNavy-100 rounded-xl text-xs transition">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-md mx-auto w-full p-4 flex flex-col justify-between bg-slateNavy-950 text-slateNavy-100" dir="rtl">
      {/* Top Header & Offline Status */}
      <header className="mb-4">
        <div className="flex items-center justify-between pb-3 border-b border-slateNavy-800">
          <div>
            <h1 className="text-sm font-bold text-slateNavy-100">
              {org?.name || myTicket?.orgName}
            </h1>
            <p className="text-[11px] text-slateNavy-400">
              خدمة {sectorLabel} الذكية • {staffTitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isOnline ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slateNavy-100 bg-slateNavy-900 border border-slateNavy-800 px-2.5 py-0.5 rounded-full">
                <Wifi className="w-3 h-3 text-emerald-400" />
                مباشر
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-slateNavy-900 border border-slateNavy-800 px-2.5 py-0.5 rounded-full">
                <WifiOff className="w-3 h-3 text-amber-400" />
                أوفلاين
              </span>
            )}
          </div>
        </div>

        {!isOnline && (
          <div className="mt-3 p-2.5 bg-slateNavy-900 border border-slateNavy-800 rounded-xl flex items-center gap-2 text-slateNavy-400 text-xs">
            <WifiOff className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>أنت في وضع عدم الاتصال: عدادك يعمل محلياً ومكانك محفوظ.</span>
          </div>
        )}
      </header>

      {/* Screen 1: Active Ticket Card */}
      {myTicket ? (
        <div className="space-y-4 my-auto">
          {/* Main Card */}
          <div className={`relative bg-slateNavy-900 border rounded-3xl p-6 shadow-2xl transition-all ${
            isMyTurnCalled 
              ? 'border-slateNavy-100 ring-4 ring-slateNavy-700/50' 
              : isMyTurnInside 
              ? 'border-slateNavy-400 ring-2 ring-slateNavy-700/30'
              : 'border-slateNavy-800'
          }`}>
            {/* Top Bar of Card */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold px-2.5 py-1 bg-slateNavy-800 text-slateNavy-100 rounded-lg border border-slateNavy-700">
                تذكرتك الرقمية
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleShare}
                  title="مشاركة التذكرة"
                  className="text-slateNavy-400 hover:text-slateNavy-100 p-1.5 rounded-lg transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => playQueueChime()}
                  title="اختبار نغمة التنبيه"
                  className="text-slateNavy-400 hover:text-slateNavy-100 p-1.5 rounded-lg transition"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Giant Number */}
            <div className="text-center py-2">
              <p className="text-xs font-medium text-slateNavy-400 mb-1">رقم دورك في القائمة</p>
              <div className="text-6xl font-black text-slateNavy-100 tracking-tight">
                #{myTicket.ticketNumber}
              </div>
              {myTicket.customerName && (
                <p className="text-sm font-semibold text-slateNavy-400 mt-1">
                  مرحباً، {myTicket.customerName}
                </p>
              )}
            </div>

            {/* Perforated separator */}
            <div className="relative my-4">
              <div className="border-t border-dashed border-slateNavy-800" />
              <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-6 h-6 bg-slateNavy-950 rounded-full border-r border-slateNavy-800" />
              <div className="absolute -right-9 top-1/2 -translate-y-1/2 w-6 h-6 bg-slateNavy-950 rounded-full border-l border-slateNavy-800" />
            </div>

            {/* PRESENCE STATE 1: CALLED (استدعاء للدخول) */}
            {isMyTurnCalled ? (
              <div className="bg-slateNavy-800 border-2 border-slateNavy-100 rounded-2xl p-4 text-center animate-pulse space-y-1.5">
                <DoorOpen className="w-10 h-10 text-slateNavy-100 mx-auto" />
                <h3 className="text-lg font-black text-slateNavy-100">تم استدعاؤك الآن! تفضل بالدخول</h3>
                <p className="text-xs text-slateNavy-400">{staffTitle} بانتظار دخولك إلى القاعة</p>
              </div>
            ) : isMyTurnInside ? (
              /* PRESENCE STATE 2: INSIDE (بالداخل حالياً) */
              <div className="bg-slateNavy-800 border border-slateNavy-700 rounded-2xl p-4 text-center space-y-1">
                <UserCheck className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                <h3 className="text-base font-bold text-slateNavy-100">أنت في الداخل حالياً</h3>
                <p className="text-xs text-slateNavy-400">جاري تقديم الخدمة لك لدى {staffTitle}</p>
              </div>
            ) : isCompletedForMe ? (
              /* PRESENCE STATE 3: COMPLETED */
              <div className="bg-slateNavy-800/80 border border-slateNavy-800 rounded-2xl p-4 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-slateNavy-400 mx-auto mb-1" />
                <h3 className="text-base font-bold text-slateNavy-100">اكتملت هذه الخدمة</h3>
                <p className="text-xs text-slateNavy-400">شكراً لزيارتك وتعاملك معنا</p>
              </div>
            ) : (
              /* PRESENCE STATE 4: WAITING */
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slateNavy-950 border border-slateNavy-800 rounded-2xl p-3 text-center">
                  <p className="text-[10px] text-slateNavy-400 mb-0.5">الرقم المستدعى</p>
                  <p className="text-2xl font-black text-slateNavy-100">
                    {activeCurrent ? `#${activeCurrent.ticket_number}` : '—'}
                  </p>
                </div>

                <div className="bg-slateNavy-950 border border-slateNavy-800 rounded-2xl p-3 text-center">
                  <p className="text-[10px] text-slateNavy-400 mb-0.5">أشخاص قبلك</p>
                  <p className="text-2xl font-black text-slateNavy-100">
                    {livePeopleAhead}
                  </p>
                </div>
              </div>
            )}

            {/* Estimated Clock Time & Offline Timer */}
            {!isCompletedForMe && !isMyTurnInside && (
              <div className="mt-4 bg-slateNavy-950 border border-slateNavy-800 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slateNavy-800 text-slateNavy-100 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slateNavy-400">ساعة الدخول التقريبية</p>
                    <p className="text-base font-black text-slateNavy-100">
                      {myTicket.initialEstimatedClockTime}
                    </p>
                  </div>
                </div>

                {remainingSeconds !== null && (
                  <div className="text-left">
                    <p className="text-[10px] text-slateNavy-400">الوقت المتبقي</p>
                    <p className="text-sm font-bold font-mono text-slateNavy-100">
                      {formatCountdown(remainingSeconds)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reassurance Banner */}
          <div className="p-3.5 bg-slateNavy-900 border border-slateNavy-800 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-slateNavy-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slateNavy-400 leading-relaxed">
              <strong>غادر وتجول بحرية:</strong> حتى لو تأخرت بضع دقائق في الطريق، يتيح النظام لـ {staffTitle} تجميد وحفظ دورك (Smart Hold) لتدخل فور وصولك دون ضياع مكانك.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => fetchState()}
              className="flex-1 py-3 px-4 bg-slateNavy-900 hover:bg-slateNavy-800 border border-slateNavy-800 text-slateNavy-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slateNavy-400" />
              تحديث الحالة
            </button>
            <button
              onClick={handleLeaveQueue}
              className="py-3 px-4 bg-slateNavy-900 hover:bg-slateNavy-800 text-slateNavy-400 hover:text-rose-400 border border-slateNavy-800 rounded-xl text-xs font-semibold transition"
            >
              مغادرة الطابور
            </button>
          </div>
        </div>
      ) : (
        /* Screen 2: Booking Form */
        <div className="space-y-4 my-auto">
          {/* Status Metrics */}
          <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slateNavy-950 p-2.5 rounded-xl border border-slateNavy-800">
                <p className="text-[10px] text-slateNavy-400 mb-0.5">الدور النشط</p>
                <p className="text-xl font-black text-slateNavy-100">
                  {activeCurrent ? `#${activeCurrent.ticket_number}` : '—'}
                </p>
              </div>

              <div className="bg-slateNavy-950 p-2.5 rounded-xl border border-slateNavy-800">
                <p className="text-[10px] text-slateNavy-400 mb-0.5">في الانتظار</p>
                <p className="text-xl font-black text-slateNavy-100">
                  {queueState?.totalWaiting || 0}
                </p>
              </div>

              <div className="bg-slateNavy-950 p-2.5 rounded-xl border border-slateNavy-800">
                <p className="text-[10px] text-slateNavy-400 mb-0.5">الانتظار المتوقع</p>
                <p className="text-xl font-black text-slateNavy-100">
                  ~{(queueState?.totalWaiting || 0) * (org?.avg_service_mins || 15)} د
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleBook} className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-bold text-slateNavy-100">احجز دورك الرقمي</h2>
              <p className="text-xs text-slateNavy-400 mt-0.5">
                احجز تذكرتك وغادر القاعة، وسننبهك صوتياً عند حلول دورك
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slateNavy-400 mb-1">
                  الاسم (اختياري)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slateNavy-700 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: محمد، عبد القادر..."
                    className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl pr-9 pl-3 py-2.5 text-sm text-slateNavy-100 placeholder-slateNavy-700 focus:outline-none focus:border-slateNavy-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slateNavy-400 mb-1">
                  رقم الهاتف (اختياري لتلقي التنبيهات)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slateNavy-700 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05 / 06 / 07..."
                    className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl pr-9 pl-3 py-2.5 text-sm text-slateNavy-100 placeholder-slateNavy-700 focus:outline-none focus:border-slateNavy-400 text-left dir-ltr transition"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-slateNavy-100 hover:bg-white text-slateNavy-950 font-black rounded-2xl flex items-center justify-center gap-2 transition transform active:scale-[0.98] disabled:opacity-50"
            >
              <span>{isSubmitting ? 'جاري الحجز...' : 'احجز دورك الآن وغادر القاعة مطمئناً'}</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </form>

          <div className="text-center px-4">
            <p className="text-[11px] text-slateNavy-700">
              بدون طابعات وبدون شاشات تلفاز • تذكرتك محفوظة على هاتفك حتى بدون إنترنت
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-2 text-[11px] text-slateNavy-700 border-t border-slateNavy-900 mt-4">
        نظام الطابور الذكي العام • لا مزيد من التزاحم في قاعات الانتظار
      </footer>
    </main>
  );
}
