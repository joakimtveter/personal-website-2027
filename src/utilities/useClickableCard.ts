import { useRouter } from "@tanstack/react-router";
import type { RefObject } from "react";
import { useEffect, useRef } from "react";

type UseClickableCardType<T extends HTMLElement> = {
  cardRef: RefObject<T | null>;
  linkRef: RefObject<HTMLAnchorElement | null>;
};

interface Props {
  external?: boolean;
  newTab?: boolean;
  scroll?: boolean;
}

function useClickableCard<T extends HTMLElement>({
  external = false,
  newTab = false,
  scroll = true,
}: Props): UseClickableCardType<T> {
  const router = useRouter();
  const cardRef = useRef<T>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const cardNode = cardRef.current;

    if (!cardNode) return;

    let timeDown = 0;
    let hasActiveParent = false;
    let pressedButton = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target) {
        const target = e.target as Element;

        const timeNow = +new Date();
        const parent = target?.closest("a");

        pressedButton = e.button;

        if (!parent) {
          hasActiveParent = false;
          timeDown = timeNow;
        } else {
          hasActiveParent = true;
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      const href = linkRef.current?.href;

      if (href) {
        const timeNow = +new Date();
        const difference = timeNow - timeDown;

        if (difference <= 250 && !hasActiveParent && pressedButton === 0 && !e.ctrlKey) {
          if (external) {
            const target = newTab ? "_blank" : "_self";
            window.open(href, target);
          } else {
            const { pathname, search, hash } = new URL(href);
            void router.navigate({ href: `${pathname}${search}${hash}`, resetScroll: scroll });
          }
        }
      }
    };

    const abortController = new AbortController();

    cardNode.addEventListener("mousedown", handleMouseDown, { signal: abortController.signal });
    cardNode.addEventListener("mouseup", handleMouseUp, { signal: abortController.signal });

    return () => {
      abortController.abort();
    };
  }, [external, newTab, router, scroll]);

  return { cardRef, linkRef };
}

export default useClickableCard;
