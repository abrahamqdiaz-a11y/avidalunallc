import { expect, test, type Page } from "@playwright/test";
import Stripe from "stripe";
import { MOCK, mockRequests, resetMock, waitLikeAHuman } from "./helpers";

// Step 1 -> Book now (new tab) -> back to this tab -> step 3 add-ons -> checkout,
// plus the follow-up email that step 1 schedules and checkout cancels.

const HYDREIGHT = "https://booking.hydreight.com/widget-business/an92x";
let ipCounter = 0;

test.beforeEach(async ({ context, request }, info) => {
  await resetMock(request);
  // Each test is its own visitor, so the per-IP limits don't carry over between tests.
  await context.setExtraHTTPHeaders({ "x-forwarded-for": `10.9.${info.project.name.length}.${++ipCounter}` });
  // Never load the real Hydreight page in tests; the new tab just needs to open.
  await context.route("https://booking.hydreight.com/**", (r) => r.fulfill({ body: "<title>Booking</title>" }));
});

function uniqueEmail(tag: string) {
  return `${tag}.${Date.now()}.${Math.random().toString(36).slice(2, 7)}@example.com`;
}

async function completeStep1(page: Page, email: string) {
  await page.goto("/book");
  await page.getByLabel("First name").fill("Ana");
  await page.getByLabel("Last name").fill("Rivera");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await waitLikeAHuman(page);
  const intake = page.waitForResponse((r) => r.url().endsWith("/api/intake"));
  await page.getByRole("button", { name: "Get my booking link" }).click();
  const res = await intake;
  expect(res.status()).toBe(200);
  // The follow-up id is stored once the background request finishes.
  await expect
    .poll(() => page.evaluate(() => sessionStorage.getItem("avidaluna:followUpId")))
    .toMatch(/^[0-9a-f-]{36}$/);
}

/** What a real tab switch does: the page goes hidden, then visible again. */
async function leaveAndReturn(page: Page) {
  await page.evaluate(() => {
    const set = (v: string) => {
      Object.defineProperty(document, "visibilityState", { configurable: true, get: () => v });
      document.dispatchEvent(new Event("visibilitychange"));
    };
    set("hidden");
    set("visible");
  });
}

async function signedWebhook(page: Page, object: Record<string, unknown>) {
  const payload = JSON.stringify({
    id: "evt_test",
    object: "event",
    type: "checkout.session.completed",
    data: { object },
  });
  const header = new Stripe("sk_test_mock").webhooks.generateTestHeaderString({ payload, secret: "whsec_test_mock" });
  return page.request.post("/api/stripe/webhook", {
    data: payload,
    headers: { "stripe-signature": header, "content-type": "application/json" },
  });
}

