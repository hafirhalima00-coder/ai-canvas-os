"use client";

import { create } from "zustand";
import type { AIBlock, WorkflowEdge, BlockStatus, WorkflowAnalytics } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface WorkflowRunState {
  runId: string | null;
  isRunning: boolean;
  isPaused: boolean;
  currentBlockId: string | null;
  pendingApprovalId: string | null;
  startTime: number | null;
  executionLog: Array<{ blockId: string; blockLabel: string; status: BlockStatus; timestamp: number; message: string }>;

  startWorkflow: (blocks: AIBlock[], edges: WorkflowEdge[]) => void;
  completeBlock: (blockId: string, result?: string) => void;
  failBlock: (blockId: string, error: string) => void;
  pauseWorkflow: (approvalBlockId: string) => void;
  resumeWorkflow: () => void;
  cancelWorkflow: () => void;
  resetWorkflow: () => void;
  setCurrentBlock: (blockId: string | null) => void;
  addLog: (blockId: string, blockLabel: string, status: BlockStatus, message: string) => void;
}

export const useWorkflowStore = create<WorkflowRunState>((set, get) => ({
  runId: null,
  isRunning: false,
  isPaused: false,
  currentBlockId: null,
  pendingApprovalId: null,
  startTime: null,
  executionLog: [],

  startWorkflow: (blocks, _edges) => {
    set({
      runId: generateId(),
      isRunning: true,
      isPaused: false,
      currentBlockId: null,
      pendingApprovalId: null,
      startTime: Date.now(),
      executionLog: blocks.map((b) => ({
        blockId: b.id,
        blockLabel: b.label,
        status: "idle",
        timestamp: Date.now(),
        message: "Waiting...",
      })),
    });
  },

  completeBlock: (blockId, result) => {
    set((s) => ({
      executionLog: s.executionLog.map((l) =>
        l.blockId === blockId ? { ...l, status: "completed", timestamp: Date.now(), message: result ?? "Completed" } : l
      ),
      currentBlockId: null,
    }));
  },

  failBlock: (blockId, error) => {
    set((s) => ({
      executionLog: s.executionLog.map((l) =>
        l.blockId === blockId ? { ...l, status: "error", timestamp: Date.now(), message: error } : l
      ),
      isRunning: false,
      currentBlockId: null,
    }));
  },

  pauseWorkflow: (approvalBlockId) => {
    set({ isPaused: true, pendingApprovalId: approvalBlockId, currentBlockId: null });
  },

  resumeWorkflow: () => {
    const { pendingApprovalId } = get();
    set((s) => ({
      isPaused: false,
      pendingApprovalId: null,
      executionLog: s.executionLog.map((l) =>
        l.blockId === pendingApprovalId ? { ...l, status: "completed", timestamp: Date.now(), message: "Approved" } : l
      ),
    }));
  },

  cancelWorkflow: () => {
    set({ isRunning: false, isPaused: false, currentBlockId: null, pendingApprovalId: null });
  },

  resetWorkflow: () => {
    set({
      runId: null,
      isRunning: false,
      isPaused: false,
      currentBlockId: null,
      pendingApprovalId: null,
      startTime: null,
      executionLog: [],
    });
  },

  setCurrentBlock: (blockId) => set({ currentBlockId: blockId }),

  addLog: (blockId, blockLabel, status, message) => {
    set((s) => ({
      executionLog: [...s.executionLog, { blockId, blockLabel, status, timestamp: Date.now(), message }],
    }));
  },
}));

export interface AnalyticsState extends WorkflowAnalytics {
  recordRun: (run: WorkflowAnalytics["runHistory"][number]) => void;
  getStats: () => { avgDuration: number; successRate: number; totalCost: number };
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  totalRuns: 0,
  totalExecutionTime: 0,
  successCount: 0,
  errorCount: 0,
  estimatedCost: 0,
  runHistory: [],

  recordRun: (run) => {
    set((s) => ({
      totalRuns: s.totalRuns + 1,
      totalExecutionTime: s.totalExecutionTime + run.duration,
      successCount: s.successCount + (run.status === "completed" ? 1 : 0),
      errorCount: s.errorCount + (run.status === "error" ? 1 : 0),
      estimatedCost: s.estimatedCost + run.cost,
      runHistory: [run, ...s.runHistory].slice(0, 100),
    }));
  },

  getStats: () => {
    const s = get();
    return {
      avgDuration: s.totalRuns > 0 ? s.totalExecutionTime / s.totalRuns : 0,
      successRate: s.totalRuns > 0 ? (s.successCount / s.totalRuns) * 100 : 0,
      totalCost: s.estimatedCost,
    };
  },
}));
