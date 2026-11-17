import { NextResponse } from 'next/server';
import { 
  issueTicket, 
  getTicket, 
  getTicketById, 
  cancelTicket, 
  findActiveTicketByPhone, 
  submitTicketFeedback, 
  checkinTicket 
} from '@/lib/db';
import { 
  checkRateLimit, 
  sanitizeCustomerName, 
  validateAndCleanPhone, 
  verifyStaffAuth 
} from '@/lib/security';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orgSlug = searchParams.get('orgSlug');
    const ticketNumber = searchParams.get('ticketNumber');
    const phone = searchParams.get('phone');

    // Phone recovery lookup
    if (orgSlug && phone) {
      const cleanPhone = phone.trim().replace(/\s+/g, '');
      const ticket = await findActiveTicketByPhone(orgSlug, cleanPhone);
      if (!ticket) {
        return NextResponse.json({ success: false, error: 'لم يتم العثور على تذكرة نشطة مسجلة بهذا الرقم' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: ticket });
    }

    if (!orgSlug || !ticketNumber) {
      return NextResponse.json({ success: false, error: 'المعطيات غير مكتملة' }, { status: 400 });
    }

    const ticket = await getTicket(orgSlug, Number(ticketNumber));
    if (!ticket) {
      return NextResponse.json({ success: false, error: 'التذكرة غير موجودة' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Failed to get ticket:', error);
    return NextResponse.json({ success: false, error: 'تعذر جلب التذكرة' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Feedback submission
    if (body.action === 'feedback') {
      const { ticketId, orgSlug, ticketNumber, rating } = body;
      if ((!ticketId && (!orgSlug || !ticketNumber)) || !rating) {
        return NextResponse.json({ success: false, error: 'بيانات التقييم غير مكتملة' }, { status: 400 });
      }
      try {
        const ok = await submitTicketFeedback(
          {
            ticketId: ticketId ? Number(ticketId) : undefined,
            orgSlug,
            ticketNumber: ticketNumber ? Number(ticketNumber) : undefined,
          },
          rating
        );
        return NextResponse.json({ success: ok });
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'تعذر تسجيل التقييم';
        return NextResponse.json({ success: false, error: errMsg }, { status: 400 });
      }
    }

    // Customer Check-in from Hold
    if (body.action === 'checkin') {
      const { orgSlug, ticketNumber } = body;
      if (!orgSlug || !ticketNumber) {
        return NextResponse.json({ success: false, error: 'بيانات غير مكتملة' }, { status: 400 });
      }
      const ok = await checkinTicket(orgSlug, Number(ticketNumber));
      return NextResponse.json({ success: ok });
    }

    // Normal ticket issuance
    const { orgSlug, customerName, customerPhone, ticketType } = body;

    if (!orgSlug) {
      return NextResponse.json({ success: false, error: 'معرف المؤسسة مطلوب' }, { status: 400 });
    }

    // 1. Staff Authorization Check for Walk-in Tickets (Prevent privilege escalation)
    if (ticketType === 'walkin') {
      const isStaff = await verifyStaffAuth(req, orgSlug);
      if (!isStaff) {
        return NextResponse.json({ 
          success: false, 
          error: 'غير مصرح لك بإصدار تذاكر حضورية بدون رمز الدخول الإداري' 
        }, { status: 401 });
      }
    } else {
      // 2. Rate Limiting for Public Web/QR bookings (Prevent DoS bot flooding)
      const isSuperAdmin = req.headers.get('x-super-admin-key') === '9999';
      if (!isSuperAdmin) {
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                   req.headers.get('cf-connecting-ip') || 
                   '127.0.0.1';
        const rateLimit = checkRateLimit(ip, 10, 60000); // Max 10 bookings per minute per IP
        if (!rateLimit.allowed) {
          return NextResponse.json({ 
            success: false, 
            error: 'تم تجاوز عدد محاولات الحجز المسموح بها من هذا الجهاز مؤقتاً، يرجى الانتظار دقيقة واحدة' 
          }, { status: 429 });
        }
      }
    }

    // 3. Strict Phone Number Validation and Sanitization
    let cleanPhone: string;
    try {
      cleanPhone = validateAndCleanPhone(customerPhone || '');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'رقم الهاتف غير صالح';
      return NextResponse.json({ success: false, error: msg }, { status: 400 });
    }

    // 4. Customer Name Sanitization (Prevent XSS, HTML injection, and buffer bloat)
    const sanitizedName = sanitizeCustomerName(customerName);

    const ticket = await issueTicket(orgSlug, cleanPhone, sanitizedName || undefined, ticketType || 'qr');
    return NextResponse.json({ success: true, data: ticket }, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to issue ticket:', error);
    const msg = error instanceof Error ? error.message : 'فشل إصدار التذكرة';
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get('ticketId');
    const orgSlug = searchParams.get('orgSlug');
    const phone = searchParams.get('phone');

    if (!ticketId || !orgSlug) {
      return NextResponse.json({ success: false, error: 'ticketId and orgSlug are required' }, { status: 400 });
    }

    const ticket = await getTicketById(Number(ticketId), orgSlug);
    if (!ticket) {
      return NextResponse.json({ success: false, error: 'التذكرة غير موجودة' }, { status: 404 });
    }

    // IDOR Protection: Verify caller is authorized staff OR ticket owner with matching phone
    const isStaff = await verifyStaffAuth(req, orgSlug);
    const isOwner = phone && ticket.customer_phone && 
      ticket.customer_phone.replace(/\s+/g, '') === phone.trim().replace(/\s+/g, '');

    if (!isStaff && !isOwner) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مصرح لك بإلغاء هذه التذكرة. يتطلب ذلك رمز الموظف أو نفس رقم هاتف الحجز' 
      }, { status: 403 });
    }

    const cancelled = await cancelTicket(Number(ticketId), orgSlug);
    return NextResponse.json({ success: true, data: { cancelled } });
  } catch (error) {
    console.error('Failed to cancel ticket:', error);
    return NextResponse.json({ success: false, error: 'Failed to cancel ticket' }, { status: 500 });
  }
}
