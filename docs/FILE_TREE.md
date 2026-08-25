# File Tree

```text
lucre-creators/
├── app/
│   ├── (public pages)        /, /apply, /brands, /login
│   ├── app/                  Creator surface and protected layout
│   ├── brand/                Brand surface and protected layout
│   ├── admin/                Lucre surface and protected layout
│   ├── api/                  Auth, creator application and brand lead endpoints
│   ├── auth/callback/        Supabase OAuth/Magic Link callback
│   ├── globals.css           Tokens, layouts, primitives and responsive rules
│   └── layout.tsx            Root providers, metadata and toaster
├── components/
│   ├── dashboard/            Shared SaaS shell, metric and workspace states
│   ├── forms/                Login, creator application and brand lead forms
│   ├── public/               Public navigation and footer
│   └── ui/                   Reusable Radix/shadcn-style primitives
├── config/                   Environment validation, product and navigation maps
├── features/
│   ├── applications/         Creator application schema and service
│   ├── auth/                 RBAC permissions and route guard
│   └── brands/               Brand lead schema and service
├── lib/
│   ├── auth/                 Session context
│   ├── supabase/             Browser/server clients
│   └── roles.ts              Canonical role types
├── services/
│   ├── security/             Audit, rate limit and plain-text sanitation
│   └── supabase/             Server-only admin client
├── supabase/migrations/
│   ├── 0001_foundation.sql
│   ├── 0002_platform_foundation.sql
│   └── 0003_storage_security.sql
├── scripts/seed-admin.mjs    Secure first-admin and Lucre tenant bootstrap
├── docs/                     Architecture handoff and validation documents
├── .env.example              Public/server environment contract
└── .openai/hosting.json      Codex Sites preview configuration
```

The platform is organized by product surface at the route layer and by business domain below it. Advanced modules must add their server behavior inside `features/` or `services/`, not inside page components.
