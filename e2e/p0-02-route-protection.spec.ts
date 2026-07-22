import { test, expect } from "@playwright/test";

test.describe("P0-02: Unauthenticated Route Protection", () => {
  test.use({ storageState: undefined });

  test("Sistem mengarahkan pengguna yang belum login ke halaman login", async ({
    page,
    context,
  }) => {
    await context.clearCookies();

    // Protected route: /user
    await page.goto("/user");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });

    // Protected route: /dinas
    await page.goto("/dinas");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });

    // Protected route: /petugas
    await page.goto("/petugas");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });

    // Protected route: /admin
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });
});
