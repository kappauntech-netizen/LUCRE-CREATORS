# RBAC Matrix

Legend: **A** full administration, **M** scoped management, **S** self/tenant scope, **R** read/review, **—** denied.

| Role | Admin | Creators | Brands | Campaigns | Content | Payments | Referrals | Analytics | Roles/Audit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `SUPER_ADMIN` | A | A | A | A | A | A | A | A | A |
| `ADMIN` | A | A | A | A | A | A | A | A | Audit; no role promotion |
| `OPERATIONS` | M | M | M | M | R | — | M | R | — |
| `CREATOR_MANAGER` | M | M | R | R | R | — | M | R | — |
| `CAMPAIGN_MANAGER` | M | R | M | M | R | — | — | R | — |
| `FINANCE` | M | R | R | R | — | M | M | R | Audit read |
| `MODERATOR` | M | — | — | — | M | — | — | — | — |
| `CREATOR` | — | S | — | Apply/S | Submit | S | S | S | — |
| `BRAND` | — | Discovery | S | S | Review | — | — | S | — |

The executable source of truth is `features/auth/permissions.ts`. Surface authorization occurs in server layouts; row/resource authorization occurs through RLS and must also be checked by future mutation services.
