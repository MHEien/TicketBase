FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./
COPY apps/plugins/package.json ./apps/plugins/
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

# Build the plugins application
RUN corepack enable && corepack prepare bun@latest --activate
RUN cd apps/plugins && bun run build

# Production image, copy all the files and run the application
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/apps/plugins/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/plugins/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

USER nestjs

EXPOSE 5000
ENV PORT=5000

CMD ["node", "dist/main"] 