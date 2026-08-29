# ==============================================================================
# Multi-stage Dockerfile for Spring Boot 3.3.4 (Java 21 LTS)
# ==============================================================================

# Stage 1: Build Stage
FROM maven:3.9.8-eclipse-temurin-21 AS builder
WORKDIR /build

# Copy Maven Project Model & Source Code
COPY pom.xml .
COPY src ./src

# Build production jar without tests (tests are executed in CI pipeline)
RUN mvn clean package -DskipTests

# Stage 2: Production JRE Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Add unprivileged user for security
RUN addgroup -S hotelgroup && adduser -S hoteluser -G hotelgroup

# Copy compiled jar from builder
COPY --from=builder /build/target/hotel-reservation-backend-1.0.0.jar app.jar

# Set ownership
RUN chown -R hoteluser:hotelgroup /app

# Switch to non-root user
USER hoteluser

EXPOSE 8080

# Configure JVM tuning options and active profiles
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"
ENV SPRING_PROFILES_ACTIVE=prod

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
