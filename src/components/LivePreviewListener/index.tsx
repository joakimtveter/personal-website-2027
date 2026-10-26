import { RefreshRouteOnSave as PayloadLivePreview } from "@payloadcms/live-preview-react";
import { useRouter } from "@tanstack/react-router";
import { FC } from "react";

import { getClientSideURL } from "#/utilities/getURL";

/** Re-runs the route loaders whenever the document is saved (or autosaved) in the admin panel */
export const LivePreviewListener: FC = () => {
  const router = useRouter();
  return (
    <PayloadLivePreview refresh={() => void router.invalidate()} serverURL={getClientSideURL()} />
  );
};
