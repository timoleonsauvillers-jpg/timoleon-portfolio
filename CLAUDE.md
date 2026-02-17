# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio website for Timoléon Sauvillers, a Motion Designer & Graveur (engraver) based in Paris. French-language site (`lang="fr"`, locale `fr_FR`).

## Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm start` — Serve production build

## Architecture

**Next.js 14 App Router** with TypeScript, Tailwind CSS, and Framer Motion.

### Server/Client Component Split

Every page follows the same pattern: the **page file is a server component** that fetches data and passes it to a `*Client` component that handles all interactivity. Example:
- `src/app/work/page.tsx` (server) → `src/components/WorkClient.tsx` (client, `'use client'`)
- `src/app/shop/page.tsx` (server) → `src/components/ShopClient.tsx` (client)

All client components are barrel-exported from `src/components/index.ts`.

### Current State: Placeholder Data

Sanity CMS and Shopify are **not yet integrated**. All pages use hardcoded placeholder data inline in the page files. The `src/lib/` directory (for Sanity client, Shopify client, query helpers) does not exist yet. Data fetching TODOs are marked in each page file.

### Data Flow (planned)

- **Projects** (portfolio work): Sanity CMS → `src/types/index.ts:Project`
- **Products** (shop): Sanity CMS for content + Shopify Storefront API for checkout → `src/types/index.ts:Product`
- **About content**: Sanity CMS → `src/types/index.ts:AboutContent`

### Project Categories

Four fixed categories defined in `src/types/index.ts`: `motion`, `print`, `identite`, `bac-a-sable`.

## Design System (Tailwind)

- **Font**: Sora (Google Fonts, loaded via `next/font`)
- **Colors**: `background: #FAFAFA`, `foreground: #1A1A1A`, `muted: #9A9A9A`, `border: #E5E5E5`
- **Spacing tokens**: `nav-height: 35px`, `footer-height: 30px`
- **Custom easing**: `ease-smooth` (cubic-bezier 0.4,0,0.2,1), `ease-snap` (cubic-bezier 0.16,1,0.3,1)
- **Custom font sizes**: `text-nav`, `text-body`, `text-project-title`, `text-project-number`, `text-heading`
- Grid/content padding: `px-4` (consistent across nav, grid, footer)

## Key Patterns

- Path alias: `@/*` maps to `./src/*`
- Animations: Framer Motion throughout — `motion.*` elements with `initial`/`animate`/`exit` props
- Layout: Fixed nav + fixed footer; pages use `pt-nav-height pb-footer-height`
- Home page uses `fixed inset-0` positioning with infinite vertical scroll + parallax effect
- Grids: Work and Shop pages use CSS `columns-*` masonry layout (not CSS Grid)
- Images: Currently `<img>` tags with Unsplash placeholders; will switch to `next/image` with Sanity/Shopify remote patterns (already configured in `next.config.js`)

## Page-specific Notes

### Home
- Project list positioned at 2nd quarter (25% from left)
- Images aligned right with parallax effect
- Active image: 50vw × 65vh, color
- Inactive images: 30vw × 40vh, grayscale, opacity-40
- Infinite scroll loop (3x array)
- Only featured projects from Home link to project pages

### Work
- Presentation only — no links on images
- Users access project pages only through Home
- Filters: Tout, Motion, Print, Identité, Bac à sable
- Masonry grid, full width

### Shop
- Grid aligned top
- Only prices shown (no titles)
- Prices gray, black on hover
- Links to product pages

### About
- Full-bleed portrait image background
- Content positioned at 2nd quarter left
- Single page, no scroll

### Project Pages
- Only accessible from Home (featured projects)
- Minimal info: context, role, year, link
- Gallery images below

## Environment Variables

See `.env.example`. Required for CMS/shop integration:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`
- `NEXT_PUBLIC_SHOPIFY_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `NEXT_PUBLIC_SITE_URL`
