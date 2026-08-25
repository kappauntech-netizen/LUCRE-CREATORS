# Component Map

## Brand and theming

- `BrandLockup`: canonical LUCRE / CREATORS wordmark treatment.
- `ThemeProvider` and `ThemeToggle`: persisted dark/light preference with system fallback.
- `CreatorGradient`: controlled gradient fill, text or border treatment.
- `LucreBadge`: verified/elite/status identity marker.
- `CreatorScore`: accessible compact score visualization.

## Public acquisition

- `PublicHeader`, `PublicFooter`: public layout.
- `CreatorApplicationForm`: validated multi-step creator intake.
- `BrandLeadForm`: validated commercial briefing.
- `LoginForm`: password, Magic Link, Google OAuth and preview-safe states.

## Product surfaces

- `DashboardShell`: shared shell parameterized by `creator`, `brand` or `admin`.
- `WorkspacePage`: consistent page heading and intentional Foundation state.
- `MetricCard`: no fabricated metrics; accepts only supplied real/state values.
- `EmptyState`: reusable, honest zero-state.

## UI primitives

`Button`, `Card`, `Badge`, `Input`, `Textarea`, `Select`, `Avatar`, `Dialog`, `Drawer`, `DropdownMenu`, `Tabs`, `Progress`, `Status`, `Skeleton`, `Table`, `SearchField`, `FilterBar`, `Toaster`.

Interactive primitives use Radix where behavior and accessibility matter. Icons come from Lucide; no emoji is used as product iconography. All visual values inherit global tokens rather than screen-specific colors.
