import { create } from "zustand";
import { produce } from "immer";
import {
  Workflow,
  WorkflowBlock,
  WorkflowEdge,
  WorkflowVariable,
  BlockType,
  BlockConfig,
  ErrorConfig,
  AppType,
} from "@/types";
import { generateId } from "@/lib/utils";
import { mockWorkflows } from "@/lib/mock-data";

interface WorkflowState {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  selectedBlockId: string | null;
  isDirty: boolean;

  loadWorkflows: () => void;
  setCurrentWorkflow: (id: string) => void;
  createWorkflow: (name: string, description: string, appType: AppType) => Workflow;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  duplicateWorkflow: (id: string) => Workflow;

  addBlock: (type: BlockType, position: { x: number; y: number }) => WorkflowBlock;
  updateBlock: (blockId: string, updates: Partial<WorkflowBlock>) => void;
  updateBlockConfig: (blockId: string, config: Partial<BlockConfig>) => void;
  updateBlockErrorConfig: (blockId: string, errorConfig: Partial<ErrorConfig>) => void;
  deleteBlock: (blockId: string) => void;
  selectBlock: (blockId: string | null) => void;
  moveBlock: (blockId: string, position: { x: number; y: number }) => void;

  addEdge: (edge: Omit<WorkflowEdge, "id">) => void;
  deleteEdge: (edgeId: string) => void;

  addVariable: (variable: Omit<WorkflowVariable, "id">) => void;
  updateVariable: (variableId: string, updates: Partial<WorkflowVariable>) => void;
  deleteVariable: (variableId: string) => void;

  publishWorkflow: () => void;
  archiveWorkflow: () => void;
  markDirty: () => void;
  markClean: () => void;
}

function getDefaultBlockConfig(type: BlockType): BlockConfig {
  switch (type) {
    case "llm":
      return {
        llm: {
          model: "gpt-4",
          temperature: 0.7,
          max_tokens: 1000,
          system_prompt: "",
          user_prompt: "",
          stream: false,
        },
      };
    case "knowledge_base":
      return {
        knowledge_base: {
          store_id: "",
          query_variable: "",
          top_k: 5,
          similarity_threshold: 0.7,
        },
      };
    case "code":
      return {
        code: {
          language: "javascript",
          code: "// Write your code here\nreturn input;",
          timeout_ms: 5000,
        },
      };
    case "http_request":
      return {
        http_request: {
          method: "GET",
          url: "",
          headers: {},
          body: "",
          timeout_ms: 10000,
        },
      };
    case "condition":
      return {
        condition: {
          rules: [],
          default_output: "default",
        },
      };
    case "variable":
      return {
        variable: {
          name: "",
          type: "string",
          default_value: "",
          description: "",
        },
      };
    case "template":
      return {
        template: {
          template: "",
          variables: [],
        },
      };
    case "input":
      return {
        input: {
          fields: [],
        },
      };
    case "output":
      return {
        output: {
          format: "text",
          template: "{{result}}",
        },
      };
    default:
      return {};
  }
}

