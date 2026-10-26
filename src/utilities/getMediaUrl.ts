/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 *
 * Local paths (e.g. `/api/media/file/image.webp`) are kept relative so they work on any host.
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return "";

  if (cacheTag && cacheTag !== "") {
    cacheTag = encodeURIComponent(cacheTag);
  }

  return cacheTag ? `${url}?${cacheTag}` : url;
};
