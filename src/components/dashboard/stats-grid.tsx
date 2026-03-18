"use client";

import { useWorkflowStore } from "@/store/workflow-store";
import { useAppStore } from "@/store/app-store";
import { GitBranch, Rocket, CheckCircle, AlertCircle, Timer, Coins } from "lucide-react";
import { formatNumber, formatDuration } from "@/lib/utils";

export function StatsGrid() {
  const { workflows } = useWorkflowStore();
  const { deployments, monitoringStats } = useAppStore();

  const stats = [
    {
      label: "Total Workflows",
      value: workflows.length.toString(),
      icon: GitBranch,
      color: "text-brand-600 bg-brand-100",
      change: "+2 this week",
    },
    {
      label: "Active Deployments",
      value: deployments.filter((d) => d.status === "active").length.toString(),
      icon: Rocket,
      color: "text-green-600 bg-green-100",
      change: "All healthy",
    },
    {
      label: "Success Rate",
      value: monitoringStats
        ? `${((monitoringStats.success_count / monitoringStats.total_runs) * 100).toFixed(1)}%`
        : "0%",
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-100",
      change: monitoringStats ? `${formatNumber(monitoringStats.total_runs)} total runs` : "",
    },
    {
      label: "Failure Count",
      value: monitoringStats ? formatNumber(monitoringStats.failure_count) : "0",
      icon: AlertCircle,
      color: "text-red-600 bg-red-100",
      change: "Last 7 days",
    },
    {
      label: "Avg Latency",
      value: monitoringStats ? formatDuration(monitoringStats.avg_latency_ms) : "0ms",
      icon: Timer,
      color: "text-blue-600 bg-blue-100",
      change: "Across all workflows",
    },
    {
      label: "Total Tokens",
      value: monitoringStats ? formatNumber(monitoringStats.total_tokens) : "0",
      icon: Coins,
      color: "text-amber-600 bg-amber-100",
      change: "Last 7 days",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-surface-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-surface-600">{stat.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
            <p className="text-xs text-surface-500 mt-1">{stat.change}</p>
          </div>
        );
      })}
    </div>
  );
}
