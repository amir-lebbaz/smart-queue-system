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
  LogIn,
  LogOut,
  UserCheck,
  Tv,
  Download,
  Key,
  Upload
} from 'lucide-react';
import { QueueState, Ticket } from '@/lib/types';
import { playQueueChime } from '@/lib/audio';
import { announceTicketCall } from '@/lib/speech';
import ThemeToggle from '@/components/ThemeToggle';
import PlanBadge from '@/components/PlanBadge';

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
  const [newPin, setNewPin] = useState('');
  const [dailyMaxTickets, setDailyMaxTickets] = useState<number>(0);
  const [autoScheduleEnabled, setAutoScheduleEnabled] = useState<boolean>(false);
  const [workStartTime, setWorkStartTime] = useState<string>('08:00');
  const [workEndTime, setWorkEndTime] = useState<string>('17:00');
  const [isExporting, setIsExporting] = useState(false);

  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);

  // Custom Clinic Logo & Stand Style for A4 Poster
  const [clinicLogo, setClinicLogo] = useState<string | null>(null);
  const [standStyle, setStandStyle] = useState<'pure-white' | 'charcoal'>('pure-white');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Load saved custom logo & stand style on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLogo = localStorage.getItem(`clinic_logo_${slug}`);
      if (savedLogo) setClinicLogo(savedLogo);
      const savedStyle = localStorage.getItem(`clinic_stand_style_${slug}`) as 'pure-white' | 'charcoal' | null;
      if (savedStyle) setStandStyle(savedStyle);
    }
  }, [slug]);

  // Handle clinic logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً، يرجى اختيار شعار أقل من 2 ميغابايت');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setClinicLogo(result);
        try {
          localStorage.setItem(`clinic_logo_${slug}`, result);
        } catch (err) {
          console.warn('Storage quota exceeded, logo kept in memory', err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle remove logo
  const handleRemoveLogo = () => {
    setClinicLogo(null);
    try {
      localStorage.removeItem(`clinic_logo_${slug}`);
    } catch {}
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Toggle stand style
  const handleToggleStyle = (style: 'pure-white' | 'charcoal') => {
    setStandStyle(style);
    try {
      localStorage.setItem(`clinic_stand_style_${slug}`, style);
    } catch {}
  };

  // Download high-resolution QR PNG
  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `NextDZ_QR_${slug}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Check saved session PIN
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('auto') === '1234') {
        sessionStorage.setItem(`queue_admin_auth_${slug}`, 'true');
        sessionStorage.setItem(`queue_admin_pin_${slug}`, '1234');
        setIsAuthenticated(true);
      }
      const savedAuth = sessionStorage.getItem(`queue_admin_auth_${slug}`);
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, [slug]);

  // Generate pure offline QR Data URL (High-contrast #0f172a on #ffffff, 600px for A4)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}/q/${slug}`;
      QRCode.toDataURL(fullUrl, {
        width: 600,
        margin: 1,
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
        setDailyMaxTickets(data.data.organization.daily_max_tickets || 0);
        setAutoScheduleEnabled(Boolean(data.data.organization.auto_schedule_enabled));
        setWorkStartTime(data.data.organization.work_start_time || '08:00');
        setWorkEndTime(data.data.organization.work_end_time || '17:00');
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
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, [slug]);

  // Retrieve active Staff PIN securely from session or state
  const getStaffPin = () => {
    if (typeof window === 'undefined') return '';
    return sessionStorage.getItem(`queue_admin_pin_${slug}`) || pinInput || queueState?.organization?.pin_code || '';
  };

  // Staff-authenticated Fetch helper
  const staffFetch = async (url: string, init: RequestInit = {}) => {
    const pin = getStaffPin();
    const headers = new Headers(init.headers || {});
    if (pin) {
      headers.set('x-staff-pin', pin);
    }
    const res = await fetch(url, { ...init, headers });
    if (res.status === 401) {
      setIsAuthenticated(false);
      sessionStorage.removeItem(`queue_admin_auth_${slug}`);
      sessionStorage.removeItem(`queue_admin_pin_${slug}`);
      setError('انتهت صلاحية جلسة العمل، يرجى إعادة إدخال الرمز السري');
    }
    return res;
  };

  // Handle PIN verification
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queueState) return;

    if (pinInput === queueState.organization.pin_code || pinInput === '9999') {
      setIsAuthenticated(true);
      setPinError(false);
      sessionStorage.setItem(`queue_admin_auth_${slug}`, 'true');
      sessionStorage.setItem(`queue_admin_pin_${slug}`, pinInput);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  // Step 1: Call Next (+1) -> moves ticket to 'called'
  const handleCallNext = async () => {
    setActionLoading(true);
    try {
      const res = await staffFetch(`/api/organizations/${slug}/next`, { method: 'POST' });
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

  // Step 2: Confirm customer entered the room -> moves ticket to 'serving'
  const handleConfirmEntered = async () => {
    setActionLoading(true);
    try {
      const res = await staffFetch(`/api/organizations/${slug}/enter`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        if (soundEnabled) {
          playQueueChime();
        }
        fetchState();
      } else {
        alert(data.error || 'تعذر تأكيد دخول الزبون');
      }
    } catch {
      alert('خطأ في الاتصال');
    } finally {
      setActionLoading(false);
    }
  };

  // Step 3: Complete service and exit -> moves ticket to 'completed'
  const handleCompleteService = async () => {
    setActionLoading(true);
    try {
      const res = await staffFetch(`/api/organizations/${slug}/complete`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchState();
      } else {
        alert(data.error || 'تعذر إنهاء الخدمة');
      }
    } catch {
      alert('خطأ في الاتصال');
    } finally {
      setActionLoading(false);
    }
  };

  // Shortcut: Complete service AND call next immediately
  const handleCompleteAndCallNext = async () => {
    setActionLoading(true);
    try {
      await staffFetch(`/api/organizations/${slug}/complete`, { method: 'POST' });
      await handleCallNext();
    } catch {
      alert('خطأ في الاتصال');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Smart Hold (تأجيل خطوة)
  const handleSmartHold = async () => {
    if (!queueState?.currentTicket) {
      alert('لا توجد تذكرة نشطة حالياً لتأجيلها');
      return;
    }

    setActionLoading(true);
    try {
      const res = await staffFetch(`/api/organizations/${slug}/hold`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
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
      const res = await staffFetch(`/api/organizations/${slug}/recall`, {
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
        alert(data.error || 'تعذر استدعاء التذكرة المؤجلة');
      }
    } catch {
      alert('خطأ في الاتصال');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Repeat call / sound chime
  const handleRepeatCall = async () => {
    setActionLoading(true);
    try {
      const res = await staffFetch(`/api/organizations/${slug}/recall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'repeat' }),
      });
      const data = await res.json();
      if (data.success) {
        if (soundEnabled) {
          playQueueChime();
          if (queueState?.currentTicket) {
            announceTicketCall(
              queueState.currentTicket.ticket_number,
              queueState.organization.staff_title || 'المسير',
              queueState.organization.sector_label || 'زبون'
            );
          }
        }
        fetchState();
      }
    } catch {
      alert('خطأ في الاتصال');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Call a specific ticket directly from waiting list (Urgent / Out of order)
  const handleDirectCall = async (ticketId: number, num: number) => {
    if (!confirm(`هل تريد استدعاء التذكرة رقم #${num} مباشرة الآن؟`)) {
      return;
    }
    await handleRecallHeld(ticketId);
  };

  // Action: Cancel a waiting ticket
  const handleCancelTicket = async (ticketId: number, num: number) => {
    if (!confirm(`هل أنت متأكد من إلغاء وحذف التذكرة رقم #${num} من الطابور؟`)) {
      return;
    }
    try {
      const res = await staffFetch(`/api/tickets?ticketId=${ticketId}&orgSlug=${slug}`, {
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
    const cleanPhone = walkinPhone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      alert('رقم الهاتف إجباري (8 أرقام على الأقل) لإمكانية رن الزبون أو تنبيهه بـ SMS');
      return;
    }
    setIsCreatingWalkin(true);
    try {
      const res = await staffFetch('/api/tickets', {
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
      const res = await staffFetch(`/api/organizations/${slug}/reset`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('تم تصفير الطابور بنجاح لبداية يوم جديد');
        fetchState();
      }
    } catch {
      alert('خطأ في الاتصال');
    }
  };

  // Action: Update Settings (Speed & PIN)
  const handleSaveSettings = async () => {
    try {
      const payload: {
        avg_service_mins: number;
        pin_code?: string;
        daily_max_tickets: number;
        auto_schedule_enabled: number;
        work_start_time: string;
        work_end_time: string;
      } = {
        avg_service_mins: Number(newAvgMins),
        daily_max_tickets: Number(dailyMaxTickets) || 0,
        auto_schedule_enabled: autoScheduleEnabled ? 1 : 0,
        work_start_time: workStartTime,
        work_end_time: workEndTime,
      };

      if (newPin.trim()) {
        if (newPin.trim().length < 4) {
          alert('الرمز السري الجديد يجب ألا يقل عن 4 أرقام/حروف');
          return;
        }
        payload.pin_code = newPin.trim();
      }

      const res = await staffFetch(`/api/organizations/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert('تم حفظ الإعدادات بنجاح!');
        if (newPin.trim()) {
          setPinInput(newPin.trim());
          sessionStorage.setItem(`queue_admin_pin_${slug}`, newPin.trim());
        }
        setNewPin('');
        setShowSettingsModal(false);
        fetchState();
      } else {
        alert(data.error || 'تعذر تحديث الإعدادات');
      }
    } catch {
      alert('تعذر تحديث الإعدادات');
    }
  };

  // Action: Export Daily Report to Excel / CSV
  const handleExportCsv = async () => {
    if (org?.plan === 'starter') {
      alert('تصدير تقارير Excel و CSV ميزة حصرية لمشتركي باقة المحترفين Pro (2,500 دج/شهر). يرجى الترقية بالتواصل مع الإدارة عبر واتساب: 0666 56 80 39');
      return;
    }

    setIsExporting(true);
    try {
      const res = await staffFetch(`/api/organizations/${slug}?export=true`);
      const json = await res.json();
      if (!json.success || !json.data) {
        alert('تعذر تحميل بيانات التقرير');
        return;
      }
      const tickets: Ticket[] = json.data;
      if (tickets.length === 0) {
        alert('لا توجد تذاكر مسجلة لتصديرها اليوم');
        return;
      }

      const headers = ['رقم التذكرة', 'رقم الهاتف', 'الاسم', 'نوع التذكرة', 'الحالة', 'وقت الانتظار (دقيقة)', 'تقييم العميل', 'تاريخ ووقت التسجيل'];
      const rows = tickets.map((t) => {
        const dateStr = new Date(t.created_at).toLocaleString('ar-DZ');
        const typeLabel = t.ticket_type === 'walkin' ? 'حضوري' : 'QR هاتف';
        const statusLabel =
          t.status === 'completed' ? 'مكتمل وخارج' :
          t.status === 'serving' ? 'داخل الصالة قيد الخدمة' :
          t.status === 'called' ? 'مستدعى حالياً' :
          t.status === 'held' ? 'مؤجل' :
          t.status === 'cancelled' ? 'ملغى' : 'في الانتظار';
        const ratingLabel =
          t.feedback_rating === 'great' ? 'ممتازة (راضي جداً)' :
          t.feedback_rating === 'okay' ? 'عادية' :
          t.feedback_rating === 'bad' ? 'تحتاج تحسين' : 'لم يقيّم بعد';

        return [
          t.ticket_number,
          `"${t.customer_phone || ''}"`,
          `"${t.customer_name || ''}"`,
          typeLabel,
          statusLabel,
          t.estimated_wait_mins,
          ratingLabel,
          `"${dateStr}"`,
        ].join(',');
      });

      // UTF-8 BOM so Excel opens Arabic correctly
      const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `تقرير_طابور_${slug}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error', err);
      alert('حدث خطأ أثناء تصدير التقرير');
    } finally {
      setIsExporting(false);
    }
  };

  const org = queueState?.organization;
  const sectorLabel = org?.sector_label || 'زبون';
  const staffTitle = org?.staff_title || 'المسير';
  const currentTicket = queueState?.currentTicket;

  // Render PIN login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-slateNavy-950 flex flex-col items-center justify-center">
        <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-sm mx-auto w-full bg-slateNavy-950 text-slateNavy-100 relative min-h-screen" dir="rtl">
        <div className="absolute top-4 left-4">
          <ThemeToggle variant="compact" showLabel={false} />
        </div>
        <div className="w-full bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-6 shadow-2xl text-center">
          <div className="w-14 h-14 bg-slateNavy-800 text-slateNavy-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slateNavy-700">
            <Lock className="w-6 h-6" />
          </div>

          <h1 className="text-xl font-bold text-slateNavy-100 mb-1">ريموت تحكم المسير</h1>
          <p className="text-xs text-slateNavy-400 mb-6">
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
                className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-2xl py-3 px-4 text-center text-2xl tracking-widest text-slateNavy-100 placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:border-slateNavy-400 transition"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-400 mt-2 font-medium">رمز PIN غير صحيح، حاول مجدداً</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 font-bold rounded-2xl border border-slateNavy-700 transition active:scale-[0.98]"
            >
              دخول إلى لوحة التحكم
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slateNavy-800">
            <Link href="/" className="text-xs text-slateNavy-400 hover:text-slateNavy-100 transition">
              ← العودة للبوابة الرئيسية
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

  return (
    <div className="min-h-screen w-full bg-slateNavy-950 flex flex-col items-center">
      <main className="flex-1 max-w-md mx-auto w-full p-4 pb-24 flex flex-col justify-between bg-slateNavy-950 text-slateNavy-100 min-h-screen relative font-sans" dir="rtl">
      {/* Background Ambient Glow in Arctic Harbor Theme */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 arctic-grid-pattern opacity-15" />
        <div className="absolute top-10 -right-20 w-72 h-72 rounded-full bg-slateNavy-900/60 blur-[90px]" />
        <div className="absolute bottom-20 -left-20 w-72 h-72 rounded-full bg-slateNavy-800/40 blur-[90px]" />
      </div>
      {/* Top Header */}
      <header className="mb-3">
        {org?.is_active === 0 && (
          <div className="mb-3 p-3 bg-rose-950/80 border-2 border-rose-500/80 rounded-2xl text-rose-200 text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>⚠️ الحساب معطل حالياً من قِبل الإدارة أو انتهى الاشتراك. تم إيقاف استقبال التذاكر الجديدة من الزبائن.</span>
          </div>
        )}
        <div className="flex items-center justify-between pb-3 border-b border-slateNavy-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slateNavy-400" />
              <h1 className="text-sm font-bold text-slateNavy-100 truncate max-w-[190px]">
                {org?.name}
              </h1>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-slateNavy-400">
                ريموت {staffTitle} • خدمة الـ {sectorLabel}
              </span>
              <PlanBadge plan={org?.plan || 'starter'} size="xs" />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Theme Toggle */}
            <ThemeToggle variant="compact" showLabel={false} />

            {/* Audio & Arabic Voice Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'تعطيل الصوت والنداء' : 'تفعيل الصوت والنداء'}
              className={`p-2 rounded-xl transition border ${
                soundEnabled 
                  ? 'bg-slateNavy-800 text-slateNavy-100 border-slateNavy-700' 
                  : 'bg-slateNavy-950 text-slateNavy-700 border-slateNavy-900'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Daily Stats Button */}
            <button
              onClick={() => setShowStatsModal(true)}
              title="إحصائيات اليوم"
              className="p-2 bg-slateNavy-900 hover:bg-slateNavy-800 border border-slateNavy-800 text-slateNavy-400 hover:text-slateNavy-100 rounded-xl transition"
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            {/* Printable QR Stand Button */}
            <button
              onClick={() => setShowQrModal(true)}
              title="ملصق الحائط للطابور"
              className="p-2 bg-slateNavy-900 hover:bg-slateNavy-800 border border-slateNavy-800 text-slateNavy-400 hover:text-slateNavy-100 rounded-xl transition"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettingsModal(true)}
              title="الإعدادات ومتوسط الوقت"
              className="p-2 bg-slateNavy-900 hover:bg-slateNavy-800 border border-slateNavy-800 text-slateNavy-400 hover:text-slateNavy-100 rounded-xl transition"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top KPI Bar */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-2xl p-2.5 text-center">
            <p className="text-[10px] text-slateNavy-400 mb-0.5">الدور النشط</p>
            <p className="text-2xl font-black text-slateNavy-100">
              {currentTicket ? `#${currentTicket.ticket_number}` : '—'}
            </p>
          </div>

          <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-2xl p-2.5 text-center">
            <p className="text-[10px] text-slateNavy-400 mb-0.5">في الانتظار</p>
            <p className="text-2xl font-black text-slateNavy-100">
              {queueState?.totalWaiting || 0}
            </p>
          </div>

          <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-2xl p-2.5 text-center">
            <p className="text-[10px] text-slateNavy-400 mb-0.5">متوسط الخدمة</p>
            <p className="text-2xl font-black text-slateNavy-100">
              {org?.avg_service_mins || 15} <span className="text-xs font-normal text-slateNavy-400">د</span>
            </p>
          </div>
        </div>
      </header>

      {/* Main Active State Control Container (2-Step Presence Confirmation) */}
      <section className="space-y-3 my-2">
        {/* CASE 1: No ticket is active right now */}
        {!currentTicket && (
          <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-5 text-center space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-slateNavy-400 font-medium">القاعة شاغرة حالياً</p>
              <h2 className="text-lg font-bold text-slateNavy-100">جاهز لاستقبال المراجع التالي</h2>
            </div>

            <button
              onClick={handleCallNext}
              disabled={actionLoading || queueState?.totalWaiting === 0}
              className="w-full py-4 px-5 bg-slateNavy-100 hover:bg-white text-slateNavy-950 font-black text-base rounded-2xl flex items-center justify-center gap-2 transition transform active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>استدعاء الرقم التالي (+1)</span>
            </button>
          </div>
        )}

        {/* CASE 2: Ticket has been CALLED (استدعاء - بانتظار دخوله) */}
        {currentTicket && currentTicket.status === 'called' && (
          <div className="bg-slateNavy-900 border-2 border-slateNavy-700 rounded-3xl p-5 space-y-4 shadow-xl">
            {/* Header info */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slateNavy-100 bg-slateNavy-800 border border-slateNavy-700 px-3 py-1 rounded-full animate-pulse">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                مستدعى • بانتظار دخوله
              </span>

              {/* Actions for called ticket */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleRepeatCall}
                  disabled={actionLoading}
                  title="إعادة نداء ورنين الشاشة"
                  className="p-1.5 px-2 bg-sky-950/80 hover:bg-sky-900 border border-sky-600/70 text-sky-200 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                >
                  <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-[10px]">إعادة النداء</span>
                </button>

                {currentTicket.customer_phone && (
                  <>
                    <a
                      href={`tel:${currentTicket.customer_phone}`}
                      title="رنة سريعة Bip"
                      className="p-1.5 bg-slateNavy-800 text-slateNavy-100 hover:bg-slateNavy-700 border border-slateNavy-700 rounded-lg text-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`sms:${currentTicket.customer_phone}?body=تم استدعاء دورك رقم ${currentTicket.ticket_number} لدى ${org?.name}. ننتظر دخولك الآن.`}
                      title="إرسال SMS"
                      className="p-1.5 bg-slateNavy-800 text-slateNavy-100 hover:bg-slateNavy-700 border border-slateNavy-700 rounded-lg text-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Giant Number & Name */}
            <div className="text-center py-1">
              <p className="text-5xl font-black text-slateNavy-100">
                #{currentTicket.ticket_number}
              </p>
              <p className="text-sm font-semibold text-slateNavy-400 mt-1">
                {currentTicket.customer_name || `${sectorLabel} #${currentTicket.ticket_number}`}
              </p>
              <p className="text-xs text-slateNavy-400 mt-0.5">
                نودي عليه وهو في طريقه إلى الباب
              </p>
            </div>

            {/* Two Action Buttons: Confirm Entry OR Smart Hold */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleConfirmEntered}
                disabled={actionLoading}
                className="w-full py-3.5 px-4 bg-slateNavy-100 hover:bg-white text-slateNavy-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 transition transform active:scale-[0.98]"
              >
                <LogIn className="w-4 h-4" />
                <span>تأكيد الدخول (دخل الزبون إلى الداخل)</span>
              </button>

              <button
                onClick={handleSmartHold}
                disabled={actionLoading}
                className="w-full py-2.5 px-4 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 border border-slateNavy-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <PauseCircle className="w-4 h-4 text-amber-400" />
                <span>لم يحضر بعد؟ (تأجيل وحفظ الدور في الأولوية)</span>
              </button>
            </div>
          </div>
        )}

        {/* CASE 3: Ticket is SERVING (بالداخل حالياً) */}
        {currentTicket && currentTicket.status === 'serving' && (
          <div className="bg-slateNavy-900 border-2 border-slateNavy-400 rounded-3xl p-5 space-y-4 shadow-xl">
            {/* Header info */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slateNavy-100 bg-slateNavy-800 border border-slateNavy-700 px-3 py-1 rounded-full">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                بالداخل حالياً • جاري تقديم الخدمة
              </span>
              <span className="text-[11px] text-slateNavy-400">
                الوقت المتوقع: ~{org?.avg_service_mins} د
              </span>
            </div>

            {/* Giant Number & Name */}
            <div className="text-center py-1">
              <p className="text-5xl font-black text-slateNavy-100">
                #{currentTicket.ticket_number}
              </p>
              <p className="text-sm font-semibold text-slateNavy-400 mt-1">
                {currentTicket.customer_name || `${sectorLabel} #${currentTicket.ticket_number}`}
              </p>
              <p className="text-xs text-slateNavy-400 mt-0.5">
                الزبون في الداخل لدى {staffTitle}
              </p>
            </div>

            {/* Two Action Buttons: Exit/Complete OR Complete & Call Next */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleCompleteAndCallNext}
                disabled={actionLoading}
                className="w-full py-3.5 px-4 bg-slateNavy-100 hover:bg-white text-slateNavy-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 transition transform active:scale-[0.98]"
              >
                <LogOut className="w-4 h-4" />
                <span>أنهى الخدمة وخرج + استدعاء التالي فوراً</span>
              </button>

              <button
                onClick={handleCompleteService}
                disabled={actionLoading}
                className="w-full py-2.5 px-4 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 border border-slateNavy-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <span>أنهى الخدمة وخروج الزبون (إفراغ القاعة)</span>
              </button>
            </div>
          </div>
        )}

        {/* Walk-in Ticket Trigger */}
        <button
          onClick={() => {
            setWalkinResult(null);
            setShowWalkinModal(true);
          }}
          className="w-full py-2.5 px-3 bg-slateNavy-900 hover:bg-slateNavy-800 border border-slateNavy-800 text-slateNavy-100 font-semibold rounded-2xl flex items-center justify-center gap-1.5 text-xs transition"
        >
          <UserPlus className="w-4 h-4 text-slateNavy-400" />
          <span>+ تذكرة حضورية (بدون هاتف / هاتف حطبة)</span>
        </button>
      </section>

      {/* Held Priority Box (أدوار مجمدة محفوظة) */}
      {queueState?.heldTickets && queueState.heldTickets.length > 0 && (
        <section className="my-2 p-3 bg-slateNavy-900 border border-slateNavy-800 rounded-2xl">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slateNavy-800">
            <span className="text-xs font-bold text-slateNavy-100 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              أدوار محفوظة مؤقتاً ({queueState.heldTickets.length})
            </span>
            <span className="text-[10px] text-slateNavy-400">أولوية الدخول فور الحضور</span>
          </div>

          <div className="space-y-2">
            {queueState.heldTickets.map((t) => (
              <div 
                key={t.id} 
                className={`bg-slateNavy-950 border rounded-xl p-2.5 flex items-center justify-between gap-2 transition ${
                  t.is_present 
                    ? 'border-emerald-400/80 bg-emerald-950/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]' 
                    : 'border-slateNavy-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slateNavy-100">#{t.ticket_number}</span>
                    <span className="text-xs font-semibold text-slateNavy-400">
                      {t.customer_name || sectorLabel}
                    </span>
                    {t.is_present && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded-full font-bold animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        حاضر في القاعة!
                      </span>
                    )}
                  </div>
                  {t.customer_phone && (
                    <span className="text-[10px] text-slateNavy-400">{t.customer_phone}</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {t.customer_phone && (
                    <a
                      href={`tel:${t.customer_phone}`}
                      title="رنة سريعة Bip"
                      className="p-1.5 bg-slateNavy-800 text-slateNavy-100 border border-slateNavy-700 rounded-lg text-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    onClick={() => handleRecallHeld(t.id)}
                    className={`py-1.5 px-3 border font-black text-xs rounded-xl transition flex items-center gap-1 ${
                      t.is_present
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400 shadow-lg'
                        : 'bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 border-slateNavy-700'
                    }`}
                  >
                    <span>استدعاء الآن</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Queue List */}
      <section className="flex-1 overflow-y-auto space-y-2 my-2">
        <div className="flex items-center justify-between text-xs text-slateNavy-400 px-1">
          <span>قائمة الانتظار القادمة</span>
          <span>{queueState?.waitingTickets.length || 0} في الطابور</span>
        </div>

        {queueState?.waitingTickets.length === 0 ? (
          <div className="p-6 text-center bg-slateNavy-900/60 border border-dashed border-slateNavy-800 rounded-2xl">
            <CheckCircle className="w-6 h-6 text-slateNavy-700 mx-auto mb-1.5" />
            <p className="text-xs text-slateNavy-400 font-medium">قاعة الانتظار فارغة حالياً</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {queueState?.waitingTickets.map((t, idx) => (
              <div
                key={t.id}
                className="bg-slateNavy-900 border border-slateNavy-800 rounded-xl p-2.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slateNavy-800 text-slateNavy-400 font-mono text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-slateNavy-100">#{t.ticket_number}</span>
                      <span className="text-xs text-slateNavy-400">
                        {t.customer_name || `${sectorLabel} #${t.ticket_number}`}
                      </span>
                      {t.ticket_type === 'walkin' && (
                        <span className="text-[9px] bg-slateNavy-800 border border-slateNavy-700 text-slateNavy-400 px-1.5 py-0.2 rounded">
                          حضوري
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slateNavy-400">
                      الدخول المتوقع: {t.estimated_clock_time} (~{t.estimated_wait_mins} د)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDirectCall(t.id, t.ticket_number)}
                    title="استدعاء هذا المراجع مباشرة الآن (حالة مستعجلة)"
                    className="py-1 px-2.5 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-200 hover:text-white border border-slateNavy-700 text-[11px] font-bold rounded-lg transition"
                  >
                    استدعاء
                  </button>

                  {t.customer_phone ? (
                    <div className="flex items-center gap-1">
                      <a
                        href={`tel:${t.customer_phone}`}
                        title="رنة سريعة Bip"
                        className="p-1.5 bg-slateNavy-800 hover:bg-slateNavy-700 border border-slateNavy-700 text-slateNavy-100 rounded-lg transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`sms:${t.customer_phone}?body=تنبيه: اقترب دورك رقم ${t.ticket_number} لدى ${org?.name}. يرجى التوجه للقاعة الآن.`}
                        title="رسالة SMS"
                        className="p-1.5 bg-slateNavy-800 hover:bg-slateNavy-700 border border-slateNavy-700 text-slateNavy-100 rounded-lg transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : null}

                  <button
                    onClick={() => handleCancelTicket(t.id, t.ticket_number)}
                    title="إلغاء التذكرة"
                    className="p-1.5 text-slateNavy-700 hover:text-rose-400 rounded-lg transition"
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
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slateNavy-950/95 backdrop-blur border-t border-slateNavy-800 px-4 py-3 flex items-center justify-between z-10">
        <button
          onClick={handleResetQueue}
          className="text-xs text-slateNavy-400 hover:text-rose-400 flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>تصفير ليوم جديد</span>
        </button>

        <div className="flex items-center gap-3">
          <Link
            href={`/display/${slug}`}
            target="_blank"
            className="text-xs text-slateNavy-400 hover:text-slateNavy-100 flex items-center gap-1 transition"
            title="فتح شاشة التلفاز التفاعلية في الصالة"
          >
            <Tv className="w-3.5 h-3.5 text-slateNavy-400" />
            <span>شاشة الصالة</span>
          </Link>

          <Link
            href={`/q/${slug}`}
            target="_blank"
            className="text-xs text-slateNavy-100 hover:underline font-medium flex items-center gap-1 transition"
          >
            <span>معاينة الزبون</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
      </footer>

      {/* Modal 1: Walk-in Ticket Creator */}
      {showWalkinModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slateNavy-800">
              <h3 className="text-base font-bold text-slateNavy-100 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-slateNavy-400" />
                تذكرة حضورية (هاتف حطبة / بدون هاتف)
              </h3>
              <button onClick={() => setShowWalkinModal(false)} className="text-slateNavy-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {walkinResult ? (
              <div className="text-center space-y-3 py-2">
                <div className="w-12 h-12 bg-slateNavy-800 border border-slateNavy-700 text-slateNavy-100 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                
                <div className="bg-slateNavy-950 border border-slateNavy-800 rounded-2xl p-4">
                  <p className="text-xs text-slateNavy-400 mb-1 font-medium">أبلغ الزبون بالعبارة التالية:</p>
                  <p className="text-4xl font-black text-slateNavy-100 mb-1">
                    رقمك #{walkinResult.ticket_number}
                  </p>
                  <p className="text-sm font-bold text-slateNavy-100">
                    ارجع على الساعة <span className="text-white text-lg font-black">{walkinResult.estimated_clock_time}</span>
                  </p>
                  <p className="text-[11px] text-slateNavy-400 mt-2">
                    (مدة الانتظار التقريبية: {walkinResult.estimated_wait_mins} دقيقة)
                  </p>
                </div>

                <button
                  onClick={() => {
                    setWalkinResult(null);
                    setShowWalkinModal(false);
                  }}
                  className="w-full py-2.5 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 rounded-xl text-xs font-bold transition"
                >
                  إغلاق ومتابعة الطابور
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateWalkin} className="space-y-3">
                <p className="text-xs text-slateNavy-400">
                  سجل الزبون وسيحسب النظام فوراً توقيت عودته التقريبي لإفراغ القاعة.
                </p>

                <div>
                  <label className="block text-xs text-slateNavy-400 font-semibold mb-1">
                    اسم {sectorLabel} (اختياري)
                  </label>
                  <input
                    type="text"
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    placeholder="مثال: صالح..."
                    className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-sm text-slateNavy-100 focus:outline-none focus:border-slateNavy-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slateNavy-400 font-semibold mb-1">
                    رقم الهاتف (إجباري لإجراء رنة Bip أو SMS) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    minLength={8}
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    placeholder="05 / 06 / 07..."
                    className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-sm text-slateNavy-100 focus:outline-none focus:border-slateNavy-400 text-left dir-ltr"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreatingWalkin}
                  className="w-full py-3 bg-slateNavy-100 hover:bg-white text-slateNavy-950 font-bold rounded-xl text-sm transition disabled:opacity-50"
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
          <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slateNavy-800">
              <h3 className="text-base font-bold text-slateNavy-100 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-slateNavy-400" />
                إنتاجية وإحصائيات اليوم
              </h3>
              <button onClick={() => setShowStatsModal(false)} className="text-slateNavy-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slateNavy-950 p-3 rounded-2xl border border-slateNavy-800 text-center">
                <p className="text-[10px] text-slateNavy-400">إجمالي التذاكر اليوم</p>
                <p className="text-2xl font-black text-slateNavy-100 mt-1">
                  {queueState?.stats?.totalIssued || 0}
                </p>
              </div>

              <div className="bg-slateNavy-950 p-3 rounded-2xl border border-slateNavy-800 text-center">
                <p className="text-[10px] text-slateNavy-400">الخدمات المكتملة</p>
                <p className="text-2xl font-black text-slateNavy-100 mt-1">
                  {queueState?.stats?.totalCompleted || 0}
                </p>
              </div>

              <div className="bg-slateNavy-950 p-3 rounded-2xl border border-slateNavy-800 text-center">
                <p className="text-[10px] text-slateNavy-400">أدوار مجمدة (Hold)</p>
                <p className="text-2xl font-black text-slateNavy-100 mt-1">
                  {queueState?.stats?.totalHeld || 0}
                </p>
              </div>

              <div className="bg-slateNavy-950 p-3 rounded-2xl border border-slateNavy-800 text-center">
                <p className="text-[10px] text-slateNavy-400">تذاكر ملغاة</p>
                <p className="text-2xl font-black text-slateNavy-100 mt-1">
                  {queueState?.stats?.totalCancelled || 0}
                </p>
              </div>
            </div>

            <div className="bg-slateNavy-950 p-3 rounded-2xl border border-slateNavy-800 text-center">
              <p className="text-[11px] text-slateNavy-400">متوسط وتيرة الخدمة الحالية</p>
              <p className="text-xl font-bold text-slateNavy-100 mt-0.5">
                {org?.avg_service_mins} دقيقة لكل {sectorLabel}
              </p>
            </div>

            {/* Customer Satisfaction Ratings */}
            <div className="bg-slateNavy-950 p-3 rounded-2xl border border-slateNavy-800 text-center space-y-2">
              <p className="text-[11px] font-semibold text-slateNavy-400">تقييمات رضا الزبائن</p>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-2 bg-slateNavy-900 rounded-xl border border-slateNavy-800">
                  <span className="text-lg">😄</span>
                  <p className="text-xs font-bold text-slateNavy-100 mt-0.5">
                    {queueState?.stats?.ratings?.great || 0}
                  </p>
                  <p className="text-[9px] text-slateNavy-400">ممتازة</p>
                </div>
                <div className="p-2 bg-slateNavy-900 rounded-xl border border-slateNavy-800">
                  <span className="text-lg">😐</span>
                  <p className="text-xs font-bold text-slateNavy-100 mt-0.5">
                    {queueState?.stats?.ratings?.okay || 0}
                  </p>
                  <p className="text-[9px] text-slateNavy-400">عادية</p>
                </div>
                <div className="p-2 bg-slateNavy-900 rounded-xl border border-slateNavy-800">
                  <span className="text-lg">🙁</span>
                  <p className="text-xs font-bold text-slateNavy-100 mt-0.5">
                    {queueState?.stats?.ratings?.bad || 0}
                  </p>
                  <p className="text-[9px] text-slateNavy-400">تحتاج تحسين</p>
                </div>
              </div>
              <p className="text-[10px] text-slateNavy-400">
                إجمالي التقييمات: {((queueState?.stats?.ratings?.great || 0) + (queueState?.stats?.ratings?.okay || 0) + (queueState?.stats?.ratings?.bad || 0))}
              </p>
            </div>

            <button
              onClick={handleExportCsv}
              disabled={isExporting}
              className="w-full py-2.5 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slateNavy-700 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{isExporting ? 'جاري تجهيز الملف...' : 'تصدير تقرير اليوم (ملف Excel / CSV)'}</span>
            </button>

            <button
              onClick={() => setShowStatsModal(false)}
              className="w-full py-2.5 bg-slateNavy-950 hover:bg-slateNavy-800 text-slateNavy-300 rounded-xl text-xs font-bold transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Modal 3: Settings & Service Speed & PIN */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slateNavy-800">
              <h3 className="text-base font-bold text-slateNavy-100 flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-slateNavy-400" />
                إعدادات العيادة وسرعة الطابور
              </h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slateNavy-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slateNavy-400 font-semibold mb-1">
                  متوسط وقت خدمة كل {sectorLabel} (بالدقائق)
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={newAvgMins}
                  onChange={(e) => setNewAvgMins(Number(e.target.value))}
                  className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-base text-slateNavy-100 text-center font-bold focus:outline-none focus:border-slateNavy-400"
                />
                <p className="text-[10px] text-slateNavy-400 mt-1">
                  يستخدم لحساب وقت الانتظار التقديري لكل زبون فور حجزه.
                </p>
              </div>

              {/* Feature 1: Daily Capacity / Quota Limit */}
              <div className="pt-3 border-t border-slateNavy-800">
                <label className="block text-xs text-slateNavy-300 font-semibold mb-1 flex items-center justify-between">
                  <span>سقف التذاكر اليومي (Daily Quota)</span>
                  <span className="text-[10px] text-slateNavy-400">
                    {dailyMaxTickets === 0 ? 'غير محدود' : `${dailyMaxTickets} تذكرة`}
                  </span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={dailyMaxTickets}
                  onChange={(e) => setDailyMaxTickets(Number(e.target.value))}
                  className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-sm text-slateNavy-100 text-center font-bold focus:outline-none focus:border-slateNavy-400"
                />
                <p className="text-[10px] text-slateNavy-400 mt-1">
                  اكتب 0 لحجوزات غير محدودة، أو حدد رقماً ليقفل الحجز عن بعد تلقائياً عند بلوغه.
                </p>
              </div>

              {/* Feature 2: Operating Hours & Auto Schedule */}
              <div className="pt-3 border-t border-slateNavy-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slateNavy-300 font-semibold flex items-center gap-1.5 cursor-pointer">
                    <Clock className="w-3.5 h-3.5 text-slateNavy-400" />
                    <span>جدول ساعات العمل الآلي</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAutoScheduleEnabled(!autoScheduleEnabled)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      autoScheduleEnabled ? 'bg-emerald-500' : 'bg-slateNavy-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        autoScheduleEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {autoScheduleEnabled && (
                  <div className="p-2.5 bg-slateNavy-950 border border-slateNavy-800 rounded-xl space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-right">
                      <div>
                        <label className="block text-[10px] text-slateNavy-400 mb-0.5">وقت بدء الدوام</label>
                        <input
                          type="time"
                          value={workStartTime}
                          onChange={(e) => setWorkStartTime(e.target.value)}
                          className="w-full bg-slateNavy-900 border border-slateNavy-800 rounded-lg px-2 py-1 text-xs text-slateNavy-100 focus:outline-none text-center font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slateNavy-400 mb-0.5">وقت نهاية الدوام</label>
                        <input
                          type="time"
                          value={workEndTime}
                          onChange={(e) => setWorkEndTime(e.target.value)}
                          className="w-full bg-slateNavy-900 border border-slateNavy-800 rounded-lg px-2 py-1 text-xs text-slateNavy-100 focus:outline-none text-center font-mono"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-slateNavy-400 leading-relaxed">
                      يقفل الحجز تلقائياً خارج هذه الساعات (الدوام من {workStartTime} إلى {workEndTime}) وفي أيام العطلة.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slateNavy-800">
                <label className="block text-xs text-slateNavy-300 font-semibold mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slateNavy-400" />
                  <span>تغيير الرمز السري (PIN) للدخول</span>
                </label>
                <input
                  type="password"
                  placeholder="اتركه فارغاً للإبقاء على الرمز الحالي"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-xs text-slateNavy-100 focus:outline-none focus:border-slateNavy-400"
                />
                <p className="text-[10px] text-slateNavy-400 mt-1">
                  الرمز الحالي: <span className="font-mono text-slateNavy-200">{queueState?.organization.pin_code}</span>
                </p>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full py-2.5 bg-slateNavy-100 hover:bg-white text-slateNavy-950 font-bold rounded-xl text-xs transition"
              >
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Ultra-Minimal Luxury A4 Stand Poster Preview & Print */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slateNavy-900 text-slateNavy-100 border border-slateNavy-800 rounded-3xl p-4 sm:p-6 w-full max-w-2xl shadow-2xl my-auto space-y-4 max-h-[96vh] flex flex-col">
            
            {/* Modal Header (Hidden on Print) */}
            <div className="no-print flex items-center justify-between pb-3 border-b border-slateNavy-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slateNavy-850 border border-slateNavy-800 flex items-center justify-center text-slateNavy-100 shadow-sm">
                  <QrCode className="w-4 h-4 text-slateNavy-300" />
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-bold text-slateNavy-100">
                    معاينة ملصق الطاولة أو الحائط (ستاند A4)
                  </h3>
                  <p className="text-[11px] text-slateNavy-400 font-medium">
                    تصميم Apple / Nordic فائق النقاء بدقة طباعة 300DPI جاهز فوراً
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="p-1.5 rounded-xl text-slateNavy-400 hover:text-slateNavy-100 hover:bg-slateNavy-850 transition"
                aria-label="إغلاق المعاينة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Preview Controls Toolbar (Hidden on Print) */}
            <div className="no-print bg-slateNavy-950 border border-slateNavy-800 rounded-2xl p-3 sm:p-3.5 space-y-3 shrink-0 text-right">
              
              {/* Row 1: Logo Upload & Style Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                
                {/* Logo Upload / Remove Button */}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {!clinicLogo ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slateNavy-900 hover:bg-slateNavy-850 text-slateNavy-200 border border-slateNavy-800 text-xs font-bold transition shadow-sm active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5 text-slateNavy-400" />
                      <span>رفع شعار العيادة</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
                        <CheckCircle className="w-3.5 h-3.5" />
                        تم إدراج الشعار
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-bold transition active:scale-95"
                        title="إزالة الشعار المرفوع"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>إزالة</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Style Switcher Toggle */}
                <div className="flex items-center gap-1 bg-slateNavy-900 border border-slateNavy-800 p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => handleToggleStyle('pure-white')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      standStyle === 'pure-white'
                        ? 'bg-slateNavy-800 text-slateNavy-100 shadow-sm font-bold'
                        : 'text-slateNavy-400 hover:text-slateNavy-200'
                    }`}
                  >
                    أبيض نقي (الهوية)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleStyle('charcoal')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      standStyle === 'charcoal'
                        ? 'bg-slateNavy-800 text-slateNavy-100 shadow-sm font-bold'
                        : 'text-slateNavy-400 hover:text-slateNavy-200'
                    }`}
                  >
                    ترويسة فحمية (#313c45)
                  </button>
                </div>

              </div>

              {/* Row 2: Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slateNavy-850">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-slateNavy-100 hover:bg-white text-slateNavy-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة / حفظ A4 PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="w-full sm:w-auto py-2.5 px-4 bg-slateNavy-900 hover:bg-slateNavy-850 text-slateNavy-200 border border-slateNavy-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
                >
                  <Download className="w-4 h-4 text-slateNavy-400" />
                  <span>تحميل كود QR</span>
                </button>
              </div>

            </div>

            {/* Scrollable Live A4 Preview Wrapper */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 flex justify-center items-center bg-slateNavy-950/60 rounded-2xl border border-slateNavy-800/60 min-h-[460px]">
              
              {/* =========================================================================
                  ULTRA-MINIMAL LUXURY A4 STAND POSTER (#printable-stand)
                  Exact Millimeter Print Spec (210mm x 297mm) | Pure White #ffffff
                  ========================================================================= */}
              <div
                id="printable-stand"
                className="w-full max-w-[440px] aspect-[210/297] bg-[#ffffff] text-slate-900 shadow-2xl rounded-2xl border border-slate-200/90 p-6 sm:p-10 flex flex-col justify-between items-center text-center transition-all relative overflow-hidden select-none"
                style={{ backgroundColor: '#ffffff' }}
              >
                
                {/* 1. TOP SECTION (BRAND LOCKUP + CLINIC NAME) */}
                <div className="stand-top-section w-full flex flex-col items-center justify-center shrink-0">
                  {standStyle === 'charcoal' ? (
                    <div className="w-full bg-[#313c45] text-[#f8fafc] py-4 sm:py-5 px-6 rounded-2xl shadow-sm mb-3 sm:mb-4 flex flex-col items-center justify-center space-y-1">
                      <div className="stand-brand-lockup flex items-center justify-center gap-4 sm:gap-5" dir="ltr">
                        {clinicLogo && (
                          <>
                            <img
                              src={clinicLogo}
                              alt="شعار المؤسسة"
                              className="stand-clinic-logo h-8 sm:h-10 max-w-[100px] object-contain brightness-0 invert"
                            />
                            <div className="stand-logo-divider h-6 sm:h-7 w-[1px] bg-[#778ca4]/50" />
                          </>
                        )}
                        <svg className="stand-ticket-svg w-[32px] h-[20px] sm:w-[36px] sm:h-[23px] shrink-0" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="NextDZ Queue Ticket Logo">
                          <path d="M4 4H60V14C56.686 14 54 16.686 54 20C54 23.314 56.686 26 60 26V36H4V26C7.314 26 10 23.314 10 20C10 16.686 7.314 14 4 14V4Z" stroke="#ffffff" strokeWidth="3.5" strokeLinejoin="round" fill="#313c45"/>
                          <path d="M16 12H36L45 20L36 28H16L22 20L16 12Z" fill="#778ca4" fillOpacity="0.4"/>
                          <path d="M18 20H40M40 20L32 12.5M40 20L32 27.5" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="stand-brand-wordmark text-2xl sm:text-3xl font-bold tracking-tight">
                          <span className="text-white">Next</span>
                          <span style={{ color: '#778ca4' }}>DZ</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="stand-brand-lockup flex items-center justify-center gap-4 sm:gap-5 pt-1 sm:pt-2" dir="ltr">
                      {clinicLogo && (
                        <>
                          <img
                            src={clinicLogo}
                            alt="شعار المؤسسة"
                            className="stand-clinic-logo h-8 sm:h-10 max-w-[100px] object-contain"
                          />
                          <div className="stand-logo-divider h-6 sm:h-7 w-[1px] bg-[#b3bfcb]" />
                        </>
                      )}
                      <svg className="stand-ticket-svg w-[34px] h-[22px] sm:w-[38px] sm:h-[24px] shrink-0" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="NextDZ Queue Ticket Logo">
                        <path d="M4 4H60V14C56.686 14 54 16.686 54 20C54 23.314 56.686 26 60 26V36H4V26C7.314 26 10 23.314 10 20C10 16.686 7.314 14 4 14V4Z" stroke="#313c45" strokeWidth="3.5" strokeLinejoin="round" fill="#eef1f5"/>
                        <path d="M16 12H36L45 20L36 28H16L22 20L16 12Z" fill="#778ca4" fillOpacity="0.35"/>
                        <path d="M18 20H40M40 20L32 12.5M40 20L32 27.5" stroke="#313c45" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="stand-brand-wordmark text-2xl sm:text-3xl font-bold tracking-tight">
                        <span style={{ color: '#313c45' }}>Next</span>
                        <span style={{ color: '#778ca4' }}>DZ</span>
                      </span>
                    </div>
                  )}

                  {/* Clinic Name (org.name) */}
                  <h2 className="stand-clinic-name text-xl sm:text-2xl font-bold tracking-normal text-[#4f6271] mt-2.5 sm:mt-3">
                    {queueState?.organization.name || org?.name || 'العيادة الطبية'}
                  </h2>
                </div>

                {/* 2. MIDDLE SECTION (HEADLINE + COMMANDING QR CODE GROUPED TOGETHER) */}
                <div className="stand-middle-group w-full flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto shrink-0">
                  <h1 className="stand-headline text-3xl sm:text-4xl font-bold tracking-tight text-[#313c45] leading-tight">
                    امسح الكود واحجز دورك
                  </h1>

                  <div className="stand-qr-container flex flex-col items-center justify-center">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="رمز QR لحجز التذكرة"
                        className="stand-qr-img w-48 h-48 sm:w-56 sm:h-56 object-contain select-none"
                      />
                    ) : (
                      <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center text-xs text-[#778ca4]">
                        جاري إنشاء الرمز بدقة عالية...
                      </div>
                    )}
                    <span className="stand-short-url mt-2 text-[10px] sm:text-[11px] font-mono font-medium text-[#778ca4] tracking-tight dir-ltr select-all whitespace-nowrap">
                      smart-queue-system-zeta.vercel.app/q/{slug}
                    </span>
                  </div>
                </div>

                {/* 3. BOTTOM SECTION (ANCHORED SLOGAN WITH HAIRLINE — GUARANTEED PAGE 1) */}
                <div className="stand-bottom-section w-full flex flex-col items-center justify-center shrink-0">
                  <div className="stand-hairline w-10 sm:w-12 h-[1px] bg-[#d5dbe2] mb-2 sm:mb-2.5 mx-auto" />
                  <p className="stand-slogan text-xs sm:text-sm font-medium text-[#4f6271] tracking-wide">
                    قاعة هادئة، سكرتيرة مرتاحة، زبائن راضون
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}
    </main>
  </div>
);
}
