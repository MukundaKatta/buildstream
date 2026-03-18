"use client";

import { useWorkflowStore } from "@/store/workflow-store";
import { useAppStore } from "@/store/app-store";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Trash2, Copy, AlertTriangle } from "lucide-react";
import { WorkflowBlock, BlockConfig } from "@/types";
import { useState } from "react";

export function BlockConfigPanel() {
  const { currentWorkflow, selectedBlockId, selectBlock, updateBlock, updateBlockConfig, updateBlockErrorConfig, deleteBlock } =
    useWorkflowStore();
  const { knowledgeBases } = useAppStore();

  const block = currentWorkflow?.blocks.find((b) => b.id === selectedBlockId);
  if (!block) return null;

  return (
    <div className="w-80 bg-white border-l border-surface-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-surface-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-surface-900">Configure Block</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => deleteBlock(block.id)}
            className="p-1.5 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete block"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => selectBlock(null)}
            className="p-1.5 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Input
          label="Label"
          value={block.label}
          onChange={(e) => updateBlock(block.id, { label: e.target.value })}
        />

        <BlockTypeConfig
          block={block}
          onUpdateConfig={(config) => updateBlockConfig(block.id, config)}
          knowledgeBases={knowledgeBases}
        />

        <div className="border-t border-surface-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-medium text-surface-700">Error Handling</h4>
          </div>
          <div className="space-y-3">
            <Input
              label="Retry Count"
              type="number"
              min={0}
              max={10}
              value={block.error_config.retry_count}
              onChange={(e) =>
                updateBlockErrorConfig(block.id, { retry_count: parseInt(e.target.value) || 0 })
              }
            />
            <Input
              label="Retry Delay (ms)"
              type="number"
              min={0}
              step={500}
              value={block.error_config.retry_delay_ms}
              onChange={(e) =>
                updateBlockErrorConfig(block.id, { retry_delay_ms: parseInt(e.target.value) || 0 })
              }
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={block.error_config.notify_on_error}
                onChange={(e) =>
                  updateBlockErrorConfig(block.id, { notify_on_error: e.target.checked })
                }
                className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-surface-700">Notify on error</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockTypeConfig({
  block,
  onUpdateConfig,
  knowledgeBases,
}: {
  block: WorkflowBlock;
  onUpdateConfig: (config: Partial<BlockConfig>) => void;
  knowledgeBases: { id: string; name: string }[];
}) {
  switch (block.type) {
    case "llm":
      return <LLMConfig config={block.config.llm!} onUpdate={(llm) => onUpdateConfig({ llm })} />;
    case "knowledge_base":
      return (
        <KBConfig
          config={block.config.knowledge_base!}
          onUpdate={(knowledge_base) => onUpdateConfig({ knowledge_base })}
          knowledgeBases={knowledgeBases}
        />
      );
    case "code":
      return <CodeConfig config={block.config.code!} onUpdate={(code) => onUpdateConfig({ code })} />;
    case "http_request":
      return (
        <HTTPConfig
          config={block.config.http_request!}
          onUpdate={(http_request) => onUpdateConfig({ http_request })}
        />
      );
    case "condition":
      return (
        <ConditionConfig
          config={block.config.condition!}
          onUpdate={(condition) => onUpdateConfig({ condition })}
        />
      );
    case "variable":
      return (
        <VariableConfig
          config={block.config.variable!}
          onUpdate={(variable) => onUpdateConfig({ variable })}
        />
      );
    case "template":
      return (
        <TemplateConfig
          config={block.config.template!}
          onUpdate={(template) => onUpdateConfig({ template })}
        />
      );
    case "input":
      return (
        <InputConfig
          config={block.config.input!}
          onUpdate={(input) => onUpdateConfig({ input })}
        />
      );
    case "output":
      return (
        <OutputConfig
          config={block.config.output!}
          onUpdate={(output) => onUpdateConfig({ output })}
        />
      );
    default:
      return <p className="text-sm text-surface-500">No configuration available</p>;
  }
}

