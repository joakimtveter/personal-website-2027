# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Personal website built on **Payload CMS 4 (beta)** running inside **TanStack Start** (Vite 8 + React 19 RSC), backed by **Postgres** via `@payloadcms/db-vercel-postgres`. Package manager is pnpm; Node >= 24.22.1.

For any Payload-related work (collections, fields, hooks, access control, Local API, plugins), read the skill at `node_modules/payload/skills/payload/SKILL.md` first. Payload 4 is a beta, so APIs may differ from what you remember of Payload 3.

## Commands

```bash
pnpm dev                 # Vite dev server on http://localhost:3000 (admin at /admin)
pnpm dev:force           # same, but rebuilds Vite's dependency cache (vite dev --force)
pnpm build               # production build (payload build -> dist/)
pnpm start               # serve the production build with srvx
pnpm lint                # oxlint, type-aware via oxlint-tsgolint (config in .oxlintrc.json); warnings fail
npx oxfmt                # formatter (no script; config in oxfmt.config.ts)

pnpm test                # int + e2e
pnpm test:int            # vitest, tests/int/**/*.int.spec.ts (jsdom)
pnpm test:e2e            # playwright, tests/e2e; starts/reuses `pnpm dev` on :3000

pnpm generate:types      # regenerate src/payload-types.ts after changing collections/fields
pnpm generate:importmap  # regenerate src/app/_payload/importMap.js after adding custom admin components
```

Single test: `pnpm test:int tests/int/api.int.spec.ts -t "fetches users"` or `pnpm test:e2e tests/e2e/admin.e2e.spec.ts -g "dashboard"`.

Both test suites talk to the real database configured in `.env` (int tests call `getPayload` directly; e2e seeds and deletes a `dev@payloadcms.com` user and a related-posts fixture). Setting `POSTGRES_URL` in the shell overrides `.env`, which is handy for running against a throwaway database. The e2e frontend tests expect seeded content (admin dashboard → Seed button, or `POST /api/seed` as a logged-in user).

## Environment

Required in `.env`: `POSTGRES_URL`, `PAYLOAD_SECRET`, and `PREVIEW_SECRET` (preview/live preview are refused without it). Optional: `SERVER_URL` (public origin; defaults to `http://localhost:3000`), `CRON_SECRET`. `docker compose up -d` starts a local Postgres whose user/password/database come from `POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_DB` in `.env` (these must match `POSTGRES_URL`); the app itself runs on the host. The adapter uses a plain `pg` pool only when the `POSTGRES_URL` hostname is exactly `localhost` or `127.0.0.1`; any other host goes through `@vercel/postgres` (Neon serverless driver), which won't work against an ordinary Postgres server.

## Architecture

- The content model and frontend are a port of Payload's Next.js website template; don't reintroduce `next/*` APIs. Notable Payload 4 differences from v3 code you may find online: the Local API defaults to `overrideAccess: false`, and with localization, drafts store `_status` per locale (a doc is only public in locales where it has been published).
- `src/payload.config.ts` is the single Payload config (aliased as `@payload-config`; `#/*` maps to `src/*`; Payload admin component paths such as `/components/BeforeLogin` are relative to `src/`, since `#` separates the export name there). Collections live in `src/collections/`, globals in `src/Header/` and `src/Footer/`, plugins (SEO, form builder, search, redirects, nested docs) in `src/plugins/`, plus `@payloadcms/plugin-mcp`. Block configs and components sit together in `src/blocks/<Block>/`, heroes in `src/heros/`.
- Locales `nb` (default) and `en` are defined once in `src/i18n/locales.ts` and used by both Payload and the frontend; fixed UI strings are in `src/i18n/messages.ts` (`useMessages()`), and `useLocale()` reads the `$locale` route param. Content text fields are `localized`; slugs and structure are shared.
- Production applies `src/migrations` on startup (`prodMigrations`); dev uses schema push. After schema changes run `pnpm payload migrate:create <name>`. Seeding lives in `src/endpoints/seed/` and is exposed as `POST /api/seed` (logged-in users only).
- `vite.config.ts` wraps the Vite config in `withPayload(...)` from `@payloadcms/tanstack-start`, which wires up the RSC, TanStack Start and React plugins.
- Routing is TanStack file-based routing rooted at `src/app/` (`src/routeTree.gen.ts` is generated; don't edit it). Two pathless layout groups split the app:
  - `_frontend` — the public site, styled with Tailwind 4 (`_frontend/styles.css`, `tailwind.config.mjs`, shadcn-style components in `src/components/ui/` built on Base UI (`@base-ui/react`; use the `render` prop where Radix used `asChild`, and pass `items` to `Select` so `SelectValue` shows labels)). `/` redirects by `Accept-Language`; everything else is under `_frontend/$locale` (`/$locale`, `/$locale/$slug`, `/$locale/posts`, `/$locale/posts/page/$pageNumber`, `/$locale/posts/$slug`, `/$locale/search`). The `$locale` layout redirects unprefixed paths to the default locale, loads header/footer, and sets `Cache-Control` (short `s-maxage`, or `private, no-store` in draft mode). There is no ISR/revalidation; pages render per request.
  - Data loading: route loaders call `createServerFn`s in `src/server/content.functions.ts`, which use the Local API through `src/server/*.server.ts` (server-only). Payload docs fail TanStack's serializability types, so read functions use `strict: { output: false }`. Redirects (plugin collection) are checked in `getPage`/`getPost`; archive blocks are resolved there too.
  - Server routes at the top of `src/app/`: `preview.ts` (checks `PREVIEW_SECRET` + admin session, sets the `payload-draft` cookie; draft content needs both cookie and session), `exit-preview.ts`, `sitemap[.]xml.ts`, `pages-`/`posts-sitemap[.]xml.ts`, `robots[.]txt.ts`.
  - CMS hrefs are arbitrary strings, so use `AppLink` (client-side navigation for internal hrefs) or `CMSLink` rather than TanStack's typed `<Link to>`; build document URLs with `getDocHref`/`localizeHref` from `src/utilities/localizeHref.ts`. Files named `*.client.*` are browser-only under TanStack's import protection.
  - `_payload` — admin panel (`admin.index.tsx`, `admin.$.tsx`) and REST/GraphQL API (`api.$.ts`), all delegating to Payload via server functions in `_payload/server.functions.ts`. These files are generated by Payload ("MODIFY AT YOUR OWN RISK"); admin style overrides go in `_payload/custom.css`. Admin fonts are system fonts (overridden in `custom.css`); the Google Fonts links Payload generates in `_payload.tsx` were removed, so drop them again if Payload regenerates that file.
- `src/router.tsx` creates the router using Payload's search param parse/stringify helpers; `src/app/__root.tsx` wraps the HTML shell with `withPayloadRoot`.
- Generated files, excluded from lint and format: `src/payload-types.ts`, `src/routeTree.gen.ts`, `src/app/_payload/importMap.js`, `src/migrations/`.

## Code style

oxfmt: semicolons, double quotes, trailing commas, 120-char width. oxlint's unused-var rule ignores names prefixed with `_`; `eslint-disable` comments are honoured.
