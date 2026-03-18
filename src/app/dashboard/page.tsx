"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RecentWorkflows } from "@/components/dashboard/recent-workflows";
import { RecentRuns } from "@/components/dashboard/recent-runs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
            <p className="text-sm text-surface-500 mt-0.5">
              Overview of your AI workflows and deployments
            </p>
          </div>
          <Button onClick={() => router.push("/workflows")}>
            <Plus className="w-4 h-4" />
            New Workflow
          </Button>
        </div>

        <StatsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentWorkflows />
          <RecentRuns />
        </div>
      </div>
    </AppLayout>
  );
}
