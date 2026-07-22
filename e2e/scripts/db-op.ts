import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../lib/generated/prisma/client";
import { execSync } from "child_process";

function ensureTestDatabase(): void {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("FATAL: DATABASE_URL environment variable is not set.");
    process.exit(1);
  }
  const dbName = url.split("/").pop()?.split("?")[0] ?? "";
  if (!dbName.includes("_test") && !dbName.includes("test")) {
    console.error(
      `FATAL: E2E scripts require a test database. Got: "${dbName}". Aborting.`,
    );
    process.exit(1);
  }
}

ensureTestDatabase();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const action = process.argv[2];

  if (action === "seed") {
    console.log("[DB] Running Prisma migrations...");
    execSync("npx prisma migrate deploy", {
      env: process.env,
      stdio: "inherit",
      timeout: 60000,
    });
    console.log("[DB] Running seed...");
    execSync("npx prisma db seed", {
      env: process.env,
      stdio: "inherit",
      timeout: 120000,
    });
    console.log("[DB] Seed complete.");
    return;
  }

  if (action === "cleanup") {
    const testEmails = ["warga1@wastelens.com", "warga2@wastelens.com"];
    
    const users = await prisma.user.findMany({
      where: { email: { in: testEmails } },
      select: { id: true },
    });
    
    const userIds = users.map((u) => u.id);

    await prisma.notifikasi.deleteMany({
      where: { user_id: { in: userIds } },
    });

    await prisma.coinTransaction.deleteMany({
      where: { user_id: { in: userIds } },
    });

    await prisma.transaksiKoin.deleteMany({
      where: { user_id: { in: userIds } },
    });

    const reports = await prisma.laporan.findMany({
      where: { user_id: { in: userIds } },
      select: { id: true },
    });

    const reportIds = reports.map((r) => r.id);

    await prisma.verifikasiPickup.deleteMany({
      where: { laporan_id: { in: reportIds } },
    });

    await prisma.foto.deleteMany({
      where: { laporan_id: { in: reportIds } },
    });

    await prisma.laporan.deleteMany({
      where: { id: { in: reportIds } },
    });

    await prisma.user.updateMany({
      where: { email: { in: testEmails } },
      data: { saldo_koin: 0, status: "active" },
    });

    await prisma.kendaraan.updateMany({
      data: { current_load: 0 },
    });

    console.log(JSON.stringify({ success: true }));
  } 
  
  else if (action === "get-reports") {
    const email = process.argv[3];
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    
    if (!user) {
      console.log(JSON.stringify([]));
      return;
    }
    
    const reports = await prisma.laporan.findMany({
      where: { user_id: user.id },
      orderBy: { createdAt: "desc" },
    });
    
    console.log(JSON.stringify(reports));
  } 
  
  else if (action === "get-saldo") {
    const email = process.argv[3];
    const user = await prisma.user.findUnique({
      where: { email },
      select: { saldo_koin: true },
    });
    console.log(JSON.stringify({ saldo: user?.saldo_koin ?? 0 }));
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
