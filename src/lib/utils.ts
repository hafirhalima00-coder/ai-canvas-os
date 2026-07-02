import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(4)}`;
}

export function formatDate(ts: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(ts);
}

export function truncate(str: string, len = 80): string {
  return str.length > len ? str.slice(0, len) + "..." : str;
}

export function getBlockTypeColor(type: string): string {
  const colors: Record<string, string> = {
    research: "#3b82f6",
    writer: "#8b5cf6",
    analyst: "#f59e0b",
    coder: "#10b981",
    crm: "#ec4899",
    email: "#ef4444",
    image: "#14b8a6",
    approval: "#f97316",
  };
  return colors[type] ?? "#6b7280";
}

export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}
