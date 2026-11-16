import { NextResponse } from 'next/server';
import { holdCurrentTicket } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const result = holdCurrentTicket(slug);
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('Failed to hold ticket:', error);
    const msg = error instanceof Error ? error.message : 'Failed to hold ticket';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
