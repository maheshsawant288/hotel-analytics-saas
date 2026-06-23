@AGENTS.md

# HotelLens — Project Context for Claude

## What this is
HotelLens is a B2B SaaS dashboard for independent hotel owners in India to track revenue analytics, occupancy, and channel performance. Target users: 2–5 star hotels, 20–200 rooms.

## Tech Stack
- **Framework**: Next.js 14 with App Router (`/src/app`)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase (PostgreSQL + Row Level Security)
- **Charts**: Recharts
- **UI Components**: Shadcn/ui (built on Radix UI)
- **Payments**: Razorpay (INR subscriptions)
- **CSV parsing**: PapaParse

## Project Structure
```
src/
  app/
    dashboard/        — main KPI dashboard (protected route)
    upload/           — CSV booking data upload
    settings/         — account & billing settings
    auth/             — login / signup
    api/
      kpis/           — KPI calculation endpoints
      upload/         — CSV processing endpoints
      webhooks/       — Razorpay webhook handler
  components/
    charts/           — all Recharts visualisation components
    dashboard/        — dashboard layout & widgets
    upload/           — file upload UI
    ui/               — shared Shadcn/Radix components
  lib/
    supabase.ts       — Supabase client (anon key, client-side)
    kpi-calculations.ts — pure KPI formula functions
    csv-parser.ts     — PapaParse wrapper with validation
  types/
    index.ts          — all shared TypeScript interfaces
```

## Core Domain Types
See `src/types/index.ts` for full definitions:
- `Hotel` — property owned by a user
- `Booking` — individual room booking with channel, rate, status
- `Room` — room within a hotel
- `KPIData` — pre-computed daily KPI snapshot
- `Channel` — OTA/direct booking source
- `BookingStatus` — lifecycle state of a booking

## Key KPIs
All formulas live in `src/lib/kpi-calculations.ts`:
- **Occupancy Rate** = rooms_occupied / rooms_available × 100
- **ADR** (Average Daily Rate) = total_room_revenue / rooms_occupied
- **RevPAR** (Revenue Per Available Room) = total_room_revenue / rooms_available
- **Cancellation Rate** = cancellations / total_bookings × 100
- **Net Revenue** = gross_revenue × (1 − commission_rate)

## Channel Commission Rates
| Channel       | Commission |
|---------------|-----------|
| direct        | 0%        |
| walk_in       | 0%        |
| booking_com   | 18%       |
| agoda         | 18%       |
| goibibo       | 18%       |
| makemytrip    | 20%       |
| expedia       | 20%       |

## Env Variables
Copy `.env.local.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase project settings
- `SUPABASE_SERVICE_ROLE_KEY` — for server-side admin operations
- `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` — from Razorpay dashboard
- `NEXT_PUBLIC_APP_URL` — base URL (localhost in dev, domain in prod)

## Auth Model
- Supabase Auth (email/password + magic link)
- All hotel data is scoped to `owner_id` matching `auth.uid()`
- Row Level Security enforced at DB level

## Billing
- Razorpay Subscriptions in INR
- Webhook at `/api/webhooks` updates subscription status in Supabase
- Free tier: 1 hotel, 90 days of data
- Paid tier: unlimited hotels, full history

## Coding Conventions
- No `any` types — use proper interfaces from `src/types/index.ts`
- All API routes return `{ data, error }` shape
- Server Components by default; add `'use client'` only when needed
- KPI functions are pure and unit-testable — keep them free of I/O
- Currency always in INR (₹), formatted with `Intl.NumberFormat('en-IN')`
