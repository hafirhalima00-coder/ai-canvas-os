import type { AIBlock, WorkflowEdge, WorkflowSnapshot } from "@/lib/types";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "ai-canvas-snapshots";

function loadSnapshots(): WorkflowSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveSnapshots(snapshots: WorkflowSnapshot[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
  } catch {
    console.warn("Failed to save snapshots to localStorage");
  }
}

export function createSnapshot(
  workflowId: string,
  name: string,
  blocks: AIBlock[],
  edges: WorkflowEdge[]
): WorkflowSnapshot {
  const snapshot: WorkflowSnapshot = {
    id: generateId(),
    workflowId,
    name,
    data: {
      blocks: JSON.parse(JSON.stringify(blocks)),
      edges: JSON.parse(JSON.stringify(edges)),
    },
    createdAt: Date.now(),
  };

  const snapshots = loadSnapshots();
  snapshots.push(snapshot);
  saveSnapshots(snapshots);
  return snapshot;
}

export function getSnapshots(workflowId?: string): WorkflowSnapshot[] {
  const snapshots = loadSnapshots();
  return workflowId
    ? snapshots.filter((s) => s.workflowId === workflowId).sort((a, b) => b.createdAt - a.createdAt)
    : snapshots.sort((a, b) => b.createdAt - a.createdAt);
}

export function restoreSnapshot(snapshotId: string): WorkflowSnapshot | null {
  const snapshots = loadSnapshots();
  return snapshots.find((s) => s.id === snapshotId) ?? null;
}

export function deleteSnapshot(snapshotId: string): void {
  const snapshots = loadSnapshots().filter((s) => s.id !== snapshotId);
  saveSnapshots(snapshots);
}

export function deleteAllSnapshots(): void {
  saveSnapshots([]);
}
