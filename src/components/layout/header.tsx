"use client";

import { useAppStore } from "@/store/app-store";
import { Bell, Search, User } from "lucide-react";

export function Header() {
  const { user } = useAppStore();

  return (
    <header className="h-16 border-b border-surface-200 bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search workflows, prompts, knowledge bases..."
            className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-surface-200">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
            <User className="w-4 h-4 text-brand-600" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-surface-900">{user?.name || "User"}</p>
            <p className="text-xs text-surface-500">{user?.email || ""}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
