const BASE_URL = 'http://localhost:3000';

async function test(name, fn) {
  try {
    process.stdout.write(`⏳ Running: ${name} ... `);
    await fn();
    console.log(`\x1b[32m✔ PASSED\x1b[0m`);
    return true;
  } catch (err) {
    console.log(`\x1b[31m✖ FAILED\x1b[0m`);
    console.error(`   Error: ${err.message}`);
    return false;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

async function runSecuritySuite() {
  console.log('\n=============================================================');
  console.log('🛡️  SMART QUEUE SYSTEM: ULTIMATE SECURITY & SABOTAGE AUDIT');
  console.log('=============================================================\n');

  let passed = 0;
  let total = 0;

  // Wait for server ready
  let serverReady = false;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/organizations`);
      if (res.ok) {
        serverReady = true;
        break;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  if (!serverReady) {
    console.error('❌ Server failed to respond on port 3000. Aborting.');
    process.exit(1);
  }

  // Ensure clinic-amal exists and has PIN 1234
  await fetch(`${BASE_URL}/api/organizations/clinic-amal`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-staff-pin': '9999' },
    body: JSON.stringify({ pin_code: '1234', daily_max_tickets: 0, auto_schedule_enabled: 0 }),
  });

  // Reset clinic-amal to clean state
  await fetch(`${BASE_URL}/api/organizations/clinic-amal/reset`, {
    method: 'POST',
    headers: { 'x-staff-pin': '1234' },
  });

  // -------------------------------------------------------------
  // TEST GROUP 1: Staff Action Endpoints Authentication
  // -------------------------------------------------------------
  total++;
  if (await test('1.1: Reject calling /next without PIN (Public stranger)', async () => {
    const res = await fetch(`${BASE_URL}/api/organizations/clinic-amal/next`, { method: 'POST' });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
    const json = await res.json();
    assert(json.success === false, 'Expected success=false');
  })) passed++;

  total++;
  if (await test('1.2: Reject calling /next with wrong PIN (9998)', async () => {
    const res = await fetch(`${BASE_URL}/api/organizations/clinic-amal/next`, {
      method: 'POST',
      headers: { 'x-staff-pin': '9998' },
    });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  })) passed++;

  total++;
  if (await test('1.3: Reject calling /hold without PIN', async () => {
    const res = await fetch(`${BASE_URL}/api/organizations/clinic-amal/hold`, { method: 'POST' });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  })) passed++;

  total++;
  if (await test('1.4: Reject calling /complete without PIN', async () => {
    const res = await fetch(`${BASE_URL}/api/organizations/clinic-amal/complete`, { method: 'POST' });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  })) passed++;

  total++;
  if (await test('1.5: Reject calling /enter without PIN', async () => {
    const res = await fetch(`${BASE_URL}/api/organizations/clinic-amal/enter`, { method: 'POST' });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  })) passed++;

  total++;
  if (await test('1.6: Reject calling /recall without PIN', async () => {
    const res = await fetch(`${BASE_URL}/api/organizations/clinic-amal/recall`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId: 1 }),
    });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  })) passed++;

  total++;
  if (await test('1.7: Reject calling /reset without PIN', async () => {
    const res = await fetch(`${BASE_URL}/api/organizations/clinic-amal/reset`, { method: 'POST' });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  })) passed++;

  total++;
  if (await test('1.8: Reject exporting customer phone records without Staff PIN', async () => {
    const res = await fetch(`${BASE_URL}/api/organizations/clinic-amal?export=true`);
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  })) passed++;

  total++;
  if (await test('1.9: Reject PATCH settings without Staff PIN', async () => {
    const res = await fetch(`${BASE_URL}/api/organizations/clinic-amal`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avg_service_mins: 99 }),
    });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  })) passed++;

  // -------------------------------------------------------------
  // TEST GROUP 2: Cross-Tenant Isolation
  // -------------------------------------------------------------
  total++;
  if (await test('2.1: Prevent Staff of Clinic B from controlling Clinic Amal queue', async () => {
    // Create Clinic B with PIN 7777 using Master Key
    await fetch(`${BASE_URL}/api/organizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-super-admin-key': '9999' },
      body: JSON.stringify({ slug: 'clinic-rival', name: 'Rival Clinic', pin_code: '7777' }),
    });

    // Staff of Rival Clinic tries to call next on clinic-amal with their own PIN (7777)
    const res = await fetch(`${BASE_URL}/api/organizations/clinic-amal/next`, {
      method: 'POST',
      headers: { 'x-staff-pin': '7777' },
    });
    assert(res.status === 401, `Cross-tenant attack not blocked! Expected 401, got ${res.status}`);

    // Clean up rival clinic
    await fetch(`${BASE_URL}/api/organizations/clinic-rival`, {
      method: 'DELETE',
      headers: { 'x-super-admin-key': '9999' },
    });
  })) passed++;

  // -------------------------------------------------------------
  // TEST GROUP 3: IDOR Attack - Malicious Ticket Cancellation
  // -------------------------------------------------------------
  let victimTicketId = null;
  total++;
  if (await test('3.1: Create legitimate customer ticket (#1)', async () => {
    const res = await fetch(`${BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgSlug: 'clinic-amal',
        customerName: 'فاطمة الزهراء',
        customerPhone: '0555112233',
        ticketType: 'qr',
      }),
    });
    const json = await res.json();
    assert(json.success === true, 'Failed to issue victim ticket');
    victimTicketId = json.data.id;
    assert(victimTicketId, 'Ticket ID missing');
  })) passed++;

  total++;
  if (await test('3.2: Malicious stranger attempts to cancel victim ticket (No auth, No phone)', async () => {
    const res = await fetch(`${BASE_URL}/api/tickets?ticketId=${victimTicketId}&orgSlug=clinic-amal`, {
      method: 'DELETE',
    });
    assert(res.status === 403, `IDOR vulnerability! Expected 403 Forbidden, got ${res.status}`);
  })) passed++;

  total++;
  if (await test('3.3: Attacker tries to cancel victim ticket with a different/spoofed phone', async () => {
    const res = await fetch(`${BASE_URL}/api/tickets?ticketId=${victimTicketId}&orgSlug=clinic-amal&phone=0555999999`, {
      method: 'DELETE',
    });
    assert(res.status === 403, `Phone mismatch not blocked! Expected 403 Forbidden, got ${res.status}`);
  })) passed++;

  total++;
  if (await test('3.4: Legitimate owner cancels their own ticket with matching phone', async () => {
    const res = await fetch(`${BASE_URL}/api/tickets?ticketId=${victimTicketId}&orgSlug=clinic-amal&phone=0555112233`, {
      method: 'DELETE',
    });
    assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
    const json = await res.json();
    assert(json.data.cancelled === true, 'Ticket was not cancelled');
  })) passed++;

  total++;
  if (await test('3.5: Staff cancels a ticket using valid Staff PIN', async () => {
    // Book another ticket
    const bookRes = await fetch(`${BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgSlug: 'clinic-amal',
        customerName: 'كريم بلحاج',
        customerPhone: '0555334455',
        ticketType: 'qr',
      }),
    });
    const bookJson = await bookRes.json();
    const newId = bookJson.data.id;

    // Staff cancels with PIN
    const delRes = await fetch(`${BASE_URL}/api/tickets?ticketId=${newId}&orgSlug=clinic-amal`, {
      method: 'DELETE',
      headers: { 'x-staff-pin': '1234' },
    });
    assert(delRes.status === 200, `Staff deletion failed, got ${delRes.status}`);
  })) passed++;

  // -------------------------------------------------------------
  // TEST GROUP 4: Feedback / Rating Tampering & Duplicate Spam
  // -------------------------------------------------------------
  let ratingTestTicketId = null;
  total++;
  if (await test('4.1: Book customer ticket for service rating lifecycle', async () => {
    const res = await fetch(`${BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgSlug: 'clinic-amal',
        customerName: 'حسام الدين',
        customerPhone: '0555778899',
        ticketType: 'qr',
      }),
    });
    const json = await res.json();
    ratingTestTicketId = json.data.id;
    assert(ratingTestTicketId, 'Ticket ID missing');
  })) passed++;

  total++;
  if (await test('4.2: Block rating submission while ticket is still waiting (Premature review)', async () => {
    const res = await fetch(`${BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'feedback',
        ticketId: ratingTestTicketId,
        rating: 'great',
      }),
    });
    assert(res.status === 400, `Expected 400 Bad Request for uncompleted ticket rating, got ${res.status}`);
    const json = await res.json();
    assert(json.success === false, 'Expected success=false');
    assert(json.error.includes('اكتمال'), `Expected error to mention completion, got: ${json.error}`);
  })) passed++;

  total++;
  if (await test('4.3: Progress ticket to completed (Call -> Enter -> Complete)', async () => {
    // 1. Call Next
    const nextRes = await fetch(`${BASE_URL}/api/organizations/clinic-amal/next`, {
      method: 'POST',
      headers: { 'x-staff-pin': '1234' },
    });
    assert(nextRes.ok, 'Failed to call next');

    // 2. Enter
    const enterRes = await fetch(`${BASE_URL}/api/organizations/clinic-amal/enter`, {
      method: 'POST',
      headers: { 'x-staff-pin': '1234' },
    });
    assert(enterRes.ok, 'Failed to enter');

    // 3. Complete
    const compRes = await fetch(`${BASE_URL}/api/organizations/clinic-amal/complete`, {
      method: 'POST',
      headers: { 'x-staff-pin': '1234' },
    });
    assert(compRes.ok, 'Failed to complete');
  })) passed++;

  total++;
  if (await test('4.4: Submit rating on completed ticket (Legitimate 1st review)', async () => {
    const res = await fetch(`${BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'feedback',
        ticketId: ratingTestTicketId,
        rating: 'great',
      }),
    });
    assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
    const json = await res.json();
    assert(json.success === true, 'Failed to record feedback');
  })) passed++;

  total++;
  if (await test('4.5: Block duplicate rating spam on the same ticket (2nd review attempt)', async () => {
    const res = await fetch(`${BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'feedback',
        ticketId: ratingTestTicketId,
        rating: 'bad',
      }),
    });
    assert(res.status === 400, `Expected 400 Bad Request for duplicate rating, got ${res.status}`);
    const json = await res.json();
    assert(json.success === false, 'Expected success=false');
    assert(json.error.includes('مسبقاً'), `Expected error to mention already rated, got: ${json.error}`);
  })) passed++;

  // -------------------------------------------------------------
  // TEST GROUP 5: Input Sanitization & XSS / Injection Defense
  // -------------------------------------------------------------
  total++;
  if (await test('5.1: XSS HTML Script Tag Injection Defense in Customer Name', async () => {
    const maliciousName = "<script>alert('pwned')</script><b>محمد بوعلام</b>";
    const res = await fetch(`${BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgSlug: 'clinic-amal',
        customerName: maliciousName,
        customerPhone: '0661998877',
        ticketType: 'qr',
      }),
    });
    const json = await res.json();
    assert(json.success === true, 'Failed to issue ticket with dirty name');
    // Verify tags are completely stripped
    assert(!json.data.customer_name.includes('<script>'), 'Dangerous <script> tag remained!');
    assert(!json.data.customer_name.includes('<b>'), 'HTML <b> tag remained!');
    assert(json.data.customer_name.includes('محمد بوعلام'), 'Valid Arabic characters preserved');
  })) passed++;

  total++;
  if (await test('5.2: SQL Injection payload handled safely as literal string', async () => {
    const sqlInjection = "' OR 1=1; DROP TABLE queue_tickets; --";
    const res = await fetch(`${BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgSlug: 'clinic-amal',
        customerName: sqlInjection,
        customerPhone: '0661223344',
        ticketType: 'qr',
      }),
    });
    const json = await res.json();
    assert(json.success === true, 'Ticket with SQL characters handled safely');

    // Confirm database table still exists and functional
    const checkState = await fetch(`${BASE_URL}/api/organizations/clinic-amal`);
    assert(checkState.ok, 'Database table intact after injection attempt');
  })) passed++;

  total++;
  if (await test('5.3: Giant buffer overflow string (>10,000 chars) truncated safely', async () => {
    const hugeString = 'أحمد'.repeat(3000);
    const res = await fetch(`${BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgSlug: 'clinic-amal',
        customerName: hugeString,
        customerPhone: '0661445566',
        ticketType: 'qr',
      }),
    });
    const json = await res.json();
    assert(json.success === true, 'Huge string handled without server crash');
    assert(json.data.customer_name.length <= 50, `Name length exceeded 50 chars: ${json.data.customer_name.length}`);
  })) passed++;

  // -------------------------------------------------------------
  // TEST GROUP 6: Phone Number Validation & Sanitization
  // -------------------------------------------------------------
  total++;
  if (await test('6.1: Reject phone with letters (0555ABC123)', async () => {
    const res = await fetch(`${BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgSlug: 'clinic-amal',
        customerPhone: '0555ABC123',
      }),
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  })) passed++;

  total++;
  if (await test('6.2: Reject phone too short (1234)', async () => {
    const res = await fetch(`${BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgSlug: 'clinic-amal',
        customerPhone: '1234',
      }),
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  })) passed++;

  total++;
  if (await test('6.3: Accept formatted phone with spaces (05 50 12 34 56) and normalize', async () => {
    const res = await fetch(`${BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgSlug: 'clinic-amal',
        customerPhone: '05 50 12 34 56',
      }),
    });
    const json = await res.json();
    assert(json.success === true, 'Failed to issue ticket with spaced phone');
    assert(json.data.customer_phone === '0550123456', `Expected normalized phone, got: ${json.data.customer_phone}`);
  })) passed++;

  // -------------------------------------------------------------
  // TEST GROUP 7: Walk-in Privilege Escalation Defense
  // -------------------------------------------------------------
  total++;
  if (await test('7.1: Reject public user issuing ticketType: walkin without Staff PIN', async () => {
    const res = await fetch(`${BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgSlug: 'clinic-amal',
        customerPhone: '0770112233',
        ticketType: 'walkin',
      }),
    });
    assert(res.status === 401, `Privilege escalation succeeded! Expected 401, got ${res.status}`);
  })) passed++;

  total++;
  if (await test('7.2: Allow legitimate staff to issue ticketType: walkin with Staff PIN', async () => {
    const res = await fetch(`${BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-staff-pin': '1234' },
      body: JSON.stringify({
        orgSlug: 'clinic-amal',
        customerName: 'مريض مستعجل حضوري',
        customerPhone: '0770112233',
        ticketType: 'walkin',
      }),
    });
    assert(res.status === 201, `Staff walkin failed, got ${res.status}`);
    const json = await res.json();
    assert(json.data.ticket_type === 'walkin', 'Expected ticket_type walkin');
  })) passed++;

  // -------------------------------------------------------------
  // TEST GROUP 8: Super Admin Platform Defense
  // -------------------------------------------------------------
  total++;
  if (await test('8.1: Block public access to platform financials (GET /api/organizations?stats=true)', async () => {
    const res = await fetch(`${BASE_URL}/api/organizations?stats=true`);
    assert(res.status === 401, `Financial leak! Expected 401, got ${res.status}`);
  })) passed++;

  total++;
  if (await test('8.2: Block public attempt to delete an organization without Master Key', async () => {
    const res = await fetch(`${BASE_URL}/api/organizations/clinic-amal`, { method: 'DELETE' });
    assert(res.status === 401, `Unauthorized org deletion! Expected 401, got ${res.status}`);
  })) passed++;

  total++;
  if (await test('8.3: Block public attempt to create an organization without Master Key', async () => {
    const res = await fetch(`${BASE_URL}/api/organizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'hacked-org', name: 'Hacked Org' }),
    });
    assert(res.status === 401, `Unauthorized org creation! Expected 401, got ${res.status}`);
  })) passed++;

  total++;
  if (await test('8.4: Allow Super Admin to access stats with Master Key 9999', async () => {
    const res = await fetch(`${BASE_URL}/api/organizations?stats=true`, {
      headers: { 'x-super-admin-key': '9999' },
    });
    assert(res.status === 200, `Super admin rejected, got ${res.status}`);
    const json = await res.json();
    assert(json.success === true && json.data.financials, 'Missing financials in stats response');
  })) passed++;

  // -------------------------------------------------------------
  // TEST GROUP 9: State Machine Stability & Edge Cases
  // -------------------------------------------------------------
  total++;
  if (await test('9.1: Call enter when no ticket is called (Graceful no-op)', async () => {
    // Current ticket is completed, none called
    const res = await fetch(`${BASE_URL}/api/organizations/clinic-amal/enter`, {
      method: 'POST',
      headers: { 'x-staff-pin': '1234' },
    });
    // Handled without crash (either 200 or 500 with clean message)
    assert(res.status !== 502 && res.status !== 503, 'Server crashed');
  })) passed++;

  total++;
  if (await test('9.2: Call hold when no active called ticket (Graceful handle)', async () => {
    const res = await fetch(`${BASE_URL}/api/organizations/clinic-amal/hold`, {
      method: 'POST',
      headers: { 'x-staff-pin': '1234' },
    });
    assert(res.status !== 502 && res.status !== 503, 'Server crashed');
  })) passed++;

  total++;
  if (await test('9.3: Reset empty queue (Idempotent clean execution)', async () => {
    const res = await fetch(`${BASE_URL}/api/organizations/clinic-amal/reset`, {
      method: 'POST',
      headers: { 'x-staff-pin': '1234' },
    });
    assert(res.status === 200, `Reset failed, got ${res.status}`);
  })) passed++;

  // -------------------------------------------------------------
  // TEST GROUP 10: Anti-Bot Rate Limiting Simulation
  // -------------------------------------------------------------
  total++;
  if (await test('10.1: Rapid bot flooding exceeds IP limit and receives 429 Too Many Requests', async () => {
    let got429 = false;
    for (let i = 0; i < 15; i++) {
      const res = await fetch(`${BASE_URL}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgSlug: 'clinic-amal',
          customerName: `Bot ${i}`,
          customerPhone: `05550000${String(i).padStart(2, '0')}`,
          ticketType: 'qr',
        }),
      });
      if (res.status === 429) {
        got429 = true;
        break;
      }
    }
    assert(got429, 'Bot flood was NOT throttled! Rate limit failed to trigger.');
  })) passed++;

  console.log('\n=============================================================');
  console.log(`🎯 AUDIT COMPLETE: ${passed} / ${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('=============================================================\n');

  if (passed === total) {
    console.log('🌟 ALL ATTACK VECTORS & CORRUPTION SCENARIOS SUCCESSFULLY DEFENDED!');
    process.exit(0);
  } else {
    console.error('⚠️ SOME SECURITY TESTS FAILED. INVESTIGATION REQUIRED.');
    process.exit(1);
  }
}

runSecuritySuite();
