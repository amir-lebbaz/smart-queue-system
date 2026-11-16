import { NextResponse } from 'next/server';
import { getAllOrganizations, createOrganization } from '@/lib/db';

export async function GET() {
  try {
    const orgs = getAllOrganizations();
    return NextResponse.json({ success: true, data: orgs });
  } catch (error) {
    console.error('Failed to get organizations:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve organizations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, name, sector_label, staff_title, pin_code, avg_service_mins } = body;

    if (!slug || !name) {
      return NextResponse.json({ success: false, error: 'Slug and Name are required' }, { status: 400 });
    }

    const org = createOrganization({
      slug,
      name,
      sector_label: sector_label || 'زبون',
      staff_title: staff_title || 'المسير',
      pin_code: pin_code || '1234',
      avg_service_mins: Number(avg_service_mins) || 15,
    });

    return NextResponse.json({ success: true, data: org }, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to create organization:', error);
    const msg = error instanceof Error ? error.message : 'Failed to create organization';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
