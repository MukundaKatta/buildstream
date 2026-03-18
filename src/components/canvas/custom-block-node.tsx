"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { cn, getBlockColor } from "@/lib/utils";
import {
  Brain,
  Database,
  Code,
  Globe,
  GitBranch,
  Variable,
  FileText,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertCircle,
} from "lucide-react";
import { BlockType } from "@/types";
import { useWorkflowStore } from "@/store/workflow-store";

const blockIcons: Record<string, React.ElementType> = {
  llm: Brain,
  knowledge_base: Database,
  code: Code,
  http_request: Globe,
  condition: GitBranch,
  variable: Variable,
  template: FileText,
  input: ArrowDownToLine,
  output: ArrowUpFromLine,
};

interface BlockNodeData {
  label: string;
  blockType: BlockType;
  config: Record<string, unknown>;
  errorConfig: { retry_count: number; notify_on_error: boolean };
}

function BlockNode({ data, id, selected }: NodeProps<BlockNodeData>) {
  const { selectedBlockId } = useWorkflowStore();
  const isSelected = selected || selectedBlockId === id;
  const Icon = blockIcons[data.blockType] || FileText;
  const colorClass = getBlockColor(data.blockType);

  const hasErrorConfig = data.errorConfig?.retry_count > 0;

  return (
    <div
      className={cn(
        "relative min-w-[200px] bg-white rounded-xl border-2 shadow-sm transition-all duration-150",
        isSelected
          ? "border-brand-500 shadow-lg shadow-brand-500/10 ring-4 ring-brand-500/10"
          : "border-surface-200 hover:border-surface-300 hover:shadow-md"
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-surface-300 !border-2 !border-white hover:!bg-brand-500 !-top-1.5"
      />

      <div className="p-3">
        <div className="flex items-center gap-2.5">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", colorClass)}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-surface-900 truncate">{data.label}</p>
            <p className="text-xs text-surface-500 capitalize">{data.blockType.replace("_", " ")}</p>
          </div>
          {hasErrorConfig && (
            <div className="flex-shrink-0" title={`${data.errorConfig.retry_count} retries configured`}>
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            </div>
          )}
        </div>
      </div>

      {data.blockType === "condition" ? (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="!w-3 !h-3 !bg-green-500 !border-2 !border-white !-bottom-1.5 !left-1/3"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="!w-3 !h-3 !bg-red-500 !border-2 !border-white !-bottom-1.5 !left-2/3"
          />
          <div className="flex justify-between px-8 pb-1">
            <span className="text-[10px] text-green-600 font-medium">True</span>
            <span className="text-[10px] text-red-600 font-medium">False</span>
          </div>
        </>
      ) : (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-surface-300 !border-2 !border-white hover:!bg-brand-500 !-bottom-1.5"
        />
      )}
    </div>
  );
}

export const CustomBlockNode = memo(BlockNode);
