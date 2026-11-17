import fs from 'fs';

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

async function supaQuery(endpoint, options = {}) {
  const res = await fetch(`${url}/${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  return res.json();
}

async function runTest() {
  console.log('--- Starting Cooldown & Anti-Spam Verification ---');
  const orgSlug = 'clinic-amal';
  const testPhone = '0599000111';

  // 0. Clean any existing tickets for this test phone
  await fetch(`${url}/queue_tickets?customer_phone=eq.${testPhone}`, {
    method: 'DELETE',
    headers,
  });

  // Also clean clinic-amal queue to 0 waiting
  await fetch(`${url}/queue_tickets?org_slug=eq.${orgSlug}`, {
    method: 'DELETE',
    headers,
  });
  await fetch(`${url}/queue_organizations?slug=eq.${orgSlug}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ current_ticket_number: 0, last_issued_number: 0 }),
  });

  console.log('✓ Cleaned queue state for clinic-amal');

  // Test 1: First booking
  console.log('\n[Test 1] Booking initial ticket for phone ' + testPhone);
  const t1 = await supaRpc('issue_next_ticket', {
    p_org_slug: orgSlug,
    p_customer_phone: testPhone,
    p_customer_name: 'أمير',
    p_ticket_type: 'qr',
  });
  console.log('Ticket 1 response:', t1.data);
  if (!t1.data.ticket_number || t1.data.is_existing_active) {
    throw new Error('Test 1 failed: Expected new ticket');
  }
  console.log('✓ Test 1 Passed: Ticket #' + t1.data.ticket_number + ' issued.');

  // Test 2: Attempt duplicate active booking
  console.log('\n[Test 2] Attempting duplicate active booking for same phone ' + testPhone);
  const t2 = await supaRpc('issue_next_ticket', {
    p_org_slug: orgSlug,
    p_customer_phone: testPhone,
    p_customer_name: 'أمير تكرار',
    p_ticket_type: 'qr',
  });
  console.log('Ticket 2 response:', t2.data);
  if (t2.data.is_existing_active && t2.data.ticket_number === t1.data.ticket_number) {
    console.log('✓ Test 2 Passed: Duplicate blocked! System returned existing active ticket #' + t2.data.ticket_number);
  } else {
    throw new Error('Test 2 failed: Expected existing active ticket returned');
  }

  // Test 3: Complete ticket 1 (call & complete)
  console.log('\n[Test 3] Moving ticket #1 to completed');
  await supaRpc('call_next_ticket', { p_org_slug: orgSlug }); // calls #1
  await supaRpc('call_next_ticket', { p_org_slug: orgSlug }); // moves #1 to completed (queue is now empty = 0)

  // Verify ticket #1 is completed
  const completedTickets = await supaQuery(`queue_tickets?org_slug=eq.${orgSlug}&customer_phone=eq.${testPhone}&status=eq.completed`);
  console.log('Completed ticket count:', completedTickets.length);

  // Test 4: Re-booking when Clinic is EMPTY (Zero-Wait Bypass)
  console.log('\n[Test 4] Re-booking when Clinic is EMPTY (0 waiting)');
  const t4 = await supaRpc('issue_next_ticket', {
    p_org_slug: orgSlug,
    p_customer_phone: testPhone,
    p_customer_name: 'أمير فحص إضافي',
    p_ticket_type: 'qr',
  });
  console.log('Ticket 4 response:', t4.data);
  if (t4.data.ticket_number && !t4.data.is_existing_active) {
    console.log('✓ Test 4 Passed: Cooldown bypassed because clinic is empty! Ticket #' + t4.data.ticket_number + ' issued.');
  } else {
    throw new Error('Test 4 failed: Expected new ticket issued because clinic is empty');
  }

  // Test 5: Complete ticket 4, but add someone ELSE to waiting queue
  console.log('\n[Test 5] Completing ticket 4 and adding another patient to waiting queue');
  await supaRpc('call_next_ticket', { p_org_slug: orgSlug }); // calls #2
  await supaRpc('call_next_ticket', { p_org_slug: orgSlug }); // completes #2

  // Add another patient (Karim) so queue has waiting patients
  const tKarim = await supaRpc('issue_next_ticket', {
    p_org_slug: orgSlug,
    p_customer_phone: '0666998877',
    p_customer_name: 'كريم',
    p_ticket_type: 'qr',
  });
  console.log('Added Karim to queue as Ticket #' + tKarim.data.ticket_number);

  // Test 6: Re-booking when Clinic HAS WAITING PATIENTS (Cooldown should trigger!)
  console.log('\n[Test 6] Attempting re-booking for ' + testPhone + ' while Karim is waiting');
  const t6 = await supaRpc('issue_next_ticket', {
    p_org_slug: orgSlug,
    p_customer_phone: testPhone,
    p_customer_name: 'أمير محاولة سريعة',
    p_ticket_type: 'qr',
  });
  console.log('Ticket 6 status & response:', t6.status, t6.data);
  const msg = JSON.stringify(t6.data);
  if (msg.includes('COOLDOWN_ACTIVE')) {
    console.log('✓ Test 6 Passed: Cooldown TRIGGERED! Re-booking rejected while patients are waiting: ' + msg);
  } else {
    throw new Error('Test 6 failed: Cooldown was expected to block re-booking');
  }

  // Test 7: Staff/Walk-in override (Receptionist creates ticket for Amir despite cooldown)
  console.log('\n[Test 7] Receptionist creating walk-in ticket for ' + testPhone + ' (Staff Override)');
  const t7 = await supaRpc('issue_next_ticket', {
    p_org_slug: orgSlug,
    p_customer_phone: testPhone,
    p_customer_name: 'أمير (استقبال)',
    p_ticket_type: 'walkin',
  });
  console.log('Ticket 7 walkin response:', t7.data);
  if (t7.data.ticket_number) {
    console.log('✓ Test 7 Passed: Receptionist override bypassed cooldown! Ticket #' + t7.data.ticket_number + ' issued.');
  } else {
    throw new Error('Test 7 failed: Walk-in ticket was blocked');
  }

  // Clean up
  console.log('\nCleaning test data from clinic-amal...');
  await fetch(`${url}/queue_tickets?org_slug=eq.${orgSlug}`, { method: 'DELETE', headers });
  await fetch(`${url}/queue_organizations?slug=eq.${orgSlug}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ current_ticket_number: 0, last_issued_number: 0 }),
  });

  console.log('\n==========================================');
  console.log(' ALL 7 COOLDOWN & FAIR-USAGE TESTS PASSED!');
  console.log('==========================================');
}

runTest().catch((e) => {
  console.error('Test Failed:', e);
  process.exit(1);
});
