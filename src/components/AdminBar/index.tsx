import type { PayloadAdminBarProps, PayloadMeUser } from "@payloadcms/admin-bar";
import { PayloadAdminBar } from "@payloadcms/admin-bar";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { FC, useCallback, useState } from "react";

import { useLocale } from "#/i18n/useLocale";
import { getClientSideURL } from "#/utilities/getURL";
import { cn } from "#/utilities/ui";

import "./index.css";

const baseClass = "admin-bar";

const collectionLabels = {
  pages: {
    plural: "Pages",
    singular: "Page",
  },
  posts: {
    plural: "Posts",
    singular: "Post",
  },
};

const Title: FC = () => <span>Dashboard</span>;

export const AdminBar: FC<{
  adminBarProps?: PayloadAdminBarProps;
}> = (props) => {
  const { adminBarProps } = props || {};
  const router = useRouter();
  const locale = useLocale();
  // Paths look like /:locale/posts/... for posts and /:locale/... for pages
  const segment = useRouterState({ select: (state) => state.location.pathname.split("/")[2] });
  const [show, setShow] = useState(false);
  const collection: keyof typeof collectionLabels = segment === "posts" ? "posts" : "pages";

  const onAuthChange = useCallback((user: PayloadMeUser) => {
    setShow(Boolean(user?.id));
  }, []);

  return (
    <div
      className={cn(baseClass, "py-2 bg-black text-white", {
        block: show,
        hidden: !show,
      })}
    >
      <div className="container">
        <PayloadAdminBar
          {...adminBarProps}
          className="py-2 text-white"
          classNames={{
            controls: "font-medium text-white",
            logo: "text-white",
            user: "text-white",
          }}
          cmsURL={getClientSideURL()}
          collectionSlug={collection}
          collectionLabels={collectionLabels[collection]}
          logo={<Title />}
          onAuthChange={onAuthChange}
          onPreviewExit={() => {
            void fetch("/exit-preview").then(() =>
              router
                .navigate({ to: "/$locale", params: { locale } })
                .then(() => router.invalidate()),
            );
          }}
          style={{
            backgroundColor: "transparent",
            padding: 0,
            position: "relative",
            zIndex: "unset",
          }}
        />
      </div>
    </div>
  );
};
