import { NextResponse } from 'next/server';
import { recallHeldTicket, repeatCall } from '@/lib/db';
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
