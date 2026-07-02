"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 0;

function BlockPalette() {
  const blockTypes = [
    { type: "research", label: "Research", color: "#3b82f6", description: "Search the web" },
    { type: "writer", label: "Writer", color: "#8b5cf6", description: "Generate content" },
    { type: "analyst", label: "Analyst", color: "#f59e0b", description: "Analyze data" },
    { type: "coder", label: "Coder", color: "#10b981", description: "Generate code" },
    { type: "crm", label: "CRM", color: "#ec4899", description: "Query customer data" },
    { type: "email", label: "Email", color: "#ef4444", description: "Send emails" },
    { type: "image", label: "Image", color: "#14b8a6", description: "Generate images" },
    { type: "approval", label: "Approval", color: "#f97316", description: "Human approval" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-zinc-800/50">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Block Palette
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {blockTypes.map((block) => (
          <div
            key={block.type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("application/block-type", block.type);
              e.dataTransfer.effectAllowed = "copy";
            }}
            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-grab transition-colors hover:bg-zinc-800/50 active:cursor-grabbing"
          >
            <div
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: block.color }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-zinc-200 truncate">{block.label}</span>
              <span className="text-xs text-zinc-500 truncate">{block.description}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-zinc-800/50">
        <p className="text-[10px] text-zinc-600">
          Drag blocks onto the canvas
        </p>
      </div>
    </div>
  );
}

interface CollapsibleSidebarProps {
  className?: string;
}

export function CollapsibleSidebar({ className }: CollapsibleSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={cn("relative flex shrink-0", className)}>
      <div
        className="overflow-hidden border-r border-zinc-800/50 bg-zinc-950/50"
        style={{
          width: isOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
          transition: "width 200ms ease-in-out",
        }}
      >
        {isOpen && <BlockPalette />}
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700/50 bg-zinc-900 text-zinc-400 shadow-lg transition-colors hover:bg-zinc-800 hover:text-zinc-200",
          !isOpen && "-right-3"
        )}
      >
        {isOpen ? (
          <PanelLeftClose className="h-3 w-3" />
        ) : (
          <PanelLeft className="h-3 w-3" />
        )}
      </button>
    </div>
  );
}
