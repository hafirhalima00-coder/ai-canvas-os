import { describe, it, expect } from "vitest";
import { topologicalSort, estimateBlockCost } from "@/lib/services/workflow-engine";
import type { AIBlock, WorkflowEdge } from "@/lib/types";

describe("topologicalSort", () => {
  it("returns blocks in correct topological order", () => {
    const blocks: AIBlock[] = [
      { id: "a", type: "research", label: "A", status: "idle", config: {}, position: { x: 0, y: 0 } },
      { id: "b", type: "writer", label: "B", status: "idle", config: {}, position: { x: 0, y: 0 } },
      { id: "c", type: "analyst", label: "C", status: "idle", config: {}, position: { x: 0, y: 0 } },
    ];
    const edges: WorkflowEdge[] = [
      { id: "e1", source: "a", target: "b" },
      { id: "e2", source: "b", target: "c" },
    ];

    const result = topologicalSort(blocks, edges);
    const ids = result.map((b) => b.id);
    expect(ids.indexOf("a")).toBeLessThan(ids.indexOf("b"));
    expect(ids.indexOf("b")).toBeLessThan(ids.indexOf("c"));
  });

  it("handles blocks with no edges", () => {
    const blocks: AIBlock[] = [
      { id: "a", type: "research", label: "A", status: "idle", config: {}, position: { x: 0, y: 0 } },
      { id: "b", type: "writer", label: "B", status: "idle", config: {}, position: { x: 0, y: 0 } },
    ];

    const result = topologicalSort(blocks, []);
    expect(result).toHaveLength(2);
  });

  it("handles diamond dependencies", () => {
    const blocks: AIBlock[] = [
      { id: "a", type: "research", label: "A", status: "idle", config: {}, position: { x: 0, y: 0 } },
      { id: "b", type: "writer", label: "B", status: "idle", config: {}, position: { x: 0, y: 0 } },
      { id: "c", type: "analyst", label: "C", status: "idle", config: {}, position: { x: 0, y: 0 } },
      { id: "d", type: "coder", label: "D", status: "idle", config: {}, position: { x: 0, y: 0 } },
    ];
    const edges: WorkflowEdge[] = [
      { id: "e1", source: "a", target: "b" },
      { id: "e2", source: "a", target: "c" },
      { id: "e3", source: "b", target: "d" },
      { id: "e4", source: "c", target: "d" },
    ];

    const result = topologicalSort(blocks, edges);
    const ids = result.map((b) => b.id);
    expect(ids.indexOf("a")).toBeLessThan(ids.indexOf("b"));
    expect(ids.indexOf("a")).toBeLessThan(ids.indexOf("c"));
    expect(ids.indexOf("b")).toBeLessThan(ids.indexOf("d"));
    expect(ids.indexOf("c")).toBeLessThan(ids.indexOf("d"));
  });
});

describe("estimateBlockCost", () => {
  it("returns 5 for research", () => {
    expect(estimateBlockCost("research")).toBe(5);
  });

  it("returns 10 for writer", () => {
    expect(estimateBlockCost("writer")).toBe(10);
  });

  it("returns 15 for coder", () => {
    expect(estimateBlockCost("coder")).toBe(15);
  });

  it("returns 50 for image", () => {
    expect(estimateBlockCost("image")).toBe(50);
  });

  it("returns 0 for approval", () => {
    expect(estimateBlockCost("approval")).toBe(0);
  });

  it("returns default cost for unknown types", () => {
    expect(estimateBlockCost("unknown")).toBe(5);
  });
});
