import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const test = base.extend({
  page: async ({ page }, use) => {
    const errors = [];
    const cloudRequests = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => {
      if (/https?:\/\/[^/]*(?:amazonaws\.com|aws\.amazon\.com)(?:[/:]|$)/i.test(request.url()))
        cloudRequests.push(request.url());
    });
    await use(page);
    expect(errors, 'No uncaught browser errors').toEqual([]);
    expect(cloudRequests, 'Walkthroughs never call AWS services').toEqual([]);
  },
});

async function open(page, id, theme = 'dark') {
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme });
  await page.goto('/');
  const article = page.locator(`#${id}`);
  await article.scrollIntoViewIfNeeded();
  await expect(article).toBeVisible();
  return article;
}
test('theme follows system preference and persists an explicit choice on refresh', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
test('Jenkins manual playback, deployment targets and failure recovery work', async ({ page }) => {
  const article = await open(page, 'jenkins-case-study');
  await expect(
    article.getByRole('group', { name: 'Jenkins pipeline stages' }).getByRole('button'),
  ).toHaveCount(9);
  await article.getByRole('combobox', { name: 'Jenkins deployment target' }).selectOption('ECS');
  await article.getByRole('button', { name: 'Run Pipeline', exact: true }).click();
  for (let index = 0; index < 9; index++) {
    const next = article.getByRole('button', { name: 'Next Stage', exact: true });
    if (await next.count()) await next.click();
  }
  await expect(article.getByRole('status')).toContainText('Complete');
  await article.getByRole('button', { name: 'Simulate Failure', exact: true }).click();
  await expect(article.getByRole('status')).toContainText('Unhealthy');
  await article.getByRole('button', { name: 'Recover Deployment', exact: true }).click();
  await article.getByRole('button', { name: 'Next Recovery Step', exact: true }).click();
  await article.getByRole('button', { name: 'Next Recovery Step', exact: true }).click();
  await article.getByRole('button', { name: 'Validate Recovery', exact: true }).click();
  await expect(article.getByRole('status')).toContainText('Recovered');
  await article.getByRole('button', { name: 'Replay', exact: true }).click();
  await expect(article.getByRole('status')).toContainText('Manual playback');
});

test('timed pipeline playback pauses, resumes and replays without stale stages', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2026-10-08T08:00:00Z') });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const article = page.locator('#jenkins-case-study');
  await article.scrollIntoViewIfNeeded();
  await page.clock.pauseAt(new Date('2026-10-08T10:00:00Z'));
  const status = article.getByRole('status', { name: 'Pipeline simulation status' });
  await article.getByRole('button', { name: 'Run Pipeline', exact: true }).click();
  await expect(status).toContainText('stage 1 of 9');
  await page.clock.runFor(1100);
  await expect(status).toContainText('stage 2 of 9');
  await article.getByRole('button', { name: 'Pause', exact: true }).click();
  await page.clock.runFor(5000);
  await expect(status).toContainText('Pipeline paused');
  await article.getByRole('button', { name: 'Resume', exact: true }).click();
  await page.clock.runFor(1100);
  await expect(status).toContainText('stage 3 of 9');
  await article.getByRole('button', { name: 'Replay', exact: true }).click();
  await expect(status).toContainText('stage 1 of 9');
});

test('ecosystem responds to the cursor and honors animation pause', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const section = page.locator('#architecture');
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute('data-motion-enabled', 'true');
  const node = section.locator('.arch-stage').first();
  await node.hover();
  await expect
    .poll(() => section.evaluate((el) => el.style.getPropertyValue('--architecture-pointer-x')))
    .not.toBe('');
  await expect.poll(() => node.evaluate((el) => getComputedStyle(el).transform)).not.toBe('none');
  await page.getByRole('button', { name: 'Pause animations', exact: true }).click();
  await expect(section).toHaveAttribute('data-motion-enabled', 'false');
  await node.hover();
  await expect.poll(() => node.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
});
test('sanitized examples copy exactly and remain selectable when clipboard access fails', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value) => {
          window.copiedExample = value;
        },
      },
    });
  });
  const article = await open(page, 'jenkins-case-study');
  const example = article.locator('.ej-code-example').first();
  await example.locator('summary').click();
  const source = await example.locator('code').textContent();
  await example.getByRole('button').click();
  await expect(example.getByRole('status')).toContainText('copied.');
  expect(await page.evaluate(() => window.copiedExample)).toBe(source);
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error('Access denied');
    };
  });
  await example.getByRole('button').click();
  const fallback = example.getByRole('textbox');
  await expect(fallback).toBeFocused();
  await expect(fallback).toHaveValue(source);
  expect(await fallback.evaluate((element) => element.selectionEnd - element.selectionStart)).toBe(
    source.length,
  );
});

