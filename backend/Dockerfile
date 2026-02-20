# --- Base Stage for Java 21 ---
FROM eclipse-temurin:21-jdk-alpine AS base
WORKDIR /app

# --- Development Stage ---
# In dev, we mount the source code and Maven cache as volumes via docker-compose
FROM base AS dev
# We use spring-boot:run to allow hot-reloading if devtools is present
# Also exposed port 5005 for remote debugging
CMD ["./mvnw", "spring-boot:run", "-Dspring-boot.run.jvmArguments='-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005'"]

# --- Builder Stage (for Production) ---
FROM base AS build
COPY . .
# Package the application skipping tests to speed up the build
RUN ./mvnw clean package -DskipTests

# --- Production Stage ---
FROM eclipse-temurin:21-jre-alpine AS prod
WORKDIR /app
# Copy the built jar from the builder stage
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
