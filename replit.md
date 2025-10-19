# Persiana CMS & E-commerce Website

## Overview

This is a full-stack Content Management System (CMS) and e-commerce website for a premium blinds ("persianas") company. The application features a dual-interface design: a customer-facing e-commerce frontend and an administrative backend for managing products, categories, pages, and users.

The system is built with React (frontend), Express.js (backend), PostgreSQL (database via Neon), and implements session-based authentication for secure admin access.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management

**UI Component System:**
- Shadcn/ui component library (Radix UI primitives with Tailwind styling)
- "New York" style variant configured
- Tailwind CSS for styling with custom design tokens
- CSS variables for theming (light/dark mode support)

**Design Philosophy:**
- Dual design strategy:
  - **Admin Panel** (`/admin/*`): Material Design System optimized for productivity
  - **E-commerce Frontend**: Reference-based approach inspired by modern home decor sites (Wayfair, Build.com)
- Typography: Playfair Display (headings), Inter (body), Montserrat (CTAs)
- Custom color palette with sophisticated blue-gray primary and warm terracotta accents
- Responsive grid system (1-4 columns depending on viewport)

**State Management:**
- TanStack Query for all API data fetching with aggressive caching (staleTime: Infinity)
- React hooks for local component state
- Session-based authentication state synchronized with backend

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- Session-based authentication using `express-session`
- PostgreSQL session store (`connect-pg-simple`)
- bcrypt for password hashing

**API Design:**
- RESTful API endpoints under `/api/*`
- Resource-based routes for CRUD operations:
  - `/api/categories` - Category management
  - `/api/products` - Product management
  - `/api/pages` - CMS page management
  - `/api/users` - User management
  - `/api/auth/*` - Authentication endpoints
- Middleware for authentication (`requireAuth`) and authorization (`requireAdmin`)

**File Upload System:**
- Multer for handling multipart/form-data
- Sharp for image processing and optimization
- Multiple image variants generated per upload:
  - Large version (1200x1200px) for detail views
  - Thumbnail version (400x400px) for listings
- WebP format for optimized file sizes
- Images stored in `/uploads/products` directory
- 5MB file size limit, restricted to JPEG/PNG/WebP formats

**Development Features:**
- Hot Module Replacement (HMR) via Vite
- Replit-specific plugins for development (cartographer, dev-banner, error overlay)
- Environment variable support via dotenv (local) or Replit Secrets (production)

### Data Storage

**Database:**
- PostgreSQL (via Neon serverless)
- Drizzle ORM for type-safe database access
- WebSocket connection support for Neon serverless

**Schema Design:**
- **Categories Table**: Product categorization (Blackout, Rolô, Vertical, Horizontal)
  - UUID primary keys
  - Unique slug for URL-friendly identifiers
  - Optional description and image
- **Products Table**: Product catalog
  - References categories via foreign key
  - Array of image URLs
  - JSONB field for flexible specifications
  - Boolean flags for `featured` and `active` status
  - Numeric price field (10,2 precision)
- **Pages Table**: CMS content pages
  - Unique slug for routing
  - WYSIWYG content field
  - Meta description for SEO
  - Published status flag
- **Users Table**: Admin/editor accounts
  - Role-based access control (admin/editor enum)
  - Hashed passwords
  - Active status flag
  - Unique username and email constraints
- **Session Table**: Auto-created by connect-pg-simple for session persistence

**Data Access Layer:**
- Storage interface (`IStorage`) abstracts database operations
- Consistent CRUD methods across all entities
- UUID generation for all primary keys
- Timestamp tracking (createdAt, updatedAt)

### Authentication & Authorization

**Authentication Flow:**
- Session-based authentication (no JWT)
- 30-day session duration
- httpOnly cookies for security
- Secure cookie flag in production
- Password verification via bcrypt comparison

**Authorization Levels:**
- **Admin**: Full access to all resources and user management
- **Editor**: Content management access (products, categories, pages)
- Role-based middleware (`requireAdmin`, `requireAuth`) enforces permissions

**Protected Routes:**
- All `/admin/*` routes require authentication
- User management endpoints require admin role
- Frontend e-commerce routes are public

### External Dependencies

**Core Infrastructure:**
- **Neon Database**: Serverless PostgreSQL hosting
  - WebSocket-based connection pooling
  - Automatic scaling
  - Connection via `@neondatabase/serverless`

**Image Processing:**
- **Sharp**: High-performance image manipulation
  - Resizing and optimization
  - Format conversion to WebP
  - Automatic aspect ratio handling

**UI Component Libraries:**
- **Radix UI**: Unstyled, accessible component primitives
  - 20+ component primitives (Dialog, Dropdown, Select, etc.)
  - Full keyboard navigation support
  - ARIA compliant
- **Tailwind CSS**: Utility-first CSS framework
  - Custom configuration with design system tokens
  - Dark mode support via class strategy

**Form Handling:**
- **React Hook Form**: Form state management
- **Zod**: Schema validation (via `drizzle-zod` integration)
- **@hookform/resolvers**: Zod resolver for React Hook Form

**Fonts:**
- **Google Fonts**: Playfair Display, Inter, Montserrat
  - Preconnected for performance
  - Subset loaded (400, 500, 600, 700 weights)

**Development Tools:**
- **Drizzle Kit**: Database migrations and schema management
- **esbuild**: Fast bundling for production server code
- **tsx**: TypeScript execution for development server