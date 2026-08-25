# Authentication Flow

## Entry methods

1. The user opens `/login` and chooses password, Magic Link or Google.
2. Password credentials are sent to `/api/auth/login`; the admin alias `lucre` is resolved server-side to `ADMIN_LOGIN_EMAIL`.
3. Magic Link is requested through `/api/auth/magic-link`.
4. Google OAuth is initiated through `/api/auth/oauth?provider=google`.
5. Magic Link/OAuth return to `/auth/callback`, where Supabase exchanges the authorization code.

## Session and routing

Supabase SSR writes secure session cookies. The server loads:

```text
auth.users
   ↓
profiles (role + status)
   ↓
organization_memberships (active tenant)
   ↓
requireSurface(surface)
```

The home destination is role-derived:

- Lucre team → `/admin`
- Brand → `/brand`
- Creator → `/app`

Inactive or missing profiles are denied. A logged-in user cannot obtain access merely by typing another surface URL.

## Configuration

- Enable Email/Password, Magic Link and Google in Supabase Auth.
- Add local and production URLs to Supabase redirect allowlists.
- Set `NEXT_PUBLIC_SITE_URL` to the active origin.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
- Seed the initial administrator only after migrations `0001`–`0003`.

## Security properties

- Persistent rate limiting before password and public-form processing.
- Generic credential errors avoid account enumeration.
- Server-side status and role verification.
- RLS remains the second authorization boundary.
- Successful password logins are written to the immutable audit trail.
- The exposed planning password is intentionally not embedded anywhere; deployment requires a new secret.
