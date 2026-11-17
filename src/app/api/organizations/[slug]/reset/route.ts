import { NextResponse } from 'next/server';
import { resetDailyQueue } from '@/lib/db';
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

    const org = await resetDailyQueue(slug);
    return NextResponse.json({ success: true, data: org });
  } catch (error: unknown) {
    console.error('Failed to reset queue:', error);
    const msg = error instanceof Error ? error.message : 'Failed to reset queue';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
