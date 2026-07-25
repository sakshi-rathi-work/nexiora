# NEXIORA — Full-Stack Talent Solutions Platform

NEXIORA is an enterprise recruitment and talent solutions platform built with a high-performance Next.js frontend and a secure NestJS microservices architecture. It supports job candidates, hiring recruiters, and platform administrators.

---

## 🏗️ Architecture & Tech Stack

- **Frontend (`web/`)**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Zustand, Axios, Lucide Icons.
- **Backend (`api/`)**: NestJS 11, TypeScript, Prisma ORM, PostgreSQL, Passport JWT Authentication, Pino Logging, Multer File Storage.
- **Infrastructure**: Docker & Docker Compose (PostgreSQL 16 database container).

---

## 🚀 Prerequisites

Make sure you have the following installed on your local machine:
- **Node.js** (v18.x or later)
- **npm** (v9.x or later)
- **Docker Desktop** (with Docker Compose)

---

## ⚡ Step-by-Step Startup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/sakshi-rathi-work/nexiora.git
cd nexiora
```

---

### 2. Start PostgreSQL Database Container
Run Docker Compose from the root directory:
```bash
docker-compose up -d
```
*This starts the PostgreSQL database container on port `5432` with username `nexiora` and password `nexiora_local_pw`.*

---

### 3. Environment Setup

#### Backend Environment (`api/.env`)
Navigate to `api/` and copy `.env.example` to `.env`:
```bash
cd api
cp .env.example .env
```
*(On Windows PowerShell: `copy .env.example .env`)*

Ensure your `api/.env` contains the correct database URL matching `docker-compose.yml`:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://nexiora:nexiora_local_pw@localhost:5432/nexiora_dev?schema=public"
JWT_ACCESS_SECRET="change-me-local-dev-only-access"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
CORS_ALLOWED_ORIGINS="http://localhost:3000"
LOCAL_UPLOAD_DIR="./uploads"

# Optional Real Email (SMTP) Integration
SMTP_HOST=""
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
MAIL_FROM="NEXIORA Talent Solutions <no-reply@nexiora.com>"
```

#### Frontend Environment (`web/.env.local`)
In `web/`, create `web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

### 4. Install Dependencies & Initialize Database

#### Backend Setup (`api`)
```bash
cd api
npm install
npx prisma migrate dev
npm run seed
```

#### Frontend Setup (`web`)
In a new terminal window:
```bash
cd web
npm install
```

---

### 5. Launch Development Servers

#### 1. Start Backend API (`http://localhost:4000`)
```bash
cd api
npm run start:dev
```
*Health Check endpoint: `http://localhost:4000/api/v1/health`*

#### 2. Start Frontend Web App (`http://localhost:3000`)
In another terminal:
```bash
cd web
npm run dev
```

Open your browser and navigate to **`http://localhost:3000`**.

---

## 🔐 Default Credentials

- **Admin Portal Access**: `admin@nexiora.com` / `AdminPassword123!`

---

## 🛠️ Key Features

- **Candidate Portal**: Browse curated jobs, multi-filter search (location, level, salary), submit applications with resume attachments, track application statuses.
- **Recruiter Portal**: View active hiring mandates, track applicants, download candidate resumes, update application pipeline statuses (*Submitted*, *Under Review*, *Interview*, *Offered*).
- **Secure File Storage**: Resume PDFs/Docs and User Profile Avatars are served securely through validated endpoints.
- **JWT Auth & Refresh Rotation**: HttpOnly refresh cookies paired with short-lived access JWT tokens.
