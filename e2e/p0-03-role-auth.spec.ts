import { test, expect } from "@playwright/test";
import * as path from "path";

const userStorage = path.join(__dirname, "../.playwright/auth/user.json");

test.describe("P0-03: Role Authorization UI & API", () => {
  test.use({ storageState: userStorage });

  test("Warga dilarang mengakses halaman dinas dan admin (redirect ke halaman warga)", async ({
    page,
  }) => {
    await page.goto("/dinas");
    await expect(page).toHaveURL(/\/user/, { timeout: 15000 });

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/user/, { timeout: 15000 });
  });

  test("Warga dilarang mengakses API operasional Dinas", async ({
    request,
  }) => {
    const res = await request.get("/api/dinas/dashboard");
    expect([401, 403]).toContain(res.status());
  });

  test("Warga dilarang mengakses API Dinas reports", async ({ request }) => {
    const res = await request.get("/api/dinas/reports");
    expect([401, 403]).toContain(res.status());
  });

  test("Warga dilarang mengakses API Petugas tasks", async ({ request }) => {
    const res = await request.get("/api/petugas/tasks");
    expect([401, 403]).toContain(res.status());
  });
});
