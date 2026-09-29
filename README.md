# E-Commerce Product Catalog & Cart

A full-stack e-commerce application built for the Full Stack Developer take-home task.

Users can register, log in, browse products, search/filter products, and manage their own cart. Admin users can manage products through protected admin routes.

## Features

- User registration and login
- JWT authentication
- Secure password hashing with bcrypt
- User and admin roles
- Backend-enforced authorization
- Product search and price filtering/sorting
- Admin product CRUD
- User-specific shopping cart
- Server-side cart total calculation
- Stock and out-of-stock validation
- Input validation with Zod
- Centralized error handling
- Responsive UI

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Zod
- JWT
- bcryptjs

## Project Structure

ecom-inspler-task/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── product.controller.ts
│   │   │   └── cart.controller.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── admin.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Product.ts
│   │   │   └── Cart.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── product.routes.ts
│   │   │   └── cart.routes.ts
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.schema.ts
│   │   │   ├── product.schema.ts
│   │   │   └── cart.schema.ts
│   │   │
│   │   ├── seed/
│   │   │   └── seed.ts
│   │   │
│   │   ├── types/
│   │   │   └── express.d.ts
│   │   │
│   │   └── server.ts
│   │
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   └── admin/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── ProductCard.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   └── auth.ts
│   │
│   ├── types/
│   │   └── auth.ts
│   │
│   ├── .env.example
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
└── README.md

## Requirements

- Node.js
- npm
- MongoDB / MongoDB Atlas

## Environment Variables

### Backend

Create `backend/.env`:

    PORT=5000
    MONGODB_URI=mongo_db_connection_string
    JWT_SECRET=jwt_secret
    CLIENT_URL=http://localhost:3000

### Frontend

Create `frontend/.env.local`:

    NEXT_PUBLIC_API_URL=http://localhost:5000/api

Example environment files are included in the project.

## Installation

Clone the repository:

    git clone https://github.com/rijas0/ecom-inspler-task
    cd ecom-inspler-task

### Backend

    cd backend
    npm install
    npm run dev

Backend runs on:

    http://localhost:5000

### Frontend

Open another terminal:

    cd frontend
    npm install
    npm run dev

Frontend runs on:

    http://localhost:3000

## Database Seeding

Configure the backend `.env` first, then run:

    cd backend
    npm run seed

The seed data includes the sample products from the task, including an out-of-stock product with `stock: 0`, and a seeded admin account.

## Admin Credentials

    Email: admin@example.com
    Password: Admin@123456

These credentials are provided for testing the admin product management features.

## API Endpoints

### Authentication

    POST /api/auth/register
    POST /api/auth/login

### Products

    GET    /api/products
    POST   /api/products
    PATCH  /api/products/:id
    DELETE /api/products/:id

Product listing supports:

    ?search=
    ?minPrice=
    ?maxPrice=
    ?sort=price_asc
    ?sort=price_desc

### Cart

    GET    /api/cart
    POST   /api/cart
    PATCH  /api/cart/:id
    DELETE /api/cart/:id

Cart endpoints require authentication.

## Authorization & Security

- Passwords are securely hashed using bcrypt.
- JWT is used for authentication.
- Product creation, update, and deletion are restricted to admins.
- Admin authorization is enforced on the backend.
- Users can only access and modify their own cart.
- Cart totals are calculated on the server.
- Backend requests are validated using Zod.
- Environment secrets are not committed to Git.
- Centralized error handling prevents stack traces from being exposed.

## Assumptions

- Product images are stored as external image URLs.
- Cart totals are calculated using the current product prices on the server.
- Product stock is validated by the backend.
- MongoDB is used as the persistent database.
- JWT is used for authentication.

## Deployment

Frontend: `YOUR_FRONTEND_URL`

Backend: `YOUR_BACKEND_URL`

Database: MongoDB Atlas

## Author

Muhammed Rijas