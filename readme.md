# 🔐 JWT Authentication Service

A production-ready authentication service built with **NestJS**, **MongoDB**, **Redis**, and **JWT**, implementing secure access/refresh token authentication, refresh token rotation, MFA, OAuth2 login, and role-based authorization.

Designed as a standalone microservice that can be integrated into any SaaS application.

---

## 🚀 Tech Stack

* **Framework:** NestJS
* **Language:** TypeScript
* **Database:** MongoDB
* **Cache:** Redis
* **Authentication:** JWT + Refresh Tokens
* **Password Hashing:** Argon2id
* **OAuth:** Google & GitHub
* **MFA:** TOTP (Google Authenticator)
* **Documentation:** Swagger
* **Logging:** Winston + pino-http
* **Containerization:** Docker & Docker Compose

---

## ✨ Features

* User Registration
* Secure Login
* JWT Access Token Authentication
* Refresh Token Rotation
* Redis Token Revocation (Blacklist)
* Role-Based Authorization (RBAC)
* OAuth2 Social Login
* Multi-Factor Authentication (TOTP)
* Login Rate Limiting
* Global Exception Handling
* Structured Logging
* Swagger API Documentation

---

## 📁 Project Structure

```text
src/
├── auth/
│   ├── controllers/
│   ├── services/
│   ├── guards/
│   ├── strategies/
│   └── dto/
│
├── users/
│   ├── schema/
│   ├── repository/
│   └── service/
│
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── interceptors/
│
├── config/
│   ├── jwt.config.ts
│   ├── redis.config.ts
│   └── database.config.ts
│
└── main.ts
```

---

## 🏗️ Architecture

```text
                Client
                   │
                   │
             HTTP Request
                   │
                   ▼
          NestJS Auth Service
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
    MongoDB               Redis
   User Storage      Token Blacklist
                           &
                    Rate Limit Counters
```

---

## 🗄️ Database Schema

### Users

```ts
{
  _id: ObjectId,
  email: string,
  password_hash: string,
  roles: string[],
  mfa_secret: string,
  is_active: boolean,
  created_at: Date
}
```

### Refresh Tokens

```ts
{
  _id: ObjectId,
  user_id: ObjectId,
  refresh_token_hash: string,
  expires_at: Date,
  revoked: boolean
}
```

---

## 🔑 Authentication Flow

```
Register
    │
    ▼
Login
    │
    ├── Access Token (15 min)
    │
    └── Refresh Token (7 days)
             │
             ▼
        Refresh Endpoint
             │
             ▼
     Old Token Revoked
             │
             ▼
     New Token Pair Issued
```

---

## 📌 API Endpoints

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| POST   | `/auth/register`   | Register new user     |
| POST   | `/auth/login`      | User login            |
| POST   | `/auth/refresh`    | Refresh access token  |
| DELETE | `/auth/logout`     | Logout & revoke token |
| POST   | `/auth/mfa/enable` | Enable MFA            |
| GET    | `/users/me`        | Get current user      |

---

## 🔒 Security

* Argon2id password hashing
* JWT Access Tokens
* Refresh Token Rotation
* Redis Token Blacklist
* HttpOnly Refresh Cookies
* Role-Based Authorization
* OAuth2 Authentication
* MFA (Google Authenticator)
* Helmet Security Headers
* Input Validation
* Rate Limiting
* CORS Whitelist

---

## 📊 Logging

* Request Correlation IDs
* Structured JSON Logs
* Authentication Failure Logs
* Login Activity Logs

---

## ⚡ Caching Strategy

Redis is used for:

* Revoked JWT tokens
* Refresh token blacklist
* Login rate limiting
* TTL-based automatic expiration

---

## 🧪 Testing

### Unit Tests

* Auth Service
* JWT Guards
* User Service

### Integration Tests

* Register Flow
* Login Flow
* Refresh Flow
* Logout Flow

### Load Testing

* 1000 Concurrent Login Requests

---

## 🐳 Running with Docker

```bash
docker-compose up --build
```

Services:

* Auth Service
* MongoDB
* Redis

---

## 📖 Swagger

```bash
http://localhost:3000/api
```

Interactive API documentation with JWT authentication support.

---

## 📈 Scalability

* Stateless Authentication
* Horizontal Scaling
* Redis Cluster Support
* MongoDB Replica Set Compatible
* Microservice Ready

---

## 🎯 Concepts Covered

* JWT Authentication
* Refresh Token Rotation
* NestJS Guards
* OAuth2 Flow
* Redis TTL
* RBAC Authorization
* MFA Authentication
* Secure Cookie Strategy
* Production Error Handling

---

## 💼 Resume Highlights

**JWT Authentication Service**

* Built a production-ready authentication microservice using NestJS, MongoDB, Redis, and JWT.
* Implemented refresh token rotation, Redis-based token revocation, OAuth2 login, and TOTP multi-factor authentication.
* Added role-based authorization, rate limiting, structured logging, Docker support, and Swagger documentation following production best practices.

---

## 📄 License

This project is intended for learning, portfolio, and backend architecture practice.
