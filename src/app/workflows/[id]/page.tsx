"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { useWorkflowStore } from "@/store/workflow-store";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  ArrowLeft,
  Edit3,
  Rocket,
  Copy,
  Trash2,
  GitBranch,
  Clock,
  Layers,
  Eye,
} from "lucide-react";

export default function WorkflowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { workflows, setCurrentWorkflow, currentWorkflow, duplicateWorkflow, deleteWorkflow, publishWorkflow } =
    useWorkflowStore();
  const { deployments } = useAppStore();

  const id = params.id as string;

  useEffect(() => {
    setCurrentWorkflow(id);
  }, [id, setCurrentWorkflow]);

  const workflow = currentWorkflow || workflows.find((w) => w.id === id);

  if (!workflow) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto text-center py-16">
          <p className="text-surface-500">Workflow not found</p>
          <Button variant="secondary" onClick={() => router.push("/workflows")} className="mt-4">
            Back to Workflows
          </Button>
        </div>
      </AppLayout>
    );
  }

  const workflowDeployments = deployments.filter((d) => d.workflow_id === workflow.id);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/workflows")}
            className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-surface-900">{workflow.name}</h1>
              <Badge
                variant={
                  workflow.status === "published" ? "success" : workflow.status === "draft" ? "warning" : "default"
                }
              >
                {workflow.status}
              </Badge>
            </div>
            <p className="text-sm text-surface-500 mt-0.5">{workflow.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push(`/workflows/${workflow.id}/edit`)}>
              <Edit3 className="w-4 h-4" />
              Edit
            </Button>
            {workflow.status === "draft" && (
              <Button onClick={() => publishWorkflow()}>
                <Rocket className="w-4 h-4" />
                Publish
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900">{workflow.blocks.length}</p>
                <p className="text-xs text-surface-500">Blocks</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900">{workflow.edges.length}</p>
                <p className="text-xs text-surface-500">Connections</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900">v{workflow.version}</p>
                <p className="text-xs text-surface-500">Version</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-surface-900">{formatDate(workflow.updated_at)}</p>
                <p className="text-xs text-surface-500">Last updated</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <div className="px-6 py-4 border-b border-surface-100">
            <h3 className="text-sm font-semibold text-surface-900">Blocks</h3>
          </div>
          <div className="divide-y divide-surface-100">
            {workflow.blocks.map((block) => (
              <div key={block.id} className="px-6 py-3 flex items-center gap-4">
                <Badge variant="purple">{block.type.replace("_", " ")}</Badge>
                <span className="text-sm font-medium text-surface-900">{block.label}</span>
                {block.error_config.retry_count > 0 && (
                  <span className="text-xs text-surface-400">
                    {block.error_config.retry_count} retries
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {workflow.variables.length > 0 && (
          <Card>
            <div className="px-6 py-4 border-b border-surface-100">
              <h3 className="text-sm font-semibold text-surface-900">Variables</h3>
            </div>
            <div className="divide-y divide-surface-100">
              {workflow.variables.map((v) => (
                <div key={v.id} className="px-6 py-3 flex items-center gap-4">
                  <code className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded font-mono">
                    {`{{${v.name}}}`}
                  </code>
                  <Badge>{v.type}</Badge>
                  <span className="text-sm text-surface-500 flex-1">{v.description}</span>
                  <Badge variant={v.scope === "global" ? "info" : "default"}>{v.scope}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {workflowDeployments.length > 0 && (
          <Card>
            <div className="px-6 py-4 border-b border-surface-100">
              <h3 className="text-sm font-semibold text-surface-900">Deployments</h3>
            </div>
            <div className="divide-y divide-surface-100">
              {workflowDeployments.map((dep) => (
                <div key={dep.id} className="px-6 py-3 flex items-center gap-4">
                  <Badge variant={dep.status === "active" ? "success" : "default"}>{dep.status}</Badge>
                  <Badge variant="purple">{dep.target}</Badge>
                  <span className="text-sm text-surface-600 truncate flex-1">{dep.url}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex items-center gap-2 pt-4 border-t border-surface-200">
          <Button
            variant="ghost"
            onClick={() => {
              const dup = duplicateWorkflow(workflow.id);
              router.push(`/workflows/${dup.id}`);
            }}
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </Button>
          <Button
            variant="ghost"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => {
              deleteWorkflow(workflow.id);
              router.push("/workflows");
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
