/// <reference types="vite/client" />

import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Providers } from "#/providers";
import { initThemeScript } from "#/providers/Theme/InitTheme";

import styles from "./_frontend/styles.css?url";

export const Route = createFileRoute("/_frontend")({
  component: FrontendLayout,
  head: () => ({
    links: [
      { rel: "stylesheet", href: styles },
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    scripts: [{ children: initThemeScript }],
  }),
});

function FrontendLayout() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  );
}
