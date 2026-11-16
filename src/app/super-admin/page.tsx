'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { Organization } from '@/lib/types';

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterPin, setMasterPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
    // Authorized Master PINs: 8039 (last 4 digits of phone 0666568039) or 0666568039 or 2026
    const clean = masterPin.trim();
    if (clean === '8039' || clean === '0666568039' || clean === '2026') {
      setIsAuthenticated(true);
      setPinError(false);
      sessionStorage.setItem('queue_super_admin_auth', 'true');
    } else {
      setPinError(true);
      setMasterPin('');
    }
  };

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sectorLabel, setSectorLabel] = useState('زبون');
  const [staffTitle, setStaffTitle] = useState('المسير');
  const [pinCode, setPinCode] = useState('1234');
  const [avgMins, setAvgMins] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrgs = async () => {
    try {
      const res = await fetch('/api/organizations');
      const data = await res.json();
      if (data.success) {
        setOrgs(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch orgs', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          sector_label: sectorLabel,
          staff_title: staffTitle,
          pin_code: pinCode,
          avg_service_mins: Number(avgMins),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setName('');
        setSlug('');
        fetchOrgs();
      } else {
        alert(data.error || 'فشل في إنشاء المؤسسة');
      }
    } catch {
      alert('خطأ في الاتصال بالخادم');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (slug: string) => {
    try {
      const res = await fetch(`/api/organizations/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_active' }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrgs();
      }
    } catch {
      alert('فشل في تعديل حالة الاشتراك');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slateNavy-950 text-slateNavy-100 flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-sm bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-6 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 bg-slateNavy-800 text-slateNavy-100 rounded-2xl flex items-center justify-center mx-auto border border-slateNavy-700">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-black text-white">منطقة المالك المحمية</h1>
            <p className="text-xs text-slateNavy-400 mt-1">هذه الصفحة خاصة بمالك النظام فقط لإدارة وتفعيل المؤسسات</p>
          </div>

          <form onSubmit={handleMasterLogin} className="space-y-3">
            <input
              type="password"
              required
              placeholder="أدخل رمز المالك السري..."
              value={masterPin}
              onChange={(e) => setMasterPin(e.target.value)}
              className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2.5 text-center text-sm font-bold text-white focus:outline-none focus:border-slateNavy-400"
            />
            {pinError && (
              <p className="text-xs text-rose-400 font-medium">الرمز السري غير صحيح! الدخول محمي بالكامل.</p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 bg-slateNavy-100 hover:bg-white text-slateNavy-950 font-bold rounded-xl text-xs transition"
            >
              دخول المشرف الرئيسي
            </button>
          </form>

          <div className="pt-3 border-t border-slateNavy-800">
            <Link href="/" className="text-xs text-slateNavy-400 hover:text-white transition">
              ← العودة للموقع الترويجي الرئيسي
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slateNavy-950 text-slateNavy-100 p-4 sm:p-8" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slateNavy-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-slateNavy-900 border border-slateNavy-800 text-slateNavy-100 flex items-center justify-center font-bold">
                👑
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slateNavy-100">لوحة المالك (Super Admin)</h1>
            </div>
            <p className="text-xs sm:text-sm text-slateNavy-400 mt-1">
              إدارة المشتركين والمؤسسات، تفعيل الاشتراكات، ومراقبة الطوابير المركزية
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="py-2.5 px-4 bg-slateNavy-900 hover:bg-slateNavy-800 border border-slateNavy-800 text-slateNavy-100 rounded-xl text-xs font-semibold transition"
            >
              الرئيسية
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="py-2.5 px-4 bg-slateNavy-100 hover:bg-white text-slateNavy-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مؤسسة / عيادة جديدة</span>
            </button>
          </div>
        </header>

        {/* Organizations Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slateNavy-400">
            <span>المؤسسات المسجلة في النظام ({orgs.length})</span>
            <span>التكلفة العتادية: 0 دج</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slateNavy-400 text-sm">جاري التحميل...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orgs.map((org) => (
                <div
                  key={org.id}
                  className="bg-slateNavy-900 border border-slateNavy-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slateNavy-700 transition"
                >
                  <div>
                    {/* Header with Active Toggle */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-base text-slateNavy-100">{org.name}</h3>
                        <p className="text-[11px] font-mono text-slateNavy-400">slug: {org.slug}</p>
                      </div>

                      <button
                        onClick={() => handleToggleActive(org.slug)}
                        title="تغيير حالة التفعيل"
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 transition border ${
                          org.is_active === 1
                            ? 'bg-slateNavy-800 border-slateNavy-700 text-slateNavy-100'
                            : 'bg-rose-950/40 border-rose-800 text-rose-300'
                        }`}
                      >
                        {org.is_active === 1 ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            مفعل
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-400" />
                            معطل
                          </>
                        )}
                      </button>
                    </div>

                    {/* Metadata chips */}
                    <div className="grid grid-cols-2 gap-2 my-3 text-[11px] bg-slateNavy-950 p-2.5 rounded-xl border border-slateNavy-800">
                      <div>
                        <span className="text-slateNavy-400 block text-[10px]">المسمى:</span>
                        <span className="text-slateNavy-100 font-semibold">{org.sector_label} • {org.staff_title}</span>
                      </div>
                      <div>
                        <span className="text-slateNavy-400 block text-[10px]">متوسط الخدمة:</span>
                        <span className="text-slateNavy-100 font-semibold">{org.avg_service_mins} دقيقة</span>
                      </div>
                      <div>
                        <span className="text-slateNavy-400 block text-[10px]">رمز PIN للمسير:</span>
                        <span className="font-mono text-slateNavy-100 font-semibold">{org.pin_code}</span>
                      </div>
                      <div>
                        <span className="text-slateNavy-400 block text-[10px]">آخر تذكرة:</span>
                        <span className="text-slateNavy-100 font-semibold">#{org.last_issued_number}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Links */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slateNavy-800">
                    <Link
                      href={`/admin/${org.slug}`}
                      target="_blank"
                      className="py-2 px-2.5 bg-slateNavy-800 hover:bg-slateNavy-700 text-slateNavy-100 border border-slateNavy-700 rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <span>ريموت المسير</span>
                      <ExternalLink className="w-3 h-3 text-slateNavy-400" />
                    </Link>

                    <Link
                      href={`/q/${org.slug}`}
                      target="_blank"
                      className="py-2 px-2.5 bg-slateNavy-950 hover:bg-slateNavy-800 border border-slateNavy-800 text-slateNavy-100 rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <span>شاشة الزبون</span>
                      <ExternalLink className="w-3 h-3 text-slateNavy-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modal: Create Org */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slateNavy-900 border border-slateNavy-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slateNavy-800">
                <h3 className="text-base font-bold text-slateNavy-100 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-slateNavy-400" />
                  إضافة مؤسسة / عيادة جديدة
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slateNavy-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateOrg} className="space-y-3">
                <div>
                  <label className="block text-xs text-slateNavy-400 font-semibold mb-1">
                    اسم المؤسسة أو العيادة
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!slug) {
                        setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                      }
                    }}
                    placeholder="مثال: عيادة النور لطب الأطفال"
                    className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-sm text-slateNavy-100 focus:outline-none focus:border-slateNavy-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slateNavy-400 font-semibold mb-1">
                    المعرف الرابط (Slug) بالإنجليزية
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    placeholder="clinic-nour"
                    className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-sm text-slateNavy-100 focus:outline-none focus:border-slateNavy-400 text-left dir-ltr font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slateNavy-400 font-semibold mb-1">
                      مسمى المراجع
                    </label>
                    <input
                      type="text"
                      value={sectorLabel}
                      onChange={(e) => setSectorLabel(e.target.value)}
                      placeholder="مريض / زبون / طالب"
                      className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-sm text-slateNavy-100 focus:outline-none focus:border-slateNavy-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slateNavy-400 font-semibold mb-1">
                      مسمى المسير
                    </label>
                    <input
                      type="text"
                      value={staffTitle}
                      onChange={(e) => setStaffTitle(e.target.value)}
                      placeholder="الطبيب / الحلاق"
                      className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-sm text-slateNavy-100 focus:outline-none focus:border-slateNavy-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slateNavy-400 font-semibold mb-1">
                      رمز PIN للمسير
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-sm text-slateNavy-100 focus:outline-none focus:border-slateNavy-400 text-center font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slateNavy-400 font-semibold mb-1">
                      متوسط الخدمة (دقيقة)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={avgMins}
                      onChange={(e) => setAvgMins(Number(e.target.value))}
                      className="w-full bg-slateNavy-950 border border-slateNavy-800 rounded-xl px-3 py-2 text-sm text-slateNavy-100 focus:outline-none focus:border-slateNavy-400 text-center font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-3 bg-slateNavy-100 hover:bg-white text-slateNavy-950 font-bold rounded-xl text-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الإضافة...' : 'حفظ وإنشاء المؤسسة'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
