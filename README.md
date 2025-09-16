# EHR Integration Platform

A comprehensive Electronic Health Record (EHR) integration platform built with modern TypeScript stack, featuring Epic FHIR API integration, patient management, appointment scheduling, and billing operations.

## 🚀 Features

### Core Technologies
- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Hono** - Lightweight, performant server framework
- **tRPC** - End-to-end type-safe APIs
- **Cloudflare Workers** - Runtime environment
- **Biome** - Linting and formatting
- **Husky** - Git hooks for code quality
- **Turborepo** - Optimized monorepo build system

### EHR Integration Features
- **Epic FHIR API Integration** - Connect with Epic's healthcare systems
- **Patient Management** - Create, search, and manage patient records
- **Appointment Scheduling** - Book, find, and manage appointments
- **Billing & Administrative** - Handle accounts and insurance coverage
- **Clinical Operations** - Access clinical notes and documents
- **Documentation** - Comprehensive API documentation with Fumadocs

### Added Packages & Libraries

#### Web Application (`apps/web`)
- `@tanstack/react-form` - Form management and validation
- `@tanstack/react-query` - Data fetching and caching
- `@trpc/tanstack-react-query` - tRPC integration with React Query
- `class-variance-authority` - Component variant utilities
- `clsx` - Conditional CSS classes
- `lucide-react` - Icon library
- `next-themes` - Theme management for Next.js
- `sonner` - Toast notifications
- `tailwind-merge` - Tailwind CSS class merging
- `tw-animate-css` - CSS animations
- `zod` - Schema validation
- `@opennextjs/cloudflare` - Cloudflare deployment for Next.js

#### Server Application (`apps/server`)
- `@hono/trpc-server` - tRPC server adapter for Hono
- `axios` - HTTP client for API requests
- `dotenv` - Environment variable management
- `hono` - Web framework
- `zod` - Schema validation

#### Documentation (`apps/fumadocs`)
- `fumadocs-ui` - Documentation UI components
- `fumadocs-core` - Core documentation functionality
- `fumadocs-mdx` - MDX processing for documentation

#### Shared Packages (`packages/axios`)
- `axios` - HTTP client with Epic FHIR configuration
- `dotenv` - Environment variable management

## 🏃 Getting Started

### Prerequisites
- Node.js 18+
- Bun runtime
- Epic FHIR API credentials

### Installation

First, install the dependencies:

```bash
bun install
```

### Environment Setup

1. Copy environment files:
```bash
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
cp packages/axios/.env.example packages/axios/.env
```

2. Configure your Epic FHIR API credentials in `packages/axios/.env`:
```env
EPIC_API_BASE_URL=https://your-epic-fhir-server.com/api/FHIR/R4/
EPIC_CLIENT_ID=your_client_id
EPIC_CLIENT_SECRET=your_client_secret
EPIC_TOKEN_URL=https://your-epic-fhir-server.com/oauth2/token
EPIC_AUTH_URL=https://your-epic-fhir-server.com/oauth2/authorize
```

### Development

Run all applications in development mode:

```bash
bun dev
```

This will start:
- **Server API** at [http://localhost:3000](http://localhost:3000)
- **Web Application** at [http://localhost:3001](http://localhost:3001)
- **Documentation** at [http://localhost:4000](http://localhost:4000)

### Individual Services

```bash
# Start only the web application
bun run dev:web

# Start only the server
bun run dev:server

# Start only the documentation
cd apps/fumadocs && bun dev
```





## 🚀 Deployment

### Cloudflare Deployment
- **Web Application**: `cd apps/web && bun deploy`
- **Server API**: `cd apps/server && bun deploy`
- **Documentation**: Deploy as static site to your preferred hosting

### Environment Variables for Production
Make sure to set the following in your Cloudflare Workers environment:
- `EPIC_API_BASE_URL`
- `EPIC_CLIENT_ID`
- `EPIC_CLIENT_SECRET`
- `EPIC_TOKEN_URL`
- `EPIC_AUTH_URL`

## 📚 API Documentation

Complete API documentation is available at [http://localhost:4000](http://localhost:4000) when running in development mode.

### Key Endpoints

#### Patient Management
- `POST /trpc/patient.createPatient` - Create new patient
- `GET /trpc/patient.getPatients` - Search patients
- `GET /trpc/patient.getPatient` - Get patient by ID

#### Appointment Scheduling
- `POST /trpc/appointment.bookAppointment` - Book appointment
- `POST /trpc/appointment.findAppointment` - Find appointments
- `GET /trpc/appointment.searchAppointment` - Search appointments

#### Billing & Administrative
- `GET /trpc/billing.billing.searchAccount` - Search accounts
- `GET /trpc/billing.coverage.searchCoverage` - Search coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `bun check` to ensure code quality
5. Submit a pull request

## 📄 License

This project is private and proprietary.


## 📁 Project Structure

```
ehr-integration/
├── apps/
│   ├── fumadocs/        # Documentation site (Fumadocs)
│   ├── server/          # Backend API (Hono, tRPC, Cloudflare Workers)
│   └── web/             # Frontend application (Next.js)
├── packages/
│   └── axios/           # Shared Axios configuration for Epic FHIR
├── docs/                # Generated documentation
├── biome.json           # Linting and formatting configuration
├── turbo.json           # Turborepo configuration
└── package.json         # Root package configuration
```

## 🛠️ Available Scripts

### Root Scripts
- `bun dev` - Start all applications in development mode
- `bun build` - Build all applications
- `bun check-types` - Check TypeScript types across all apps
- `bun check` - Run Biome formatting and linting
- `bun dev:web` - Start only the web application
- `bun dev:server` - Start only the server
- `bun dev:native` - Start native development mode

### Web Application Scripts (`apps/web`)
- `bun dev` - Start Next.js development server on port 3001
- `bun build` - Build for production
- `bun start` - Start production server
- `bun preview` - Preview Cloudflare deployment
- `bun deploy` - Deploy to Cloudflare
- `bun upload` - Upload to Cloudflare

### Server Scripts (`apps/server`)
- `bun dev` - Start Cloudflare Workers development server on port 3000
- `bun build` - Build for deployment
- `bun deploy` - Deploy to Cloudflare
- `bun check-types` - Check TypeScript types

### Documentation Scripts (`apps/fumadocs`)
- `bun dev` - Start documentation site on port 4000
- `bun build` - Build documentation
- `bun start` - Start production documentation server
