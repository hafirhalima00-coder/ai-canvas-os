"use client";

import { create } from "zustand";
import type { WorkflowTemplate } from "@/lib/types";

const DEFAULT_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "content-pipeline",
    name: "Content Pipeline",
    description: "Research → Write → Review → Publish workflow",
    category: "Content",
    icon: "PenLine",
    blocks: [
      { id: "t1", type: "research", label: "Research", status: "idle", config: {}, position: { x: 50, y: 200 } },
      { id: "t2", type: "writer", label: "Writer", status: "idle", config: {}, position: { x: 350, y: 200 } },
      { id: "t3", type: "approval", label: "Review", status: "idle", config: {}, position: { x: 650, y: 200 } },
      { id: "t4", type: "email", label: "Publish", status: "idle", config: {}, position: { x: 950, y: 200 } },
    ],
    edges: [
      { id: "te1", source: "t1", target: "t2" },
      { id: "te2", source: "t2", target: "t3" },
      { id: "te3", source: "t3", target: "t4" },
    ],
  },
  {
    id: "data-analysis",
    name: "Data Analysis Pipeline",
    description: "Extract → Analyze → Visualize → Report",
    category: "Data",
    icon: "BarChart3",
    blocks: [
      { id: "d1", type: "crm", label: "Extract Data", status: "idle", config: {}, position: { x: 50, y: 200 } },
      { id: "d2", type: "analyst", label: "Analyze", status: "idle", config: {}, position: { x: 350, y: 200 } },
      { id: "d3", type: "image", label: "Visualize", status: "idle", config: {}, position: { x: 650, y: 200 } },
      { id: "d4", type: "writer", label: "Report", status: "idle", config: {}, position: { x: 950, y: 200 } },
    ],
    edges: [
      { id: "de1", source: "d1", target: "d2" },
      { id: "de2", source: "d2", target: "d3" },
      { id: "de3", source: "d3", target: "d4" },
    ],
  },
  {
    id: "code-review",
    name: "Code Review Pipeline",
    description: "Generate code → Review → Approve → Deploy",
    category: "Development",
    icon: "Code2",
    blocks: [
      { id: "c1", type: "coder", label: "Generate Code", status: "idle", config: {}, position: { x: 50, y: 200 } },
      { id: "c2", type: "analyst", label: "Code Review", status: "idle", config: {}, position: { x: 350, y: 200 } },
      { id: "c3", type: "approval", label: "Approve", status: "idle", config: {}, position: { x: 650, y: 200 } },
      { id: "c4", type: "email", label: "Deploy Notice", status: "idle", config: {}, position: { x: 950, y: 200 } },
    ],
    edges: [
      { id: "ce1", source: "c1", target: "c2" },
      { id: "ce2", source: "c2", target: "c3" },
      { id: "ce3", source: "c3", target: "c4" },
    ],
  },
  {
    id: "crm-outreach",
    name: "CRM Outreach Campaign",
    description: "Query customers → Personalize → Send emails",
    category: "Marketing",
    icon: "Users",
    blocks: [
      { id: "m1", type: "crm", label: "Query Customers", status: "idle", config: {}, position: { x: 50, y: 200 } },
      { id: "m2", type: "writer", label: "Personalize", status: "idle", config: {}, position: { x: 350, y: 200 } },
      { id: "m3", type: "approval", label: "Campaign Review", status: "idle", config: {}, position: { x: 650, y: 200 } },
      { id: "m4", type: "email", label: "Send Campaign", status: "idle", config: {}, position: { x: 950, y: 200 } },
    ],
    edges: [
      { id: "me1", source: "m1", target: "m2" },
      { id: "me2", source: "m2", target: "m3" },
      { id: "me3", source: "m3", target: "m4" },
    ],
  },
];

interface TemplateState {
  templates: WorkflowTemplate[];
}

export const useTemplateStore = create<TemplateState>(() => ({
  templates: DEFAULT_TEMPLATES,
}));
