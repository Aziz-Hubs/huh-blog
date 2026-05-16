# Huh Blog Product and Technical Build Plan

## Purpose

This document tells the application developers what to build now that the Supabase database foundation exists.

The product is a simple, thoughtful, one-person blog for publishing technical notes, personal writing, and general thoughts. It must feel calm, fast, readable, and personal. It should avoid the heaviness of a social network or enterprise CMS while still supporting modern blog expectations: drafts, scheduling, comments, replies, profiles, notifications, media, search, RSS, sitemap, SEO, and a private owner dashboard.

The database is already implemented in Supabase. The app layer should use the existing schema and avoid inventing a parallel content model.

---

## Current Database Foundation

Supabase project:

```text
vkzgfsrzckmvyyinoghk
```

Important database objects already available:

### Tables

- `blog_settings`
- `profiles`
- `posts`
- `post_revisions`
- `tags`
- `post_tags`
- `post_media`
- `comments`
- `post_reactions`
- `comment_reactions`
- `notifications`
- `email_outbox`

### Public views

- `published_posts`
- `rss_posts`
- `sitemap_entries`

### Storage buckets

- `blog-media`
- `avatars`

### Important RPC functions

- `claim_blog_owner(p_username, p_display_name)`
- `delete_my_comment(comment_id)`
- `record_post_view(post_slug)`
- `is_blog_owner()`

### Database assumptions

- This is a one-author blog.
- The owner must claim ownership once after creating a Supabase Auth account.
- Public visitors can read published posts without logging in.
- Readers must log in to comment, reply, like, bookmark, or manage profiles.
- Posts are Markdown.
- Post slugs are auto-generated.
- All blog media is public.
- Notifications are stored in-app, and email delivery is prepared through `email_outbox` for Resend.

---

## Required Stack

Use:

- Next.js App Router
- TypeScript
- Supabase Auth, Database, Storage
- ShadCN UI
- Tailwind CSS
- Server Components by default
- Client Components only where interaction is required
- React Hook Form + Zod for complex forms
- Resend for notification emails

Initialize the app with the requested ShadCN preset:

```bash
pnpm dlx shadcn@latest init --preset b3gqki --base base --template next --pointer
```

Install all ShadCN components:

```bash
pnpm dlx shadcn@latest add --all
```

If the CLI version does not support `--all`, install every available component from the ShadCN registry individually. The product should especially use:

- `accordion`
- `alert`
- `alert-dialog`
- `avatar`
- `badge`
- `breadcrumb`
- `button`
- `calendar`
- `card`
- `chart`
- `checkbox`
- `collapsible`
- `command`
- `dialog`
- `drawer`
- `dropdown-menu`
- `form`
- `hover-card`
- `input`
- `label`
- `menubar`
- `navigation-menu`
- `pagination`
- `popover`
- `progress`
- `radio-group`
- `resizable`
- `scroll-area`
- `select`
- `separator`
- `sheet`
- `sidebar`
- `skeleton`
- `sonner`
- `switch`
- `table`
- `tabs`
- `textarea`
- `toast` or `sonner`
- `toggle`
- `toggle-group`
- `tooltip`

---

## Product Principles

### 1. Simple over clever

The blog should not feel like a complicated CMS. The owner dashboard should expose advanced capability without making writing feel heavy.

### 2. Writing is the primary workflow

The most important experience is opening the dashboard, writing in Markdown, previewing the post, and publishing it with confidence.

### 3. Reading should feel quiet

The public site should prioritize typography, spacing, performance, and clarity. Avoid loud gradients, dense cards, and unnecessary movement.

### 4. Community should be lightweight

Comments, replies, mentions, and likes should support conversation, not turn the blog into a social feed.

### 5. Database rules are the source of truth

RLS and triggers already enforce important rules. The app should still validate inputs, but it must not assume client-side checks are sufficient.

### 6. Build complete, but keep the surface minimal

Features can be complete under the hood while UI stays restrained.

---

## Visual Direction

The design should be subtle, simple, and personal.

### Desired feeling

- calm
- intelligent
- warm
- readable
- slightly editorial
- technically polished
- not corporate
- not over-designed

### Layout style

- centered content column
- generous whitespace
- restrained borders
- soft background contrast
- clear page hierarchy
- excellent mobile layout

### Typography

