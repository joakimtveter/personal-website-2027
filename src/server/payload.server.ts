import configPromise from "@payload-config";
import { getCookie, getRequestHeaders } from "@tanstack/react-start/server";
import { getPayload } from "payload";

const draftCookieName = "payload-draft";

export const draftCookie = {
  name: draftCookieName,
  /** A `Set-Cookie` value that enables (session cookie) or clears draft mode */
  serialize: (enabled: boolean, request: Request) => {
    const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
    const value = enabled ? "true" : "";
    const expiry = enabled ? "" : "; Max-Age=0";

    return `${draftCookieName}=${value}; Path=/; HttpOnly; SameSite=Lax${secure}${expiry}`;
  },
};

export const getPayloadClient = () => getPayload({ config: configPromise });

/**
 * Draft content is only served when the preview cookie is set and the request also carries a
 * valid admin session, so a forged cookie alone never exposes unpublished content.
 */
export const getDraftContext = async () => {
  const payload = await getPayloadClient();

  if (getCookie(draftCookieName) !== "true") {
    return { draft: false, payload, user: null };
  }

  const { user } = await payload.auth({ headers: getRequestHeaders() });

  return { draft: Boolean(user), payload, user };
};
