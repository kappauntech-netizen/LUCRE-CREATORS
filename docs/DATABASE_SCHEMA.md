# Database Schema

Supabase PostgreSQL is the source of truth. Apply migrations in numeric order.

## Identity and tenancy

| Table | Purpose |
| --- | --- |
| `profiles` | Application identity linked 1:1 to `auth.users`, global role and status. |
| `organizations` | Lucre and brand tenants. |
| `organization_memberships` | User-to-tenant membership and tenant-level role. |
| `social_oauth_connections` | Encrypted-reference metadata for future social integrations. |

## Creator network

`creator_applications`, `creators`, `creator_social_accounts`, `creator_metrics`, `creator_categories`, `creator_category_assignments`, `creator_scores`, `media_assets`.

The application is separate from the approved creator record. Metrics are time-based snapshots and scores are versioned calculations, preserving history.

## Brands and commercial operation

`brands`, `brand_contacts`, `brand_leads`, `campaigns`, `campaign_requirements`, `campaign_applications`, `campaign_assignments`, `campaign_deliverables`, `content_submissions`, `content_reviews`, `contracts`, `payments`.

Brand-owned records carry `organization_id` where applicable. Foreign keys, status constraints and indexes support resource authorization and operational queries.

## Matching and network loops

`matching_rules`, `matching_runs`, `matching_results`, `referrals`, `referral_events`.

The schema stores explainable rule-based matches before any AI layer. Referral events preserve the conversion trail without implementing multi-level compensation.

## Retention surfaces

`community_posts`, `community_comments`, `community_likes`, `academy_courses`, `academy_lessons`, `academy_progress`, `badges`, `creator_badges`, `notifications`, `conversations`, `conversation_participants`, `messages`.

These are schema-ready only. Community, Academy and messaging behavior are not implemented in Foundation.

## Platform operations

`analytics_events`, `audit_logs`, `webhook_endpoints`, `webhook_events`, `rate_limits`.

- `audit_logs` is append-only: migration `0002` blocks update/delete.
- `rate_limits` is consumed atomically by `consume_rate_limit`.
- Webhook secrets are represented by hashes, never raw secrets.
- Public form writes happen through server routes using the service role.

## Storage

Migration `0003` creates private-by-default buckets and RLS policies:

| Bucket | Access model |
| --- | --- |
| `avatars` | Owner writes; public reads intended profile assets. |
| `creator-content` | Creator owner and authorized Lucre team. |
| `brand-assets` | Active members of the owning organization and Lucre team. |
| `contracts` | Server-mediated delivery; organization members and Lucre team can read approved paths. |
| `media-kits` | Owner writes; generated kits are publicly readable for sharing. |

## RLS invariants

- A creator reads and updates only their own profile/resources unless a policy explicitly exposes public discovery data.
- A brand member accesses only rows linked to an active organization membership.
- Lucre roles are authorized through `current_app_role()` and permission-aware server guards.
- The service-role key exists only in server-only modules.
- Cross-tenant authorization is enforced in PostgreSQL even if a UI check is bypassed.
