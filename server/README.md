# GolfCares Backend API

Express-based REST API for the GolfCares lottery platform, handling user management, lottery draws, payments, and charity integration.

## Overview

This is a robust Node.js backend application providing all business logic and data management for the GolfCares platform. The API handles authentication, payment processing, lottery management, email notifications, and scheduled draw execution.

## Technology Stack

- **Express 5.2.1** - Web framework
- **Node.js 16+** - Runtime
- **MongoDB with Mongoose 9.3.2** - Data persistence
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Stripe 20.4.1** - Payment processing
- **Cloudinary** - Image hosting and management
- **Nodemailer** - Email notifications
- **Node Cron** - Scheduled tasks
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation
- **Morgan** - HTTP request logging
- **Multer** - File upload handling
- **Express Rate Limit** - API rate limiting

## Project Structure

```
src/
├── config/
│   ├── db.js              # MongoDB connection
│   └── cloudinary.js      # Cloudinary configuration
├── models/
│   ├── User.js            # User schema
│   ├── Draw.js            # Lottery draw schema
│   ├── Charity.js         # Charity organization schema
│   ├── Subscription.js    # Subscription schema
│   ├── Score.js           # User score/participation
│   ├── Winner.js          # Winner tracking
│   └── Ticket.js          # Lottery ticket schema
├── controllers/
│   ├── auth.controller.js
│   ├── draw.controller.js
│   ├── charity.controller.js
│   ├── subscription.controller.js
│   ├── winner.controller.js
│   ├── score.controller.js
│   ├── admin.controller.js
│   └── ...other controllers
├── routes/
│   ├── auth.routes.js
│   ├── draw.routes.js
│   ├── charity.routes.js
│   ├── subscription.routes.js
│   ├── winner.routes.js
│   ├── admin.routes.js
│   └── ...other routes
├── middleware/
│   ├── auth.middleware.js  # JWT verification
│   └── error.middleware.js # Global error handler
├── services/
│   ├── draw.service.js     # Draw logic
│   ├── email.service.js    # Email notifications
│   ├── stripe.service.js   # Payment processing
│   └── ...other services
├── jobs/
│   └── draw.cron.js        # Scheduled draw execution
├── utils/
│   └── seed.js             # Database seeding
└── index.js                # Application entry point
```

## Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- MongoDB instance (local or cloud - MongoDB Atlas)
- Stripe account and API keys
- Cloudinary account and credentials
- Nodemailer-compatible email service (Gmail, SendGrid, etc.)

### Installation

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the server directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/golfcares
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/DBName

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@golfcares.com

# CORS
CORS_ORIGIN=http://localhost:5173

# Admin
ADMIN_EMAIL=admin@golfcares.com
ADMIN_PASSWORD=change_this_password
```

Reference: See `.env.sample` for all available options.

### Development

```bash
npm run dev
```

Starts the server with auto-reload via nodemon. The API will run on `http://localhost:3000`.

### Production

```bash
npm start
```

Runs the server without auto-reload.

### Database Seeding

```bash
npm run seed
```

Seeds the database with initial data (charities, admin user, sample data).

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Draw Routes
- `GET /api/draws` - List all draws
- `GET /api/draws/:id` - Get draw details
- `POST /api/draws/:id/tickets` - Purchase tickets (requires auth)
- `GET /api/draws/:id/results` - Get draw results
- `GET /api/draws/user/my-tickets` - Get user's tickets

### Charity Routes
- `GET /api/charities` - List all charities
- `GET /api/charities/:id` - Get charity details
- `GET /api/charities/:id/impact` - Get charity impact stats
- `POST /api/charities` - Create charity (admin only)
- `PUT /api/charities/:id` - Update charity (admin only)

### Subscription Routes
- `GET /api/subscriptions` - List subscription plans
- `POST /api/subscriptions/subscribe` - Subscribe to plan
- `GET /api/subscriptions/user/my-subscription` - Get user subscription
- `POST /api/subscriptions/cancel` - Cancel subscription

### Winner Routes
- `GET /api/winners` - List winners
- `GET /api/winners/:id` - Get winner details
- `GET /api/winners/user/my-winnings` - Get user's winnings

### Score Routes
- `GET /api/scores` - Get user scores/leaderboard
- `GET /api/scores/user/:userId` - Get specific user score

