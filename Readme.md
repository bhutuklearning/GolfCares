<div align="center">
  <img src="./client/public/GolfCares.png" alt="GolfCares Logo" width="300" />
  <br />
</div>

# GolfCares

A full-stack lottery platform built with modern web technologies, featuring charity integration, payment processing, and real-time draw management.

## Project Overview

GolfCares is a comprehensive lottery and charitable giving platform that connects users with charitable organizations through a transparent, secure lottery system. The platform supports user registration, ticket purchases, draw participation, and charity management with integrated payment processing.

## Architecture

This is a monorepo containing two main applications:

- **Client**: React and Vite frontend with TypeScript
- **Server**: Express.js backend with MongoDB

## Tech Stack

### Frontend (Client)
- React 19.2.4 with TypeScript
- Vite - Fast build tool and development server
- TanStack React Query - Data fetching and caching
- React Router - Client-side routing
- Tailwind CSS - Utility-first styling
- Shadcn UI - Reusable component library
- React Hook Form - Form state management
- Stripe - Payment integration
- Zustand - State management
- Zod - Schema validation

### Backend (Server)
- Express 5.2.1 - Web framework
- MongoDB with Mongoose - Data persistence
- JWT - Authentication and authorization
- Stripe API - Payment processing
- Cloudinary - Image storage and management
- Nodemailer - Email notifications
- Node Cron - Scheduled tasks (draw execution)
- Helmet - Security headers
- Express Rate Limit - API rate limiting
- Bcrypt - Password hashing

## Project Structure

```text
Technical-assessment/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page-level components
│   │   ├── api/            # Axios API clients
│   │   ├── store/          # Zustand state stores
│   │   └── utils/          # Helper functions
│   └── package.json
├── server/                 # Express backend application
│   ├── src/
│   │   ├── models/         # Mongoose schemas
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   ├── jobs/           # Scheduled tasks
│   │   └── config/         # Configuration
│   └── package.json
└── Readme.md
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- MongoDB instance (local or cloud)
- Stripe account and API keys
- Cloudinary account and credentials
- Email service credentials (for nodemailer)

### Setup Instructions

1. Clone the repository and install dependencies for both client and server:

```bash
cd client
npm install

cd ../server
npm install
```

2. Configure environment variables for the server:

```bash
cd server
cp .env.sample .env
# Update the .env file with your Stripe, Cloudinary, MongoDB, and email credentials
```

3. Start the development servers:

```bash
# Terminal 1 - Frontend
cd client
npm run dev

# Terminal 2 - Backend
cd server
npm run dev
```

The frontend will be available at `http://localhost:5173` (Vite default).
The backend API will run on `http://localhost:3000` (or the configured port).

## Available Scripts

### Client

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Server

- `npm run dev` - Start development server with auto-reload (nodemon)
- `npm start` - Start in production mode
- `npm run seed` - Seed database with initial data

## Key Features

- User authentication and authorization (JWT-based)
- Lottery ticket booking and management
- Stripe payment integration for secure transactions
- Charity organization management and integration
- Admin dashboard for system management
- Draw scheduling and execution (cron-based)
- Real-time score and winning tracking
- Subscription management
- File uploads to Cloudinary
- Email notifications for draws and wins
- Protected routes and role-based access control

## Development Guidelines

- Use TypeScript in frontend code for type safety
- Follow REST API conventions for backend endpoints
- Implement proper error handling and validation
- Use environment variables for sensitive configuration
- Write meaningful commit messages
- Maintain consistent code formatting

## Security Considerations

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Helmet.js for HTTP security headers
- CORS configuration for cross-origin requests
- Input validation and sanitization with express-validator
- Secure credential management via environment variables