import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { Organization, Ticket, QueueState, DailyStats, FeedbackRating, TicketStatus, TicketType, SubscriptionPlan, BillingCycle, GlobalSystemStats } from './types';

// Supabase Cloud Configuration (Default shared cluster for instant cross-device synchronization)
const SUPABASE_URL = process.env.SUPABASE_URL || "https://mtuhuzmyhbemdfsbyhpf.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dWh1em15aGJlbWRmc2J5aHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjIxNDAsImV4cCI6MjA5MjQ5ODE0MH0.Pip_Y_FfjJvnOHxnAMNUlHMBLkGefVxH2dVMsXaIQ08";

const isCloudEnabled = Boolean(SUPABASE_URL && SUPABASE_KEY);

// Helper for Supabase REST API
async function supaFetch<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers: Record<string, string> = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Supabase request [${res.status}] failed: ${errorText}`);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

// Fallback SQLite instance for offline/local development without network
let dbInstance: DatabaseSync | null = null;
function getSqliteDb(): DatabaseSync {
  if (!dbInstance) {
    const dbDir = process.env.DB_DIR || process.cwd();
    const dbPath = path.join(dbDir, 'queue.db');
    dbInstance = new DatabaseSync(dbPath);
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    initSqliteDatabase(dbInstance);
  }
  return dbInstance;
}

function initSqliteDatabase(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      sector_label TEXT NOT NULL DEFAULT 'زبون',
      staff_title TEXT NOT NULL DEFAULT 'المسير',
      pin_code TEXT NOT NULL DEFAULT '1234',
      avg_service_mins INTEGER NOT NULL DEFAULT 15,
      current_ticket_number INTEGER NOT NULL DEFAULT 0,
      last_issued_number INTEGER NOT NULL DEFAULT 0,
      last_call_timestamp INTEGER,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      org_slug TEXT NOT NULL,
      ticket_number INTEGER NOT NULL,
      customer_name TEXT,
      customer_phone TEXT NOT NULL,
      ticket_type TEXT NOT NULL DEFAULT 'qr',
      status TEXT NOT NULL DEFAULT 'waiting',
      estimated_wait_mins INTEGER NOT NULL,
      estimated_clock_time TEXT NOT NULL,
      is_present INTEGER DEFAULT 0,
      feedback_rating TEXT,
      feedback_created_at INTEGER,
      created_at INTEGER NOT NULL
    );
  `);

  try {
    db.exec('ALTER TABLE tickets ADD COLUMN is_present INTEGER DEFAULT 0;');
  } catch {
    // Column already exists
  }

  const count = db.prepare('SELECT COUNT(*) as count FROM organizations').get() as { count: number };
  if (count.count === 0) {
    db.prepare(`
      INSERT INTO organizations (slug, name, sector_label, staff_title, pin_code, avg_service_mins, current_ticket_number, last_issued_number, is_active)
      VALUES 
        ('clinic-amal', 'عيادة الأمل الطبية', 'مريض', 'الطبيب', '1234', 15, 0, 0, 1),
        ('barber-elite', 'صالون إيليت للحلاقة الرجالية', 'زبون', 'الحلاق', '1234', 20, 0, 0, 1),
        ('univ-g2', 'مصلحة الشؤون الطلابية (مدرج 2)', 'طالب', 'مسؤول الشباك', '1234', 10, 0, 0, 1)
    `).run();
  }
}

// -------------------------------------------------------------
// UNIFIED CLOUD-FIRST ASYNC DATABASE API
// -------------------------------------------------------------

export async function getOrganization(slug: string): Promise<Organization | null> {
  if (isCloudEnabled) {
    try {
      const rows = await supaFetch<Organization[]>(`queue_organizations?slug=eq.${encodeURIComponent(slug)}&limit=1`);
      return rows && rows.length > 0 ? rows[0] : null;
    } catch (e) {
      console.warn('Cloud getOrganization error, falling back to SQLite', e);
    }
  }
  const db = getSqliteDb();
  const org = db.prepare('SELECT * FROM organizations WHERE slug = ?').get(slug) as unknown as Organization | undefined;
  return org || null;
}

export async function getAllOrganizations(): Promise<Organization[]> {
  if (isCloudEnabled) {
    try {
      const rows = await supaFetch<Organization[]>('queue_organizations?order=id.desc');
      return rows || [];
    } catch (e) {
      console.warn('Cloud getAllOrganizations error, falling back to SQLite', e);
    }
  }
  const db = getSqliteDb();
  return db.prepare('SELECT * FROM organizations ORDER BY id DESC').all() as unknown as Organization[];
}

