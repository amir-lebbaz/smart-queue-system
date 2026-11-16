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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const exportParam = searchParams.get('export');

    if (exportParam === 'true') {
      const tickets = await getOrganizationTickets(slug);
      return NextResponse.json({ success: true, data: tickets });
    }

    const ticketParam = searchParams.get('ticketNumber') || searchParams.get('myTicket');
    const queueState = await getQueueState(slug, ticketParam ? Number(ticketParam) : undefined);

    if (!queueState) {
      return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 });
    }

    const response = NextResponse.json({ success: true, data: queueState });
    // Edge Cache Header: 2 seconds cache, 4 seconds stale-while-revalidate to handle massive concurrency
    response.headers.set('Cache-Control', 'public, s-maxage=2, stale-while-revalidate=4');
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

    // Full or partial updates
    const org = await updateOrganizationSettings(slug, {
      name: body.name,
      sector_label: body.sector_label,
      staff_title: body.staff_title,
      pin_code: body.pin_code,
      avg_service_mins: typeof body.avg_service_mins === 'number' ? body.avg_service_mins : undefined,
      plan: body.plan,
      billing_cycle: body.billing_cycle,
      subscription_expires_at: typeof body.subscription_expires_at === 'number' ? body.subscription_expires_at : undefined,
      contact_phone: body.contact_phone,
      notes: body.notes,
      is_active: typeof body.is_active === 'number' ? body.is_active : undefined,
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
    const { slug } = await params;
    const ok = await deleteOrganization(slug);
    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error('Failed to delete organization:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete organization' }, { status: 500 });
  }
}
