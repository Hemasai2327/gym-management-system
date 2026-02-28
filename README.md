# Gym Management System

A full-stack web application designed to help gym administrators manage members, track memberships, and monitor membership status in real time — replacing manual tracking with an automated system.

# Features

**Authentication**
- Admin login with email and password
- JWT-based authentication with protected routes
- Automatic redirect on token expiration

**Dashboard**
- Real-time stats: Total, Active, Expired, and Expiring Soon members
- Clickable stat cards that navigate to filtered member lists

**Member Management (Full CRUD)**
- Add, edit, delete, and view members
- Smart expiry date calculation — select start date and duration (1, 3, 6, or 12 months), system automatically calculates `membershipEndDate`
- Status tracking: Active / Expired / Expiring Soon (within 7 days)

**Dynamic Filtering**
- Filter members by status via query params: `?status=active`, `?status=expired`, `?status=expiring`

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend   | NestJS, TypeScript, JWT, REST API       |
| Database  | MongoDB, Mongoose ODM                   |

## Project Structure

```
gym-management/
├── web/                        # Frontend (Next.js)
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   └── members/
│   ├── components/
│   └── lib/
│
├── backend/                    # Backend (NestJS)
│   └── src/
│       ├── auth/
│       ├── members/
│       └── app.module.ts
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
MONGODB_URI=mongodb://localhost:27017/gym-management
JWT_SECRET=your_jwt_secret_here
PORT=3001
```

Start the backend:
```bash
npm run start:dev
```

### Frontend Setup
```bash
cd web
npm install
```

Create a `.env.local` file in the `web/` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication Flow

```
Admin Login → JWT issued → Stored in localStorage → Sent in Authorization header → Protected routes validated
```

## Member Schema

```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "monthlyFee": "number",
  "startDate": "date",
  "duration": "number (months)",
  "membershipEndDate": "date",
  "isActive": "boolean",
  "createdAt": "date"
}
```

## Status

| Feature                  | Status        |
|--------------------------|---------------|
| JWT Authentication       | ✅ Complete   |
| Dashboard with stats     | ✅ Complete   |
| Member CRUD              | ✅ Complete   |
| Smart expiry calculation | ✅ Complete   |
| Dynamic filtering        | ✅ Complete   |
| Pagination               | 🚧 In Progress |
| Role-based access        | 🚧 Planned    |
| Payment history          | 🚧 Planned    |
| CSV export               | 🚧 Planned    |
| Email/SMS reminders      | 🚧 Planned    |
| Deployment               | 🚧 Planned    |

## Key Concepts Demonstrated

Full Stack Development, REST API Design, JWT Authentication, MongoDB Schema Design, Modular NestJS Architecture, TypeScript Strict Typing, Dynamic Query Param Filtering, Date Manipulation Logic, React State Management, Error Handling & API Security
