<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

### Project Overview

This is **Huh Blog** — a personal blogging platform built with Next.js 16 (App Router), TypeScript, ShadCN UI (base-nova style), Tailwind CSS v4, and Supabase (hosted). The database is already provisioned on Supabase project `vkzgfsrzckmvyyinoghk`.

### Development Commands

| Action | Command |
|--------|---------|
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Lint | `pnpm lint` |
| Start (prod) | `pnpm start` |

### Key Notes

- **Source structure**: Uses `src/` directory (`src/app/`, `src/components/`, `src/lib/`, `src/hooks/`).
- **Overlay filesystem**: The workspace uses an overlay filesystem. A prior scaffold left phantom files in `app/`, `components/`, `lib/`, `hooks/` at root (outside `src/`). The `tsconfig.json` scopes `include` to `src/**` to avoid type-checking those phantom files. Do NOT change the include glob back to `**/*.ts`/`**/*.tsx`.
- **Turbopack cache**: If you see `Persisting failed` errors in the dev server, clear `.next` and restart: `rm -rf .next && pnpm dev`.
- **ShadCN lint errors**: The ShadCN-generated `carousel.tsx` and `use-mobile.ts` have known `react-hooks/set-state-in-effect` lint errors. These are upstream issues, not introduced bugs.
- **Environment variables**: `.env.local` must exist with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, and `NEXT_PUBLIC_SITE_URL`. The Supabase URL and anon key are checked in (non-sensitive); the service role key and Resend key need to be provided as secrets.
- **Supabase**: The database is hosted (not local). Use the anon key for browser/public access, server client with cookies for authenticated server components, and service role key for admin operations.
- **Adding ShadCN components**: `pnpm dlx shadcn@latest add <component-name>` — the `components.json` is already configured for `src/`.
