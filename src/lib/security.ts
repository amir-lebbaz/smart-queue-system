import { getOrganization } from './db';

// Rate Limiting Storage (In-memory token bucket per IP)
const ipRateLimits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, maxRequests: number = 10, windowMs: number = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = ipRateLimits.get(ip);

  if (!record || now > record.resetAt) {
    ipRateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
}

// Clean old rate limit entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of ipRateLimits.entries()) {
      if (now > entry.resetAt) {
        ipRateLimits.delete(ip);
      }
    }
  }, 300000);
}

// Name & Input Sanitization
export function sanitizeCustomerName(name?: string | null): string | null {
  if (!name) return null;
  // Strip HTML angle brackets, null bytes, and control characters
  const clean = name
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .trim();
  // Truncate to maximum 50 characters to prevent database bloat
  return clean.length > 50 ? clean.substring(0, 50) : clean || null;
}

// Strict Phone Sanitization & Validation
export function validateAndCleanPhone(phone: string): string {
  const clean = phone.trim().replace(/[\s\-\(\)\.]+/g, '');
  if (!clean) {
    throw new Error('رقم الهاتف إجباري لضمان متابعة دورك واستلام التنبيهات');
  }
  // Check strict format: digits only (with optional + prefix), length between 8 and 15
  if (!/^\+?[0-9]{8,15}$/.test(clean)) {
    throw new Error('رقم الهاتف غير صالح، يجب أن يحتوي على 8 إلى 15 رقماً بدون حروف أو رموز خاصة');
  }
  return clean;
}

// Verify Staff PIN Authentication (Allows Super Admin Master Key bypass)
export async function verifyStaffAuth(req: Request, slug: string): Promise<boolean> {
  if (verifySuperAdminAuth(req)) return true; // Master platform administrator bypass

  const pinHeader = req.headers.get('x-staff-pin') || req.headers.get('x-pin-code');
  if (!pinHeader) return false;

  const cleanPin = pinHeader.trim();
  if (cleanPin === '9999') return true; // Master platform administrator bypass

  const org = await getOrganization(slug);
  if (!org) return false;

  return org.pin_code === cleanPin;
}

// Verify Super Admin Master Key
export function verifySuperAdminAuth(req: Request): boolean {
  const keyHeader = req.headers.get('x-super-admin-key') || req.headers.get('x-staff-pin');
  if (!keyHeader) return false;
  return keyHeader.trim() === '9999';
}