Prioritize readability:

- Body text line height around `1.7`
- Long-form article width around `680px` to `760px`
- Clear heading scale
- Comfortable paragraph spacing
- Code blocks that are readable on mobile

Use a strong default font pairing, for example:

- Sans for UI
- Serif or highly readable sans for article body
- Monospace for code

### Color

Use the ShadCN theme tokens. Keep colors quiet:

- neutral background
- subtle muted surfaces
- one understated accent color
- good dark mode support

### Motion

Use motion sparingly:

- small hover transitions
- dropdown/sheet/dialog transitions from ShadCN
- no distracting page animations

### Accessibility

Minimum requirements:

- semantic HTML
- keyboard-accessible navigation
- visible focus states
- alt text for all content images
- form labels and error messages
- sufficient contrast in light and dark modes

---

## Application Structure

Recommended route groups:

```text
app/
  (public)/
    page.tsx
    blog/
      page.tsx
      [slug]/
        page.tsx
    tags/
      page.tsx
    search/
      page.tsx
    about/
      page.tsx
    profile/
      [username]/
        page.tsx
  (auth)/
    login/
      page.tsx
    register/
      page.tsx
    callback/
      route.ts
  (dashboard)/
    dashboard/
      page.tsx
      posts/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
          revisions/
            page.tsx
      tags/
        page.tsx
      media/
        page.tsx
      comments/
        page.tsx
      notifications/
        page.tsx
      settings/
        page.tsx
  api/
    rss/
      route.ts
    sitemap/
      route.ts
    resend/
      process-outbox/
        route.ts
```

Alternative route names are acceptable, but keep public, auth, and dashboard concerns separated.

---

## Supabase Client Architecture

Use separate clients for each runtime:

### Browser client

For interactive authenticated actions:

- login
- register
- comments
- reactions
- profile editing
- avatar upload

### Server client

For Server Components and Route Handlers:

- public posts
- dashboard data
- authenticated owner checks
- RSS
- sitemap

### Service-role client

Only use on the server for privileged operations:

- deleting auth users
- processing Resend outbox if needed
- admin-only maintenance tasks

Never expose the service-role key to the browser.

---

## Environment Variables

Required:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

Optional but recommended:

```text
RESEND_FROM_EMAIL=
RESEND_REPLY_TO_EMAIL=
NEXT_PUBLIC_SITE_NAME=
```

Rules:

- `NEXT_PUBLIC_*` values can be sent to the browser.
- `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` must only exist server-side.

---

## Core Product Areas

## 1. Public Blog Website

### 1.1 Home page

Purpose:

- Introduce the blog.
- Show recent posts.
- Give readers a clear path to search, browse, and subscribe via RSS.

Build:

- Hero section with site title and short description from `blog_settings`.
- Recent published posts from `published_posts`.
- Optional featured/latest post treatment.
- Tag preview section.
- RSS link.
- Auth links for login/register.

Design:

- Minimal intro.
- No busy marketing layout.
- Recent posts should look like a reading list, not ecommerce cards.

Acceptance criteria:

- Anonymous users can load the page.
- Only published posts with `published_at <= now()` appear.
- Empty state looks intentional if no posts exist.

---

### 1.2 Blog index

Purpose:

- List all published posts.

Build:

- Query `published_posts`.
- Sort by `published_at desc`.
- Display title, excerpt, date, primary tag, cover image if present.
- Add pagination or infinite "load more" after the initial version.

Acceptance criteria:

- Drafts, archived posts, and future scheduled posts do not appear.
- Page is fast and readable on mobile.

---

### 1.3 Blog post detail

Purpose:

- Provide the main reading experience.

Build:

- Query `published_posts` by `slug`.
- Render Markdown safely.
- Show title, excerpt, published date, updated date when meaningful, tags, cover image, author profile snippet, view count, like count, bookmark action, comments.
- Call `record_post_view(post_slug)` after a valid published post view.
- Generate metadata from:
  - `seo_title`
  - `seo_description`
  - `og_image_url`
  - cover image fallback

Markdown rendering requirements:

- headings
- paragraphs
- links
- images
- blockquotes
- ordered/unordered lists
- inline code
- fenced code blocks
- tables if supported

Security:

- Sanitize rendered Markdown if using HTML-capable Markdown plugins.
- External links should use safe attributes.

