# Route Map

## Public

| Route | State | Purpose |
| --- | --- | --- |
| `/` | Public | Product positioning and surface entry points. |
| `/apply` | Public | Real creator application form. |
| `/brands` | Public | Real brand briefing/lead form. |
| `/login` | Public | Password, Magic Link and Google OAuth entry. |
| `/auth/callback` | Public callback | Exchanges Supabase auth code and redirects by role. |

## Creator surface

Protected by `requireSurface('creator')`: `/app`, `/app/opportunities`, `/app/campaigns`, `/app/analytics`, `/app/earnings`, `/app/referrals`, `/app/profile`, `/app/notifications`.

Only layout, navigation and intentional empty states belong to Foundation. Campaign, payment, analytics and profile workflows are later modules.

## Brand surface

Protected by `requireSurface('brand')`: `/brand`, `/brand/campaigns`, `/brand/campaigns/new`, `/brand/creators`, `/brand/analytics`, `/brand/billing`, `/brand/settings`. `/brand/dashboard` redirects to `/brand`.

Only the Brand layout and route boundaries are implemented. Marketplace and campaign behavior are deliberately absent.

## Lucre Admin surface

Protected by `requireSurface('admin')`: `/admin`, `/admin/creators`, `/admin/brands`, `/admin/campaigns`, `/admin/content`, `/admin/finance`, `/admin/analytics`.

These routes establish the Control Center information architecture without claiming operational features are complete.

## API

| Endpoint | Method | Controls |
| --- | --- | --- |
| `/api/auth/login` | POST | Zod, persistent rate limit, profile status, role redirect, audit event. |
| `/api/auth/magic-link` | POST | Zod, persistent rate limit, Supabase OTP. |
| `/api/auth/oauth?provider=google` | GET | Provider allowlist and controlled callback. |
| `/api/auth/logout` | POST | Supabase session revocation. |
| `/api/applications` | POST | Zod, rate limit, server-only insert, audit event. |
| `/api/brand-leads` | POST | Zod, rate limit, server-only insert, audit event. |
