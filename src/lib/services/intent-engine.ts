"use client";

import type { AIBlock, MemoryItem } from "@/lib/types";

export interface IntentResult {
  intent: "execute" | "decide" | "skip" | "review" | "error-recovery";
  reasoning: string;
  nextBlockId: string | null;
  userDecision: string | null;
  confidence: number;
  suggestedAction: string;
}

export interface WorkflowState {
  blocks: AIBlock[];
  edges: Array<{ source: string; target: string }>;
  memory: MemoryItem[];
  currentBlockId: string | null;
  executionLog: Array<{ blockId: string; status: string; message: string }>;
}

export async function inferNextIntent(state: WorkflowState): Promise<IntentResult> {
  try {
    const response = await fetch("/api/ollama", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflowState: state, mode: "infer-next" }),
    });

    const data = await response.json();

    if (data.success && data.data) {
      return data.data as IntentResult;
    }

    throw new Error(data.error || "Intent inference failed");
  } catch (error) {
    console.error("Intent inference error:", error);
    return fallbackIntent(state);
  }
}

function fallbackIntent(state: WorkflowState): IntentResult {
  const pending = state.blocks.filter(b => b.status === "idle");
  const failed = state.blocks.filter(b => b.status === "error");
  const completed = state.blocks.filter(b => b.status === "completed");

  if (failed.length > 0) {
    return {
      intent: "error-recovery",
      reasoning: `${failed.length} block(s) failed. Recovery needed.`,
      nextBlockId: failed[0]?.id || null,
      userDecision: "How to handle the failure?",
      confidence: 1.0,
      suggestedAction: `Recover from ${failed[0]?.label} failure`,
    };
  }

  if (pending.length > 0) {
    const next = pending[0];
    if (next.type === "approval") {
      return {
        intent: "review",
        reasoning: "Human approval required.",
        nextBlockId: next.id,
        userDecision: `Review: ${next.label}`,
        confidence: 0.95,
        suggestedAction: "Request human approval",
      };
    }
    return {
      intent: "execute",
      reasoning: `Ready: ${next.label}`,
      nextBlockId: next.id,
      userDecision: null,
      confidence: 0.85,
      suggestedAction: `Execute ${next.label}`,
    };
  }

  return {
    intent: "review",
    reasoning: completed.length > 0 ? "Workflow complete." : "No blocks to execute.",
    nextBlockId: null,
    userDecision: "Review results.",
    confidence: 1.0,
    suggestedAction: "Show results",
  };
}

export async function generateContent(prompt: string, context: WorkflowState): Promise<string> {
  try {
    const response = await fetch("/api/ollama", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflowState: context, mode: "generate-content", userQuery: prompt }),
    });

    const data = await response.json();
    return data.data?.content || data.data || "Content generation unavailable.";
  } catch {
    return "Content generation requires Ollama. Start with: ollama serve";
  }
}

export async function analyzeResults(context: WorkflowState): Promise<string> {
  try {
    const response = await fetch("/api/ollama", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflowState: context, mode: "analyze-results" }),
    });

    const data = await response.json();
    return data.data?.content || data.data || "Analysis unavailable.";
  } catch {
    return "Analysis requires Ollama. Start with: ollama serve";
  }
}

export async function checkOllamaStatus(): Promise<{ connected: boolean; models: string[] }> {
  try {
    const response = await fetch("/api/ollama");
    const data = await response.json();
    return {
      connected: data.status === "connected",
      models: data.models || [],
    };
  } catch {
    return { connected: false, models: [] };
  }
}
