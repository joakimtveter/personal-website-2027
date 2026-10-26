import { FC, HTMLAttributes } from "react";

import { cn } from "#/utilities/ui";

const Card: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      data-slot="card"
      className={cn("bg-card text-card-foreground rounded-lg border shadow-sm", className)}
      {...props}
    />
  );
};

const CardHeader: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  );
};

const CardTitle: FC<HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-2xl leading-none font-semibold tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription: FC<HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
};

const CardContent: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return <div data-slot="card-content" className={cn("p-6 pt-0", className)} {...props} />;
};

const CardFooter: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
