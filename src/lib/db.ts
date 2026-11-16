import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { Organization, Ticket, QueueState, DailyStats, FeedbackRating } from './types';

// Store queue.db in project root or /tmp on serverless environments (Vercel / Netlify)
const isServerless = Boolean(process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
const dbDir = isServerless ? '/tmp' : (process.env.DB_DIR || process.cwd());
const dbPath = path.join(dbDir, 'queue.db');
let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(dbPath);
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    initDatabase(dbInstance);
  }
  return dbInstance;
}

function initDatabase(db: DatabaseSync): void {
  // 1. Create tables
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
      feedback_rating TEXT,
      feedback_created_at INTEGER,
      created_at INTEGER NOT NULL
    );
  `);

  // Migrate tickets table if columns are missing
  try {
    db.exec(`ALTER TABLE tickets ADD COLUMN feedback_rating TEXT;`);
  } catch {}
  try {
    db.exec(`ALTER TABLE tickets ADD COLUMN feedback_created_at INTEGER;`);
  } catch {}

  // 2. Seed default demo organizations if not present
  const countRow = db.prepare('SELECT COUNT(*) as count FROM organizations').get() as { count: number };
  if (!countRow || countRow.count === 0) {
    const insertOrg = db.prepare(`
      INSERT INTO organizations (slug, name, sector_label, staff_title, pin_code, avg_service_mins, current_ticket_number, last_issued_number)
      VALUES (?, ?, ?, ?, ?, ?, 0, 0)
    `);

    // Demo 1: Medical Clinic (عيادة الأمل الطبية)
    insertOrg.run('clinic-amal', 'عيادة الأمل الطبية (د. بوعلام)', 'مريض', 'الطبيب', '1234', 15);
    // Demo 2: Barbershop (صالون النخبة للرجال)
    insertOrg.run('barber-elite', 'صالون إيليت للحلاقة الرجالية', 'زبون', 'الحلاق', '1234', 20);
    // Demo 3: University Office (مصلحة الشؤون الطلابية)
    insertOrg.run('univ-g2', 'مصلحة الشؤون الطلابية (مدرج 2)', 'طالب', 'مسؤول الشباك', '1234', 10);
  }
}

// Format 24H Clock Time HH:MM from a given Date
export function formatClockTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Calculate wait time and clock time
export function calculateEstimatedWait(orgSlug: string, avgServiceMins: number): { estimatedWaitMins: number; estimatedClockTime: string; peopleAhead: number } {
  const db = getDb();
  const countRow = db.prepare(`
    SELECT COUNT(*) as ahead 
    FROM tickets 
    WHERE org_slug = ? AND status IN ('waiting', 'called', 'serving', 'held')
  `).get(orgSlug) as { ahead: number } | undefined;

  const peopleAhead = countRow ? Number(countRow.ahead) : 0;
  const estimatedWaitMins = peopleAhead * avgServiceMins;

  const targetTime = new Date(Date.now() + estimatedWaitMins * 60 * 1000);
  const estimatedClockTime = formatClockTime(targetTime);

  return { estimatedWaitMins, estimatedClockTime, peopleAhead };
}

// Get organization by slug
export function getOrganization(slug: string): Organization | null {
  const db = getDb();
  const org = db.prepare('SELECT * FROM organizations WHERE slug = ?').get(slug) as unknown as Organization | undefined;
  return org || null;
}

// Get all organizations
export function getAllOrganizations(): Organization[] {
  const db = getDb();
  return db.prepare('SELECT * FROM organizations ORDER BY id DESC').all() as unknown as Organization[];
}

// Create new organization (Super Admin)
export function createOrganization(data: {
  slug: string;
  name: string;
  sector_label: string;
  staff_title: string;
  pin_code: string;
  avg_service_mins: number;
}): Organization {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO organizations (slug, name, sector_label, staff_title, pin_code, avg_service_mins, current_ticket_number, last_issued_number, is_active)
    VALUES (?, ?, ?, ?, ?, ?, 0, 0, 1)
  `);
  stmt.run(
    data.slug.trim().toLowerCase(),
    data.name.trim(),
    data.sector_label.trim() || 'زبون',
    data.staff_title.trim() || 'المسير',
    data.pin_code.trim() || '1234',
    Number(data.avg_service_mins) || 15
  );
  return getOrganization(data.slug)!;
}

