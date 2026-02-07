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
ENV JAVA_TOOL_OPTIONS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=50.0 -XX:+UseSerialGC -XX:+TieredCompilation -XX:TieredStopAtLevel=1 -Xss256k -XX:MaxMetaspaceSize=128m -XX:+UseStringDeduplication"
ENTRYPOINT ["java", "-jar", "app.jar"]
