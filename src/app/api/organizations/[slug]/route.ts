import { NextResponse } from 'next/server';
import { getQueueState, updateAvgServiceMins, toggleOrganizationActive } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const ticketParam = searchParams.get('ticketNumber') || searchParams.get('myTicket');
    const queueState = getQueueState(slug, ticketParam ? Number(ticketParam) : undefined);

    if (!queueState) {
      return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: queueState });
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
      const org = toggleOrganizationActive(slug);
      return NextResponse.json({ success: true, data: org });
    }

    if (typeof body.avg_service_mins === 'number') {
      const org = updateAvgServiceMins(slug, body.avg_service_mins);
      return NextResponse.json({ success: true, data: org });
    }

    return NextResponse.json({ success: false, error: 'Invalid update payload' }, { status: 400 });
  } catch (error) {
    console.error('Failed to update organization:', error);
    return NextResponse.json({ success: false, error: 'Failed to update organization' }, { status: 500 });
  }
}