// Toggle organization active state
export function toggleOrganizationActive(slug: string): Organization | null {
  const db = getDb();
  const org = getOrganization(slug);
  if (!org) return null;
  const newStatus = org.is_active === 1 ? 0 : 1;
  db.prepare('UPDATE organizations SET is_active = ? WHERE slug = ?').run(newStatus, slug);
  return getOrganization(slug);
}

// Update average service duration
export function updateAvgServiceMins(slug: string, mins: number): Organization | null {
  const db = getDb();
  db.prepare('UPDATE organizations SET avg_service_mins = ? WHERE slug = ?').run(mins, slug);
  return getOrganization(slug);
}

// Issue a new ticket (Mandatory Phone Number)
export function issueTicket(
  orgSlug: string,
  customerPhone: string,
  customerName?: string,
  ticketType: 'qr' | 'walkin' = 'qr'
): Ticket {
  const db = getDb();
  const org = getOrganization(orgSlug);
  if (!org) {
    throw new Error('المؤسسة غير موجودة');
  }

  const cleanPhone = (customerPhone || '').trim().replace(/\s+/g, '');
  if (!cleanPhone || cleanPhone.length < 8) {
    throw new Error('رقم الهاتف إجباري ومطلوب لضمان تلقي التنبيهات ومتابعة دورك');
  }

  const nextNumber = org.last_issued_number + 1;
  const { estimatedWaitMins, estimatedClockTime } = calculateEstimatedWait(orgSlug, org.avg_service_mins);
  const now = Date.now();

  const insertStmt = db.prepare(`
    INSERT INTO tickets (org_slug, ticket_number, customer_name, customer_phone, ticket_type, status, estimated_wait_mins, estimated_clock_time, created_at)
    VALUES (?, ?, ?, ?, ?, 'waiting', ?, ?, ?)
  `);

  const info = insertStmt.run(
    orgSlug,
    nextNumber,
    customerName?.trim() || null,
    cleanPhone,
    ticketType,
    estimatedWaitMins,
    estimatedClockTime,
    now
  );

  // Update org last_issued_number
  db.prepare('UPDATE organizations SET last_issued_number = ? WHERE slug = ?').run(nextNumber, orgSlug);

  return db.prepare('SELECT * FROM tickets WHERE id = ?').get(info.lastInsertRowid) as unknown as Ticket;
}

// Lookup active ticket by phone number (Field recovery feature)
export function findActiveTicketByPhone(orgSlug: string, phone: string): Ticket | null {
  const db = getDb();
  const cleanPhone = phone.trim().replace(/\s+/g, '');
  if (!cleanPhone) return null;

  const ticket = db.prepare(`
    SELECT * FROM tickets 
    WHERE org_slug = ? 
      AND customer_phone LIKE ? 
      AND status IN ('waiting', 'called', 'serving', 'held')
    ORDER BY id DESC LIMIT 1
  `).get(orgSlug, `%${cleanPhone}%`) as unknown as Ticket | undefined;

  return ticket || null;
}

// Submit 1-tap experience feedback
export function submitTicketFeedback(
  identifier: { ticketId?: number; orgSlug?: string; ticketNumber?: number } | number,
  rating: FeedbackRating
): boolean {
  const db = getDb();
  let id: number | undefined;

  if (typeof identifier === 'number') {
    id = identifier;
  } else {
    id = identifier.ticketId;
    if (!id && identifier.orgSlug && identifier.ticketNumber) {
      const row = db.prepare(`
        SELECT id FROM tickets 
        WHERE org_slug = ? AND ticket_number = ? 
        ORDER BY id DESC LIMIT 1
      `).get(identifier.orgSlug, identifier.ticketNumber) as { id: number } | undefined;
      id = row?.id;
    }
  }

  if (!id) return false;

  const res = db.prepare(`
    UPDATE tickets 
    SET feedback_rating = ?, feedback_created_at = ? 
    WHERE id = ?
  `).run(rating, Date.now(), id);
  return Number(res.changes) > 0;
}

