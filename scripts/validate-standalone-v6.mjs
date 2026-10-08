import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium, expect as playwrightExpect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Run from any directory: node scripts/validate-standalone-v6.mjs [path/to/index.html]
// This deliberately uses file:// and an offline browser, without a development server.
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const candidatePath = resolve(projectRoot, process.argv[2] || 'standalone-v6/index.html');
const originalPath = resolve(projectRoot, 'standalone-v6/original.html');
const outputDirectory = resolve(projectRoot, 'standalone-v6/validation');
const candidateURL = pathToFileURL(candidatePath).href;
const originalURL = pathToFileURL(originalPath).href;
const headline = 'Engineering Reliable Cloud Infrastructure at Scale.';
const caseIds = [
  'terraform-case-study',
  'environment-case-study',
  'jenkins-case-study',
  'observability-case-study',
  'migration-case-study',
];
const executablePath = [
  process.env.PLAYWRIGHT_EXECUTABLE_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((candidate) => candidate && existsSync(candidate));
const report = {
  candidate: candidatePath,
  original: originalPath,
  startedAt: new Date().toISOString(),
  browser: executablePath || 'Playwright Chromium',
  offline: true,
  checks: [],
  assets: [],
  runtimeErrors: [],
  consoleErrors: [],
  externalRequests: [],
  localDependencies: [],
  accessibility: [],
  screenshots: [],
};
const expect = playwrightExpect.configure({ timeout: 7000 });

async function check(name, action) {
  const started = Date.now();
  try {
    const details = await action();
    report.checks.push({ name, passed: true, milliseconds: Date.now() - started, details });
    console.log(`PASS ${name}`);
    return true;
  } catch (error) {
    report.checks.push({
      name,
      passed: false,
      milliseconds: Date.now() - started,
      error: String(error.message || error).slice(0, 5000),
    });
    console.error(`FAIL ${name}: ${String(error.message || error).split('\n')[0]}`);
    return false;
  }
}

function embeddedAssets(source) {
  const attributes = [
    ...source.matchAll(
      /\b(?:src|href|poster)\s*=\s*(["'])(data:(?:image\/|application\/pdf)[\s\S]*?)\1/gi,
    ),
  ];
  const css = [
    ...source.matchAll(/url\(\s*(["']?)(data:(?:image\/|application\/pdf)[\s\S]*?)\1\s*\)/gi),
  ];
  return [...new Set([...attributes, ...css].map((match) => match[2]))];
}

async function newOfflinePage(browser, source, options = {}) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    offline: true,
    reducedMotion: 'reduce',
    ...options,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(7000);
  page.on('pageerror', (error) => {
    report.runtimeErrors.push({ source, message: error.message.slice(0, 1500) });
  });
  page.on('console', (message) => {
    if (message.type() === 'error')
      report.consoleErrors.push({ source, message: message.text().slice(0, 1000) });
  });
  page.on('request', (request) => {
    const url = request.url();
    if (/^(?:https?|wss?|ftp):/i.test(url)) {
      report.externalRequests.push({ source, method: request.method(), url });
    } else if (
      url.startsWith('file:') &&
      url.split('#')[0] !== (source === 'original' ? originalURL : candidateURL)
    ) {
      report.localDependencies.push({ source, url });
    }
  });
  // Record attempted requests even though browser offline mode also prevents them.
  await context.route(/^https?:\/\//, (route) => route.abort('internetdisconnected'));
  return { context, page };
}

async function load(page, url = candidateURL) {
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
}

async function setTheme(page, theme) {
  if ((await page.locator('html').getAttribute('data-theme')) !== theme)
    await page.locator('#themeToggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
}

async function show(page, selector) {
  const element = page.locator(selector);
  await element.scrollIntoViewIfNeeded();
  await expect(element).toBeVisible();
  return element;
}

async function screenshot(page, filename, selector) {
  if (selector) {
    await show(page, selector);
    await page.locator(selector).evaluate((element) => {
      window.scrollTo({
        top: window.scrollY + element.getBoundingClientRect().top - 100,
        behavior: 'instant',
      });
    });
  } else {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  }
  await page.screenshot({
    path: resolve(outputDirectory, filename),
    fullPage: false,
    animations: 'disabled',
  });
  report.screenshots.push(filename);
}

function violationKey(id, target) {
  return `${id}|${target.join('|')}`;
}

function accessibilityDetails(scan, baseline = new Set()) {
  return scan.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    helpUrl: violation.helpUrl,
    nodes: violation.nodes.map((node) => ({
      target: node.target,
      preExisting: baseline.has(violationKey(violation.id, node.target)),
      summary: node.failureSummary,
      contrast: [...node.any, ...node.all, ...node.none]
        .filter((result) => result.id.includes('contrast'))
        .map((result) => ({ check: result.id, message: result.message, facts: result.data })),
    })),
  }));
}

async function scanAccessibility(page, theme, scope, selectors, baseline = new Set()) {
  let builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
  for (const selector of selectors) builder = builder.include(selector);
  const scan = await builder.analyze();
  const violations = accessibilityDetails(scan, baseline);
  report.accessibility.push({
    theme,
    scope,
    violations,
    incomplete: scan.incomplete.map(({ id, impact }) => ({ id, impact })),
  });
  const serious = violations.filter(({ impact }) => ['serious', 'critical'].includes(impact));
  for (const violation of serious) {
    for (const node of violation.nodes) {
      console.error(
        `AXE ${theme} ${scope} ${violation.id} ${node.preExisting ? '(pre-existing)' : ''} ${node.target.join(', ')}${node.contrast.length ? ` ${JSON.stringify(node.contrast)}` : ''}`,
      );
    }
  }
  return { serious, violations };
}

let browser;
await mkdir(outputDirectory, { recursive: true });
try {
  await check('Original embedded portrait, images and PDF bytes are preserved', async () => {
    const [original, candidate] = await Promise.all([
      readFile(originalPath, 'utf8'),
      readFile(candidatePath, 'utf8'),
    ]);
    const assets = embeddedAssets(original);
    assert(
      assets.some((uri) => uri.startsWith('data:image/')),
      'Original image data URI is missing.',
    );
    assert(
      assets.some((uri) => uri.startsWith('data:application/pdf')),
      'Original PDF data URI is missing.',
    );
    report.assets = assets.map((uri) => ({
      mimeType: uri.slice(5, uri.indexOf(';') >= 0 ? uri.indexOf(';') : uri.indexOf(',')),
      characters: uri.length,
      sha256: createHash('sha256').update(uri).digest('hex'),
      preserved: candidate.includes(uri),
    }));
    const missing = report.assets.filter(({ preserved }) => !preserved);
    assert.equal(
      missing.length,
      0,
      `Changed or missing embedded asset hashes: ${missing.map(({ sha256 }) => sha256).join(', ')}`,
    );
    return { uniqueEmbeddedAssets: assets.length, candidateBytes: Buffer.byteLength(candidate) };
  });

  browser = await chromium.launch(executablePath ? { executablePath } : {});
  const { context, page } = await newOfflinePage(browser, 'candidate');
  await load(page);
  const ready = await check('Standalone hero and all five widgets mount offline', async () => {
    await expect(page.locator('#engineering-experiences')).toBeVisible();
    for (const id of caseIds) await expect(page.locator(`#${id}`)).toHaveCount(1);
    const text = (await page.locator('h1#hero-heading').innerText()).replace(/\s+/g, ' ').trim();
    assert(text.includes(headline), `Unexpected hero headline: ${text}`);
    return { headline: text, caseStudies: caseIds.length };
  });

  await check('GitHub profile links have been removed', async () => {
    const profiles = await page.locator('a[href]').evaluateAll((links) =>
      links.flatMap((link) => {
        try {
          const url = new URL(link.href);
          return /^(?:www\.)?github\.com$/i.test(url.hostname) &&
            url.pathname.split('/').filter(Boolean).length <= 1
            ? [url.href]
            : [];
        } catch {
          return [];
        }
      }),
    );
    assert.equal(profiles.length, 0, `GitHub profile links remain: ${profiles.join(', ')}`);
  });

  await check('Legacy theme toggle persists both choices across reloads', async () => {
    for (const theme of ['light', 'dark']) {
      // Make an explicit choice even when the first visit already follows this system theme.
      await setTheme(page, theme === 'light' ? 'dark' : 'light');
      await setTheme(page, theme);
      assert.equal(await page.evaluate(() => localStorage.getItem('cp-portfolio-theme')), theme);
      await page.reload({ waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    }
  });

  await check(
    'Preserved project tabs, six-step inspection and reduced-motion tour work',
    async () => {
      await show(page, '#work');
      const tabs = page.locator('.project-tab');
      await expect(tabs).toHaveCount(5);
      const stories = [];
      for (let index = 0; index < 5; index++) {
        const tab = tabs.nth(index);
        await tab.click();
        const id = await tab.getAttribute('data-project');
        await expect(tab).toHaveAttribute('aria-selected', 'true');
        await expect(page.locator('#projectPanel')).toHaveAttribute('aria-labelledby', `tab-${id}`);
        await expect(page.locator('#workflowTheater')).toHaveAttribute('data-project', id);
        const story = await page.locator('#projectPanel').evaluate((panel) => ({
          title: panel.querySelector('#projectTitle').textContent.trim(),
          problem: panel.querySelector('#storyProblem').textContent.trim(),
          outcome: panel.querySelector('#storyOutcome').textContent.trim(),
        }));
        assert(Object.values(story).every(Boolean), `Project ${id} has empty panel/story data.`);
        stories.push({ id, ...story });
        const steps = page.locator('#architectureFlow > button.arch-step');
        await expect(steps).toHaveCount(6);
        await steps.nth(2).click();
        await expect(steps.nth(2)).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('#narratorTitle')).toHaveText(
          await steps.nth(2).locator('strong').innerText(),
        );
      }
      assert.equal(
        new Set(stories.map(({ title, problem, outcome }) => `${title}|${problem}|${outcome}`))
          .size,
        5,
        'Project tabs reuse the same story.',
      );
      await page.locator('#tourButton').click();
      await expect(page.locator('#narratorIndex')).toHaveText('01 / 06');
      await expect(page.locator('#workflowTheater')).not.toHaveClass(/playing/);
      await page.locator('#architectureFlow > button.arch-step').last().click();
      await page.locator('#tourReset').click();
      await expect(page.locator('#narratorIndex')).toHaveText('01 / 06');
      await tabs.first().click();
      assert.equal(
        report.runtimeErrors.filter(({ source }) => source === 'candidate').length,
        0,
        'Project explorer produced a browser error.',
      );
      return stories;
    },
  );

  await check('375px mobile navigation and resume remain keyboard reachable', async () => {
    await page.setViewportSize({ width: 375, height: 812 });
    try {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      const toggle = page.locator('#menuToggle');
      const navigation = page.locator('#mainNav');
      const links = navigation.getByRole('link');
      await toggle.focus();
      await page.keyboard.press('Enter');
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(links.first()).toBeFocused();
      await expect(
        navigation.getByRole('link', { name: 'DevOps Playground', exact: true }),
      ).toBeVisible();
      for (let index = 0; index < (await links.count()); index++) {
        if (index) await page.keyboard.press('Tab');
        await expect(links.nth(index)).toBeVisible();
        await expect(links.nth(index)).toBeFocused();
        const href = await links.nth(index).getAttribute('href');
        assert(
          href?.startsWith('#') && (await page.locator(href).count()) === 1,
          'Mobile navigation target is unavailable.',
        );
      }
      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(navigation).toBeHidden();
      await expect(toggle).toBeFocused();
      // The compact header hides its duplicate resume link; the hero retains Download CV.
      const resume = page.locator('.hero a[download]');
      await expect(resume).toBeVisible();
      await resume.focus();
      await expect(resume).toBeFocused();
      assert(
        (await resume.getAttribute('href')).startsWith('data:application/pdf'),
        'Mobile resume is not the embedded PDF.',
      );
      return { navigationLinks: await links.count(), resume: 'Visible hero Download CV link' };
    } finally {
      await page.setViewportSize({ width: 1440, height: 900 });
    }
  });

  if (ready) {
    await check(
      'Reduced-motion Terraform build reveals and explains all seven stages',
      async () => {
        const article = await show(page, '#terraform-case-study');
        const stages = article.getByRole('group', {
          name: 'Terraform infrastructure stages',
          exact: true,
        });
        await expect(stages.getByRole('button')).toHaveCount(7);
        await article
          .getByRole('button', { name: 'Play Infrastructure Build', exact: true })
          .click();
        await expect(stages.getByRole('button', { disabled: false })).toHaveCount(7);
        await expect(
          article.getByRole('status', { name: 'Infrastructure build status' }),
        ).toContainText('All 7 stages');
        for (let index = 0; index < 7; index++) {
          const button = stages.getByRole('button').nth(index);
          await button.focus();
          await page.keyboard.press('Enter');
          await expect(button).toHaveAttribute('aria-pressed', 'true');
        }
        const code = article
          .locator('details')
          .filter({ hasText: 'View sanitized Terraform example' });
        if (await code.count()) await code.locator('summary').click();
      },
    );

    await check('Jenkins manual pipeline, unhealthy rollout and recovery complete', async () => {
      const article = await show(page, '#jenkins-case-study');
      await expect(
        article.getByRole('group', { name: 'Jenkins pipeline stages' }).getByRole('button'),
      ).toHaveCount(9);
      await article
        .getByRole('combobox', { name: 'Jenkins deployment target' })
        .selectOption('ECS');
      await article.getByRole('button', { name: 'Run Pipeline', exact: true }).click();
      for (let index = 0; index < 9; index++) {
        const next = article.getByRole('button', { name: 'Next Stage', exact: true });
        if (await next.count()) await next.click();
      }
      const status = article.getByRole('status', { name: 'Pipeline simulation status' });
      await expect(status).toContainText('Complete');
      await article.getByRole('button', { name: 'Simulate Failure', exact: true }).click();
      await expect(status).toContainText('Unhealthy');
      await article.getByRole('button', { name: 'Recover Deployment', exact: true }).click();
      await article.getByRole('button', { name: 'Next Recovery Step', exact: true }).click();
      await article.getByRole('button', { name: 'Next Recovery Step', exact: true }).click();
      await article.getByRole('button', { name: 'Validate Recovery', exact: true }).click();
      await expect(status).toContainText('Recovered');
    });

    await check('CloudWatch incident investigation, recovery and reset work', async () => {
      const article = await show(page, '#observability-case-study');
      await expect(article.locator('.obs-chart text').first()).toHaveCSS('stroke', 'none');
      await expect(article.locator('.obs-chart > path:not([stroke])').first()).toHaveCSS('stroke', 'none');
      await expect(article.locator('.obs-chart > path[stroke]').first()).toHaveCSS('stroke-width', '2px');
      await article.getByRole('button', { name: 'Play Incident', exact: true }).click();
      for (let index = 0; index < 2; index++)
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
    });

    await check('Environment selection, resource inspection, zoom and fit work', async () => {
      const article = await show(page, '#environment-case-study');
      const choices = article
        .getByRole('group', { name: 'Environment selector' })
        .getByRole('button');
      for (let index = 0; index < (await choices.count()); index++) {
        await choices.nth(index).click();
        await expect(choices.nth(index)).toHaveAttribute('aria-pressed', 'true');
      }
      await expect(article.locator('.env-context')).toContainText('Production');
      await article.getByRole('button', { name: /Amazon ECR.*image source/ }).click();
      await expect(
        article.getByRole('region', { name: 'AWS resource information' }).getByRole('heading'),
      ).toHaveText('Amazon ECR');
      await article.getByRole('button', { name: 'Zoom in architecture' }).click();
      await expect(article.locator('.env-map')).toHaveAttribute('style', /scale\(1\.15\)/);
      await article.getByRole('button', { name: 'Fit to View', exact: true }).click();
      await expect(article.locator('.env-map')).toHaveAttribute('style', /scale\(1\)/);
    });

    await check('All twelve migration steps expose their engineering details', async () => {
      const article = await show(page, '#migration-case-study');
      const steps = article
        .getByRole('list', { name: 'Migration journey steps' })
        .getByRole('button');
      await expect(steps).toHaveCount(12);
      for (let index = 0; index < 12; index++) {
        await steps.nth(index).click();
        await expect(steps.nth(index)).toHaveAttribute('aria-pressed', 'true');
        await expect(article.getByRole('region', { name: 'Migration step details' })).toContainText(
          `STEP ${String(index + 1).padStart(2, '0')} / 12`,
        );
      }
      await expect(article.getByRole('region', { name: 'Migration step details' })).toContainText(
        'rollback',
      );
    });

    await check('Skill search filters results and recovers from an empty result', async () => {
      await show(page, '#skills');
      const search = page.locator('#skill-search');
      const visible = page.locator('#skillsGrid > .skill-card:visible');
      const originalCount = await visible.count();
      assert.equal(originalCount, 7, 'Expected all seven skill groups before filtering.');
      await search.fill('terraform');
      assert((await visible.count()) > 0, 'Terraform search has no visible result.');
      assert(
        (await visible.count()) < originalCount,
        'Terraform search does not narrow the skill groups.',
      );
      await search.fill('no-such-skill-validation');
      await expect(page.locator('#skill-empty')).toBeVisible();
      await expect(visible).toHaveCount(0);
      await search.fill('');
      await expect(visible).toHaveCount(originalCount);
      await expect(page.locator('#skill-empty')).toBeHidden();
    });

    await check(
      'Playground tabs support keyboard selection and local walkthrough links',
      async () => {
        const playground = await show(page, '#devops-playground');
        const tabs = playground
          .getByRole('tablist', { name: 'DevOps playground experiences' })
          .getByRole('tab');
        await expect(tabs).toHaveCount(6);
        for (let index = 0; index < 6; index++) {
          await tabs.nth(index).click();
          await expect(tabs.nth(index)).toHaveAttribute('aria-selected', 'true');
          const href = await playground.locator('#playground-active-panel a').getAttribute('href');
          assert(
            href?.startsWith('#') && (await page.locator(href).count()) === 1,
            `Invalid playground target: ${href}`,
          );
        }
        await tabs.first().focus();
        await page.keyboard.press('End');
        await expect(tabs.last()).toBeFocused();
        const link = playground.locator('#playground-active-panel a');
        await expect(link).toHaveAttribute('href', '#migration-case-study');
        await link.click();
        assert.equal(new URL(page.url()).hash, '#migration-case-study');
      },
    );
  }

  const baselineByTheme = new Map();
  for (const theme of ['dark', 'light']) {
    await check(`${theme} original hero accessibility baseline is recorded`, async () => {
      const baseline = await newOfflinePage(browser, 'original');
      try {
        await load(baseline.page, originalURL);
        await setTheme(baseline.page, theme);
        const result = await scanAccessibility(baseline.page, theme, 'original hero', [
          'header',
          '.hero',
        ]);
        baselineByTheme.set(
          theme,
          new Set(
            result.violations.flatMap(({ id, nodes }) =>
              nodes.map(({ target }) => violationKey(id, target)),
            ),
          ),
        );
        return { seriousOrCritical: result.serious.length };
      } finally {
        await baseline.context.close();
      }
    });
    await setTheme(page, theme);
    for (const width of [320, 375, 768, 1440]) {
      await check(
        `${theme} layout fits ${width}px without horizontal document overflow`,
        async () => {
          await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
          const geometry = [];
          for (const selector of [
            '.hero',
            '#platform',
            ...(ready ? caseIds.map((id) => `#${id}`) : []),
          ]) {
            await show(page, selector);
            const size = await page.evaluate(() => ({
              viewport: window.innerWidth,
              pageWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
            }));
            geometry.push({ selector, ...size });
            assert(
              size.pageWidth <= width + 1,
              `${selector} document width ${size.pageWidth}px exceeds ${width}px viewport.`,
            );
          }
          return geometry;
        },
      );
      if (width === 375 || width === 1440)
        await check(`${theme} ${width}px hero screenshot is saved`, () =>
          screenshot(page, `hero-${theme}-${width}.png`),
        );
    }
    await check(`${theme} hero has no serious or critical accessibility violations`, async () => {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      const { serious } = await scanAccessibility(
        page,
        theme,
        'hero',
        ['header', '.hero'],
        baselineByTheme.get(theme),
      );
      assert.equal(
        serious.length,
        0,
        `${serious.length} serious/critical hero rules failed; see report.json for targets and contrast facts.`,
      );
    });
    if (ready) {
      await check(
        `${theme} widgets have no serious or critical accessibility violations`,
        async () => {
          for (const id of caseIds) await show(page, `#${id}`);
          await show(page, '#devops-playground');
          const { serious } = await scanAccessibility(page, theme, 'engineering widgets', [
            '#engineering-experiences',
          ]);
          assert.equal(
            serious.length,
            0,
            `${serious.length} serious/critical widget rules failed; see report.json for targets and contrast facts.`,
          );
        },
      );
      await check(`${theme} selected widget screenshots are saved`, async () => {
        for (const [selector, name] of [
          ['#terraform-case-study .tf-build-workspace', 'terraform'],
          ['#jenkins-case-study .ci-workspace', 'jenkins'],
          ['#observability-case-study .obs-dashboard', 'cloudwatch'],
        ])
          await screenshot(page, `${name}-${theme}-1440.png`, selector);
      });
    }
  }
  await context.close();

  await check(
    'Normal-motion legacy architecture responds to the cursor and respects pause',
    async () => {
      const motion = await newOfflinePage(browser, 'candidate', { reducedMotion: 'no-preference' });
      try {
        await load(motion.page);
        await show(motion.page, '#architectureLab');
        const platform = motion.page.locator('#platform');
        await expect(platform).toHaveAttribute('data-motion-enabled', 'true');
        const lab = motion.page.locator('#architectureLab');
        let bounds = await lab.boundingBox();
        assert(bounds, 'Architecture illustration has no visible bounds.');
        const snapshot = () =>
          platform.evaluate((element) => ({
            pointerX: getComputedStyle(element).getPropertyValue('--architecture-pointer-x'),
            pointerY: getComputedStyle(element).getPropertyValue('--architecture-pointer-y'),
          }));
        let visibleTop = Math.max(bounds.y, 110);
        let visibleBottom = Math.min(bounds.y + bounds.height, 850);
        const move = (x, y) =>
          motion.page.mouse.move(
            bounds.x + bounds.width * x,
            visibleTop + (visibleBottom - visibleTop) * y,
          );
        await move(0.2, 0.2);
        await motion.page.waitForTimeout(300);
        const first = await snapshot();
        await move(0.8, 0.7);
        await motion.page.waitForTimeout(300);
        const second = await snapshot();
        assert.notDeepEqual(
          second,
          first,
          'Architecture style does not respond to cursor position.',
        );
        await motion.page.getByRole('button', { name: 'Pause animations', exact: true }).click();
        await expect(motion.page.locator('html')).toHaveAttribute('data-motion-paused', 'true');
        await expect(platform).toHaveAttribute('data-motion-enabled', 'false');
        // The global control can scroll away from the illustration when clicked.
        await show(motion.page, '#architectureLab');
        bounds = await lab.boundingBox();
        assert(bounds, 'Paused architecture illustration has no visible bounds.');
        visibleTop = Math.max(bounds.y, 110);
        visibleBottom = Math.min(bounds.y + bounds.height, 850);
        await motion.page.waitForTimeout(350);
        const paused = await snapshot();
        await move(0.3, 0.3);
        await motion.page.waitForTimeout(300);
        assert.deepEqual(
          await snapshot(),
          paused,
          'Architecture cursor motion continues while animations are paused.',
        );
        return { first, second, paused };
      } finally {
        await motion.context.close();
      }
    },
  );

  await check('Candidate produces no uncaught browser errors', async () => {
    const errors = report.runtimeErrors.filter(({ source }) => source === 'candidate');
    assert.equal(errors.length, 0, JSON.stringify(errors));
  });
  await check('Candidate needs no external network or local asset files', async () => {
    const dependencies = [...report.externalRequests, ...report.localDependencies].filter(
      ({ source }) => source === 'candidate',
    );
    assert.equal(dependencies.length, 0, JSON.stringify(dependencies));
  });
} catch (error) {
  report.checks.push({
    name: 'Validation setup',
    passed: false,
    error: String(error.stack || error).slice(0, 5000),
  });
  console.error(`FAIL Validation setup: ${error.message || error}`);
} finally {
  if (browser) await browser.close();
  report.completedAt = new Date().toISOString();
  report.passed = report.checks.every(({ passed }) => passed);
  await writeFile(resolve(outputDirectory, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  const failures = report.checks.filter(({ passed }) => !passed).length;
  console.log(
    `${report.checks.length - failures}/${report.checks.length} checks passed. Report: ${resolve(outputDirectory, 'report.json')}`,
  );
  process.exitCode = failures ? 1 : 0;
}
