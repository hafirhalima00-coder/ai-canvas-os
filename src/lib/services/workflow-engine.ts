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
      result: `Research findings for "${String(_ctx.block.config?.query ?? "topic")}":\n\n• Meridian Technologies raised $45M Series C (March 2025) — expanding into APAC\n• NovaCorp announced partnership with AWS for cloud migration\n• Stellar Health hired new VP of Engineering (ex-Google) — likely building data platform\n• 3 competitors in the space raised funding in Q1 2025\n\nKey insight: Enterprise buyers are prioritizing AI-native solutions in 2025 budgets.`,
      outputs: mkmap([
        ["findings", [
          { source: "TechCrunch", title: "Meridian raises $45M", relevance: 0.95 },
          { source: "LinkedIn", title: "NovaCorp + AWS partnership", relevance: 0.88 },
          { source: "Crunchbase", title: "Stellar Health new VP Eng", relevance: 0.82 },
        ]],
        ["insights", "Enterprise AI adoption accelerating. Budget cycles favor Q2 closes."],
      ]),
    };
  },
  writer: async (_ctx) => {
    await simulateDelay(2000, 4000);
    return {
      result: `Subject: Partnership opportunity — AI-native workflow automation

Hi {{firstName}},

I noticed {{company}} just closed {{fundingRound}} — congratulations. Given your expansion plans, I thought you'd want to see how we're helping similar companies reduce workflow overhead by 40%.

Our platform replaces scattered dashboards and chat-based tools with a visual intent engine. Teams using it save ~12 hours/week on repetitive coordination.

Worth a 15-minute call this week?

Best,
{{senderName}}`,
      outputs: mkmap([
        ["emailSubject", "Partnership opportunity — AI-native workflow automation"],
        ["emailBody", "Hi {{firstName}},\n\nI noticed {{company}} just closed {{fundingRound}}..."],
        ["personalizationScore", 0.87],
      ]),
    };
  },
  analyst: async (_ctx) => {
    await simulateDelay(1000, 3000);
    return {
      result: JSON.stringify({
        segments: {
          enterprise: { count: 12, avgDealSize: 85000, winRate: 0.34, avgCycleDays: 67 },
          midMarket: { count: 35, avgDealSize: 24000, winRate: 0.52, avgCycleDays: 34 },
        },
        topLeads: [
          { name: "Meridian Technologies", score: 92, intent: "high", reason: "Recent funding + hiring" },
          { name: "NovaCorp", score: 87, intent: "high", reason: "AWS partnership signals digital transformation" },
          { name: "Stellar Health", score: 78, intent: "medium", reason: "New VP Eng building platform team" },
        ],
        recommendation: "Focus on enterprise segment. Q2 budget cycles create urgency.",
        confidence: 0.89,
      }, null, 2),
      outputs: mkmap([
        ["segments", { enterprise: 12, midMarket: 35 }],
        ["topLeads", ["Meridian Technologies", "NovaCorp", "Stellar Health"]],
        ["confidence", 0.89],
      ]),
    };
  },
  crm: async (_ctx) => {
    await simulateDelay(1000, 2000);
    return {
      result: `Retrieved 47 enterprise contacts across 3 segments:

• Enterprise ($50K+ deal): 12 contacts
  - Meridian Technologies — Last touch: 2025-03-15, Deal size: $120K
  - NovaCorp — Last touch: 2025-02-28, Deal size: $85K
  - Stellar Health — Last touch: 2025-01-10, Deal size: $67K

• Mid-Market ($10-50K): 35 contacts
• SMB (<$10K): 0 contacts (filtered out)

Average engagement score: 8.4/10
Open opportunities: $2.1M total pipeline`,
      outputs: mkmap([
        ["records", 47],
        ["segments", { enterprise: 12, midMarket: 35 }],
        ["pipeline", 2100000],
      ]),
    };
  },
  email: async (ctx) => {
    await simulateDelay(1500, 3000);
    return {
      result: `Email campaign queued successfully:

Template: ${String(ctx.block.config?.template ?? "default")}
Recipients: 12 enterprise contacts
Subject: ${String(ctx.block.config?.subject ?? "Partnership opportunity")}

Delivery schedule:
- Batch 1 (3 emails): Immediately
- Batch 2 (5 emails): +2 hours
- Batch 3 (4 emails): +4 hours

Estimated open rate: 42% (based on segment data)
Estimated reply rate: 18%`,
      outputs: mkmap([
        ["sent", true],
        ["recipientCount", 12],
        ["estimatedOpenRate", 0.42],
      ]),
    };
  },
  image: async (_ctx) => {
    await simulateDelay(3000, 6000);
    return {
      result: `Chart generated: Pipeline analysis visualization

Type: Bar chart showing deal progression by stage
- Qualified: 47 opportunities
- Discovery: 23 (49% conversion)
- Proposal: 12 (52% conversion)
- Negotiation: 8 (67% conversion)
- Closed Won: 5 (63% conversion)

Win rate by segment:
- Enterprise: 34% avg, 67 day cycle
- Mid-Market: 52% avg, 34 day cycle`,
      outputs: mkmap([
        ["chartType", "pipeline-analysis"],
        ["winRate", 0.34],
      ]),
    };
  },
  approval: async (_ctx) => {
    return {
      result: "Awaiting human approval — Campaign review required before sending to 12 enterprise contacts",
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
