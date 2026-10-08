import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const test = base.extend({
  page: async ({ page }, use) => {
    const runtimeErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    await use(page);
    expect(runtimeErrors, 'No uncaught browser errors').toEqual([]);
  },
});

const sectionIds = ['home', 'about', 'skills', 'experience', 'projects', 'resume', 'contact'];
const allSectionIds = [
  'home',
  'about',
  'skills',
  'architecture',
  'experience',
  'projects',
  'resume',
  'contact',
];

test('page structure, professional links, and downloadable PDF are intact', async ({
  page,
  request,
}) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Chandra Prakash Reddy/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Engineering Reliable Cloud Infrastructure at Scale.',
  );

  for (const sectionId of sectionIds) {
    await expect(page.locator(`#${sectionId}`)).toHaveCount(1);
    await expect(page.locator(`a[href="#${sectionId}"]`).first()).toBeAttached();
  }

  await expect(page.locator('a[href="mailto:dodlaprakashreddy@gmail.com"]').first()).toBeAttached();
  await expect(page.locator('a[href*="github.com"]')).toHaveCount(0);
  const portrait = page.locator('#home img');
  await expect(portrait).toHaveAttribute('alt', 'Chandra Prakash Reddy');
  await expect
    .poll(() => portrait.evaluate((image) => image.complete && image.naturalWidth > 0))
    .toBe(true);
  await expect(
    page.locator('a[href="https://www.linkedin.com/in/chandra-prakash-reddy-921260218/"]').first(),
  ).toBeAttached();
  await expect(page.getByRole('link', { name: /download resume/i }).first()).toHaveAttribute(
    'href',
    '/resume.pdf',
  );

  const resume = await request.get('/resume.pdf');
  expect(resume.ok()).toBeTruthy();
  expect(resume.headers()['content-type']).toContain('application/pdf');
  expect((await resume.body()).subarray(0, 5).toString()).toBe('%PDF-');
});

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`layout fits the ${width}px viewport`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    for (const sectionId of allSectionIds) {
      await page.locator(`#${sectionId}`).scrollIntoViewIfNeeded();
      const geometry = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        overflow: [...document.querySelectorAll('main *, header *, footer *')]
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return (
              style.position !== 'fixed' &&
              rect.width > 0 &&
              (rect.right > window.innerWidth + 1 || rect.left < -1)
            );
          })
          .slice(0, 5)
          .map(
            (element) =>
              `${element.tagName.toLowerCase()}.${element.className?.baseVal ?? element.className}`,
          ),
      }));
      expect(
        Math.max(geometry.document, geometry.body),
        JSON.stringify(geometry),
      ).toBeLessThanOrEqual(geometry.viewport + 1);
    }
    if (width === 375 || width === 1440) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({
        path: testInfo.outputPath(`portfolio-${width}.png`),
        fullPage: true,
      });
    }
  });
}

test('mobile navigation supports keyboard, Escape, and anchor selection', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const openMenu = page.getByRole('button', { name: 'Open navigation', exact: true });
  await openMenu.focus();
  await page.keyboard.press('Enter');
  const closeMenu = page.getByRole('button', { name: 'Close navigation', exact: true });
  await expect(closeMenu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Projects', exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('mobile-navigation.png') });
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(openMenu).toHaveAttribute('aria-expanded', 'false');
  await expect(openMenu).toBeFocused();
  await openMenu.click();
  await page.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(openMenu).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#primary-navigation a[href="#about"]')).toHaveAttribute(
    'aria-current',
    'location',
  );
  await openMenu.click();
  await page
    .getByRole('link', { name: 'Chandra Prakash Reddy, back to home', exact: true })
    .click();
  await expect(page).toHaveURL(/#home$/);
  await expect(openMenu).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#primary-navigation a[href="#home"]')).toHaveAttribute(
    'aria-current',
    'location',
  );
});

