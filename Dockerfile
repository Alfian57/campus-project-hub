# Build stage
FROM node:20-alpine AS builder

# Build arguments for environment variables that need to be baked in
ARG NEXT_PUBLIC_API_URL

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies using npm (bun.lock is compatible)
RUN npm install

# Copy source code
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
# Pass build argument to environment so Next.js can use it during build
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
