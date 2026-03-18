// ============ Core Types ============

export type BlockType =
  | "llm"
  | "knowledge_base"
  | "code"
  | "http_request"
  | "condition"
  | "variable"
  | "template"
  | "input"
  | "output";

export type AppType = "chatbot" | "text_generator" | "agent" | "workflow";

export type DeployTarget = "api" | "widget" | "webapp";

export type RunStatus = "pending" | "running" | "success" | "failed" | "cancelled";

export type Role = "owner" | "admin" | "editor" | "viewer";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
}

// ============ Workflow & Block Types ============

export interface BlockConfig {
  llm?: {
    model: string;
    temperature: number;
    max_tokens: number;
    system_prompt: string;
    user_prompt: string;
    stream: boolean;
  };
  knowledge_base?: {
    store_id: string;
    query_variable: string;
    top_k: number;
    similarity_threshold: number;
  };
  code?: {
    language: "javascript" | "python";
    code: string;
    timeout_ms: number;
  };
  http_request?: {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    url: string;
    headers: Record<string, string>;
    body: string;
    timeout_ms: number;
  };
  condition?: {
    rules: ConditionRule[];
    default_output: string;
  };
  variable?: {
    name: string;
    type: "string" | "number" | "boolean" | "json";
    default_value: string;
    description: string;
  };
  template?: {
    template: string;
    variables: string[];
  };
  input?: {
    fields: InputField[];
  };
  output?: {
    format: "text" | "json" | "markdown";
    template: string;
  };
}

export interface ConditionRule {
  id: string;
  variable: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "is_empty" | "is_not_empty";
  value: string;
  output: string;
}

export interface InputField {
  id: string;
  name: string;
  type: "text" | "number" | "boolean" | "file" | "select";
  label: string;
  required: boolean;
  options?: string[];
  default_value?: string;
}

export interface ErrorConfig {
  retry_count: number;
  retry_delay_ms: number;
  fallback_block_id: string | null;
  notify_on_error: boolean;
}

export interface WorkflowBlock {
  id: string;
  type: BlockType;
  label: string;
  config: BlockConfig;
  error_config: ErrorConfig;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  source_handle: string | null;
  target_handle: string | null;
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  app_type: AppType;
  blocks: WorkflowBlock[];
  edges: WorkflowEdge[];
  variables: WorkflowVariable[];
  created_by: string;
  team_id: string | null;
  is_public: boolean;
  version: number;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

export interface WorkflowVariable {
  id: string;
  name: string;
  type: "string" | "number" | "boolean" | "json";
  default_value: string;
  description: string;
  scope: "global" | "local";
}

// ============ Knowledge Base Types ============

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  document_count: number;
  total_chunks: number;
  embedding_model: string;
  status: "ready" | "processing" | "error";
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  knowledge_base_id: string;
  name: string;
  file_type: string;
  file_size: number;
  chunk_count: number;
  status: "processing" | "ready" | "error";
  created_at: string;
}

// ============ Prompt Types ============

export interface Prompt {
  id: string;
  name: string;
  description: string;
  content: string;
  variables: string[];
  version: number;
  versions: PromptVersion[];
  ab_tests: ABTest[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PromptVersion {
  id: string;
  prompt_id: string;
  content: string;
  version: number;
  created_at: string;
  notes: string;
}

export interface ABTest {
  id: string;
  prompt_id: string;
  name: string;
  variant_a: string;
  variant_b: string;
  traffic_split: number;
  status: "running" | "completed" | "paused";
  results: {
    variant_a_runs: number;
    variant_b_runs: number;
    variant_a_avg_score: number;
    variant_b_avg_score: number;
  };
  created_at: string;
}

// ============ Deploy Types ============

export interface Deployment {
  id: string;
  workflow_id: string;
  workflow_name: string;
  target: DeployTarget;
  url: string;
  api_key: string;
  status: "active" | "inactive" | "error";
  config: DeploymentConfig;
  created_at: string;
  updated_at: string;
}

export interface DeploymentConfig {
  api?: {
    rate_limit: number;
    auth_required: boolean;
    cors_origins: string[];
  };
  widget?: {
    theme: "light" | "dark" | "auto";
    position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    title: string;
    welcome_message: string;
    primary_color: string;
  };
  webapp?: {
    title: string;
    description: string;
    theme: "light" | "dark";
    custom_domain: string | null;
  };
}

// ============ Monitoring Types ============

export interface WorkflowRun {
  id: string;
  workflow_id: string;
  workflow_name: string;
  status: RunStatus;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  token_usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  error: string | null;
  block_runs: BlockRun[];
}

export interface BlockRun {
  id: string;
  block_id: string;
  block_type: BlockType;
  block_label: string;
  status: RunStatus;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  error: string | null;
  retry_count: number;
}

export interface MonitoringStats {
  total_runs: number;
  success_count: number;
  failure_count: number;
  avg_latency_ms: number;
  total_tokens: number;
  runs_by_day: { date: string; count: number; success: number; failure: number }[];
  latency_by_day: { date: string; avg_ms: number }[];
  tokens_by_day: { date: string; tokens: number }[];
  top_errors: { message: string; count: number }[];
}

// ============ Marketplace Types ============

export interface MarketplaceItem {
  id: string;
  workflow_id: string;
  name: string;
  description: string;
  long_description: string;
  app_type: AppType;
  category: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  downloads: number;
  rating: number;
  review_count: number;
  preview_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MarketplaceReview {
  id: string;
  item_id: string;
  user: { id: string; name: string; avatar_url: string | null };
  rating: number;
  comment: string;
  created_at: string;
}

// ============ Team Types ============

export interface Team {
  id: string;
  name: string;
  owner_id: string;
  members: TeamMember[];
  created_at: string;
}

export interface TeamMember {
  user_id: string;
  name: string;
  email: string;
  role: Role;
  avatar_url: string | null;
  joined_at: string;
}