test("step 1 schedules one follow-up email with first name only", async ({ page, request }) => {
  const email = uniqueEmail("followup");
  await completeStep1(page, email);

  const posts = (await mockRequests(request)).filter((c) => c.method === "POST" && c.path === "/resend/emails");
  expect(posts).toHaveLength(1);
  const sent = JSON.parse(posts[0].body);
  expect(sent.to).toEqual([email]);
  expect(sent.subject).toBe("Your Avida Luna visit, plus a little extra");
  expect(sent.from).toBe("Avida Luna Wellness <hello@avidaluna.com>");
  const minutes = (Date.parse(sent.scheduled_at) - Date.now()) / 60_000;
  expect(minutes).toBeGreaterThan(55);
  expect(minutes).toBeLessThan(61);
  for (const body of [sent.text, sent.html]) {
    expect(body).toContain("Hi Ana,");
    expect(body).toContain(HYDREIGHT);
    expect(body).toContain("/add-ons");
    expect(body).toMatch(/Reply (&quot;|")stop/);
    expect(body).not.toContain("Rivera");
  }
  expect(posts[0].headers["idempotency-key"]).toMatch(/^followup\/[0-9a-f]{64}$/);
  expect(posts[0].headers["idempotency-key"]).not.toContain("example");
});

test("the hint about the email shows under the step 1 email field", async ({ page }) => {
  await page.goto("/book");
  await expect(page.getByText("We'll email your booking link and visit details.")).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toHaveAccessibleDescription(
    "We'll email your booking link and visit details.",
  );
});

test("Book now, return to the tab, step 3, pay: checkout cancels the follow-up", async ({ page, request }) => {
  const email = uniqueEmail("flow");
  await completeStep1(page, email);
  const followUpId = await page.evaluate(() => sessionStorage.getItem("avidaluna:followUpId"));

  // Coming back without clicking Book now does nothing.
  await leaveAndReturn(page);
  await expect(page.getByTestId("hydreight-button")).toBeVisible();

  const popup = page.waitForEvent("popup");
  await page.getByTestId("hydreight-button").click();
  expect((await popup).url()).toBe(HYDREIGHT);
  expect(await page.evaluate(() => sessionStorage.getItem("avidaluna:bookClicked"))).toBe("1");

  await leaveAndReturn(page);
  const step3 = page.getByTestId("book-addons");
  await expect(step3.getByRole("heading", { name: "Booked? Make it a ritual." })).toBeVisible();
  await expect(step3.getByRole("button", { name: "No thanks, I'm all set" })).toBeVisible();
  await expect(step3.getByRole("link", { name: /Book here/ })).toHaveAttribute("href", HYDREIGHT);
  await expect(page.locator('.booking-progress [aria-current="step"]')).toContainText("Add-ons & visit");

  // Refresh keeps them on step 3.
  await page.reload();
  await expect(page.getByRole("heading", { name: "Booked? Make it a ritual." })).toBeVisible();

  await page.getByRole("button", { name: "Add one Red Light Therapy" }).click();
  await page.getByRole("button", { name: "Pay now by card" }).locator("visible=true").click();
  await page.waitForURL(/\/add-ons\/success\?session_id=cs_test_mock/);
  await expect(page.getByRole("heading", { name: "You're all set." })).toBeVisible();

  const checkout = (await mockRequests(request)).find((c) => c.path === "/v1/checkout/sessions" && c.method === "POST");
  const form = new URLSearchParams(checkout!.body);
  expect(form.get("metadata[followup]")).toBe(followUpId);
  expect(form.get("customer_email")).toBe(email);

  // Stripe tells us it's paid: the scheduled follow-up is cancelled.
  const res = await signedWebhook(page, {
    id: "cs_test_1",
    object: "checkout.session",
    payment_status: "paid",
    amount_total: 2900,
    customer_details: { email },
    metadata: { addons: "addon-red-lightx1", followup: followUpId },
  });
  expect(res.status()).toBe(200);
  const calls = await mockRequests(request);
  expect(calls.filter((c) => c.path === `/resend/emails/${followUpId}/cancel`)).toHaveLength(1);
});

test("webhook finds the follow-up by email when the id didn't come along", async ({ page, request }) => {
  const email = uniqueEmail("other-device");
  await completeStep1(page, email);
  const followUpId = await page.evaluate(() => sessionStorage.getItem("avidaluna:followUpId"));
  const res = await signedWebhook(page, {
    id: "cs_test_2",
    object: "checkout.session",
    payment_status: "paid",
    amount_total: 2900,
    customer_details: { email: email.toUpperCase() },
    metadata: { addons: "addon-red-lightx1" },
  });
  expect(res.status()).toBe(200);
  expect((await mockRequests(request)).some((c) => c.path === `/resend/emails/${followUpId}/cancel`)).toBe(true);
});

test("unpaid sessions and bad signatures cancel nothing", async ({ page, request }) => {
  const email = uniqueEmail("unpaid");
  await completeStep1(page, email);
  await signedWebhook(page, {
    id: "cs_test_3",
    object: "checkout.session",
    payment_status: "unpaid",
    customer_details: { email },
    metadata: {},
  });
  const forged = await page.request.post("/api/stripe/webhook", {
    data: "{}",
    headers: { "stripe-signature": "t=1,v1=bad" },
  });
  expect(forged.status()).toBe(400);
  expect((await mockRequests(request)).some((c) => c.path.endsWith("/cancel"))).toBe(false);
});

test("fallback button opens step 3 when the tab never switched; No thanks is respected", async ({ page }) => {
  await completeStep1(page, uniqueEmail("fallback"));
  await page.getByRole("button", { name: "I've booked, show me add-ons" }).click();
  await expect(page.getByRole("heading", { name: "Booked? Make it a ritual." })).toBeVisible();

  await page.getByRole("button", { name: "No thanks, I'm all set" }).click();
  await expect(page.getByTestId("book-skipped")).toContainText("You're all set, Ana.");
  await page.reload();
  await expect(page.getByTestId("book-skipped")).toBeVisible();
  await page.getByRole("button", { name: "Show me add-ons" }).click();
  await expect(page.getByTestId("book-addons")).toBeVisible();
});

test("the text link counts as Book now too", async ({ page }) => {
  await completeStep1(page, uniqueEmail("textlink"));
  const popup = page.waitForEvent("popup");
  await page.getByRole("link", { name: "booking.hydreight.com/widget-business/an92x" }).click();
  await popup;
  await leaveAndReturn(page);
  await expect(page.getByTestId("book-addons")).toBeVisible();
});

test("pay at my visit from step 3 also cancels the follow-up", async ({ page, request }) => {
  await completeStep1(page, uniqueEmail("atvisit"));
  const followUpId = await page.evaluate(() => sessionStorage.getItem("avidaluna:followUpId"));
  await page.getByRole("button", { name: "I've booked, show me add-ons" }).click();
  await page.getByRole("button", { name: "Add one Aromatherapy" }).click();
  await page.getByRole("button", { name: "Pay at my visit" }).locator("visible=true").click();
  const dialog = page.getByTestId("at-visit-dialog");
  await waitLikeAHuman(page);
  await dialog.getByRole("button", { name: "Confirm add-ons" }).click();
  await expect(dialog.getByRole("heading", { name: "You're all set." })).toBeVisible();
  expect((await mockRequests(request)).some((c) => c.path === `/resend/emails/${followUpId}/cancel`)).toBe(true);
});

test("the follow-up endpoint resists abuse", async ({ request }) => {
  const post = (data: Record<string, unknown>, ip: string) =>
    request.post("/api/intake", { data, headers: { "x-forwarded-for": ip } });
  const base = { firstName: "Ana", lastName: "Rivera", optIn: false, startedAt: Date.now() - 10_000 };
  const scheduled = async () =>
    (await mockRequests(request)).filter((c) => c.method === "POST" && c.path === "/resend/emails").length;

  // Honeypot filled, or sent faster than a person could type: answered "ok", nothing sent.
  await post({ ...base, email: uniqueEmail("bot"), website: "http://spam.example" }, "10.8.0.1");
  await post({ ...base, email: uniqueEmail("fast"), startedAt: Date.now() }, "10.8.0.2");
  expect(await scheduled()).toBe(0);

  // Invalid input is rejected.
  expect((await post({ ...base, email: "not-an-email" }, "10.8.0.3")).status()).toBe(400);

  // One address gets one follow-up, even from many IPs: the per-email limit stops us
  // calling Resend after 3 tries, and Resend's idempotency key refuses the repeats.
  const victim = uniqueEmail("victim");
  for (let i = 0; i < 6; i++) await post({ ...base, email: victim }, `10.8.1.${i}`);
  expect(await scheduled()).toBe(3);
  const list = (await (await request.get(`${MOCK}/resend/emails`)).json()) as { data: { to: string[] }[] };
  expect(list.data.filter((e) => e.to.includes(victim))).toHaveLength(1);

  // One IP gets cut off after a handful of tries.
  const statuses: number[] = [];
  for (let i = 0; i < 10; i++) statuses.push((await post({ ...base, email: uniqueEmail(`ip${i}`) }, "10.8.2.1")).status());
  expect(statuses).toContain(429);
});

test("steps 2 and 3 pass axe (WCAG 2.2 AA)", async ({ page }) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  const check = async () => {
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  };
  await completeStep1(page, uniqueEmail("axe"));
  await check();
  await page.getByRole("button", { name: "I've booked, show me add-ons" }).click();
  await expect(page.getByTestId("book-addons")).toBeVisible();
  await check();
});
