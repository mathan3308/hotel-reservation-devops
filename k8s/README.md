# Kubernetes Cluster Deployment & Operational Runbook

This directory contains the production-grade declarative Kubernetes manifests for orchestrating the **Hotel Reservation and Warehouse Management System**.

---

## 1. Manifest Architecture Directory

| Manifest File | Kind | Purpose |
| :--- | :--- | :--- |
| [`namespace.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/namespace.yaml) | `Namespace` | Creates isolated `hotel-system` namespace |
| [`configmap.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/configmap.yaml) | `ConfigMap` | Non-sensitive runtime variables (DB host, port, CORS, profiles) |
| [`secret.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/secret.yaml) | `Secret` | Sensitive credentials (MySQL user/pass, JWT encryption key) |
| [`mysql-pv-pvc.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/mysql-pv-pvc.yaml) | `PersistentVolumeClaim` | 5Gi persistent block storage for MySQL database durability |
| [`mysql-deployment.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/mysql-deployment.yaml) | `Deployment` & `Service` | MySQL 8.0 instance with internal `ClusterIP` DNS resolution |
| [`backend-deployment.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/backend-deployment.yaml) | `Deployment` & `Service` | Spring Boot 3 backend (2 replicas, rolling updates, Actuator health probes) |
| [`frontend-deployment.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/frontend-deployment.yaml) | `Deployment` & `Service` | React 18 + Nginx reverse proxy (2 replicas, static asset cache) |
| [`ingress.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/ingress.yaml) | `Ingress` | Unified HTTP gateway routing `/` to UI and `/api` to backend |
| [`hpa.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/hpa.yaml) | `HorizontalPodAutoscaler` | Auto-scales backend pods from 2 to 5 replicas on 70% CPU load |

---

## 2. Step-by-Step Deployment (Minikube / Cloud Kubernetes)

### Step A: Start Minikube & Enable Ingress
```bash
minikube start --driver=docker
minikube addons enable ingress
minikube addons enable metrics-server
```

### Step B: Apply Manifests in Ordered Sequence
```bash
# 1. Create Namespace
kubectl apply -f k8s/namespace.yaml

# 2. Apply ConfigMap and Secrets
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# 3. Provision Database Storage & Service
kubectl apply -f k8s/mysql-pv-pvc.yaml
kubectl apply -f k8s/mysql-deployment.yaml

# 4. Deploy Backend & Frontend Clusters
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# 5. Configure Routing & Autoscaling
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

Alternatively, apply all manifests in one atomic command:
```bash
kubectl apply -f k8s/
```

### Step C: Verify Cluster Deployment Status
```bash
# Check all resources inside the hotel-system namespace
kubectl get all -n hotel-system

# Verify Pod Readiness
kubectl get pods -n hotel-system -o wide
```

Expected Output:
```
NAME                              READY   STATUS    RESTARTS   AGE
pod/hotel-backend-78bc57d9f-abc1   1/1     Running   0          45s
pod/hotel-backend-78bc57d9f-xyz2   1/1     Running   0          45s
pod/hotel-frontend-5678cd-fgh1    1/1     Running   0          45s
pod/hotel-frontend-5678cd-fgh2    1/1     Running   0          45s
pod/mysql-67c8d9-qwe1             1/1     Running   0          60s
```

---

## 3. DevOps Demonstrations for College Viva & Evaluation

### A. Horizontal Scaling Demonstration
Demonstrate Kubernetes capability to dynamically scale backend application pods based on load:
```bash
# Scale backend cluster to 5 replicas
kubectl scale deployment hotel-backend --replicas=5 -n hotel-system

# Observe new pods provisioning in real-time
kubectl get pods -n hotel-system -w
```

### B. Self-Healing Demonstration
Demonstrate Kubernetes automatic failure detection and pod recreation:
```bash
# Get current pod names
kubectl get pods -n hotel-system

# Simulate a catastrophic node/container crash by deleting an active backend pod
kubectl delete pod <HOTEL_BACKEND_POD_NAME> -n hotel-system

# Immediately observe Kubernetes creating an instant replacement replica
kubectl get pods -n hotel-system
```
*Key Viva Explanation:* The Kubernetes Deployment controller continuously monitors the cluster state against the declared desired state (`replicas: 2`). When a pod terminates, the replica set immediately schedules a new pod to maintain High Availability.

### C. Zero-Downtime Rolling Update Demonstration
```bash
# Trigger a rolling update with a new image version
kubectl set image deployment/hotel-backend backend=hotel-backend:v2 -n hotel-system

# Monitor smooth rolling deployment progression
kubectl rollout status deployment/hotel-backend -n hotel-system

# If an issue arises, instantly roll back
kubectl rollout undo deployment/hotel-backend -n hotel-system
```

---

## 4. Health & Actuator Probe Verification
- **Liveness Probe**: `GET http://<POD_IP>:8080/actuator/health/liveness`
- **Readiness Probe**: `GET http://<POD_IP>:8080/actuator/health/readiness`
- **Full Health**: `GET http://<POD_IP>:8080/actuator/health`
