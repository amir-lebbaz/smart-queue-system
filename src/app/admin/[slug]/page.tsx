'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  Users, 
  Clock, 
  ArrowRight, 
  Phone, 
  MessageSquare, 
  Share2, 
  PauseCircle, 
  Play, 
  UserPlus, 
  RotateCcw, 
  QrCode, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  X,
  Volume2,
  VolumeX,
  Printer,
  Trash2,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { QueueState, Ticket } from '@/lib/types';
import { playQueueChime } from '@/lib/audio';
import { announceTicketCall } from '@/lib/speech';

export default function StaffRemotePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [queueState, setQueueState] = useState<QueueState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Audio / Speech settings
  const [soundEnabled, setSoundEnabled] = useState(true);

  // PIN Authentication state
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Modals state
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinResult, setWalkinResult] = useState<Ticket | null>(null);
  const [isCreatingWalkin, setIsCreatingWalkin] = useState(false);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newAvgMins, setNewAvgMins] = useState<number>(15);

  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);

  // Check saved session PIN
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = sessionStorage.getItem(`queue_admin_auth_${slug}`);
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, [slug]);

  // Generate pure offline QR Data URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}/q/${slug}`;
      QRCode.toDataURL(fullUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate offline QR', err));
    }
  }, [slug]);

  // Fetch queue state
  const fetchState = async () => {
    try {
      const res = await fetch(`/api/organizations/${slug}`);
      if (!res.ok) {
        setError('تعذر تحميل بيانات المؤسسة');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setQueueState(data.data);
        setNewAvgMins(data.data.organization.avg_service_mins);
        setError(null);
      }
    } catch {
      setError('خطأ في الاتصال بالشبكة');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 3500);
    return () => clearInterval(interval);
  }, [slug]);

  // Handle PIN verification
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queueState) return;

    if (pinInput === queueState.organization.pin_code) {
      setIsAuthenticated(true);
      setPinError(false);
      sessionStorage.setItem(`queue_admin_auth_${slug}`, 'true');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  // Action: Call Next (+1)
  const handleCallNext = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/organizations/${slug}/next`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        if (soundEnabled) {
          playQueueChime();
          if (data.data.currentTicket) {
            announceTicketCall(
              data.data.currentTicket.ticket_number,
              queueState?.organization.staff_title || 'المسير',
              queueState?.organization.sector_label || 'زبون'
            );
          }
        }
        fetchState();
      } else {
        alert(data.error || 'تعذر استدعاء الرقم التالي');
      }
    } catch {
      alert('خطأ في الاتصال');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Smart Hold (تأجيل خطوة)
  const handleSmartHold = async () => {
    if (!queueState?.currentTicket) {
      alert('لا توجد تذكرة يتم خدمتها حالياً لتأجيلها');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/organizations/${slug}/hold`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        if (soundEnabled) {
          playQueueChime();
        }
        fetchState();
      } else {
        alert(data.error || 'تعذر تأجيل التذكرة');
      }
    } catch {
      alert('خطأ في الاتصال');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Recall Held Ticket (إدخال فوري)
  const handleRecallHeld = async (ticketId: number) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/organizations/${slug}/recall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId }),
      });
      const data = await res.json();
      if (data.success) {
        if (soundEnabled) {
          playQueueChime();
          if (data.data.currentTicket) {
            announceTicketCall(
              data.data.currentTicket.ticket_number,
              queueState?.organization.staff_title || 'المسير',
              queueState?.organization.sector_label || 'زبون'
            );
          }
        }
        fetchState();
      } else {
        alert(data.error || 'تعذر إدخال التذكرة المؤجلة');
      }
    } catch {
      alert('خطأ في الاتصال');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Cancel a waiting ticket
  const handleCancelTicket = async (ticketId: number, num: number) => {
    if (!confirm(`هل أنت متأكد من إلغاء وحذف التذكرة رقم #${num} من الطابور؟`)) {
      return;
    }
    try {
      const res = await fetch(`/api/tickets?ticketId=${ticketId}&orgSlug=${slug}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
      }
    } catch {
      alert('تعذر إلغاء التذكرة');
    }
  };

  // Action: Walk-in ticket creation
  const handleCreateWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingWalkin(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgSlug: slug,
          customerName: walkinName,
          customerPhone: walkinPhone,
          ticketType: 'walkin',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setWalkinResult(data.data);
        setWalkinName('');
        setWalkinPhone('');
        fetchState();
      } else {
        alert(data.error || 'تعذر إنشاء التذكرة الحضورية');
      }
    } catch {
      alert('خطأ في الاتصال');
    } finally {
      setIsCreatingWalkin(false);
    }
  };

  // Action: Reset Queue for a new day
  const handleResetQueue = async () => {
    if (!confirm('هل أنت متأكد من تصفير الطابور ليوم جديد؟ سيتم إلغاء التذاكر الحالية وإعادة العداد للصفر.')) {
      return;
    }

    try {
      const res = await fetch(`/api/organizations/${slug}/reset`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('تم تصفير الطابور بنجاح لبداية يوم جديد');
        fetchState();
      }
    } catch {
      alert('خطأ في الاتصال');
    }
  };

  // Action: Update Avg Service Mins
  const handleSaveSettings = async () => {
    try {
      const res = await fetch(`/api/organizations/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avg_service_mins: Number(newAvgMins) }),
      });
      const data = await res.json();
      if (data.success) {
        setShowSettingsModal(false);
        fetchState();
      }
    } catch {
      alert('تعذر تحديث الإعدادات');
    }
  };

  const org = queueState?.organization;
  const sectorLabel = org?.sector_label || 'زبون';
  const staffTitle = org?.staff_title || 'المسير';

  // Render PIN login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-sm mx-auto w-full" dir="rtl">
        <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-xl font-bold text-white mb-1">ريموت تحكم المسير</h1>
          <p className="text-xs text-slate-400 mb-6">
            {org?.name || 'جاري التحميل...'} • أدخل رمز PIN للدخول
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="رمز PIN (الافتراضي 1234)"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-center text-2xl tracking-widest text-white placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:border-emerald-500 transition"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-400 mt-2 font-medium">رمز PIN غير صحيح، حاول مجدداً</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-950/50 transition active:scale-[0.98]"
            >
              دخول إلى لوحة التحكم
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-400 transition">
              ← العودة للبوابة الرئيسية
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-md mx-auto w-full p-3.5 pb-20 flex flex-col justify-between" dir="rtl">
      {/* Top Header */}
      <header className="mb-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h1 className="text-sm font-bold text-white truncate max-w-[190px]">
                {org?.name}
              </h1>
            </div>
            <p className="text-[11px] text-slate-400">
              ريموت {staffTitle} • خدمة الـ {sectorLabel}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio & Arabic Voice Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'تعطيل الصوت والنداء الصوتي' : 'تفعيل الصوت والنداء الصوتي'}
              className={`p-2 rounded-xl transition ${
                soundEnabled 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Daily Stats Button */}
            <button
              onClick={() => setShowStatsModal(true)}
              title="إحصائيات وإنتاجية اليوم"
              className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl transition"
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            {/* Printable QR Stand Button */}
            <button
              onClick={() => setShowQrModal(true)}
              title="عرض وتنزيل ملصق QR الجداري"
              className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl transition"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettingsModal(true)}
              title="الإعدادات ومتوسط الوقت"
              className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl transition"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top KPI Bar */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 text-center shadow">
            <p className="text-[10px] text-slate-400 mb-0.5">الرقم الحالي</p>
            <p className="text-2xl font-black text-emerald-400">
              {org?.current_ticket_number ? `#${org.current_ticket_number}` : '0'}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 text-center shadow">
            <p className="text-[10px] text-slate-400 mb-0.5">في الانتظار</p>
            <p className="text-2xl font-black text-amber-400">
              {queueState?.totalWaiting || 0}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 text-center shadow">
            <p className="text-[10px] text-slate-400 mb-0.5">متوسط الخدمة</p>
            <p className="text-2xl font-black text-sky-400">
              {org?.avg_service_mins || 15} <span className="text-xs font-normal">د</span>
            </p>
          </div>
        </div>
      </header>

      {/* Primary Action Buttons Grid */}
      <section className="space-y-2.5 my-2">
        {/* Giant Emerald Next Button */}
        <button
          onClick={handleCallNext}
          disabled={actionLoading || (queueState?.totalWaiting === 0 && !queueState?.currentTicket)}
          className="w-full py-4 px-5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-950/60 flex items-center justify-between transition transform active:scale-[0.98] disabled:opacity-40"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div className="text-right">
              <span className="flex items-center gap-1.5">
                الرقم التالي (+1)
                {soundEnabled && <span className="text-[10px] font-normal bg-white/20 px-1.5 py-0.2 rounded-full">مع نداء صوتي</span>}
              </span>
              <p className="text-[11px] font-normal text-emerald-100">
                إنهاء الحالي واستدعاء التالي تلقائياً
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 rotate-180" />
        </button>

        {/* Secondary Row: Smart Hold & Walk-in */}
        <div className="grid grid-cols-2 gap-2">
          {/* Amber Smart Hold Button */}
          <button
            onClick={handleSmartHold}
            disabled={actionLoading || !queueState?.currentTicket}
            className="py-3 px-3 bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-2xl shadow-md shadow-amber-950/40 flex flex-col items-center justify-center text-center gap-1 transition active:scale-[0.98] disabled:opacity-40"
          >
            <PauseCircle className="w-5 h-5" />
            <span className="text-xs">تأجيل خطوة (Hold)</span>
            <span className="text-[9px] font-normal text-amber-100">حفظ دور الغائب المؤقت</span>
          </button>

          {/* Blue Walk-in Ticket Button */}
          <button
            onClick={() => {
              setWalkinResult(null);
              setShowWalkinModal(true);
            }}
            className="py-3 px-3 bg-gradient-to-br from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-bold rounded-2xl shadow-md shadow-blue-950/40 flex flex-col items-center justify-center text-center gap-1 transition active:scale-[0.98]"
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-xs">+ تذكرة حضورية</span>
            <span className="text-[9px] font-normal text-sky-100">هاتف حطبة / بدون هاتف</span>
          </button>
        </div>
      </section>

      {/* Held Priority Box (أولوية الدخول فور الوصول) */}
      {queueState?.heldTickets && queueState.heldTickets.length > 0 && (
        <section className="my-2 p-3 bg-amber-950/50 border border-amber-500/50 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-amber-800/40">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              أدوار مجمدة محفوظة مؤقتاً ({queueState.heldTickets.length})
            </span>
            <span className="text-[10px] text-amber-200/80">أولوية الدخول فور الوصول</span>
          </div>

          <div className="space-y-2">
            {queueState.heldTickets.map((t) => (
              <div 
                key={t.id} 
                className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-amber-400">#{t.ticket_number}</span>
                    <span className="text-xs font-semibold text-white">
                      {t.customer_name || sectorLabel}
                    </span>
                  </div>
                  {t.customer_phone && (
                    <span className="text-[10px] text-slate-400">{t.customer_phone}</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Phone Quick Bip & SMS for held customer */}
                  {t.customer_phone && (
                    <div className="flex items-center gap-1">
                      <a
                        href={`tel:${t.customer_phone}`}
                        title="رنة سريعة Bip"
                        className="p-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg text-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`sms:${t.customer_phone}?body=مرحباً، وصل دورك رقم ${t.ticket_number} لدى ${org?.name}. ننتظر دخولك فوراً.`}
                        title="إرسال SMS"
                        className="p-1.5 bg-sky-600/20 text-sky-400 hover:bg-sky-600/30 rounded-lg text-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {/* Immediate Entry CTA */}
                  <button
                    onClick={() => handleRecallHeld(t.id)}
                    className="py-1 px-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow transition"
                  >
                    حضر الآن (إدخال)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Queue List */}
      <section className="flex-1 overflow-y-auto space-y-2 my-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>قائمة الانتظار القادمة</span>
          <span>{queueState?.waitingTickets.length || 0} في الطابور</span>
        </div>

        {queueState?.waitingTickets.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl">
            <CheckCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-medium">قاعة الانتظار فارغة حالياً</p>
            <p className="text-[10px] text-slate-500 mt-0.5">يمكنك إضافة تذكرة حضورية أو انتظار مسح QR</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {queueState?.waitingTickets.map((t, idx) => (
              <div
                key={t.id}
                className="bg-slate-900 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-white">#{t.ticket_number}</span>
                      <span className="text-xs text-slate-300">
                        {t.customer_name || `${sectorLabel} #${t.ticket_number}`}
                      </span>
                      {t.ticket_type === 'walkin' && (
                        <span className="text-[9px] bg-sky-950 border border-sky-800 text-sky-300 px-1.5 py-0.2 rounded">
                          حضوري
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      الدخول المتوقع: {t.estimated_clock_time} (~{t.estimated_wait_mins} د)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* 1-Tap Action Links for Feature-Phone Customers */}
                  {t.customer_phone ? (
                    <div className="flex items-center gap-1">
                      <a
                        href={`tel:${t.customer_phone}`}
                        title="رنة سريعة Bip"
                        className="p-1.5 bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 rounded-lg transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`sms:${t.customer_phone}?body=تنبيه: اقترب دورك رقم ${t.ticket_number} لدى ${org?.name}. يرجى التوجه للقاعة الآن.`}
                        title="رسالة SMS جاهزة"
                        className="p-1.5 bg-slate-800 hover:bg-sky-600/30 text-sky-400 rounded-lg transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/${t.customer_phone.replace(/\D/g, '')}?text=تنبيه: اقترب دورك رقم ${t.ticket_number} لدى ${org?.name}. يرجى الحضور.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="تنبيه واتساب"
                        className="p-1.5 bg-slate-800 hover:bg-green-600/30 text-green-400 rounded-lg transition"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : null}

                  {/* Cancel / Remove ticket button */}
                  <button
                    onClick={() => handleCancelTicket(t.id, t.ticket_number)}
                    title="إلغاء التذكرة"
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Utility Bar */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/95 backdrop-blur border-t border-slate-800 px-4 py-2.5 flex items-center justify-between z-10">
        <button
          onClick={handleResetQueue}
          className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>تصفير ليوم جديد</span>
        </button>

        <Link
          href={`/q/${slug}`}
          target="_blank"
          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition"
        >
          <span>معاينة شاشة الزبون</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
        </Link>
      </footer>

      {/* Modal 1: Walk-in Ticket Creator */}
      {showWalkinModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-sky-400" />
                تذكرة حضورية (هاتف حطبة / بدون هاتف)
              </h3>
              <button onClick={() => setShowWalkinModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {walkinResult ? (
              <div className="text-center space-y-3 py-2">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                
                {/* Large confirmation card for staff to tell customer */}
                <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 mb-1 font-medium">أبلغ الزبون بالعبارة التالية:</p>
                  <p className="text-3xl font-black text-emerald-400 mb-1">
                    رقمك #{walkinResult.ticket_number}
                  </p>
                  <p className="text-sm font-bold text-white">
                    ارجع على الساعة <span className="text-amber-400 text-lg font-black">{walkinResult.estimated_clock_time}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    (مدة الانتظار التقريبية: {walkinResult.estimated_wait_mins} دقيقة)
                  </p>
                </div>

                <button
                  onClick={() => {
                    setWalkinResult(null);
                    setShowWalkinModal(false);
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
                >
                  إغلاق ومتابعة الطابور
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateWalkin} className="space-y-3">
                <p className="text-xs text-slate-400">
                  سجل الزبون وسيحسب النظام فوراً توقيت عودته التقريبي لإفراغ القاعة.
                </p>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">
                    اسم {sectorLabel} (اختياري)
                  </label>
                  <input
                    type="text"
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    placeholder="مثال: صالح..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">
                    رقم الهاتف (لإجراء Bip أو SMS)
                  </label>
                  <input
                    type="tel"
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    placeholder="05 / 06 / 07..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 text-left dir-ltr"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreatingWalkin}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-sm transition disabled:opacity-50"
                >
                  {isCreatingWalkin ? 'جاري الإصدار...' : 'إصدار التذكرة وحساب وقت العودة'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal 2: Daily Productivity Stats Drawer */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                إنتاجية وإحصائيات اليوم
              </h3>
              <button onClick={() => setShowStatsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400">إجمالي التذاكر اليوم</p>
                <p className="text-2xl font-black text-white mt-1">
                  {queueState?.stats?.totalIssued || 0}
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400">الخدمات المكتملة</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">
                  {queueState?.stats?.totalCompleted || 0}
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400">أدوار مجمدة (Hold)</p>
                <p className="text-2xl font-black text-amber-400 mt-1">
                  {queueState?.stats?.totalHeld || 0}
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400">تذاكر ملغاة</p>
                <p className="text-2xl font-black text-rose-400 mt-1">
                  {queueState?.stats?.totalCancelled || 0}
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
              <p className="text-[11px] text-slate-400">متوسط وتيرة الخدمة الحالية</p>
              <p className="text-xl font-bold text-sky-400 mt-0.5">
                {org?.avg_service_mins} دقيقة لكل {sectorLabel}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                يتم تحديثه ذاتياً كل استدعاء بناءً على الوقت الحقيقي المنقضي
              </p>
            </div>

            <button
              onClick={() => setShowStatsModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Modal 3: Settings & Service Speed */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-emerald-400" />
                إعدادات سرعة الطابور
              </h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  متوسط وقت خدمة كل {sectorLabel} (بالدقائق)
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={newAvgMins}
                  onChange={(e) => setNewAvgMins(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-base text-white text-center font-bold focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  ملاحظة: يقوم النظام تلقائياً بتحديث هذا الرقم كلما ضغطت "الرقم التالي" وفق وتيرتك الحقيقية (Rolling Average).
                </p>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
              >
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: 100% Offline Vector Printable QR Code Poster */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div id="qr-poster-card" className="bg-white text-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between print:hidden">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                ملصق الحائط الذكي للطابور
              </span>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-b pb-3 border-slate-100">
              <h2 className="text-2xl font-black text-slate-900">{org?.name}</h2>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                نظام حجز الدور الذكي بدون انتظار في القاعة
              </p>
            </div>

            {/* Offline-generated vector QR Code Data URL */}
            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-52 h-52 rounded-xl shadow-sm"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-xs text-slate-400">
                  جاري توليد الرمز محلياً...
                </div>
              )}
              <p className="text-xs font-mono font-bold text-slate-700 mt-2">
                /q/{slug}
              </p>
            </div>

            <div className="text-xs text-slate-700 font-medium leading-relaxed bg-emerald-50 border border-emerald-100 rounded-xl p-2.5">
              📱 <strong>امسح الرمز بكاميرا هاتفك:</strong> احجز تذكرتك وغادر القاعة فوراً. سيهتز هاتفك ويطلق نغمة تنبيه صوتية عند اقتراب دورك.
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow print:hidden"
            >
              <Printer className="w-4 h-4" />
              طباعة ملصق الحائط الآن
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
