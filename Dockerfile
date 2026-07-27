# ============================================================
# Stage 1: Dependencies
# ============================================================
FROM node:24-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# ============================================================
# Stage 2: Builder
# ============================================================
FROM node:24-alpine AS builder

# Railway injects env vars via --build-arg during docker build.
# Defaults are dummy so build doesn't fail if Railway hasn't set them yet.
ARG DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
ARG BETTER_AUTH_SECRET=build-secret-dummy-32chars-minimum!!
ARG BETTER_AUTH_URL=http://localhost:3000
ARG GEMINI_API_KEY=dummy
ARG GEMINI_MODEL=gemini-3.5-flash
ARG GROQ_API_KEY=sk-dummy
ARG GROQ_MODEL=qwen/qwen3.6-27b
ARG OPENROUTER_API_KEY=sk-dummy
ARG OPENROUTER_MODEL=openrouter/auto-beta
ARG QR_SECRET=build-qr-secret-dummy-32chars!!
ARG NEXT_PUBLIC_PUSHER_APP_KEY=dummy
ARG PUSHER_APP_ID=dummy
ARG PUSHER_SECRET=dummy
ARG NEXT_PUBLIC_PUSHER_CLUSTER=ap1
ARG CLOUDINARY_CLOUD_NAME=dummy
ARG CLOUDINARY_API_KEY=dummy
ARG CLOUDINARY_API_SECRET=dummy
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ARG REDEMPTION_EXPIRY_MINUTES=10
ARG CRON_SECRET=dummy-cron-secret-build

ENV DATABASE_URL=$DATABASE_URL
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV GEMINI_API_KEY=$GEMINI_API_KEY
ENV GEMINI_MODEL=$GEMINI_MODEL
ENV GROQ_API_KEY=$GROQ_API_KEY
ENV GROQ_MODEL=$GROQ_MODEL
ENV OPENROUTER_API_KEY=$OPENROUTER_API_KEY
ENV OPENROUTER_MODEL=$OPENROUTER_MODEL
ENV QR_SECRET=$QR_SECRET
ENV NEXT_PUBLIC_PUSHER_APP_KEY=$NEXT_PUBLIC_PUSHER_APP_KEY
ENV PUSHER_APP_ID=$PUSHER_APP_ID
ENV PUSHER_SECRET=$PUSHER_SECRET
ENV NEXT_PUBLIC_PUSHER_CLUSTER=$NEXT_PUBLIC_PUSHER_CLUSTER
ENV CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
ENV CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
ENV CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV REDEMPTION_EXPIRY_MINUTES=$REDEMPTION_EXPIRY_MINUTES
ENV CRON_SECRET=$CRON_SECRET
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npx prisma generate

RUN npm run build

# ============================================================
# Stage 3: Runner
# ============================================================
FROM node:24-alpine AS runner

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy public assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema, migrations, & config
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts

# Install CLI pendukung
RUN npm install prisma tsx

COPY --chown=nextjs:nodejs entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]