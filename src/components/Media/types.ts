import type { ElementType, Ref } from "react";

import type { Media as MediaType } from "#/payload-types";

export interface Props {
  alt?: string;
  className?: string;
  fill?: boolean; // stretch the image over its (positioned) container
  htmlElement?: ElementType | null;
  pictureClassName?: string;
  imgClassName?: string;
  onClick?: () => void;
  onLoad?: () => void;
  loading?: "lazy" | "eager";
  priority?: boolean; // load eagerly with high fetch priority, e.g. for heroes
  ref?: Ref<HTMLImageElement | HTMLVideoElement | null>;
  resource?: MediaType | string | number | null; // for Payload media
  size?: string; // the `sizes` attribute
  src?: string; // for static media
  videoClassName?: string;
}
