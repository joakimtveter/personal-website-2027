# Payload TanStack Blank Template

This TanStack Start template comes configured with the bare minimum to get started on anything you need.

The app uses Postgres through `@payloadcms/db-vercel-postgres`, which reads its connection string from `POSTGRES_URL`.

## Local setup

1. `cp .env.example .env` to copy the example environment variables, then set `PAYLOAD_SECRET` to a random string.
2. Start a Postgres database. The easiest way is `docker compose up -d`, which runs Postgres 17 on port 5432 and matches the `POSTGRES_URL` in `.env.example`. To use your own Postgres instead, point `POSTGRES_URL` at it.
3. `pnpm install && pnpm dev` to install dependencies and start the dev server.
4. Open `http://localhost:3000` in your browser.

Changes made in `./src` will be reflected in your app. Go to `/admin` and follow the on-screen instructions to create your first admin user.

Keep the database host in `POSTGRES_URL` as `localhost` or `127.0.0.1` for local databases. For any other host, the adapter connects through `@vercel/postgres` (Neon's serverless driver) instead of a plain `pg` connection.

## Production

To build and serve the template in production mode, run `pnpm build && pnpm start`.

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
