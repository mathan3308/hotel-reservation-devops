# CI/CD Pipeline Architecture with GitHub Actions

## 1. Pipeline Overview

The CI/CD workflow defined in [`.github/workflows/ci-cd.yml`](file:///c:/Projects/hotel-reservation-devops/.github/workflows/ci-cd.yml) enforces quality gates before any code is containerized or released.

```mermaid
flowchart TD
    Push[Code Push / Pull Request] --> TestStage[Job 1: Build & Automated Tests]
    
    subgraph Job 1: Build & Test
        TestStage --> MavenTest[Run Backend JUnit 5 Tests]
        TestStage --> MavenBuild[Package Spring Boot JAR]
        TestStage --> NodeBuild[Build Vite React Production Bundle]
        TestStage --> ComposeLint[Validate Docker Compose Syntax]
    end
    
    MavenTest & MavenBuild & NodeBuild & ComposeLint --> Gate{All Tests Pass?}
    Gate -->|No| Fail[Pipeline Fails & Blocks Merge]
    Gate -->|Yes| PushStage[Job 2: Containerize & Push Images]
    
    subgraph Job 2: Container Registry
        PushStage --> DockerBuild[Build Multi-stage Docker Images]
        DockerBuild --> Tagging[Tag with SHA, Run Number, & Latest]
        Tagging --> PushHub[Publish to Docker Hub]
    end
    
    PushHub --> K8sStage[Job 3: Kubernetes Manifest Validation]
    
    subgraph Job 3: Infrastructure Verification
        K8sStage --> DryRun[Kubectl Dry-Run Manifest Audit]
    end
```

---

## 2. Image Tagging Strategy

Every Docker image built in the pipeline receives multiple immutable tags:
1. **Commit SHA (`${{ github.sha }}`)**: Exact traceability to the Git commit that produced the build.
2. **Build Number (`v${{ github.run_number }}`)**: Monotonically increasing release sequence for rolling deployments.
3. **`latest`**: Points to the most recently built production release.

---

## 3. GitHub Secrets Configuration

To enable automated image publishing to Docker Hub:
- `DOCKERHUB_USERNAME`: Your Docker Hub account username.
- `DOCKERHUB_TOKEN`: Docker Hub Personal Access Token (PAT) with write permissions.
