# E-Kirana Backend

This repository contains a Java Spring Boot REST API for an e‑grocery (kirana) application. It exposes endpoints for authentication, users, products, carts, orders, and reports, secured with JWT. The backend is built with Maven, uses MySQL for persistence via Spring Data JPA/Hibernate, and provides interactive API documentation via Swagger UI.

## Tech stack
- Language/Runtime: Java 21
- Framework: Spring Boot 3.5.x
- Build: Maven
- Persistence: Spring Data JPA (Hibernate) + MySQL
- Security: Spring Security + JWT (jjwt)
- Validation: spring-boot-starter-validation (Jakarta Validation)
- API Docs: springdoc-openapi (Swagger UI)
- Actuator: Health/info endpoints

## Project layout
```
E-Kirana/
├─ README.md                ← You are here
└─ kirana-backend/          ← Spring Boot application (Maven project)
   ├─ pom.xml
   ├─ src/main/java/com/kirana/
   │  ├─ controller/         ← REST controllers (Auth, Admin, User, Product, Cart, Order, Report)
   │  ├─ service/            ← Business logic services
   │  ├─ repository/         ← Spring Data JPA repositories
   │  ├─ model/              ← JPA entities and enums
   │  ├─ security/           ← JWT, filters, security configuration
   │  └─ KiranaBackendApplication.java
   └─ src/main/resources/
      └─ application.properties
```

## Key features
- JWT-based authentication and authorization
  - Public: /auth/register, /auth/login, Swagger UI
  - Secured endpoints for user/cart/order operations
  - Role-based access for admin endpoints (/admin/**)
- Product catalog (GET /products/** public)
- Cart and order management
- Reporting endpoints (sales summary, low stock, top products)
- CORS configured for http://localhost:3000 (React)

## Prerequisites
- Java 21
- Maven 3.9+
- MySQL 8.x running locally

## Configuration
Update database credentials and JWT settings in:
- kirana-backend/src/main/resources/application.properties

Important keys:
- spring.datasource.url, spring.datasource.username, spring.datasource.password
- jwt.secret (use a long, strong secret for production)
- jwt.expiration (milliseconds)

## Running locally
From the kirana-backend directory:

1) Install dependencies and build:
   mvn clean install

2) Run the app:
   mvn spring-boot:run

The server will start on http://localhost:8080

## API documentation (Swagger)
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- OpenAPI docs: http://localhost:8080/v3/api-docs

## Common endpoints (non-exhaustive)
- Auth
  - POST /auth/register
  - POST /auth/login
  - POST /auth/logout
  - GET  /auth/whoami
- Products
  - GET /products
  - GET /products/{id}
- Admin (requires ROLE_ADMIN)
  - /admin/** (e.g., user management/reporting)

## Notes
- CORS is additionally configured in SecurityConfig for localhost:3000.
- Default JPA DDL mode is `update` for developer convenience; use migrations for production.

If you were asking "what kind of project is this?":
- It is a Spring Boot 3 Java 21 REST API backend for an e‑grocery app, using JWT security and MySQL via JPA, built with Maven, documented with Swagger.


---

## Quick start (Windows)

Follow these steps to run the backend locally on Windows (PowerShell or Command Prompt):

1) Install prerequisites
- Java 21 (check: java -version)
- MySQL 8.x (make sure the MySQL service is running)
- No need to install Maven separately; the project includes the Maven Wrapper (mvnw.cmd)

2) Create the database (using MySQL client)
- Open a terminal and run:
  mysql -u root -p
- Then in the MySQL shell:
  CREATE DATABASE IF NOT EXISTS kirana_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  EXIT;

3) Configure credentials
- Default configuration is set in kirana-backend/src/main/resources/application.properties:
  spring.datasource.url=jdbc:mysql://localhost:3306/kirana_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
  spring.datasource.username=root
  spring.datasource.password=1234
- If your local MySQL password for root is not 1234, either:
  - Update spring.datasource.password to your actual password, OR
  - Create a new user and grant privileges, then update username/password accordingly.

4) Start the server
- From the project directory:
  cd kirana-backend
  mvnw.cmd spring-boot:run
- The first run will download dependencies; subsequent runs are much faster.

5) Verify it’s running
- Base URL: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs
- Health (Actuator): http://localhost:8080/actuator/health (if exposed)

6) Try basic flows
- Register a user: POST http://localhost:8080/auth/register
- Login to receive a JWT: POST http://localhost:8080/auth/login
- Call secured endpoints with Authorization: Bearer <token>

## Run from IntelliJ IDEA (alternative)
- Open the E-Kirana/kirana-backend folder as a Maven project.
- Let IntelliJ import dependencies.
- Locate the class: com.kirana.KiranaBackendApplication and click Run.

## Build and run as a JAR
From E-Kirana/kirana-backend:
- Build the JAR:
  mvnw.cmd clean package
- Run the packaged app:
  java -jar target/kirana-backend-0.0.1-SNAPSHOT.jar

You can override properties at runtime, for example:
- java -jar target/kirana-backend-0.0.1-SNAPSHOT.jar --server.port=9090 --spring.datasource.password=YOUR_PWD

## Troubleshooting
- Port 8080 already in use
  - Either stop the other process, or run with: mvnw.cmd spring-boot:run -Dspring-boot.run.arguments="--server.port=9090"

- MySQL authentication or connection errors
  - Verify DB exists: SHOW DATABASES; ensure kirana_db is listed
  - Check credentials in application.properties
  - Ensure MySQL is listening on localhost:3306
  - For MySQL 8, if you see auth plugin issues, ensure the user uses mysql_native_password or update your connector settings

- Schema auto-update
  - The app runs with spring.jpa.hibernate.ddl-auto=update for convenience; it will create/update tables automatically on startup.

- CORS issues from a React app on http://localhost:3000
  - CORS is already configured in SecurityConfig and application.properties for http://localhost:3000

## Useful commands
- Run tests: mvnw.cmd test
- Clean build: mvnw.cmd clean install
- Run with live reload (devtools included as runtime dependency): mvnw.cmd spring-boot:run
