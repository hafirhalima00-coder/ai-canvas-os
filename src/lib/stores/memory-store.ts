"use client";

import { create } from "zustand";
import type { MemoryItem } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface MemoryState {
  items: MemoryItem[];
  addItem: (item: Omit<MemoryItem, "id" | "createdAt">) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<MemoryItem>) => void;
  clearItems: () => void;
  getByType: (type: MemoryItem["type"]) => MemoryItem[];
  getByKey: (key: string) => MemoryItem | undefined;
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  items: [
    { id: "1", type: "context", key: "user_goal", value: "Build a marketing campaign", createdAt: Date.now() - 3600000 },
    { id: "2", type: "variable", key: "target_audience", value: "Tech professionals aged 25-45", createdAt: Date.now() - 1800000 },
    { id: "3", type: "document", key: "brand_guidelines.pdf", value: "Brand guidelines document", createdAt: Date.now() - 900000 },
  ],

  addItem: (item) => {
    set((s) => ({
      items: [...s.items, { ...item, id: generateId(), createdAt: Date.now() }],
    }));
  },

  removeItem: (id) => {
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
  },

  updateItem: (id, updates) => {
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));
  },

  clearItems: () => set({ items: [] }),

  getByType: (type) => get().items.filter((i) => i.type === type),

  getByKey: (key) => get().items.find((i) => i.key === key),
}));
