import { expect, test } from "@playwright/test";
import { mockRequests, resetMock } from "./helpers";

test.describe("add-on checkout", () => {
  test("Pay now is disabled until a ritual is chosen", async ({ page }) => {
    await page.goto("/add-ons");
    const pay = page.getByRole("button", { name: "Pay now" }).locator("visible=true");
    await expect(pay).toBeDisabled();
    await page.getByRole("button", { name: "Add one Red Light Therapy" }).click();
    await expect(pay).toBeEnabled();
  });

  test("the API rejects zero items", async ({ request }) => {
    expect((await request.post("/api/checkout", { data: { items: [] } })).status()).toBe(400);
    const zero = await request.post("/api/checkout", { data: { items: [{ id: "addon-red-light", quantity: 0 }] } });
    expect(zero.status()).toBe(400);
  });

  test("rejects unknown items and quantities over 10", async ({ request }) => {
    const unknown = await request.post("/api/checkout", { data: { items: [{ id: "addon-nope", quantity: 1 }] } });
    expect(unknown.status()).toBe(409);
    const tooMany = await request.post("/api/checkout", { data: { items: [{ id: "addon-red-light", quantity: 11 }] } });
    expect(tooMany.status()).toBe(400);
  });

  test("a tampered price in the request is ignored; the server price is charged", async ({ request }) => {
    await resetMock(request);
    const res = await request.post("/api/checkout", {
      data: {
        items: [{ id: "addon-red-light", quantity: 2, price: 0.01, unit_amount: 1 }],
        price: 1,
        total: 1,
      },
    });
    expect(res.status()).toBe(200);
    const stripeCall = (await mockRequests(request)).find((c) => c.path === "/v1/checkout/sessions");
    const form = new URLSearchParams(stripeCall!.body);
    expect(form.get("line_items[0][price_data][unit_amount]")).toBe("2900");
    expect(form.get("line_items[0][quantity]")).toBe("2");
    expect(form.get("line_items[0][price_data][currency]")).toBe("usd");
    expect(form.get("mode")).toBe("payment");
    expect(form.get("custom_fields[0][label][custom]")).toBe("Appointment date");
    expect(form.get("custom_fields[0][optional]")).toBe("false");
  });

  test("checkout creates a session and the success page lists what was paid", async ({ page, request }) => {
    await resetMock(request);
    await page.goto("/add-ons");
    await page.getByRole("button", { name: "Add one Red Light Therapy" }).click();
    await page.getByRole("button", { name: "Add one Aromatherapy" }).click();
    await page.getByRole("button", { name: "Pay now" }).locator("visible=true").click();
    await expect(page).toHaveURL(/\/add-ons\/success\?session_id=cs_test_/);
    await expect(page.getByRole("heading", { name: "You're all set." })).toBeVisible();
    await expect(page.getByText("Red Light Therapy × 1")).toBeVisible();
    await expect(page.getByText("$49")).toBeVisible();
  });

  test("the cancel page restores the selection", async ({ page }) => {
    await page.goto("/add-ons");
    const plus = page.getByRole("button", { name: "Add one Red Light Therapy" });
    await plus.click();
    await plus.click();
    await expect(page.getByLabel("Red Light Therapy: 2")).toBeVisible();
    await page.goto("/add-ons/cancel");
    await expect(page.getByRole("heading", { name: "No charge was made." })).toBeVisible();
    await expect(page.getByLabel("Red Light Therapy: 2")).toBeVisible();
  });

  test("the success page doesn't confirm a made-up session", async ({ page }) => {
    await page.goto("/add-ons/success?session_id=not-a-session");
    await expect(page.getByRole("heading", { name: "We couldn't confirm this payment." })).toBeVisible();
  });
});

test.describe("other endpoints", () => {
  test("Hydreight hook stub requires the secret and returns 501", async ({ request }) => {
    expect((await request.post("/api/hooks/hydreight-booking", { data: {} })).status()).toBe(401);
    const ok = await request.post("/api/hooks/hydreight-booking", {
      data: {},
      headers: { "x-hook-secret": "test-hook-secret" },
    });
    expect(ok.status()).toBe(501);
  });

  test("Stripe webhook rejects unsigned requests", async ({ request }) => {
    expect((await request.post("/api/stripe/webhook", { data: {} })).status()).toBeGreaterThanOrEqual(400);
  });
});
