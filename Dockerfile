# ============================================================
# Stage 1: Dependencies
# ============================================================
FROM node:24-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma
COPY prisma.config.ts ./

RUN npm ci

RUN npx prisma generate

# ============================================================
# Stage 2: Builder
# ============================================================
FROM node:24-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

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

# Copy standalone output (includes server.js + .next + production node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy public assets (not included in standalone output)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma schema & migrations for runtime
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Install prisma CLI + tsx as runtime tools (for migrate + seed)
RUN npm install prisma tsx

# Copy entrypoint script
COPY --chown=nextjs:nodejs entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
