import type { AIBlock, WorkflowEdge, BlockStatus } from "@/lib/types";

export interface ExecutionContext {
  blockId: string;
  block: AIBlock;
  inputs: Map<string, unknown>;
  results: Map<string, unknown>;
}

export type BlockExecutor = (ctx: ExecutionContext) => Promise<{ outputs: Map<string, unknown>; result?: string }>;

function mkmap(entries: [string, unknown][]): Map<string, unknown> {
  return new Map(entries);
}

const SIMULATED_EXECUTORS: Record<string, BlockExecutor> = {
  research: async (_ctx) => {
    await simulateDelay(1500, 3000);
    return {
      result: `Research results for "${String(_ctx.block.config?.query ?? "topic")}": Found 12 relevant sources with key insights on AI trends.`,
      outputs: mkmap([["data", { sources: 12, relevance: 0.94 }]]),
    };
  },
  writer: async (_ctx) => {
    await simulateDelay(2000, 4000);
    return {
      result: "Generated content based on input context. The document covers key findings in a professional tone with actionable recommendations.",
      outputs: mkmap([["content", "Generated content..."], ["wordCount", 850]]),
    };
  },
  analyst: async (_ctx) => {
    await simulateDelay(1000, 3000);
    return {
      result: JSON.stringify({ insights: ["Trend 1: Growing adoption", "Trend 2: Cost reduction"], confidence: 0.87, anomalies: [] }, null, 2),
      outputs: mkmap([["insights", ["Trend 1", "Trend 2"]], ["confidence", 0.87]]),
    };
  },
  coder: async (_ctx) => {
    await simulateDelay(2000, 5000);
    return {
      result: "```typescript\nfunction calculateMetrics(data: number[]): Metrics {\n  const sum = data.reduce((a, b) => a + b, 0);\n  return { average: sum / data.length, count: data.length };\n}\n```",
      outputs: mkmap([["code", "function calculateMetrics..."], ["language", "typescript"]]),
    };
  },
  crm: async (_ctx) => {
    await simulateDelay(1000, 2000);
    return {
      result: "Retrieved 47 customer records. Segment: Enterprise (12), SMB (35). Average engagement score: 8.4/10.",
      outputs: mkmap([["records", 47], ["segments", { enterprise: 12, smb: 35 }]]),
    };
  },
  email: async (ctx) => {
    await simulateDelay(1500, 3000);
    return {
      result: `Email queued to: ${String(ctx.block.config?.recipient ?? "recipient@example.com")} — Subject: "${String(ctx.block.config?.subject ?? "Update")}"`,
      outputs: mkmap([["sent", true], ["recipient", ctx.block.config?.recipient]]),
    };
  },
  image: async (ctx) => {
    await simulateDelay(3000, 6000);
    return {
      result: `Generated image: ${String(ctx.block.config?.prompt ?? "AI-generated artwork")} (1024x1024, style: ${String(ctx.block.config?.style ?? "realistic")})`,
      outputs: mkmap([["url", "/api/generated/image"], ["format", "png"]]),
    };
  },
  approval: async (_ctx) => {
    return {
      result: "Awaiting human approval",
      outputs: mkmap([["approved", false], ["status", "pending"]]),
    };
  },
};

function simulateDelay(min: number, max: number): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min) + min);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function executeBlock(
  block: AIBlock,
  inputs: Map<string, unknown>
): Promise<{ result?: string; outputs: Map<string, unknown>; status: BlockStatus }> {
  const executor = SIMULATED_EXECUTORS[block.type];
  if (!executor) {
    return { status: "error", outputs: mkmap([]), result: `No executor for block type: ${block.type}` };
  }

  if (block.type === "approval") {
    return { status: "paused", outputs: mkmap([["approved", false]]), result: "Awaiting approval" };
  }

  try {
    const ctx: ExecutionContext = {
      blockId: block.id,
      block,
      inputs,
      results: mkmap([]),
    };
    const output = await executor(ctx);
    return { ...output, status: "completed" };
  } catch (err) {
    return { status: "error", outputs: mkmap([]), result: err instanceof Error ? err.message : "Unknown error" };
  }
}

export function topologicalSort(blocks: AIBlock[], edges: WorkflowEdge[]): AIBlock[] {
  const adj = new Map<string, string[]>();
  const inDeg = new Map<string, number>();

  blocks.forEach((b) => {
    adj.set(b.id, []);
    inDeg.set(b.id, 0);
  });

  edges.forEach((e) => {
    adj.get(e.source)?.push(e.target);
    inDeg.set(e.target, (inDeg.get(e.target) ?? 0) + 1);
  });

  const queue: string[] = [];
  inDeg.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });

  const sorted: AIBlock[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    const block = blocks.find((b) => b.id === id);
    if (block) sorted.push(block);
    adj.get(id)?.forEach((neighbor) => {
      const newDeg = (inDeg.get(neighbor) ?? 1) - 1;
      inDeg.set(neighbor, newDeg);
      if (newDeg === 0) queue.push(neighbor);
    });
  }

  return sorted;
}

export function estimateBlockCost(type: string): number {
  const costs: Record<string, number> = {
    research: 5,
    writer: 10,
    analyst: 8,
    coder: 15,
    crm: 3,
    email: 2,
    image: 50,
    approval: 0,
  };
  return costs[type] ?? 5;
}
