<div align="center">
  <img src="./public/GolfCares.png" alt="GolfCares Logo" width="300" />
  <br />
  <img src="./public/Favicon.png" alt="GolfCares Favicon" width="64" />
</div>

# GolfCares Frontend

A React-based frontend application for the GolfCares lottery platform, built with Vite and TypeScript for an optimal development experience and high performance.

## Overview

This is a modern, type-safe React application providing a user interface for lottery ticket purchasing, charity discovery, draw participation, and admin dashboard functionality. The application uses Vite for fast development and build times, and integrates seamlessly with the GolfCares backend API.

## Technology Stack

- **React 19.2.4** - UI library
- **Vite 5+** - Build tool and development server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Shadcn UI** - Component library
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **TanStack React Query** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client
- **Stripe** - Payment processing
- **Zod** - Schema validation
- **Framer Motion** - Animations
- **Lucide React** - Iconography

## Project Structure

```text
src/
├── api/                    # Axios instances and API clients
│   ├── axios.ts            # Configured Axios client
│   ├── auth.api.ts         # Authentication endpoints
│   ├── charity.api.ts      # Charity endpoints
│   ├── draw.api.ts         # Draw endpoints
│   ├── subscription.api.ts # Subscription endpoints
│   └── ...
├── components/
│   ├── layout/             # Layout components (Navbar, Footer)
│   ├── shared/             # Reusable components
│   │   ├── ProtectedRoute.tsx
│   │   ├── AdminRoute.tsx
│   │   ├── PageWrapper.tsx
│   │   └── ...
│   └── ui/                 # Shadcn UI components
├── pages/                  # Page components
│   ├── dashboard/          # User dashboard pages
│   ├── admin/              # Admin pages
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   └── ...
├── store/                  # Zustand stores
│   └── authStore.ts        # Authentication state
├── lib/                    # Utility functions
│   └── utils.ts
├── mocks/                  # Mock data for development
│   └── mockData.ts
├── App.tsx                 # Root component
└── main.tsx                # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start on `http://localhost:5173`. Vite provides Hot Module Replacement (HMR) for instant updates during development.

### Building for Production

```bash
npm run build
```

Creates an optimized production build in the `dist/` directory.

### Linting

```bash
npm run lint
```

Runs ESLint to check code quality and consistency.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

## Key Features

### Authentication
- User registration and login
- JWT-based session management
- Protected routes for authenticated users
- Admin role-based access control

### User Dashboard
- View owned lottery tickets
- Check winnings and scores
- Manage account settings
- View charity contributions

### Lottery Management
- Browse available draws
- Purchase lottery tickets with Stripe integration
- View draw schedules and results
- Track personal participation and scores

### Charity Pages
- Discover partner charities
- View charity details and impact
- Support charities through lottery participation

### Admin Dashboard
- Manage lottery draws
- User management
- Charity administration
- Winner tracking and management
- Platform statistics and analytics

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### Component Configuration

The UI component library is configured via `components.json` for Shadcn components. Add new components using the CLI:

```bash
npx shadcn@latest add component-name
```

## Development Best Practices

### Component Design
- Use TypeScript for all components
- Leverage Shadcn UI components for visual consistency
- Use React Hook Form for robust form handling
- Implement Zod schemas for form and API response validation

### API Integration
- Use custom hooks from `@tanstack/react-query` for data fetching
- Centralize API calls in the `/api` folder
- Use Axios request/response interceptors for auth headers

### State Management
- Use Zustand for persistent client state (auth, user preferences)
- Use React Query for server state (draws, charities, user data)
- Keep component state local when global access is unnecessary

### Styling
- Use Tailwind CSS utility classes uniformly
- Maintain consistent spacing and sizing according to the defined theme
- Override Shadcn component styles via Tailwind extending classes

## Performance Optimization

- Code splitting via React Router lazy loading
- Image optimization
- React.lazy for component-level code splitting
- Memoization for expensive computations
- React Query caching strategies

## Type Safety

All TypeScript files must include proper type definitions. Avoid using the `any` type aggressively. Rely on Zod for runtime validation of API responses to ensure type consistency at the integration boundary.

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port. Check the terminal output for the correct local URL.

### CORS Errors
Ensure the backend is running and `VITE_API_BASE_URL` is correctly configured to match the backend origin.

### Build Errors
Clear the build cache and reinstall modules if persistent errors occur:
```bash
rm -rf dist node_modules
npm install
npm run build
```