Acceptance criteria:

- Anonymous users can read posts.
- Missing slug returns `notFound()`.
- View count increment failures must not break page rendering.
- Cover image has alt text.

---

### 1.4 Search

Purpose:

- Let readers find posts by title, excerpt, and body content.

Build:

- Search against `posts.search_vector` through a database RPC or server-side query.
- Return only published posts.
- Include highlighted snippets if practical.
- Provide empty state.

Implementation note:

- If direct client querying of `search_vector` is awkward, add a small Supabase RPC later, e.g. `search_published_posts(query text)`.

Acceptance criteria:

- Anonymous users can search published content.
- Search does not reveal drafts or scheduled posts.

---

### 1.5 Tags

Purpose:

- Organize posts without adding categories.

Build:

- Display tags attached to posts.
- Primary tag should appear first.
- A tag management dashboard is required, but public tag detail pages are optional because the owner said no dedicated tag pages are needed.

Recommended public behavior:

- Blog index can filter by tag query parameter, e.g. `/blog?tag=supabase`.
- Avoid separate `/tag/[slug]` pages unless later desired.

Acceptance criteria:

- Multiple tags can appear on a post.
- One primary tag can be highlighted.

---

### 1.6 RSS

Purpose:

- Let readers subscribe without needing an account.

Build:

- Route handler at `/rss.xml`.
- Source data from `rss_posts`.
- Include title, link, description/excerpt, publication date, updated date, and content.

Acceptance criteria:

- Valid RSS XML.
- Uses `NEXT_PUBLIC_SITE_URL`.
- Only published posts appear.

---

### 1.7 Sitemap and robots

Purpose:

- Help search engines discover public content.

Build:

- `/sitemap.xml` route from `sitemap_entries`.
- Include homepage and blog index manually.
- `robots.txt` allowing normal indexing and referencing sitemap.

Acceptance criteria:

- Only public published routes appear.
- Scheduled posts do not appear early.

---

### 1.8 About page

Purpose:

- Give the blog a personal identity.

Build:

- Static or database-backed page.
- Include owner bio, avatar, links, and short explanation of the blog.

Acceptance criteria:

- Looks personal, not generic.

---

## 2. Authentication

### 2.1 Login

Support:

- email/password
- magic link if enabled
- Google OAuth if enabled
- GitHub OAuth if enabled

Build:

- `/login`
- ShadCN `Card`, `Form`, `Input`, `Button`, `Separator`.
- OAuth buttons.
- Clear error states.

Acceptance criteria:

- Existing users can sign in.
- Redirects back to intended page when appropriate.

---

### 2.2 Registration

Support:

- email/password
- OAuth providers

Build:

- `/register`
- Collect optional username/display name if practical.
- Let the Supabase `auth.users` trigger create `profiles`.

Important:

- The owner should claim ownership before public registration is promoted.

Acceptance criteria:

- New users receive a profile row.
- Username uniqueness errors are handled gracefully.

---

### 2.3 Auth callback

Build:

- `/auth/callback` or equivalent route handler for OAuth and magic links.
- Exchange code for session.
- Redirect safely.

Acceptance criteria:

- OAuth and magic link flows complete reliably.

---

## 3. Reader Profiles

### 3.1 Public profile page

Purpose:

- Let commenters have a lightweight identity.

Build:

- `/profile/[username]`
- Show avatar, display name, username, bio, website.
- Do not show private account data.

Acceptance criteria:

- Public profile loads by username.
- Banned status is not highlighted publicly unless product later requires it.

---

### 3.2 Edit profile

Purpose:

- Let users maintain their identity.

Build:

- Authenticated settings/profile page.
- Fields:
  - username
  - display name
  - avatar
  - bio
  - website URL

Avatar upload:

```text
avatars/{user_id}/avatar.webp
```

Acceptance criteria:

- Users can only edit their own profile.
- Username validation matches database format.
- Avatar upload stores public URL in `profiles.avatar_url`.

---

### 3.3 Account deletion

Purpose:

- Respect user control.

Build:

- "Delete account" action behind confirmation dialog.
- Must use a server route with service-role access to delete from `auth.users`.

Acceptance criteria:

- User must confirm destructive action.
- Related profile data cascades or is anonymized according to database behavior.
- Comments preserve integrity through nullable `author_id`.

