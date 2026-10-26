import { useNavigate } from "@tanstack/react-router";
import { FC } from "react";

import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "#/components/ui/pagination";
import { useLocale } from "#/i18n/useLocale";
import { cn } from "#/utilities/ui";

export const Pagination: FC<{
  className?: string;
  page: number;
  totalPages: number;
}> = (props) => {
  const navigate = useNavigate();
  const locale = useLocale();

  const { className, page, totalPages } = props;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const hasExtraPrevPages = page - 1 > 1;
  const hasExtraNextPages = page + 1 < totalPages;

  const goToPage = (pageNumber: number) =>
    pageNumber === 1
      ? navigate({ to: "/$locale/posts", params: { locale } })
      : navigate({
          to: "/$locale/posts/page/$pageNumber",
          params: { locale, pageNumber: String(pageNumber) },
        });

  return (
    <div className={cn("my-12", className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious disabled={!hasPrevPage} onClick={() => void goToPage(page - 1)} />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink onClick={() => void goToPage(page - 1)}>{page - 1}</PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink isActive onClick={() => void goToPage(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink onClick={() => void goToPage(page + 1)}>{page + 1}</PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext disabled={!hasNextPage} onClick={() => void goToPage(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  );
};
