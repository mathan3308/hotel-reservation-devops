# System Architecture & Technical Design

## 1. High-Level System Architecture

The **Cloud-Based Inventory and Warehouse Management System for Hotel Reservations** is engineered as a 3-tier, container-native distributed micro-service application.

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
    
    subgraph DevOps & CI/CD
        GitRepo[GitHub Repository] -->|Push / PR| GHA[GitHub Actions CI/CD]
        GHA -->|Build & Test| Tests[17 Automated JUnit 5 Tests]
        GHA -->|Push Containers| DockerHub[Docker Hub Container Registry]
        DockerHub -->|Deploy| BackendPods
        DockerHub -->|Deploy| FrontendPods
    end
```

---

## 2. Core Business Domains & Interactions

The platform seamlessly bridges two major hospitality domains:

### A. Hotel Reservation Domain
1. **Guest Registration & Authentication**: Stateless JWT token authentication with role-based access control (`ROLE_CUSTOMER`, `ROLE_STAFF`, `ROLE_ADMIN`).
2. **Room Inventory & Tiering**: Rooms mapped to luxury room types with dynamic pricing models.
3. **Reservation Engine with Overlap Collision Prevention**: Strict mathematical booking algorithm preventing double-booking:
   $$\text{Collision Condition: } \text{RequestedCheckIn} < \text{ExistingCheckOut} \land \text{RequestedCheckOut} > \text{ExistingCheckIn}$$
   *(ignoring `CANCELLED` bookings)*.
4. **Simulated Payment Gateway**: Instant transaction settlement, generating unique references, receipts, and vouchers.

### B. Warehouse & Inventory Logistics Domain
1. **Multi-Warehouse Facilities**: Support for central warehouses, regional depots, and floor housekeeping pantries.
2. **Rack & Bin Locations**: Granular coordinate mapping (e.g. `WH-MAIN-A-01`).
3. **Real-time Stock Movements**:
   - `STOCK_IN`: Inbound purchase order delivery.
   - `STOCK_OUT`: Operational consumption.
   - `TRANSFER`: Inter-warehouse stock redistribution.
   - `ADJUSTMENT`: Physical stock audit correction.
4. **Housekeeping Dispatch Integration**: Automated room turnover workflow issuing standard amenity packs (Egyptian cotton towels, bedding, luxury toiletries) which automatically executes linked `STOCK_OUT` transactions and transitions room status to `AVAILABLE`.

---

## 3. Technology Stack Breakdown

| Layer | Technologies | Key Capabilities |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 5, Vanilla CSS, React Router v6, Axios | SPA routing, custom luxury glassmorphism design, zero Tailwind dependencies, instant search & filter |
| **Backend** | Spring Boot 3.3.4, Java 21 LTS, Spring Security 6, Spring Data JPA | Authoritative pricing calculation, robust exception handlers, RESTful API endpoints |
| **Database** | MySQL 8.0, Hibernate 6, HikariCP, H2 (Test suite) | Relational constraints, foreign keys, transaction isolation, durable persistence |
| **Observability** | Spring Boot Actuator, Micrometer | Liveness & readiness probes (`/actuator/health`), metrics |
| **Containers** | Docker, Docker Compose, Multi-stage builds | Minimal Alpine images, non-root security execution |
| **Orchestration**| Kubernetes, Minikube, Nginx Ingress, HPA | Rolling updates, auto-scaling, self-healing, declarative configs |
| **CI/CD** | GitHub Actions | Automated build, test, Docker image packaging, and K8s manifest validation |
