import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-[48px] w-full rounded-[12px] border border-[#E6EAF0] bg-white px-4 text-sm text-[#0B0F15] placeholder:text-[#9AA0A6] focus:outline-none focus:ring-2 focus:ring-[#1E63FF] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
