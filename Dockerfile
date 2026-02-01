# ===== Build Stage =====
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Maven Wrapper kopieren
COPY backend/mvnw backend/mvnw
COPY backend/.mvn backend/.mvn

# pom.xml kopieren für Dependency-Caching
COPY backend/pom.xml backend/pom.xml

# Dependencies herunterladen (wird gecacht)
RUN cd backend && ./mvnw dependency:go-offline

# Frontend kopieren (für Maven Plugin)
COPY frontend frontend

# Backend Source kopieren
COPY backend/src backend/src

# Build (Maven Plugin baut Frontend automatisch)
RUN cd backend && ./mvnw clean package -DskipTests

# ===== Runtime Stage =====
FROM eclipse-temurin:17-jre

WORKDIR /app

# Nur JAR kopieren (ca. 50MB statt 500MB)
COPY --from=build /app/backend/target/flixcare-*.jar app.jar

# Port
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# App starten
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]