import React from "react";

import { useMessages } from "#/i18n/useLocale";

export const PageRange: React.FC<{
  className?: string;
  currentPage?: number;
  limit?: number;
  totalDocs?: number;
}> = (props) => {
  const { className, currentPage, limit, totalDocs } = props;
  const t = useMessages();

  let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1;
  if (totalDocs && indexStart > totalDocs) indexStart = 0;

  let indexEnd = (currentPage || 1) * (limit || 1);
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs;

  return (
    <div className={[className, "font-semibold"].filter(Boolean).join(" ")}>
      {(typeof totalDocs === "undefined" || totalDocs === 0) && t.searchNoResults}
      {typeof totalDocs !== "undefined" &&
        totalDocs > 0 &&
        t.showing(
          indexStart,
          indexStart > 0 ? indexEnd : 0,
          totalDocs,
          totalDocs > 1 ? t.postsPlural : t.post,
        )}
    </div>
  );
};
