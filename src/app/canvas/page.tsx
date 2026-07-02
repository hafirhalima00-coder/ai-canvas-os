"use client";

import { useState, useEffect } from "react";
import { PanelRightOpen, PanelRightClose } from "lucide-react";
import { cn } from "@/lib/utils";

function CanvasPlaceholder() {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-zinc-950/30">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-zinc-800/50">
          <svg
            className="h-8 w-8 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-zinc-300">Empty Canvas</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Drag blocks from the palette to get started
        </p>
      </div>
    </div>
  );
}

function MemoryPanelPlaceholder() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-800/50 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Memory
        </h2>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xs text-zinc-500">Memory panel coming soon</p>
      </div>
    </div>
  );
}

export default function CanvasPage() {
  const [memoryPanelOpen, setMemoryPanelOpen] = useState(true);

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
        <CanvasPlaceholder />
      </div>

      <div
        className="relative overflow-hidden border-l border-zinc-800/50 bg-zinc-950/50"
        style={{
          width: memoryPanelOpen ? 320 : 0,
          transition: "width 200ms ease-in-out",
        }}
      >
        {memoryPanelOpen && <MemoryPanelPlaceholder />}
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
    </div>
  );
}
