import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './ai-tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  timeout: 30_000,
});
