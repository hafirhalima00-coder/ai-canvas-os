"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PanelRightOpen, PanelRightClose } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/lib/stores/canvas-store";
import { MemoryPanel } from "@/components/panels/MemoryPanel";
import FailureTest from "@/components/canvas/FailureTest";

const Canvas = dynamic(() => import("@/components/canvas/Canvas"), { ssr: false });

export default function CanvasPage() {
  const [memoryPanelOpen, setMemoryPanelOpen] = useState(true);
  const blocks = useCanvasStore((s) => s.blocks);
  const failedBlock = blocks.find((b) => b.status === "error");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "m") {
        e.preventDefault();
        setMemoryPanelOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="relative flex-1 overflow-hidden">
        <Canvas />
      </div>

      <div
        className="relative overflow-hidden border-l border-zinc-800/50 bg-zinc-950/50"
        style={{
          width: memoryPanelOpen ? 320 : 0,
          transition: "width 200ms ease-in-out",
        }}
      >
        {memoryPanelOpen && <MemoryPanel />}
      </div>

      <button
        onClick={() => setMemoryPanelOpen(!memoryPanelOpen)}
        className={cn(
          "absolute right-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-l-lg border border-zinc-800/50 bg-zinc-900 text-zinc-400 shadow-lg transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        )}
        title={memoryPanelOpen ? "Close memory panel (Ctrl+M)" : "Open memory panel (Ctrl+M)"}
      >
        {memoryPanelOpen ? (
          <PanelRightClose className="h-4 w-4" />
        ) : (
          <PanelRightOpen className="h-4 w-4" />
        )}
      </button>

      {failedBlock && (
        <div className="fixed bottom-4 right-4 z-50 w-[420px] max-h-[80vh] overflow-y-auto">
          <FailureTest
            blockLabel={failedBlock.label}
            blockType={failedBlock.type}
            errorMessage={failedBlock.error || "Unknown error occurred"}
            errorTimestamp={failedBlock.completedAt}
            onDismiss={() => {
              const store = useCanvasStore.getState();
              store.updateBlock(failedBlock.id, { status: "idle", error: undefined });
            }}
          />
        </div>
      )}
    </div>
  );
}
