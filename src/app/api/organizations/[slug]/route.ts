import { NextResponse } from 'next/server';
import { getQueueState, updateOrganizationSettings, toggleOrganizationActive, getOrganizationTickets } from '@/lib/db';

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

    if (typeof body.avg_service_mins === 'number' || (body.pin_code && typeof body.pin_code === 'string')) {
      const org = await updateOrganizationSettings(slug, {
        avg_service_mins: body.avg_service_mins,
        pin_code: body.pin_code,
        name: body.name,
      });
      return NextResponse.json({ success: true, data: org });
    }

    return NextResponse.json({ success: false, error: 'Invalid update payload' }, { status: 400 });
  } catch (error) {
    console.error('Failed to update organization:', error);
    return NextResponse.json({ success: false, error: 'Failed to update organization' }, { status: 500 });
  }
}
