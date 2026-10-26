import { ComponentProps, FC, HTMLAttributes, Ref } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import type { ButtonProps } from "#/components/ui/button";
import { buttonVariants } from "#/components/ui/button";
import { useMessages } from "#/i18n/useLocale";
import { cn } from "#/utilities/ui";

const Pagination = ({ className, ...props }: ComponentProps<"nav">) => (
  <nav
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    role="navigation"
    {...props}
  />
);

const PaginationContent: FC<
  { ref?: Ref<HTMLUListElement> } & HTMLAttributes<HTMLUListElement>
> = ({ className, ref, ...props }) => (
  <ul className={cn("flex flex-row items-center gap-1", className)} ref={ref} {...props} />
);

const PaginationItem: FC<
  { ref?: Ref<HTMLLIElement> } & HTMLAttributes<HTMLLIElement>
> = ({ className, ref, ...props }) => <li className={cn("", className)} ref={ref} {...props} />;

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  ComponentProps<"button">;

const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
  <button
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        size,
        variant: isActive ? "outline" : "ghost",
      }),
      className,
    )}
    {...props}
  />
);

const PaginationPrevious = ({
  className,
  ...props
}: ComponentProps<typeof PaginationLink>) => {
  const t = useMessages();
  return (
    <PaginationLink
      aria-label={t.previousPage}
      className={cn("gap-1 pl-2.5", className)}
      size="default"
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>{t.previous}</span>
    </PaginationLink>
  );
};

const PaginationNext = ({ className, ...props }: ComponentProps<typeof PaginationLink>) => {
  const t = useMessages();
  return (
    <PaginationLink
      aria-label={t.nextPage}
      className={cn("gap-1 pr-2.5", className)}
      size="default"
      {...props}
    >
      <span>{t.next}</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
};

const PaginationEllipsis = ({ className, ...props }: ComponentProps<"span">) => {
  const t = useMessages();
  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">{t.moreResults}</span>
    </span>
  );
};

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