// Step 1: Call next ticket -> status becomes 'called' (waiting to enter)
export function callNextTicket(orgSlug: string): { currentTicket: Ticket | null; organization: Organization } {
  const db = getDb();
  const org = getOrganization(orgSlug);
  if (!org) throw new Error('المؤسسة غير موجودة');

  // If there's an existing active ticket in 'called' or 'serving', complete it
  db.prepare(`
    UPDATE tickets 
    SET status = 'completed' 
    WHERE org_slug = ? AND status IN ('called', 'serving')
  `).run(orgSlug);

  // Find next waiting ticket (ordered by ticket_number ASC)
  const nextTicket = db.prepare(`
    SELECT * FROM tickets 
    WHERE org_slug = ? AND status = 'waiting' 
    ORDER BY ticket_number ASC 
    LIMIT 1
  `).get(orgSlug) as unknown as Ticket | undefined;

  const now = Date.now();
  let currentNumber = 0;
  let activeTicket: Ticket | null = null;

  if (nextTicket) {
    db.prepare("UPDATE tickets SET status = 'called' WHERE id = ?").run(nextTicket.id);
    currentNumber = nextTicket.ticket_number;
    activeTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(nextTicket.id) as unknown as Ticket;
  }

  // Update organization state
  db.prepare(`
    UPDATE organizations 
    SET current_ticket_number = ?, 
        last_call_timestamp = ? 
    WHERE slug = ?
  `).run(currentNumber, now, orgSlug);

  const updatedOrg = getOrganization(orgSlug)!;
  return { currentTicket: activeTicket, organization: updatedOrg };
}

// Step 2: Confirm customer entered the room -> status becomes 'serving' (بالداخل)
export function confirmCustomerEntered(orgSlug: string, ticketId?: number): { currentTicket: Ticket | null; organization: Organization } {
  const db = getDb();
  const org = getOrganization(orgSlug);
  if (!org) throw new Error('المؤسسة غير موجودة');

  let targetId = ticketId;
  if (!targetId) {
    const currentCalled = db.prepare(`
      SELECT id FROM tickets 
      WHERE org_slug = ? AND status = 'called' 
      LIMIT 1
    `).get(orgSlug) as { id: number } | undefined;
    targetId = currentCalled?.id;
  }

  if (targetId) {
    db.prepare("UPDATE tickets SET status = 'serving' WHERE id = ?").run(targetId);
  }

  const updatedTicket = targetId
    ? (db.prepare('SELECT * FROM tickets WHERE id = ?').get(targetId) as unknown as Ticket)
    : null;

  return { currentTicket: updatedTicket, organization: org };
}

// Step 3: Complete service and exit -> status becomes 'completed' (خرج وانتهت الخدمة)
export function completeCurrentTicket(orgSlug: string, ticketId?: number): { organization: Organization } {
  const db = getDb();
  const org = getOrganization(orgSlug);
  if (!org) throw new Error('المؤسسة غير موجودة');

  const now = Date.now();
  let newAvg = org.avg_service_mins;

  // Calculate rolling average duration if last_call_timestamp exists
  if (org.last_call_timestamp) {
    const deltaMins = Math.round((now - Number(org.last_call_timestamp)) / (1000 * 60));
    if (deltaMins >= 2 && deltaMins <= 60) {
      newAvg = Math.round((org.avg_service_mins * 0.7) + (deltaMins * 0.3));
    }
  }

  if (ticketId) {
    db.prepare("UPDATE tickets SET status = 'completed' WHERE id = ?").run(ticketId);
  } else {
    db.prepare(`
      UPDATE tickets 
      SET status = 'completed' 
      WHERE org_slug = ? AND status IN ('called', 'serving')
    `).run(orgSlug);
  }

  db.prepare(`
    UPDATE organizations 
    SET current_ticket_number = 0, 
        avg_service_mins = ? 
    WHERE slug = ?
  `).run(newAvg, orgSlug);

  const updatedOrg = getOrganization(orgSlug)!;
  return { organization: updatedOrg };
}

