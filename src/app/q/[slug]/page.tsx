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
  Phone, 
  User, 
  RefreshCw, 
  Share2, 
  Check,
  DoorOpen,
  UserCheck,
  Bell,
  Search,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { QueueState, FeedbackRating } from '@/lib/types';
import { playQueueChime } from '@/lib/audio';
import { speakArabicAnnouncement } from '@/lib/speech';
import { 
  requestScreenWakeLock, 
  releaseScreenWakeLock, 
  requestNotificationPermission, 
  sendBrowserNotification 
} from '@/lib/notifications';
import ThemeToggle from '@/components/ThemeToggle';

interface CachedTicket {
  ticketId?: number;
  ticketNumber: number;
  orgSlug: string;
  orgName: string;
  sectorLabel: string;
  estimatedTargetTimestamp: number;
  initialEstimatedClockTime: string;
  customerName?: string;
  customerPhone?: string;
  totalEstimatedSeconds?: number;
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
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recovery modal / input
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Active ticket in localStorage
  const [myTicket, setMyTicket] = useState<CachedTicket | null>(null);

  // Offline status & timer
  const [isOnline, setIsOnline] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [earlyProximityAlertTriggered, setEarlyProximityAlertTriggered] = useState(false);
  const [calledSpoken, setCalledSpoken] = useState(false);
  const [completionNotified, setCompletionNotified] = useState(false);
  const [copied, setCopied] = useState(false);

  // Manual refresh button states
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');

  // Queue progression tracker to prevent resetting countdown on page refresh
  const prevPeopleAheadRef = useRef<number | null>(null);