export async function createOrganization(data: {
  slug: string;
  name: string;
  sector_label: string;
  staff_title: string;
  pin_code: string;
  avg_service_mins: number;
  plan?: SubscriptionPlan;
  billing_cycle?: BillingCycle;
  contact_phone?: string;
  notes?: string;
  subscription_expires_at?: number;
}): Promise<Organization> {
  const cleanSlug = data.slug.trim().toLowerCase();
  const selectedPlan = data.plan || 'pro';
  const selectedCycle = data.billing_cycle || 'monthly';
  const now = Date.now();
  const defaultExpiresAt = data.subscription_expires_at || (selectedCycle === 'yearly' ? now + 365 * 86400 * 1000 : now + 30 * 86400 * 1000);

  if (isCloudEnabled) {
    try {
      const rows = await supaFetch<Organization[]>('queue_organizations', {
        method: 'POST',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify({
          slug: cleanSlug,
          name: data.name.trim(),
          sector_label: data.sector_label.trim() || 'زبون',
          staff_title: data.staff_title.trim() || 'المسير',
          pin_code: data.pin_code.trim() || '1234',
          avg_service_mins: Number(data.avg_service_mins) || 15,
          current_ticket_number: 0,
          last_issued_number: 0,
          is_active: 1,
          plan: selectedPlan,
          billing_cycle: selectedCycle,
          subscription_expires_at: defaultExpiresAt,
          contact_phone: data.contact_phone ? data.contact_phone.trim() : null,
          notes: data.notes ? data.notes.trim() : null,
          created_at: now,
        }),
      });
      return rows[0];
    } catch (e) {
      console.warn('Cloud createOrganization error, falling back to SQLite', e);
    }
  }
  const db = getSqliteDb();
  db.prepare(`
    INSERT INTO organizations (slug, name, sector_label, staff_title, pin_code, avg_service_mins, current_ticket_number, last_issued_number, is_active)
    VALUES (?, ?, ?, ?, ?, ?, 0, 0, 1)
  `).run(
    cleanSlug,
    data.name.trim(),
    data.sector_label.trim() || 'زبون',
    data.staff_title.trim() || 'المسير',
    data.pin_code.trim() || '1234',
    Number(data.avg_service_mins) || 15
  );
  return (await getOrganization(cleanSlug))!;
}

export async function toggleOrganizationActive(slug: string): Promise<Organization | null> {
  const org = await getOrganization(slug);
  if (!org) return null;
  const newStatus = org.is_active === 1 ? 0 : 1;

  if (isCloudEnabled) {
    try {
      const rows = await supaFetch<Organization[]>(`queue_organizations?slug=eq.${encodeURIComponent(slug)}`, {
        method: 'PATCH',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify({ is_active: newStatus }),
      });
      return rows[0];
    } catch (e) {
      console.warn('Cloud toggleOrganizationActive error', e);
    }
  }

  const db = getSqliteDb();
  db.prepare('UPDATE organizations SET is_active = ? WHERE slug = ?').run(newStatus, slug);
  return getOrganization(slug);
}

export async function updateOrganizationSettings(
  slug: string,
  updates: {
    avg_service_mins?: number;
    pin_code?: string;
    name?: string;
    sector_label?: string;
    staff_title?: string;
    plan?: SubscriptionPlan;
    billing_cycle?: BillingCycle;
    subscription_expires_at?: number | null;
    contact_phone?: string | null;
    notes?: string | null;
    is_active?: number;
  }
): Promise<Organization | null> {
  const patchData: Record<string, string | number | null> = {};
  if (typeof updates.avg_service_mins === 'number') patchData.avg_service_mins = updates.avg_service_mins;
  if (updates.pin_code && updates.pin_code.trim()) patchData.pin_code = updates.pin_code.trim();
  if (updates.name && updates.name.trim()) patchData.name = updates.name.trim();
  if (updates.sector_label && updates.sector_label.trim()) patchData.sector_label = updates.sector_label.trim();
  if (updates.staff_title && updates.staff_title.trim()) patchData.staff_title = updates.staff_title.trim();
  if (updates.plan) patchData.plan = updates.plan;
  if (updates.billing_cycle) patchData.billing_cycle = updates.billing_cycle;
  if (typeof updates.subscription_expires_at !== 'undefined') patchData.subscription_expires_at = updates.subscription_expires_at;
  if (typeof updates.contact_phone !== 'undefined') patchData.contact_phone = updates.contact_phone ? updates.contact_phone.trim() : null;
  if (typeof updates.notes !== 'undefined') patchData.notes = updates.notes ? updates.notes.trim() : null;
  if (typeof updates.is_active === 'number') patchData.is_active = updates.is_active;

  if (Object.keys(patchData).length === 0) return getOrganization(slug);

  if (isCloudEnabled) {
    try {
      const rows = await supaFetch<Organization[]>(`queue_organizations?slug=eq.${encodeURIComponent(slug)}`, {
        method: 'PATCH',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify(patchData),
      });
      return rows[0];
    } catch (e) {
      console.warn('Cloud updateOrganizationSettings error', e);
    }
  }

  const db = getSqliteDb();
  if (patchData.avg_service_mins) {
    db.prepare('UPDATE organizations SET avg_service_mins = ? WHERE slug = ?').run(patchData.avg_service_mins, slug);
  }
  if (patchData.pin_code) {
    db.prepare('UPDATE organizations SET pin_code = ? WHERE slug = ?').run(patchData.pin_code, slug);
  }
  if (patchData.name) {
    db.prepare('UPDATE organizations SET name = ? WHERE slug = ?').run(patchData.name, slug);
  }
  if (typeof patchData.is_active === 'number') {
    db.prepare('UPDATE organizations SET is_active = ? WHERE slug = ?').run(patchData.is_active, slug);
  }
  return getOrganization(slug);
}

