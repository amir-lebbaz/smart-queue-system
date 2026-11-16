'use client';

import React, { useState, useEffect, useRef, use } from 'react';
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
  Sparkles,
  Phone,
  User,
  RefreshCw,
  Share2,
  Copy,
  Check
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
      // If network fails, offline state handles countdown
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  };

  // Poll state every 4s when online
  useEffect(() => {
    fetchState();
    const interval = setInterval(() => {
      if (navigator.onLine) {
        fetchState();
      }
    }, 4000);
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

      // Trigger Web Audio Chime + Haptic Vibration when <= 10 mins remaining
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

  // Calculate live people ahead
  let livePeopleAhead = 0;
  let isCurrentlyServingMe = false;
  let isCompletedForMe = false;

  if (myTicket && org) {
    if (org.current_ticket_number === myTicket.ticketNumber) {
      isCurrentlyServingMe = true;
    } else if (org.current_ticket_number > myTicket.ticketNumber) {
      isCompletedForMe = true;
    } else {
      livePeopleAhead = myTicket.ticketNumber - org.current_ticket_number;
    }
  }

  // Trigger alert when online & people ahead <= 2
  useEffect(() => {
    if (myTicket && queueState) {
      const currentNum = queueState.organization.current_ticket_number;
      const ahead = Math.max(0, myTicket.ticketNumber - currentNum);
      if (ahead > 0 && ahead <= 2 && !alertTriggered) {
        playQueueChime();
        setAlertTriggered(true);
      }
    }
  }, [queueState, myTicket, alertTriggered]);

  // When my turn arrives, trigger chime and voice announcement
  useEffect(() => {
    if (isCurrentlyServingMe && !calledSpoken) {
      playQueueChime();
      speakArabicAnnouncement(`حان دورك الآن يا ${sectorLabel}! يرجى التوجه إلى ${staffTitle} فوراً`);
      setCalledSpoken(true);
    }
  }, [isCurrentlyServingMe, calledSpoken, sectorLabel, staffTitle]);

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
        // Play welcome chime so browser grants audio permission
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

  // Release/Cancel ticket locally
  const handleLeaveQueue = () => {
    if (confirm('هل أنت متأكد من إلغاء تذكرتك والخروج من المتابعة؟')) {
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
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium">جاري فحص حالة الطابور...</p>
      </div>
    );
  }

  if (error && !queueState && !myTicket) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-14 h-14 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">{error}</h2>
        <p className="text-slate-400 mb-6">يرجى التأكد من مسح رمز QR الصحيح للمؤسسة</p>
        <Link href="/" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm transition">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <main className={`flex-1 max-w-md mx-auto w-full p-4 flex flex-col justify-between transition-colors ${
      isCurrentlyServingMe ? 'bg-emerald-950/20' : ''
    }`} dir="rtl">
      {/* Top Header & Offline Status Indicator */}
      <header className="mb-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-1.5">
              <span>{org?.name || myTicket?.orgName}</span>
            </h1>
            <p className="text-xs text-slate-400">
              خدمة {sectorLabel} الذكية • {staffTitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isOnline ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                <Wifi className="w-3 h-3 animate-pulse" />
                مباشر
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded-full">
                <WifiOff className="w-3 h-3" />
                أوفلاين
              </span>
            )}
          </div>
        </div>

        {/* Offline notification banner */}
        {!isOnline && (
          <div className="mt-3 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-amber-300 text-xs">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>وضع عدم الاتصال نشط: عدادك يعمل محلياً ومكانك في الطابور محفوظ.</span>
          </div>
        )}
      </header>

      {/* Screen 1: Active Ticket View (Boarding Pass Card) */}
      {myTicket ? (
        <div className="space-y-4 my-auto">
          {/* Main Boarding Pass Card */}
          <div className={`relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border rounded-3xl p-6 shadow-2xl overflow-hidden transition-all ${
            isCurrentlyServingMe 
              ? 'border-emerald-400 shadow-emerald-500/30 ring-4 ring-emerald-500/20' 
              : 'border-emerald-500/40 shadow-emerald-950/40'
          }`}>
            {/* Top decorative badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                تذكرتك الرقمية المحفوظة
              </span>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={handleShare}
                  title="مشاركة التذكرة"
                  className="text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => playQueueChime()}
                  title="اختبار نغمة التنبيه"
                  className="text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg transition"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Giant Ticket Number */}
            <div className="text-center py-2">
              <p className="text-xs font-medium text-slate-400 mb-1">رقم دورك في القائمة</p>
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 tracking-tight">
                #{myTicket.ticketNumber}
              </div>
              {myTicket.customerName && (
                <p className="text-sm font-semibold text-slate-300 mt-1">
                  مرحباً، {myTicket.customerName}
                </p>
              )}
            </div>

            {/* Perforated separator line */}
            <div className="relative my-5">
              <div className="border-t-2 border-dashed border-slate-800" />
              <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-950 rounded-full border-r border-emerald-500/30" />
              <div className="absolute -right-9 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-950 rounded-full border-l border-emerald-500/30" />
            </div>

            {/* Serving status logic */}
            {isCurrentlyServingMe ? (
              <div className="bg-emerald-500/25 border-2 border-emerald-400 rounded-2xl p-4 text-center animate-pulse">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                <h3 className="text-xl font-black text-white">حان دورك الآن! ادخل فوراً</h3>
                <p className="text-xs text-emerald-200 mt-1">{staffTitle} بانتظارك في الداخل</p>
              </div>
            ) : isCompletedForMe ? (
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <h3 className="text-base font-bold text-slate-200">اكتملت هذه الخدمة</h3>
                <p className="text-xs text-slate-400 mt-1">شكراً لزيارتك وتعاملك معنا</p>
              </div>
            ) : (
              /* Live Queue Metrics */
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 text-center">
                  <p className="text-[11px] text-slate-400 mb-0.5">الرقم الحالي بالداخل</p>
                  <p className="text-2xl font-extrabold text-amber-400">
                    {org ? `#${org.current_ticket_number}` : '...'}
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 text-center">
                  <p className="text-[11px] text-slate-400 mb-0.5">أشخاص قبلك</p>
                  <p className="text-2xl font-extrabold text-white">
                    {livePeopleAhead}
                  </p>
                </div>
              </div>
            )}

            {/* Estimated Clock Time & Offline Autonomous Timer */}
            {!isCompletedForMe && !isCurrentlyServingMe && (
              <div className="mt-4 bg-emerald-950/40 border border-emerald-800/50 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">ساعة الدخول التقريبية</p>
                    <p className="text-lg font-black text-emerald-300">
                      {myTicket.initialEstimatedClockTime}
                    </p>
                  </div>
                </div>

                {remainingSeconds !== null && (
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-medium">الوقت المتبقي</p>
                    <p className="text-base font-bold font-mono text-white">
                      {formatCountdown(remainingSeconds)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Smart Reassurance Banner */}
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>غادر القاعة وتجول بحرية:</strong> حتى لو تأخرت بضع دقائق في الطريق، يتيح النظام لـ {staffTitle} تجميد وحفظ دورك (Smart Hold) لتدخل مباشرة فور وصولك دون أن تفقد مكانك.
            </p>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => fetchState()}
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              تحديث الحالة
            </button>
            <button
              onClick={handleLeaveQueue}
              className="py-3 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition"
            >
              مغادرة الطابور
            </button>
          </div>
        </div>
      ) : (
        /* Screen 2: Booking Form */
        <div className="space-y-4 my-auto">
          {/* Live Status Cards before booking */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 mb-0.5">الرقم الحالي</p>
                <p className="text-xl font-black text-amber-400">
                  {org?.current_ticket_number ? `#${org.current_ticket_number}` : '0'}
                </p>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 mb-0.5">في الانتظار</p>
                <p className="text-xl font-black text-white">
                  {queueState?.totalWaiting || 0}
                </p>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 mb-0.5">وقت الانتظار</p>
                <p className="text-xl font-black text-emerald-400">
                  ~{(queueState?.totalWaiting || 0) * (org?.avg_service_mins || 15)} د
                </p>
              </div>
            </div>
          </div>

          {/* Quick Booking Card */}
          <form onSubmit={handleBook} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-bold text-white">احجز دورك الرقمي</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                احجز تذكرتك فوراً وغادر القاعة، وسننبهك صوتياً عند اقتراب دورك
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  الاسم (اختياري)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: محمد، عبد القادر..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  رقم الهاتف (اختياري لتلقي التنبيهات)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05 / 06 / 07..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-left dir-ltr transition"
                  />
                </div>
              </div>
            </div>

            {/* Giant Primary Booking CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition transform active:scale-[0.98] disabled:opacity-50"
            >
              <span>{isSubmitting ? 'جاري الحجز...' : 'احجز دورك الآن وغادر القاعة مطمئناً'}</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </form>

          {/* Zero hardware reassurance */}
          <div className="text-center px-4">
            <p className="text-[11px] text-slate-500">
              لا حاجة لطباعة أوراق ولا شاشات تلفاز • تذكرتك محفوظة على هاتفك حتى لو انقطع الإنترنت
            </p>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="text-center py-2 text-[11px] text-slate-600 border-t border-slate-900 mt-4">
        نظام الطابور الذكي العام • لا مزيد من التزاحم في قاعات الانتظار
      </footer>
    </main>
  );
}