  // Notifications & Wake Lock state
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);

  // Feedback state
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // Load cached ticket on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const stored = localStorage.getItem(`smart_queue_ticket_${slug}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as CachedTicket;
          // Auto-clean tickets older than 20 hours (from yesterday/previous sessions)
          if (parsed.createdAt && Date.now() - parsed.createdAt > 20 * 60 * 60 * 1000) {
            localStorage.removeItem(`smart_queue_ticket_${slug}`);
            localStorage.removeItem(`smart_queue_feedback_${slug}`);
          } else {
            setMyTicket(parsed);
            // Immediately compute remaining seconds from persisted target timestamp!
            if (parsed.estimatedTargetTimestamp) {
              const diffMs = parsed.estimatedTargetTimestamp - Date.now();
              const leftSecs = Math.max(0, Math.floor(diffMs / 1000));
              setRemainingSeconds(leftSecs);
            }
          }
        } catch (e) {
          console.error('Failed to parse cached ticket', e);
        }
      }

      const storedFeedback = localStorage.getItem(`smart_queue_feedback_${slug}`);
      if (storedFeedback) {
        setFeedbackSubmitted(true);
      }

      if ('Notification' in window && Notification.permission === 'granted') {
        setNotificationsAllowed(true);
      }

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        releaseScreenWakeLock();
      };
    }
  }, [slug]);

  // Fetch queue state from server
  const fetchState = async (forceBust = false) => {
    try {
      const cacheBuster = forceBust ? `&_t=${Date.now()}` : '';
      const ticketParam = myTicket?.ticketNumber 
        ? `?ticketNumber=${myTicket.ticketNumber}&ticketId=${myTicket.ticketId || ''}${cacheBuster}` 
        : forceBust ? `?_t=${Date.now()}` : '';
      const res = await fetch(`/api/organizations/${slug}${ticketParam}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
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

  // Manual tactile refresh handler with haptic vibration and Algiers timestamp
  const handleManualRefresh = async () => {
    if (isManualRefreshing) return;
    setIsManualRefreshing(true);
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(35); } catch {}
      }
      await fetchState(true);
      setJustUpdated(true);
      const algeriaTime = new Date().toLocaleTimeString('ar-DZ', {
        timeZone: 'Africa/Algiers',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setLastUpdatedTime(algeriaTime);
      setTimeout(() => setJustUpdated(false), 2500);
    } finally {
      setTimeout(() => setIsManualRefreshing(false), 450);
    }
  };

  const org = queueState?.organization;
  const sectorLabel = org?.sector_label || 'زبون';
  const staffTitle = org?.staff_title || 'المسير';
  const activeCurrent = queueState?.currentTicket;

  // Determine ticket real presence status
  const isHeldForMe = Boolean(
    myTicket && (
      queueState?.myTicketStatus === 'held' ||
      queueState?.heldTickets?.some(t => t.ticket_number === myTicket.ticketNumber)
    )
  );

  const isCancelledForMe = Boolean(
    myTicket && queueState?.myTicketStatus === 'cancelled'
  );

  let isMyTurnCalled = false;
  let isMyTurnInside = false;
  let isCompletedForMe = false;
  let livePeopleAhead = 0;

  if (myTicket && !isHeldForMe && !isCancelledForMe) {
    if (queueState?.myTicketStatus === 'completed') {
      isCompletedForMe = true;
    } else if (activeCurrent && activeCurrent.ticket_number === myTicket.ticketNumber) {
      if (activeCurrent.status === 'called') {
        isMyTurnCalled = true;
      } else if (activeCurrent.status === 'serving') {
        isMyTurnInside = true;
      }
    } else {
      // If not currently called or serving, check waiting position in queue
      const waitingList = queueState?.waitingTickets || [];
      const myIdx = waitingList.findIndex(t => t.ticket_number === myTicket.ticketNumber);
      if (myIdx >= 0) {
        livePeopleAhead = myIdx + 1;
      }
    }
  }

  // Dynamic live estimated arrival clock time (anchored to ticket's target timestamp in Algeria timezone)
  const liveEstimatedClockTime = (myTicket && livePeopleAhead > 0 && !isMyTurnCalled && !isMyTurnInside)
    ? (Date.now() >= myTicket.estimatedTargetTimestamp
        ? 'أي لحظة الآن'
        : new Date(myTicket.estimatedTargetTimestamp).toLocaleTimeString('ar-DZ', {
            timeZone: 'Africa/Algiers',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
      )
    : myTicket?.initialEstimatedClockTime || 'دورك القادم';

  // Adaptive Smart Polling (Cuts 80% traffic, protects battery, refreshes instantly on screen wake)
  useEffect(() => {
    fetchState();

    const getPollingInterval = () => {
      if (typeof document !== 'undefined' && document.hidden) return 12000; // Background / Screen locked
      if (isMyTurnCalled) return 2500; // Active call: rapid sync
      if (livePeopleAhead <= 2 && livePeopleAhead > 0) return 3000; // Proximity zone: 3s
      if (myTicket) return 5000; // Waiting in queue: 5s
      return 7000; // Initial booking screen: 7s
    };

    let intervalId: NodeJS.Timeout;
    const scheduleNext = () => {
      intervalId = setTimeout(() => {
        if (navigator.onLine) {
          fetchState();
        }
        scheduleNext();
      }, getPollingInterval());
    };
    scheduleNext();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        fetchState(); // Instant fresh update the second user unlocks their phone!
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [slug, myTicket?.ticketNumber, isMyTurnCalled, livePeopleAhead]);

  // Autonomous Countdown Timer (anchored to persisted target timestamp)
  useEffect(() => {
    if (!myTicket?.estimatedTargetTimestamp) return;

    const updateRemaining = () => {
      const now = Date.now();
      const diffMs = myTicket.estimatedTargetTimestamp - now;
      const secondsLeft = Math.max(0, Math.floor(diffMs / 1000));
      setRemainingSeconds(secondsLeft);

      if (secondsLeft > 0 && secondsLeft <= 600 && !alertTriggered) {
        playQueueChime();
        sendBrowserNotification(
          `اقترب دورك (#${myTicket.ticketNumber})`,
          'بقي حوالي 10 دقائق على دورك. يرجى التوجه لمحيط القاعة.'
        );
        setAlertTriggered(true);
      }
    };

    updateRemaining();
    const timer = setInterval(updateRemaining, 1000);

    return () => clearInterval(timer);
  }, [myTicket?.ticketNumber, myTicket?.estimatedTargetTimestamp, alertTriggered]);

  // Synchronize target timestamp ONLY when the queue progression actually changes (e.g. someone is called)
  useEffect(() => {
    if (!myTicket || livePeopleAhead <= 0 || isMyTurnCalled || isMyTurnInside) return;

    // On initial mount / page refresh: anchor current people ahead without resetting the existing timer
    if (prevPeopleAheadRef.current === null) {
      prevPeopleAheadRef.current = livePeopleAhead;
      return;
    }

    // Recalibrate ONLY when the queue actually moves forward (number of people ahead changes)
    if (prevPeopleAheadRef.current !== livePeopleAhead) {
      const avgMins = org?.avg_service_mins || 15;
      const newWaitMins = Math.max(1, livePeopleAhead * avgMins);
      const newTarget = Date.now() + newWaitMins * 60 * 1000;

      const updatedTicket: CachedTicket = {
        ...myTicket,
        estimatedTargetTimestamp: newTarget,
        totalEstimatedSeconds: newWaitMins * 60,
      };

      setMyTicket(updatedTicket);
      try {
        localStorage.setItem(`smart_queue_ticket_${slug}`, JSON.stringify(updatedTicket));
      } catch (e) {
        console.error('Failed to sync ticket to localStorage', e);
      }

      setRemainingSeconds(newWaitMins * 60);
      prevPeopleAheadRef.current = livePeopleAhead;
    }
  }, [livePeopleAhead, org?.avg_service_mins, isMyTurnCalled, isMyTurnInside, myTicket, slug]);

  // Voice announcement when customer is called
  useEffect(() => {
    if (isMyTurnCalled && !calledSpoken) {
      playQueueChime();
      speakArabicAnnouncement(`الرقم ${myTicket?.ticketNumber}، تفضل بالدخول عند ${staffTitle} الآن`);
      sendBrowserNotification(
        `دورك الآن! (#${myTicket?.ticketNumber})`,
        `تفضل بالدخول عند ${staffTitle} فوراً.`
      );
      setCalledSpoken(true);
    }
  }, [isMyTurnCalled, calledSpoken, myTicket, staffTitle]);

  // Reset calledSpoken when not called (e.g. held or waiting) so future recalls ring again
  useEffect(() => {
    if (!isMyTurnCalled && calledSpoken) {
      setCalledSpoken(false);
    }
  }, [isMyTurnCalled, calledSpoken]);

  // Field Feature: Early Proximity Warning (when at most 2 people ahead)
  useEffect(() => {
    if (myTicket && livePeopleAhead <= 2 && livePeopleAhead > 0 && !earlyProximityAlertTriggered && !isMyTurnCalled && !isMyTurnInside && !isCompletedForMe) {
      playQueueChime();
      sendBrowserNotification(
        `⚠️ تنبيه عاجل: اقترب دورك (#${myTicket.ticketNumber})`,
        `بقي أمامك ${livePeopleAhead === 1 ? 'شخص واحد فقط' : 'شخصان فقط'}. يرجى التوجه إلى القاعة الآن لتفادي فوات دورك.`
      );
      setEarlyProximityAlertTriggered(true);
    }
  }, [livePeopleAhead, myTicket, earlyProximityAlertTriggered, isMyTurnCalled, isMyTurnInside, isCompletedForMe]);

  // Automatic Queue Exit & Completion Chime
  useEffect(() => {
    if (isCompletedForMe && !completionNotified) {
      playQueueChime();
      speakArabicAnnouncement(`شكراً لك، اكتملت خدمتك وتفضل بمغادرة القاعة. نرجو تقييم تجربتك.`);
      sendBrowserNotification(
        '✓ انتهت خدمتك بنجاح',
        'شكراً لزيارتك! لقد خرجت من الطابور تلقائياً، يمكنك تقييم الخدمة بنقرة واحدة.'
      );
      releaseScreenWakeLock();
      setCompletionNotified(true);
    }
  }, [isCompletedForMe, completionNotified]);

  // Request notifications and screen wake lock
  const handleEnableAlertsAndWakeLock = async () => {
    const notif = await requestNotificationPermission();
    setNotificationsAllowed(notif);

    const wake = await requestScreenWakeLock();
    setWakeLockActive(wake);

    if (notif || wake) {
      playQueueChime();
      sendBrowserNotification(
        '✓ تم تفعيل التنبيهات وتثبيت الشاشة',
        `سننبهك برنة وإشعار عند اقتراب دورك رقم #${myTicket?.ticketNumber}`
      );
    }
  };

  // Handle Book Ticket with Mandatory Phone
  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setFormError('رقم الهاتف إجباري (8 أرقام على الأقل) لضمان متابعة دورك واستلام التنبيهات');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgSlug: slug,
          customerName: name,
          customerPhone: cleanPhone,
          ticketType: 'qr',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const ticket = json.data;
        const targetTimestamp = Date.now() + ticket.estimated_wait_mins * 60 * 1000;
        const cached: CachedTicket = {
          ticketId: ticket.id,
          ticketNumber: ticket.ticket_number,
          orgSlug: slug,
          orgName: queueState?.organization.name || 'المؤسسة',
          sectorLabel: queueState?.organization.sector_label || 'زبون',
          estimatedTargetTimestamp: targetTimestamp,
          initialEstimatedClockTime: ticket.estimated_clock_time,
          customerName: name || undefined,
          customerPhone: cleanPhone,
          totalEstimatedSeconds: ticket.estimated_wait_mins * 60,
          createdAt: Date.now(),
        };

        localStorage.setItem(`smart_queue_ticket_${slug}`, JSON.stringify(cached));
        setMyTicket(cached);
        setAlertTriggered(false);
        setEarlyProximityAlertTriggered(false);
        setCalledSpoken(false);
        setCompletionNotified(false);
        setFeedbackSubmitted(false);
        playQueueChime();

        if (ticket.is_existing_active) {
          sendBrowserNotification(
            `استرجاع تذكرتك النشطة (#${ticket.ticket_number})`,
            'لديك حجز نشط مسجل بهذا الرقم بالفعل. تم نقلك لتذكرتك الحالية لمتابعة دورك.'
          );
        }

        // Automatically attempt to activate WakeLock and notifications
        handleEnableAlertsAndWakeLock();
        fetchState();
      } else {
        setFormError(json.error || 'حدث خطأ أثناء حجز التذكرة');
      }
    } catch {
      setFormError('تعذر الاتصال بالخادم لحجز التذكرة');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Phone Recovery (Field Problem Solution)
  const handleRecoverTicket = async () => {
    const clean = recoveryPhone.trim().replace(/\s+/g, '');
    if (!clean || clean.length < 8) {
      setRecoveryError('يرجى إدخال رقم هاتف صحيح (8 أرقام على الأقل)');
      return;
    }
    setIsRecovering(true);
    setRecoveryError(null);
    try {
      const res = await fetch(`/api/tickets?orgSlug=${slug}&phone=${clean}`);
      const json = await res.json();
      if (json.success && json.data) {
        const ticket = json.data;
        const cached: CachedTicket = {
          ticketId: ticket.id,
          ticketNumber: ticket.ticket_number,
          orgSlug: slug,
          orgName: queueState?.organization?.name || 'المؤسسة',
          sectorLabel: queueState?.organization?.sector_label || 'زبون',
          estimatedTargetTimestamp: Date.now() + (ticket.estimated_wait_mins || 15) * 60 * 1000,
          initialEstimatedClockTime: ticket.estimated_clock_time || '—',
          customerName: ticket.customer_name || undefined,
          customerPhone: ticket.customer_phone,
          totalEstimatedSeconds: (ticket.estimated_wait_mins || 15) * 60,
          createdAt: ticket.created_at,
        };
        localStorage.setItem(`smart_queue_ticket_${slug}`, JSON.stringify(cached));
        setMyTicket(cached);
        setRecoveryPhone('');
        setShowRecovery(false);
        setEarlyProximityAlertTriggered(false);
        setCompletionNotified(false);
        playQueueChime();
        fetchState();
      } else {
        setRecoveryError(json.error || 'لم يتم العثور على تذكرة نشطة مسجلة بهذا الرقم');
      }
    } catch {
      setRecoveryError('تعذر الاتصال بالخادم للبحث عن التذكرة');
    } finally {
      setIsRecovering(false);
    }
  };

  // Handle 1-Tap Post-Service Feedback
  const handleFeedback = async (rating: FeedbackRating) => {
    try {
      await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'feedback',
          ticketId: myTicket?.ticketId,
          orgSlug: slug,
          ticketNumber: myTicket?.ticketNumber,
          rating,
        }),
      });
      setFeedbackSubmitted(true);
      localStorage.setItem(`smart_queue_feedback_${slug}`, 'true');
    } catch {
      setFeedbackSubmitted(true);
    }
  };

  // Reset to initial booking screen once completed (Customer is already out of queue)
  const handleResetForNewBooking = () => {
    localStorage.removeItem(`smart_queue_ticket_${slug}`);
    localStorage.removeItem(`smart_queue_feedback_${slug}`);
    setMyTicket(null);
    setRemainingSeconds(null);
    setCalledSpoken(false);
    setCompletionNotified(false);
    setEarlyProximityAlertTriggered(false);
    setFeedbackSubmitted(false);
    releaseScreenWakeLock();
    fetchState();
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

  // Leave queue manually while still in progress
  const handleLeaveQueue = async () => {
    if (confirm('هل أنت متأكد من مغادرة الطابور وإلغاء هذه التذكرة؟')) {
      if (myTicket?.ticketId) {
        try {
          await fetch(`/api/tickets?ticketId=${myTicket.ticketId}&orgSlug=${slug}&phone=${encodeURIComponent(myTicket.customerPhone || '')}`, {
            method: 'DELETE',
          });
        } catch (e) {
          console.error('Failed to cancel ticket on server:', e);
        }
      }
      handleResetForNewBooking();
    }
  };

  // Customer check-in when held
  const handleCheckin = async () => {
    if (!myTicket) return;
    setIsCheckingIn(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'checkin',
          orgSlug: slug,
          ticketNumber: myTicket.ticketNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setHasCheckedIn(true);
        playQueueChime();
        fetchState();
      }
    } catch {
      // ignore
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Format countdown mm:ss
  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SVG Circular Gauge Calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76
  const totalSeconds = myTicket?.totalEstimatedSeconds || 15 * 60;
  const fraction = Math.min(1, Math.max(0, (remainingSeconds ?? 0) / totalSeconds));
  const strokeDashoffset = circumference * (1 - fraction);

  if (loading && !myTicket) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slateNavy-950 text-slateNavy-100 min-h-screen">
        <div className="w-10 h-10 border-2 border-slateNavy-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slateNavy-400 text-sm font-medium">جاري فحص حالة الطابور...</p>
      </div>
    );
  }

  if (error && !queueState && !myTicket) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slateNavy-950 text-slateNavy-100 min-h-screen">
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
    <div className="min-h-screen w-full bg-slateNavy-950 flex flex-col items-center">
      <main className="flex-1 max-w-md mx-auto w-full p-4 flex flex-col justify-between bg-slateNavy-950 text-slateNavy-100 min-h-screen relative font-sans" dir="rtl">
      {/* Background Ambient Glow in Arctic Harbor Theme */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 arctic-grid-pattern opacity-15" />
        <div className="absolute top-10 -right-20 w-72 h-72 rounded-full bg-slateNavy-900/60 blur-[90px]" />
        <div className="absolute bottom-20 -left-20 w-72 h-72 rounded-full bg-slateNavy-800/40 blur-[90px]" />
      </div>
      {/* Top Header & Offline Status */}
      <header className="mb-3">
        <div className="flex items-center justify-between pb-3 border-b border-slateNavy-800">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-slateNavy-100">
                {org?.name || myTicket?.orgName}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slateNavy-900 border border-slateNavy-800 text-slateNavy-300">
                {sectorLabel}
              </span>
            </div>
            <p className="text-[11px] text-slateNavy-400 mt-0.5">
              خدمة ذكية • {staffTitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle variant="compact" showLabel={false} />
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

      {/* CASE 1: HELD TICKET (التوقيف المؤقت - لم يحضر عند النداء) */}
      {isHeldForMe && myTicket ? (
        <div className="space-y-4 my-auto">
          <div className="bg-slateNavy-900 border-2 border-amber-400/80 rounded-3xl p-6 text-center shadow-[0_0_40px_-10px_rgba(251,191,36,0.3)] space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-950/40">
              <Clock className="w-9 h-9 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-black px-3.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full inline-block">
                تأجيل مؤقت ⏸️
              </span>
              <h2 className="text-xl font-black text-slateNavy-100">دورك في وضع الانتظار المؤقت</h2>
              <p className="text-xs text-slateNavy-400 leading-relaxed max-w-xs mx-auto">
                تم استدعاء رقمك <strong>#{myTicket.ticketNumber}</strong> سابقاً ولم تكن متواجداً في القاعة، فقام {staffTitle} بتعليق دورك مؤقتاً لإعطاء الفرصة للمراجعين الحاضرين.
              </p>
            </div>

            {/* Ticket Details Box */}
            <div className="p-3.5 bg-slateNavy-950/90 border border-slateNavy-800 rounded-2xl flex items-center justify-around">
              <div>
                <p className="text-[10px] text-slateNavy-400">رقم تذكرتك</p>
                <p className="text-3xl font-black text-slateNavy-100">#{myTicket.ticketNumber}</p>
              </div>
              <div className="h-9 border-r border-slateNavy-800" />
              <div>
                <p className="text-[10px] text-slateNavy-400">الحالة الحالية</p>
                <p className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  معلق ومحفوظ
                </p>
              </div>
            </div>

            {/* Guidance Note */}
            <div className="p-3 bg-slateNavy-950/60 border border-amber-500/30 rounded-2xl text-[11px] text-slateNavy-400 text-right space-y-1">
              <p className="font-bold text-amber-300 flex items-center gap-1">
                <span>💡</span> مكانك محفوظ ولا تحتاج لحجز تذكرة جديدة!
              </p>
              <p>
                عند وصولك لقاعة الانتظار، اضغط على زر <strong>(أنا حاضر في القاعة)</strong> أدناه لتنبيه {staffTitle}، أو توجه فوراً للاستقبال ليتم استدعاؤك كأولوية قادمة.
              </p>
            </div>

            {/* Interactive Check-in Button */}
            {hasCheckedIn ? (
              <div className="py-3.5 px-4 bg-emerald-950/60 border border-emerald-500/60 rounded-2xl text-center space-y-1">
                <p className="text-xs font-black text-emerald-300 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  تم إشعار {staffTitle} بوجودك في القاعة!
                </p>
                <p className="text-[11px] text-slateNavy-400">خليك منتبهاً لرنين الهاتف وشاشة الصالة لاستدعائك قريباً جداً.</p>
              </div>
            ) : (
              <button
                onClick={handleCheckin}
                disabled={isCheckingIn}
                className="w-full py-4 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black rounded-2xl text-xs transition transform active:scale-95 shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isCheckingIn ? 'جاري الإشعار...' : '🙋‍♂️ أنا حاضر الآن في القاعة'}</span>
              </button>
            )}
          </div>

          {/* Reset / Leave option */}
          <button
            onClick={handleLeaveQueue}
            className="w-full py-3 px-4 bg-slateNavy-900/60 hover:bg-slateNavy-900 border border-slateNavy-800 text-slateNavy-400 hover:text-slateNavy-100 rounded-2xl text-xs font-semibold transition"
          >
            مغادرة الطابور وإلغاء هذه التذكرة
          </button>
        </div>
      ) : isCancelledForMe && myTicket ? (
        /* CASE 2: CANCELLED TICKET */
        <div className="space-y-4 my-auto">
          <div className="bg-slateNavy-900 border border-rose-500/40 rounded-3xl p-6 text-center shadow-xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slateNavy-100">تم إلغاء التذكرة</h3>
              <p className="text-xs text-slateNavy-400 leading-relaxed">
                تم إلغاء التذكرة رقم #{myTicket.ticketNumber} أو إعادة ضبط طابور اليوم من قِبل {staffTitle}.
              </p>
            </div>
            <button
              onClick={handleResetForNewBooking}
              className="w-full py-3.5 px-4 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 font-bold rounded-2xl text-xs transition"
            >
              حجز تذكرة جديدة
            </button>
          </div>
        </div>
      ) : isCompletedForMe && myTicket ? (
        <div className="space-y-4 my-auto">
          {/* Main Completion Card */}
          <div className="bg-slateNavy-900 border-2 border-emerald-500/60 rounded-3xl p-6 text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-950/80 border-2 border-emerald-500/80 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold px-3 py-1 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-full">
                تم خروجك بنجاح من الطابور
              </span>
              <h2 className="text-xl font-black text-white pt-2">انتهت خدمتك بنجاح</h2>
              <p className="text-xs text-slateNavy-300 leading-relaxed">
                شكراً لزيارتك لـ <strong>{org?.name || myTicket.orgName}</strong>. لقد خرجت من قائمة الانتظار تلقائياً.
              </p>
            </div>

            {/* Ticket details summary */}
            <div className="p-3 bg-slateNavy-950 border border-slateNavy-800 rounded-2xl flex items-center justify-around">
              <div>
                <p className="text-[10px] text-slateNavy-400">تذكرتك</p>
                <p className="text-2xl font-black text-slateNavy-100">#{myTicket.ticketNumber}</p>
              </div>
              <div className="h-8 border-r border-slateNavy-800" />
              <div>
                <p className="text-[10px] text-slateNavy-400">الحالة</p>
                <p className="text-xs font-bold text-emerald-400">مكتملة ومغلقة ✓</p>
              </div>
            </div>

            {/* THE ONLY ACTIVE TASK: 1-Tap Experience Feedback */}
            <div className="pt-2 border-t border-slateNavy-800/80 space-y-3">
              {feedbackSubmitted ? (
                <div className="py-3 bg-slateNavy-950 border border-slateNavy-800 rounded-2xl space-y-1">
                  <span className="text-2xl">✨</span>
                  <h4 className="text-xs font-bold text-slateNavy-100">تم تسجيل تقييمك، شكراً جزيلاً!</h4>
                  <p className="text-[11px] text-slateNavy-400">رأيك يساهم في تحسين جودة وسرعة الخدمة دائماً.</p>
                </div>
              ) : (
                <>
                  <div>
                    <h4 className="text-xs font-bold text-slateNavy-100">كيف كانت سرعة وجودة الخدمة اليوم؟</h4>
                    <p className="text-[10px] text-slateNavy-400 mt-0.5">تقييمك مهم جداً لـ {staffTitle} (نقرة واحدة فقط)</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleFeedback('great')}
                      className="p-3 bg-slateNavy-950 hover:bg-slateNavy-800 border border-slateNavy-800 hover:border-emerald-500/50 rounded-2xl flex flex-col items-center gap-1 transition active:scale-95 group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition">😄</span>
                      <span className="text-xs font-bold text-slateNavy-100">ممتازة</span>
                    </button>

                    <button
                      onClick={() => handleFeedback('okay')}
                      className="p-3 bg-slateNavy-950 hover:bg-slateNavy-800 border border-slateNavy-800 hover:border-slateNavy-700 rounded-2xl flex flex-col items-center gap-1 transition active:scale-95 group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition">😐</span>
                      <span className="text-xs font-bold text-slateNavy-100">عادية</span>
                    </button>

                    <button
                      onClick={() => handleFeedback('bad')}
                      className="p-3 bg-slateNavy-950 hover:bg-slateNavy-800 border border-slateNavy-800 hover:border-rose-500/50 rounded-2xl flex flex-col items-center gap-1 transition active:scale-95 group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition">🙁</span>
                      <span className="text-xs font-bold text-slateNavy-100">تحتاج تحسين</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Smart Status regarding re-booking and empty hall */}
          {(queueState?.totalWaiting || 0) === 0 ? (
            <div className="p-3.5 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl flex items-center gap-2.5 text-right shadow-md">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-[11px] text-emerald-200 leading-relaxed">
                <strong className="text-white">العيادة شاغرة حالياً (0 في الانتظار):</strong> يمكنك حجز خدمة إضافية والدخول فوراً بدون أي فترة تهدئة!
              </p>
            </div>
          ) : (
            <div className="p-3 bg-slateNavy-900 border border-slateNavy-800 rounded-2xl flex items-center gap-2.5 text-right">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <p className="text-[11px] text-slateNavy-400 leading-relaxed">
                يوجد حالياً <strong className="text-slateNavy-200">{queueState?.totalWaiting} في الانتظار</strong>. تُطبق فترة التهدئة لحماية أدوار المنتظرين (أو تفضل بإبلاغ موظف الاستقبال).
              </p>
            </div>
          )}

          {/* Clean Action: Book a new ticket if customer needs another turn */}
          <button
            onClick={handleResetForNewBooking}
            className={`w-full py-3.5 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              (queueState?.totalWaiting || 0) === 0
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slateNavy-950 font-black shadow-lg shadow-emerald-950/40'
                : 'bg-slateNavy-900 hover:bg-slateNavy-800 border border-slateNavy-800 hover:border-slateNavy-700 text-slateNavy-300 hover:text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>
              {(queueState?.totalWaiting || 0) === 0
                ? 'العيادة شاغرة — حجز دور جديد فوراً'
                : 'حجز دور جديد في الطابور'}
            </span>
          </button>
        </div>
      ) : myTicket ? (
        /* CASE 2: Active Waiting Ticket in Progress */
        <div className="space-y-3.5 my-auto">
          {/* Main Card */}
          <div className={`relative bg-slateNavy-900 border rounded-3xl p-6 shadow-2xl transition-all ${
            isMyTurnCalled 
              ? 'border-emerald-400 ring-4 ring-emerald-500/30' 
              : isMyTurnInside 
              ? 'border-slateNavy-400 ring-2 ring-slateNavy-700/30'
              : 'border-slateNavy-800'
          }`}>
            {/* Top Bar of Card */}
            <div className="flex items-center justify-between mb-2">
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
            <div className="text-center py-1">
              <p className="text-xs font-medium text-slateNavy-400 mb-0.5">رقم دورك في القائمة</p>
              <div className="text-6xl font-black text-slateNavy-100 tracking-tight">
                #{myTicket.ticketNumber}
              </div>
              {myTicket.customerName && (
                <p className="text-sm font-semibold text-slateNavy-300 mt-1">
                  مرحباً، {myTicket.customerName}
                </p>
              )}
            </div>

            {/* Perforated separator */}
            <div className="relative my-3">
              <div className="border-t border-dashed border-slateNavy-800" />
              <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-6 h-6 bg-slateNavy-950 rounded-full border-r border-slateNavy-800" />
              <div className="absolute -right-9 top-1/2 -translate-y-1/2 w-6 h-6 bg-slateNavy-950 rounded-full border-l border-slateNavy-800" />
            </div>

            {/* PRESENCE STATE 1: CALLED (استدعاء للدخول) */}
            {isMyTurnCalled ? (
              <div className="bg-slateNavy-800 border-2 border-emerald-400 rounded-2xl p-4 text-center animate-pulse space-y-1.5">
                <DoorOpen className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-black text-emerald-300">تم استدعاؤك الآن! تفضل بالدخول</h3>
                <p className="text-xs text-slateNavy-300">{staffTitle} بانتظار دخولك إلى القاعة</p>
              </div>
            ) : isMyTurnInside ? (
              /* PRESENCE STATE 2: INSIDE (بالداخل حالياً) */
              <div className="bg-slateNavy-800 border border-slateNavy-700 rounded-2xl p-4 text-center space-y-1">
                <UserCheck className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                <h3 className="text-base font-bold text-slateNavy-100">أنت في الداخل حالياً</h3>
                <p className="text-xs text-slateNavy-400">جاري تقديم الخدمة لك لدى {staffTitle}</p>
              </div>
            ) : (
              /* PRESENCE STATE 3: WAITING */
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

            {/* Circular Countdown Progress Ring & Clock Estimation */}
            {!isMyTurnInside && !isMyTurnCalled && (
              <div className="mt-4 bg-slateNavy-950 border border-slateNavy-800 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slateNavy-800 text-slateNavy-100 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slateNavy-400">ساعة الدخول المقدرة</p>
                    <p className="text-base font-black text-slateNavy-100">
                      {liveEstimatedClockTime}
                    </p>
                  </div>
                </div>

                {/* SVG Countdown Ring */}
                {remainingSeconds !== null && (
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        className="text-slateNavy-800"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        className="text-slateNavy-300 transition-all duration-1000 ease-linear"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-black font-mono text-white">
                        {remainingSeconds > 0 ? formatCountdown(remainingSeconds) : '00:00'}
                      </span>
                      <span className="text-[8px] text-slateNavy-400">
                        {remainingSeconds > 0 ? 'متبقي' : 'أي لحظة'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FIELD ALERT: Early Proximity Warning (when livePeopleAhead <= 2) */}
          {livePeopleAhead <= 2 && livePeopleAhead > 0 && !isMyTurnCalled && !isMyTurnInside && (
            <div className="bg-amber-950/40 border-2 border-amber-500/80 rounded-2xl p-4 text-amber-200 animate-pulse flex items-start gap-3 shadow-lg shadow-amber-900/20">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-white">
                  ⚠️ تنبيه: توجه إلى القاعة الآن!
                </h4>
                <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                  بقي أمامك {livePeopleAhead === 1 ? 'شخص واحد فقط' : 'شخصان فقط'}. بعض الأدوار قد تمر أسرع من المتوقع، نوصيك بالتواجد بالصالة فوراً لتجنب فوات دورك.
                </p>
              </div>
            </div>
          )}

          {/* Screen Wake Lock & Notification Toggle Widget */}
          <div className="flex items-center justify-between p-3 bg-slateNavy-900 border border-slateNavy-800 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <Bell className={`w-4 h-4 ${notificationsAllowed ? 'text-emerald-400' : 'text-slateNavy-400'}`} />
              <div>
                <p className="text-xs font-bold text-slateNavy-100">
                  {notificationsAllowed && wakeLockActive
                    ? 'التنبيهات وتثبيت الشاشة نشطة'
                    : 'تنبيهات عند إغلاق الشاشة'}
                </p>
                <p className="text-[10px] text-slateNavy-400">
                  {notificationsAllowed
                    ? 'ستصلك إشعارات ورنة حتى لو وضعت الهاتف في جيبك'
                    : 'فعّل الإشعارات لمنع قفل الشاشة وفوات الدور'}
                </p>
              </div>
            </div>
            {!notificationsAllowed && (
              <button
                onClick={handleEnableAlertsAndWakeLock}
                className="px-3 py-1.5 bg-slateNavy-800 hover:bg-slateNavy-700 border border-slateNavy-700 text-slateNavy-100 text-[11px] font-bold rounded-xl transition"
              >
                تفعيل الآن
              </button>
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
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isManualRefreshing}
                className="flex-1 py-3 px-4 bg-slateNavy-900 hover:bg-slateNavy-800 border border-slateNavy-800 text-slateNavy-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-85 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${
                  isManualRefreshing 
                    ? 'animate-spin text-sky-400' 
                    : justUpdated 
                    ? 'text-emerald-400' 
                    : 'text-slateNavy-400'
                }`} />
                <span>
                  {isManualRefreshing 
                    ? 'جاري فحص الطابور...' 
                    : justUpdated 
                    ? 'تم التحديث بنجاح ✓' 
                    : 'تحديث الحالة'}
                </span>
              </button>
              <button
                type="button"
                onClick={handleLeaveQueue}
                className="py-3 px-4 bg-slateNavy-900 hover:bg-slateNavy-800 text-slateNavy-400 hover:text-rose-400 border border-slateNavy-800 rounded-xl text-xs font-semibold transition"
              >
                مغادرة الطابور
              </button>
            </div>
            {lastUpdatedTime && (
              <p className="text-[10px] text-slateNavy-500 text-center select-none">
                آخر مزامنة مباشرة: {lastUpdatedTime}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* CASE 3: Booking Form (No Active Ticket) */
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

          {/* Phone Lookup / Recovery Widget */}
          <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-2xl p-3.5">
            <button
              type="button"
              onClick={() => setShowRecovery(!showRecovery)}
              className="w-full flex items-center justify-between text-xs font-bold text-slateNavy-300 hover:text-slateNavy-100 transition"
            >
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-slateNavy-400" />
                <span>أغلقت الصفحة بالخطأ؟ استرجع تذكرتك برقم الهاتف</span>
              </span>
              <span className="text-[11px] text-slateNavy-400 underline">
                {showRecovery ? 'إلغاء' : 'استرجاع'}
              </span>
            </button>

            {showRecovery && (
              <div className="mt-3 pt-3 border-t border-slateNavy-800 space-y-2">
                <p className="text-[11px] text-slateNavy-400">
                  أدخل رقم هاتفك الذي حجزت به لاسترجاع تذكرتك النشطة فوراً:
                </p>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={recoveryPhone}
                    onChange={(e) => setRecoveryPhone(e.target.value)}
                    placeholder="05 / 06 / 07..."
                    className="flex-1 bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-xs text-slateNavy-100 focus:outline-none focus:border-slateNavy-400 text-left dir-ltr"
                  />
                  <button
                    type="button"
                    disabled={isRecovering}
                    onClick={handleRecoverTicket}
                    className="px-4 py-2 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 rounded-xl text-xs font-bold transition disabled:opacity-50"
                  >
                    {isRecovering ? 'جاري...' : 'استرجاع'}
                  </button>
                </div>
                {recoveryError && (
                  <p className="text-[11px] text-rose-400">{recoveryError}</p>
                )}
              </div>
            )}
          </div>

          {/* Booking Form with Mandatory Phone */}
          <form onSubmit={handleBook} className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-bold text-slateNavy-100">احجز دورك الرقمي</h2>
              <p className="text-xs text-slateNavy-400 mt-0.5">
                احجز تذكرتك وغادر القاعة، وسننبهك صوتياً قبل حلول دورك
              </p>
            </div>

            {/* Regulatory Transparency Notice (Fair-Usage & Cooldown Rule) */}
            <div className="p-3.5 bg-slateNavy-900/90 border border-slateNavy-800 rounded-2xl flex items-start gap-3 text-right shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-slateNavy-800/60 text-sky-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-sky-300" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-black text-slateNavy-100">ملاحظة تنظيمية هامة:</h4>
                  <span className="text-[10px] px-2 py-0.5 bg-sky-950 text-sky-300 border border-sky-600/40 rounded-full font-bold">
                    حجز واحد فقط لكل هاتف
                  </span>
                </div>
                <p className="text-[11px] text-slateNavy-400 leading-relaxed">
                  لكل هاتف حجز نشط واحد فقط. بعد إتمام الفحص سيتوجب عليك الانتظار <strong className="text-white">90 دقيقة</strong> لإعادة الحجز حرصاً على إتاحة الفرصة للجميع (إلا إذا كانت العيادة خالية تماماً، أو بالتنسيق المباشر مع موظف الاستقبال).
                </p>
              </div>
            </div>

            {org?.is_active === 0 && (
              <div className="p-3.5 bg-amber-950/80 border-2 border-amber-500/80 rounded-2xl text-amber-200 text-xs font-bold text-center leading-relaxed">
                ⚠️ تم إيقاف استقبال حجز التذاكر مؤقتاً لهذه المؤسسة من قِبل الإدارة. يرجى مراجعة موظف الاستقبال في الصالة.
              </div>
            )}

            {/* Case: Outside Working Hours / Day Off / Quota Full */}
            {queueState?.scheduleInfo?.isQuotaExceeded && (
              <div className="p-3.5 bg-rose-950/80 border-2 border-rose-500/80 rounded-2xl text-rose-200 text-xs font-bold text-center leading-relaxed space-y-1">
                <p className="text-sm font-black text-rose-100">⚠️ اكتمل عدد مقاعد اليوم</p>
                <p className="text-[11px] text-rose-300 font-normal">
                  وصلت العيادة للحد الأقصى المسموح به اليوم ({queueState.scheduleInfo.dailyMaxTickets} تذكرة). نعتذر منك ونلقاك في يوم العمل القادم.
                </p>
              </div>
            )}

            {queueState?.scheduleInfo?.isDayOff && (
              <div className="p-3.5 bg-sky-950/80 border-2 border-sky-500/80 rounded-2xl text-sky-200 text-xs font-bold text-center leading-relaxed space-y-1">
                <p className="text-sm font-black text-sky-100">📅 العيادة في عطلة اليوم</p>
                <p className="text-[11px] text-sky-300 font-normal">
                  يرجى الحجز خلال أيام العمل الرسمية. يفتح الحجز تلقائياً في يوم العمل القادم.
                </p>
              </div>
            )}

            {queueState?.scheduleInfo?.isBeforeWork && (
              <div className="p-3.5 bg-amber-950/80 border-2 border-amber-500/80 rounded-2xl text-amber-200 text-xs font-bold text-center leading-relaxed space-y-1">
                <p className="text-sm font-black text-amber-100">🕒 لم يبدأ دوام اليوم بعد</p>
                <p className="text-[11px] text-amber-300 font-normal">
                  أوقات استقبال الحجوزات تبدأ عند الساعة {queueState.scheduleInfo.workStartTime}. يرجى الانتظار حتى بدء الدوام.
                </p>
              </div>
            )}

            {queueState?.scheduleInfo?.isAfterWork && (
              <div className="p-3.5 bg-slateNavy-950 border-2 border-slateNavy-700 rounded-2xl text-slateNavy-200 text-xs font-bold text-center leading-relaxed space-y-1">
                <p className="text-sm font-black text-white">🔒 انتهت ساعات العمل لليوم</p>
                <p className="text-[11px] text-slateNavy-400 font-normal">
                  دوام العيادة حتى الساعة {queueState.scheduleInfo.workEndTime}. يفتح الحجز مجدداً في يوم العمل القادم عند الساعة {queueState.scheduleInfo.workStartTime}.
                </p>
              </div>
            )}

            {formError && (
              <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

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
                <label className="block text-xs font-semibold text-slateNavy-300 mb-1">
                  رقم الهاتف (إجباري لمتابعة دورك واستلام التنبيهات) <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slateNavy-700 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    minLength={8}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05 / 06 / 07..."
                    className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl pr-9 pl-3 py-2.5 text-sm text-slateNavy-100 placeholder-slateNavy-700 focus:outline-none focus:border-slateNavy-400 text-left dir-ltr transition"
                  />
                </div>
                <p className="text-[10px] text-slateNavy-500 mt-1">
                  يُستخدم لاسترجاع تذكرتك إذا أُغلقت الصفحة وتنبيهك باقتراب دورك
                </p>
              </div>
            </div>

            {(() => {
              const sched = queueState?.scheduleInfo;
              const isClosedBySchedule = sched && (!sched.isOpen && org?.is_active === 1);
              const isLocked = org?.is_active === 0 || isClosedBySchedule;
              let lockText = 'احجز دورك الآن وغادر القاعة مطمئناً';
              if (org?.is_active === 0) lockText = 'الحجز متوقف مؤقتاً';
              else if (sched?.isQuotaExceeded) lockText = 'اكتملت تذاكر اليوم';
              else if (sched?.isDayOff) lockText = 'العيادة في عطلة اليوم';
              else if (sched?.isBeforeWork) lockText = `يفتح الحجز الساعة ${sched.workStartTime}`;
              else if (sched?.isAfterWork) lockText = 'انتهت ساعات العمل لليوم';

              return (
                <button
                  type="submit"
                  disabled={isSubmitting || isLocked}
                  className="w-full py-4 px-6 bg-slateNavy-100 hover:bg-white text-slateNavy-950 font-black rounded-2xl flex items-center justify-center gap-2 transition transform active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? 'جاري الحجز...' : lockText}</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              );
            })()}
          </form>

          <div className="text-center px-4">
            <p className="text-[11px] text-slateNavy-700">
              بدون طابعات وبدون شاشات تلفاز • تذكرتك محفوظة على هاتفك حتى بدون إنترنت
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-2 text-[11px] text-slateNavy-700 border-t border-slateNavy-900 mt-3">
        نظام الطابور الذكي العام • لا مزيد من التزاحم في قاعات الانتظار
      </footer>
    </main>
  </div>
);
}
