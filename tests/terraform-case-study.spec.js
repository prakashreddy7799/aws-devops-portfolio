import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const test = base.extend({
  page: async ({ page }, use) => {
    const runtimeErrors = [];
    const cloudRequests = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('request', (request) => {
      if (/https?:\/\/[^/]*(?:amazonaws\.com|aws\.amazon\.com)(?:[/:]|$)/i.test(request.url())) {
        cloudRequests.push(request.url());
      }
    });
    await use(page);
    expect(runtimeErrors, 'The case study has no uncaught browser errors').toEqual([]);
    expect(cloudRequests, 'The educational simulation does not request AWS services').toEqual([]);
  },
});

async function openCaseStudy(page, { reducedMotion = 'reduce' } = {}) {
  await page.emulateMedia({ reducedMotion });
  await page.goto('/');
  const feature = page.locator('#terraform-case-study');
  await feature.scrollIntoViewIfNeeded();
  await expect(feature).toBeVisible();
  return {
    feature,
    stages: feature.getByRole('group', { name: 'Terraform infrastructure stages', exact: true }),
    explanation: feature.getByRole('region', {
      name: 'Terraform component explanation',
      exact: true,
    }),
    buildStatus: feature.getByRole('status', { name: 'Infrastructure build status', exact: true }),
  };
}

async function revealAllStages(feature, stages) {
  await feature.getByRole('button', { name: 'Play Infrastructure Build', exact: true }).click();
  await expect(stages.getByRole('button', { disabled: false })).toHaveCount(7);
}

async function expandCode(feature) {
  const disclosure = feature.locator('details').filter({
    hasText: 'View sanitized Terraform example',
  });
  if (!(await disclosure.evaluate((element) => element.open))) {
    await disclosure.locator('summary').click();
  }
  const code = disclosure.locator('pre');
  await expect(code).toBeVisible();
  return code;
}

async function freezeSimulationClock(page) {
  await page.clock.install({ time: new Date('2026-10-08T08:00:00Z') });
  const controls = await openCaseStudy(page, { reducedMotion: 'no-preference' });
  await page.clock.pauseAt(new Date('2026-10-08T10:00:00Z'));
  return controls;
}

test('case study distinguishes the simulation from the recorded engineering outcome', async ({
  page,
}) => {
  const { feature, stages, buildStatus } = await openCaseStudy(page);
  await expect(page.locator('#projects #terraform-case-study')).toHaveCount(1);
  await expect(feature).toHaveAttribute('aria-label', 'Terraform infrastructure case study');
  await expect(feature).toContainText('Simulation — no connection to production AWS.');
  await expect(feature).toContainText('45%');
  await expect(feature).toContainText(/provisioning effort/i);
  await expect(stages.getByRole('button')).toHaveCount(7);
  expect(
    await stages
      .getByRole('button')
      .evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-label'))),
  ).toEqual([
    'Inspect Terraform',
    'Inspect Amazon VPC',
    'Inspect Public Subnets',
    'Inspect Private Subnets',
    'Inspect Application Load Balancer',
    'Inspect EKS / ECS / EC2',
    'Inspect OpenLiberty & Keycloak',
  ]);
  await expect(stages.getByRole('button', { disabled: false })).toHaveCount(1);
  await expect(buildStatus).toBeVisible();
});

test('each revealed architecture component provides keyboard-accessible engineering explanations', async ({
  page,
}) => {
  const { feature, stages, explanation } = await openCaseStudy(page);
  await revealAllStages(feature, stages);
  const buttons = stages.getByRole('button');
  for (let index = 0; index < (await buttons.count()); index += 1) {
    const button = buttons.nth(index);
    const title = (await button.getAttribute('aria-label')).replace(/^Inspect /, '');
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(stages.getByRole('button', { pressed: true })).toHaveCount(1);
    await expect(explanation.getByRole('heading', { level: 4 })).toHaveText(title);
    for (const label of ['What it does', 'Why this choice', 'Security considerations']) {
      await expect(explanation.getByRole('heading', { name: label, exact: true })).toBeVisible();
    }
    expect((await explanation.innerText()).length).toBeGreaterThan(title.length + 100);
  }
});

test('build reveals stages progressively, pauses without advancing, and resets pending work', async ({
  page,
}) => {
  const { feature, stages } = await freezeSimulationClock(page);
  const enabled = stages.getByRole('button', { disabled: false });
  await expect(enabled).toHaveCount(1);
  await feature.getByRole('button', { name: 'Play Infrastructure Build', exact: true }).click();
  await expect(feature.getByRole('button', { name: 'Pause Build', exact: true })).toBeVisible();
  await page.clock.runFor(999);
  await expect(enabled).toHaveCount(1);
  await page.clock.runFor(1);
  await expect(enabled).toHaveCount(2);
  await feature.getByRole('button', { name: 'Pause Build', exact: true }).click();
  await page.clock.runFor(5000);
  await expect(enabled).toHaveCount(2);
  await feature.getByRole('button', { name: 'Resume Build', exact: true }).click();
  await page.clock.runFor(1000);
  await expect(enabled).toHaveCount(3);
  await feature.getByRole('button', { name: 'Reset Build', exact: true }).click();
  await expect(enabled).toHaveCount(1);
  await page.clock.runFor(10_000);
  await expect(enabled).toHaveCount(1);
  await expect(
    feature.getByRole('button', { name: 'Play Infrastructure Build', exact: true }),
  ).toBeVisible();
});

