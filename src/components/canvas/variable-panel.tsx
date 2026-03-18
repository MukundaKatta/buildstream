"use client";

import { useWorkflowStore } from "@/store/workflow-store";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

export function VariablePanel() {
  const { currentWorkflow, addVariable, updateVariable, deleteVariable } = useWorkflowStore();

  if (!currentWorkflow) return null;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-surface-900">Variables</h3>
          <p className="text-xs text-surface-500">Define variables to pass data between blocks</p>
        </div>
        <Button
          size="sm"
          onClick={() =>
            addVariable({
              name: `variable_${currentWorkflow.variables.length + 1}`,
              type: "string",
              default_value: "",
              description: "",
              scope: "global",
            })
          }
        >
          <Plus className="w-3.5 h-3.5" />
          Add Variable
        </Button>
      </div>

      {currentWorkflow.variables.length === 0 ? (
        <div className="text-center py-8 text-surface-400 text-sm">
          No variables defined yet. Add a variable to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {currentWorkflow.variables.map((variable) => (
            <div
              key={variable.id}
              className="p-3 border border-surface-200 rounded-lg space-y-2 bg-surface-50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  {`{{${variable.name}}}`}
                </span>
                <button
                  onClick={() => deleteVariable(variable.id)}
                  className="p-1 text-surface-400 hover:text-red-600 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Name"
                  value={variable.name}
                  onChange={(e) => updateVariable(variable.id, { name: e.target.value })}
                />
                <Select
                  value={variable.type}
                  onChange={(e) =>
                    updateVariable(variable.id, {
                      type: e.target.value as "string" | "number" | "boolean" | "json",
                    })
                  }
                  options={[
                    { value: "string", label: "String" },
                    { value: "number", label: "Number" },
                    { value: "boolean", label: "Boolean" },
                    { value: "json", label: "JSON" },
                  ]}
                />
              </div>
              <Input
                placeholder="Default value"
                value={variable.default_value}
                onChange={(e) => updateVariable(variable.id, { default_value: e.target.value })}
              />
              <Input
                placeholder="Description"
                value={variable.description}
                onChange={(e) => updateVariable(variable.id, { description: e.target.value })}
              />
              <Select
                value={variable.scope}
                onChange={(e) =>
                  updateVariable(variable.id, { scope: e.target.value as "global" | "local" })
                }
                options={[
                  { value: "global", label: "Global" },
                  { value: "local", label: "Local" },
                ]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
