import { NextResponse } from 'next/server';
import { issueTicket, getTicket, cancelTicket, findActiveTicketByPhone, submitTicketFeedback, checkinTicket } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orgSlug = searchParams.get('orgSlug');
    const ticketNumber = searchParams.get('ticketNumber');
    const phone = searchParams.get('phone');

    // Phone recovery lookup
    if (orgSlug && phone) {
      const ticket = await findActiveTicketByPhone(orgSlug, phone);
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
      const ok = await submitTicketFeedback(
        {
          ticketId: ticketId ? Number(ticketId) : undefined,
          orgSlug,
          ticketNumber: ticketNumber ? Number(ticketNumber) : undefined,
        },
        rating
      );
      return NextResponse.json({ success: ok });
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

    if (!customerPhone || customerPhone.trim().length < 8) {
      return NextResponse.json({ success: false, error: 'رقم الهاتف إجباري لضمان متابعة دورك واستلام التنبيهات' }, { status: 400 });
    }

    const ticket = await issueTicket(orgSlug, customerPhone, customerName, ticketType || 'qr');
    return NextResponse.json({ success: true, data: ticket }, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to issue ticket:', error);
    const msg = error instanceof Error ? error.message : 'فشل إصدار التذكرة';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get('ticketId');
    const orgSlug = searchParams.get('orgSlug');

    if (!ticketId || !orgSlug) {
      return NextResponse.json({ success: false, error: 'ticketId and orgSlug are required' }, { status: 400 });
    }

    const cancelled = await cancelTicket(Number(ticketId), orgSlug);
    return NextResponse.json({ success: true, data: { cancelled } });
  } catch (error) {
    console.error('Failed to cancel ticket:', error);
    return NextResponse.json({ success: false, error: 'Failed to cancel ticket' }, { status: 500 });
  }
}