export async function deleteOrganization(slug: string): Promise<boolean> {
  const cleanSlug = slug.trim().toLowerCase();
  if (isCloudEnabled) {
    try {
      await supaFetch(`queue_tickets?org_slug=eq.${encodeURIComponent(cleanSlug)}`, { method: 'DELETE' });
      await supaFetch(`queue_organizations?slug=eq.${encodeURIComponent(cleanSlug)}`, { method: 'DELETE' });
      return true;
    } catch (e) {
      console.warn('Cloud deleteOrganization error', e);
    }
  }
  const db = getSqliteDb();
  db.prepare('DELETE FROM tickets WHERE org_slug = ?').run(cleanSlug);
  db.prepare('DELETE FROM organizations WHERE slug = ?').run(cleanSlug);
  return true;
}

export async function getGlobalSystemStats(): Promise<GlobalSystemStats> {
  const startPing = Date.now();
  let orgs: Organization[] = [];
  let allTickets: Ticket[] = [];
  let cloudWorking = false;

  if (isCloudEnabled) {
    try {
      const [orgRows, ticketRows] = await Promise.all([
        supaFetch<Organization[]>('queue_organizations?order=id.desc'),
        supaFetch<Ticket[]>('queue_tickets?order=created_at.desc&limit=150'),
      ]);
      orgs = orgRows || [];
      allTickets = ticketRows || [];
      cloudWorking = true;
    } catch (e) {
      console.warn('Cloud getGlobalSystemStats error, falling back to SQLite', e);
    }
  }

  if (!cloudWorking) {
    const db = getSqliteDb();
    orgs = db.prepare('SELECT * FROM organizations ORDER BY id DESC').all() as unknown as Organization[];
    allTickets = db.prepare('SELECT * FROM tickets ORDER BY created_at DESC LIMIT 150').all() as unknown as Ticket[];
  }

  const latencyMs = Date.now() - startPing;

  // Plan distribution & financials
  let starterCount = 0;
  let proCount = 0;
  let eliteCount = 0;
  let activeCount = 0;
  let inactiveCount = 0;

  for (const org of orgs) {
    if (org.is_active === 1) activeCount++;
    else inactiveCount++;

    const p = org.plan || 'pro';
    if (p === 'starter') starterCount++;
    else if (p === 'elite') eliteCount++;
    else proCount++;
  }

  // Monthly revenue calculation:
  // Starter = 1,500 DZD, Pro = 2,500 DZD, Elite = 3,000 DZD
  const estimatedMRR = (starterCount * 1500) + (proCount * 2500) + (eliteCount * 3000);
  const estimatedARR = estimatedMRR * 12;

  // Ticket stats
  let totalIssued = 0;
  let waitingNow = 0;
  let completed = 0;
  let held = 0;
  let greatRatings = 0;
  let ratedTotal = 0;

  for (const t of allTickets) {
    totalIssued++;
    if (t.status === 'waiting') waitingNow++;
    else if (t.status === 'completed') completed++;
    else if (t.status === 'held') held++;

    if (t.feedback_rating) {
      ratedTotal++;
      if (t.feedback_rating === 'great' || t.feedback_rating === 'okay') greatRatings++;
    }
  }

  const satisfactionRate = ratedTotal > 0 ? Math.round((greatRatings / ratedTotal) * 100) : 98;

  // Recent 10 activities
  const recentActivity = allTickets.slice(0, 10).map((t) => ({
    id: t.id,
    org_slug: t.org_slug,
    ticket_number: t.ticket_number,
    customer_name: t.customer_name,
    customer_phone: t.customer_phone,
    status: t.status,
    created_at: t.created_at,
  }));

  return {
    totalOrgs: orgs.length,
    activeOrgs: activeCount,
    inactiveOrgs: inactiveCount,
    planCounts: {
      starter: starterCount,
      pro: proCount,
      elite: eliteCount,
    },
    financials: {
      estimatedMRR,
      estimatedARR,
    },
    tickets: {
      totalIssued: orgs.reduce((acc, o) => acc + (o.last_issued_number || 0), 0) || totalIssued,
      waitingNow,
      completed,
      held,
      satisfactionRate,
    },
    systemHealth: {
      cloudConnected: cloudWorking,
      dbProvider: cloudWorking ? 'Supabase Cloud (PostgreSQL 17)' : 'Local SQLite (Fallback)',
      latencyMs,
      checkedAt: Date.now(),
    },
    recentActivity,
  };
}

export async function updateAvgServiceMins(slug: string, mins: number): Promise<Organization | null> {
  return updateOrganizationSettings(slug, { avg_service_mins: mins });
}

