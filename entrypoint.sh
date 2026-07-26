#!/bin/sh
set -e

echo "Menjalankan migrasi database..."
npx prisma migrate deploy

echo "Menjalankan seed database..."
npx prisma db seed || echo "Seed sudah pernah dijalankan — dilewati."

echo "Memulai aplikasi..."
exec node server.js