function getDefaultLabel(type: BlockType): string {
  const labels: Record<BlockType, string> = {
    llm: "LLM",
    knowledge_base: "Knowledge Base",
    code: "Code",
    http_request: "HTTP Request",
    condition: "Condition",
    variable: "Variable",
    template: "Template",
    input: "Input",
    output: "Output",
  };
  return labels[type] || "Block";
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflows: [],
  currentWorkflow: null,
  selectedBlockId: null,
  isDirty: false,

  loadWorkflows: () => {
    set({ workflows: mockWorkflows });
  },

  setCurrentWorkflow: (id: string) => {
    const workflow = get().workflows.find((w) => w.id === id) || null;
    set({ currentWorkflow: workflow, selectedBlockId: null, isDirty: false });
  },

  createWorkflow: (name, description, appType) => {
    const newWorkflow: Workflow = {
      id: `wf-${generateId()}`,
      name,
      description,
      app_type: appType,
      blocks: [],
      edges: [],
      variables: [],
      created_by: "user-1",
      team_id: "team-1",
      is_public: false,
      version: 1,
      status: "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    set(
      produce((state: WorkflowState) => {
        state.workflows.push(newWorkflow);
        state.currentWorkflow = newWorkflow;
      })
    );
    return newWorkflow;
  },

  updateWorkflow: (id, updates) => {
    set(
      produce((state: WorkflowState) => {
        const idx = state.workflows.findIndex((w) => w.id === id);
        if (idx >= 0) {
          Object.assign(state.workflows[idx], updates, { updated_at: new Date().toISOString() });
          if (state.currentWorkflow?.id === id) {
            Object.assign(state.currentWorkflow, updates, { updated_at: new Date().toISOString() });
          }
        }
        state.isDirty = true;
      })
    );
  },

  deleteWorkflow: (id) => {
    set(
      produce((state: WorkflowState) => {
        state.workflows = state.workflows.filter((w) => w.id !== id);
        if (state.currentWorkflow?.id === id) {
          state.currentWorkflow = null;
        }
      })
    );
  },

  duplicateWorkflow: (id) => {
    const original = get().workflows.find((w) => w.id === id);
    if (!original) throw new Error("Workflow not found");
    const duplicated: Workflow = {
      ...JSON.parse(JSON.stringify(original)),
      id: `wf-${generateId()}`,
      name: `${original.name} (Copy)`,
      status: "draft",
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    set(
      produce((state: WorkflowState) => {
        state.workflows.push(duplicated);
      })
    );
    return duplicated;
  },

  addBlock: (type, position) => {
    const block: WorkflowBlock = {
      id: `block-${generateId()}`,
      type,
      label: getDefaultLabel(type),
      config: getDefaultBlockConfig(type),
      error_config: {
        retry_count: type === "llm" || type === "http_request" ? 3 : 0,
        retry_delay_ms: type === "llm" || type === "http_request" ? 1000 : 0,
        fallback_block_id: null,
        notify_on_error: type === "llm" || type === "http_request",
      },
      position,
    };
    set(
      produce((state: WorkflowState) => {
        if (state.currentWorkflow) {
          state.currentWorkflow.blocks.push(block);
          state.isDirty = true;
        }
      })
    );
    return block;
  },

  updateBlock: (blockId, updates) => {
    set(
      produce((state: WorkflowState) => {
        if (state.currentWorkflow) {
          const block = state.currentWorkflow.blocks.find((b) => b.id === blockId);
          if (block) {
            Object.assign(block, updates);
            state.isDirty = true;
          }
        }
      })
    );
  },

  updateBlockConfig: (blockId, config) => {
    set(
      produce((state: WorkflowState) => {
        if (state.currentWorkflow) {
          const block = state.currentWorkflow.blocks.find((b) => b.id === blockId);
          if (block) {
            block.config = { ...block.config, ...config };
            state.isDirty = true;
          }
        }
      })
    );
  },

  updateBlockErrorConfig: (blockId, errorConfig) => {
    set(
      produce((state: WorkflowState) => {
        if (state.currentWorkflow) {
          const block = state.currentWorkflow.blocks.find((b) => b.id === blockId);
          if (block) {
            block.error_config = { ...block.error_config, ...errorConfig };
            state.isDirty = true;
          }
        }
      })
    );
  },

  deleteBlock: (blockId) => {
    set(
      produce((state: WorkflowState) => {
        if (state.currentWorkflow) {
          state.currentWorkflow.blocks = state.currentWorkflow.blocks.filter((b) => b.id !== blockId);
          state.currentWorkflow.edges = state.currentWorkflow.edges.filter(
            (e) => e.source !== blockId && e.target !== blockId
          );
          if (state.selectedBlockId === blockId) {
            state.selectedBlockId = null;
          }
          state.isDirty = true;
        }
      })
    );
  },

  selectBlock: (blockId) => {
    set({ selectedBlockId: blockId });
  },

  moveBlock: (blockId, position) => {
    set(
      produce((state: WorkflowState) => {
        if (state.currentWorkflow) {
          const block = state.currentWorkflow.blocks.find((b) => b.id === blockId);
          if (block) {
            block.position = position;
          }
        }
      })
    );
  },

  addEdge: (edge) => {
    const newEdge: WorkflowEdge = { ...edge, id: `edge-${generateId()}` };
    set(
      produce((state: WorkflowState) => {
        if (state.currentWorkflow) {
          const exists = state.currentWorkflow.edges.some(
            (e) => e.source === edge.source && e.target === edge.target
          );
          if (!exists) {
            state.currentWorkflow.edges.push(newEdge);
            state.isDirty = true;
          }
        }
      })
    );
  },

  deleteEdge: (edgeId) => {
    set(
      produce((state: WorkflowState) => {
        if (state.currentWorkflow) {
          state.currentWorkflow.edges = state.currentWorkflow.edges.filter((e) => e.id !== edgeId);
          state.isDirty = true;
        }
      })
    );
  },

  addVariable: (variable) => {
    set(
      produce((state: WorkflowState) => {
        if (state.currentWorkflow) {
          state.currentWorkflow.variables.push({ ...variable, id: `var-${generateId()}` });
          state.isDirty = true;
        }
      })
    );
  },

  updateVariable: (variableId, updates) => {
    set(
      produce((state: WorkflowState) => {
        if (state.currentWorkflow) {
          const v = state.currentWorkflow.variables.find((v) => v.id === variableId);
          if (v) {
            Object.assign(v, updates);
            state.isDirty = true;
          }
        }
      })
    );
  },

  deleteVariable: (variableId) => {
    set(
      produce((state: WorkflowState) => {
        if (state.currentWorkflow) {
          state.currentWorkflow.variables = state.currentWorkflow.variables.filter((v) => v.id !== variableId);
          state.isDirty = true;
        }
      })
    );
  },

  publishWorkflow: () => {
    set(
      produce((state: WorkflowState) => {
        if (state.currentWorkflow) {
          state.currentWorkflow.status = "published";
          state.currentWorkflow.version += 1;
          state.currentWorkflow.updated_at = new Date().toISOString();
          const idx = state.workflows.findIndex((w) => w.id === state.currentWorkflow!.id);
          if (idx >= 0) {
            state.workflows[idx] = { ...state.currentWorkflow };
          }
          state.isDirty = false;
        }
      })
    );
  },

  archiveWorkflow: () => {
    set(
      produce((state: WorkflowState) => {
        if (state.currentWorkflow) {
          state.currentWorkflow.status = "archived";
          state.currentWorkflow.updated_at = new Date().toISOString();
          const idx = state.workflows.findIndex((w) => w.id === state.currentWorkflow!.id);
          if (idx >= 0) {
            state.workflows[idx] = { ...state.currentWorkflow };
          }
        }
      })
    );
  },

  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
}));
