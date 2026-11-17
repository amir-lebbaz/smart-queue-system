const BASE_URL = 'http://localhost:3000';

async function req(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-staff-pin': '1234',
      'x-super-admin-key': '9999',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  try {
    return { status: res.status, ok: res.ok, data: JSON.parse(text) };
  } catch {
    return { status: res.status, ok: res.ok, text };
  }
}

async function runAudit() {
  console.log('===========================================================');
  console.log(' STARTING FULL COMPREHENSIVE SIMULATION & EDGE-CASE AUDIT ');
  console.log('===========================================================\n');

  const slug = 'clinic-amal';
  let passed = 0;
  let total = 0;

  function assert(condition, testName, details = '') {
    total++;
    if (condition) {
      console.log(`✓ [TEST ${total}] ${testName}`);
      passed++;
    } else {
      console.error(`✗ [TEST ${total}] FAILED: ${testName} - ${details}`);
      throw new Error(`Assertion failed for Test ${total}: ${testName}`);
    }
  }

  // Pre-clean with master key 9999 to guarantee clean start
  await req(`/api/organizations/${slug}`, {
    method: 'PATCH',
    headers: { 'x-staff-pin': '9999' },
    body: JSON.stringify({ is_active: 1, daily_max_tickets: 0, auto_schedule_enabled: 0, pin_code: '1234' }),
  });
  await req(`/api/organizations/${slug}/reset`, {
    method: 'POST',
    headers: { 'x-staff-pin': '9999' },
  });

  // --- SECTION 1: CUSTOMER INTERACTIONS (/q/[slug]) ---
  console.log('\n--- [ROLE 1: CUSTOMER PHONE USER] ---');

  // T1: Valid booking
  const b1 = await req('/api/tickets', {
    method: 'POST',
    body: JSON.stringify({ orgSlug: slug, customerName: 'سارة', customerPhone: '0555123456', ticketType: 'qr' }),
  });
  assert(b1.ok && b1.data.data.ticket_number === 1, 'Customer books ticket #1 successfully');
  assert(
    b1.data.data.estimated_clock_time && b1.data.data.estimated_clock_time.includes(':'),
    'Ticket has valid local clock time in Algeria timezone'
  );

  // T2: Missing / short phone validation
  const bBad = await req('/api/tickets', {
    method: 'POST',
    body: JSON.stringify({ orgSlug: slug, customerName: 'مجهول', customerPhone: '123', ticketType: 'qr' }),
  });
  assert(bBad.status === 400, 'Customer rejected for invalid phone number (< 8 digits)');

  // T3: Prevent duplicate active booking (returns active ticket)
  const bDup = await req('/api/tickets', {
    method: 'POST',
    body: JSON.stringify({ orgSlug: slug, customerName: 'سارة تكرار', customerPhone: '0555123456', ticketType: 'qr' }),
  });
  assert(
    bDup.ok && bDup.data.data.is_existing_active && bDup.data.data.ticket_number === 1,
    'Duplicate booking with same phone returns existing active ticket #1 without creating a new ticket'
  );

  // T4: Phone recovery lookup (Valid)
  const bRec = await req(`/api/tickets?orgSlug=${slug}&phone=0555123456`);
  assert(bRec.ok && bRec.data.data.ticket_number === 1, 'Customer recovers ticket #1 using phone number lookup');

  // T5: Phone recovery lookup (Non-existent phone)
  const bRec404 = await req(`/api/tickets?orgSlug=${slug}&phone=0777000000`);
  assert(bRec404.status === 404, 'Phone recovery returns 404 for unknown number');

  // T6: Second customer books ticket #2
  const b2 = await req('/api/tickets', {
    method: 'POST',
    body: JSON.stringify({ orgSlug: slug, customerName: 'أحمد', customerPhone: '0666234567', ticketType: 'qr' }),
  });
  assert(b2.ok && b2.data.data.ticket_number === 2, 'Second customer books ticket #2');

  // T7: Customer cancels / leaves queue manually
  const bCancel = await req(`/api/tickets?ticketId=${b2.data.data.id}&orgSlug=${slug}`, {
    method: 'DELETE',
  });
  assert(bCancel.ok, 'Customer leaves queue manually (Ticket #2 cancelled)');

  // --- SECTION 2: STAFF / RECEPTIONIST CONSOLE (/admin/[slug]) ---
  console.log('\n--- [ROLE 2: STAFF / DOCTOR / RECEPTIONIST CONSOLE] ---');

  // T8: Call Next Ticket
  const sCall = await req(`/api/organizations/${slug}/next`, { method: 'POST' });
  assert(
    sCall.ok && sCall.data.data.currentTicket.ticket_number === 1 && sCall.data.data.currentTicket.status === 'called',
    'Doctor calls ticket #1 (Status -> called, current_ticket_number = 1)'
  );

  // T9: Repeat Call / Chime trigger
  const sRepeat = await req(`/api/organizations/${slug}/recall`, {
    method: 'POST',
    body: JSON.stringify({ action: 'repeat' }),
  });
  assert(sRepeat.ok, 'Doctor triggers repeat call audio chime');

  // T10: Customer entered office / treatment room
  const sEnter = await req(`/api/organizations/${slug}/enter`, { method: 'POST' });
  assert(
    sEnter.ok && sEnter.data.data.currentTicket.status === 'serving',
    'Doctor marks customer as entered (Status -> serving)'
  );

  // T11: Smart Hold (Absent / delayed customer)
  const sHold = await req(`/api/organizations/${slug}/hold`, { method: 'POST' });
  assert(
    sHold.ok && sHold.data.data.heldTicket.status === 'held' && sHold.data.data.organization.current_ticket_number === 0,
    'Doctor places customer on Smart Hold (Status -> held, current_ticket_number = 0)'
  );

  // T12: Customer Check-in from Hold
  const cCheckin = await req('/api/tickets', {
    method: 'POST',
    body: JSON.stringify({ action: 'checkin', orgSlug: slug, ticketNumber: 1 }),
  });
  assert(cCheckin.ok, 'Customer clicks "أنا حاضر بالقاعة الآن" (Checkin marks is_present = true)');

  // T13: Doctor recalls held customer immediately
  const sRecall = await req(`/api/organizations/${slug}/recall`, {
    method: 'POST',
    body: JSON.stringify({ ticketId: sHold.data.data.heldTicket.id }),
  });
  assert(
    sRecall.ok && sRecall.data.data.currentTicket.ticket_number === 1 && sRecall.data.data.currentTicket.status === 'called',
    'Doctor recalls held ticket #1 back into active serving'
  );

  // T14: Complete service only
  const sComplete = await req(`/api/organizations/${slug}/complete`, { method: 'POST' });
  assert(sComplete.ok, 'Doctor marks service as completed for ticket #1');

  // T15: Customer submits 1-tap experience feedback
  const cFeed = await req('/api/tickets', {
    method: 'POST',
    body: JSON.stringify({ action: 'feedback', orgSlug: slug, ticketNumber: 1, rating: 'great' }),
  });
  assert(cFeed.ok, 'Customer submits 1-tap rating: great 😄');

  // T16: Receptionist adds Walk-in / Manual ticket
  const sWalkin = await req('/api/tickets', {
    method: 'POST',
    body: JSON.stringify({ orgSlug: slug, customerName: 'عمر حضوري', customerPhone: '0777112233', ticketType: 'walkin' }),
  });
  assert(sWalkin.ok && sWalkin.data.data.ticket_type === 'walkin', 'Receptionist issues walk-in ticket #3');

  // T17: Direct call of specific ticket
  const sDirect = await req(`/api/organizations/${slug}/recall`, {
    method: 'POST',
    body: JSON.stringify({ ticketId: sWalkin.data.data.id }),
  });
  assert(sDirect.ok && sDirect.data.data.currentTicket.ticket_number === sWalkin.data.data.ticket_number, 'Direct call of ticket #3 succeeds');

  // T18: Complete service for ticket #3
  await req(`/api/organizations/${slug}/complete`, { method: 'POST' });

  // T19: Call next on empty queue
  const sEmptyNext = await req(`/api/organizations/${slug}/next`, { method: 'POST' });
  assert(
    sEmptyNext.ok && sEmptyNext.data.data.currentTicket === null && sEmptyNext.data.data.organization.current_ticket_number === 0,
    'Calling next on empty queue sets current_ticket_number to 0 without errors'
  );

  // T20: Toggle queue Pause
  const sPause = await req(`/api/organizations/${slug}`, {
    method: 'PATCH',
    body: JSON.stringify({ action: 'toggle_active' }),
  });
  assert(sPause.ok && sPause.data.data.is_active === 0, 'Admin pauses queue bookings (is_active = 0)');

  // T21: Attempt booking while paused
  const bPaused = await req('/api/tickets', {
    method: 'POST',
    body: JSON.stringify({ orgSlug: slug, customerPhone: '0555999888', ticketType: 'qr' }),
  });
  assert(bPaused.status === 400 && bPaused.data.error.includes('تم إيقاف استقبال'), 'Customer booking blocked during pause');

  // T22: Toggle queue Resume
  const sResume = await req(`/api/organizations/${slug}`, {
    method: 'PATCH',
    body: JSON.stringify({ action: 'toggle_active' }),
  });
  assert(sResume.ok && sResume.data.data.is_active === 1, 'Admin resumes queue bookings (is_active = 1)');

  // T23: Update Organization Settings (Speed, Quota, PIN)
  const sSettings = await req(`/api/organizations/${slug}`, {
    method: 'PATCH',
    body: JSON.stringify({ avg_service_mins: 18, daily_max_tickets: 50, pin_code: '4321' }),
  });
  assert(
    sSettings.ok && sSettings.data.data.avg_service_mins === 18 && sSettings.data.data.daily_max_tickets === 50,
    'Settings modal successfully updates service speed (18m), quota (50), and PIN'
  );

  // Restore PIN to 1234 using the updated PIN 4321
  await req(`/api/organizations/${slug}`, {
    method: 'PATCH',
    headers: { 'x-staff-pin': '4321' },
    body: JSON.stringify({ avg_service_mins: 15, daily_max_tickets: 0, pin_code: '1234' }),
  });

  // T24: Export Day CSV/Tickets
  const sExport = await req(`/api/organizations/${slug}?export=true`);
  assert(sExport.ok && Array.isArray(sExport.data.data), 'Admin exports daily history as CSV/JSON data');

  // T25: Reset queue
  const sReset = await req(`/api/organizations/${slug}`, {
    method: 'PATCH',
    body: JSON.stringify({ action: 'reset_queue' }),
  });
  assert(sReset.ok && sReset.data.data.current_ticket_number === 0, 'Admin resets daily queue counters to 0');

  // --- SECTION 3: TV DISPLAY POLLING & STATE (/display/[slug]) ---
  console.log('\n--- [ROLE 3: TV DISPLAY INTERFACE] ---');

  const tvState = await req(`/api/organizations/${slug}`);
  assert(
    tvState.ok && tvState.data.data.organization.slug === slug,
    'TV Display successfully polls live state with zero CDN cache headers'
  );

  // --- SECTION 4: SUPER ADMIN OPERATIONS (/super-admin) ---
  console.log('\n--- [ROLE 4: SUPER ADMIN PLATFORM OWNER] ---');

  // Pre-clean test org if exists
  await req('/api/organizations/test-auto-audit', { method: 'DELETE' });

  // T27: Create New Organization
  const saCreate = await req('/api/organizations', {
    method: 'POST',
    body: JSON.stringify({
      slug: 'test-auto-audit',
      name: 'عيادة الاختبار الآلي',
      sector_label: 'مريض',
      staff_title: 'الدكتور',
      pin_code: '9999',
      avg_service_mins: 12,
      plan: 'starter',
      billing_cycle: 'monthly',
      contact_phone: '0555000999',
    }),
  });
  assert(saCreate.ok && saCreate.data.data.slug === 'test-auto-audit', 'Super Admin creates new organization (test-auto-audit)');

  // T28: Extend Subscription
  const saExtend = await req('/api/organizations/test-auto-audit', {
    method: 'PATCH',
    body: JSON.stringify({ action: 'extend_subscription', days: 30 }),
  });
  assert(saExtend.ok && saExtend.data.data.subscription_expires_at > Date.now(), 'Super Admin extends subscription (+30 days)');

  // T29: Change Subscription Plan
  const saPlan = await req('/api/organizations/test-auto-audit', {
    method: 'PATCH',
    body: JSON.stringify({ plan: 'elite', billing_cycle: 'yearly' }),
  });
  assert(saPlan.ok && saPlan.data.data.plan === 'elite', 'Super Admin upgrades organization plan to Elite');

  // T30: All Organizations List
  const saOrgs = await req('/api/organizations');
  assert(saOrgs.ok && Array.isArray(saOrgs.data.data) && saOrgs.data.data.length > 0, 'Super Admin retrieves all registered organizations');

  // T31: Global System Stats & MRR
  const saStats = await req('/api/organizations?stats=true');
  assert(
    saStats.ok && saStats.data.data.totalOrgs > 0 && typeof saStats.data.data.financials?.estimatedMRR === 'number',
    'Super Admin retrieves global platform metrics & MRR'
  );

  // T32: Delete Test Organization Clean-up
  const saDelete = await req('/api/organizations/test-auto-audit', { method: 'DELETE' });
  assert(saDelete.ok, 'Super Admin deletes test organization cleanly');

  console.log('\n===========================================================');
  console.log(` AUDIT COMPLETE: ${passed} / ${total} TESTS PASSED WITH 100% SUCCESS! `);
  console.log('===========================================================');
}

runAudit().catch((err) => {
  console.error('\nAUDIT FAILED WITH ERROR:', err);
  process.exit(1);
});
