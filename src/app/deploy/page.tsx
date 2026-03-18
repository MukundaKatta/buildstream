"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useAppStore } from "@/store/app-store";
import { useWorkflowStore } from "@/store/workflow-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { DeployTarget, Deployment } from "@/types";
import {
  Plus,
  Rocket,
  Globe,
  MessageCircle,
  Monitor,
  Copy,
  Trash2,
  Power,
  PowerOff,
  Key,
  ExternalLink,
  Code,
} from "lucide-react";

const targetIcons: Record<string, React.ElementType> = {
  api: Globe,
  widget: MessageCircle,
  webapp: Monitor,
};

const targetLabels: Record<string, string> = {
  api: "API Endpoint",
  widget: "Chat Widget",
  webapp: "Web App",
};

export default function DeployPage() {
  const { deployments, createDeployment, deleteDeployment, toggleDeployment } = useAppStore();
  const { workflows } = useWorkflowStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState<Deployment | null>(null);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState("");
  const [selectedTarget, setSelectedTarget] = useState<DeployTarget>("api");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const publishedWorkflows = workflows.filter((w) => w.status === "published");

  const handleCreate = () => {
    if (!selectedWorkflowId) return;
    const wf = workflows.find((w) => w.id === selectedWorkflowId);
    if (!wf) return;
    createDeployment(selectedWorkflowId, wf.name, selectedTarget);
    setShowCreateModal(false);
    setSelectedWorkflowId("");
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getEmbedCode = (dep: Deployment) => {
    if (dep.target === "widget") {
      return `<script src="https://buildstream.dev/widget.js" data-deployment="${dep.id}" data-api-key="${dep.api_key}"></script>`;
    }
    if (dep.target === "api") {
      return `curl -X POST ${dep.url} \\\n  -H "Authorization: Bearer ${dep.api_key}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"message": "Hello"}'`;
    }
    return dep.url;
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Deployments</h1>
            <p className="text-sm text-surface-500 mt-0.5">
              Publish workflows as API endpoints, widgets, or web apps
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            New Deployment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deployments.map((dep) => {
            const Icon = targetIcons[dep.target] || Globe;
            return (
              <Card key={dep.id}>
                <CardContent>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-surface-900">{dep.workflow_name}</h3>
                        <p className="text-xs text-surface-500">{targetLabels[dep.target]}</p>
                      </div>
                    </div>
                    <Badge variant={dep.status === "active" ? "success" : dep.status === "error" ? "danger" : "default"}>
                      {dep.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-surface-50 rounded-lg px-3 py-2">
                      <ExternalLink className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
                      <span className="text-xs text-surface-600 truncate flex-1">{dep.url}</span>
                      <button
                        onClick={() => copyToClipboard(dep.url, `url-${dep.id}`)}
                        className="p-1 text-surface-400 hover:text-surface-600 flex-shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {copiedId === `url-${dep.id}` && (
                        <span className="text-[10px] text-green-600">Copied!</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 bg-surface-50 rounded-lg px-3 py-2">
                      <Key className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
                      <span className="text-xs text-surface-600 truncate flex-1 font-mono">
                        {dep.api_key.slice(0, 12)}...
                      </span>
                      <button
                        onClick={() => copyToClipboard(dep.api_key, `key-${dep.id}`)}
                        className="p-1 text-surface-400 hover:text-surface-600 flex-shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {copiedId === `key-${dep.id}` && (
                        <span className="text-[10px] text-green-600">Copied!</span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <span className="text-xs text-surface-500">{formatDate(dep.created_at)}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowEmbedModal(dep)}
                    >
                      <Code className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleDeployment(dep.id)}
                      title={dep.status === "active" ? "Deactivate" : "Activate"}
                    >
                      {dep.status === "active" ? (
                        <PowerOff className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <Power className="w-3.5 h-3.5 text-green-600" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => deleteDeployment(dep.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {deployments.length === 0 && (
          <div className="text-center py-16 text-surface-400">
            <Rocket className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No deployments yet</p>
            <p className="text-sm mt-1">Deploy a published workflow to get started</p>
          </div>
        )}

        {/* Create Modal */}
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Deployment">
          <div className="space-y-4">
            <Select
              label="Workflow"
              value={selectedWorkflowId}
              onChange={(e) => setSelectedWorkflowId(e.target.value)}
              options={[
                { value: "", label: "Select a published workflow..." },
                ...publishedWorkflows.map((w) => ({ value: w.id, label: w.name })),
              ]}
            />
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Deploy As</label>
              <div className="grid grid-cols-3 gap-2">
                {(["api", "widget", "webapp"] as DeployTarget[]).map((target) => {
                  const Icon = targetIcons[target];
                  return (
                    <button
                      key={target}
                      onClick={() => setSelectedTarget(target)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        selectedTarget === target
                          ? "border-brand-500 bg-brand-50"
                          : "border-surface-200 hover:border-surface-300"
                      }`}
                    >
                      <Icon className="w-6 h-6 text-surface-600" />
                      <span className="text-xs font-medium">{targetLabels[target]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!selectedWorkflowId}>Deploy</Button>
            </div>
          </div>
        </Modal>

        {/* Embed Code Modal */}
        <Modal isOpen={!!showEmbedModal} onClose={() => setShowEmbedModal(null)} title="Embed Code" size="lg">
          {showEmbedModal && (
            <div className="space-y-4">
              <p className="text-sm text-surface-600">
                Use the code below to integrate this deployment into your application.
              </p>
              <div className="relative">
                <pre className="bg-surface-900 text-surface-100 p-4 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                  {getEmbedCode(showEmbedModal)}
                </pre>
                <button
                  onClick={() => copyToClipboard(getEmbedCode(showEmbedModal), `embed-${showEmbedModal.id}`)}
                  className="absolute top-2 right-2 p-1.5 bg-surface-700 text-surface-300 rounded hover:bg-surface-600 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {copiedId === `embed-${showEmbedModal.id}` && (
                  <span className="absolute top-2 right-10 text-xs text-green-400">Copied!</span>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AppLayout>
  );
}
