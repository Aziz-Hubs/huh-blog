<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

### Project overview

Huh Blog is a calm, minimal one-person blog built with Next.js 16 (App Router + Turbopack), TypeScript, ShadCN UI (base-nova style), Tailwind CSS v4, and Supabase (Auth, DB, Storage). The full product spec lives in `BLOG_PRODUCT_BUILD_PLAN.md`.

### Key commands

| Task | Command |
|------|---------|
| Dev server | `pnpm dev` (runs on port 3000 with Turbopack) |
| Lint | `pnpm lint` |
| Type check | `pnpm typecheck` |
| Build | `pnpm build` |
| Format | `pnpm format` |

### Supabase

- Remote project ID: `vkzgfsrzckmvyyinoghk`
- URL: `https://vkzgfsrzckmvyyinoghk.supabase.co`
- Client helpers are in `lib/supabase/` (`browser.ts`, `server.ts`, `admin.ts`, `middleware.ts`).
- The anon/publishable key and URL are in `.env.local` (not committed). The service-role key must be provided as a secret for server-side privileged operations.

### Environment variables

`.env.local` is required for development. It must contain at minimum:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (default: `http://localhost:3000`)

`SUPABASE_SERVICE_ROLE_KEY` is needed for admin operations (user deletion, outbox processing).

### Gotchas

- **Next.js 16 middleware deprecation**: The `middleware.ts` convention is deprecated in favor of `proxy`. The current setup still uses `middleware.ts` for Supabase session refresh. The deprecation warning is benign and can be ignored until the project migrates to the `proxy` convention.
- **ShadCN generated code lint**: The eslint config disables `react-hooks/set-state-in-effect` for `components/ui/` and `hooks/` dirs because ShadCN-generated components trigger this rule.
- **Calendar component**: Has a `@ts-expect-error` for a `table` classname property not in react-day-picker v10 types. This is a known shadcn/react-day-picker compatibility issue.
- **pnpm build scripts warning**: pnpm may warn about ignored build scripts for `msw`. This is benign.
