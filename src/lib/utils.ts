import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function extractVariables(template: string): string[] {
  const matches = template.match(/\{\{(\w+)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "")))];
}

export function interpolateTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): T {
  let timer: NodeJS.Timeout;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

export function getBlockColor(type: string): string {
  const colors: Record<string, string> = {
    llm: "bg-purple-500",
    knowledge_base: "bg-blue-500",
    code: "bg-green-500",
    http_request: "bg-orange-500",
    condition: "bg-yellow-500",
    variable: "bg-teal-500",
    template: "bg-pink-500",
    input: "bg-indigo-500",
    output: "bg-red-500",
  };
  return colors[type] || "bg-gray-500";
}

export function getBlockIcon(type: string): string {
  const icons: Record<string, string> = {
    llm: "Brain",
    knowledge_base: "Database",
    code: "Code",
    http_request: "Globe",
    condition: "GitBranch",
    variable: "Variable",
    template: "FileText",
    input: "ArrowDownToLine",
    output: "ArrowUpFromLine",
  };
  return icons[type] || "Box";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    success: "text-green-500",
    running: "text-blue-500",
    pending: "text-yellow-500",
    failed: "text-red-500",
    cancelled: "text-gray-500",
    active: "text-green-500",
    inactive: "text-gray-500",
    error: "text-red-500",
    draft: "text-yellow-500",
    published: "text-green-500",
    archived: "text-gray-500",
    ready: "text-green-500",
    processing: "text-blue-500",
  };
  return colors[status] || "text-gray-500";
}

export function getStatusBg(status: string): string {
  const colors: Record<string, string> = {
    success: "bg-green-100 text-green-800",
    running: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    error: "bg-red-100 text-red-800",
    draft: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800",
    ready: "bg-green-100 text-green-800",
    processing: "bg-blue-100 text-blue-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}
