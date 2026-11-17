import { NextResponse } from 'next/server';
import { completeCurrentTicket } from '@/lib/db';
import { verifyStaffAuth } from '@/lib/security';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const isStaff = await verifyStaffAuth(req, slug);
    if (!isStaff) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مصرح: يتطلب رمز الدخول الإداري للمؤسسة' 
      }, { status: 401 });
    }

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
