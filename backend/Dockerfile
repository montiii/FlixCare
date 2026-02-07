FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/flixcare-backend-1.0.0.jar app.jar
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=production
# Aggressive Memory Limits für Railway Container
# Heap erhöht auf 192m für bessere GC-Effizienz
# Off-Heap Memory limitiert (DirectMemory, CompressedClassSpace)
# Target: <350 MB Container RAM
ENV JAVA_TOOL_OPTIONS="-Xmx192m -Xms128m \
    -XX:MaxMetaspaceSize=128m \
    -XX:MetaspaceSize=96m \
    -XX:ReservedCodeCacheSize=24m \
    -XX:CompressedClassSpaceSize=16m \
    -XX:MaxDirectMemorySize=24m \
    -Xss256k \
    -XX:+UseSerialGC \
    -XX:+TieredCompilation \
    -XX:TieredStopAtLevel=1 \
    -XX:+UseStringDeduplication \
    -XX:+UseContainerSupport \
    -Djava.security.egd=file:/dev/./urandom"
ENTRYPOINT ["java", "-jar", "app.jar"]
