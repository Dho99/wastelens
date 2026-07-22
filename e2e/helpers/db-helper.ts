import { execSync } from "child_process";

function ensureTestDatabase(): void {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
        "Run tests with: dotenv -e .env.e2e -- npx playwright test",
    );
  }
  const dbName = url.split("/").pop()?.split("?")[0] ?? "";
  if (!dbName.includes("_test") && !dbName.includes("test")) {
    throw new Error(
      `E2E tests require a test database. Current database: "${dbName}". ` +
        "DATABASE_URL must contain '_test'.",
    );
  }
}

const env = { ...process.env };

export async function cleanupTestData() {
  ensureTestDatabase();
  execSync("npx tsx e2e/scripts/db-op.ts cleanup", {
    env,
    stdio: "pipe",
    timeout: 30000,
  });
}

export async function getLaporanByUserId(email: string) {
  ensureTestDatabase();
  const output = execSync(`npx tsx e2e/scripts/db-op.ts get-reports ${email}`, {
    env,
    stdio: "pipe",
    timeout: 15000,
  });
  return JSON.parse(output.toString().trim());
}

export async function getSaldoKoin(email: string): Promise<number> {
  ensureTestDatabase();
  const output = execSync(`npx tsx e2e/scripts/db-op.ts get-saldo ${email}`, {
    env,
    stdio: "pipe",
    timeout: 15000,
  });
  const data = JSON.parse(output.toString().trim());
  return data.saldo;
}

export async function closePrisma() {
  // No-op since we run in separate processes
}
