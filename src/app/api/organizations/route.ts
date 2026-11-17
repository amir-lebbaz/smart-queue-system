import { NextResponse } from 'next/server';
import { getAllOrganizations, createOrganization, getGlobalSystemStats } from '@/lib/db';
import { verifySuperAdminAuth } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get('stats') === 'true') {
      const isSuperAdmin = verifySuperAdminAuth(req);
      if (!isSuperAdmin) {
        return NextResponse.json({ 
          success: false, 
          error: 'غير مصرح: استعراض إحصائيات وأرباح المنصة يتطلب رمز المدير العام' 
        }, { status: 401 });
      }

      const stats = await getGlobalSystemStats();
      return NextResponse.json({ success: true, data: stats });
    }

    const orgs = await getAllOrganizations();
    return NextResponse.json({ success: true, data: orgs });
  } catch (error) {
    console.error('Failed to get organizations or stats:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve organizations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isSuperAdmin = verifySuperAdminAuth(req);
    if (!isSuperAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مصرح: إنشاء مؤسسة جديدة يتطلب رمز المدير العام' 
      }, { status: 401 });
    }

    const body = await req.json();
    const { 
      slug, 
      name, 
      sector_label, 
      staff_title, 
      pin_code, 
      avg_service_mins, 
      plan, 
      billing_cycle,
      contact_phone,
      notes,
      subscription_expires_at
    } = body;

    if (!slug || !name) {
      return NextResponse.json({ success: false, error: 'Slug and Name are required' }, { status: 400 });
    }

    const org = await createOrganization({
      slug: slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
      name: name.trim().substring(0, 80),
      sector_label: sector_label || 'زبون',
      staff_title: staff_title || 'المسير',
      pin_code: pin_code || '1234',
      avg_service_mins: Math.max(1, Math.min(180, Number(avg_service_mins) || 15)),
      plan: plan || 'pro',
      billing_cycle: billing_cycle || 'monthly',
      contact_phone,
      notes,
      subscription_expires_at,
    });

    return NextResponse.json({ success: true, data: org }, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to create organization:', error);
    const msg = error instanceof Error ? error.message : 'Failed to create organization';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