export async function getOrganizationTickets(slug: string): Promise<Ticket[]> {
  if (isCloudEnabled) {
    try {
      const rows = await supaFetch<Ticket[]>(
        `queue_tickets?org_slug=eq.${encodeURIComponent(slug)}&order=ticket_number.asc`
      );
      return rows || [];
    } catch (e) {
      console.warn('Cloud getOrganizationTickets error', e);
    }
  }
  const db = getSqliteDb();
  return db.prepare('SELECT * FROM tickets WHERE org_slug = ? ORDER BY ticket_number ASC').all(slug) as unknown as Ticket[];
}

export async function issueTicket(
  orgSlug: string,
  customerPhone: string,
  customerName?: string,
  ticketType: TicketType = 'qr'
): Promise<Ticket> {
  const cleanPhone = customerPhone.trim().replace(/\s+/g, '');
  if (!cleanPhone || cleanPhone.length < 8) {
    throw new Error('رقم الهاتف إجباري (8 أرقام على الأقل) لضمان متابعة دورك واستلام التنبيهات');
  }

  const org = await getOrganization(orgSlug);
  if (!org) throw new Error('المؤسسة غير موجودة');
  if (org.is_active === 0) {
    throw new Error('تم إيقاف استقبال الحجوزات مؤقتاً لهذه المؤسسة، يرجى مراجعة إدارة المؤسسة');
  }

  const nextNumber = (org.last_issued_number || 0) + 1;

  if (isCloudEnabled) {
    try {
      const ticket = await supaFetch<Ticket>('rpc/issue_next_ticket', {
        method: 'POST',
        body: JSON.stringify({
          p_org_slug: orgSlug,
          p_customer_phone: cleanPhone,
          p_customer_name: customerName ? customerName.trim() : null,
          p_ticket_type: ticketType,
        }),
      });
      if (ticket) return ticket;
    } catch (e: unknown) {
      console.warn('Atomic RPC issueTicket error, falling back', e);
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('المؤسسة غير موجودة') || msg.includes('تم إيقاف استقبال')) {
        throw e;
      }
    }
  }

  // SQLite fallback
  const db = getSqliteDb();
  const waitingCount = db.prepare("SELECT COUNT(*) as count FROM tickets WHERE org_slug = ? AND status = 'waiting'").get(orgSlug) as { count: number };
  const peopleAhead = waitingCount ? waitingCount.count : 0;
  const estWaitMins = Math.max(0, peopleAhead * org.avg_service_mins);

  const now = new Date();
  const target = new Date(now.getTime() + estWaitMins * 60 * 1000);
  const estClockTime = target.toLocaleTimeString('ar-DZ', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const res = db.prepare(`
    INSERT INTO tickets (org_slug, ticket_number, customer_name, customer_phone, ticket_type, status, estimated_wait_mins, estimated_clock_time, created_at)
    VALUES (?, ?, ?, ?, ?, 'waiting', ?, ?, ?)
  `).run(
    orgSlug,
    nextNumber,
    customerName ? customerName.trim() : null,
    cleanPhone,
    ticketType,
    estWaitMins,
    estClockTime,
    Date.now()
  );

  db.prepare('UPDATE organizations SET last_issued_number = ? WHERE slug = ?').run(nextNumber, orgSlug);
  return db.prepare('SELECT * FROM tickets WHERE id = ?').get(res.lastInsertRowid) as unknown as Ticket;
}

export async function getTicket(orgSlug: string, ticketNumber: number): Promise<Ticket | null> {
  if (isCloudEnabled) {
    try {
      const rows = await supaFetch<Ticket[]>(`queue_tickets?org_slug=eq.${encodeURIComponent(orgSlug)}&ticket_number=eq.${ticketNumber}&order=id.desc&limit=1`);
      return rows && rows.length > 0 ? rows[0] : null;
    } catch (e) {
      console.warn('Cloud getTicket error', e);
    }
  }
  const db = getSqliteDb();
  const ticket = db.prepare('SELECT * FROM tickets WHERE org_slug = ? AND ticket_number = ? ORDER BY id DESC LIMIT 1').get(orgSlug, ticketNumber) as unknown as Ticket | undefined;
  return ticket || null;
}

export async function findActiveTicketByPhone(orgSlug: string, phone: string): Promise<Ticket | null> {
  const cleanPhone = phone.trim().replace(/\s+/g, '');
  if (!cleanPhone) return null;

  if (isCloudEnabled) {
    try {
      const rows = await supaFetch<Ticket[]>(
        `queue_tickets?org_slug=eq.${encodeURIComponent(orgSlug)}&customer_phone=ilike.*${encodeURIComponent(cleanPhone)}*&status=in.(waiting,called,serving,held)&order=id.desc&limit=1`
      );
      return rows && rows.length > 0 ? rows[0] : null;
    } catch (e) {
      console.warn('Cloud findActiveTicketByPhone error', e);
    }
  }

  const db = getSqliteDb();
  const ticket = db.prepare(`
    SELECT * FROM tickets 
    WHERE org_slug = ? 
      AND customer_phone LIKE ? 
      AND status IN ('waiting', 'called', 'serving', 'held')
    ORDER BY id DESC LIMIT 1
  `).get(orgSlug, `%${cleanPhone}%`) as unknown as Ticket | undefined;

  return ticket || null;
}

