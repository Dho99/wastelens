import { test, expect } from "@playwright/test";

test.describe("P0-01: Login User Berhasil", () => {
  test.use({ storageState: undefined });

  const email = process.env.E2E_USER_EMAIL ?? "warga1@wastelens.com";
  const password = process.env.E2E_USER_PASSWORD ?? "password123";

  test("Warga dapat login dengan credentials valid dan session tetap setelah reload", async ({
    page,
  }) => {
    // Navigate to login page
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /WasteLens/i })).toBeVisible();

    // Fill credentials
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.click("button[type='submit']");

    // Should redirect to /user
    await expect(page).toHaveURL(/\/user/, { timeout: 15000 });

    // Reload to ensure session is persistent
    await page.reload();
    await expect(page).toHaveURL(/\/user/, { timeout: 15000 });
  });
});
