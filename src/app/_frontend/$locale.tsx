import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AdminBar } from "#/components/AdminBar";
import { LivePreviewListener } from "#/components/LivePreviewListener";
import { NotFound } from "#/components/NotFound";
import { Footer } from "#/Footer/Component";
import { Header } from "#/Header/Component";
import { defaultLocale, isLocale } from "#/i18n/locales";
import { getSiteData } from "#/server/content.functions";

export const Route = createFileRoute("/_frontend/$locale")({
  beforeLoad: ({ location, params }) => {
    // Paths without a locale prefix are treated as default-locale paths
    if (!isLocale(params.locale)) {
      throw redirect({ href: `/${defaultLocale}${location.pathname}`, statusCode: 301 });
    }
  },
  loader: ({ params }) => getSiteData({ data: { locale: params.locale } }),
  headers: ({ loaderData }) => ({
    // Published pages can be cached briefly by a CDN; previews must never be cached
    "Cache-Control": loaderData?.draft
      ? "private, no-store"
      : "public, max-age=0, s-maxage=60, stale-while-revalidate=600",
  }),
  component: LocaleLayout,
  notFoundComponent: NotFound,
});

function LocaleLayout() {
  const { draft, footer, header } = Route.useLoaderData();

  return (
    <>
      <AdminBar adminBarProps={{ preview: draft }} />
      {draft && <LivePreviewListener />}
      <Header data={header} />
      <Outlet />
      <Footer data={footer} />
    </>
  );
}
