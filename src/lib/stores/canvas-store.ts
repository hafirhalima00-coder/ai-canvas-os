"use client";

import { create } from "zustand";
import type { AIBlock, WorkflowEdge, BlockType } from "@/lib/types";
import { generateId } from "@/lib/utils";

export interface CanvasState {
  blocks: AIBlock[];
  edges: WorkflowEdge[];
  selectedBlockId: string | null;
  isDragging: boolean;
  workflowName: string;
  workflowDescription: string;

  addBlock: (type: BlockType, position: { x: number; y: number }, label?: string) => string;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<AIBlock>) => void;
  updateBlockConfig: (id: string, config: Record<string, unknown>) => void;
  setBlocks: (blocks: AIBlock[]) => void;
  selectBlock: (id: string | null) => void;
  addEdge: (source: string, target: string, sourceHandle?: string, targetHandle?: string) => void;
  removeEdge: (id: string) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  clearCanvas: () => void;
  setWorkflowMeta: (name: string, description: string) => void;
  getSnapshot: () => { blocks: AIBlock[]; edges: WorkflowEdge[] };
  restoreSnapshot: (data: { blocks: AIBlock[]; edges: WorkflowEdge[] }) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  blocks: [],
  edges: [],
  selectedBlockId: null,
  isDragging: false,
  workflowName: "Untitled Workflow",
  workflowDescription: "",

  addBlock: (type, position, label) => {
    const id = generateId();
    const block: AIBlock = {
      id,
      type,
      label: label ?? `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      status: "idle",
      config: {},
      position,
    };
    set((s) => ({ blocks: [...s.blocks, block] }));
    return id;
  },

  removeBlock: (id) => {
    set((s) => ({
      blocks: s.blocks.filter((b) => b.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedBlockId: s.selectedBlockId === id ? null : s.selectedBlockId,
    }));
  },

  updateBlock: (id, updates) => {
    set((s) => ({
      blocks: s.blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  },

  updateBlockConfig: (id, config) => {
    set((s) => ({
      blocks: s.blocks.map((b) =>
        b.id === id ? { ...b, config: { ...b.config, ...config } } : b
      ),
    }));
  },

  setBlocks: (blocks) => set({ blocks }),

  selectBlock: (id) => set({ selectedBlockId: id }),

  addEdge: (source, target, sourceHandle, targetHandle) => {
    const id = `edge-${generateId()}`;
    set((s) => ({
      edges: [
        ...s.edges,
        { id, source, target, sourceHandle, targetHandle, animated: false },
      ],
    }));
  },

  removeEdge: (id) => {
    set((s) => ({
      edges: s.edges.filter((e) => e.id !== id),
    }));
  },

  setEdges: (edges) => set({ edges }),

  clearCanvas: () => set({ blocks: [], edges: [], selectedBlockId: null }),

  setWorkflowMeta: (name, description) =>
    set({ workflowName: name, workflowDescription: description }),

  getSnapshot: () => {
    const { blocks, edges } = get();
    return { blocks: JSON.parse(JSON.stringify(blocks)), edges: JSON.parse(JSON.stringify(edges)) };
  },

  restoreSnapshot: (data) => {
    set({ blocks: data.blocks, edges: data.edges, selectedBlockId: null });
  },
}));
