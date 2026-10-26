declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CRON_SECRET?: string;
      PAYLOAD_SECRET: string;
      POSTGRES_URL: string;
      PREVIEW_SECRET?: string;
      SERVER_URL?: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
