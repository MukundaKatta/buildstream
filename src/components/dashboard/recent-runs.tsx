"use client";

import { useAppStore } from "@/store/app-store";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatDuration, formatNumber } from "@/lib/utils";

export function RecentRuns() {
  const { runs } = useAppStore();
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm">
      <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-surface-900">Recent Runs</h3>
        <button
          onClick={() => router.push("/monitoring")}
          className="text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          View all
        </button>
      </div>
      <div className="divide-y divide-surface-100">
        {runs.slice(0, 5).map((run) => (
          <div
            key={run.id}
            className="px-6 py-3.5 flex items-center gap-4 hover:bg-surface-50 cursor-pointer transition-colors"
            onClick={() => router.push("/monitoring")}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900 truncate">{run.workflow_name}</p>
              <p className="text-xs text-surface-500">{formatDateTime(run.started_at)}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <Badge
                variant={
                  run.status === "success"
                    ? "success"
                    : run.status === "failed"
                    ? "danger"
                    : run.status === "running"
                    ? "info"
                    : "default"
                }
              >
                {run.status}
              </Badge>
              <div className="flex items-center gap-3 mt-1 text-xs text-surface-500">
                {run.duration_ms && <span>{formatDuration(run.duration_ms)}</span>}
                <span>{formatNumber(run.token_usage.total_tokens)} tokens</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