export async function submitTicketFeedback(
  identifier: { ticketId?: number; orgSlug?: string; ticketNumber?: number } | number,
  rating: FeedbackRating
): Promise<boolean> {
  let id: number | undefined;

  if (typeof identifier === 'number') {
    id = identifier;
  } else {
    id = identifier.ticketId;
    if (!id && identifier.orgSlug && identifier.ticketNumber) {
      const row = await getTicket(identifier.orgSlug, identifier.ticketNumber);
      id = row?.id;
    }
  }

  if (!id) return false;

  if (isCloudEnabled) {
    try {
      await supaFetch(`queue_tickets?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ feedback_rating: rating, feedback_created_at: Date.now() }),
      });
      return true;
    } catch (e) {
      console.warn('Cloud submitTicketFeedback error', e);
    }
  }

  const db = getSqliteDb();
  const res = db.prepare('UPDATE tickets SET feedback_rating = ?, feedback_created_at = ? WHERE id = ?').run(rating, Date.now(), id);
  return Number(res.changes) > 0;
}

export async function checkinTicket(orgSlug: string, ticketNumber: number): Promise<boolean> {
  if (isCloudEnabled) {
    try {
      await supaFetch(
        `queue_tickets?org_slug=eq.${encodeURIComponent(orgSlug)}&ticket_number=eq.${ticketNumber}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ is_present: true }),
        }
      );
      return true;
    } catch (e) {
      console.warn('Cloud checkinTicket error', e);
    }
  }

  const db = getSqliteDb();
  try {
    db.prepare('UPDATE tickets SET is_present = 1 WHERE org_slug = ? AND ticket_number = ?').run(orgSlug, ticketNumber);
    return true;
  } catch {
    return false;
  }
}

export async function callNextTicket(orgSlug: string): Promise<{ currentTicket: Ticket | null; organization: Organization }> {
  const org = await getOrganization(orgSlug);
  if (!org) throw new Error('المؤسسة غير موجودة');

  if (isCloudEnabled) {
    try {
      const res = await supaFetch<{ currentTicket: Ticket | null; organization: Organization }>('rpc/call_next_ticket', {
        method: 'POST',
        body: JSON.stringify({ p_org_slug: orgSlug }),
      });
      if (res && res.organization) return res;
    } catch (e) {
      console.warn('Atomic RPC callNextTicket error, falling back', e);
    }
  }

  // SQLite fallback
  const db = getSqliteDb();
  db.prepare("UPDATE tickets SET status = 'completed' WHERE org_slug = ? AND status IN ('called', 'serving')").run(orgSlug);
  const nextTicket = db.prepare("SELECT * FROM tickets WHERE org_slug = ? AND status = 'waiting' ORDER BY ticket_number ASC LIMIT 1").get(orgSlug) as unknown as Ticket | undefined;

  let currentNumber = 0;
  let activeTicket: Ticket | null = null;
  if (nextTicket) {
    db.prepare("UPDATE tickets SET status = 'called' WHERE id = ?").run(nextTicket.id);
    currentNumber = nextTicket.ticket_number;
    activeTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(nextTicket.id) as unknown as Ticket;
  }

  db.prepare('UPDATE organizations SET current_ticket_number = ?, last_call_timestamp = ? WHERE slug = ?').run(currentNumber, Date.now(), orgSlug);
  return { currentTicket: activeTicket, organization: (await getOrganization(orgSlug))! };
}

export async function confirmCustomerEntered(orgSlug: string, ticketId?: number): Promise<{ currentTicket: Ticket | null; organization: Organization }> {
  const org = await getOrganization(orgSlug);
  if (!org) throw new Error('المؤسسة غير موجودة');

  if (isCloudEnabled) {
    try {
      let targetId = ticketId;
      if (!targetId) {
        const called = await supaFetch<Ticket[]>(`queue_tickets?org_slug=eq.${encodeURIComponent(orgSlug)}&status=eq.called&limit=1`);
        if (called && called.length > 0) targetId = called[0].id;
      }

      let updatedTicket: Ticket | null = null;
      if (targetId) {
        const patched = await supaFetch<Ticket[]>(`queue_tickets?id=eq.${targetId}`, {
          method: 'PATCH',
          headers: { 'Prefer': 'return=representation' },
          body: JSON.stringify({ status: 'serving' }),
        });
        if (patched && patched.length > 0) updatedTicket = patched[0];
      }

      return { currentTicket: updatedTicket, organization: org };
    } catch (e) {
      console.warn('Cloud confirmCustomerEntered error', e);
    }
  }

  const db = getSqliteDb();
  let targetId = ticketId;
  if (!targetId) {
    const currentCalled = db.prepare("SELECT id FROM tickets WHERE org_slug = ? AND status = 'called' LIMIT 1").get(orgSlug) as { id: number } | undefined;
    targetId = currentCalled?.id;
  }
  if (targetId) {
    db.prepare("UPDATE tickets SET status = 'serving' WHERE id = ?").run(targetId);
  }
  const updatedTicket = targetId ? (db.prepare('SELECT * FROM tickets WHERE id = ?').get(targetId) as unknown as Ticket) : null;
  return { currentTicket: updatedTicket, organization: org };
}

