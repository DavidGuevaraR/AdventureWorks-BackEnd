# Clientes API

NestJS + MongoDB API for managing clients, products, and sales.

## Features

- JWT authentication with role-based access control (ADMIN, SALES)
- CRUD for clients and products with soft delete and search/pagination
- Sales management with PDF invoice generation and cancellation flow
- Swagger documentation at `/api/docs`
- Docker and docker-compose setup
- Seeder script to create default admin user
- Jest unit and e2e tests with Supertest

## Getting Started

### Installation

```bash
npm install
```

### Running the app

```bash
npm run start:dev
```

Swagger UI: http://localhost:3000/api/docs

### Environment Variables

Copy `.env.example` to `.env` and adjust as needed.

### Database Seeding

```bash
npm run seed
```

Creates admin user `admin@example.com` with password `Admin#123`.

### Testing

```bash
npm test
npm run test:e2e
```

### Docker

```bash
docker-compose up --build
```

## Postman Collection

See `postman_collection.json` for sample requests.
