# GolfCares Backend API

An Express-based REST API for the GolfCares lottery platform, handling user management, lottery draws, secure payments, and charity integration.

## Overview

This is a robust Node.js backend application providing all core business logic and data management for the GolfCares platform. The API governs authentication, payment processing, lottery administration, email dispatching, and scheduled draw execution.

## Technology Stack

- **Express 5.2.1** - Web framework
- **Node.js 16+** - JavaScript runtime
- **MongoDB with Mongoose 9.3.2** - Data persistence and object modeling
- **JWT** - Secure authentication via JSON Web Tokens
- **Bcrypt** - Industry-standard password hashing
- **Stripe 20.4.1** - Secure payment processing infrastructure
- **Cloudinary** - Cloud-scale image hosting and management
- **Nodemailer** - Electronic mail dispatch
- **Node Cron** - Time-based task scheduling
- **Helmet** - Application security through HTTP headers
- **CORS** - Cross-origin resource sharing policy management
- **Express Validator** - Structured input validation
- **Morgan** - Standardized HTTP request logging
- **Multer** - Multipart/form-data transaction handling
- **Express Rate Limit** - Protective API rate limiting

## Project Structure

```text
src/
├── config/
│   ├── db.js               # MongoDB connection setup
│   └── cloudinary.js       # Cloudinary integration setup
├── models/
│   ├── User.js             # User schema definitions
│   ├── Draw.js             # Lottery draw constructs
│   ├── Charity.js          # Charity organization structures
│   ├── Subscription.js     # Subscription methodologies
│   ├── Score.js            # User participation records
│   ├── Winner.js           # Victor tracking arrays
│   └── Ticket.js           # Lottery ticket definitions
├── controllers/
│   ├── auth.controller.js  # Authentication routing logic
│   ├── draw.controller.js  # Draw operational logic
│   ├── charity.controller.js
│   └── ...
├── routes/
│   ├── auth.routes.js      # Authentication endpoint definitions
│   ├── draw.routes.js      # Draw endpoint definitions
│   └── ...
├── middleware/
│   ├── auth.middleware.js  # JWT verification gateway
│   └── error.middleware.js # Standardized global error interceptor
├── services/
│   ├── draw.service.js     # Draw algorithmic business logic
│   ├── email.service.js    # Specialized mail generation
│   └── stripe.service.js   # Synchronous payment protocols
├── jobs/
│   └── draw.cron.js        # Scheduled chronological executions
├── utils/
│   └── seed.js             # Database seeding macros
└── index.js                # Server instantiation entry point
```

## Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn package manager
- MongoDB instance (local service or MongoDB Atlas cluster)
- Stripe developer account and valid API keys
- Cloudinary developer account and provisioning credentials
- SMTP or compatible NodeMailer interface credentials

### Installation

```bash
npm install
```

### Environment Configuration

Establish a `.env` configuration file in the server root directive:

```env
# Server Setup
PORT=3000
NODE_ENV=development

# Database Interfacing
MONGODB_URI=mongodb://localhost:27017/golfcares

# JSON Web Token Specifications
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Stripe Integrity
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary Specifications
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP Transmission Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@golfcares.com

# Resource Integrity Policies
CORS_ORIGIN=http://localhost:5173

# Administrative Privileges
ADMIN_EMAIL=admin@golfcares.com
ADMIN_PASSWORD=change_this_password
```

### Start Development Server

```bash
npm run dev
```

Operation initializes utilizing Nodemon for automated restarts. Standard routing listens on `http://localhost:3000`.

### Production Deployment

```bash
npm start
```

Executes Node continuously without automated reloading parameters for stability.

### Database Seeding Protocols

```bash
npm run seed
```

Automates creation of initial foundational documents (charities, primary administrative user accounts, structural testing constraints).

## Core Application Models

### User Architecture
Retains encrypted authentication materials, system privileges (Roles: Standard, Administrative, Charity), compliance/KYC state configurations, and user preferences.

### Draw Architecture
Encapsulates metadata for active and future lotteries, establishing execution timestamps, capacity constraints, association with target charities, and present activity status indicators.

### Charity Architecture
Stores immutable characteristics about partnered organizations such verifiable addresses, impact parameters, verification compliance details, and graphical identity artifacts.

### Subscription Architecture
Regulates tiered financial agreements, managing routine processing cycles and automated ticket distribution allowances across standard intervals.

### Transaction Integrity
All financial activity intersects the Stripe abstraction layer. Webhook integrity is paramount for finalizing asynchronous payment confirmations, processing partial refunds, and validating subscription renewals against the master ledger.

## Security Overview

- **Token Authenticity:** Bearer authentication restricted by standard cryptographic validation and routine expiration cycles.
- **Data Hardening:** bcrypt utilization for password obfuscation prioritizing a standardized 10-round computational cost.
- **Resource Protection:** Express Rate Limiting enforced against brute-force intrusion techniques on critical administrative or login routines.
- **Protocol Integrity:** Implementation of Helmet.js secures application headers against cross-site scripting attacks and content-sniffing exploits.
- **Data Scrubbing:** MongoDB parameter injection is inherently restricted via Mongoose abstract mapping layers.

## Troubleshooting

### Database Instability
Ensure `MONGODB_URI` environment designation is structurally correct and networking restrictions (like IP allow-lists internally upon MongoDB Atlas) permit connection attempts from your operational environment.

### Webhook Reception Failure
Ascertain that the corresponding webhook configurations on the Stripe administration console precisely coordinate with public-facing endpoints provided via services like ngrok during native development cycles.