test('experience and project case studies expand with the keyboard', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const sectionId of ['experience', 'projects']) {
    const card = page.locator(`#${sectionId} details`).first();
    const summary = card.locator('summary');
    await summary.scrollIntoViewIfNeeded();
    const wasOpen = await card.evaluate((element) => element.open);
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => card.evaluate((element) => element.open)).toBe(!wasOpen);
    await page.keyboard.press('Enter');
    await expect.poll(() => card.evaluate((element) => element.open)).toBe(wasOpen);
  }
});

test('architecture nodes explain deployment stages and supporting services', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('#architecture').scrollIntoViewIfNeeded();
  const stages = page.getByRole('group', { name: 'Delivery pipeline stages', exact: true });
  const services = page.getByRole('group', {
    name: 'Supporting infrastructure services',
    exact: true,
  });
  const detail = page.getByRole('region', { name: 'Selected architecture stage', exact: true });
  await expect(stages.getByRole('button')).toHaveCount(8);
  await expect(services.getByRole('button')).toHaveCount(4);

  const github = stages.getByRole('button', { name: /GitHub/ });
  await github.scrollIntoViewIfNeeded();
  await github.focus();
  await page.keyboard.press('Enter');
  await expect(github).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.getByRole('heading', { level: 3 })).toHaveText('GitHub');
  await expect(stages.getByRole('button', { pressed: true })).toHaveCount(1);

  const terraform = services.getByRole('button', { name: /Terraform/ });
  await terraform.click();
  await expect(terraform).toHaveAttribute('aria-pressed', 'true');
  await expect(detail.getByRole('heading', { level: 3 })).toHaveText('Terraform');
  await expect(stages.getByRole('button', { pressed: true })).toHaveCount(0);
  await expect(services.getByRole('button', { pressed: true })).toHaveCount(1);
});

for (const { width, openMenu, name } of [
  { width: 1440, openMenu: false, name: 'desktop content' },
  { width: 375, openMenu: false, name: 'mobile content' },
  { width: 375, openMenu: true, name: 'mobile navigation overlay' },
]) {
  test(`${name} has no serious or critical accessibility violations`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    for (const sectionId of allSectionIds) {
      await page.locator(`#${sectionId}`).scrollIntoViewIfNeeded();
    }
    await expect(
      page.getByRole('group', { name: 'Delivery pipeline stages', exact: true }),
    ).toBeAttached();
    for (const sectionId of ['experience', 'projects']) {
      const card = page.locator(`#${sectionId} details`).first();
      if (!(await card.evaluate((element) => element.open))) {
        await card.locator('summary').click();
      }
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    if (openMenu) await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const violations = results.violations.filter(({ impact }) =>
      ['serious', 'critical'].includes(impact),
    );
    expect(
      violations.map(({ id, impact, nodes }) => ({
        id,
        impact,
        targets: nodes.map(({ target }) => target),
      })),
    ).toEqual([]);
  });
}

test('animation control pauses and resumes continuous motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion-paused', 'false');
  await page.getByRole('button', { name: 'Pause animations', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion-paused', 'true');
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter(
              (animation) =>
                animation.playState === 'running' &&
                animation.effect?.getTiming().iterations === Infinity,
            ).length,
      ),
    )
    .toBe(0);
  await page.getByRole('button', { name: 'Resume animations', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion-paused', 'false');
  await expect(page.getByRole('button', { name: 'Pause animations', exact: true })).toBeVisible();
});

test('reduced motion keeps content available and stops continuous animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const sectionId of allSectionIds) {
    await page.locator(`#${sectionId}`).scrollIntoViewIfNeeded();
  }
  await expect(page.locator('#contact')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Animation disabled by system preference', exact: true }),
  ).toBeDisabled();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter(
              (animation) =>
                animation.playState === 'running' &&
                animation.effect?.getTiming().iterations === Infinity,
            ).length,
      ),
    )
    .toBe(0);
});
