"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import {
  LayoutDashboard,
  GitBranch,
  Database,
  MessageSquare,
  Rocket,
  BarChart3,
  Store,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workflows", label: "Workflows", icon: GitBranch },
  { href: "/knowledge", label: "Knowledge Base", icon: Database },
  { href: "/prompts", label: "Prompt Studio", icon: MessageSquare },
  { href: "/deploy", label: "Deployments", icon: Rocket },
  { href: "/monitoring", label: "Monitoring", icon: BarChart3 },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-surface-900 text-white flex flex-col transition-all duration-300 z-40",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-700/50">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {sidebarOpen && (
          <span className="text-lg font-bold tracking-tight">BuildStream</span>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-brand-600/20 text-brand-400"
                      : "text-surface-400 hover:bg-surface-800 hover:text-white"
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center h-12 border-t border-surface-700/50 text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
      >
        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
    </aside>
  );
}