// Hold ticket if customer did not arrive yet (Smart Hold)
export function holdCurrentTicket(orgSlug: string): { heldTicket: Ticket | null; organization: Organization } {
  const db = getDb();
  const org = getOrganization(orgSlug);
  if (!org) throw new Error('المؤسسة غير موجودة');

  const activeTicket = db.prepare(`
    SELECT * FROM tickets 
    WHERE org_slug = ? AND status IN ('called', 'serving') 
    LIMIT 1
  `).get(orgSlug) as unknown as Ticket | undefined;

  let heldTicket: Ticket | null = null;
  if (activeTicket) {
    db.prepare("UPDATE tickets SET status = 'held' WHERE id = ?").run(activeTicket.id);
    heldTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(activeTicket.id) as unknown as Ticket;
  }

  db.prepare(`
    UPDATE organizations 
    SET current_ticket_number = 0 
    WHERE slug = ?
  `).run(orgSlug);

  const updatedOrg = getOrganization(orgSlug)!;
  return { heldTicket, organization: updatedOrg };
}

// Recall held ticket immediately (حضر الآن - إدخال فوري)
export function recallHeldTicket(orgSlug: string, ticketId: number): { currentTicket: Ticket | null; organization: Organization } {
  const db = getDb();

  db.prepare(`
    UPDATE tickets 
    SET status = 'completed' 
    WHERE org_slug = ? AND status IN ('called', 'serving')
  `).run(orgSlug);

  db.prepare("UPDATE tickets SET status = 'called' WHERE id = ? AND org_slug = ?").run(ticketId, orgSlug);

  const recalled = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId) as unknown as Ticket | undefined;
  if (recalled) {
    db.prepare('UPDATE organizations SET current_ticket_number = ? WHERE slug = ?').run(recalled.ticket_number, orgSlug);
  }

  const updatedOrg = getOrganization(orgSlug)!;
  return { currentTicket: recalled || null, organization: updatedOrg };
}

// Reset daily queue
export function resetDailyQueue(orgSlug: string): Organization {
  const db = getDb();
  db.prepare(`
    UPDATE tickets 
    SET status = 'cancelled' 
    WHERE org_slug = ? AND status IN ('waiting', 'called', 'serving', 'held')
  `).run(orgSlug);

  db.prepare(`
    UPDATE organizations 
    SET current_ticket_number = 0, 
        last_issued_number = 0, 
        last_call_timestamp = NULL 
    WHERE slug = ?
  `).run(orgSlug);

  return getOrganization(orgSlug)!;
}

// Get full queue state for admin or customer
export function getQueueState(orgSlug: string, ticketNumber?: number): QueueState | null {
  const db = getDb();
  const organization = getOrganization(orgSlug);
  if (!organization) return null;

  const currentTicket = (db.prepare(`
    SELECT * FROM tickets 
    WHERE org_slug = ? AND status IN ('serving', 'called') 
    ORDER BY CASE WHEN status = 'serving' THEN 1 ELSE 2 END ASC, id DESC
    LIMIT 1
  `).get(orgSlug) as unknown as Ticket | undefined) || null;

  const heldTickets = db.prepare(`
    SELECT * FROM tickets 
    WHERE org_slug = ? AND status = 'held' 
    ORDER BY ticket_number ASC
  `).all(orgSlug) as unknown as Ticket[];

  const waitingTickets = db.prepare(`
    SELECT * FROM tickets 
    WHERE org_slug = ? AND status = 'waiting' 
    ORDER BY ticket_number ASC
  `).all(orgSlug) as unknown as Ticket[];

  const completedCountRow = db.prepare(`
    SELECT COUNT(*) as count 
    FROM tickets 
    WHERE org_slug = ? AND status = 'completed'
  `).get(orgSlug) as { count: number } | undefined;

  let myTicketStatus: any = null;
  if (ticketNumber) {
    const t = db.prepare(`
      SELECT status FROM tickets 
      WHERE org_slug = ? AND ticket_number = ? 
      ORDER BY id DESC LIMIT 1
    `).get(orgSlug, ticketNumber) as { status: string } | undefined;
    if (t) {
      myTicketStatus = t.status;
    }
  }

  const stats = getDailyStats(orgSlug);

  return {
    organization,
    currentTicket,
    heldTickets,
    waitingTickets,
    completedCount: completedCountRow ? Number(completedCountRow.count) : 0,
    totalWaiting: waitingTickets.length,
    stats,
    myTicketStatus,
  };
}

