# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HOWLING WOLF UI — a free online werewolf (人狼) game web application. This is the frontend; the backend API is at [howling-wolf-api](https://github.com/h-orito/howling-wolf-api).

**Current state**: Nuxt 2 (Vue 2) codebase on `feature/nuxt4` branch, undergoing migration to Nuxt 4 (Vue 3). See `migration-plan.md` for the full migration plan and `.claude/agents/implementer.md` for the migration workflow.

## Tech Stack (Current — Nuxt 2)

- **Framework**: Nuxt 2.14 (SPA mode, no SSR) + Vue 2
- **Language**: TypeScript with class-based components (`nuxt-property-decorator`)
- **State**: Vuex (modules: `auth`, `village`, `village-settings`)
- **UI**: Buefy (Bulma-based) + FontAwesome
- **Auth**: Firebase 8 (Twitter/Google sign-in)
- **HTTP**: `@nuxtjs/axios` (base URL via `HOWLING_WOLF_API_BASEURL` env var, default `http://localhost:8086/howling-wolf`)
- **Other**: Luxon, Chart.js, PWA, cookie-universal-nuxt, vue-scrollto

## Migration Target (Nuxt 4)

- Composition API (`<script setup>`) instead of class-based decorators
- Pinia instead of Vuex
- Tailwind CSS instead of Buefy/Bulma
- `$fetch` + composables instead of `@nuxtjs/axios`
- Firebase 12 + nuxt-vuefire
- Vite, pnpm, ESLint 9, Prettier 3
- Reference implementation: `.firewolf-ui/` (similar project already migrated)

## Commands

### Current (Nuxt 2, npm)
```bash
npm run dev        # Dev server at http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint (.ts, .js, .vue)
```

### Post-migration (Nuxt 4, pnpm)
```bash
pnpm dev           # Dev server at http://localhost:3011
pnpm build         # Production build
pnpm lint          # ESLint
pnpm lint --fix    # ESLint with auto-fix
pnpm format        # Prettier
pnpm type-check    # TypeScript check
```

No test suite exists on the Nuxt 2 side. Post-migration target includes Vitest + Playwright.

## Architecture

### Directory Layout
```
pages/              # 12 route pages (file-based routing)
layouts/            # default, village-layout, error
middleware/         # authenticated (Firebase), version, google-ads
plugins/            # axios (adds Firebase token), firebase, window-resize
store/              # Vuex root + modules/ (auth, village, village-settings)
  action-types.ts   # String constants for Vuex actions
components/
  village/          # Core game components (action/, message/, slider/, footer/, header/)
  index/            # Home page components
  rule/             # Rule display
  player-record/    # Player stats with charts
  common/           # Navbar, shared UI
  type/             # 80+ TypeScript interfaces (API response models, snake_case props)
  const/            # Game constants (consts.ts)
assets/sass/        # SCSS (howlingwolf.scss)
```

### Key Patterns
- **Village** is the core domain — `pages/village.vue` uses `layouts/village-layout.vue` and contains the most complex component tree (game actions, messages, voting, abilities)
- **Type definitions** in `components/type/` mirror backend API responses with **snake_case** property names
- **Vuex action types** are string constants in `store/action-types.ts`
- **Firebase auth** is initialized in `plugins/firebase.js`; auth tokens are injected into axios requests via `plugins/axios.js`
- Middleware runs on every route: auth state → version check → ad injection

## Code Style

- **Formatter**: Prettier — no semicolons, single quotes
- **Indent**: 2 spaces, UTF-8, LF line endings
- **Components**: Currently class-based (`@Component`, `@Prop` decorators); migrating to `<script setup>` Composition API
- **File naming**: kebab-case for files; PascalCase for component names (post-migration)
- **UI text/comments**: Japanese; code identifiers in English

### Post-migration Rules (from `.claude/rules/`)
- **`as any`, `as unknown`, `@ts-ignore`, `any` type, `// eslint-disable` are all prohibited**
- Store must be accessed through composables, never directly
- No `common`/`shared`/`general` directory names for components
- Components go in `ui/` (reusable), `layout/`, or `pages/[page-name]/` (page-specific)

## Development Workflow

- Branch naming: `feature/{description}` (include `#{issue-number}` if linked)
- Base branch: `develop`
- Before commit: `pnpm lint && pnpm format && pnpm type-check` (post-migration) or `npm run lint` (current)
- No emoji in commit messages
- Use `/prepare-commit` slash command for commit preparation
- Use `/review` slash command for code review via the reviewer agent

## Communication

- Respond to the user in Japanese
- Think in English
