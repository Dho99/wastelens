import { test, expect } from "@playwright/test";
import * as path from "path";
import { cleanupTestData, getLaporanByUserId } from "./helpers/db-helper";

const userStorage = path.join(__dirname, "../.playwright/auth/user.json");

test.describe("P0-04: User Membuat Laporan Valid", () => {
  test.use({ storageState: userStorage });

  test.beforeEach(async () => {
    await cleanupTestData();
  });

  test.afterAll(async () => {
    await cleanupTestData();
  });

  test("Warga dapat membuat laporan melalui flow scan", async ({ browser }) => {
    const context = await browser.newContext({
      storageState: userStorage,
      geolocation: {
        latitude: Number(process.env.E2E_REPORT_LAT ?? -7.327),
        longitude: Number(process.env.E2E_REPORT_LNG ?? 108.221),
      },
      permissions: ["geolocation"],
    });
    const page = await context.newPage();

    // Navigate to scan page
    await page.goto("/user/scan");
    await expect(page).toHaveURL(/\/user\/scan/, { timeout: 15000 });

    // Upload dummy image (triggers mock upload)
    await page.setInputFiles("input[type='file']", {
      name: "test-report.png",
      mimeType: "image/png",
      buffer: Buffer.from("dummy-image-data"),
    });

    // Wait for classification/validation page
    await page.waitForURL(/\/user\/scan\/validation/, { timeout: 30000 });

    // Wait for location page (classification completes automatically with mock)
    await page.waitForURL(/\/user\/scan\/location/, { timeout: 30000 });

    // Location page - trigger geolocation
    const locationButton = page.getByRole("button", {
      name: /izinkan/i,
    });
    if (await locationButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await locationButton.click();
    }

    // Wait for confirm page
    await page.waitForURL(/\/user\/scan\/confirm/, { timeout: 30000 });

    // Check the declaration checkbox
    const checkbox = page.getByRole("checkbox");
    await expect(checkbox).toBeVisible({ timeout: 10000 });
    await checkbox.check();

    // Submit the report
    const submitButton = page.getByRole("button", { name: /kirim laporan/i });
    await expect(submitButton).toBeEnabled({ timeout: 5000 });
    await submitButton.click();

    // Wait for success page
    await page.waitForURL(/\/user\/scan\/success/, { timeout: 30000 });

    // Get report ID from success page
    const reportIdElement = page.locator("p.text-gray-800.truncate").first();
    await expect(reportIdElement).toBeVisible({ timeout: 10000 });
    const reportIdText = await reportIdElement.innerText();
    const reportId = reportIdText.replace("#", "").trim();
    expect(reportId.length).toBeGreaterThan(10);

    // Verify report exists in database
    const reports = await getLaporanByUserId(
      process.env.E2E_USER_EMAIL ?? "warga1@wastelens.com",
    );
    expect(reports.length).toBe(1);
    expect(reports[0].id).toBe(reportId);
    // Status should be PENDING since mock geocode returns Kecamatan Bandung Wetan
    // which is within dinas1's coverage area
    expect(reports[0].status).toBe("PENDING");

    await context.close();
  });
});
