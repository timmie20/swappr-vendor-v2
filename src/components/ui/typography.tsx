import React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type TypographyProps = {
  variant?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "a";
  component?: React.ElementType;
  className?: string;
  href?: string;
  target?: string;
  children: React.ReactNode;
};

const Typography = ({
  variant = "span",
  component,
  className,
  href,
  target = undefined,
  children,
}: TypographyProps) => {
  const classNameVariants = {
    h1: "text-center text-4xl font-extrabold tracking-tight text-balance",
    h2: "text-3xl font-semibold tracking-tight ",
    h3: "text-2xl font-semibold tracking-tight",
    h4: "text-xl font-semibold tracking-tight",
    p: "leading-7 [&:not(:first-child)]:mt-6",
    span: "",
    a: "text-sm md:text-base text-primary underline-offset-4 hover:underline transition-colors",
  };

  const mergedClassName = cn(classNameVariants[variant], className);

  if (variant === "a" && href) {
    return (
      <Link
        href={href}
        target={target}
        className={`scroll-m-20 ${mergedClassName}`}
      >
        {children}
      </Link>
    );
  }

  return React.createElement(
    component || variant,
    { className: mergedClassName || undefined },
    children,
  );
};

export default Typography;
