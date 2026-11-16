const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://smart-queue-system-zeta.vercel.app';
const SHOTS_DIR = path.join(__dirname, '..', 'public', 'shots');

if (!fs.existsSync(SHOTS_DIR)) {
  fs.mkdirSync(SHOTS_DIR, { recursive: true });
}

async function run() {
  console.log('Launching browser (Edge channel)...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  try {
    // 1. Customer Mobile - Initial Entry View (iPhone 14)
    console.log('1. Capturing customer mobile entry...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const pageMobile = await mobileContext.newPage();
    await pageMobile.goto(`${BASE_URL}/q/clinic-amal`, { waitUntil: 'networkidle' });
    await pageMobile.waitForTimeout(2000);
    await pageMobile.screenshot({ path: path.join(SHOTS_DIR, 'customer-mobile-entry.png') });

    // 2. Issue a ticket on mobile to capture Active Ticket Screen
    console.log('2. Filling ticket form on mobile...');
    const phoneInput = pageMobile.locator('input[type="tel"]');
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('0550123456');
      const nameInput = pageMobile.locator('input[placeholder*="صالح"]');
      if (await nameInput.isVisible()) {
        await nameInput.fill('أحمد بن عيسى');
      }
      const submitBtn = pageMobile.locator('button[type="submit"]');
      await submitBtn.click();
      await pageMobile.waitForTimeout(3000);
      await pageMobile.screenshot({ path: path.join(SHOTS_DIR, 'customer-mobile-ticket.png') });
    }

    // 3. Admin Remote Dashboard (Mobile View & Desktop View)
    console.log('3. Capturing admin dashboard (Desktop & Mobile)...');
    const adminContext = await browser.newContext({
      viewport: { width: 440, height: 900 },
      deviceScaleFactor: 2,
    });
    const pageAdmin = await adminContext.newPage();
    
    await pageAdmin.goto(`${BASE_URL}/admin/clinic-amal`, { waitUntil: 'networkidle' });
    await pageAdmin.evaluate(() => {
      sessionStorage.setItem('queue_admin_auth_clinic-amal', 'true');
    });
    await pageAdmin.reload({ waitUntil: 'networkidle' });
    await pageAdmin.waitForTimeout(2000);
    await pageAdmin.screenshot({ path: path.join(SHOTS_DIR, 'admin-dashboard-mobile.png') });

    // Desktop wide view of Admin
    await pageAdmin.setViewportSize({ width: 1200, height: 800 });
    await pageAdmin.waitForTimeout(1000);
    await pageAdmin.screenshot({ path: path.join(SHOTS_DIR, 'admin-dashboard-desktop.png') });

    // 4. Open Printable Stand Modal
    console.log('4. Capturing Printable Stand Modal...');
    const standBtn = pageAdmin.locator('button[title*="ملصق"]');
    if (await standBtn.isVisible()) {
      await standBtn.click();
      await pageAdmin.waitForTimeout(1500);
      await pageAdmin.screenshot({ path: path.join(SHOTS_DIR, 'admin-stand-modal.png') });
    }

    // 5. Open Daily Stats Modal (Reload to start clean)
    console.log('5. Capturing Daily Stats Modal...');
    await pageAdmin.reload({ waitUntil: 'networkidle' });
    await pageAdmin.waitForTimeout(1500);
    const statsBtn = pageAdmin.locator('button[title*="إحصائيات"]');
    if (await statsBtn.isVisible()) {
      await statsBtn.click();
      await pageAdmin.waitForTimeout(1500);
      await pageAdmin.screenshot({ path: path.join(SHOTS_DIR, 'admin-stats-modal.png') });
    }

    // 6. TV Display Screen (1920x1080)
    console.log('6. Capturing TV display screen...');
    const tvContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1.5,
    });
    const pageTv = await tvContext.newPage();
    await pageTv.goto(`${BASE_URL}/display/clinic-amal`, { waitUntil: 'networkidle' });
    await pageTv.waitForTimeout(2500);
    await pageTv.screenshot({ path: path.join(SHOTS_DIR, 'tv-display-1080p.png') });

    // 7. Super Admin Portal (1280x850)
    console.log('7. Capturing Super Admin Portal...');
    const pageSuper = await tvContext.newPage();
    await pageSuper.setViewportSize({ width: 1280, height: 850 });
    await pageSuper.goto(`${BASE_URL}/super-admin`, { waitUntil: 'networkidle' });
    await pageSuper.waitForTimeout(2000);
    await pageSuper.screenshot({ path: path.join(SHOTS_DIR, 'super-admin-portal.png') });

    console.log('ALL 7 SHOWCASE SCREENSHOTS COMPLETED!');
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    await browser.close();
  }
}

run();
