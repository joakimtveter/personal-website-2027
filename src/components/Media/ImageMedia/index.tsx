import { FC } from "react";

import { cssVariables } from "#/cssVariables";
import type { Media } from "#/payload-types";
import { getMediaUrl } from "#/utilities/getMediaUrl";
import { cn } from "#/utilities/ui";

import type { Props as MediaProps } from "../types";

const { breakpoints } = cssVariables;

// Only variants that keep the original aspect ratio can stand in for each other in a srcset
const responsiveVariants = ["thumbnail", "small", "medium", "large", "xlarge"] as const;

const getSrcSet = (resource: Media) => {
  const cacheTag = resource.updatedAt;
  const candidates = responsiveVariants
    .map((name) => resource.variants?.[name])
    .filter((variant) => variant?.url && variant.width)
    .map((variant) => `${getMediaUrl(variant!.url, cacheTag)} ${variant!.width}w`);

  if (resource.url && resource.width) {
    candidates.push(`${getMediaUrl(resource.url, cacheTag)} ${resource.width}w`);
  }

  return candidates.length > 0 ? candidates.join(", ") : undefined;
};

/**
 * Renders Payload media as a responsive `<img>`, using the sharp variants generated on upload
 * as `srcset` candidates. With `fill`, the image covers its positioned container and respects
 * the focal point chosen in the admin panel.
 */
export const ImageMedia: FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    pictureClassName,
    imgClassName,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    loading: loadingFromProps,
  } = props;

  let width: number | undefined;
  let height: number | undefined;
  let alt = altFromProps;
  let src = srcFromProps || "";
  let srcSet: string | undefined;
  let objectPosition: string | undefined;

  if (!src && resource && typeof resource === "object") {
    width = resource.width ?? undefined;
    height = resource.height ?? undefined;
    alt = altFromProps ?? resource.alt ?? "";
    src = getMediaUrl(resource.url, resource.updatedAt);
    srcSet = getSrcSet(resource);

    if (typeof resource.focalX === "number" && typeof resource.focalY === "number") {
      objectPosition = `${resource.focalX}% ${resource.focalY}%`;
    }
  }

  const loading = loadingFromProps || (priority ? "eager" : "lazy");

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value * 2}px`)
        .join(", ");

  return (
    <picture className={cn(pictureClassName)}>
      <img
        alt={alt || ""}
        className={cn(fill && "absolute inset-0 h-full w-full", imgClassName)}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        height={!fill ? height : undefined}
        loading={loading}
        sizes={srcSet ? sizes : undefined}
        src={src}
        srcSet={srcSet}
        style={objectPosition ? { objectPosition } : undefined}
        width={!fill ? width : undefined}
      />
    </picture>
  );
};
