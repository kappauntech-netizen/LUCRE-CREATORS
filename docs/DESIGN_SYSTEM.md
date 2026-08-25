# Design System

## Principle

The interface is 80% neutral infrastructure and 20% Creator energy. It combines social familiarity with premium SaaS restraint; it does not imitate Instagram screens.

## Core tokens

| Token | Light | Dark |
| --- | --- | --- |
| `--bg` | `#FAFAFA` | `#050505` |
| `--surface-strong` | `#FFFFFF` | `#111112` |
| `--ink` | `#09090B` | `#FFFFFF` |
| `--muted` | `#67676F` | `#A1A1AA` |
| `--line` | 10% near-black | 10% white |

Creator gradient: violet → magenta → pink → orange → yellow. It is reserved for identity, emphasis, progress and selected states.

## Typography

Geist Sans is the interface/display family and Geist Mono is used for compact system labels. Headlines use tight tracking and strong weight; long body copy maintains readable line height. All major sizes use responsive `clamp()` rules.

## Brand asset

`public/lucre-logo.svg` contains the official Lucre vector supplied for the project. Only its viewBox was tightened to remove the original empty canvas; the path remains the official artwork. Theme-aware CSS renders it white in dark mode and black in light mode.

## Language system

The global selector supports `pt-BR`, `pt-PT`, `es`, `en`, `fr` and `it`. Portuguese is the canonical source language, so the PT-BR interface contains no English UI labels. Locale selection is persisted in local storage and a same-site cookie, and updates the document language for accessibility.

## Shape and depth

- Controls: 8–12px radius.
- Cards/panels: 16–24px radius.
- Prominent actions: pill or 12px radius according to context.
- Borders remain subtle; shadows communicate hierarchy, not decoration.

## Motion

Motion uses transform/opacity where possible. Feedback is restrained, and `prefers-reduced-motion` disables decorative animation. Loading uses skeletons; long-running feedback uses Sonner toasts and status primitives.

## Responsive behavior

- Creator and Brand mobile surfaces use fixed app-like navigation.
- Admin is desktop-first and collapses into the same safe mobile shell.
- Tables are horizontally contained; forms collapse to one column.
- Safe-area insets are respected by bottom navigation/drawers.
- Icons remain Lucide vectors on every breakpoint; no emoji substitution.

## Accessibility

Interactive primitives use Radix semantics, visible focus boundaries, descriptive labels and sufficient target sizes. Theme is applied before hydration to prevent visual flash.
