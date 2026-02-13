# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HOWLING WOLF UI — a free online werewolf (人狼) game web application. This is the frontend; the backend API is at [howling-wolf-api](https://github.com/h-orito/howling-wolf-api).

**Current state**: Nuxt 4 (Vue 3) project on `feature/nuxt4` branch, migrating from Nuxt 2. See `migration-plan.md` for the full migration plan and `.claude/agents/implementer.md` for the migration workflow. Old Nuxt 2 code is preserved in `.old-nuxt2/` for reference.

## Tech Stack

- **Framework**: Nuxt 4.x (SPA mode, no SSR) + Vue 3
- **Language**: TypeScript with Composition API (`<script setup>`)
- **State**: Pinia
- **UI**: Tailwind CSS v4
- **Auth**: Firebase 12 + nuxt-vuefire
- **HTTP**: `$fetch` + composables (base URL via `NUXT_PUBLIC_API_BASE_URL`, default `http://localhost:8086/howling-wolf`)
- **Icons**: @heroicons/vue
- **Validation**: vee-validate + yup
- **Build**: Vite, pnpm
- **Reference implementation**: `.firewolf-ui/` (similar project already migrated)

## Commands

```bash
pnpm dev           # Dev server at http://localhost:3000
pnpm build         # Production build
pnpm lint          # ESLint
pnpm lint --fix    # ESLint with auto-fix
pnpm format        # Prettier
pnpm type-check    # TypeScript check
pnpm test          # Vitest unit tests
pnpm test:e2e      # Playwright E2E tests
```

## Architecture

### Directory Layout (Nuxt 4)

```
app/
  pages/            # Route pages (file-based routing)
  layouts/          # default, village
  components/
    ui/             # Reusable UI components (form/, button/, modal/, feedback/, etc.)
    layout/         # Layout components (NavBar, GoogleAds, etc.)
    pages/          # Page-specific components (village/, index/, rule/, etc.)
  composables/      # Vue composables
  stores/           # Pinia stores
  lib/
    firebase/       # Firebase auth
    api/            # API types (OpenAPI auto-generated)
  plugins/          # Nuxt plugins
  middleware/        # Route middleware
  assets/css/       # Tailwind CSS
.old-nuxt2/         # Preserved Nuxt 2 code for migration reference
```

### Key Patterns

- **Village** is the core domain — the most complex page with game actions, messages, voting, abilities
- **API types** will be auto-generated from OpenAPI spec via `pnpm generate:api-types`
- **Environment variables**: `NUXT_PUBLIC_*` format (e.g., `NUXT_PUBLIC_FIREBASE_API_KEY`)
- **No `common`/`shared`/`general` directories** — components are organized by function

## Code Style

- **Formatter**: Prettier — no semicolons, single quotes, no trailing commas
- **Indent**: 2 spaces, UTF-8, LF line endings
- **Components**: `<script setup>` Composition API, PascalCase file names
- **UI text/comments**: Japanese; code identifiers in English

### Strict Rules (from `.claude/rules/`)

- **`as any`, `as unknown`, `@ts-ignore`, `any` type, `// eslint-disable` are all prohibited** in `app/**/*.{ts,vue}`
- Store must be accessed through composables, never directly
- Components go in `ui/` (reusable), `layout/`, or `pages/[page-name]/` (page-specific)

## Development Workflow

1. **実装**:
   1. 指定されたタスクを `implementer` で実施
   2. 実装できたら、`/reviewer` でレビューし、指摘事項がある場合、再度 `implementer` に修正させる
   3. タスクが完了したら、ユーザーに確認を依頼

2. **品質チェック**:
   1. `doc/guidelines` の開発ガイドラインに沿っているか確認
   2. **commit 前に必ず実行**: `pnpm lint && pnpm format && pnpm type-check`

3. **コミット**:
   1. ユーザーの承認を得てから、適切な粒度でコミット
      1. **commit message に絵文字を使用しない**

## Communication

- Respond to the user in Japanese
- Think in English
