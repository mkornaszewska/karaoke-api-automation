import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: '.',
  globalSetup: './global-setup.ts',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'on-failure' }]],

  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'API Tests',
      testMatch: ['tests/api/**/*.spec.ts'],
    },
    {
      name: 'E2E Tests',
      testMatch: ['tests/e2e/**/*.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'json-server --watch db.json --port 3000',
    url: process.env.BASE_URL ?? 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