---

## 4. Comments and Conversation

### 4.1 Comment list

Purpose:

- Let readers discuss a post.

Build:

- Display comments for a post.
- Show top-level comments with one level of replies.
- Show author avatar, display name, username, created date, edited state.
- If `deleted_at` exists, display a quiet deleted comment state.

Acceptance criteria:

- Anonymous users can read comments.
- Deleted comments show as deleted, not fully removed.
- Replies are visually nested one level only.

---

### 4.2 Add comment

Purpose:

- Authenticated readers can comment.

Build:

- Markdown textarea.
- Basic toolbar:
  - bold
  - italic
  - link
  - quote
  - code
  - list
  - mention helper if practical
- Submit inserts into `comments`.

Acceptance criteria:

- Anonymous users see a login prompt.
- Banned users are blocked by database and should receive a friendly error.
- Empty comments are prevented.

---

### 4.3 Replies

Purpose:

- Support direct conversation without deep threads.

Build:

- Reply button on top-level comments.
- Insert comment with `parent_id`.
- Do not show reply button on replies.

Acceptance criteria:

- UI enforces one-level replies.
- Database also rejects nested replies.

---

### 4.4 Edit/delete own comments

Build:

- Edit action for own comments.
- Delete action calls `delete_my_comment(comment_id)`.
- Use `AlertDialog` for delete confirmation.

Acceptance criteria:

- Users can edit only their own comments.
- Deleted comments become `[deleted]`.
- Deleted comments cannot be edited.

---

### 4.5 Comment likes

Build:

- Authenticated users can like/unlike comments.
- Use `comment_reactions`.
- Show `comments.like_count`.

Acceptance criteria:

- One like per user per comment.
- Like failures do not break comment display.

---

### 4.6 Mentions

Purpose:

- Let commenters tag each other with `@username`.

Build:

- Detect `@username` while typing.
- Optional autocomplete from public `profiles`.
- On insert, database creates notifications for mentioned users.

Acceptance criteria:

- Mentioned usernames render as links to profile pages.
- Notification creation is handled by database triggers.

---

## 5. Post Reactions and Bookmarks

### 5.1 Post likes

Build:

- Authenticated users can like/unlike posts.
- Use `post_reactions` with `reaction_type = 'like'`.
- Display `posts.like_count` from post rows or `published_posts`.

Acceptance criteria:

- One like per user per post.
- Anonymous users see login prompt.

---

### 5.2 Bookmarks

Build:

- Authenticated users can bookmark/unbookmark posts.
- Use `post_reactions` with `reaction_type = 'bookmark'`.
- Add a "Saved posts" page for logged-in readers if desired.

Acceptance criteria:

- Bookmarks are private to the user.
- Bookmark count need not be shown publicly unless desired.

---

## 6. Notifications

### 6.1 In-app notifications

Purpose:

- Inform users about replies, mentions, comment likes, and owner notifications.

Build:

- Notification bell in authenticated header.
- Notification list page or dropdown.
- Query `notifications` for current user.
- Mark notifications as read.

Notification types:

- `post_comment`
- `comment_reply`
- `mention`
- `comment_like`

Acceptance criteria:

- Users only see their own notifications.
- Read/unread state is clear.
- Empty state is friendly.

---

### 6.2 Email notifications through Resend

Purpose:

- Send emails for notification events.

Database state:

- `email_outbox` receives pending email records.
- The application must process them.

Build one of:

1. Supabase Edge Function scheduled or invoked by cron.
2. Next.js server route invoked by a trusted cron service.

Recommended function behavior:

- Fetch pending `email_outbox` rows.
- Send with Resend.
- Mark `status = 'sent'`, set `sent_at`, increment attempts.
- On failure, set `status = 'failed'` or leave pending with `last_error`.
- Avoid sending duplicate emails.

Acceptance criteria:

- Resend API key is never exposed client-side.
- Failed sends are visible in dashboard.
- Emails include useful links back to post/comment.

---

## 7. Owner Dashboard

The dashboard is for the single blog owner only. It should be useful, clean, and quick.

Access rule:

- Every dashboard route must require authentication.
- Every dashboard route must verify `is_blog_owner()`.
- Non-owner authenticated users should see a clear "not authorized" page or redirect.

Recommended layout:

