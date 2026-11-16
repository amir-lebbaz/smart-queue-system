'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Plus, 
  ExternalLink, 
  Sliders, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Clock, 
  Users, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { Organization } from '@/lib/types';

export default function SuperAdminPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 sm:p-8" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                👑
              </span>
              <h1 className="text-xl sm:text-2xl font-black">لوحة المالك (Super Admin)</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              إدارة المشتركين والمؤسسات، تفعيل الاشتراكات، ومراقبة الطوابير المركزية
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              الرئيسية
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مؤسسة / عيادة جديدة</span>
            </button>
          </div>
        </header>

        {/* Organizations Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>المؤسسات المسجلة في النظام ({orgs.length})</span>
            <span>التكلفة العتادية: 0 دج (بدون شاشات وبدون طابعات)</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">جاري التحميل...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orgs.map((org) => (
                <div
                  key={org.id}
                  className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition"
                >
                  <div>
                    {/* Header with Active Toggle */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-base text-white">{org.name}</h3>
                        <p className="text-[11px] font-mono text-slate-400">slug: {org.slug}</p>
                      </div>

                      <button
                        onClick={() => handleToggleActive(org.slug)}
                        title="تغيير حالة التفعيل"
                        className={`text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition ${
                          org.is_active === 1
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                        }`}
                      >
                        {org.is_active === 1 ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            مفعل
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            معطل
                          </>
                        )}
                      </button>
                    </div>

                    {/* Metadata chips */}
                    <div className="grid grid-cols-2 gap-2 my-3 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-500 block">المسمى:</span>
                        <span className="text-slate-300 font-semibold">{org.sector_label} • {org.staff_title}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">متوسط الخدمة:</span>
                        <span className="text-sky-400 font-semibold">{org.avg_service_mins} دقيقة</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">رمز PIN المسير:</span>
                        <span className="font-mono text-amber-400 font-semibold">{org.pin_code}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">آخر تذكرة:</span>
                        <span className="text-slate-300 font-semibold">#{org.last_issued_number}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Links */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                    <Link
                      href={`/admin/${org.slug}`}
                      target="_blank"
                      className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <span>ريموت المسير</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>

                    <Link
                      href={`/q/${org.slug}`}
                      target="_blank"
                      className="py-2 px-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <span>شاشة الزبون QR</span>
                      <ExternalLink className="w-3 h-3" />
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  إضافة مشترك / عيادة / صالون جديد
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateOrg} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">
                    المعرف الرابط (Slug) بالإنجليزية
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    placeholder="clinic-nour"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 text-left dir-ltr font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">
                      مسمى المراجع
                    </label>
                    <input
                      type="text"
                      value={sectorLabel}
                      onChange={(e) => setSectorLabel(e.target.value)}
                      placeholder="مريض / زبون / طالب"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">
                      مسمى المسير
                    </label>
                    <input
                      type="text"
                      value={staffTitle}
                      onChange={(e) => setStaffTitle(e.target.value)}
                      placeholder="الطبيب / الحلاق"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">
                      رمز PIN للمسير
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 text-center font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">
                      متوسط الخدمة (دقيقة)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={avgMins}
                      onChange={(e) => setAvgMins(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 text-center font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition shadow-lg disabled:opacity-50"
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
