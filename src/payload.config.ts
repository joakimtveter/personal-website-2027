import path from "path";
import { fileURLToPath } from "url";

import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { mcpPlugin } from "@payloadcms/plugin-mcp";
import { sharpTransformer } from "@payloadcms/transformer-sharp";
import { buildConfig, type PayloadRequest } from "payload";

import { Categories } from "./collections/Categories";
import { Folders } from "./collections/Folders";
import { Media, mediaSharpOptions } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { Tags } from "./collections/Tags";
import { Users } from "./collections/Users";
import { seedEndpoint } from "./endpoints/seed/endpoint";
import { defaultLexical } from "./fields/defaultLexical";
import { Footer } from "./Footer/config";
import { Header } from "./Header/config";
import { defaultLocale, localeLabels, locales } from "./i18n/locales";
import { migrations } from "./migrations";
import { plugins } from "./plugins";
import { getServerSideURL } from "./utilities/getURL";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ["/components/BeforeLogin"],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ["/components/BeforeDashboard"],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: "Mobile",
          name: "mobile",
          width: 375,
          height: 667,
        },
        {
          label: "Tablet",
          name: "tablet",
          width: 768,
          height: 1024,
        },
        {
          label: "Desktop",
          name: "desktop",
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  collections: [Pages, Posts, Media, Categories, Users, Folders, Tags],
  cors: [getServerSideURL()].filter(Boolean),
  editor: defaultLexical,
  endpoints: [seedEndpoint],
  globals: [Header, Footer],
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || "",
    },
    // Development pushes schema changes directly; production applies these migrations on startup
    prodMigrations: migrations,
  }),
  localization: {
    locales: locales.map((code) => ({ code, label: localeLabels[code] })),
    fallback: true,
    defaultLocale,
  },
  plugins: [...plugins, mcpPlugin({})],
  upload: {
    transformers: [sharpTransformer({ collections: { media: mediaSharpOptions } })],
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true;

        const secret = process.env.CRON_SECRET;
        if (!secret) return false;

        // If there is no logged in user, then check
        // for the cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get("authorization");
        return authHeader === `Bearer ${secret}`;
      },
    },
    // Runs queued jobs (such as scheduled publishing) every minute inside the server process
    autoRun: [{ allQueues: true, cron: "* * * * *" }],
    shouldAutoRun: () => process.env.NODE_ENV !== "test",
    tasks: [],
  },
});
