# Kubernetes Cluster Orchestration & Scaling Guide

## 1. High Availability & Resilience Architecture

The Kubernetes architecture guarantees high availability and zero-downtime operations:
1. **Isolated Namespace**: All components reside inside the `hotel-system` namespace.
2. **Multi-Replica Deployment**: Backend and frontend services deploy with a minimum of 2 replicas each across worker nodes.
3. **Rolling Updates Strategy**:
   - `maxSurge: 1`
   - `maxUnavailable: 0`
   - Guarantees zero downtime by spinning up the new version pod before tearing down the old replica.
4. **Health Probes & Self-Healing**:
   - Readiness probes prevent traffic routing to pods before database connection initialization.
   - Liveness probes automatically restart unresponsive or deadlocked pods.
5. **Horizontal Pod Autoscaling (HPA)**: Dynamically scales backend pods between 2 and 5 replicas based on a 70% average CPU utilization threshold.

---

## 2. Manifest File Catalog

- [`k8s/namespace.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/namespace.yaml): Namespace isolation.
- [`k8s/configmap.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/configmap.yaml): Environment configuration.
- [`k8s/secret.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/secret.yaml): Sensitive credentials.
- [`k8s/mysql-pv-pvc.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/mysql-pv-pvc.yaml): PersistentVolumeClaim for storage durability.
- [`k8s/mysql-deployment.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/mysql-deployment.yaml): MySQL database pod & ClusterIP service.
- [`k8s/backend-deployment.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/backend-deployment.yaml): Spring Boot cluster (2 replicas).
- [`k8s/frontend-deployment.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/frontend-deployment.yaml): React Nginx cluster (2 replicas).
- [`k8s/ingress.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/ingress.yaml): Nginx Ingress routing gateway.
- [`k8s/hpa.yaml`](file:///c:/Projects/hotel-reservation-devops/k8s/hpa.yaml): Auto-scaler.

---

## 3. Operational Commands

```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/

# Monitor deployment rollout
kubectl rollout status deployment/hotel-backend -n hotel-system

# Scale manually
kubectl scale deployment hotel-backend --replicas=4 -n hotel-system

# View HPA autoscaling metrics
kubectl get hpa -n hotel-system
```