- ShadCN `Sidebar`
- Top bar with command menu/search
- Mobile sheet navigation
- Theme toggle
- Owner avatar menu

Dashboard navigation:

- Overview
- Posts
- New Post
- Tags
- Media
- Comments
- Notifications
- Settings

---

### 7.1 Dashboard overview

Purpose:

- Give owner quick situational awareness.

Build cards:

- total posts
- drafts
- scheduled posts
- published posts
- total views
- recent comments
- pending email failures

Use:

- `Card`
- `Chart`
- `Table`
- `Badge`
- `Button`

Acceptance criteria:

- Shows useful data even with zero posts.
- No vanity metrics overload.

---

### 7.2 Posts list

Purpose:

- Manage all posts.

Build:

- Data table with:
  - title
  - status
  - published date
  - updated date
  - views
  - likes
  - primary tag
  - actions
- Filters:
  - status
  - tag
  - search
- Actions:
  - edit
  - preview
  - publish/unpublish/archive
  - delete with confirmation

Acceptance criteria:

- Owner can see drafts and scheduled posts.
- Public users cannot.

---

### 7.3 Post editor

Purpose:

- Make writing and publishing enjoyable.

Build fields:

- title
- markdown content
- excerpt
- cover image
- cover image alt text
- cover image caption
- tags
- primary tag
- status
- publish date/time
- SEO title
- SEO description
- Open Graph image

Editor requirements:

- Markdown textarea or editor pane.
- Live preview.
- Keyboard-friendly.
- Autosave draft if practical.
- Manual save button.
- Publish button.
- Schedule button.

Markdown toolbar:

- heading
- bold
- italic
- link
- quote
- code
- code block
- unordered list
- ordered list
- image insert

Image insertion:

- Upload to `blog-media`.
- Insert Markdown image syntax.
- Store structured image metadata in `post_media` where useful.

Slug behavior:

- Do not expose manual slug editing as the default.
- Show generated slug read-only after save.

Revision behavior:

- Every meaningful update creates a database revision.
- Provide a revisions page to inspect prior versions.

Acceptance criteria:

- Draft can be saved without publishing.
- Published post can be edited.
- Future `published_at` creates scheduled post.
- Cover image requires useful alt text.
- SEO preview shows approximate title/description output.

---

### 7.4 Post preview

Purpose:

- Let owner preview drafts/scheduled posts before publishing.

Build:

- Owner-only preview route.
- Render using the same article component as public post detail.
- Clearly label preview/draft/scheduled state.

Acceptance criteria:

- Only owner can preview unpublished content.
- Preview resembles final published page.

---

### 7.5 Revision history

Purpose:

- Provide confidence while editing.

Build:

- List `post_revisions` for a post.
- Show revision number, created date, status, title.
- Optional diff view between current and selected revision.
- Optional "restore revision" action can be added later.

Acceptance criteria:

- Owner can inspect previous versions.
- Readers cannot access revisions.

---

### 7.6 Tag manager

Purpose:

- Maintain the blog taxonomy.

Build:

- Create/edit/delete tags.
- Fields:
  - name
  - description
  - SEO title
  - SEO description
- Slug is auto-generated by database.

Acceptance criteria:

- Tag names are unique.
- Delete confirms impact.

---

### 7.7 Media manager

Purpose:

- Keep uploaded assets visible and reusable.

Build:

- Upload to `blog-media`.
- List recent media.
- Copy public URL.
- Show file type/size if available from Storage metadata.
- Let owner delete unused media.

Acceptance criteria:

- Only owner can manage blog media.
- Public can view media URLs.

---

### 7.8 Comments dashboard

Purpose:

- Let owner observe conversation and block abusive users if needed.

Build:

- List recent comments and replies.
- Link to post and commenter profile.
- Show deleted state.
- Action to ban/unban user by updating `profiles.is_banned`.

Do not build:

- comment approval queue
- report handling
- spam moderation workflow

The owner explicitly did not request those.

Acceptance criteria:

- Owner can ban users.
- Banned users cannot comment or react.

---

### 7.9 Notifications dashboard

Purpose:

- Let owner see blog activity.

Build:

- Show notifications.
- Mark read/unread.
- Link to related post/comment.

Acceptance criteria:

- Owner can view their notifications.
- Normal users can only view their own notifications.

---

