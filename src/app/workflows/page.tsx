"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useWorkflowStore } from "@/store/workflow-store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { AppType } from "@/types";
import {
  Plus,
  Search,
  Bot,
  FileText,
  Cpu,
  Workflow,
  Copy,
  Trash2,
  MoreVertical,
  Filter,
} from "lucide-react";

const appTypeIcons: Record<string, React.ElementType> = {
  chatbot: Bot,
  text_generator: FileText,
  agent: Cpu,
  workflow: Workflow,
};

const appTypeLabels: Record<string, string> = {
  chatbot: "Chatbot",
  text_generator: "Text Generator",
  agent: "Agent",
  workflow: "Workflow",
};

export default function WorkflowsPage() {
  const { workflows, createWorkflow, deleteWorkflow, duplicateWorkflow } = useWorkflowStore();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState<AppType>("chatbot");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = workflows.filter((wf) => {
    if (search && !wf.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== "all" && wf.app_type !== filterType) return false;
    if (filterStatus !== "all" && wf.status !== filterStatus) return false;
    return true;
  });

  const handleCreate = () => {
    if (!newName.trim()) return;
    const wf = createWorkflow(newName.trim(), newDescription.trim(), newType);
    setShowCreateModal(false);
    setNewName("");
    setNewDescription("");
    router.push(`/workflows/${wf.id}/edit`);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Workflows</h1>
            <p className="text-sm text-surface-500 mt-0.5">
              Create and manage your AI workflows
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            New Workflow
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: "all", label: "All Types" },
              { value: "chatbot", label: "Chatbot" },
              { value: "text_generator", label: "Text Generator" },
              { value: "agent", label: "Agent" },
              { value: "workflow", label: "Workflow" },
            ]}
          />
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: "all", label: "All Status" },
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((wf) => {
            const Icon = appTypeIcons[wf.app_type] || Workflow;
            return (
              <div
                key={wf.id}
                className="bg-white rounded-xl border border-surface-200 shadow-sm hover:shadow-md hover:border-surface-300 transition-all cursor-pointer group relative"
              >
                <div
                  className="p-5"
                  onClick={() => router.push(`/workflows/${wf.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand-600" />
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === wf.id ? null : wf.id);
                        }}
                        className="p-1 text-surface-400 hover:text-surface-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuOpen === wf.id && (
                        <div className="absolute right-0 top-8 w-40 bg-white border border-surface-200 rounded-lg shadow-lg z-10 py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/workflows/${wf.id}/edit`);
                              setMenuOpen(null);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-surface-700 hover:bg-surface-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateWorkflow(wf.id);
                              setMenuOpen(null);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-surface-700 hover:bg-surface-50 flex items-center gap-2"
                          >
                            <Copy className="w-3.5 h-3.5" /> Duplicate
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteWorkflow(wf.id);
                              setMenuOpen(null);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-surface-900 mb-1">{wf.name}</h3>
                  <p className="text-xs text-surface-500 line-clamp-2 mb-3">{wf.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        wf.status === "published"
                          ? "success"
                          : wf.status === "draft"
                          ? "warning"
                          : "default"
                      }
                    >
                      {wf.status}
                    </Badge>
                    <Badge variant="purple">{appTypeLabels[wf.app_type]}</Badge>
                  </div>
                </div>
                <div className="px-5 py-3 border-t border-surface-100 flex items-center justify-between text-xs text-surface-500">
                  <span>v{wf.version}</span>
                  <span>{wf.blocks.length} blocks</span>
                  <span>{formatDate(wf.updated_at)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-surface-400">
            <Workflow className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No workflows found</p>
            <p className="text-sm mt-1">Try adjusting your filters or create a new workflow</p>
          </div>
        )}

        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Workflow"
        >
          <div className="space-y-4">
            <Input
              label="Workflow Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="My AI Workflow"
            />
            <Textarea
              label="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What does this workflow do?"
              rows={3}
            />
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">App Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(["chatbot", "text_generator", "agent", "workflow"] as AppType[]).map((type) => {
                  const Icon = appTypeIcons[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setNewType(type)}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        newType === type
                          ? "border-brand-500 bg-brand-50"
                          : "border-surface-200 hover:border-surface-300"
                      }`}
                    >
                      <Icon className="w-5 h-5 text-surface-600" />
                      <span className="text-sm font-medium">{appTypeLabels[type]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!newName.trim()}>
                Create Workflow
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
