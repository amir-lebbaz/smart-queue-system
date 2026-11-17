'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Lock, 
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  Trash2,
  Edit3,
  Copy,
  Check,
  QrCode,
  Tv,
  Smartphone,
  User,
  FileText,
  Activity,
  ShieldCheck,
  Crown,
  Star,
  Power
} from 'lucide-react';
import { Organization, GlobalSystemStats } from '@/lib/types';

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterPin, setMasterPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [stats, setStats] = useState<GlobalSystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<'all' | 'starter' | 'pro' | 'elite'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Create Form State
  const [createName, setCreateName] = useState('');
  const [createSlug, setCreateSlug] = useState('');
  const [createSectorLabel, setCreateSectorLabel] = useState('مريض');
  const [createStaffTitle, setCreateStaffTitle] = useState('الطبيب');
  const [createPinCode, setCreatePinCode] = useState('1234');
  const [createAvgMins, setCreateAvgMins] = useState(15);
  const [createPlan, setCreatePlan] = useState<'starter' | 'pro' | 'elite'>('pro');
  const [createBillingCycle, setCreateBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [createContactPhone, setCreateContactPhone] = useState('');
  const [createNotes, setCreateNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editSectorLabel, setEditSectorLabel] = useState('');
  const [editStaffTitle, setEditStaffTitle] = useState('');
  const [editPinCode, setEditPinCode] = useState('');
  const [editAvgMins, setEditAvgMins] = useState(15);
  const [editPlan, setEditPlan] = useState<'starter' | 'pro' | 'elite'>('pro');
  const [editBillingCycle, setEditBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [editContactPhone, setEditContactPhone] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [isEditingSubmitting, setIsEditingSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = sessionStorage.getItem('queue_super_admin_auth');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleMasterLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = masterPin.trim();
    if (clean === '8039' || clean === '0666568039' || clean === '2026' || clean === '9999') {
      setIsAuthenticated(true);
      setPinError(false);
      sessionStorage.setItem('queue_super_admin_auth', 'true');
    } else {
      setPinError(true);
      setMasterPin('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('queue_super_admin_auth');
    setIsAuthenticated(false);
  };

  const superAdminFetch = async (url: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers || {});
    headers.set('x-super-admin-key', '9999');
    return fetch(url, { ...init, headers });
  };

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [orgsRes, statsRes] = await Promise.all([
        superAdminFetch('/api/organizations'),
        superAdminFetch('/api/organizations?stats=true'),
      ]);

      const orgsData = await orgsRes.json();
      if (orgsData.success) {
        setOrgs(orgsData.data);
      }

      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (e) {
      console.error('Failed to fetch super admin data', e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Create Org Handler
  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await superAdminFetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createName,
          slug: createSlug,
          sector_label: createSectorLabel,
          staff_title: createStaffTitle,
          pin_code: createPinCode,
          avg_service_mins: Number(createAvgMins),
          plan: createPlan,
          billing_cycle: createBillingCycle,
          contact_phone: createContactPhone,
          notes: createNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setCreateName('');
        setCreateSlug('');
        setCreateContactPhone('');
        setCreateNotes('');
        fetchData();
      } else {
        alert(data.error || 'فشل في إنشاء المؤسسة');
      }
    } catch {
      alert('خطأ في الاتصال بالخادم');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (org: Organization) => {
    setEditingOrg(org);
    setEditName(org.name || '');
    setEditSectorLabel(org.sector_label || 'مريض');
    setEditStaffTitle(org.staff_title || 'الطبيب');
    setEditPinCode(org.pin_code || '1234');
    setEditAvgMins(org.avg_service_mins || 15);
    setEditPlan(org.plan || 'pro');
    setEditBillingCycle(org.billing_cycle || 'monthly');
    setEditContactPhone(org.contact_phone || '');
    setEditNotes(org.notes || '');
  };

  // Submit Edit Org
  const handleUpdateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg) return;
    setIsEditingSubmitting(true);

    try {
      const res = await superAdminFetch(`/api/organizations/${editingOrg.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          sector_label: editSectorLabel,
          staff_title: editStaffTitle,
          pin_code: editPinCode,
          avg_service_mins: Number(editAvgMins),
          plan: editPlan,
          billing_cycle: editBillingCycle,
          contact_phone: editContactPhone,
          notes: editNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEditingOrg(null);
        fetchData();
      } else {
        alert(data.error || 'فشل في تعديل بيانات المؤسسة');
      }
    } catch {
      alert('خطأ في الاتصال بالخادم');
    } finally {
      setIsEditingSubmitting(false);
    }
  };

  // Extend Subscription (+30, +90, +365 days)
  const handleExtendSubscription = async (slug: string, days: number) => {
    try {
      const res = await superAdminFetch(`/api/organizations/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'extend_subscription', days }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert('فشل في تمديد الاشتراك');
      }
    } catch {
      alert('خطأ في الاتصال بالخادم');
    }
  };

  // Toggle Active
  const handleToggleActive = async (slug: string) => {
    try {
      const res = await superAdminFetch(`/api/organizations/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_active' }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch {
      alert('فشل في تعديل حالة الاشتراك');
    }
  };

  // Reset Daily Queue
  const handleResetQueue = async (slug: string, orgName: string) => {
    if (!confirm(`هل أنت متأكد من تصفير طابور اليوم لمؤسسة "${orgName}"؟ سيبدأ العداد من الرقم 0.`)) return;

    try {
      const res = await superAdminFetch(`/api/organizations/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_queue' }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`تم تصفير طابور "${orgName}" بنجاح!`);
        fetchData();
      }
    } catch {
      alert('فشل في تصفير الطابور');
    }
  };

  // Delete Org
  const handleDeleteOrg = async (slug: string, orgName: string) => {
    const confirmation = prompt(`لحذف مؤسسة "${orgName}" وجميع سجلاتها نهائياً، اكتب اسمها كاملاً للتأكيد:`);
    if (confirmation !== orgName) {
      if (confirmation !== null) alert('لم يتم تطابق الاسم، أُلغي الحذف.');
      return;
    }

    try {
      const res = await superAdminFetch(`/api/organizations/${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert(`تم حذف مؤسسة "${orgName}" نهائياً.`);
        fetchData();
      } else {
        alert('فشل في حذف المؤسسة');
      }
    } catch {
      alert('خطأ في الاتصال بالخادم');
    }
  };

  // Copy link
  const copyLink = (path: string, label: string) => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}${path}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedSlug(label);
      setTimeout(() => setCopiedSlug(null), 2500);
    }
  };

  // Filtered Organizations
  const filteredOrgs = useMemo(() => {
    return orgs.filter((org) => {
      const matchesSearch = 
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (org.contact_phone && org.contact_phone.includes(searchQuery)) ||
        org.pin_code.includes(searchQuery);

      const matchesPlan = filterPlan === 'all' || org.plan === filterPlan;
      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'active' && org.is_active === 1) ||
        (filterStatus === 'inactive' && org.is_active === 0);

      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [orgs, searchQuery, filterPlan, filterStatus]);

  // Expiration helper
  const getSubscriptionInfo = (org: Organization) => {
    if (!org.subscription_expires_at) {
      return { text: 'غير محدد', status: 'unknown', daysLeft: 0 };
    }
    const expiresAt = Number(org.subscription_expires_at);
    const now = Date.now();
    const diffDays = Math.ceil((expiresAt - now) / (1000 * 86400));
    const dateFormatted = new Date(expiresAt).toLocaleDateString('ar-DZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    if (diffDays <= 0) {
      return { text: `منتهي (${dateFormatted})`, status: 'expired', daysLeft: diffDays };
    }
    if (diffDays <= 15) {
      return { text: `ينتهي قريباً: ${diffDays} يوم (${dateFormatted})`, status: 'warning', daysLeft: diffDays };
    }
    return { text: `ساري: ${diffDays} يوم (${dateFormatted})`, status: 'active', daysLeft: diffDays };
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slateNavy-950 text-slateNavy-100 flex items-center justify-center p-4 font-sans selection:bg-slateNavy-400 selection:text-slateNavy-950" dir="rtl">
        <div className="w-full max-w-sm bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-7 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 bg-gradient-to-br from-slateNavy-800 via-slateNavy-900 to-slateNavy-950 text-white rounded-3xl flex items-center justify-center mx-auto border border-slateNavy-700 shadow-xl">
            <Lock className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">منطقة المالك المحمية (Super Admin)</h1>
            <p className="text-xs text-slateNavy-400 mt-1 leading-relaxed">
              هذه اللوحة خاصة بمالك النظام لإدارة المشتركين، تفعيل الاشتراكات، ومراقبة العمليات المالية.
            </p>
          </div>

          <form onSubmit={handleMasterLogin} className="space-y-3.5">
            <input
              type="password"
              required
              autoFocus
              placeholder="أدخل رمز المالك السري..."
              value={masterPin}
              onChange={(e) => setMasterPin(e.target.value)}
              className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-2xl px-4 py-3 text-center text-sm font-bold text-white tracking-widest focus:outline-none focus:border-slateNavy-400 shadow-inner"
            />
            {pinError && (
              <p className="text-xs text-rose-400 font-semibold bg-rose-950/40 py-1.5 px-3 rounded-xl border border-rose-800">
                الرمز السري غير صحيح! الدخول محمي للمشرف العام فقط.
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-slateNavy-100 to-white hover:from-white hover:to-slateNavy-200 text-slateNavy-950 font-black rounded-2xl text-xs transition shadow-lg shadow-black/40"
            >
              تسجيل دخول المشرف العام 👑
            </button>
          </form>

          <div className="pt-3 border-t border-slateNavy-800">
            <Link href="/" className="text-xs text-slateNavy-400 hover:text-white transition flex items-center justify-center gap-1">
              <span>← العودة للموقع الترويجي</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slateNavy-950 text-slateNavy-100 p-4 sm:p-8 font-sans selection:bg-slateNavy-400 selection:text-slateNavy-950" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* 1. TOP HEADER & LOGOUT */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slateNavy-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slateNavy-800 to-slateNavy-900 border border-slateNavy-700 text-amber-400 flex items-center justify-center font-black text-xl shadow-lg">
                👑
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>لوحة تحكم المالك المركزي</span>
                  <span className="text-[10px] bg-amber-400/10 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-mono font-bold">MASTER</span>
                </h1>
                <p className="text-xs text-slateNavy-400 mt-0.5">
                  إدارة المشتركين، متابعة الدخل، تمديد وتعديل الباقات، والتحكم الفوري في الطوابير
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={fetchData}
              disabled={isRefreshing}
              className="py-2.5 px-3.5 bg-slateNavy-900 hover:bg-slateNavy-850 border border-slateNavy-800 text-slateNavy-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">تحديث</span>
            </button>

            <Link
              href="/"
              className="py-2.5 px-3.5 bg-slateNavy-900 hover:bg-slateNavy-850 border border-slateNavy-800 text-slateNavy-200 rounded-xl text-xs font-bold transition"
            >
              الموقع الرئيسي
            </Link>

            <button
              onClick={() => setShowCreateModal(true)}
              className="py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-lg shadow-emerald-950/60 active:scale-95"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>إضافة عيادة / مشترك جديد</span>
            </button>

            <button
              onClick={handleLogout}
              className="py-2.5 px-3 bg-rose-950/40 hover:bg-rose-950 border border-rose-800/80 text-rose-300 rounded-xl text-xs font-bold transition"
              title="تسجيل الخروج"
            >
              خروج
            </button>
          </div>
        </header>

        {/* 2. EXECUTIVE KPI CARDS BAR */}
        {stats && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {/* KPI 1: Estimated MRR */}
            <div className="bg-slateNavy-900/90 border border-slateNavy-800 rounded-2xl p-4 shadow-xl space-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between text-slateNavy-400 text-xs font-semibold">
                <span>الدخل الشهري المتكرر (MRR)</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white tracking-tight">
                {stats.financials.estimatedMRR.toLocaleString('ar-DZ')} <span className="text-xs text-slateNavy-400 font-normal">دج / شهر</span>
              </p>
              <p className="text-[10px] text-emerald-400 font-medium">
                ما يعادل {stats.financials.estimatedARR.toLocaleString('ar-DZ')} دج سنوياً (ARR)
              </p>
            </div>

            {/* KPI 2: Total Subscribers */}
            <div className="bg-slateNavy-900/90 border border-slateNavy-800 rounded-2xl p-4 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-slateNavy-400 text-xs font-semibold">
                <span>إجمالي المشتركين النشطين</span>
                <Building2 className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-2xl font-black text-white tracking-tight">
                {stats.activeOrgs} <span className="text-xs text-slateNavy-400 font-normal">من أصل {stats.totalOrgs}</span>
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-slateNavy-300">
                <span className="text-slateNavy-400">{stats.planCounts.starter} أساسية</span>
                <span>•</span>
                <span className="text-emerald-400">{stats.planCounts.pro} محترفة ⭐</span>
                <span>•</span>
                <span className="text-amber-300">{stats.planCounts.elite} نخبة 👑</span>
              </div>
            </div>

            {/* KPI 3: Total Tickets & Traffic */}
            <div className="bg-slateNavy-900/90 border border-slateNavy-800 rounded-2xl p-4 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-slateNavy-400 text-xs font-semibold">
                <span>إجمالي التذاكر الصادرة</span>
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white tracking-tight">
                {stats.tickets.totalIssued.toLocaleString('ar-DZ')} <span className="text-xs text-slateNavy-400 font-normal">تذكرة</span>
              </p>
              <p className="text-[10px] text-slateNavy-300">
                {stats.tickets.waitingNow} ينتظرون الآن • {stats.tickets.completed} تمت خدمتهم
              </p>
            </div>

            {/* KPI 4: Cloud Infrastructure Health */}
            <div className="bg-slateNavy-900/90 border border-slateNavy-800 rounded-2xl p-4 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-slateNavy-400 text-xs font-semibold">
                <span>حالة قاعدة البيانات السحابية</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-black text-white">متصل ونشط لحظياً</span>
              </div>
              <p className="text-[10px] text-slateNavy-400 font-mono">
                {stats.systemHealth.dbProvider} • {stats.systemHealth.latencyMs}ms
              </p>
            </div>
          </section>
        )}

        {/* 3. SEARCH & FILTER TOOLBAR */}
        <section className="bg-slateNavy-900/70 border border-slateNavy-800 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slateNavy-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث بالاسم، المعرف، الهاتف، أو PIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl pr-10 pl-3 py-2 text-xs text-white placeholder-slateNavy-500 focus:outline-none focus:border-slateNavy-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
            {/* Plan Filter */}
            <div className="flex items-center gap-1 bg-slateNavy-950 border border-slateNavy-800 p-1 rounded-xl text-xs">
              <span className="text-[10px] text-slateNavy-400 px-2 font-bold">الباقة:</span>
              <button
                onClick={() => setFilterPlan('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${filterPlan === 'all' ? 'bg-slateNavy-800 text-white' : 'text-slateNavy-400'}`}
              >
                الكل
              </button>
              <button
                onClick={() => setFilterPlan('starter')}
                className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${filterPlan === 'starter' ? 'bg-slateNavy-800 text-white' : 'text-slateNavy-400'}`}
              >
                الأساسية
              </button>
              <button
                onClick={() => setFilterPlan('pro')}
                className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${filterPlan === 'pro' ? 'bg-emerald-500 text-slateNavy-950 font-black' : 'text-slateNavy-400'}`}
              >
                المحترفين ⭐
              </button>
              <button
                onClick={() => setFilterPlan('elite')}
                className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${filterPlan === 'elite' ? 'bg-amber-400 text-slateNavy-950 font-black' : 'text-slateNavy-400'}`}
              >
                النخبة 👑
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slateNavy-950 border border-slateNavy-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${filterStatus === 'all' ? 'bg-slateNavy-800 text-white' : 'text-slateNavy-400'}`}
              >
                كل الحالات
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${filterStatus === 'active' ? 'bg-slateNavy-800 text-emerald-400' : 'text-slateNavy-400'}`}
              >
                المفعلة
              </button>
              <button
                onClick={() => setFilterStatus('inactive')}
                className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${filterStatus === 'inactive' ? 'bg-slateNavy-800 text-rose-400' : 'text-slateNavy-400'}`}
              >
                المعطلة
              </button>
            </div>
          </div>
        </section>

        {/* 4. ORGANIZATIONS MANAGEMENT CARDS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slateNavy-400 px-1">
            <span>المؤسسات المعروضة: ({filteredOrgs.length} من أصل {orgs.length})</span>
            {copiedSlug && (
              <span className="text-emerald-400 font-bold animate-pulse">
                ✓ تم نسخ {copiedSlug} إلى الحافظة بنجاح!
              </span>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16 text-slateNavy-400 text-sm">جاري تحميل بيانات المؤسسات...</div>
          ) : filteredOrgs.length === 0 ? (
            <div className="text-center py-16 bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-8 space-y-3">
              <Building2 className="w-10 h-10 text-slateNavy-600 mx-auto" />
              <p className="text-sm font-bold text-white">لا توجد مؤسسات تطابق معايير البحث والفلترة</p>
              <p className="text-xs text-slateNavy-400">جرب تعديل كلمة البحث أو إزالة الفلاتر المحددة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredOrgs.map((org) => {
                const subInfo = getSubscriptionInfo(org);
                const clientPhone = org.contact_phone ? org.contact_phone.trim().replace(/\s+/g, '') : '';
                const waLink = clientPhone 
                  ? `https://wa.me/${clientPhone.startsWith('0') ? '213' + clientPhone.slice(1) : clientPhone}?text=${encodeURIComponent(
                      `مرحباً دكتور ${org.name}،\nنحييكم من منصة طابوري الذكي.\n\nروابط الوصول الخاصة بكم:\n• ريموت المسير (PIN: ${org.pin_code}): ${typeof window !== 'undefined' ? window.location.origin : ''}/admin/${org.slug}\n• شاشة المراجعين: ${typeof window !== 'undefined' ? window.location.origin : ''}/q/${org.slug}\n• شاشة صالة الانتظار للتلفاز: ${typeof window !== 'undefined' ? window.location.origin : ''}/display/${org.slug}\n\nنحن دائماً في خدمتكم!`
                    )}`
                  : null;

                return (
                  <div
                    key={org.id}
                    className="bg-slateNavy-900 border border-slateNavy-800 hover:border-slateNavy-700 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between transition space-y-5"
                  >
                    <div className="space-y-4">
                      {/* Top Header: Name, Plan, Active Toggle */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-black text-lg text-white">{org.name}</h3>
                            <span className="font-mono text-[11px] text-slateNavy-400 bg-slateNavy-950 px-2 py-0.5 rounded-lg border border-slateNavy-800">
                              /{org.slug}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                              org.plan === 'starter'
                                ? 'bg-slateNavy-800 text-slateNavy-300 border-slateNavy-700'
                                : org.plan === 'elite'
                                ? 'bg-amber-950/70 text-amber-300 border-amber-700 font-black'
                                : 'bg-emerald-950/70 text-emerald-300 border-emerald-700 font-black'
                            }`}>
                              {org.plan === 'starter' ? 'أساسية (1,500 دج)' : org.plan === 'elite' ? '👑 نخبة VIP (3,000 دج)' : '⭐ محترفة (2,500 دج)'}
                            </span>

                            <span className="text-[10px] text-slateNavy-400 bg-slateNavy-950 px-2 py-0.5 rounded-full border border-slateNavy-800">
                              {org.billing_cycle === 'yearly' ? 'اشتراك سنوي' : 'اشتراك شهري'}
                            </span>

                            {org.contact_phone && (
                              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 bg-slateNavy-950 px-2 py-0.5 rounded-full border border-slateNavy-800">
                                <Phone className="w-3 h-3 text-emerald-400" />
                                <span className="dir-ltr">{org.contact_phone}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Active Toggle Button */}
                        <button
                          onClick={() => handleToggleActive(org.slug)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border transition flex items-center gap-1.5 shrink-0 ${
                            org.is_active === 1
                              ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300 hover:bg-emerald-900'
                              : 'bg-rose-950/80 border-rose-700 text-rose-300 hover:bg-rose-900'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{org.is_active === 1 ? 'مفعل' : 'معطل'}</span>
                        </button>
                      </div>

                      {/* Subscription Expiry & Quick Renewal Bar */}
                      <div className="bg-slateNavy-950/80 p-3 rounded-2xl border border-slateNavy-800/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slateNavy-400 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slateNavy-400" />
                            <span>تاريخ انتهاء الاشتراك:</span>
                          </span>
                          <span className={`font-bold text-xs ${
                            subInfo.status === 'expired' 
                              ? 'text-rose-400' 
                              : subInfo.status === 'warning' 
                              ? 'text-amber-400' 
                              : 'text-emerald-400'
                          }`}>
                            {subInfo.text}
                          </span>
                        </div>

                        {/* Fast Extension Buttons (+30d, +90d, +1yr) */}
                        <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slateNavy-800/60 text-[11px]">
                          <span className="text-slateNavy-400 text-[10px]">تمديد سريع:</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleExtendSubscription(org.slug, 30)}
                              className="px-2.5 py-1 bg-slateNavy-900 hover:bg-slateNavy-800 border border-slateNavy-700 rounded-lg text-slateNavy-200 font-bold transition text-[10px]"
                            >
                              +30 يوم (شهر)
                            </button>
                            <button
                              onClick={() => handleExtendSubscription(org.slug, 90)}
                              className="px-2.5 py-1 bg-slateNavy-900 hover:bg-slateNavy-800 border border-slateNavy-700 rounded-lg text-slateNavy-200 font-bold transition text-[10px]"
                            >
                              +3 أشهر
                            </button>
                            <button
                              onClick={() => handleExtendSubscription(org.slug, 365)}
                              className="px-2.5 py-1 bg-slateNavy-900 hover:bg-slateNavy-800 border border-emerald-500/40 text-emerald-300 font-bold transition text-[10px]"
                            >
                              +سنة كاملة 🎁
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Credentials & Metrics Chips */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slateNavy-950 p-3 rounded-2xl border border-slateNavy-800">
                        <div>
                          <span className="text-[10px] text-slateNavy-400 block">رمز PIN المسير:</span>
                          <span className="font-mono font-bold text-white tracking-widest">{org.pin_code}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slateNavy-400 block">متوسط الخدمة:</span>
                          <span className="font-bold text-white">{org.avg_service_mins} دقيقة</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slateNavy-400 block">المسمى:</span>
                          <span className="font-bold text-slateNavy-200 truncate block">{org.sector_label} / {org.staff_title}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slateNavy-400 block">آخر تذكرة صادرة:</span>
                          <span className="font-bold text-emerald-400">#{org.last_issued_number}</span>
                        </div>
                      </div>

                      {org.notes && (
                        <p className="text-[11px] text-slateNavy-400 bg-slateNavy-950/40 px-3 py-1.5 rounded-xl border border-slateNavy-800/50 italic">
                          📝 ملاحظة: {org.notes}
                        </p>
                      )}
                    </div>

                    {/* Bottom Action Grid */}
                    <div className="space-y-2 pt-2 border-t border-slateNavy-800">
                      {/* Direct Links */}
                      <div className="grid grid-cols-3 gap-1.5 text-xs">
                        <Link
                          href={`/admin/${org.slug}`}
                          target="_blank"
                          className="py-2 px-2 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 rounded-xl font-bold flex items-center justify-center gap-1 transition text-center"
                        >
                          <Smartphone className="w-3.5 h-3.5 text-slateNavy-400" />
                          <span>ريموت المسير</span>
                        </Link>

                        <Link
                          href={`/display/${org.slug}`}
                          target="_blank"
                          className="py-2 px-2 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 rounded-xl font-bold flex items-center justify-center gap-1 transition text-center"
                        >
                          <Tv className="w-3.5 h-3.5 text-slateNavy-400" />
                          <span>شاشة التلفاز</span>
                        </Link>

                        <Link
                          href={`/q/${org.slug}`}
                          target="_blank"
                          className="py-2 px-2 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 rounded-xl font-bold flex items-center justify-center gap-1 transition text-center"
                        >
                          <QrCode className="w-3.5 h-3.5 text-slateNavy-400" />
                          <span>شاشة الزبون</span>
                        </Link>
                      </div>

                      {/* Management Controls: WhatsApp, Edit, Reset, Delete */}
                      <div className="flex items-center justify-between gap-1.5 pt-1">
                        <div className="flex items-center gap-1.5">
                          {waLink && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-1.5 px-3 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow"
                              title="مراسلة الطبيب مباشرة على واتساب"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>مراسلة واتساب</span>
                            </a>
                          )}

                          <button
                            onClick={() => copyLink(`/q/${org.slug}`, `رابط مراجعي ${org.name}`)}
                            className="py-1.5 px-2.5 bg-slateNavy-950 hover:bg-slateNavy-800 text-slateNavy-300 rounded-xl text-xs font-semibold border border-slateNavy-800 flex items-center gap-1 transition"
                            title="نسخ رابط المراجعين"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ الرابط</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(org)}
                            className="py-1.5 px-2.5 bg-slateNavy-800 hover:bg-slateNavy-750 text-slateNavy-200 rounded-xl text-xs font-bold border border-slateNavy-700 flex items-center gap-1 transition"
                            title="تعديل الإعدادات والباقة"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                            <span>تعديل</span>
                          </button>

                          <button
                            onClick={() => handleResetQueue(org.slug, org.name)}
                            className="py-1.5 px-2.5 bg-slateNavy-950 hover:bg-slateNavy-800 text-slateNavy-300 rounded-xl text-xs font-semibold border border-slateNavy-800 flex items-center gap-1 transition"
                            title="تصفير أرقام طابور اليوم"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                            <span>تصفير اليوم</span>
                          </button>

                          <button
                            onClick={() => handleDeleteOrg(org.slug, org.name)}
                            className="p-1.5 bg-rose-950/40 hover:bg-rose-950 text-rose-400 rounded-xl border border-rose-800/80 transition"
                            title="حذف المؤسسة نهائياً"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 5. LIVE RECENT PLATFORM ACTIVITY FEED */}
        {stats && stats.recentActivity.length > 0 && (
          <section className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>سجل أحدث التذاكر والعمليات المركزية لحظياً</span>
              </h3>
              <span className="text-[11px] text-slateNavy-400">آخر {stats.recentActivity.length} تذكرة</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slateNavy-800 text-slateNavy-400">
                    <th className="py-2.5 px-3">رقم التذكرة</th>
                    <th className="py-2.5 px-3">المؤسسة (Slug)</th>
                    <th className="py-2.5 px-3">المراجع</th>
                    <th className="py-2.5 px-3">الهاتف</th>
                    <th className="py-2.5 px-3">الحالة</th>
                    <th className="py-2.5 px-3">التوقيت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slateNavy-800/60">
                  {stats.recentActivity.map((t) => (
                    <tr key={t.id} className="hover:bg-slateNavy-950/40 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-white">#{t.ticket_number}</td>
                      <td className="py-2.5 px-3 font-mono text-slateNavy-300">/{t.org_slug}</td>
                      <td className="py-2.5 px-3 font-semibold text-slateNavy-100">{t.customer_name || 'مراجع حضوري'}</td>
                      <td className="py-2.5 px-3 font-mono text-slateNavy-300 dir-ltr">{t.customer_phone}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : t.status === 'waiting'
                            ? 'bg-sky-950 text-sky-300 border border-sky-800'
                            : t.status === 'held'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slateNavy-800 text-slateNavy-300'
                        }`}>
                          {t.status === 'completed' ? 'مكتملة' : t.status === 'waiting' ? 'ينتظر' : t.status === 'held' ? 'مؤجل' : t.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slateNavy-400 text-[11px]">
                        {new Date(t.created_at).toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* MODAL 1: CREATE ORGANIZATION */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 my-8">
              <div className="flex items-center justify-between pb-3 border-b border-slateNavy-800">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  <span>إضافة وتفعيل مؤسسة / عيادة جديدة</span>
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slateNavy-400 hover:text-white text-lg p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateOrg} className="space-y-3.5">
                <div>
                  <label className="block text-xs text-slateNavy-300 font-semibold mb-1">
                    اسم المؤسسة أو العيادة *
                  </label>
                  <input
                    type="text"
                    required
                    value={createName}
                    onChange={(e) => {
                      setCreateName(e.target.value);
                      if (!createSlug) {
                        setCreateSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                      }
                    }}
                    placeholder="مثال: عيادة النور لطب الأطفال"
                    className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slateNavy-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs text-slateNavy-300 font-semibold mb-1">
                      المعرف الرابط (Slug) *
                    </label>
                    <input
                      type="text"
                      required
                      value={createSlug}
                      onChange={(e) => setCreateSlug(e.target.value.toLowerCase())}
                      placeholder="clinic-nour"
                      className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slateNavy-500 text-left dir-ltr font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slateNavy-300 font-semibold mb-1">
                      رقم هاتف الطبيب / المسير (واتساب)
                    </label>
                    <input
                      type="text"
                      value={createContactPhone}
                      onChange={(e) => setCreateContactPhone(e.target.value)}
                      placeholder="0661234567"
                      className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slateNavy-500 text-left dir-ltr font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs text-slateNavy-300 font-semibold mb-1">
                      مسمى المراجع
                    </label>
                    <input
                      type="text"
                      value={createSectorLabel}
                      onChange={(e) => setCreateSectorLabel(e.target.value)}
                      placeholder="مريض / زبون / طالب"
                      className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slateNavy-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slateNavy-300 font-semibold mb-1">
                      مسمى المسير
                    </label>
                    <input
                      type="text"
                      value={createStaffTitle}
                      onChange={(e) => setCreateStaffTitle(e.target.value)}
                      placeholder="الطبيب / الحلاق"
                      className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slateNavy-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs text-slateNavy-300 font-semibold mb-1">
                      رمز PIN للمسير (سري)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={createPinCode}
                      onChange={(e) => setCreatePinCode(e.target.value)}
                      className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slateNavy-500 text-center font-mono font-bold tracking-widest"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slateNavy-300 font-semibold mb-1">
                      متوسط الخدمة (دقيقة)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={createAvgMins}
                      onChange={(e) => setCreateAvgMins(Number(e.target.value))}
                      className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slateNavy-500 text-center font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slateNavy-800 space-y-2">
                  <label className="block text-xs text-slateNavy-200 font-bold">
                    خطة الباقة المخصصة:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCreatePlan('starter')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${
                        createPlan === 'starter'
                          ? 'bg-slateNavy-100 text-slateNavy-950 border-white shadow'
                          : 'bg-slateNavy-950 text-slateNavy-400 border-slateNavy-800'
                      }`}
                    >
                      <span>أساسية</span>
                      <span className="block text-[10px] font-normal opacity-80 mt-0.5">1,500 دج</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCreatePlan('pro')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${
                        createPlan === 'pro'
                          ? 'bg-emerald-500 text-slateNavy-950 border-emerald-400 shadow font-black'
                          : 'bg-slateNavy-950 text-slateNavy-400 border-slateNavy-800'
                      }`}
                    >
                      <span>محترفة ⭐</span>
                      <span className="block text-[10px] font-normal opacity-80 mt-0.5">2,500 دج</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCreatePlan('elite')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${
                        createPlan === 'elite'
                          ? 'bg-amber-400 text-slateNavy-950 border-amber-300 shadow font-black'
                          : 'bg-slateNavy-950 text-slateNavy-400 border-slateNavy-800'
                      }`}
                    >
                      <span>نخبة VIP 👑</span>
                      <span className="block text-[10px] font-normal opacity-80 mt-0.5">3,000 دج</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCreateBillingCycle('monthly')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center ${
                      createBillingCycle === 'monthly'
                        ? 'bg-slateNavy-800 text-white border-slateNavy-600'
                        : 'bg-slateNavy-950 text-slateNavy-400 border-slateNavy-800'
                    }`}
                  >
                    دفع شهري (30 يوم)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateBillingCycle('yearly')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center ${
                      createBillingCycle === 'yearly'
                        ? 'bg-slateNavy-800 text-white border-slateNavy-600'
                        : 'bg-slateNavy-950 text-slateNavy-400 border-slateNavy-800'
                    }`}
                  >
                    دفع سنوي (365 يوم)
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-slateNavy-300 font-semibold mb-1">
                    ملاحظات إدارية (اختياري)
                  </label>
                  <input
                    type="text"
                    value={createNotes}
                    onChange={(e) => setCreateNotes(e.target.value)}
                    placeholder="مثال: دفع نقداً لمدة 6 أشهر، طلب تدريب المساعد..."
                    className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slateNavy-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black rounded-xl text-xs transition shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الإنشاء والتفعيل...' : 'حفظ وتفعيل المؤسسة فوراً'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: EDIT ORGANIZATION */}
        {editingOrg && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 my-8">
              <div className="flex items-center justify-between pb-3 border-b border-slateNavy-800">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-400" />
                  <span>تعديل إعدادات وباقة: {editingOrg.name}</span>
                </h3>
                <button
                  onClick={() => setEditingOrg(null)}
                  className="text-slateNavy-400 hover:text-white text-lg p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateOrg} className="space-y-3.5">
                <div>
                  <label className="block text-xs text-slateNavy-300 font-semibold mb-1">
                    اسم المؤسسة
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slateNavy-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs text-slateNavy-300 font-semibold mb-1">
                      رقم هاتف المسير (واتساب)
                    </label>
                    <input
                      type="text"
                      value={editContactPhone}
                      onChange={(e) => setEditContactPhone(e.target.value)}
                      placeholder="0661234567"
                      className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slateNavy-500 font-mono text-left dir-ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slateNavy-300 font-semibold mb-1">
                      رمز PIN السري للمسير
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={editPinCode}
                      onChange={(e) => setEditPinCode(e.target.value)}
                      className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slateNavy-500 text-center font-mono font-bold tracking-widest"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs text-slateNavy-300 font-semibold mb-1">
                      مسمى المراجع
                    </label>
                    <input
                      type="text"
                      value={editSectorLabel}
                      onChange={(e) => setEditSectorLabel(e.target.value)}
                      className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slateNavy-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slateNavy-300 font-semibold mb-1">
                      متوسط الخدمة (دقيقة)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={editAvgMins}
                      onChange={(e) => setEditAvgMins(Number(e.target.value))}
                      className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slateNavy-500 text-center font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slateNavy-800 space-y-2">
                  <label className="block text-xs text-slateNavy-200 font-bold">
                    ترقية / تغيير الباقة:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditPlan('starter')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${
                        editPlan === 'starter'
                          ? 'bg-slateNavy-100 text-slateNavy-950 border-white shadow'
                          : 'bg-slateNavy-950 text-slateNavy-400 border-slateNavy-800'
                      }`}
                    >
                      <span>أساسية</span>
                      <span className="block text-[10px] font-normal opacity-80 mt-0.5">1,500 دج</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditPlan('pro')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${
                        editPlan === 'pro'
                          ? 'bg-emerald-500 text-slateNavy-950 border-emerald-400 shadow font-black'
                          : 'bg-slateNavy-950 text-slateNavy-400 border-slateNavy-800'
                      }`}
                    >
                      <span>محترفة ⭐</span>
                      <span className="block text-[10px] font-normal opacity-80 mt-0.5">2,500 دج</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditPlan('elite')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${
                        editPlan === 'elite'
                          ? 'bg-amber-400 text-slateNavy-950 border-amber-300 shadow font-black'
                          : 'bg-slateNavy-950 text-slateNavy-400 border-slateNavy-800'
                      }`}
                    >
                      <span>نخبة VIP 👑</span>
                      <span className="block text-[10px] font-normal opacity-80 mt-0.5">3,000 دج</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditBillingCycle('monthly')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center ${
                      editBillingCycle === 'monthly'
                        ? 'bg-slateNavy-800 text-white border-slateNavy-600'
                        : 'bg-slateNavy-950 text-slateNavy-400 border-slateNavy-800'
                    }`}
                  >
                    دفع شهري
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditBillingCycle('yearly')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center ${
                      editBillingCycle === 'yearly'
                        ? 'bg-slateNavy-800 text-white border-slateNavy-600'
                        : 'bg-slateNavy-950 text-slateNavy-400 border-slateNavy-800'
                    }`}
                  >
                    دفع سنوي
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-slateNavy-300 font-semibold mb-1">
                    ملاحظات إدارية
                  </label>
                  <input
                    type="text"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slateNavy-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isEditingSubmitting}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slateNavy-950 font-black rounded-xl text-xs transition shadow-lg disabled:opacity-50"
                >
                  {isEditingSubmitting ? 'جاري الحفظ...' : 'تحديث البيانات وحفظ التغييرات'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}