### 7.10 Email outbox dashboard

Purpose:

- Make Resend delivery observable.

Build:

- List pending, sent, and failed `email_outbox` rows.
- Show attempts and last error.
- Add retry action for failed emails.

Acceptance criteria:

- Owner-only.
- Does not expose private API keys.

---

### 7.11 Blog settings

Purpose:

- Configure simple site identity.

Build fields:

- site title
- site description
- owner profile shortcut
- maybe social links in app config or later DB migration if needed

Acceptance criteria:

- Writes to `blog_settings`.
- Owner only.

---

## 8. SEO and Sharing

Build:

- Dynamic metadata for posts.
- Open Graph tags.
- Twitter card tags.
- Canonical URLs.
- JSON-LD `BlogPosting` structured data.
- Sitemap.
- RSS.
- Robots.txt.

Per-post metadata source:

- title fallback: `posts.title`
- SEO title: `posts.seo_title`
- description fallback: `posts.excerpt`
- SEO description: `posts.seo_description`
- image fallback: `posts.cover_image_url`
- OG image: `posts.og_image_url`

Acceptance criteria:

- Every public post has useful metadata.
- Drafts/scheduled posts are not indexed.

---

## 9. Error, Empty, and Loading States

Required states:

- no posts yet
- no comments yet
- no notifications yet
- no search results
- failed login
- forbidden dashboard
- missing post
- failed media upload
- failed email send
- offline/slow network for interactive forms

Use:

- `Skeleton`
- `Alert`
- `Sonner`
- `AlertDialog`
- calm empty-state illustrations/icons if available

---

## 10. Security Requirements

### Authentication

- Use Supabase Auth.
- Dashboard requires session.
- Dashboard also requires owner check.

### Authorization

- Trust RLS, but still gate UI.
- Never show dashboard links to non-owners.
- Never use service-role key in browser.

### Forms

- Validate with Zod.
- Trim strings.
- Enforce max lengths matching database constraints.

### Markdown

- Sanitize rendered HTML.
- Avoid unsafe embedded scripts.
- Validate image URLs if accepting pasted image links.

### Storage

- Blog media uploads are owner-only.
- Avatar uploads are user-owned.
- Respect bucket mime type limits.

### Abuse controls

- Add client-side throttling for comment submit.
- Consider server-side rate limiting before launch.
- Enable Supabase CAPTCHA or equivalent for auth if spam appears.

---

## 11. Performance Requirements

### Public pages

- Prefer Server Components.
- Cache public post lists appropriately.
- Use image optimization.
- Lazy-load comments if needed.
- Avoid shipping the dashboard/editor bundle to public pages.

### Dashboard

- Use server pagination for large tables.
- Keep editor isolated in its route.
- Use optimistic updates only where safe.

### Search

- Use database full-text search.
- Debounce query input.
- Avoid searching on every keystroke without delay.

---

## 12. Recommended Component Architecture

```text
components/
  public/
    site-header.tsx
    site-footer.tsx
    post-card.tsx
    post-list.tsx
    article-renderer.tsx
    comment-list.tsx
    comment-form.tsx
    reaction-button.tsx
  dashboard/
    dashboard-shell.tsx
    dashboard-sidebar.tsx
    posts-table.tsx
    post-editor.tsx
    markdown-toolbar.tsx
    media-picker.tsx
    tag-picker.tsx
    revision-list.tsx
    email-outbox-table.tsx
  auth/
    login-form.tsx
    register-form.tsx
  shared/
    theme-toggle.tsx
    user-menu.tsx
    empty-state.tsx
    submit-button.tsx
lib/
  supabase/
    browser.ts
    server.ts
    admin.ts
  db/
    posts.ts
    comments.ts
    profiles.ts
    notifications.ts
  markdown/
    render.ts
  validations/
    post.ts
    comment.ts
    profile.ts
```

---

## 13. Data Access Contracts

### Public post list

Use:

```text
published_posts
```

Required fields:

- `id`
- `title`
- `slug`
- `excerpt`
- `cover_image_url`
- `cover_image_alt`
- `published_at`
- `updated_at`
- `tags`
- `like_count`

---

### Public post detail

Use:

```text
published_posts where slug = ...
```

Then load comments:

```text
comments where post_id = ...
```

---

### Owner post list

Use:

