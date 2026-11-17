import { NextResponse } from 'next/server';
import { 
  getQueueState, 
  updateOrganizationSettings, 
  toggleOrganizationActive, 
  getOrganizationTickets,
  resetDailyQueue,
  deleteOrganization,
  getOrganization
} from '@/lib/db';
import { verifyStaffAuth, verifySuperAdminAuth } from '@/lib/security';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const exportParam = searchParams.get('export');

    if (exportParam === 'true') {
      const isStaff = await verifyStaffAuth(req, slug);
      if (!isStaff) {
        return NextResponse.json({ 
          success: false, 
          error: 'غير مصرح: تصدير سجل الزبائن يتطلب رمز الدخول الإداري' 
        }, { status: 401 });
      }

      const tickets = await getOrganizationTickets(slug);
      return NextResponse.json({ success: true, data: tickets });
    }

    const ticketParam = searchParams.get('ticketNumber') || searchParams.get('myTicket');
    const ticketIdParam = searchParams.get('ticketId');
    const queueState = await getQueueState(
      slug, 
      ticketParam ? Number(ticketParam) : undefined,
      ticketIdParam ? Number(ticketIdParam) : undefined
    );

    if (!queueState) {
      return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 });
    }

    const response = NextResponse.json({ success: true, data: queueState });
    // Zero CDN cache for instant real-time synchronization between TV, Remote, and Phones
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return response;
  } catch (error) {
    console.error('Failed to get queue state:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve queue state' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const isStaff = await verifyStaffAuth(req, slug);
    if (!isStaff) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مصرح: تعديل إعدادات المؤسسة يتطلب رمز الدخول الإداري' 
      }, { status: 401 });
    }

    const body = await req.json();

    if (body.action === 'toggle_active') {
      const org = await toggleOrganizationActive(slug);
      return NextResponse.json({ success: true, data: org });
    }

    if (body.action === 'reset_queue') {
      const org = await resetDailyQueue(slug);
      return NextResponse.json({ success: true, data: org });
    }

    if (body.action === 'extend_subscription') {
      const currentOrg = await getOrganization(slug);
      const days = Number(body.days) || 30;
      const baseTime = (currentOrg?.subscription_expires_at && Number(currentOrg.subscription_expires_at) > Date.now())
        ? Number(currentOrg.subscription_expires_at)
        : Date.now();
      const newExpiresAt = baseTime + (days * 86400 * 1000);

      const org = await updateOrganizationSettings(slug, {
        subscription_expires_at: newExpiresAt,
        is_active: 1, // Auto-reactivate on renewal
      });
      return NextResponse.json({ success: true, data: org });
    }

    // Full or partial updates with sanitization / validation
    const avgServiceMins = typeof body.avg_service_mins === 'number' 
      ? Math.max(1, Math.min(180, body.avg_service_mins)) 
      : undefined;

    const dailyMax = typeof body.daily_max_tickets === 'number'
      ? Math.max(0, body.daily_max_tickets)
      : undefined;

    const org = await updateOrganizationSettings(slug, {
      name: body.name ? body.name.trim().substring(0, 80) : undefined,
      sector_label: body.sector_label ? body.sector_label.trim().substring(0, 40) : undefined,
      staff_title: body.staff_title ? body.staff_title.trim().substring(0, 40) : undefined,
      pin_code: body.pin_code ? body.pin_code.trim().substring(0, 20) : undefined,
      avg_service_mins: avgServiceMins,
      plan: body.plan,
      billing_cycle: body.billing_cycle,
      subscription_expires_at: typeof body.subscription_expires_at === 'number' ? body.subscription_expires_at : undefined,
      contact_phone: body.contact_phone,
      notes: body.notes,
      is_active: typeof body.is_active === 'number' ? body.is_active : undefined,
      daily_max_tickets: dailyMax,
      auto_schedule_enabled: typeof body.auto_schedule_enabled === 'number' ? body.auto_schedule_enabled : undefined,
      work_start_time: body.work_start_time,
      work_end_time: body.work_end_time,
      work_days: body.work_days,
    });

    return NextResponse.json({ success: true, data: org });
  } catch (error) {
    console.error('Failed to update organization:', error);
    return NextResponse.json({ success: false, error: 'Failed to update organization' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const isSuperAdmin = verifySuperAdminAuth(req);
    if (!isSuperAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مصرح: حذف المؤسسة نهائياً يتطلب الرمز السري للمدير العام' 
      }, { status: 401 });
    }

    const { slug } = await params;
    const ok = await deleteOrganization(slug);
    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error('Failed to delete organization:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete organization' }, { status: 500 });
  }
}
