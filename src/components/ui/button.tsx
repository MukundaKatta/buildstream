"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-sm",
      secondary: "bg-surface-100 text-surface-800 hover:bg-surface-200 focus:ring-surface-400",
      ghost: "text-surface-600 hover:bg-surface-100 hover:text-surface-900 focus:ring-surface-400",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
      outline: "border border-surface-300 text-surface-700 hover:bg-surface-50 focus:ring-brand-500",
    };

    const sizes = {
      sm: "text-xs px-2.5 py-1.5 gap-1",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-6 py-3 gap-2",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
