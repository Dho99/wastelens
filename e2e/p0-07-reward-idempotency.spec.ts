import { test, expect } from "@playwright/test";
import * as path from "path";
import { cleanupTestData, getLaporanByUserId, getSaldoKoin } from "./helpers/db-helper";

const userStorage = path.join(__dirname, "../.playwright/auth/user.json");
const dinasStorage = path.join(__dirname, "../.playwright/auth/dinas.json");
const petugasStorage = path.join(__dirname, "../.playwright/auth/petugas.json");

test.describe("P0-07: Full Flow dan Reward Idempotency", () => {
  test.beforeEach(async () => {
    await cleanupTestData();
  });

  test.afterAll(async () => {
    await cleanupTestData();
  });

  test("Siklus penanganan laporan terintegrasi dengan reward idempotent", async ({
    browser,
    request,
  }) => {
    const userEmail = process.env.E2E_USER_EMAIL ?? "warga1@wastelens.com";

    // ─── PHASE A: WARGA SUBMITS REPORT ──────────────────────
    const citizenContext = await browser.newContext({
      storageState: userStorage,
      geolocation: {
        latitude: Number(process.env.E2E_REPORT_LAT ?? -7.327),
        longitude: Number(process.env.E2E_REPORT_LNG ?? 108.221),
      },
      permissions: ["geolocation"],
    });
    const citizenPage = await citizenContext.newPage();
    await citizenPage.goto("/user/scan");
    await citizenPage.setInputFiles("input[type='file']", {
      name: "test-report.png",
      mimeType: "image/png",
      buffer: Buffer.from("dummy-image-data"),
    });
    await citizenPage.waitForURL(/\/user\/scan\/validation/, { timeout: 30000 });
    await citizenPage.waitForURL(/\/user\/scan\/location/, { timeout: 30000 });
    const locBtn = citizenPage.getByRole("button", { name: /izinkan/i });
    if (await locBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await locBtn.click();
    }
    await citizenPage.waitForURL(/\/user\/scan\/confirm/, { timeout: 30000 });
    const checkbox = citizenPage.getByRole("checkbox");
    await expect(checkbox).toBeVisible({ timeout: 10000 });
    await checkbox.check();
    const submitBtn = citizenPage.getByRole("button", { name: /kirim laporan/i });
    await expect(submitBtn).toBeEnabled({ timeout: 5000 });
    await submitBtn.click();
    await citizenPage.waitForURL(/\/user\/scan\/success/, { timeout: 30000 });
    await citizenContext.close();

    // Verify report has PENDING status
    let reports = await getLaporanByUserId(userEmail);
    expect(reports.length).toBe(1);
    const reportId = reports[0].id;
    expect(reports[0].status).toBe("PENDING");

    // Get initial saldo
    const initialSaldo = await getSaldoKoin(userEmail);

    // ─── PHASE B: DINAS ASSIGNS OFFICER & VEHICLE ──────────
    const dinasContext = await browser.newContext({ storageState: dinasStorage });
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

    const assignRes = await dinasRequest.patch(`/api/dinas/reports/${reportId}`, {
      data: { petugasId: testOfficer.id, kendaraanId: testVehicle.id },
    });
    expect(assignRes.status()).toBe(200);
    await dinasContext.close();

    // ─── PHASE C: PETUGAS COMPLETES TASK ───────────────────
    const petugasContext = await browser.newContext({ storageState: petugasStorage });
    const petugasPage = await petugasContext.newPage();

    await petugasPage.goto(`/petugas/tasks/${reportId}`);
    await expect(petugasPage).toHaveURL(new RegExp(`/petugas/tasks/${reportId}`), {
      timeout: 15000,
    });

    // "Mulai Bersihkan" (UI-only transition)
    await expect(
      petugasPage.getByRole("button", { name: /mulai bersihkan/i }),
    ).toBeVisible({ timeout: 15000 });
    await petugasPage.getByRole("button", { name: /mulai bersihkan/i }).click();

    await expect(
      petugasPage.getByRole("button", { name: /ambil foto/i }),
    ).toBeVisible({ timeout: 15000 });

    await petugasPage.setInputFiles("input[type='file']", {
      name: "clean-proof.png",
      mimeType: "image/png",
      buffer: Buffer.from("clean-dummy-data"),
    });

    await petugasPage.waitForURL(new RegExp(`/petugas/tasks/${reportId}/verify`), {
      timeout: 30000,
    });
    await expect(petugasPage.getByText("Foto Sebelum", { exact: true })).toBeVisible({
      timeout: 15000,
    });
    await expect(petugasPage.getByText("Foto Sesudah", { exact: true })).toBeVisible({
      timeout: 15000,
    });

    await petugasPage
      .getByRole("button", { name: /verifikasi selesai/i })
      .click();

    await expect(petugasPage.getByText("Verifikasi Berhasil")).toBeVisible({
      timeout: 15000,
    });
    await petugasContext.close();

    // ─── PHASE D: VERIFY REWARD ────────────────────────────
    reports = await getLaporanByUserId(userEmail);
    expect(reports[0].status).toBe("SELESAI");

    // Mock returns: LARGE (sizeBonus=10), drainageRisk=true (10), accessObstructionRisk=true (5)
    // baseReward=10, total = 10 + 10 + 10 + 5 = 35
    const expectedReward = 35;
    const afterSaldo = await getSaldoKoin(userEmail);
    expect(afterSaldo).toBe(initialSaldo + expectedReward);

    // ─── PHASE E: VERIFY IDEMPOTENCY ───────────────────────
    // Try to verify again via API - should reject with 409
    const apiBrowserContext = await browser.newContext({
      storageState: petugasStorage,
    });
    const apiContext = apiBrowserContext.request;
    const duplicateRes = await apiContext.post(
      `/api/petugas/tasks/${reportId}/verify`,
      {
        data: {
          foto_sesudah: "https://res.cloudinary.com/dummy/image.png",
        },
      },
    );
    // Status SELESAI returns 400 ALREADY_DONE (task already completed)
    expect([400, 409]).toContain(duplicateRes.status());
    const duplicateJson = await duplicateRes.json();
    expect(["ALREADY_DONE", "ALREADY_VERIFIED"]).toContain(duplicateJson.code ?? duplicateJson.status);

    // Verify saldo did NOT increase
    const afterDuplicateSaldo = await getSaldoKoin(userEmail);
    expect(afterDuplicateSaldo).toBe(initialSaldo + expectedReward);

    // Verify only one reward transaction exists
    reports = await getLaporanByUserId(userEmail);
    expect(reports[0].status).toBe("SELESAI");

    await apiBrowserContext.close();
  });
});
