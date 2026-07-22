import { test, expect } from "@playwright/test";
import * as path from "path";
import { cleanupTestData, getLaporanByUserId } from "./helpers/db-helper";

const dinasStorage = path.join(__dirname, "../.playwright/auth/dinas.json");
const userStorage = path.join(__dirname, "../.playwright/auth/user.json");

test.describe("P0-05: Dinas Melakukan Assignment", () => {
  test.use({ storageState: dinasStorage });

  test.beforeEach(async () => {
    await cleanupTestData();
  });

  test.afterAll(async () => {
    await cleanupTestData();
  });

  test("Dinas dapat melihat dashboard dan melakukan assignment petugas & kendaraan", async ({
    browser,
  }) => {
    // First create a report as user
    const userContext = await browser.newContext({
      storageState: userStorage,
      geolocation: {
        latitude: Number(process.env.E2E_REPORT_LAT ?? -7.327),
        longitude: Number(process.env.E2E_REPORT_LNG ?? 108.221),
      },
      permissions: ["geolocation"],
    });
    const userPage = await userContext.newPage();
    await userPage.goto("/user/scan");
    await userPage.setInputFiles("input[type='file']", {
      name: "test-report.png",
      mimeType: "image/png",
      buffer: Buffer.from("dummy-image-data"),
    });
    await userPage.waitForURL(/\/user\/scan\/validation/, { timeout: 30000 });
    await userPage.waitForURL(/\/user\/scan\/location/, { timeout: 30000 });
    const locBtn = userPage.getByRole("button", { name: /izinkan/i });
    if (await locBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await locBtn.click();
    }
    await userPage.waitForURL(/\/user\/scan\/confirm/, { timeout: 30000 });
    const checkbox = userPage.getByRole("checkbox");
    await expect(checkbox).toBeVisible({ timeout: 10000 });
    await checkbox.check();
    const submitBtn = userPage.getByRole("button", { name: /kirim laporan/i });
    await expect(submitBtn).toBeEnabled({ timeout: 5000 });
    await submitBtn.click();
    await userPage.waitForURL(/\/user\/scan\/success/, { timeout: 30000 });
    await userContext.close();

    // Get the report ID from DB
    const reports = await getLaporanByUserId(
      process.env.E2E_USER_EMAIL ?? "warga1@wastelens.com",
    );
    expect(reports.length).toBe(1);
    const reportId = reports[0].id;

    // Now act as dinas to do assignment
    const dinasContext = await browser.newContext({
      storageState: dinasStorage,
    });
    const dinasPage = await dinasContext.newPage();

    // Open dinas dashboard
    await dinasPage.goto("/dinas");
    await expect(dinasPage).toHaveURL(/\/dinas/, { timeout: 15000 });

    // Try to assign via API
    const dinasRequest = dinasContext.request;
    const dashRes = await dinasRequest.get("/api/dinas/dashboard");
    expect(dashRes.status()).toBe(200);
    const dashJson = await dashRes.json();

    const testVehicle = dashJson.data.vehicles.find(
      (v: { jenis: string }) => v.jenis === "Dump Truck",
    );
    const testOfficer = dashJson.data.officers.find(
      (o: { nama: string }) => o.nama === "Ahmad Rizki",
    );
    expect(testVehicle).toBeDefined();
    expect(testOfficer).toBeDefined();

    // Submit assignment via PATCH
    const assignRes = await dinasRequest.patch(
      `/api/dinas/reports/${reportId}`,
      {
        data: {
          petugasId: testOfficer.id,
          kendaraanId: testVehicle.id,
        },
      },
    );
    expect(assignRes.status()).toBe(200);
    const assignJson = await assignRes.json();
    expect(assignJson.success).toBe(true);

    // Verify data persists after reload
    const verifyRes = await dinasRequest.get(
      `/api/dinas/reports/${reportId}`,
    );
    expect(verifyRes.status()).toBe(200);
    const verifyJson = await verifyRes.json();
    expect(verifyJson.data.petugas_id).toBe(testOfficer.id);
    expect(verifyJson.data.kendaraan_id).toBe(testVehicle.id);

    await dinasContext.close();
  });
});
