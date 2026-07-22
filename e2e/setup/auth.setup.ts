import { test as setup, expect } from "@playwright/test";
import * as path from "path";

const authDir = path.join(__dirname, "../../.playwright/auth");

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Environment variable ${name} is required for auth setup. ` +
        "Ensure .env.e2e is loaded (use dotenv -e .env.e2e).",
    );
  }
  return value;
}

const USER_EMAIL = requireEnv("E2E_USER_EMAIL");
const USER_PASSWORD = requireEnv("E2E_USER_PASSWORD");
const DINAS_EMAIL = requireEnv("E2E_DINAS_EMAIL");
const DINAS_PASSWORD = requireEnv("E2E_DINAS_PASSWORD");
const PETUGAS_EMAIL = requireEnv("E2E_PETUGAS_EMAIL");
const PETUGAS_PASSWORD = requireEnv("E2E_PETUGAS_PASSWORD");
const ADMIN_EMAIL = requireEnv("E2E_ADMIN_EMAIL");
const ADMIN_PASSWORD = requireEnv("E2E_ADMIN_PASSWORD");

async function loginAndSave(
  page: import("@playwright/test").Page,
  email: string,
  password: string,
  expectedUrlPattern: RegExp,
  storagePath: string,
) {
  await page.goto("/login");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click("button[type='submit']");
  await page.waitForURL(expectedUrlPattern, { timeout: 15000 });
  await page.context().storageState({ path: storagePath });
}

setup("authenticate warga", async ({ page }) => {
  await loginAndSave(
    page,
    USER_EMAIL,
    USER_PASSWORD,
    /\/user/,
    path.join(authDir, "user.json"),
  );
});

setup("authenticate dinas", async ({ page }) => {
  await loginAndSave(
    page,
    DINAS_EMAIL,
    DINAS_PASSWORD,
    /\/dinas/,
    path.join(authDir, "dinas.json"),
  );
});

setup("authenticate petugas", async ({ page }) => {
  await loginAndSave(
    page,
    PETUGAS_EMAIL,
    PETUGAS_PASSWORD,
    /\/petugas/,
    path.join(authDir, "petugas.json"),
  );
});

setup("authenticate admin", async ({ page }) => {
  await loginAndSave(
    page,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    /\/admin/,
    path.join(authDir, "admin.json"),
  );
});
