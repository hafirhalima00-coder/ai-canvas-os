"use client";

import { create } from "zustand";
import type { WorkflowTemplate } from "@/lib/types";

const DEFAULT_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "crm-outreach",
    name: "Enterprise Sales Outreach",
    description: "Query enterprise leads → Research intent → Personalize emails → Get approval → Send",
    category: "Sales",
    icon: "Users",
    blocks: [
      {
        id: "so1",
        type: "crm",
        label: "Pull Enterprise Leads",
        status: "idle",
        config: { action: "search", fields: ["name", "company", "title", "lastTouch", "dealSize"] },
        position: { x: 50, y: 200 },
      },
      {
        id: "so2",
        type: "research",
        label: "Research Decision Makers",
        status: "idle",
        config: { query: "company news and recent funding rounds", maxResults: 5, source: "web" },
        position: { x: 350, y: 100 },
      },
      {
        id: "so3",
        type: "analyst",
        label: "Score & Segment Leads",
        status: "idle",
        config: { analysisType: "scoring", format: "json" },
        position: { x: 350, y: 300 },
      },
      {
        id: "so4",
        type: "writer",
        label: "Personalize Outreach",
        status: "idle",
        config: { tone: "professional", length: "medium", format: "email" },
        position: { x: 650, y: 200 },
      },
      {
        id: "so5",
        type: "approval",
        label: "Campaign Review",
        status: "idle",
        config: { requireNote: true, timeout: 3600 },
        position: { x: 950, y: 200 },
      },
      {
        id: "so6",
        type: "email",
        label: "Send Campaign",
        status: "idle",
        config: { template: "enterprise-outreach", subject: "Partnership opportunity" },
        position: { x: 1250, y: 200 },
      },
    ],
    edges: [
      { id: "se1", source: "so1", target: "so2" },
      { id: "se2", source: "so1", target: "so3" },
      { id: "se3", source: "so2", target: "so4" },
      { id: "se4", source: "so3", target: "so4" },
      { id: "se5", source: "so4", target: "so5" },
      { id: "se6", source: "so5", target: "so6" },
    ],
  },
  {
    id: "content-pipeline",
    name: "Content Pipeline",
    description: "Research topic → Write draft → Review → Publish",
    category: "Content",
    icon: "PenLine",
    blocks: [
      { id: "t1", type: "research", label: "Research Topic", status: "idle", config: { query: "AI interface design trends 2025", source: "web" }, position: { x: 50, y: 200 } },
      { id: "t2", type: "writer", label: "Write First Draft", status: "idle", config: { tone: "technical", length: "long" }, position: { x: 350, y: 200 } },
      { id: "t3", type: "approval", label: "Editor Review", status: "idle", config: { requireNote: true }, position: { x: 650, y: 200 } },
      { id: "t4", type: "email", label: "Publish", status: "idle", config: { template: "newsletter" }, position: { x: 950, y: 200 } },
    ],
    edges: [
      { id: "te1", source: "t1", target: "t2" },
      { id: "te2", source: "t2", target: "t3" },
      { id: "te3", source: "t3", target: "t4" },
    ],
  },
  {
    id: "data-analysis",
    name: "Sales Analytics Pipeline",
    description: "Extract CRM data → Analyze trends → Visualize → Report",
    category: "Data",
    icon: "BarChart3",
    blocks: [
      { id: "d1", type: "crm", label: "Extract Pipeline Data", status: "idle", config: { action: "export", fields: ["revenue", "closeDate", "stage"] }, position: { x: 50, y: 200 } },
      { id: "d2", type: "analyst", label: "Analyze Win Rates", status: "idle", config: { analysisType: "trends" }, position: { x: 350, y: 200 } },
      { id: "d3", type: "image", label: "Generate Charts", status: "idle", config: { style: "professional" }, position: { x: 650, y: 200 } },
      { id: "d4", type: "writer", label: "Executive Summary", status: "idle", config: { tone: "executive", length: "short" }, position: { x: 950, y: 200 } },
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
    description: "Generate code → Review → Approve → Notify team",
    category: "Development",
    icon: "Code2",
    blocks: [
      { id: "c1", type: "coder", label: "Generate Code", status: "idle", config: { language: "typescript", task: "generate" }, position: { x: 50, y: 200 } },
      { id: "c2", type: "analyst", label: "Code Review", status: "idle", config: { analysisType: "review" }, position: { x: 350, y: 200 } },
      { id: "c3", type: "approval", label: "Approve", status: "idle", config: { requireNote: true }, position: { x: 650, y: 200 } },
      { id: "c4", type: "email", label: "Notify Team", status: "idle", config: { template: "team-notification" }, position: { x: 950, y: 200 } },
    ],
    edges: [
      { id: "ce1", source: "c1", target: "c2" },
      { id: "ce2", source: "c2", target: "c3" },
      { id: "ce3", source: "c3", target: "c4" },
    ],
  },
];

interface TemplateState {
  templates: WorkflowTemplate[];
}

export const useTemplateStore = create<TemplateState>(() => ({
  templates: DEFAULT_TEMPLATES,
}));
