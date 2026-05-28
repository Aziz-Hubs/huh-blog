# zee-blog

A minimal, Supabase-backed blog for Zee: programming notes, cybersecurity thinking, AI experiments, and subtle procrastinator humor.

## Phased build plan

1. **Foundation** - Next.js, ShadCN preset/components, theming, Supabase clients, environment validation, app shell.
2. **Public reading** - home, blog index, post detail, markdown rendering, tags, search, RSS, sitemap, robots, SEO metadata.
3. **Auth and owner dashboard** - login/register/callback, owner guard, dashboard overview, posts, editor, tags, media, comments, notifications, settings.
4. **Community** - profiles, comments, replies, reactions/bookmarks, notification surfaces, email outbox processing.
5. **Verification and polish** - build/lint, browser walkthrough, screenshots, responsive/accessibility checks, and fixes.

## Environment

Copy `.env.example` to `.env.local` and fill the Supabase and Resend values. The app uses the existing Supabase schema described in `BLOG_PRODUCT_BUILD_PLAN.md` and falls back to demo content when public Supabase variables are missing so the UI can still be reviewed locally.

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```
