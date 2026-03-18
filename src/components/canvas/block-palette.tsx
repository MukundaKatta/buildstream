"use client";

import { cn, getBlockColor } from "@/lib/utils";
import { BlockType } from "@/types";
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
} from "lucide-react";

const blocks: { type: BlockType; label: string; description: string; icon: React.ElementType }[] = [
  { type: "input", label: "Input", description: "Receive user input", icon: ArrowDownToLine },
  { type: "output", label: "Output", description: "Return final result", icon: ArrowUpFromLine },
  { type: "llm", label: "LLM", description: "AI language model", icon: Brain },
  { type: "knowledge_base", label: "Knowledge Base", description: "Vector search", icon: Database },
  { type: "code", label: "Code", description: "Run custom code", icon: Code },
  { type: "http_request", label: "HTTP Request", description: "Call external APIs", icon: Globe },
  { type: "condition", label: "Condition", description: "Branch logic", icon: GitBranch },
  { type: "variable", label: "Variable", description: "Store/transform data", icon: Variable },
  { type: "template", label: "Template", description: "Text templating", icon: FileText },
];

export function BlockPalette() {
  const onDragStart = (event: React.DragEvent, blockType: BlockType) => {
    event.dataTransfer.setData("application/buildstream-block", blockType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 bg-white border-r border-surface-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-surface-200">
        <h3 className="text-sm font-semibold text-surface-900">Blocks</h3>
        <p className="text-xs text-surface-500 mt-0.5">Drag blocks onto the canvas</p>
      </div>
      <div className="p-3 space-y-1.5">
        {blocks.map((block) => {
          const Icon = block.icon;
          return (
            <div
              key={block.type}
              draggable
              onDragStart={(e) => onDragStart(e, block.type)}
              className="flex items-center gap-3 p-2.5 rounded-lg border border-surface-200 bg-white hover:bg-surface-50 hover:border-surface-300 cursor-grab active:cursor-grabbing transition-all duration-150 group"
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  getBlockColor(block.type)
                )}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-surface-800 group-hover:text-surface-900">
                  {block.label}
                </p>
                <p className="text-xs text-surface-500">{block.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
