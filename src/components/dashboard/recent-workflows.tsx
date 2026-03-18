"use client";

import { useWorkflowStore } from "@/store/workflow-store";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusBg } from "@/lib/utils";
import { GitBranch, Bot, FileText, Cpu, Workflow } from "lucide-react";

const appTypeIcons = {
  chatbot: Bot,
  text_generator: FileText,
  agent: Cpu,
  workflow: Workflow,
};

export function RecentWorkflows() {
  const { workflows } = useWorkflowStore();
  const router = useRouter();

  const sorted = [...workflows].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm">
      <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-surface-900">Recent Workflows</h3>
        <button
          onClick={() => router.push("/workflows")}
          className="text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          View all
        </button>
      </div>
      <div className="divide-y divide-surface-100">
        {sorted.slice(0, 5).map((wf) => {
          const Icon = appTypeIcons[wf.app_type] || Workflow;
          return (
            <div
              key={wf.id}
              onClick={() => router.push(`/workflows/${wf.id}`)}
              className="px-6 py-3.5 flex items-center gap-4 hover:bg-surface-50 cursor-pointer transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-surface-100 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-surface-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 truncate">{wf.name}</p>
                <p className="text-xs text-surface-500 truncate">{wf.description}</p>
              </div>
              <Badge variant={wf.status === "published" ? "success" : wf.status === "draft" ? "warning" : "default"}>
                {wf.status}
              </Badge>
              <span className="text-xs text-surface-400 flex-shrink-0">{formatDate(wf.updated_at)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