### Admin Routes
- `GET /api/admin/users` - List all users (admin only)
- `GET /api/admin/statistics` - Get platform statistics
- `POST /api/admin/draws/execute` - Execute scheduled draw
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/transactions` - View transactions

## Database Models

### User
- Email, password (hashed), name, phone
- Role (user, admin, charity)
- KYC verification status
- Preferences and settings

### Draw
- Title, description, name, image
- Start/end dates, draw date and time
- Ticket price, max tickets
- Associated charity
- Status (upcoming, active, completed)
- Created date and metadata

### Charity
- Name, description, website
- Logo and banner images
- Impact statistics
- Contact information
- Verification status

### Subscription
- Plan name and description
- Price and billing cycle
- Benefits and ticket allowance
- Active subscriptions tracked per user

### Score
- User participation count
- Points earned
- Tickets purchased
- Draws participated in

### Winner
- User who won
- Draw information
- Prize amount
- Claim status and date

### Ticket
- Reference number (unique)
- User who purchased
- Associated draw
- Numbers selected
- Purchase date and status

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User logs in with email and password
2. Backend validates credentials and returns JWT token
3. Client includes token in Authorization header: `Bearer <token>`
4. Middleware verifies token on protected routes
5. Token expires after configured duration (default 7 days)

Protected routes require valid JWT in the `Authorization` header.

## Payment Processing

Stripe integration handles all payments:
- Payment intent creation for ticket purchases
- Webhook handling for payment confirmations
- Subscription management
- Refund processing

Stripe webhooks must be configured to handle the following events:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

## Email Notifications

The email service sends notifications for:
- Registration confirmation
- Password reset
- Draw results
- Winners announcement
- Subscription confirmations
- Payment receipts

## Scheduled Tasks

Node Cron manages scheduled operations:
- Draw execution at scheduled times
- Email notification dispatch
- Cleanup of expired data
- Subscription renewal checks

## Error Handling

The API implements comprehensive error handling:
- Validation errors return 400 (Bad Request)
- Authentication errors return 401 (Unauthorized)
- Permission errors return 403 (Forbidden)
- Not found errors return 404
- Server errors return 500

All errors include descriptive messages and error codes for client handling.

## Security Features

- JWT-based authentication with expiration
- Bcrypt password hashing (salt rounds: 10)
- Helmet.js for HTTP header security
- CORS configuration for allowed origins
- Rate limiting on authentication endpoints
- Input validation with express-validator
- SQL injection prevention through Mongoose
- HTTPS enforcement in production
- Secure credential management via environment variables

## Performance Considerations

- Database connection pooling via Mongoose
- Request logging with Morgan
- Compression of responses
- Efficient Query handling
- Caching strategies for frequently accessed data

## Deployment

### Prerequisites for Deployment
- Node.js 16+ on target server
- MongoDB Atlas or managed database instance
- Stripe production account
- Cloudinary production account
- Email service credentials
- SSL/TLS certificates for HTTPS

### Deployment Platforms
- Heroku: Git-based deployment with environment variables
- Railway: GitHub integration with simple deployment
- AWS EC2: Node.js runtime with MongoDB and environment setup
- DigitalOcean: App Platform for managed Node.js deployment

## Testing

Test files should follow the pattern: `module.test.js`

(Test setup and utilities to be added)

## Monitoring and Logging

- Morgan logs all HTTP requests
- Error logs are captured and should be persisted
- In production, consider services like:
  - Sentry for error tracking
  - DataDog or New Relic for performance monitoring
  - ELK Stack for centralized logging

## Backup and Disaster Recovery

- Regular MongoDB backups (Atlas automatic backups recommended)
- Environment variables backed up securely
- Database replication for high availability

## Troubleshooting

### Database Connection Failed
Check `MONGODB_URI` in `.env` and ensure MongoDB service is running or Atlas is accessible.

### Stripe Errors
Verify `STRIPE_SECRET_KEY` is correct and webhook endpoints are properly configured.

### Email Not Sending
Check email service credentials and ensure "Less secure app access" is enabled (for Gmail) or equivalent.

### CORS Errors
Ensure `CORS_ORIGIN` in `.env` matches your frontend URL.

## API Documentation

For detailed API endpoint documentation, consider implementing:
- Swagger/OpenAPI documentation
- Postman collection export
- Interactive API explorer

## Future Enhancements

- GraphQL API layer
- Advanced analytics engine
- Real-time notifications with WebSockets
- Machine learning for fraud detection
- Distributed caching with Redis
- Microservices architecture
- Additional payment gateways
- Enhanced audit logging

## Support and Contribution

For issues or contributions, follow the main project contribution guidelines.

## License

ISC
