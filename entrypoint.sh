#!/bin/sh
set -e

echo "Menjalankan migrasi database..."
# Gunakan npx tsx untuk mengeksekusi prisma CLI dengan ts config
npx tsx --config prisma.config.ts npx prisma migrate deploy || npx prisma migrate deploy --config prisma.config.ts

# ATAU jika cara standar prisma v7:
# npx prisma migrate deploy --config prisma.config.ts

echo "Menjalankan seed database..."
npx prisma db seed || echo "Seed sudah pernah dijalankan — dilewati."

echo "Memulai aplikasi..."
exec node server.js