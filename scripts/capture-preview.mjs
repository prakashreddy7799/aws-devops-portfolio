import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const outputDirectory = fileURLToPath(new URL('../test-results/visual/', import.meta.url));
const socialCardPath = fileURLToPath(new URL('../public/social-card.png', import.meta.url));
const baseURL = process.env.PORTFOLIO_PREVIEW_URL || 'http://127.0.0.1:4173';
const executablePath = [
  process.env.PLAYWRIGHT_EXECUTABLE_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((candidate) => candidate && existsSync(candidate));

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch(executablePath ? { executablePath } : {});

try {
  const socialContext = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const socialPage = await socialContext.newPage();
  const socialResponse = await socialPage.goto(`${baseURL}/social-card.svg`);
  if (!socialResponse?.ok()) throw new Error('The preview did not serve social-card.svg.');
  await socialPage.evaluate(() => document.fonts.ready);
  await socialPage.screenshot({ path: socialCardPath, fullPage: false });
  await socialContext.close();
  console.log(`Social card: ${socialCardPath}`);

  if (!process.argv.includes('--social-only'))
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 375, height: 812 },
    ]) {
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        reducedMotion: 'no-preference',
      });
      const page = await context.newPage();
      const runtimeErrors = [];
      page.on('pageerror', (error) => runtimeErrors.push(error.message));
      await page.goto(baseURL, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { level: 1 }).waitFor({ state: 'visible' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1800);
      await page.screenshot({
        path: `${outputDirectory}/hero-${viewport.width}.png`,
        fullPage: false,
      });

      // Check the longest rotating title without moving the content below it.
      const descriptionTop = await page
        .locator('.hero-description')
        .evaluate((element) => element.getBoundingClientRect().top);
      await page
        .locator('.role-window > span:not(.role-sizer)')
        .filter({ hasText: 'Site Reliability Engineer (SRE)' })
        .waitFor({ state: 'visible', timeout: 20_000 });
      await page.waitForTimeout(350);
      await page.getByRole('button', { name: 'Pause animations', exact: true }).click();
      const roleLayout = await page.locator('.role-window').evaluate((element) => ({
        right: element.getBoundingClientRect().right,
        width: element.clientWidth,
        contentWidth: element.scrollWidth,
        viewport: window.innerWidth,
        descriptionTop: document.querySelector('.hero-description').getBoundingClientRect().top,
      }));
      if (
        roleLayout.right > roleLayout.viewport ||
        roleLayout.contentWidth > roleLayout.width + 1 ||
        Math.abs(roleLayout.descriptionTop - descriptionTop) > 1
      ) {
        throw new Error(
          `Rotating role layout at ${viewport.width}px: ${JSON.stringify(roleLayout)}`,
        );
      }
      await page.screenshot({
        path: `${outputDirectory}/hero-sre-${viewport.width}.png`,
        fullPage: false,
      });
      await page.getByRole('button', { name: 'Resume animations', exact: true }).click();

      // Visit the whole document so card reveals inside tall sections also run.
      const scrollStep = Math.floor(viewport.height * 0.65);
      for (
        let position = 0;
        position < (await page.evaluate(() => document.documentElement.scrollHeight));
        position += scrollStep
      ) {
        await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), position);
        await page.waitForTimeout(350);
      }
      await page.waitForTimeout(1000);
      await page.getByRole('button', { name: 'Pause animations', exact: true }).click();
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(250);
      await page.screenshot({
        path: `${outputDirectory}/portfolio-${viewport.width}.png`,
        fullPage: true,
      });
      if (runtimeErrors.length)
        throw new Error(`Browser errors at ${viewport.width}px: ${runtimeErrors.join('; ')}`);
      console.log(`Captured ${viewport.width}px hero and full page in ${outputDirectory}`);
      await context.close();
    }
} finally {
  await browser.close();
}

console.log(`Rebuild ${projectRoot} to include the generated social-card.png in dist.`);
