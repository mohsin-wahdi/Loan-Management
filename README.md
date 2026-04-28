# Loan Management System (Next.js + Express + MongoDB)

Production-ready full-stack Loan Management System with borrower portal, role-based operations dashboard, strict backend business rules, and full lifecycle flow from apply to closure.

## Tech Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Backend: Node.js, Express.js, TypeScript
- Database: MongoDB, Mongoose
- Authentication: JWT + bcrypt

## Features Delivered

- Borrower signup/login with hashed passwords and JWT
- Protected API routes and frontend auth guard
- Multi-step style borrower application (personal details + salary slip + loan config)
- Mandatory backend business-rule engine:
  - Reject if age `<23` or `>50`
  - Reject if salary `<25000`
  - Reject if PAN invalid
  - Reject if employment is `Unemployed`
- Salary slip upload (PDF/JPG/PNG, max 5MB)
- Loan calculation:
  - `SI = (P × R × T) / (365 × 100)`
  - Total repayment = `P + SI`
- Loan lifecycle states and transitions:
  - `APPLIED -> SANCTIONED | REJECTED`
  - `SANCTIONED -> DISBURSED`
  - `DISBURSED -> CLOSED` (auto when fully paid)
- Operations dashboard modules by role:
  - Sales: registered not applied users
  - Sanction: approve/reject (reason required for reject)
  - Disbursement: mark sanctioned as disbursed
  - Collection: add payment with UTR uniqueness + amount validations
- RBAC enforced in backend middleware + role-aware frontend UI
- Simple AI risk summary generated at application time (without replacing business rules)
- Seed script for predefined users

## Project Structure

```
Loan Management/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      scripts/
      services/
      validators/
      app.ts
      server.ts
  frontend/
    src/
      app/
      components/
      context/
      lib/
      types/
```

## Setup (Step-by-Step)

### 1) Prerequisites

- Node.js 20+
- MongoDB running locally (or Mongo Atlas URI)
- Cloudinary account (for salary slip storage)

### 2) Backend Setup

```bash
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

Backend starts on `http://localhost:5000`.

Add Cloudinary keys in `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3) Frontend Setup

```bash
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

Frontend starts on `http://localhost:3000`.

## Seeded Users

Password for all seeded users: `Password@123`

- Admin: `admin@loan.local`
- Sales: `sales@loan.local`
- Sanction: `sanction@loan.local`
- Disbursement: `disburse@loan.local`
- Collection: `collection@loan.local`
- Borrower: `borrower@loan.local`

## Key API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Borrower
- `POST /api/loans/apply` (multipart, salarySlip file required)
- `GET /api/loans/my-loans`

### Sales
- `GET /api/loans/sales/not-applied-users`

### Sanction
- `GET /api/loans/sanction/applied`
- `POST /api/loans/sanction/:id/approve`
- `POST /api/loans/sanction/:id/reject` (reason required)

### Disbursement
- `GET /api/loans/disbursement/sanctioned`
- `POST /api/loans/disbursement/:id/disburse`

### Collection
- `GET /api/loans/collection/disbursed`
- `POST /api/loans/collection/:id/payments`

## Notes

- Unauthorized (not authenticated): `401`
- Unauthorized (insufficient role): `403`
- Upload files are served from `/uploads`
- AI summary is intentionally minimal and does not override hard business rules
