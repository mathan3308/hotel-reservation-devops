# ==============================================================================
# Multi-stage Dockerfile for React 18 + Vite SPA with Nginx Alpine
# ==============================================================================

# Stage 1: Build Stage
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependency files
COPY package.json ./

# Install dependencies
RUN npm install --prefer-offline

# Copy source assets
COPY . .

# Build production bundle
RUN npm run build

# Stage 2: Production Nginx Runtime
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default static assets
RUN rm -rf ./*

# Copy built frontend assets from builder stage
COPY --from=builder /app/dist .

# Copy custom Nginx configuration with reverse proxy and SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