```text
posts
post_tags
tags
```

Owner can access all statuses because of RLS.

---

### Create/update post

Use:

```text
posts
post_tags
post_media
```

Important:

- Do not manually assign author.
- Let database enforce the owner as author.
- Do not manually set slug unless future product decision changes.

---

### Comments

Use:

```text
comments
comment_reactions
profiles
```

Important:

- One-level replies only.
- Call `delete_my_comment` for deletion.

---

### Reactions

Post reactions:

```text
post_reactions
reaction_type = 'like' | 'bookmark'
```

Comment reactions:

```text
comment_reactions
reaction_type = 'like'
```

Counts:

- `posts.like_count`
- `posts.bookmark_count`
- `comments.like_count`

---

### Notifications

Use:

```text
notifications
email_outbox
```

The database creates notification rows for:

- comments on posts
- replies
- mentions
- comment likes

---

## 14. Build Sequence

Do not build everything randomly. Build in this order so each layer can be tested.

### Stage 1: App foundation

1. Initialize Next.js with the requested ShadCN preset.
2. Install all ShadCN components.
3. Configure Tailwind/theme/dark mode.
4. Add Supabase clients.
5. Add environment variable validation.
6. Add base layouts for public, auth, and dashboard route groups.

Definition of done:

- App boots locally.
- Supabase session can be read server-side and client-side.
- Theme toggle works.

---

### Stage 2: Auth and ownership

1. Build login page.
2. Build register page.
3. Build auth callback.
4. Build owner claim utility page or script.
5. Build `is_blog_owner` check helper.
6. Protect dashboard routes.

Definition of done:

- Owner can log in.
- Owner can claim ownership.
- Non-owner cannot access dashboard.

---

### Stage 3: Public reading experience

1. Build homepage.
2. Build blog index.
3. Build post detail page.
4. Add Markdown renderer.
5. Add SEO metadata.
6. Add view count RPC call.

Definition of done:

- Published posts render beautifully.
- Drafts do not leak.
- Metadata is correct.

---

### Stage 4: Owner post management

1. Build dashboard shell.
2. Build posts table.
3. Build post editor.
4. Build tag picker.
5. Build media upload.
6. Build preview route.
7. Build revision list.

Definition of done:

- Owner can create, edit, draft, publish, schedule, archive, tag, and add media to posts.

---

### Stage 5: Comments and profiles

1. Build profile pages.
2. Build edit profile page.
3. Build comments list.
4. Build add comment form.
5. Build reply flow.
6. Build edit/delete own comment flow.
7. Build comment likes.

Definition of done:

- Authenticated readers can participate.
- Anonymous readers can read but not comment.
- One-level replies work.

---

### Stage 6: Notifications and email

1. Build notification bell/dropdown.
2. Build notifications page.
3. Build email outbox processor for Resend.
4. Build owner outbox dashboard.
5. Add retry handling.

Definition of done:

- Replies/mentions create visible notifications.
- Pending email rows are sent through Resend.
- Failed sends can be inspected.

---

### Stage 7: Discovery and polish

1. Build search.
2. Build RSS route.
3. Build sitemap route.
4. Build robots.txt.
5. Add loading/error/empty states.
6. Polish mobile layouts.
7. Accessibility pass.
8. Performance pass.

Definition of done:

- Blog feels complete and launch-ready.

---

## 15. Feature Checklist

### Public site

- [ ] Home page
- [ ] Blog index
- [ ] Post detail
- [ ] Markdown rendering
- [ ] Code block styling
- [ ] Cover images
- [ ] Tags display
- [ ] Search
- [ ] RSS
- [ ] Sitemap
- [ ] Robots.txt
- [ ] SEO metadata
- [ ] Open Graph metadata
- [ ] JSON-LD
- [ ] Dark mode
- [ ] Mobile navigation
- [ ] About page

### Auth

- [ ] Login
- [ ] Register
- [ ] Magic link support if enabled
- [ ] Google OAuth support if enabled
- [ ] GitHub OAuth support if enabled
- [ ] Auth callback route
- [ ] Logout

### Reader account

- [ ] Public profile
- [ ] Edit profile
- [ ] Avatar upload
- [ ] Account deletion
- [ ] Saved/bookmarked posts page

### Comments

