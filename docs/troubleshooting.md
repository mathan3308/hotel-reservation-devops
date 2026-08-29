# Troubleshooting & Operational Runbook

## 1. Common Issues & Solutions

### A. Port Conflicts
- **Problem**: `Port 8080 or 3306 or 5173 already in use`.
- **Solution**:
  - Windows: Check process via `netstat -ano | findstr :8080` and terminate via `taskkill /F /PID <PID>`.
  - Alternatively, change `SERVER_PORT` in `application.yml` or port mapping in `docker-compose.yml`.

### B. Database Connection Refused in Docker
- **Problem**: Backend starts before MySQL is fully ready.
- **Solution**: The `docker-compose.yml` uses Docker healthcheck with `depends_on: mysql: condition: service_healthy`. If MySQL fails to initialize, check MySQL container logs via `docker logs hotel-mysql`.

### C. JWT Expiration / Unauthorized (401)
- **Problem**: API calls return 401 Unauthorized.
- **Solution**: Check if token expired (default validity: 24 hours). Clear browser localStorage (`hotel_jwt_token`) and log in again.

### D. Negative Stock Error (400 Bad Request)
- **Problem**: `Cannot issue X units. Available stock is only Y units.`
- **Solution**: Execute a `STOCK_IN` replenishment transaction before issuing consumables.

### E. Kubernetes Pod in `CrashLoopBackOff`
- **Problem**: Backend pod crashes on startup.
- **Solution**:
  1. Inspect pod logs: `kubectl logs <POD_NAME> -n hotel-system`
  2. Verify secret and configmap presence: `kubectl get secrets,configmaps -n hotel-system`
  3. Verify database readiness probe: `kubectl describe pod mysql-... -n hotel-system`
