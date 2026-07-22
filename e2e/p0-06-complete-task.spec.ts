import { test, expect } from "@playwright/test";
import * as path from "path";
import { cleanupTestData, getLaporanByUserId } from "./helpers/db-helper";

const petugasStorage = path.join(
  __dirname,
  "../.playwright/auth/petugas.json",
);
const dinasStorage = path.join(__dirname, "../.playwright/auth/dinas.json");
const userStorage = path.join(__dirname, "../.playwright/auth/user.json");

test.describe("P0-06: Petugas Menyelesaikan Laporan", () => {
  test.use({ storageState: petugasStorage });

  test.beforeEach(async () => {
    await cleanupTestData();
  });

  test.afterAll(async () => {
    await cleanupTestData();
  });

  test("Petugas dapat menyelesaikan laporan yang sudah di-assign", async ({
    browser,
  }) => {
    // PHASE 1: Create report as user
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

    // PHASE 2: Assign as dinas
    const reports = await getLaporanByUserId(
      process.env.E2E_USER_EMAIL ?? "warga1@wastelens.com",
    );
    expect(reports.length).toBe(1);
    const reportId = reports[0].id;

    const dinasContext = await browser.newContext({
      storageState: dinasStorage,
    });
    const dinasRequest = dinasContext.request;
    const dashRes = await dinasRequest.get("/api/dinas/dashboard");
    const dashJson = await dashRes.json();
    const testVehicle = dashJson.data.vehicles.find(
      (v: { jenis: string }) => v.jenis === "Dump Truck",
    );
    const testOfficer = dashJson.data.officers.find(
      (o: { nama: string }) => o.nama === "Ahmad Rizki",
    );
    await dinasRequest.patch(`/api/dinas/reports/${reportId}`, {
      data: {
        petugasId: testOfficer.id,
        kendaraanId: testVehicle.id,
      },
    });
    await dinasContext.close();

    // PHASE 3: Petugas opens task and completes it
    const petugasContext = await browser.newContext({
      storageState: petugasStorage,
    });
    const petugasPage = await petugasContext.newPage();

    // Open task detail page
    await petugasPage.goto(`/petugas/tasks/${reportId}`);
    await expect(petugasPage).toHaveURL(
      new RegExp(`/petugas/tasks/${reportId}`),
      { timeout: 15000 },
    );

    // Click "Mulai Bersihkan" (UI-only transition)
    const mulaiButton = petugasPage.getByRole("button", {
      name: /mulai bersihkan/i,
    });
    await expect(mulaiButton).toBeVisible({ timeout: 15000 });
    await mulaiButton.click();

    // After clicking, button changes to "Ambil Foto"
    const fotoButton = petugasPage.getByRole("button", { name: /ambil foto/i });
    await expect(fotoButton).toBeVisible({ timeout: 15000 });

    // Upload after-clean photo
    await petugasPage.setInputFiles("input[type='file']", {
      name: "clean-proof.png",
      mimeType: "image/png",
      buffer: Buffer.from("clean-dummy-data"),
    });

    // Should navigate to verify page
    await petugasPage.waitForURL(
      new RegExp(`/petugas/tasks/${reportId}/verify`),
      { timeout: 30000 },
    );

    // Check verify page shows before and after photo labels
    await expect(
      petugasPage.getByText("Foto Sebelum", { exact: true }),
    ).toBeVisible({ timeout: 15000 });
    await expect(
      petugasPage.getByText("Foto Sesudah", { exact: true }),
    ).toBeVisible({ timeout: 15000 });

    // Click "Verifikasi Selesai"
    const verifyButton = petugasPage.getByRole("button", {
      name: /verifikasi selesai/i,
    });
    await expect(verifyButton).toBeVisible({ timeout: 15000 });
    await verifyButton.click();

    // Confirm success
    await expect(
      petugasPage.getByText("Verifikasi Berhasil"),
    ).toBeVisible({ timeout: 15000 });

    await petugasContext.close();
  });
});
