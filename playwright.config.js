import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';

const installedBrowser = [
  process.env.PLAYWRIGHT_EXECUTABLE_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].find((candidate) => candidate && existsSync(candidate));

const preview = process.env.PORTFOLIO_TEST_PREVIEW === '1';
const port = preview ? 4173 : 5173;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: 'list',
  use: {
    baseURL,
    browserName: 'chromium',
    launchOptions: installedBrowser ? { executablePath: installedBrowser } : {},
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `npm run ${preview ? 'preview' : 'dev'} -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
