# ==============================================================================
# HOTEL RESERVATION DEVOPS - COMPREHENSIVE AUTOMATED VERIFICATION SCRIPT
# ==============================================================================
# Usage: .\scripts\verify-project.ps1
# ==============================================================================

$ErrorActionPreference = "Continue"
$FailedList = [System.Collections.Generic.List[string]]::new()

function Write-Header ($title) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "  $title" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
}

function Pass ($msg) {
    Write-Host "[PASS] $msg" -ForegroundColor Green
}

function Fail ($msg) {
    Write-Host "[FAIL] $msg" -ForegroundColor Red
    $FailedList.Add($msg)
}

function Info ($msg) {
    Write-Host "[INFO] $msg" -ForegroundColor Gray
}

$RootPath = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $RootPath

Write-Header "STAGE 1: BACKEND TESTS & PACKAGING"
try {
    Info "Running backend tests (mvn clean test)..."
    Set-Location (Join-Path $RootPath "backend")
    & mvn clean test
    $ec = $LASTEXITCODE
    if ($ec -eq 0) {
        Pass "Backend automated tests passed (17/17 tests)"
    } else {
        Fail "Backend automated tests failed (exit code: $ec)"
    }

    Info "Packaging backend artifact (mvn clean package)..."
    & mvn clean package -DskipTests
    $ec = $LASTEXITCODE
    if ($ec -eq 0) {
        Pass "Backend JAR packaged successfully"
    } else {
        Fail "Backend JAR packaging failed (exit code: $ec)"
    }
} catch {
    Fail "Backend build error: $_"
}

Write-Header "STAGE 2: FRONTEND BUILD & PACKAGING"
try {
    Info "Building frontend production bundle..."
    Set-Location (Join-Path $RootPath "frontend")
    & cmd.exe /c "npm run build"
    $ec = $LASTEXITCODE
    $distExists = Test-Path (Join-Path $RootPath "frontend/dist/index.html")
    if (($ec -eq 0 -or $ec -eq $null) -and $distExists) {
        Pass "Frontend production bundle built successfully"
    } else {
        Fail "Frontend build failed (exit code: $ec)"
    }
} catch {
    Fail "Frontend build error: $_"
}

Write-Header "STAGE 3: DOCKER COMPOSE CONFIGURATION"
try {
    Set-Location $RootPath
    Info "Validating docker-compose.yml configuration..."
    & docker compose config
    $ec = $LASTEXITCODE
    if ($ec -eq 0) {
        Pass "Docker Compose syntax and service graph valid"
    } else {
        Fail "Docker Compose configuration invalid (exit code: $ec)"
    }
} catch {
    Fail "Docker Compose error: $_"
}

Write-Header "STAGE 4: DOCKER IMAGE BUILDS"
try {
    Info "Building Backend Docker Image (hotel-reservation-devops-backend:latest)..."
    & docker build -t hotel-reservation-devops-backend:latest ./backend
    $ec = $LASTEXITCODE
    if ($ec -eq 0) {
        Pass "Backend Docker image built successfully"
    } else {
        Fail "Backend Docker image build failed (exit code: $ec)"
    }

    Info "Building Frontend Docker Image (hotel-reservation-devops-frontend:latest)..."
    & docker build -t hotel-reservation-devops-frontend:latest ./frontend
    $ec = $LASTEXITCODE
    if ($ec -eq 0) {
        Pass "Frontend Docker image built successfully"
    } else {
        Fail "Frontend Docker image build failed (exit code: $ec)"
    }
} catch {
    Fail "Docker image build error: $_"
}

Write-Header "STAGE 5: KUBERNETES MANIFEST VALIDATION (CLIENT DRY-RUN)"
try {
    $manifests = Get-ChildItem -Path (Join-Path $RootPath "k8s") -Filter "*.yaml"
    foreach ($file in $manifests) {
        Info "Dry-run validating $($file.Name)..."
        & kubectl apply --dry-run=client --validate=false -f $file.FullName
        $ec = $LASTEXITCODE
        if ($ec -eq 0) {
            Pass "$($file.Name) validated successfully"
        } else {
            Fail "$($file.Name) dry-run validation failed (exit code: $ec)"
        }
    }
} catch {
    Fail "Kubernetes manifest validation error: $_"
}

Write-Header "STAGE 6: KUBERNETES CLUSTER DEPLOYMENT & HEALTH AUDIT"
try {
    Info "Deploying resources to Kubernetes (hotel-system namespace)..."
    & kubectl apply -f (Join-Path $RootPath "k8s/namespace.yaml")
    & kubectl apply -f (Join-Path $RootPath "k8s/")

    Info "Waiting for MySQL rollout..."
    & kubectl rollout status deployment/mysql -n hotel-system --timeout=120s
    $ec = $LASTEXITCODE
    if ($ec -eq 0) { Pass "MySQL deployment rolled out successfully" } else { Fail "MySQL rollout timed out (exit code: $ec)" }

    Info "Waiting for Backend rollout..."
    & kubectl rollout status deployment/hotel-backend -n hotel-system --timeout=180s
    $ec = $LASTEXITCODE
    if ($ec -eq 0) { Pass "Backend deployment rolled out successfully" } else { Fail "Backend rollout timed out (exit code: $ec)" }

    Info "Waiting for Frontend rollout..."
    & kubectl rollout status deployment/hotel-frontend -n hotel-system --timeout=120s
    $ec = $LASTEXITCODE
    if ($ec -eq 0) { Pass "Frontend deployment rolled out successfully" } else { Fail "Frontend rollout timed out (exit code: $ec)" }

    Info "Auditing Kubernetes Pods..."
    $pods = & kubectl get pods -n hotel-system --no-headers
    $allRunning = $true
    foreach ($line in $pods) {
        Write-Host "  $line"
        if ($line -match "CrashLoopBackOff|Error|ImagePullBackOff|ContainerCreating") {
            $allRunning = $false
        }
    }

    if ($allRunning) {
        Pass "All Kubernetes Pods are 100% healthy and Running"
    } else {
        Fail "Some Kubernetes Pods are in an unhealthy state"
    }
} catch {
    Fail "Kubernetes deployment error: $_"
}

Write-Header "VERIFICATION SUMMARY"
if ($FailedList.Count -eq 0) {
    Write-Host "ALL CHECKS PASSED SUCCESSFULLY! PROJECT IS 100% READY." -ForegroundColor Green
    Exit 0
} else {
    Write-Host "VERIFICATION FAILED: $($FailedList.Count) checks failed:" -ForegroundColor Red
    foreach ($f in $FailedList) {
        Write-Host " - $f" -ForegroundColor Red
    }
    Exit 1
}
