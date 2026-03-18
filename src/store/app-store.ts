import { create } from "zustand";
import {
  KnowledgeBase,
  Prompt,
  Deployment,
  WorkflowRun,
  MonitoringStats,
  MarketplaceItem,
  Team,
  User,
} from "@/types";
import {
  mockUser,
  mockTeam,
  mockKnowledgeBases,
  mockPrompts,
  mockDeployments,
  mockRuns,
  mockMonitoringStats,
  mockMarketplaceItems,
} from "@/lib/mock-data";
import { generateId } from "@/lib/utils";
import { produce } from "immer";

interface AppState {
  user: User | null;
  team: Team | null;
  sidebarOpen: boolean;

  knowledgeBases: KnowledgeBase[];
  prompts: Prompt[];
  deployments: Deployment[];
  runs: WorkflowRun[];
  monitoringStats: MonitoringStats | null;
  marketplaceItems: MarketplaceItem[];

  initialize: () => void;
  toggleSidebar: () => void;

  // Knowledge Base
  createKnowledgeBase: (name: string, description: string) => KnowledgeBase;
  deleteKnowledgeBase: (id: string) => void;
  uploadDocument: (kbId: string, fileName: string, fileSize: number) => void;

  // Prompts
  createPrompt: (name: string, description: string, content: string) => Prompt;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  createPromptVersion: (promptId: string, content: string, notes: string) => void;
  createABTest: (promptId: string, name: string, variantA: string, variantB: string) => void;

  // Deployments
  createDeployment: (workflowId: string, workflowName: string, target: "api" | "widget" | "webapp") => Deployment;
  updateDeployment: (id: string, updates: Partial<Deployment>) => void;
  deleteDeployment: (id: string) => void;
  toggleDeployment: (id: string) => void;

  // Team
  inviteTeamMember: (email: string, role: "admin" | "editor" | "viewer") => void;
  removeTeamMember: (userId: string) => void;
  updateMemberRole: (userId: string, role: "admin" | "editor" | "viewer") => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  team: null,
  sidebarOpen: true,

  knowledgeBases: [],
  prompts: [],
  deployments: [],
  runs: [],
  monitoringStats: null,
  marketplaceItems: [],