export async function completeCurrentTicket(orgSlug: string, ticketId?: number): Promise<{ organization: Organization }> {
  const org = await getOrganization(orgSlug);
  if (!org) throw new Error('المؤسسة غير موجودة');

  const now = Date.now();
  let newAvg = org.avg_service_mins;
  if (org.last_call_timestamp) {
    const deltaMins = Math.round((now - Number(org.last_call_timestamp)) / (1000 * 60));
    if (deltaMins >= 2 && deltaMins <= 60) {
      newAvg = Math.round((org.avg_service_mins * 0.7) + (deltaMins * 0.3));
    }
  }

  if (isCloudEnabled) {
    try {
      if (ticketId) {
        await supaFetch(`queue_tickets?id=eq.${ticketId}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'completed' }),
        });
      } else {
        await supaFetch(`queue_tickets?org_slug=eq.${encodeURIComponent(orgSlug)}&status=in.(called,serving)`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'completed' }),
        });
      }

      const updatedOrgs = await supaFetch<Organization[]>(`queue_organizations?slug=eq.${encodeURIComponent(orgSlug)}`, {
        method: 'PATCH',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify({ current_ticket_number: 0, avg_service_mins: newAvg }),
      });

      return { organization: updatedOrgs[0] };
    } catch (e) {
      console.warn('Cloud completeCurrentTicket error', e);
    }
  }

  const db = getSqliteDb();
  if (ticketId) {
    db.prepare("UPDATE tickets SET status = 'completed' WHERE id = ?").run(ticketId);
  } else {
    db.prepare("UPDATE tickets SET status = 'completed' WHERE org_slug = ? AND status IN ('called', 'serving')").run(orgSlug);
  }
  db.prepare('UPDATE organizations SET current_ticket_number = 0, avg_service_mins = ? WHERE slug = ?').run(newAvg, orgSlug);
  return { organization: (await getOrganization(orgSlug))! };
}

export async function holdCurrentTicket(orgSlug: string): Promise<{ heldTicket: Ticket | null; organization: Organization }> {
  const org = await getOrganization(orgSlug);
  if (!org) throw new Error('المؤسسة غير موجودة');

  if (isCloudEnabled) {
    try {
      const active = await supaFetch<Ticket[]>(`queue_tickets?org_slug=eq.${encodeURIComponent(orgSlug)}&status=in.(called,serving)&limit=1`);
      let heldTicket: Ticket | null = null;
      if (active && active.length > 0) {
        const patched = await supaFetch<Ticket[]>(`queue_tickets?id=eq.${active[0].id}`, {
          method: 'PATCH',
          headers: { 'Prefer': 'return=representation' },
          body: JSON.stringify({ status: 'held', is_present: false }),
        });
        heldTicket = patched[0];
      }

      const updatedOrgs = await supaFetch<Organization[]>(`queue_organizations?slug=eq.${encodeURIComponent(orgSlug)}`, {
        method: 'PATCH',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify({ current_ticket_number: 0 }),
      });

      return { heldTicket, organization: updatedOrgs[0] };
    } catch (e) {
      console.warn('Cloud holdCurrentTicket error', e);
    }
  }

  const db = getSqliteDb();
  const activeTicket = db.prepare("SELECT * FROM tickets WHERE org_slug = ? AND status IN ('called', 'serving') LIMIT 1").get(orgSlug) as unknown as Ticket | undefined;
  let heldTicket: Ticket | null = null;
  if (activeTicket) {
    db.prepare("UPDATE tickets SET status = 'held', is_present = 0 WHERE id = ?").run(activeTicket.id);
    heldTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(activeTicket.id) as unknown as Ticket;
  }
  db.prepare('UPDATE organizations SET current_ticket_number = 0 WHERE slug = ?').run(orgSlug);
  return { heldTicket, organization: (await getOrganization(orgSlug))! };
}

export async function recallHeldTicket(orgSlug: string, ticketId: number): Promise<{ currentTicket: Ticket | null; organization: Organization }> {
  const callTime = Date.now();
  if (isCloudEnabled) {
    try {
      await supaFetch(`queue_tickets?org_slug=eq.${encodeURIComponent(orgSlug)}&status=in.(called,serving)`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'completed' }),
      });

      const patched = await supaFetch<Ticket[]>(`queue_tickets?id=eq.${ticketId}&org_slug=eq.${encodeURIComponent(orgSlug)}`, {
        method: 'PATCH',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify({ status: 'called' }),
      });

      const recalled = patched && patched.length > 0 ? patched[0] : null;
      const currentNumber = recalled ? recalled.ticket_number : 0;

      const updatedOrgs = await supaFetch<Organization[]>(`queue_organizations?slug=eq.${encodeURIComponent(orgSlug)}`, {
        method: 'PATCH',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify({ 
          current_ticket_number: currentNumber,
          last_call_timestamp: callTime,
        }),
      });

      return { currentTicket: recalled, organization: updatedOrgs[0] };
    } catch (e) {
      console.warn('Cloud recallHeldTicket error', e);
    }
  }

  const db = getSqliteDb();
  db.prepare("UPDATE tickets SET status = 'completed' WHERE org_slug = ? AND status IN ('called', 'serving')").run(orgSlug);
  db.prepare("UPDATE tickets SET status = 'called' WHERE id = ? AND org_slug = ?").run(ticketId, orgSlug);
  const recalled = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId) as unknown as Ticket | undefined;
  if (recalled) {
    db.prepare('UPDATE organizations SET current_ticket_number = ?, last_call_timestamp = ? WHERE slug = ?').run(recalled.ticket_number, callTime, orgSlug);
  }
  return { currentTicket: recalled || null, organization: (await getOrganization(orgSlug))! };
}

export async function repeatCall(orgSlug: string): Promise<Organization | null> {
  const now = Date.now();
  if (isCloudEnabled) {
    try {
      const updated = await supaFetch<Organization[]>(`queue_organizations?slug=eq.${encodeURIComponent(orgSlug)}`, {
        method: 'PATCH',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify({ last_call_timestamp: now }),
      });
      return updated && updated.length > 0 ? updated[0] : null;
    } catch (e) {
      console.warn('Cloud repeatCall error', e);
    }
  }
  const db = getSqliteDb();
  db.prepare('UPDATE organizations SET last_call_timestamp = ? WHERE slug = ?').run(now, orgSlug);
  return getOrganization(orgSlug);
}

export async function cancelTicket(ticketId: number, orgSlug: string): Promise<boolean> {
  if (isCloudEnabled) {
    try {
      await supaFetch(`queue_tickets?id=eq.${ticketId}&org_slug=eq.${encodeURIComponent(orgSlug)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'cancelled' }),
      });
      return true;
    } catch (e) {
      console.warn('Cloud cancelTicket error', e);
    }
  }

  const db = getSqliteDb();
  const res = db.prepare("UPDATE tickets SET status = 'cancelled' WHERE id = ? AND org_slug = ?").run(ticketId, orgSlug);
  return Number(res.changes) > 0;
}

