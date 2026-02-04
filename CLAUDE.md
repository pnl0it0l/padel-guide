# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Padel Guide is a Next.js 16 application that serves as a comprehensive resource directory for padel in Portugal. The application features:
- A curated link directory with filtering and search
- Tournament management system with bracket generation
- Google OAuth authentication via NextAuth.js
- PostgreSQL database via Supabase with Prisma ORM
- Server-side rendering with App Router
- Google AdSense integration

## Development Commands

### Installation
```bash
pnpm install
```

### Development Server
```bash
pnpm dev
# Opens at http://localhost:3000
```

### Build & Production
```bash
pnpm build
pnpm start
```

### Linting
```bash
pnpm lint
```

### Database Management
```bash
# Generate Prisma client (runs automatically on install via postinstall script)
npx prisma generate

# Create a new migration
npx prisma migrate dev --name <migration_name>

# Push schema changes without creating migration
npx prisma db push

# Open Prisma Studio to view/edit data
npx prisma studio

# Reset database (DESTRUCTIVE)
npx prisma migrate reset
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router, React 19)
- **Auth**: NextAuth.js v4 with Google OAuth provider
- **Database**: PostgreSQL (Supabase) with Prisma ORM
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm
- **React Compiler**: Enabled (babel-plugin-react-compiler)

### Directory Structure

**`app/`** - Next.js App Router pages and API routes
- `app/page.tsx` - Homepage with link directory
- `app/layout.tsx` - Root layout with AuthProvider
- `app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `app/api/tournaments/` - Tournament CRUD API endpoints
- `app/tournaments/` - Tournament management UI pages

**`components/`** - React components
- `AuthProvider.tsx` - NextAuth session provider wrapper
- `LoginButton.tsx` - Google OAuth sign in/out button
- `LinkCard.tsx` - Individual link card component
- `NewsSection.tsx` - RSS news feed component
- `AdBanner.tsx` - Google AdSense banner component

**`lib/`** - Shared utilities
- `db.ts` - Prisma client singleton (prevents multiple instances in dev)
- `tournament-logic.ts` - Tournament bracket generation algorithms (Fisher-Yates shuffle, playoff/group stage draw, round-robin, standings calculation, court allocation)

**`types/`** - TypeScript type definitions
- `tournament.ts` - Re-exports Prisma types and defines API input/response types
- `next-auth.d.ts` - NextAuth type extensions

**`prisma/`** - Database schema and migrations
- `schema.prisma` - Database schema (User, Tournament, Team, Match models)

**`data/`** - Static data
- `links.ts` - Link directory data for the homepage

### Database Schema

The application uses a multi-purpose schema:

**Authentication (NextAuth.js models)**:
- `User` - User accounts (linked via email)
- `Account` - OAuth provider accounts
- `Session` - User sessions
- `VerificationToken` - Email verification tokens

**Tournament Management**:
- `Tournament` - Tournament metadata (format, date, status, match format, courts)
  - Formats: `DIRECT_PLAYOFF` (bracket only), `GROUPS_PLAYOFF` (group stage → playoff)
  - Match formats: `BEST_OF_3`, `PRO_SET`, `TIMED`
  - Status: `DRAFT`, `ACTIVE`, `COMPLETED`
- `Team` - Pairs of players in a tournament
- `Match` - Individual matches with scores, court assignments, and timestamps

### Authentication Flow

The app uses **JWT-based sessions** (not database sessions) with Google OAuth:

1. User clicks "Sign in with Google" (`LoginButton.tsx`)
2. NextAuth redirects to Google OAuth consent screen
3. On success, NextAuth creates a JWT session token
4. Session includes user email and ID via JWT callbacks
5. API routes verify session and create/lookup User in database by email

**Important**: The tournament API routes (`app/api/tournaments/route.ts`) currently have authentication temporarily disabled for testing (see lines 15-21 and 68-73). Re-enable authentication before production deployment.

### Tournament System

The tournament management system supports two formats:

1. **Direct Playoff**: Random draw into single-elimination bracket
   - Uses `generatePlayoffDraw()` to shuffle and pair teams

2. **Groups + Playoff**: Round-robin groups followed by playoff bracket
   - Uses `generateGroupStageDraw()` to distribute teams evenly
   - Uses `generateRoundRobinMatches()` for all-vs-all within groups
   - Uses `calculateGroupStandings()` to rank teams by points and set difference

All match generation happens server-side in the POST `/api/tournaments` endpoint within a Prisma transaction to ensure data consistency.

### Path Aliases

The project uses `@/*` as an alias for the root directory:
```typescript
import { prisma } from "@/lib/db";
import { Tournament } from "@/types/tournament";
```

## Environment Variables

Required environment variables (create `.env.local` for development):

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://..."              # Connection pooling URL
DIRECT_URL="postgresql://..."                # Direct connection URL

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"         # App URL
NEXTAUTH_SECRET="your-secret-key"            # Generate: openssl rand -base64 32

# Google OAuth (Google Cloud Console)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

See `GOOGLE_AUTH_SETUP.md` for detailed Google OAuth setup instructions.
See `SUPABASE_SETUP.md` for Supabase database setup instructions.

## Key Implementation Notes

### Prisma Client Singleton
Always import Prisma from `lib/db.ts`, never create new PrismaClient instances directly. The singleton prevents "too many clients" errors in development.

### Authentication in API Routes
API routes should verify user session and lookup/create User in database:
```typescript
const session = await getServerSession();
if (!session?.user?.email) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
let user = await prisma.user.findUnique({
  where: { email: session.user.email }
});
```

### Tournament Creation Flow
Tournament creation is atomic via Prisma transactions:
1. Create Tournament record
2. Create Team records
3. Generate and create Match records based on format
4. Update Tournament status to ACTIVE
5. Return complete tournament with relations

If any step fails, the entire transaction rolls back.

### React Server Components
The App Router uses Server Components by default. Only use `"use client"` when:
- Using React hooks (useState, useEffect, etc.)
- Using browser APIs
- Using event handlers
- Using NextAuth useSession() hook

### Styling Patterns
The app uses a dark theme with:
- Background: black (`bg-black`)
- Cards: `bg-gray-900/80` with `border-gray-700/50`
- Primary accent: blue gradient (`from-blue-600 to-blue-500`)
- Glass effect: `backdrop-blur` with semi-transparent backgrounds
- Hover states: scale transforms and color transitions
