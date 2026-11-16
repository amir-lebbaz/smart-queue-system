import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { Organization, Ticket, QueueState } from './types';

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
      customer_phone TEXT,
      ticket_type TEXT NOT NULL DEFAULT 'qr',
      status TEXT NOT NULL DEFAULT 'waiting',
      estimated_wait_mins INTEGER NOT NULL,
      estimated_clock_time TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

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
    WHERE org_slug = ? AND status IN ('waiting', 'serving', 'held')
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

// Issue a new ticket (QR or Walk-in)
export function issueTicket(
  orgSlug: string,
  customerName?: string,
  customerPhone?: string,
  ticketType: 'qr' | 'walkin' = 'qr'
): Ticket {
  const db = getDb();
  const org = getOrganization(orgSlug);
  if (!org) {
    throw new Error('Organization not found');
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
    customerPhone?.trim() || null,
    ticketType,
    estimatedWaitMins,
    estimatedClockTime,
    now
  );

  // Update org last_issued_number
  db.prepare('UPDATE organizations SET last_issued_number = ? WHERE slug = ?').run(nextNumber, orgSlug);

  return db.prepare('SELECT * FROM tickets WHERE id = ?').get(info.lastInsertRowid) as unknown as Ticket;
}

// Call next ticket (+1)
export function callNextTicket(orgSlug: string): { currentTicket: Ticket | null; organization: Organization } {
  const db = getDb();
  const org = getOrganization(orgSlug);
  if (!org) throw new Error('Organization not found');

  // Complete any currently serving ticket
  db.prepare(`
    UPDATE tickets 
    SET status = 'completed' 
    WHERE org_slug = ? AND status = 'serving'
  `).run(orgSlug);

  // Find next waiting ticket (ordered by ticket_number ASC)
  const nextTicket = db.prepare(`
    SELECT * FROM tickets 
    WHERE org_slug = ? AND status = 'waiting' 
    ORDER BY ticket_number ASC 
    LIMIT 1
  `).get(orgSlug) as unknown as Ticket | undefined;

  const now = Date.now();
  let newAvg = org.avg_service_mins;

  // Dynamic Rolling average update: if last_call_timestamp exists and delta_mins between 2 and 60
  if (org.last_call_timestamp) {
    const deltaMins = Math.round((now - Number(org.last_call_timestamp)) / (1000 * 60));
    if (deltaMins >= 2 && deltaMins <= 60) {
      newAvg = Math.round((org.avg_service_mins * 0.7) + (deltaMins * 0.3));
    }
  }

  let currentNumber = 0;
  if (nextTicket) {
    db.prepare("UPDATE tickets SET status = 'serving' WHERE id = ?").run(nextTicket.id);
    currentNumber = nextTicket.ticket_number;
  }

  // Update organization state
  db.prepare(`
    UPDATE organizations 
    SET current_ticket_number = ?, 
        last_call_timestamp = ?, 
        avg_service_mins = ? 
    WHERE slug = ?
  `).run(currentNumber, now, newAvg, orgSlug);

  const updatedOrg = getOrganization(orgSlug)!;
  const activeTicket = nextTicket ? (db.prepare('SELECT * FROM tickets WHERE id = ?').get(nextTicket.id) as unknown as Ticket) : null;

  return { currentTicket: activeTicket, organization: updatedOrg };
}

// Hold currently serving ticket (Smart Hold)
export function holdCurrentTicket(orgSlug: string): { heldTicket: Ticket | null; nextTicket: Ticket | null; organization: Organization } {
  const db = getDb();
  const org = getOrganization(orgSlug);
  if (!org) throw new Error('Organization not found');

  // Find currently serving ticket
  const servingTicket = db.prepare(`
    SELECT * FROM tickets 
    WHERE org_slug = ? AND status = 'serving' 
    LIMIT 1
  `).get(orgSlug) as unknown as Ticket | undefined;

  let heldTicket: Ticket | null = null;
  if (servingTicket) {
    db.prepare("UPDATE tickets SET status = 'held' WHERE id = ?").run(servingTicket.id);
    heldTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(servingTicket.id) as unknown as Ticket;
  }

  // Immediately advance queue to next waiting ticket
  const nextWaiting = db.prepare(`
    SELECT * FROM tickets 
    WHERE org_slug = ? AND status = 'waiting' 
    ORDER BY ticket_number ASC 
    LIMIT 1
  `).get(orgSlug) as unknown as Ticket | undefined;

  let newCurrentNumber = 0;
  let activeNext: Ticket | null = null;

  if (nextWaiting) {
    db.prepare("UPDATE tickets SET status = 'serving' WHERE id = ?").run(nextWaiting.id);
    newCurrentNumber = nextWaiting.ticket_number;
    activeNext = db.prepare('SELECT * FROM tickets WHERE id = ?').get(nextWaiting.id) as unknown as Ticket;
  }

  db.prepare(`
    UPDATE organizations 
    SET current_ticket_number = ? 
    WHERE slug = ?
  `).run(newCurrentNumber, orgSlug);

  const updatedOrg = getOrganization(orgSlug)!;
  return { heldTicket, nextTicket: activeNext, organization: updatedOrg };
}

