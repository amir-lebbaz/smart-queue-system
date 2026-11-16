import { NextResponse } from 'next/server';
import { resetDailyQueue } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const org = resetDailyQueue(slug);
    return NextResponse.json({ success: true, data: org });
  } catch (error: unknown) {
    console.error('Failed to reset queue:', error);
    const msg = error instanceof Error ? error.message : 'Failed to reset queue';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
