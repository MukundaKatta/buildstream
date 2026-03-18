"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkflowStore } from "@/store/workflow-store";
import { WorkflowCanvas } from "@/components/canvas/workflow-canvas";
import { BlockPalette } from "@/components/canvas/block-palette";
import { BlockConfigPanel } from "@/components/canvas/block-config-panel";
import { VariablePanel } from "@/components/canvas/variable-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabPanels } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Rocket,
  Play,
  Undo2,
  Variable,
  Layers,
} from "lucide-react";

export default function WorkflowEditPage() {
  const params = useParams();
  const router = useRouter();
  const {
    setCurrentWorkflow,
    currentWorkflow,
    selectedBlockId,
    isDirty,
    publishWorkflow,
    markClean,
  } = useWorkflowStore();

  const [rightTab, setRightTab] = useState<string>("config");

  const id = params.id as string;

  useEffect(() => {
    setCurrentWorkflow(id);
  }, [id, setCurrentWorkflow]);

  if (!currentWorkflow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center">
          <p className="text-surface-500">Loading workflow...</p>
          <Button variant="secondary" onClick={() => router.push("/workflows")} className="mt-4">
            Back to Workflows
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-surface-50">
      {/* Top toolbar */}
      <div className="h-14 bg-white border-b border-surface-200 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/workflows/${currentWorkflow.id}`)}
            className="p-1.5 text-surface-400 hover:text-surface-600 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="border-l border-surface-200 pl-3">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-surface-900">{currentWorkflow.name}</h1>
              <Badge
                variant={
                  currentWorkflow.status === "published"
                    ? "success"
                    : currentWorkflow.status === "draft"
                    ? "warning"
                    : "default"
                }
                size="sm"
              >
                {currentWorkflow.status}
              </Badge>
              {isDirty && (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Unsaved changes
                </span>
              )}
            </div>
            <p className="text-xs text-surface-500">v{currentWorkflow.version}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={markClean}>
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Play className="w-4 h-4" />
            Test Run
          </Button>
          <Button size="sm" onClick={publishWorkflow}>
            <Rocket className="w-4 h-4" />
            Publish
          </Button>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Block palette (left) */}
        <BlockPalette />

        {/* Canvas (center) */}
        <div className="flex-1 relative">
          <WorkflowCanvas />
        </div>

        {/* Right panel */}
        <div className="w-80 bg-white border-l border-surface-200 flex flex-col overflow-hidden">
          <div className="border-b border-surface-200">
            <Tabs
              tabs={[
                { id: "config", label: "Config", icon: <Layers className="w-3.5 h-3.5" /> },
                { id: "variables", label: "Variables", icon: <Variable className="w-3.5 h-3.5" /> },
              ]}
              activeTab={rightTab}
              onChange={setRightTab}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {rightTab === "config" ? (
              selectedBlockId ? (
                <BlockConfigPanel />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-surface-400 p-6 text-center">
                  <Layers className="w-10 h-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium">No block selected</p>
                  <p className="text-xs mt-1">Click a block on the canvas to configure it</p>
                </div>
              )
            ) : (
              <VariablePanel />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
