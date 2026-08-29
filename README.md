# Cloud-Based Inventory and Warehouse Management with CI/CD Container-Oriented Deployment of a Hotel Reservation System

[![Java 21 LTS](https://img.shields.io/badge/Java-21%20LTS-orange.svg?logo=openjdk)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot 3.3.4](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![React 18](https://img.shields.io/badge/React-18.3.1-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg?logo=vite)](https://vitejs.dev/)
[![Docker Multi-Stage](https://img.shields.io/badge/Docker-Multi--Stage-2496ED.svg?logo=docker)](https://www.docker.com/)
[![Kubernetes Ready](https://img.shields.io/badge/Kubernetes-1.30+-326CE5.svg?logo=kubernetes)](https://kubernetes.io/)
[![CI/CD Pipeline](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD%20Ready-2088FF.svg?logo=githubactions)](https://github.com/features/actions)
[![JUnit 5 Tests](https://img.shields.io/badge/Automated%20Tests-17%2F17%20Passing-success.svg)](file:///c:/Projects/hotel-reservation-devops/docs/testing.md)

---

## 1. Project Overview

**Grand Luxe Resort & Logistics DevOps Platform** is a full-stack, enterprise-grade hospitality and supply chain management system built from scratch with cloud-native DevOps principles. The system unifies luxury guest room reservations with back-of-house automated warehouse inventory, housekeeping amenity turnover, Docker containerization, GitHub Actions CI/CD automation, and Kubernetes multi-replica container orchestration.

---

## 2. Key Features

### 🏨 Hotel Reservation Engine
- **Mathematical Overlap Prevention**: Rigorous date collision query ($\text{requestedCheckIn} < \text{existingCheckOut} \land \text{requestedCheckOut} > \text{existingCheckIn}$) preventing double-booking.
- **Dynamic Search & Filtering**: Filter by check-in/out dates, guest count, luxury room tier, and price range.
- **Simulated Payment Gateway**: Instant transaction settlement, voucher receipt generation, and printable confirmation slips.
- **Reservation Lifecycle Management**: Seamless transitions across `PENDING`, `CONFIRMED`, `COMPLETED`, and `CANCELLED` (with automatic simulated refund).

### 📦 Warehouse & Inventory Logistics
- **Multi-Warehouse Support**: Central Logistics Depot (`WH-MAIN`) and Floor Housekeeping Pantry (`WH-HK-01`).
- **Storage Coordinates**: Granular Rack, Shelf, and Bin location mapping.
- **Real-Time Stock Movement Console**: Execute `STOCK_IN`, `STOCK_OUT`, `TRANSFER`, and `ADJUSTMENT` with instant negative balance prevention.
- **Low-Stock Alert Engine**: Real-time notifications when inventory balances drop to or below minimum safety levels.

### 🧹 Automated Housekeeping & Room Preparation
- **Reservation-Linked Amenity Issuance**: Dispatches standard luxury preparation kits (Egyptian cotton towels, bedding, organic soaps, shampoos) linked to the guest reservation reference.
- **Automated Stock Deduction**: Automatically logs immutable `STOCK_OUT` audit transactions and resets room status to `AVAILABLE`.

### 🚀 Cloud DevOps, CI/CD & Kubernetes
- **Multi-Stage Docker Containerization**: Minimal production Alpine images running as unprivileged non-root users.
- **GitHub Actions CI/CD Pipeline**: Automated test execution, production artifact packaging, Docker Hub publishing with commit SHA & run number tags, and Kubernetes manifest validation.
- **Kubernetes Production Orchestration**: Complete declarative manifests with Rolling Updates, Horizontal Pod Autoscaling (HPA), persistent volume claims, Actuator health probes, and self-healing.

---

## 3. Architecture & Data Flow

```mermaid
graph TD
    Client[Web Browser / Mobile Client] -->|HTTPS :80 / :443| Ingress[Kubernetes Nginx Ingress / Reverse Proxy]
    
    subgraph Frontend Tier
        Ingress -->|/| FrontendPods[React 18 + Vite SPA Pods<br>Nginx Alpine Web Server]
    end
    
    subgraph Backend Tier
        Ingress -->|/api & /actuator| BackendPods[Spring Boot 3.3.4 Backend Pods<br>Java 21 LTS | JJWT | Spring Security]
        BackendPods -->|Autoscaling| HPA[Horizontal Pod Autoscaler<br>2 to 5 Replicas]
    end
    
    subgraph Database Tier
        BackendPods -->|JPA / Hibernate JDBC :3306| MySQL[MySQL 8.0 Database Engine<br>Persistent Block Storage PVC]
    end
```

---

## 4. Demo Credentials & Quick Access

The database is pre-seeded with three demo role accounts:

| Role | Username | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | Full unrestricted access, user administration, reports |
| **Staff / Housekeeping** | `staff` | `staff123` | Room management, inventory catalog, stock operations, housekeeping |
| **Customer / Guest** | `customer` | `customer123` | Browse rooms, check availability, book stays, manage bookings |

---

## 5. Getting Started & Deployment Runbook

### Option A: Local Development Run (Zero Docker Required)
```bash
# 1. Start Backend (Terminal 1)
cd backend
mvn clean test             # Run 17/17 automated tests
mvn spring-boot:run        # Starts API on http://localhost:8080

# 2. Start Frontend (Terminal 2)
cd frontend
npm install
npm run dev                # Starts UI on http://localhost:5173
```

### Option B: Docker Compose Local Staging
```bash
# Launch entire 3-tier architecture with healthcheck dependencies
docker compose up -d --build

# View container status
docker compose ps

# Access application
# Frontend UI: http://localhost:5173 or http://localhost:80
# Backend API: http://localhost:8080
# Actuator Health: http://localhost:8080/actuator/health
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### Option C: Kubernetes Production Cluster
```bash
# Apply all Kubernetes manifests in hotel-system namespace
kubectl apply -f k8s/

# Verify pod status and replicas
kubectl get all -n hotel-system
```

---

## 6. Project Documentation Index

Comprehensive engineering documents are available in the [`docs/`](file:///c:/Projects/hotel-reservation-devops/docs/) directory:

1. [**Architecture & Design**](file:///c:/Projects/hotel-reservation-devops/docs/architecture.md): Deep-dive into tier architecture, data flow, and components.
2. [**Database Schema & ER Model**](file:///c:/Projects/hotel-reservation-devops/docs/database.md): Entity relationship diagram, table definitions, and indexes.
3. [**REST API Specification**](file:///c:/Projects/hotel-reservation-devops/docs/api.md): Complete OpenAPI endpoint contracts with request/response payloads.
4. [**Docker Containerization Guide**](file:///c:/Projects/hotel-reservation-devops/docs/docker.md): Multi-stage builds and container runtime security.
5. [**CI/CD Pipeline Guide**](file:///c:/Projects/hotel-reservation-devops/docs/cicd.md): GitHub Actions automation, tagging strategies, and secrets.
6. [**Kubernetes Orchestration**](file:///c:/Projects/hotel-reservation-devops/docs/kubernetes.md): Cluster manifests, HPA, persistent volumes, and ingress.
7. [**Deployment & Runbook**](file:///c:/Projects/hotel-reservation-devops/docs/deployment.md): Step-by-step local, staging, and production setup.
8. [**Automated Testing Report**](file:///c:/Projects/hotel-reservation-devops/docs/testing.md): Unit and integration test coverage breakdown (17/17 passing).
9. [**Troubleshooting Guide**](file:///c:/Projects/hotel-reservation-devops/docs/troubleshooting.md): Solutions for port conflicts, JWT issues, and pod debugging.
10. [**Academic Project Report Outline**](file:///c:/Projects/hotel-reservation-devops/docs/project-report-outline.md): Standard university submission structure.

---

## 7. College Viva / Technical Evaluation Q&A Cheat Sheet

- **Q: How does the system prevent double-booking across concurrent users?**  
  *A: The system implements an authoritative JPA JPQL query testing the condition `requestedCheckIn < existingCheckOut AND requestedCheckOut > existingCheckIn` while ignoring cancelled reservations. This check is executed inside a transactional database boundary.*

- **Q: How does the housekeeping system interact with warehouse inventory?**  
  *A: When a room requires turnover, the housekeeping module dispatches a preparation kit which executes real-time `STOCK_OUT` transactions against tracked consumable items (towels, bedding, toiletries) tagged with the reservation reference, verifying non-negative stock levels before marking the room as `AVAILABLE`.*

- **Q: How does Kubernetes handle zero-downtime deployments and self-healing?**  
  *A: The Kubernetes Deployment manifest uses a `RollingUpdate` strategy (`maxSurge: 1, maxUnavailable: 0`) and validates pod readiness probes (`/actuator/health/readiness`) before routing incoming ingress traffic. If any pod crashes, the ReplicaSet controller detects the drift and immediately spins up a replacement.*
