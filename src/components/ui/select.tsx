import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { cn } from "#/utilities/ui";

/**
 * Pass `items` (an array of `{ label, value }` or a value-to-label record) so `SelectValue` can
 * show the selected item's label rather than its raw value.
 */
const Select = SelectPrimitive.Root;

const SelectGroup: React.FC<SelectPrimitive.Group.Props> = (props) => {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
};

const SelectValue: React.FC<SelectPrimitive.Value.Props> = ({ className, ...props }) => {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("line-clamp-1", className)}
      {...props}
    />
  );
};

const SelectTrigger: React.FC<SelectPrimitive.Trigger.Props> = ({
  children,
  className,
  ...props
}) => {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "border-input *:data-[placeholder]:text-muted-foreground aria-invalid:border-destructive ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-invalid:focus-visible:ring-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon render={<ChevronDown className="size-4 opacity-50" />} />
    </SelectPrimitive.Trigger>
  );
};

type SelectContentProps = SelectPrimitive.Popup.Props &
  Pick<SelectPrimitive.Positioner.Props, "align" | "alignItemWithTrigger" | "side" | "sideOffset">;

/** Opens below the trigger by default; set `alignItemWithTrigger` to overlay the selected item instead */
const SelectContent: React.FC<SelectContentProps> = ({
  align = "start",
  alignItemWithTrigger = false,
  children,
  className,
  side = "bottom",
  sideOffset = 4,
  ...props
}) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        align={align}
        alignItemWithTrigger={alignItemWithTrigger}
        className="z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "bg-popover text-popover-foreground relative max-h-[min(24rem,var(--available-height))] min-w-[max(8rem,var(--anchor-width))] origin-(--transform-origin) overflow-hidden rounded-md border shadow-md transition-[opacity,scale] duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List className="max-h-[min(24rem,var(--available-height))] scroll-py-1 overflow-y-auto p-1">
            {children}
          </SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
};

const SelectLabel: React.FC<SelectPrimitive.GroupLabel.Props> = ({ className, ...props }) => {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-sm font-semibold", className)}
      {...props}
    />
  );
};

const SelectItem: React.FC<SelectPrimitive.Item.Props> = ({ children, className, ...props }) => {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex items-center gap-2">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2 flex size-3.5 items-center justify-center">
        <Check className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
};

const SelectSeparator: React.FC<SelectPrimitive.Separator.Props> = ({ className, ...props }) => {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
};

const SelectScrollUpButton: React.FC<SelectPrimitive.ScrollUpArrow.Props> = ({
  className,
  ...props
}) => {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "bg-popover absolute top-0 z-10 flex w-full cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronUp className="size-4" />
    </SelectPrimitive.ScrollUpArrow>
  );
};

const SelectScrollDownButton: React.FC<SelectPrimitive.ScrollDownArrow.Props> = ({
  className,
  ...props
}) => {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bg-popover absolute bottom-0 z-10 flex w-full cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronDown className="size-4" />
    </SelectPrimitive.ScrollDownArrow>
  );
};

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
