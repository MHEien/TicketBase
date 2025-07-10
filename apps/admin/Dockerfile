FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./
COPY apps/admin/package.json ./apps/admin/
COPY packages/ ./packages/
COPY turbo.json ./

# Install dependencies
RUN corepack enable && corepack prepare bun@latest --activate
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .

# Build the admin application
RUN corepack enable && corepack prepare bun@latest --activate
RUN cd apps/admin && bun run build

# Production image, copy all the files and run the application
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.output ./

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server/index.mjs"] 