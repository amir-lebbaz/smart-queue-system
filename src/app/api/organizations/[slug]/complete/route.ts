import { NextResponse } from 'next/server';
import { completeCurrentTicket } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    let ticketId: number | undefined;
    try {
      const body = await req.json();
      ticketId = body.ticketId ? Number(body.ticketId) : undefined;
    } catch {
      // Body may be empty
    }

    const result = await completeCurrentTicket(slug, ticketId);
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('Failed to complete ticket:', error);
    const msg = error instanceof Error ? error.message : 'Failed to complete ticket';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
