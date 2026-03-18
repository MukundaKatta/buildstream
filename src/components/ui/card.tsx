"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className, onClick, hover }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-surface-200 shadow-sm",
        hover && "hover:shadow-md hover:border-surface-300 transition-all duration-200 cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-4 border-b border-surface-100", className)}>{children}</div>
  );
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-3 border-t border-surface-100 bg-surface-50 rounded-b-xl", className)}>
      {children}
    </div>
  );
}