  initialize: () => {
    set({
      user: mockUser,
      team: mockTeam,
      knowledgeBases: mockKnowledgeBases,
      prompts: mockPrompts,
      deployments: mockDeployments,
      runs: mockRuns,
      monitoringStats: mockMonitoringStats,
      marketplaceItems: mockMarketplaceItems,
    });
  },

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  createKnowledgeBase: (name, description) => {
    const kb: KnowledgeBase = {
      id: `kb-${generateId()}`,
      name,
      description,
      document_count: 0,
      total_chunks: 0,
      embedding_model: "text-embedding-3-small",
      status: "ready",
      created_by: "user-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    set(produce((s: AppState) => { s.knowledgeBases.push(kb); }));
    return kb;
  },

  deleteKnowledgeBase: (id) => {
    set(produce((s: AppState) => {
      s.knowledgeBases = s.knowledgeBases.filter((k) => k.id !== id);
    }));
  },

  uploadDocument: (kbId, fileName, fileSize) => {
    set(produce((s: AppState) => {
      const kb = s.knowledgeBases.find((k) => k.id === kbId);
      if (kb) {
        kb.document_count += 1;
        kb.total_chunks += Math.floor(fileSize / 1000);
        kb.updated_at = new Date().toISOString();
      }
    }));
  },

  createPrompt: (name, description, content) => {
    const variables = content.match(/\{\{(\w+)\}\}/g)?.map((m) => m.replace(/\{\{|\}\}/g, "")) || [];
    const prompt: Prompt = {
      id: `prompt-${generateId()}`,
      name,
      description,
      content,
      variables: [...new Set(variables)],
      version: 1,
      versions: [
        {
          id: `pv-${generateId()}`,
          prompt_id: "",
          content,
          version: 1,
          created_at: new Date().toISOString(),
          notes: "Initial version",
        },
      ],
      ab_tests: [],
      created_by: "user-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    prompt.versions[0].prompt_id = prompt.id;
    set(produce((s: AppState) => { s.prompts.push(prompt); }));
    return prompt;
  },

  updatePrompt: (id, updates) => {
    set(produce((s: AppState) => {
      const p = s.prompts.find((p) => p.id === id);
      if (p) {
        Object.assign(p, updates, { updated_at: new Date().toISOString() });
        if (updates.content) {
          const vars = updates.content.match(/\{\{(\w+)\}\}/g)?.map((m) => m.replace(/\{\{|\}\}/g, "")) || [];
          p.variables = [...new Set(vars)];
        }
      }
    }));
  },

  deletePrompt: (id) => {
    set(produce((s: AppState) => { s.prompts = s.prompts.filter((p) => p.id !== id); }));
  },

  createPromptVersion: (promptId, content, notes) => {
    set(produce((s: AppState) => {
      const p = s.prompts.find((p) => p.id === promptId);
      if (p) {
        p.version += 1;
        p.content = content;
        p.versions.push({
          id: `pv-${generateId()}`,
          prompt_id: promptId,
          content,
          version: p.version,
          created_at: new Date().toISOString(),
          notes,
        });
        p.updated_at = new Date().toISOString();
      }
    }));
  },

  createABTest: (promptId, name, variantA, variantB) => {
    set(produce((s: AppState) => {
      const p = s.prompts.find((p) => p.id === promptId);
      if (p) {
        p.ab_tests.push({
          id: `ab-${generateId()}`,
          prompt_id: promptId,
          name,
          variant_a: variantA,
          variant_b: variantB,
          traffic_split: 50,
          status: "running",
          results: {
            variant_a_runs: 0,
            variant_b_runs: 0,
            variant_a_avg_score: 0,
            variant_b_avg_score: 0,
          },
          created_at: new Date().toISOString(),
        });
      }
    }));
  },

  createDeployment: (workflowId, workflowName, target) => {
    const dep: Deployment = {
      id: `dep-${generateId()}`,
      workflow_id: workflowId,
      workflow_name: workflowName,
      target,
      url: target === "api"
        ? `https://api.buildstream.dev/v1/workflows/${workflowId}/run`
        : target === "widget"
        ? `https://buildstream.dev/widget/dep-${generateId()}`
        : `https://buildstream.dev/app/${workflowName.toLowerCase().replace(/\s+/g, "-")}`,
      api_key: `bs_live_${generateId()}`,
      status: "active",
      config: target === "api"
        ? { api: { rate_limit: 100, auth_required: true, cors_origins: [] } }
        : target === "widget"
        ? { widget: { theme: "light", position: "bottom-right", title: workflowName, welcome_message: "Hello! How can I help?", primary_color: "#6366f1" } }
        : { webapp: { title: workflowName, description: "", theme: "light", custom_domain: null } },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    set(produce((s: AppState) => { s.deployments.push(dep); }));
    return dep;
  },

  updateDeployment: (id, updates) => {
    set(produce((s: AppState) => {
      const d = s.deployments.find((d) => d.id === id);
      if (d) Object.assign(d, updates, { updated_at: new Date().toISOString() });
    }));
  },

  deleteDeployment: (id) => {
    set(produce((s: AppState) => { s.deployments = s.deployments.filter((d) => d.id !== id); }));
  },

  toggleDeployment: (id) => {
    set(produce((s: AppState) => {
      const d = s.deployments.find((d) => d.id === id);
      if (d) {
        d.status = d.status === "active" ? "inactive" : "active";
        d.updated_at = new Date().toISOString();
      }
    }));
  },

  inviteTeamMember: (email, role) => {
    set(produce((s: AppState) => {
      if (s.team) {
        s.team.members.push({
          user_id: `user-${generateId()}`,
          name: email.split("@")[0],
          email,
          role,
          avatar_url: null,
          joined_at: new Date().toISOString(),
        });
      }
    }));
  },

  removeTeamMember: (userId) => {
    set(produce((s: AppState) => {
      if (s.team) {
        s.team.members = s.team.members.filter((m) => m.user_id !== userId);
      }
    }));
  },

  updateMemberRole: (userId, role) => {
    set(produce((s: AppState) => {
      if (s.team) {
        const m = s.team.members.find((m) => m.user_id === userId);
        if (m) m.role = role;
      }
    }));
  },
}));
