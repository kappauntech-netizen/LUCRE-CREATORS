# Architecture

```text
Public Web ─┬─ Creator application ─┐
            └─ Brand lead ──────────┤
                                    ▼
Creator App ─┬──── Next.js API / Server ─────── Supabase Auth + PostgreSQL
Brand App ───┤                │                              │
Lucre Admin ─┘                └─ RBAC + audit + rate limit ──┴─ Storage + RLS
```

## Fronteiras

- `app/`: rotas Next.js e superfícies do produto.
- `components/public`: experiência de aquisição.
- `components/forms`: candidatura, marca e login.
- `components/dashboard`: shell compartilhado entre Creator, Brand e Admin.
- `components/ui`: primitives consistentes com o padrão shadcn/ui.
- `features/`: regras por domínio, validação e autorização.
- `services/`: integrações server-only e controles de segurança.
- `lib/auth`: sessão e autorização.
- `lib/supabase`: clientes browser/server e configuração.
- `supabase/migrations`: schema multi-tenant, indexes, RLS, Storage e triggers auditáveis.
- `scripts/seed-admin.mjs`: bootstrap seguro do primeiro administrador.

## Princípios

1. Dados reais ou estado vazio — nunca números fictícios.
2. Autorização sempre no servidor e RLS como segunda barreira.
3. Service role somente no servidor.
4. Creator mobile-first; Admin desktop-first com fallback mobile.
5. 80% interface neutra e 20% energia Creator.
6. Componentes e tokens antes de telas isoladas.
