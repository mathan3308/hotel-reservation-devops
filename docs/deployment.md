# Deployment & Runbook Guide

## 1. Local Development Setup

### Prerequisites
- Java 21 LTS
- Node.js 20+ / 22 LTS
- Maven 3.9+
- MySQL 8.0 or Docker

### Step A: Backend Setup
```bash
cd backend
# Run unit & integration test suite
mvn clean test

# Start backend locally (defaults to H2 in-memory or local MySQL)
mvn spring-boot:run
```
Backend will start at: `http://localhost:8080` (OpenAPI Swagger UI: `http://localhost:8080/swagger-ui.html`)

### Step B: Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend will be accessible at: `http://localhost:5173`

---

## 2. Docker Compose Staging Environment

To spin up the full 3-tier container stack locally:
```bash
# Start all containers in background
docker compose up -d --build

# Check container health status
docker compose ps

# View unified logging stream
docker compose logs -f
```
- Frontend UI: `http://localhost:5173` or `http://localhost:80`
- Backend API: `http://localhost:8080`
- Actuator Health: `http://localhost:8080/actuator/health`

---

## 3. Kubernetes Production Deployment

```bash
# Create namespace and apply all manifests
kubectl apply -f k8s/

# Verify all pods are running
kubectl get pods -n hotel-system
```
