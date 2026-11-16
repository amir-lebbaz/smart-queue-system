import { NextResponse } from 'next/server';
import { issueTicket, getTicket, cancelTicket } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orgSlug = searchParams.get('orgSlug');
    const ticketNumber = searchParams.get('ticketNumber');

    if (!orgSlug || !ticketNumber) {
      return NextResponse.json({ success: false, error: 'orgSlug and ticketNumber are required' }, { status: 400 });
    }

    const ticket = getTicket(orgSlug, Number(ticketNumber));
    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Failed to get ticket:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve ticket' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orgSlug, customerName, customerPhone, ticketType } = body;

    if (!orgSlug) {
      return NextResponse.json({ success: false, error: 'orgSlug is required' }, { status: 400 });
    }

    const ticket = issueTicket(orgSlug, customerName, customerPhone, ticketType || 'qr');
    return NextResponse.json({ success: true, data: ticket }, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to issue ticket:', error);
    const msg = error instanceof Error ? error.message : 'Failed to issue ticket';
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

    const cancelled = cancelTicket(Number(ticketId), orgSlug);
    return NextResponse.json({ success: true, data: { cancelled } });
  } catch (error) {
    console.error('Failed to cancel ticket:', error);
    return NextResponse.json({ success: false, error: 'Failed to cancel ticket' }, { status: 500 });
  }
}
