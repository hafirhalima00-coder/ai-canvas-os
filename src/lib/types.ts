export type BlockType =
  | "research"
  | "writer"
  | "analyst"
  | "coder"
  | "crm"
  | "email"
  | "image"
  | "approval";

export type BlockStatus = "idle" | "running" | "completed" | "error" | "paused";

export interface BlockConfig {
  type: BlockType;
  label: string;
  description: string;
  icon: string;
  color: string;
  inputs: number;
  outputs: number;
  defaultConfig: Record<string, unknown>;
}

export interface AIBlock {
  id: string;
  type: BlockType;
  label: string;
  status: BlockStatus;
  config: Record<string, unknown>;
  position: { x: number; y: number };
  result?: string;
  error?: string;
  startedAt?: number;
  completedAt?: number;
  duration?: number;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  animated?: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  blocks: AIBlock[];
  edges: WorkflowEdge[];
  isRunning: boolean;
  isPaused: boolean;
}

export interface WorkflowSnapshot {
  id: string;
  workflowId: string;
  name: string;
  data: { blocks: AIBlock[]; edges: WorkflowEdge[] };
  createdAt: number;
}

export interface MemoryItem {
  id: string;
  type: "context" | "variable" | "document";
  key: string;
  value: unknown;
  source?: string;
  createdAt: number;
}

export interface WorkflowAnalytics {
  totalRuns: number;
  totalExecutionTime: number;
  successCount: number;
  errorCount: number;
  estimatedCost: number;
  runHistory: Array<{
    id: string;
    workflowId: string;
    workflowName: string;
    status: "completed" | "error";
    duration: number;
    cost: number;
    timestamp: number;
  }>;
}

export interface Notification {
  id: string;
  type: "info" | "success" | "error" | "warning";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  blocks: AIBlock[];
  edges: WorkflowEdge[];
  icon: string;
}

export const BLOCK_REGISTRY: Record<BlockType, BlockConfig> = {
  research: {
    type: "research",
    label: "Research",
    description: "Search the web and gather information",
    icon: "Search",
    color: "#3b82f6",
    inputs: 1,
    outputs: 1,
    defaultConfig: { query: "", maxResults: 5, source: "web" },
  },
  writer: {
    type: "writer",
    label: "Writer",
    description: "Generate content with AI",
    icon: "PenLine",
    color: "#8b5cf6",
    inputs: 1,
    outputs: 1,
    defaultConfig: { tone: "professional", length: "medium", format: "markdown" },
  },
  analyst: {
    type: "analyst",
    label: "Analyst",
    description: "Analyze data and generate insights",
    icon: "BarChart3",
    color: "#f59e0b",
    inputs: 1,
    outputs: 2,
    defaultConfig: { analysisType: "summary", format: "json" },
  },
  coder: {
    type: "coder",
    label: "Coder",
    description: "Generate and review code",
    icon: "Code2",
    color: "#10b981",
    inputs: 1,
    outputs: 1,
    defaultConfig: { language: "typescript", task: "generate" },
  },
  crm: {
    type: "crm",
    label: "CRM",
    description: "Query customer data and interactions",
    icon: "Users",
    color: "#ec4899",
    inputs: 1,
    outputs: 1,
    defaultConfig: { action: "lookup", fields: ["name", "email"] },
  },
  email: {
    type: "email",
    label: "Email",
    description: "Send emails via connected service",
    icon: "Mail",
    color: "#ef4444",
    inputs: 1,
    outputs: 1,
    defaultConfig: { recipient: "", subject: "", template: "default" },
  },
  image: {
    type: "image",
    label: "Image Generator",
    description: "Generate images with AI",
    icon: "Image",
    color: "#14b8a6",
    inputs: 1,
    outputs: 1,
    defaultConfig: { prompt: "", size: "1024x1024", style: "realistic" },
  },
  approval: {
    type: "approval",
    label: "Human Approval",
    description: "Pause execution until approved",
    icon: "ShieldCheck",
    color: "#f97316",
    inputs: 1,
    outputs: 2,
    defaultConfig: { requireNote: true, timeout: 3600 },
  },
};
