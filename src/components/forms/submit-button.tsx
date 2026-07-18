import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  (
    { isLoading = false, loadingText, children, className, disabled, ...props },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        type="submit"
        disabled={isLoading || disabled}
        className={cn("w-full cursor-pointer gap-2", className)}
        {...props}
      >
        {isLoading && <Spinner className="h-4 w-4" />}
        {isLoading ? (loadingText ?? children) : children}
      </Button>
    );
  },
);

SubmitButton.displayName = "SubmitButton";