- [ ] Comment list
- [ ] Add comment
- [ ] Reply to top-level comment
- [ ] Edit own comment
- [ ] Delete own comment
- [ ] Deleted comment display
- [ ] Comment likes
- [ ] Mention rendering
- [ ] Mention autocomplete

### Owner dashboard

- [ ] Dashboard shell
- [ ] Overview metrics
- [ ] Posts table
- [ ] New post page
- [ ] Edit post page
- [ ] Markdown editor
- [ ] Live preview
- [ ] Draft save
- [ ] Publish
- [ ] Schedule
- [ ] Archive
- [ ] Cover image upload
- [ ] Embedded image upload
- [ ] SEO fields
- [ ] Tag manager
- [ ] Primary tag support
- [ ] Revision history
- [ ] Draft preview
- [ ] Media manager
- [ ] Comments dashboard
- [ ] Ban/unban user
- [ ] Notifications dashboard
- [ ] Email outbox dashboard
- [ ] Blog settings

### Notifications/email

- [ ] Notification bell
- [ ] Notification list
- [ ] Mark read
- [ ] Resend outbox processor
- [ ] Retry failed sends
- [ ] Email templates

### Quality

- [ ] RLS behavior tested as anonymous user
- [ ] RLS behavior tested as reader
- [ ] RLS behavior tested as owner
- [ ] Banned user behavior tested
- [ ] Form validation
- [ ] Empty states
- [ ] Error states
- [ ] Loading states
- [ ] Accessibility pass
- [ ] Mobile pass
- [ ] SEO validation
- [ ] RSS validation
- [ ] Sitemap validation

---

## 16. Testing Strategy

### Unit tests

Test:

- validation schemas
- Markdown rendering helpers
- date formatting
- URL builders
- metadata builders

### Integration tests

Test:

- login/register flow
- public post loading
- dashboard authorization
- create/edit/publish post
- comment/reply/delete flows
- reaction toggles

### RLS/manual test matrix

Test each role:

1. Anonymous
2. Authenticated reader
3. Blog owner
4. Banned reader

Required checks:

- Anonymous can read published content.
- Anonymous cannot comment.
- Reader can comment on published posts.
- Reader cannot access dashboard.
- Owner can manage posts/tags/media.
- Banned reader cannot comment or react.
- Drafts are invisible to non-owner.

---

## 17. Launch Readiness Checklist

- [ ] Owner account claimed.
- [ ] Auth providers configured in Supabase.
- [ ] Email confirmation decision made.
- [ ] Resend domain verified.
- [ ] Resend API key set server-side.
- [ ] Production URL set in Supabase Auth redirect URLs.
- [ ] `NEXT_PUBLIC_SITE_URL` set.
- [ ] RSS route validated.
- [ ] Sitemap submitted or ready.
- [ ] First post published.
- [ ] Comment flow tested.
- [ ] Dashboard protected.
- [ ] Mobile layout reviewed.
- [ ] Dark mode reviewed.

---

## 18. What Not to Build Yet

Avoid adding complexity unless the owner explicitly asks later:

- multi-author roles
- paid memberships
- newsletters as a separate product
- anonymous comments
- moderation approval queue
- user reports
- spam scoring
- complex analytics pipeline
- categories in addition to tags
- deeply nested comments
- manual slug editing
- private posts
- private media

The database and product direction intentionally keep the blog simple.

---

## 19. Developer Notes

### Owner claim

After creating the first owner account, run:

```ts
await supabase.rpc("claim_blog_owner", {
  p_username: "your_username",
  p_display_name: "Your Name",
})
```

### Record a view

```ts
await supabase.rpc("record_post_view", {
  post_slug: slug,
})
```

This RPC is intentionally public. It only increments views for already-published posts.

### Soft-delete a comment

```ts
await supabase.rpc("delete_my_comment", {
  comment_id,
})
```

### Upload blog media

```text
bucket: blog-media
path: posts/{post_id}/{filename}
```

### Upload avatar

```text
bucket: avatars
path: {user_id}/avatar.webp
```

---

## Final Product Goal

The finished product should feel like a calm personal writing home:

- easy for the owner to write
- pleasant for readers to read
- simple for readers to join the conversation
- secure by default
- searchable and SEO-friendly
- complete without being bloated

Build it like a personal tool that happens to be public, not like a generic SaaS CMS.
