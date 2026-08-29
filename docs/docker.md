# Docker Containerization Strategy & Multi-Stage Builds

## 1. Container Strategy Overview

The platform uses **multi-stage Docker builds** to guarantee:
- **Minimal Image Footprint**: Build-time tools (Maven, Node, npm) are discarded; only the minimal JRE and Nginx static assets remain in production images.
- **Enhanced Security**: Production containers run as an unprivileged, non-root user (`hoteluser` on backend, unprivileged `nginx` on frontend).
- **Zero Drift**: Build artifacts are generated deterministically in isolated Linux build stages.

---

## 2. Backend Multi-Stage Dockerfile Analysis

```dockerfile
# Stage 1: Build JAR from Source
FROM maven:3.9.8-eclipse-temurin-21 AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Production JRE Alpine Image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S hotelgroup && adduser -S hoteluser -G hotelgroup
COPY --from=builder /build/target/hotel-reservation-backend-1.0.0.jar app.jar
RUN chown -R hoteluser:hotelgroup /app
USER hoteluser
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

---

## 3. Frontend Multi-Stage Dockerfile Analysis

```dockerfile
# Stage 1: Build React Vite SPA Bundle
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --prefer-offline
COPY . .
RUN npm run build

# Stage 2: Nginx Web Server
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

---

## 4. Docker Compose Orchestration

The `docker-compose.yml` file provisions:
1. `mysql:8.0` with volume persistence on `mysql_data` and ping healthcheck.
2. `hotel-backend` with dependency condition `service_healthy` on MySQL.
3. `hotel-frontend` with dependency condition `service_healthy` on backend.

### Quick Start Commands
```bash
# Build and start all services in background
docker compose up -d --build

# View real-time container logs
docker compose logs -f

# Inspect container health states
docker compose ps

# Graceful shutdown and volume retention
docker compose down
```