export async function resetDailyQueue(orgSlug: string): Promise<Organization> {
  if (isCloudEnabled) {
    try {
      await supaFetch(`queue_tickets?org_slug=eq.${encodeURIComponent(orgSlug)}&status=in.(waiting,called,serving,held)`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'cancelled' }),
      });

      const updatedOrgs = await supaFetch<Organization[]>(`queue_organizations?slug=eq.${encodeURIComponent(orgSlug)}`, {
        method: 'PATCH',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify({
          current_ticket_number: 0,
          last_issued_number: 0,
          last_call_timestamp: null,
        }),
      });

      return updatedOrgs[0];
    } catch (e) {
      console.warn('Cloud resetDailyQueue error', e);
    }
  }

  const db = getSqliteDb();
  db.prepare("UPDATE tickets SET status = 'cancelled' WHERE org_slug = ? AND status IN ('waiting', 'called', 'serving', 'held')").run(orgSlug);
  db.prepare('UPDATE organizations SET current_ticket_number = 0, last_issued_number = 0, last_call_timestamp = NULL WHERE slug = ?').run(orgSlug);
  return (await getOrganization(orgSlug))!;
}

export async function getQueueState(
  orgSlug: string, 
  ticketNumber?: number,
  ticketId?: number
): Promise<QueueState | null> {
  const organization = await getOrganization(orgSlug);
  if (!organization) return null;

  if (isCloudEnabled) {
    try {
      const summary = await supaFetch<QueueState>('rpc/get_queue_summary', {
        method: 'POST',
        body: JSON.stringify({
          p_org_slug: orgSlug,
          p_ticket_id: ticketId || null,
          p_ticket_number: ticketNumber || null,
        }),
      });
      if (summary && summary.organization) {
        return summary;
      }
    } catch (e) {
      console.warn('Atomic RPC getQueueState error, falling back to manual cloud query', e);
    }

    try {
      // 1. Serving ticket or Called ticket
      const serving = await supaFetch<Ticket[]>(
        `queue_tickets?org_slug=eq.${encodeURIComponent(orgSlug)}&status=eq.serving&order=id.desc&limit=1`
      );
      let currentTicket: Ticket | null = serving && serving.length > 0 ? serving[0] : null;

      if (!currentTicket) {
        const called = await supaFetch<Ticket[]>(
          `queue_tickets?org_slug=eq.${encodeURIComponent(orgSlug)}&status=eq.called&order=id.desc&limit=1`
        );
        if (called && called.length > 0) currentTicket = called[0];
      }

      // 2. Held tickets
      const heldTickets =
        (await supaFetch<Ticket[]>(
          `queue_tickets?org_slug=eq.${encodeURIComponent(orgSlug)}&status=eq.held&order=ticket_number.asc`
        )) || [];

      // 3. Waiting tickets
      const waitingTickets =
        (await supaFetch<Ticket[]>(
          `queue_tickets?org_slug=eq.${encodeURIComponent(orgSlug)}&status=eq.waiting&order=ticket_number.asc`
        )) || [];

      // 4. Stats & Completed count
      const allTickets =
        (await supaFetch<{ status: string; feedback_rating: string | null }[]>(
          `queue_tickets?org_slug=eq.${encodeURIComponent(orgSlug)}&select=status,feedback_rating`
        )) || [];

      let completedCount = 0;
      let totalHeld = 0;
      let totalCancelled = 0;
      const ratings = { great: 0, okay: 0, bad: 0 };

      for (const t of allTickets) {
        if (t.status === 'completed') completedCount++;
        else if (t.status === 'held') totalHeld++;
        else if (t.status === 'cancelled') totalCancelled++;

        if (t.feedback_rating === 'great') ratings.great++;
        else if (t.feedback_rating === 'okay') ratings.okay++;
        else if (t.feedback_rating === 'bad') ratings.bad++;
      }

      // 5. Customer ticket status if queried (ticketId takes absolute priority)
      let myTicketStatus: TicketStatus | null = null;
      if (ticketId) {
        const myT = await supaFetch<Ticket[]>(
          `queue_tickets?id=eq.${ticketId}&limit=1`
        );
        if (myT && myT.length > 0) {
          myTicketStatus = myT[0].status;
        }
      } else if (ticketNumber) {
        const myT = await supaFetch<Ticket[]>(
          `queue_tickets?org_slug=eq.${encodeURIComponent(orgSlug)}&ticket_number=eq.${ticketNumber}&order=id.desc&limit=1`
        );
        if (myT && myT.length > 0) {
          myTicketStatus = myT[0].status;
        }
      }

      const stats: DailyStats = {
        totalIssued: organization.last_issued_number,
        totalCompleted: completedCount,
        totalHeld,
        totalCancelled,
        currentWaiting: waitingTickets.length,
        ratings,
      };

      return {
        organization,
        currentTicket,
        heldTickets,
        waitingTickets,
        completedCount,
        totalWaiting: waitingTickets.length,
        stats,
        myTicketStatus,
      };
    } catch (e) {
      console.warn('Cloud getQueueState error, falling back to SQLite', e);
    }
  }

  // SQLite fallback
  const db = getSqliteDb();
  const currentTicket = (db.prepare(`
    SELECT * FROM tickets 
    WHERE org_slug = ? AND status IN ('serving', 'called') 
    ORDER BY CASE WHEN status = 'serving' THEN 1 ELSE 2 END ASC, id DESC
    LIMIT 1
  `).get(orgSlug) as unknown as Ticket | undefined) || null;

  const heldTickets = db.prepare("SELECT * FROM tickets WHERE org_slug = ? AND status = 'held' ORDER BY ticket_number ASC").all(orgSlug) as unknown as Ticket[];
  const waitingTickets = db.prepare("SELECT * FROM tickets WHERE org_slug = ? AND status = 'waiting' ORDER BY ticket_number ASC").all(orgSlug) as unknown as Ticket[];
  const completedCountRow = db.prepare("SELECT COUNT(*) as count FROM tickets WHERE org_slug = ? AND status = 'completed'").get(orgSlug) as { count: number } | undefined;

  let myTicketStatus: TicketStatus | null = null;
  if (ticketId) {
    const t = db.prepare('SELECT status FROM tickets WHERE id = ?').get(ticketId) as { status: TicketStatus } | undefined;
    if (t) myTicketStatus = t.status;
  } else if (ticketNumber) {
    const t = db.prepare('SELECT status FROM tickets WHERE org_slug = ? AND ticket_number = ? ORDER BY id DESC LIMIT 1').get(orgSlug, ticketNumber) as { status: TicketStatus } | undefined;
    if (t) myTicketStatus = t.status;
  }

  const allTickets = db.prepare('SELECT status, feedback_rating FROM tickets WHERE org_slug = ?').all(orgSlug) as { status: string; feedback_rating: string | null }[];
  let completedCount = 0;
  let totalHeld = 0;
  let totalCancelled = 0;
  const ratings = { great: 0, okay: 0, bad: 0 };

  for (const t of allTickets) {
    if (t.status === 'completed') completedCount++;
    else if (t.status === 'held') totalHeld++;
    else if (t.status === 'cancelled') totalCancelled++;
    if (t.feedback_rating === 'great') ratings.great++;
    else if (t.feedback_rating === 'okay') ratings.okay++;
    else if (t.feedback_rating === 'bad') ratings.bad++;
  }

  const stats: DailyStats = {
    totalIssued: organization.last_issued_number,
    totalCompleted: completedCountRow ? Number(completedCountRow.count) : completedCount,
    totalHeld,
    totalCancelled,
    currentWaiting: waitingTickets.length,
    ratings,
  };

  return {
    organization,
    currentTicket,
    heldTickets,
    waitingTickets,
    completedCount: stats.totalCompleted,
    totalWaiting: waitingTickets.length,
    stats,
    myTicketStatus,
  };
}