function LLMConfig({
  config,
  onUpdate,
}: {
  config: NonNullable<BlockConfig["llm"]>;
  onUpdate: (c: NonNullable<BlockConfig["llm"]>) => void;
}) {
  return (
    <div className="space-y-3">
      <Select
        label="Model"
        value={config.model}
        onChange={(e) => onUpdate({ ...config, model: e.target.value })}
        options={[
          { value: "gpt-4", label: "GPT-4" },
          { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
          { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
          { value: "claude-3-opus", label: "Claude 3 Opus" },
          { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
        ]}
      />
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Temperature: {config.temperature}
        </label>
        <input
          type="range"
          min={0}
          max={2}
          step={0.1}
          value={config.temperature}
          onChange={(e) => onUpdate({ ...config, temperature: parseFloat(e.target.value) })}
          className="w-full accent-brand-600"
        />
      </div>
      <Input
        label="Max Tokens"
        type="number"
        min={1}
        max={8000}
        value={config.max_tokens}
        onChange={(e) => onUpdate({ ...config, max_tokens: parseInt(e.target.value) || 1000 })}
      />
      <Textarea
        label="System Prompt"
        value={config.system_prompt}
        onChange={(e) => onUpdate({ ...config, system_prompt: e.target.value })}
        placeholder="You are a helpful assistant..."
        rows={3}
      />
      <Textarea
        label="User Prompt"
        value={config.user_prompt}
        onChange={(e) => onUpdate({ ...config, user_prompt: e.target.value })}
        placeholder="Use {{variable}} for variable injection"
        rows={4}
      />
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={config.stream}
          onChange={(e) => onUpdate({ ...config, stream: e.target.checked })}
          className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
        />
        <span className="text-sm text-surface-700">Stream response</span>
      </label>
    </div>
  );
}

function KBConfig({
  config,
  onUpdate,
  knowledgeBases,
}: {
  config: NonNullable<BlockConfig["knowledge_base"]>;
  onUpdate: (c: NonNullable<BlockConfig["knowledge_base"]>) => void;
  knowledgeBases: { id: string; name: string }[];
}) {
  return (
    <div className="space-y-3">
      <Select
        label="Knowledge Base"
        value={config.store_id}
        onChange={(e) => onUpdate({ ...config, store_id: e.target.value })}
        options={[
          { value: "", label: "Select a knowledge base..." },
          ...knowledgeBases.map((kb) => ({ value: kb.id, label: kb.name })),
        ]}
      />
      <Input
        label="Query Variable"
        value={config.query_variable}
        onChange={(e) => onUpdate({ ...config, query_variable: e.target.value })}
        placeholder="e.g., message"
      />
      <Input
        label="Top K Results"
        type="number"
        min={1}
        max={20}
        value={config.top_k}
        onChange={(e) => onUpdate({ ...config, top_k: parseInt(e.target.value) || 5 })}
      />
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">
          Similarity Threshold: {config.similarity_threshold}
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={config.similarity_threshold}
          onChange={(e) => onUpdate({ ...config, similarity_threshold: parseFloat(e.target.value) })}
          className="w-full accent-brand-600"
        />
      </div>
    </div>
  );
}

function CodeConfig({
  config,
  onUpdate,
}: {
  config: NonNullable<BlockConfig["code"]>;
  onUpdate: (c: NonNullable<BlockConfig["code"]>) => void;
}) {
  return (
    <div className="space-y-3">
      <Select
        label="Language"
        value={config.language}
        onChange={(e) => onUpdate({ ...config, language: e.target.value as "javascript" | "python" })}
        options={[
          { value: "javascript", label: "JavaScript" },
          { value: "python", label: "Python" },
        ]}
      />
      <Textarea
        label="Code"
        value={config.code}
        onChange={(e) => onUpdate({ ...config, code: e.target.value })}
        rows={8}
        className="font-mono text-xs"
      />
      <Input
        label="Timeout (ms)"
        type="number"
        min={100}
        max={30000}
        value={config.timeout_ms}
        onChange={(e) => onUpdate({ ...config, timeout_ms: parseInt(e.target.value) || 5000 })}
      />
    </div>
  );
}

function HTTPConfig({
  config,
  onUpdate,
}: {
  config: NonNullable<BlockConfig["http_request"]>;
  onUpdate: (c: NonNullable<BlockConfig["http_request"]>) => void;
}) {
  return (
    <div className="space-y-3">
      <Select
        label="Method"
        value={config.method}
        onChange={(e) => onUpdate({ ...config, method: e.target.value as "GET" | "POST" | "PUT" | "DELETE" | "PATCH" })}
        options={[
          { value: "GET", label: "GET" },
          { value: "POST", label: "POST" },
          { value: "PUT", label: "PUT" },
          { value: "DELETE", label: "DELETE" },
          { value: "PATCH", label: "PATCH" },
        ]}
      />
      <Input
        label="URL"
        value={config.url}
        onChange={(e) => onUpdate({ ...config, url: e.target.value })}
        placeholder="https://api.example.com/endpoint"
      />
      <Textarea
        label="Headers (JSON)"
        value={JSON.stringify(config.headers, null, 2)}
        onChange={(e) => {
          try {
            onUpdate({ ...config, headers: JSON.parse(e.target.value) });
          } catch {}
        }}
        rows={3}
        className="font-mono text-xs"
      />
      {config.method !== "GET" && (
        <Textarea
          label="Body"
          value={config.body}
          onChange={(e) => onUpdate({ ...config, body: e.target.value })}
          rows={4}
          className="font-mono text-xs"
        />
      )}
      <Input
        label="Timeout (ms)"
        type="number"
        min={100}
        max={60000}
        value={config.timeout_ms}
        onChange={(e) => onUpdate({ ...config, timeout_ms: parseInt(e.target.value) || 10000 })}
      />
    </div>
  );
}

function ConditionConfig({
  config,
  onUpdate,
}: {
  config: NonNullable<BlockConfig["condition"]>;
  onUpdate: (c: NonNullable<BlockConfig["condition"]>) => void;
}) {
  const addRule = () => {
    onUpdate({
      ...config,
      rules: [
        ...config.rules,
        { id: crypto.randomUUID(), variable: "", operator: "equals", value: "", output: "true" },
      ],
    });
  };

  const removeRule = (id: string) => {
    onUpdate({ ...config, rules: config.rules.filter((r) => r.id !== id) });
  };

  const updateRule = (id: string, updates: Partial<(typeof config.rules)[0]>) => {
    onUpdate({
      ...config,
      rules: config.rules.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-surface-700">Rules</label>
        <Button size="sm" variant="ghost" onClick={addRule}>
          + Add Rule
        </Button>
      </div>
      {config.rules.map((rule) => (
        <div key={rule.id} className="p-2 border border-surface-200 rounded-lg space-y-2">
          <Input
            placeholder="Variable name"
            value={rule.variable}
            onChange={(e) => updateRule(rule.id, { variable: e.target.value })}
          />
          <Select
            value={rule.operator}
            onChange={(e) => updateRule(rule.id, { operator: e.target.value as typeof rule.operator })}
            options={[
              { value: "equals", label: "Equals" },
              { value: "not_equals", label: "Not Equals" },
              { value: "contains", label: "Contains" },
              { value: "greater_than", label: "Greater Than" },
              { value: "less_than", label: "Less Than" },
              { value: "is_empty", label: "Is Empty" },
              { value: "is_not_empty", label: "Is Not Empty" },
            ]}
          />
          <Input
            placeholder="Value"
            value={rule.value}
            onChange={(e) => updateRule(rule.id, { value: e.target.value })}
          />
          <button
            onClick={() => removeRule(rule.id)}
            className="text-xs text-red-600 hover:underline"
          >
            Remove rule
          </button>
        </div>
      ))}
      <Input
        label="Default Output"
        value={config.default_output}
        onChange={(e) => onUpdate({ ...config, default_output: e.target.value })}
      />
    </div>
  );
}

function VariableConfig({
  config,
  onUpdate,
}: {
  config: NonNullable<BlockConfig["variable"]>;
  onUpdate: (c: NonNullable<BlockConfig["variable"]>) => void;
}) {
  return (
    <div className="space-y-3">
      <Input
        label="Variable Name"
        value={config.name}
        onChange={(e) => onUpdate({ ...config, name: e.target.value })}
        placeholder="my_variable"
      />
      <Select
        label="Type"
        value={config.type}
        onChange={(e) => onUpdate({ ...config, type: e.target.value as typeof config.type })}
        options={[
          { value: "string", label: "String" },
          { value: "number", label: "Number" },
          { value: "boolean", label: "Boolean" },
          { value: "json", label: "JSON" },
        ]}
      />
      <Input
        label="Default Value"
        value={config.default_value}
        onChange={(e) => onUpdate({ ...config, default_value: e.target.value })}
      />
      <Textarea
        label="Description"
        value={config.description}
        onChange={(e) => onUpdate({ ...config, description: e.target.value })}
        rows={2}
      />
    </div>
  );
}

function TemplateConfig({
  config,
  onUpdate,
}: {
  config: NonNullable<BlockConfig["template"]>;
  onUpdate: (c: NonNullable<BlockConfig["template"]>) => void;
}) {
  return (
    <div className="space-y-3">
      <Textarea
        label="Template"
        value={config.template}
        onChange={(e) => {
          const vars = e.target.value.match(/\{\{(\w+)\}\}/g)?.map((m) => m.replace(/\{\{|\}\}/g, "")) || [];
          onUpdate({ template: e.target.value, variables: [...new Set(vars)] });
        }}
        rows={6}
        placeholder="Use {{variable}} for variable injection"
        helpText="Variables will be auto-detected from {{variableName}} syntax"
      />
      {config.variables.length > 0 && (
        <div>
          <p className="text-xs font-medium text-surface-600 mb-1">Detected variables:</p>
          <div className="flex flex-wrap gap-1">
            {config.variables.map((v) => (
              <span key={v} className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InputConfig({
  config,
  onUpdate,
}: {
  config: NonNullable<BlockConfig["input"]>;
  onUpdate: (c: NonNullable<BlockConfig["input"]>) => void;
}) {
  const addField = () => {
    onUpdate({
      fields: [
        ...config.fields,
        { id: crypto.randomUUID(), name: "", type: "text", label: "", required: true },
      ],
    });
  };

  const removeField = (id: string) => {
    onUpdate({ fields: config.fields.filter((f) => f.id !== id) });
  };

  const updateField = (id: string, updates: Partial<(typeof config.fields)[0]>) => {
    onUpdate({ fields: config.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)) });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-surface-700">Input Fields</label>
        <Button size="sm" variant="ghost" onClick={addField}>
          + Add Field
        </Button>
      </div>
      {config.fields.map((field) => (
        <div key={field.id} className="p-2 border border-surface-200 rounded-lg space-y-2">
          <Input
            placeholder="Field name"
            value={field.name}
            onChange={(e) => updateField(field.id, { name: e.target.value })}
          />
          <Input
            placeholder="Label"
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
          />
          <Select
            value={field.type}
            onChange={(e) => updateField(field.id, { type: e.target.value as typeof field.type })}
            options={[
              { value: "text", label: "Text" },
              { value: "number", label: "Number" },
              { value: "boolean", label: "Boolean" },
              { value: "file", label: "File" },
              { value: "select", label: "Select" },
            ]}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField(field.id, { required: e.target.checked })}
              className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-xs text-surface-700">Required</span>
          </label>
          <button
            onClick={() => removeField(field.id)}
            className="text-xs text-red-600 hover:underline"
          >
            Remove field
          </button>
        </div>
      ))}
    </div>
  );
}

function OutputConfig({
  config,
  onUpdate,
}: {
  config: NonNullable<BlockConfig["output"]>;
  onUpdate: (c: NonNullable<BlockConfig["output"]>) => void;
}) {
  return (
    <div className="space-y-3">
      <Select
        label="Format"
        value={config.format}
        onChange={(e) => onUpdate({ ...config, format: e.target.value as typeof config.format })}
        options={[
          { value: "text", label: "Plain Text" },
          { value: "json", label: "JSON" },
          { value: "markdown", label: "Markdown" },
        ]}
      />
      <Textarea
        label="Output Template"
        value={config.template}
        onChange={(e) => onUpdate({ ...config, template: e.target.value })}
        rows={4}
        placeholder="{{result}}"
        helpText="Use {{variable}} to reference block outputs"
      />
    </div>
  );
}