test('CloudWatch incident can be investigated, recovered, and reset', async ({ page }) => {
  const article = await open(page, 'observability-case-study');
  await expect(article).toContainText('35%');
  await expect(article).toContainText('DEMO DATA');
  await article.getByRole('button', { name: 'Play Incident', exact: true }).click();
  await article.getByRole('button', { name: 'Next Demo Step', exact: true }).click();
  await article.getByRole('button', { name: 'Next Demo Step', exact: true }).click();
  await article.getByRole('button', { name: 'Investigate', exact: true }).click();
  await expect(article.getByRole('tab', { name: 'Incident Response' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await article.getByRole('button', { name: 'Recover', exact: true }).click();
  await article.getByRole('button', { name: 'Next Demo Step', exact: true }).click();
  await expect(article).toContainText('Recovery verified in the simulation.');
  await article.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(article).toContainText('Demo healthy');
  await article.getByRole('tab', { name: 'Overview', exact: true }).focus();
  await page.keyboard.press('End');
  await expect(article.getByRole('tab', { name: 'Incident Response' })).toBeFocused();
});
test('migration steps and environment architecture controls expose the correct details', async ({
  page,
}) => {
  const migration = await open(page, 'migration-case-study');
  const steps = migration.getByRole('list', { name: 'Migration journey steps' });
  await expect(steps.getByRole('button')).toHaveCount(12);
  await steps.getByRole('button').last().click();
  await expect(migration.getByRole('region', { name: 'Migration step details' })).toContainText(
    'rollback',
  );
  const env = page.locator('#environment-case-study');
  await env.scrollIntoViewIfNeeded();
  await env.getByRole('button', { name: 'PRODUCTION', exact: true }).click();
  await expect(env.locator('.env-context')).toContainText('Production');
  await env.getByRole('button', { name: 'Amazon ECR · image source', exact: true }).click();
  await expect(
    env.getByRole('region', { name: 'AWS resource information' }).getByRole('heading'),
  ).toHaveText('Amazon ECR');
  await env.getByRole('button', { name: 'Zoom in architecture' }).click();
  await expect(env.locator('.env-map')).toHaveAttribute('style', /1.15/);
  await env.getByRole('button', { name: 'Fit to View' }).click();
  await expect(env.locator('.env-map')).toHaveAttribute('style', /scale\(1\)/);
  await env.getByRole('button', { name: 'Play Request Flow' }).click();
  await expect(env.locator('.env-map')).not.toHaveClass(/is-flowing/);
});
test('skills filtering and playground tabs keep useful navigation available', async ({ page }) => {
  await open(page, 'skills');
  await page.getByRole('searchbox', { name: 'Find a skill or use case' }).fill('terraform');
  await expect(page.locator('#skills .skill-card')).toHaveCount(1);
  await page.getByRole('searchbox').fill('no-such-skill');
  await expect(page.locator('#skills')).toContainText('No matching skills');
  await page.locator('#devops-playground').scrollIntoViewIfNeeded();
  const tabs = page.getByRole('tablist', { name: 'DevOps playground experiences' });
  await tabs.getByRole('tab').first().focus();
  await page.keyboard.press('End');
  await expect(tabs.getByRole('tab', { name: 'Migration Journey' })).toBeFocused();
  await expect(page.locator('#playground-active-panel a')).toHaveAttribute(
    'href',
    '#migration-case-study',
  );
});
for (const theme of ['dark', 'light'])
  for (const width of [320, 768, 1440]) {
    test(`${theme} interactive experiences fit ${width}px`, async ({ page }, testInfo) => {
      test.setTimeout(60000);
      await page.setViewportSize({ width, height: 900 });
      await open(page, 'devops-playground', theme);
      for (const id of [
        'terraform-case-study',
        'environment-case-study',
        'jenkins-case-study',
        'observability-case-study',
        'migration-case-study',
      ]) {
        const article = page.locator(`#${id}`);
        await article.scrollIntoViewIfNeeded();
        expect(
          await page.evaluate(() =>
            Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
          ),
        ).toBeLessThanOrEqual(width + 1);
      }
      if (width === 1440) {
        for (const id of [
          'environment-case-study',
          'jenkins-case-study',
          'observability-case-study',
        ]) {
          await page
            .locator(`#${id}`)
            .screenshot({ path: testInfo.outputPath(`${theme}-${id}.png`) });
        }
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({ path: testInfo.outputPath(`${theme}-hero.png`) });
      }
    });
  }
for (const theme of ['dark', 'light'])
  test(`${theme} hero and navigation remain readable`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme });
    await page.goto('/');
    await expect(page.locator('.hero-actions')).toHaveCSS('opacity', '1');
    await expect(page.getByRole('link', { name: 'Contact Me', exact: true })).toBeVisible();
    const scan = await new AxeBuilder({ page })
      .include('header')
      .include('#home')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      scan.violations
        .filter((v) => ['serious', 'critical'].includes(v.impact))
        .map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.failureSummary) })),
    ).toEqual([]);
  });

for (const theme of ['dark', 'light'])
  test(`${theme} project controls have no serious accessibility violations`, async ({ page }) => {
    test.setTimeout(90000);
    await open(page, 'environment-case-study', theme);
    await page.locator('#migration-case-study').scrollIntoViewIfNeeded();
    const scan = await new AxeBuilder({ page })
      .include('#environment-case-study')
      .include('#jenkins-case-study')
      .include('#observability-case-study')
      .include('#migration-case-study')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      scan.violations
        .filter((v) => ['serious', 'critical'].includes(v.impact))
        .map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
        })),
    ).toEqual([]);
  });
