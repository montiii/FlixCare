# FlixCare Backend

## Overview
FlixCare Backend is a Spring Boot microservice for tracking baby care activities including feeding, temperature monitoring, and cleaning records.

## Technologies
- Java 17
- Spring Boot 3.2.1
- Spring Data JPA
- PostgreSQL
- Lombok

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+

### Running Locally

1. Build the project:
```bash
mvn clean install
```

2. Run the application:
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Baby Management
- `GET /api/babies` - Get all babies
- `GET /api/babies/{id}` - Get baby by ID
- `POST /api/babies` - Create new baby
- `PUT /api/babies/{id}` - Update baby
- `DELETE /api/babies/{id}` - Delete baby

### Feeding Records
- `GET /api/feeding-records` - Get all feeding records
- `GET /api/feeding-records/baby/{babyId}` - Get records by baby
- `GET /api/feeding-records/baby/{babyId}/range` - Get records by date range
- `POST /api/feeding-records` - Create new record
- `PUT /api/feeding-records/{id}` - Update record
- `DELETE /api/feeding-records/{id}` - Delete record

### Temperature Records
- `GET /api/temperature-records` - Get all temperature records
- `GET /api/temperature-records/baby/{babyId}` - Get records by baby
- `GET /api/temperature-records/baby/{babyId}/range` - Get records by date range
- `POST /api/temperature-records` - Create new record
- `PUT /api/temperature-records/{id}` - Update record
- `DELETE /api/temperature-records/{id}` - Delete record

### Cleaning Records
- `GET /api/cleaning-records` - Get all cleaning records
- `GET /api/cleaning-records/baby/{babyId}` - Get records by baby
- `GET /api/cleaning-records/baby/{babyId}/range` - Get records by date range
- `POST /api/cleaning-records` - Create new record
- `PUT /api/cleaning-records/{id}` - Update record
- `DELETE /api/cleaning-records/{id}` - Delete record
