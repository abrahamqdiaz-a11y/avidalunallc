import { expect, test } from "@playwright/test";
import { expectNoPersonalDataInUrl, fillIntake, mockRequests, resetMock } from "./helpers";

const HYDREIGHT = "https://booking.hydreight.com/widget-business/an92x";

test.describe("/book intake", () => {
  test("submits and shows the Hydreight button", async ({ page, request }) => {
    await resetMock(request);
    await page.goto("/book");
    await fillIntake(page, { optIn: true });
    const intake = page.waitForResponse((r) => r.url().endsWith("/api/intake"));
    await page.getByRole("button", { name: "Get my booking link" }).click();

    const button = page.getByTestId("hydreight-button");
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("href", HYDREIGHT);
    await expect(button).toHaveAttribute("target", "_blank");
    await expect(button).toHaveAttribute("rel", /noopener/);
    await expect(page.getByRole("link", { name: "Open the secure booking page" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "You're in, Ana." })).toBeVisible();
    await expect(page.getByTestId("booked-button")).toBeVisible();

    expect((await intake).status()).toBe(200);
    const calls = await mockRequests(request);
    const put = calls.find((c) => c.method === "PUT" && c.path.includes("/members/"));
    expect(put, "opted-in contact is upserted").toBeTruthy();
    const sent = JSON.parse(put!.body);
    expect(Object.keys(sent.merge_fields).sort()).toEqual(["FNAME", "LNAME"]);
    expect(calls.find((c) => c.path.endsWith("/tags"))?.body).toContain("booking-intake");

    expect(await page.evaluate(() => sessionStorage.getItem("avidaluna:email"))).toBe("ana@example.com");
    await expectNoPersonalDataInUrl(page);
  });

  test("still shows the Hydreight button when Mailchimp fails", async ({ page, request }) => {
    await resetMock(request, { mailchimpFail: true });
    await page.goto("/book");
    await fillIntake(page, { optIn: true });
    const intake = page.waitForResponse((r) => r.url().endsWith("/api/intake"));
    await page.getByRole("button", { name: "Get my booking link" }).click();
    await expect(page.getByTestId("hydreight-button")).toBeVisible();
    expect((await intake).status()).toBe(200);
  });

  test("does not send contacts who did not opt in to Mailchimp", async ({ page, request }) => {
    await resetMock(request);
    await page.goto("/book");
    await fillIntake(page, { optIn: false });
    const intake = page.waitForResponse((r) => r.url().endsWith("/api/intake"));
    await page.getByRole("button", { name: "Get my booking link" }).click();
    await expect(page.getByTestId("hydreight-button")).toBeVisible();
    await intake;
    expect((await mockRequests(request)).filter((c) => c.path.includes("mailchimp"))).toHaveLength(0);
  });

  test("shows field errors and stays on the form when required fields are empty", async ({ page }) => {
    await page.goto("/book");
    await page.getByRole("button", { name: "Get my booking link" }).click();
    await expect(page.getByText("Please enter your name.").first()).toBeVisible();
    await expect(page.getByTestId("hydreight-button")).toHaveCount(0);
  });

  test("bots that fill the honeypot get no Mailchimp record", async ({ request }) => {
    await resetMock(request);
    const res = await request.post("/api/intake", {
      data: {
        firstName: "Bot",
        lastName: "Bot",
        email: "bot@example.com",
        optIn: true,
        website: "http://spam.example",
        startedAt: Date.now() - 10_000,
      },
    });
    expect(res.status()).toBe(200);
    expect((await mockRequests(request)).filter((c) => c.path.includes("mailchimp"))).toHaveLength(0);
  });
});

test.describe("/join event sign-up", () => {
  test("requires the opt-in and tags event-signup", async ({ page, request }) => {
    await resetMock(request);
    await page.goto("/join");
    await page.getByLabel("First name").fill("Ana");
    await page.getByLabel("Last name").fill("Rivera");
    await page.getByLabel("Email", { exact: true }).fill("ana@example.com");
    await page.getByRole("button", { name: "Join the list" }).click();
    await expect(page.getByText("Please tick the box to join the list.")).toBeVisible();

    await page.getByRole("checkbox").check();
    await page.waitForTimeout(2700);
    await page.getByRole("button", { name: "Join the list" }).click();
    await expect(page.getByTestId("join-success")).toBeVisible();
    expect((await mockRequests(request)).find((c) => c.path.endsWith("/tags"))?.body).toContain("event-signup");
  });
});
