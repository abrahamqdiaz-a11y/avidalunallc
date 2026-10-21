import { defineConfig, devices } from "@playwright/test";

// The tests build and start the site against a local mock of Stripe, Mailchimp and Resend.
// No real accounts or keys are needed. Set PW_CHROMIUM_PATH to use a pre-installed Chromium.
const PORT = 3200;
const MOCK = "http://localhost:3299";

export const testEnv = {
  NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
  STRIPE_SECRET_KEY: "sk_test_mock",
  STRIPE_API_BASE: MOCK,
  MAILCHIMP_API_KEY: "mock-us1",
  MAILCHIMP_SERVER_PREFIX: "us1",
  MAILCHIMP_AUDIENCE_ID: "mockaudience",
  MAILCHIMP_API_BASE: `${MOCK}/mailchimp/3.0`,
  RESEND_API_KEY: "re_mock",
  RESEND_API_BASE: `${MOCK}/resend`,
  HYDREIGHT_HOOK_SECRET: "test-hook-secret",
};

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH || undefined },
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"], browserName: "chromium" } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] }, testMatch: /(checkout|a11y)\.spec\.ts/ },
  ],
  webServer: [
    {
      command: "node tests/mock-server.mjs",
      url: `${MOCK}/__requests`,
      reuseExistingServer: false,
    },
    {
      command: `npm run build && npx next start -p ${PORT}`,
      url: `http://localhost:${PORT}`,
      env: testEnv,
      timeout: 300_000,
      reuseExistingServer: false,
    },
  ],
});
