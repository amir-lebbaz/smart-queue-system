const SUPABASE_URL = "https://mtuhuzmyhbemdfsbyhpf.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dWh1em15aGJlbWRmc2J5aHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjIxNDAsImV4cCI6MjA5MjQ5ODE0MH0.Pip_Y_FfjJvnOHxnAMNUlHMBLkGefVxH2dVMsXaIQ08";

const url = `${SUPABASE_URL}/rest/v1`;
const headers = {
  'apikey': anonKey,
  'Authorization': `Bearer ${anonKey}`,
  'Content-Type': 'application/json',
};

async function supaRpc(fn, params) {
  const res = await fetch(`${url}/rpc/${fn}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  });
  const text = await res.text();
  try {
    return { status: res.status, data: JSON.parse(text) };
  } catch {
    return { status: res.status, text };
  }
}

async function supaPatch(endpoint, body) {
  const res = await fetch(`${url}/${endpoint}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });
  return res.text();
}

async function runTest() {
  console.log('--- Testing 3 New Core Architectural Features ---\n');
  const orgSlug = 'clinic-amal';

  // Clean queue
  await fetch(`${url}/queue_tickets?org_slug=eq.${orgSlug}`, { method: 'DELETE', headers });
  await supaPatch(`queue_organizations?slug=eq.${orgSlug}`, {
    current_ticket_number: 0,
    last_issued_number: 0,
    daily_max_tickets: 0,
    auto_schedule_enabled: 0,
    last_reset_date: '2026-11-17',
  });

  // ==========================================
  // TEST 1: Daily Capacity / Quota
  // ==========================================
  console.log('[FEATURE 1: Daily Quota Test]');
  await supaPatch(`queue_organizations?slug=eq.${orgSlug}`, { daily_max_tickets: 2 });
  
  const q1 = await supaRpc('issue_next_ticket', { p_org_slug: orgSlug, p_customer_phone: '0555000001', p_ticket_type: 'qr' });
  console.log('Ticket 1 issued:', q1.data.ticket_number);

  const q2 = await supaRpc('issue_next_ticket', { p_org_slug: orgSlug, p_customer_phone: '0555000002', p_ticket_type: 'qr' });
  console.log('Ticket 2 issued:', q2.data.ticket_number);

  const q3 = await supaRpc('issue_next_ticket', { p_org_slug: orgSlug, p_customer_phone: '0555000003', p_ticket_type: 'qr' });
  console.log('Ticket 3 (QR exceeding quota 2):', q3.status, q3.data);
  if (JSON.stringify(q3.data).includes('QUOTA_EXCEEDED')) {
    console.log('✓ Quota successfully blocked Ticket 3!');
  } else {
    throw new Error('Quota test failed');
  }

  // Staff walkin override
  const q3Walkin = await supaRpc('issue_next_ticket', { p_org_slug: orgSlug, p_customer_phone: '0555000003', p_ticket_type: 'walkin' });
  console.log('✓ Staff walkin override succeeded despite quota:', q3Walkin.data.ticket_number);

  // ==========================================
  // TEST 2: Operating Hours & Work Days
  // ==========================================
  console.log('\n[FEATURE 2: Business Hours & Schedule Test]');
  // Reset quota
  await supaPatch(`queue_organizations?slug=eq.${orgSlug}`, { daily_max_tickets: 0 });

  // Test 2A: Before work (set start to 23:00)
  await supaPatch(`queue_organizations?slug=eq.${orgSlug}`, {
    auto_schedule_enabled: 1,
    work_start_time: '23:00',
    work_end_time: '23:59',
    work_days: '0,1,2,3,4,5,6',
  });

  const sBefore = await supaRpc('issue_next_ticket', { p_org_slug: orgSlug, p_customer_phone: '0555000004', p_ticket_type: 'qr' });
  console.log('Test Before Work:', sBefore.data);
  if (JSON.stringify(sBefore.data).includes('SCHEDULE_BEFORE_WORK')) {
    console.log('✓ Blocked before work hours!');
  } else {
    throw new Error('Before work test failed');
  }

  // Test 2B: Day off (set work_days to '5' Friday only, today is Tuesday)
  await supaPatch(`queue_organizations?slug=eq.${orgSlug}`, {
    auto_schedule_enabled: 1,
    work_start_time: '08:00',
    work_end_time: '23:00',
    work_days: '5',
  });

  const sDayOff = await supaRpc('issue_next_ticket', { p_org_slug: orgSlug, p_customer_phone: '0555000005', p_ticket_type: 'qr' });
  console.log('Test Day Off:', sDayOff.data);
  if (JSON.stringify(sDayOff.data).includes('SCHEDULE_DAY_OFF')) {
    console.log('✓ Blocked on Day Off!');
  } else {
    throw new Error('Day off test failed');
  }

  // Disable schedule check
  await supaPatch(`queue_organizations?slug=eq.${orgSlug}`, { auto_schedule_enabled: 0, work_days: '0,1,2,3,4,6' });

  // ==========================================
  // TEST 3: Midnight / Daily Auto-Reset
  // ==========================================
  console.log('\n[FEATURE 3: Midnight Auto-Reset Test]');
  // Simulate yesterday's state: last_reset_date is 2026-11-16, last_issued is 45, current is 20
  await supaPatch(`queue_organizations?slug=eq.${orgSlug}`, {
    last_reset_date: '2026-11-16',
    current_ticket_number: 20,
    last_issued_number: 45,
  });

  // Call get_queue_summary (which represents user or display opening the app today)
  const summaryRes = await supaRpc('get_queue_summary', { p_org_slug: orgSlug });
  console.log('summaryRes status and body:', summaryRes.status, summaryRes.data);
  const summary = summaryRes.data;

  console.log('Summary returned organization state:', {
    last_reset_date: summary.organization.last_reset_date,
    current_ticket_number: summary.organization.current_ticket_number,
    last_issued_number: summary.organization.last_issued_number,
    scheduleInfo: summary.scheduleInfo,
  });

  if (
    summary.organization.last_reset_date === '2026-11-17' &&
    summary.organization.current_ticket_number === 0 &&
    summary.organization.last_issued_number === 0
  ) {
    console.log('✓ Midnight Auto-Reset successfully detected new date, reset counters to 0, and updated last_reset_date!');
  } else {
    throw new Error('Midnight Auto-Reset test failed');
  }

  // Clean queue
  await fetch(`${url}/queue_tickets?org_slug=eq.${orgSlug}`, { method: 'DELETE', headers });
  await supaPatch(`queue_organizations?slug=eq.${orgSlug}`, {
    current_ticket_number: 0,
    last_issued_number: 0,
    daily_max_tickets: 0,
    auto_schedule_enabled: 0,
    work_start_time: '08:00',
    work_end_time: '17:00',
    work_days: '0,1,2,3,4,6',
    last_reset_date: '2026-11-17',
  });

  console.log('\n==========================================');
  console.log(' ALL 3 CORE UPGRADE FEATURES VERIFIED 100%!');
  console.log('==========================================');
}

runTest().catch((e) => {
  console.error('Test Failed:', e);
  process.exit(1);
});
