import { expect, type Page, type APIRequestContext } from "@playwright/test";

export const MOCK = "http://localhost:3299";

export const PUBLIC_PAGES = [
  "/",
  "/services",
  "/add-ons",
  "/events",
  "/wellness-education",
  "/wellness-education/understanding-iv-therapy",
  "/about",
  "/faq",
  "/contact",
  "/book",
  "/join",
  "/privacy",
  "/terms",
  "/add-ons/cancel",
  "/this-page-does-not-exist",
];

export async function resetMock(request: APIRequestContext, extra: Record<string, unknown> = {}) {
  await request.post(`${MOCK}/__control`, { data: { reset: true } });
  if (Object.keys(extra).length) await request.post(`${MOCK}/__control`, { data: extra });
}

export async function mockRequests(request: APIRequestContext) {
  const res = await request.get(`${MOCK}/__requests`);
  return (await res.json()) as { method: string; path: string; body: string; headers: Record<string, string> }[];
}

/** The server rejects forms sent faster than a person could fill them in. */
export async function waitLikeAHuman(page: Page) {
  await page.waitForTimeout(2700);
}

export async function fillIntake(page: Page, { optIn }: { optIn: boolean }) {
  await page.getByLabel("First name").fill("Ana");
  await page.getByLabel("Last name").fill("Rivera");
  await page.getByLabel("Email", { exact: true }).fill("ana@example.com");
  if (optIn) await page.getByRole("checkbox").check();
  await waitLikeAHuman(page);
}

export async function expectNoPersonalDataInUrl(page: Page) {
  expect(page.url()).not.toMatch(/ana|rivera|example\.com|%40/i);
}