// Cancel a ticket (by staff or customer)
export function cancelTicket(ticketId: number, orgSlug: string): boolean {
  const db = getDb();
  const res = db.prepare(`
    UPDATE tickets 
    SET status = 'cancelled' 
    WHERE id = ? AND org_slug = ? AND status IN ('waiting', 'called', 'held')
  `).run(ticketId, orgSlug);
  return Number(res.changes) > 0;
}

// Get daily statistics for an organization
export function getDailyStats(orgSlug: string): DailyStats {
  const db = getDb();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startTs = startOfDay.getTime();

  const totalRow = db.prepare(`SELECT COUNT(*) as c FROM tickets WHERE org_slug = ? AND created_at >= ?`).get(orgSlug, startTs) as { c: number } | undefined;
  const completedRow = db.prepare(`SELECT COUNT(*) as c FROM tickets WHERE org_slug = ? AND status = 'completed' AND created_at >= ?`).get(orgSlug, startTs) as { c: number } | undefined;
  const heldRow = db.prepare(`SELECT COUNT(*) as c FROM tickets WHERE org_slug = ? AND status = 'held'`).get(orgSlug) as { c: number } | undefined;
  const cancelledRow = db.prepare(`SELECT COUNT(*) as c FROM tickets WHERE org_slug = ? AND status = 'cancelled' AND created_at >= ?`).get(orgSlug, startTs) as { c: number } | undefined;
  const waitingRow = db.prepare(`SELECT COUNT(*) as c FROM tickets WHERE org_slug = ? AND status = 'waiting'`).get(orgSlug) as { c: number } | undefined;

  const greatRow = db.prepare(`SELECT COUNT(*) as c FROM tickets WHERE org_slug = ? AND feedback_rating = 'great' AND created_at >= ?`).get(orgSlug, startTs) as { c: number } | undefined;
  const okayRow = db.prepare(`SELECT COUNT(*) as c FROM tickets WHERE org_slug = ? AND feedback_rating = 'okay' AND created_at >= ?`).get(orgSlug, startTs) as { c: number } | undefined;
  const badRow = db.prepare(`SELECT COUNT(*) as c FROM tickets WHERE org_slug = ? AND feedback_rating = 'bad' AND created_at >= ?`).get(orgSlug, startTs) as { c: number } | undefined;

  return {
    totalIssued: totalRow ? Number(totalRow.c) : 0,
    totalCompleted: completedRow ? Number(completedRow.c) : 0,
    totalHeld: heldRow ? Number(heldRow.c) : 0,
    totalCancelled: cancelledRow ? Number(cancelledRow.c) : 0,
    currentWaiting: waitingRow ? Number(waitingRow.c) : 0,
    ratings: {
      great: greatRow ? Number(greatRow.c) : 0,
      okay: okayRow ? Number(okayRow.c) : 0,
      bad: badRow ? Number(badRow.c) : 0,
    },
  };
}

// Get single ticket by org_slug and ticket_number
export function getTicket(orgSlug: string, ticketNumber: number): Ticket | null {
  const db = getDb();
  const ticket = db.prepare(`
    SELECT * FROM tickets 
    WHERE org_slug = ? AND ticket_number = ?
    ORDER BY id DESC LIMIT 1
  `).get(orgSlug, ticketNumber) as unknown as Ticket | undefined;
  return ticket || null;
}
