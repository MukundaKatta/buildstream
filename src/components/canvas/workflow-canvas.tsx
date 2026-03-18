"use client";

import { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeTypes,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { useWorkflowStore } from "@/store/workflow-store";
import { CustomBlockNode } from "./custom-block-node";
import { BlockType } from "@/types";

const nodeTypes: NodeTypes = {
  customBlock: CustomBlockNode,
};

export function WorkflowCanvas() {
  const { currentWorkflow, addBlock, moveBlock, addEdge: addWorkflowEdge, deleteEdge, deleteBlock, selectBlock } =
    useWorkflowStore();

  const nodes: Node[] = useMemo(() => {
    if (!currentWorkflow) return [];
    return currentWorkflow.blocks.map((block) => ({
      id: block.id,
      type: "customBlock",
      position: block.position,
      data: {
        label: block.label,
        blockType: block.type,
        config: block.config,
        errorConfig: block.error_config,
      },
    }));
  }, [currentWorkflow]);

  const edges: Edge[] = useMemo(() => {
    if (!currentWorkflow) return [];
    return currentWorkflow.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.source_handle,
      targetHandle: edge.target_handle,
      label: edge.label,
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
    }));
  }, [currentWorkflow]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((change) => {
        if (change.type === "position" && change.position && change.id) {
          moveBlock(change.id, change.position);
        }
        if (change.type === "remove" && change.id) {
          deleteBlock(change.id);
        }
      });
    },
    [moveBlock, deleteBlock]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      changes.forEach((change) => {
        if (change.type === "remove" && change.id) {
          deleteEdge(change.id);
        }
      });
    },
    [deleteEdge]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        addWorkflowEdge({
          source: connection.source,
          target: connection.target,
          source_handle: connection.sourceHandle || null,
          target_handle: connection.targetHandle || null,
        });
      }
    },
    [addWorkflowEdge]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectBlock(node.id);
    },
    [selectBlock]
  );

  const onPaneClick = useCallback(() => {
    selectBlock(null);
  }, [selectBlock]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const blockType = event.dataTransfer.getData("application/buildstream-block") as BlockType;
      if (!blockType) return;

      const reactFlowBounds = (event.target as HTMLElement).closest(".react-flow")?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 30,
      };

      addBlock(blockType, position);
    },
    [addBlock]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  if (!currentWorkflow) {
    return (
      <div className="flex items-center justify-center h-full text-surface-400">
        <p>Select or create a workflow to get started</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[16, 16]}
        deleteKeyCode="Delete"
        className="bg-surface-50"
      >
        <Background color="#e2e8f0" gap={16} size={1} />
        <Controls className="bg-white border border-surface-200 rounded-lg shadow-sm" />
        <MiniMap
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              llm: "#a855f7",
              knowledge_base: "#3b82f6",
              code: "#22c55e",
              http_request: "#f97316",
              condition: "#eab308",
              variable: "#14b8a6",
              template: "#ec4899",
              input: "#6366f1",
              output: "#ef4444",
            };
            return colors[node.data?.blockType] || "#94a3b8";
          }}
          className="bg-white border border-surface-200 rounded-lg shadow-sm"
        />
      </ReactFlow>
    </div>
  );
}
