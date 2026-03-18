"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helpText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-surface-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-3 py-2 bg-white border border-surface-300 rounded-lg text-sm text-surface-900 placeholder:text-surface-400",
            "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
            "disabled:bg-surface-50 disabled:text-surface-500 disabled:cursor-not-allowed",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {helpText && !error && <p className="mt-1 text-xs text-surface-500">{helpText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helpText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-surface-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-3 py-2 bg-white border border-surface-300 rounded-lg text-sm text-surface-900 placeholder:text-surface-400",
            "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
            "disabled:bg-surface-50 disabled:text-surface-500 disabled:cursor-not-allowed resize-y min-h-[80px]",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {helpText && !error && <p className="mt-1 text-xs text-surface-500">{helpText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Input, Textarea };
