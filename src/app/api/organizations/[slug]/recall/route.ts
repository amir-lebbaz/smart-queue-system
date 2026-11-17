import { NextResponse } from 'next/server';
import { recallHeldTicket, repeatCall } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { ticketId, action } = body;

    if (action === 'repeat') {
      const org = await repeatCall(slug);
      return NextResponse.json({ success: true, data: { organization: org } });
    }

    if (!ticketId) {
      return NextResponse.json({ success: false, error: 'ticketId is required' }, { status: 400 });
    }

    const result = await recallHeldTicket(slug, Number(ticketId));
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('Failed to recall held ticket:', error);
    const msg = error instanceof Error ? error.message : 'Failed to recall ticket';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
