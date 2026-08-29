#!/usr/bin/env bash
# ==============================================================================
# HOTEL RESERVATION DEVOPS - AUTOMATED VERIFICATION SCRIPT (BASH)
# ==============================================================================
set -e

FAILED=0
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

pass() { echo -e "\033[32m[PASS]\033[0m $1"; }
fail() { echo -e "\033[31m[FAIL]\033[0m $1"; FAILED=$((FAILED + 1)); }
info() { echo -e "\033[34m[INFO]\033[0m $1"; }

echo "============================================================"
echo "  HOTEL RESERVATION DEVOPS AUTOMATED VERIFICATION"
echo "============================================================"

# Stage 1: Backend
info "Running Backend Tests & Packaging..."
cd "${ROOT_DIR}/backend"
mvn clean test && pass "Backend tests passed" || fail "Backend tests failed"
mvn clean package -DskipTests && pass "Backend package successful" || fail "Backend package failed"

# Stage 2: Frontend
info "Building Frontend Bundle..."
cd "${ROOT_DIR}/frontend"
npm install --prefer-offline
npm run build && pass "Frontend build successful" || fail "Frontend build failed"

# Stage 3: Docker Compose
info "Validating Docker Compose..."
cd "${ROOT_DIR}"
docker compose config > /dev/null && pass "Docker Compose configuration valid" || fail "Docker Compose invalid"

# Stage 4: Docker Images
info "Building Docker Images..."
docker build -t hotel-reservation-devops-backend:latest ./backend && pass "Backend image built" || fail "Backend image build failed"
docker build -t hotel-reservation-devops-frontend:latest ./frontend && pass "Frontend image built" || fail "Frontend image build failed"

# Stage 5: Kubernetes Manifests Dry-Run
info "Validating Kubernetes Manifests..."
for f in "${ROOT_DIR}"/k8s/*.yaml "${ROOT_DIR}"/k8s/*.yml; do
  if [ -f "$f" ]; then
    kubectl apply --dry-run=client --validate=false -f "$f" > /dev/null && pass "$(basename "$f") valid" || fail "$(basename "$f") invalid"
  fi
done

echo "============================================================"
if [ $FAILED -eq 0 ]; then
  echo -e "\033[32mALL CHECKS PASSED (100% SUCCESS)\033[0m"
  exit 0
else
  echo -e "\033[31mVERIFICATION FAILED ($FAILED errors)\033[0m"
  exit 1
fi