// Recall held ticket immediately (حضر الآن - إدخال فوري)
export function recallHeldTicket(orgSlug: string, ticketId: number): { currentTicket: Ticket | null; organization: Organization } {
  const db = getDb();

  // If there is another currently serving ticket, mark it completed or move it
  db.prepare(`
    UPDATE tickets 
    SET status = 'completed' 
    WHERE org_slug = ? AND status = 'serving'
  `).run(orgSlug);

  // Set the held ticket to 'serving'
  db.prepare("UPDATE tickets SET status = 'serving' WHERE id = ? AND org_slug = ?").run(ticketId, orgSlug);

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
  // Mark remaining waiting/serving/held as cancelled
  db.prepare(`
    UPDATE tickets 
    SET status = 'cancelled' 
    WHERE org_slug = ? AND status IN ('waiting', 'serving', 'held')
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
export function getQueueState(orgSlug: string): QueueState | null {
  const db = getDb();
  const organization = getOrganization(orgSlug);
  if (!organization) return null;

  const currentTicket = (db.prepare(`
    SELECT * FROM tickets 
    WHERE org_slug = ? AND status = 'serving' 
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

  const stats = getDailyStats(orgSlug);

  return {
    organization,
    currentTicket,
    heldTickets,
    waitingTickets,
    completedCount: completedCountRow ? Number(completedCountRow.count) : 0,
    totalWaiting: waitingTickets.length,
    stats,
  };
}

// Cancel a ticket (by staff or customer)
export function cancelTicket(ticketId: number, orgSlug: string): boolean {
  const db = getDb();
  const res = db.prepare(`
    UPDATE tickets 
    SET status = 'cancelled' 
    WHERE id = ? AND org_slug = ? AND status IN ('waiting', 'held')
  `).run(ticketId, orgSlug);
  return Number(res.changes) > 0;
}

// Get daily statistics for an organization
export function getDailyStats(orgSlug: string): {
  totalIssued: number;
  totalCompleted: number;
  totalHeld: number;
  totalCancelled: number;
  currentWaiting: number;
} {
  const db = getDb();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startTs = startOfDay.getTime();

  const totalRow = db.prepare(`SELECT COUNT(*) as c FROM tickets WHERE org_slug = ? AND created_at >= ?`).get(orgSlug, startTs) as { c: number } | undefined;
  const completedRow = db.prepare(`SELECT COUNT(*) as c FROM tickets WHERE org_slug = ? AND status = 'completed' AND created_at >= ?`).get(orgSlug, startTs) as { c: number } | undefined;
  const heldRow = db.prepare(`SELECT COUNT(*) as c FROM tickets WHERE org_slug = ? AND status = 'held'`).get(orgSlug) as { c: number } | undefined;
  const cancelledRow = db.prepare(`SELECT COUNT(*) as c FROM tickets WHERE org_slug = ? AND status = 'cancelled' AND created_at >= ?`).get(orgSlug, startTs) as { c: number } | undefined;
  const waitingRow = db.prepare(`SELECT COUNT(*) as c FROM tickets WHERE org_slug = ? AND status = 'waiting'`).get(orgSlug) as { c: number } | undefined;

  return {
    totalIssued: totalRow ? Number(totalRow.c) : 0,
    totalCompleted: completedRow ? Number(completedRow.c) : 0,
    totalHeld: heldRow ? Number(heldRow.c) : 0,
    totalCancelled: cancelledRow ? Number(cancelledRow.c) : 0,
    currentWaiting: waitingRow ? Number(waitingRow.c) : 0,
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