test('reduced motion reveals the complete architecture without a timed build', async ({ page }) => {
  const { feature, stages } = await openCaseStudy(page);
  await revealAllStages(feature, stages);
  await expect(feature.getByRole('button', { name: 'Pause Build', exact: true })).toHaveCount(0);
  await feature.getByRole('button', { name: 'Reset Build', exact: true }).click();
  await expect(stages.getByRole('button', { disabled: false })).toHaveCount(1);
});

test('global animation pause suspends the build and offers a manual next step', async ({
  page,
}) => {
  const { feature, stages } = await freezeSimulationClock(page);
  const enabled = stages.getByRole('button', { disabled: false });
  await feature.getByRole('button', { name: 'Play Infrastructure Build', exact: true }).click();
  await page.clock.runFor(1000);
  await expect(enabled).toHaveCount(2);
  await page.getByRole('button', { name: 'Pause animations', exact: true }).click();
  await page.clock.runFor(5000);
  await expect(enabled).toHaveCount(2);
  await feature.getByRole('button', { name: 'Reveal Next Step', exact: true }).click();
  await expect(enabled).toHaveCount(3);
  await page.clock.runFor(5000);
  await expect(enabled).toHaveCount(3);
});

test('copy action writes the exact displayed Terraform example', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value) => {
          window.__copiedTerraform = value;
        },
      },
    });
  });
  const { feature } = await openCaseStudy(page);
  const code = await expandCode(feature);
  const displayedCode = await code.textContent();
  expect(displayedCode.trim().length).toBeGreaterThan(100);
  await feature.getByRole('button', { name: 'Copy Terraform Code', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.__copiedTerraform)).toBe(displayedCode);
  await expect(feature.getByText('Terraform code copied.', { exact: true })).toBeVisible();
});

test('denied clipboard access offers selectable Terraform text instead of a false success', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new DOMException('Clipboard denied', 'NotAllowedError');
        },
      },
    });
    document.execCommand = () => false;
  });
  const { feature } = await openCaseStudy(page);
  const code = await expandCode(feature);
  const displayedCode = await code.textContent();
  await feature.getByRole('button', { name: 'Copy Terraform Code', exact: true }).click();
  const manualCopy = feature.getByRole('textbox', {
    name: 'Terraform code for manual copy',
    exact: true,
  });
  await expect(manualCopy).toBeVisible();
  await expect(manualCopy).toHaveValue(displayedCode);
  await expect(manualCopy).toHaveAttribute('readonly', '');
  await expect(feature.getByText('Terraform code copied.', { exact: true })).toHaveCount(0);
  await feature.getByRole('button', { name: 'Select Terraform Code', exact: true }).click();
  await expect(manualCopy).toBeFocused();
  const selection = await manualCopy.evaluate((element) => ({
    start: element.selectionStart,
    end: element.selectionEnd,
    length: element.value.length,
  }));
  expect(selection).toEqual({ start: 0, end: selection.length, length: selection.length });
});

for (const width of [320, 375, 768, 1440]) {
  test(`active Terraform case study and expanded code fit ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const { feature, stages, explanation } = await openCaseStudy(page);
    await revealAllStages(feature, stages);
    await stages.getByRole('button').nth(5).click();
    await expect(explanation).toBeVisible();
    const code = await expandCode(feature);
    await code.scrollIntoViewIfNeeded();
    const geometry = await feature.evaluate((element) => {
      const viewport = window.innerWidth;
      return {
        viewport,
        pageWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
        article: {
          left: element.getBoundingClientRect().left,
          right: element.getBoundingClientRect().right,
        },
        escapingControls: [...element.querySelectorAll('button, summary, pre, textarea')]
          .filter((control) => {
            const rect = control.getBoundingClientRect();
            return rect.width > 0 && (rect.left < -1 || rect.right > viewport + 1);
          })
          .map((control) => control.getAttribute('aria-label') || control.tagName),
      };
    });
    expect(geometry.pageWidth, JSON.stringify(geometry)).toBeLessThanOrEqual(width + 1);
    expect(geometry.article.left).toBeGreaterThanOrEqual(-1);
    expect(geometry.article.right).toBeLessThanOrEqual(width + 1);
    expect(geometry.escapingControls).toEqual([]);
    if (width === 375 || width === 1440) {
      for (const [selector, name] of [
        ['.tf-project-heading', 'outcome'],
        ['.tf-build-workspace', 'architecture'],
        ['.tf-engineering-details', 'responsibilities-and-code'],
      ]) {
        await feature.locator(selector).screenshot({
          path: testInfo.outputPath(`terraform-${name}-${width}.png`),
        });
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: testInfo.outputPath(`header-${width}.png`) });
    }
  });
}

test('expanded interactive case study has no serious or critical accessibility violations', async ({
  page,
}) => {
  test.setTimeout(60_000);
  const { feature, stages } = await openCaseStudy(page);
  await revealAllStages(feature, stages);
  await stages.getByRole('button').nth(5).click();
  await expandCode(feature);
  const results = await new AxeBuilder({ page })
    .include('#terraform-case-study')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    results.violations
      .filter(({ impact }) => ['serious', 'critical'].includes(impact))
      .map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) })),
  ).toEqual([]);
});
