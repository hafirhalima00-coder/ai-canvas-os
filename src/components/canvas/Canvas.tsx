"use client";

import React, { useCallback, useRef, useState, useEffect, createContext, useContext } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  ReactFlowProvider,
  type ReactFlowInstance,
  SelectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import AIBlockNode, { type AIBlockNodeData } from "@/components/blocks/AIBlockNode";
import { useCanvasStore } from "@/lib/stores/canvas-store";
import { useWorkflowStore } from "@/lib/stores/workflow-store";
import { generateId } from "@/lib/utils";
import type { AIBlock, BlockType, WorkflowEdge } from "@/lib/types";
import { BLOCK_REGISTRY } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play,
  Square,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Save,
  Layout,
  LayoutDashboard,
} from "lucide-react";

const nodeTypes = { aiBlock: AIBlockNode };

interface DnDContextType {
  draggedType: BlockType | null;
  setDraggedType: (type: BlockType | null) => void;
}

const DnDContext = createContext<DnDContextType>({
  draggedType: null,
  setDraggedType: () => {},
});

export const useDnD = () => useContext(DnDContext);

function buildNodeData(block: AIBlock, onConfigure: (id: string) => void, onRemove: (id: string) => void): AIBlockNodeData {
  return {
    id: block.id,
    type: block.type,
    label: block.label,
    status: block.status,
    config: block.config,
    onConfigure,
    onRemove,
  };
}

function storeEdgeToFlowEdge(edge: WorkflowEdge): Edge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle ?? void 0,
    targetHandle: edge.targetHandle ?? void 0,
    animated: edge.animated,
    style: edge.animated
      ? { stroke: "#3b82f6", strokeWidth: 2 }
      : undefined,
  };
}

function CanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const { draggedType, setDraggedType } = useDnD();

  const storeBlocks = useCanvasStore((s) => s.blocks);
  const storeEdges = useCanvasStore((s) => s.edges);
  const selectedBlockId = useCanvasStore((s) => s.selectedBlockId);
  const workflowName = useCanvasStore((s) => s.workflowName);
  const addBlock = useCanvasStore((s) => s.addBlock);
  const removeBlock = useCanvasStore((s) => s.removeBlock);
  const selectBlock = useCanvasStore((s) => s.selectBlock);
  const addEdgeToStore = useCanvasStore((s) => s.addEdge);
  const clearCanvas = useCanvasStore((s) => s.clearCanvas);
  const getSnapshot = useCanvasStore((s) => s.getSnapshot);
  const restoreSnapshot = useCanvasStore((s) => s.restoreSnapshot);
  const setWorkflowMeta = useCanvasStore((s) => s.setWorkflowMeta);

  const startWorkflow = useWorkflowStore((s) => s.startWorkflow);
  const cancelWorkflow = useWorkflowStore((s) => s.cancelWorkflow);
  const resetWorkflow = useWorkflowStore((s) => s.resetWorkflow);
  const isRunning = useWorkflowStore((s) => s.isRunning);

  const handleConfigure = useCallback(
    (id: string) => selectBlock(id),
    [selectBlock]
  );

  const handleRemove = useCallback(
    (id: string) => removeBlock(id),
    [removeBlock]
  );

  const initialNodes: Node[] = storeBlocks.map((b) => ({
    id: b.id,
    type: "aiBlock",
    position: b.position,
    data: buildNodeData(b, handleConfigure, handleRemove),
  }));
  const initialEdges: Edge[] = storeEdges.map(storeEdgeToFlowEdge);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdgesState, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes((nds) =>
      storeBlocks.map((b) => {
        const existing = nds.find((n) => n.id === b.id);
        return {
          id: b.id,
          type: "aiBlock",
          position: existing?.position ?? b.position,
          data: buildNodeData(b, handleConfigure, handleRemove),
        };
      })
    );
  }, [storeBlocks, setNodes, handleConfigure, handleRemove]);

  useEffect(() => {
    setEdgesState(storeEdges.map(storeEdgeToFlowEdge));
  }, [storeEdges, setEdgesState]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setNodes((nds) =>
        nds.map((n) => {
          const block = storeBlocks.find((b) => b.id === n.id);
          if (!block) return n;
          return {
            ...n,
            data: buildNodeData(block, handleConfigure, handleRemove),
          };
        })
      );
    }, 200);
    return () => clearInterval(interval);
  }, [isRunning, storeBlocks, setNodes, handleConfigure, handleRemove]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        ...connection,
        id: `edge-${generateId()}`,
        animated: false,
      };
      setEdgesState((eds) => addEdge(newEdge, eds));
      if (connection.source && connection.target) {
        addEdgeToStore(
          connection.source,
          connection.target,
          connection.sourceHandle != null ? connection.sourceHandle : undefined,
          connection.targetHandle != null ? connection.targetHandle : undefined
        );
      }
    },
    [setEdgesState, addEdgeToStore]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDraggingOver(false);
      const type = event.dataTransfer.getData("application/reactflow") as BlockType | "";
      if (!type || !BLOCK_REGISTRY[type] || !rfInstance || !reactFlowWrapper.current) return;
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = rfInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      addBlock(type, position);
      setDraggedType(null);
    },
    [rfInstance, addBlock, setDraggedType]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setIsDraggingOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDraggingOver(false);
  }, []);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectBlock(node.id);
    },
    [selectBlock]
  );

  const onNodesDelete = useCallback(
    (deletedNodes: Node[]) => {
      deletedNodes.forEach((n) => removeBlock(n.id));
    },
    [removeBlock]
  );

  const onNodeDragStop = useCallback(
    (event: MouseEvent | TouchEvent, node: Node) => {
      const block = storeBlocks.find((b) => b.id === node.id);
      if (block) {
        const store = useCanvasStore.getState();
        store.updateBlock(node.id, { position: node.position });
      }
    },
    [storeBlocks]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        const selected = nodes.find((n) => n.selected);
        if (selected) {
          removeBlock(selected.id);
        }
      }
    },
    [nodes, removeBlock]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleExport = useCallback(() => {
    const data = getSnapshot();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getSnapshot, workflowName]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.blocks && data.edges) {
            restoreSnapshot(data);
          }
        } catch {
          // invalid file
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [restoreSnapshot]);

  const handleSaveSnapshot = useCallback(() => {
    const snapshot = getSnapshot();
    localStorage.setItem(
      `ai-canvas-snapshot-${Date.now()}`,
      JSON.stringify({ name: `Snapshot ${new Date().toLocaleTimeString()}`, data: snapshot, createdAt: Date.now() })
    );
  }, [getSnapshot]);

  const handleTemplate = useCallback(() => {
    const templates = [
      {
        name: "Research & Write",
        blocks: [
          { type: "research" as BlockType, x: 100, y: 50 },
          { type: "writer" as BlockType, x: 100, y: 250 },
          { type: "approval" as BlockType, x: 100, y: 450 },
        ],
      },
      {
        name: "Data Analysis",
        blocks: [
          { type: "research" as BlockType, x: 100, y: 50 },
          { type: "analyst" as BlockType, x: 100, y: 250 },
          { type: "writer" as BlockType, x: 100, y: 450 },
        ],
      },
    ];

    const choice = window.confirm(
      `Load template: ${templates[0].name}?\n(Cancel for ${templates[1].name})`
    );
    const template = choice ? templates[0] : templates[1];
    if (!template) return;

    clearCanvas();
    setTimeout(() => {
      template.blocks.forEach((b) => addBlock(b.type, { x: b.x, y: b.y }));
    }, 50);
  }, [clearCanvas, addBlock]);

  const selectedNode = nodes.find((n) => n.id === selectedBlockId);
  const selectedBlock = selectedNode?.data as AIBlockNodeData | undefined;

  return (
    <div className="relative w-full h-full flex flex-col bg-background">
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 z-10">
        <input
          value={workflowName}
          onChange={(e) => setWorkflowMeta(e.target.value, "")}
          className="bg-transparent border-none text-sm font-semibold focus:outline-none focus:text-primary w-48 px-1 py-0.5 rounded hover:bg-muted/50 transition-colors"
        />

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          {selectedBlock && (
            <Badge variant="secondary" className="text-xs mr-1">
              {selectedBlock.label} selected
            </Badge>
          )}

          {isRunning ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={cancelWorkflow}
              className="h-7 text-xs gap-1"
            >
              <Square className="w-3 h-3" />
              Stop
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => startWorkflow(storeBlocks, storeEdges)}
              className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700"
            >
              <Play className="w-3 h-3" />
              Run
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={resetWorkflow}
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>

          <div className="w-px h-5 bg-border mx-1" />

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleSaveSnapshot}
            title="Save Snapshot"
          >
            <Save className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleExport}
            title="Export JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleImport}
            title="Import JSON"
          >
            <Upload className="w-3.5 h-3.5" />
          </Button>

          <div className="w-px h-5 bg-border mx-1" />

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleTemplate}
            title="Load Template"
          >
            <Layout className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => window.location.href = "/dashboard"}
            title="Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div ref={reactFlowWrapper} className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onNodeClick={onNodeClick}
          onNodesDelete={onNodesDelete}
          onNodeDragStop={onNodeDragStop}
          onInit={setRfInstance}
          nodeTypes={nodeTypes}
          selectionMode={SelectionMode.Partial}
          selectionOnDrag
          panOnDrag={[1, 2]}
          selectNodesOnDrag
          deleteKeyCode={null}
          multiSelectionKeyCode="Shift"
          fitView
          colorMode="dark"
          defaultEdgeOptions={{
            style: { stroke: "#525252", strokeWidth: 1.5 },
            labelStyle: { fill: "#a3a3a3", fontSize: 10 },
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#262626"
          />
          <MiniMap
            nodeColor={(n) => {
              const block = n.data as AIBlockNodeData;
              const reg = BLOCK_REGISTRY[block?.type];
              return reg?.color ?? "#525252";
            }}
            maskColor="rgba(0,0,0,0.7)"
            className="!bg-zinc-900/80 !border !border-zinc-800 rounded-lg"
            style={{ background: "rgba(24,24,27,0.8)" }}
            pannable
            zoomable
          />
          <Controls
            position="bottom-right"
            className="!bg-zinc-900/90 !border !border-zinc-800 !rounded-lg !backdrop-blur-sm"
          />
        </ReactFlow>

        {isDraggingOver && (
          <div className="absolute inset-0 z-50 pointer-events-none">
            <div className="w-full h-full border-2 border-dashed border-primary/40 rounded-2xl m-2 bg-primary/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Card className="shadow-2xl border-primary/30">
                <CardContent className="flex items-center gap-3 py-3 px-5">
                  <Plus className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">
                    Drop {draggedType ? BLOCK_REGISTRY[draggedType]?.label ?? "" : "block"} here
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Canvas() {
  const [draggedType, setDraggedType] = useState<BlockType | null>(null);

  return (
    <DnDContext.Provider value={{ draggedType, setDraggedType }}>
      <ReactFlowProvider>
        <CanvasInner />
      </ReactFlowProvider>
    </DnDContext.Provider>
  );
}
