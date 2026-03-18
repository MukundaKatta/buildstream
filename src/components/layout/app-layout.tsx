"use client";

import { ReactNode, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAppStore } from "@/store/app-store";
import { useWorkflowStore } from "@/store/workflow-store";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen, initialize } = useAppStore();
  const { loadWorkflows } = useWorkflowStore();

  useEffect(() => {
    initialize();
    loadWorkflows();
  }, [initialize, loadWorkflows]);

  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
