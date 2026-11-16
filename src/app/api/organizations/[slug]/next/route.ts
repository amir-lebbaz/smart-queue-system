import { NextResponse } from 'next/server';
import { callNextTicket } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const result = callNextTicket(slug);
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('Failed to call next ticket:', error);
    const msg = error instanceof Error ? error.message : 'Failed to call next ticket';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
