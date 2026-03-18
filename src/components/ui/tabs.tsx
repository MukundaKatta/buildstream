"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex border-b border-surface-200", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
            activeTab === tab.id
              ? "border-brand-600 text-brand-600"
              : "border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface TabPanelsProps {
  activeTab: string;
  children: Record<string, ReactNode>;
}

export function TabPanels({ activeTab, children }: TabPanelsProps) {
  return <div className="animate-fade-in">{children[activeTab] || null}</div>;
}
