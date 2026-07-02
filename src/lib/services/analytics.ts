import type { WorkflowAnalytics } from "@/lib/types";

const STORAGE_KEY = "ai-canvas-analytics";

function loadAnalytics(): WorkflowAnalytics {
  if (typeof window === "undefined") {
    return { totalRuns: 0, totalExecutionTime: 0, successCount: 0, errorCount: 0, estimatedCost: 0, runHistory: [] };
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // ignore
  }
  return { totalRuns: 0, totalExecutionTime: 0, successCount: 0, errorCount: 0, estimatedCost: 0, runHistory: [] };
}

function saveAnalytics(a: WorkflowAnalytics): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
  } catch {
    console.warn("Failed to save analytics");
  }
}

export function getAnalytics(): WorkflowAnalytics {
  return loadAnalytics();
}

export function recordWorkflowRun(
  workflowId: string,
  workflowName: string,
  status: "completed" | "error",
  duration: number,
  cost: number
): WorkflowAnalytics {
  const analytics = loadAnalytics();
  analytics.totalRuns++;
  analytics.totalExecutionTime += duration;
  if (status === "completed") analytics.successCount++;
  else analytics.errorCount++;
  analytics.estimatedCost += cost;
  analytics.runHistory.unshift({
    id: crypto.randomUUID?.() ?? `${Date.now()}`,
    workflowId,
    workflowName,
    status,
    duration,
    cost,
    timestamp: Date.now(),
  });
  analytics.runHistory = analytics.runHistory.slice(0, 100);
  saveAnalytics(analytics);
  return analytics;
}

export function clearAnalytics(): void {
  saveAnalytics({ totalRuns: 0, totalExecutionTime: 0, successCount: 0, errorCount: 0, estimatedCost: 0, runHistory: [] });
}
