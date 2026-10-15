import { defineConfig } from '@playwright/test'

const widths = [320, 375, 390, 430]

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    viewport: { width: 390, height: 844 },
    trace: 'retain-on-failure',
  },
  projects: widths.map((width) => ({
    name: `${width}px`,
    use: { viewport: { width, height: 844 } },
  })),
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1',
    port: 4173,
    reuseExistingServer: false,
  },
})
