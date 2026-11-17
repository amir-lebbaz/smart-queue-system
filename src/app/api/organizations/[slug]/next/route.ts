import { NextResponse } from 'next/server';
import { callNextTicket } from '@/lib/db';
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

    const result = await callNextTicket(slug);
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('Failed to call next ticket:', error);
    const msg = error instanceof Error ? error.message : 'Failed to call next ticket';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
