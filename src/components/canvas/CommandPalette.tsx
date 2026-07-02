"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BLOCK_REGISTRY, type BlockType } from "@/lib/types";
import { useCanvasStore } from "@/lib/stores/canvas-store";
import { useWorkflowStore } from "@/lib/stores/workflow-store";
import { useTheme } from "next-themes";
import {
  Search,
  PenLine,
  BarChart3,
  Code2,
  Users,
  Mail,
  Image,
  ShieldCheck,
  Play,
  Square,
  Save,
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  LayoutDashboard,
  Command,
  ArrowRight,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  PenLine,
  BarChart3,
  Code2,
  Users,
  Mail,
  Image,
  ShieldCheck,
};

interface Command {
  id: string;
  label: string;
  description: string;
  category: string;
  action: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setTheme, theme } = useTheme();

  const addBlock = useCanvasStore((s) => s.addBlock);
  const blocks = useCanvasStore((s) => s.blocks);
  const edges = useCanvasStore((s) => s.edges);
  const clearCanvas = useCanvasStore((s) => s.clearCanvas);
  const getSnapshot = useCanvasStore((s) => s.getSnapshot);
  const restoreSnapshot = useCanvasStore((s) => s.restoreSnapshot);

  const startWorkflow = useWorkflowStore((s) => s.startWorkflow);
  const cancelWorkflow = useWorkflowStore((s) => s.cancelWorkflow);

  const buildCommands = useCallback((): Command[] => {
    const addBlockCommands: Command[] = (Object.keys(BLOCK_REGISTRY) as BlockType[]).map(
      (type) => {
        const reg = BLOCK_REGISTRY[type];
        const Icon = reg ? iconMap[reg.icon] : undefined;
        return {
          id: `add-${type}`,
          label: `Add ${reg?.label ?? type} Block`,
          description: reg?.description ?? "",
          category: "Add Block",
          icon: Icon,
          action: () => {
            addBlock(type, { x: 200 + Math.random() * 400, y: 200 + Math.random() * 300 });
            onOpenChange(false);
          },
        };
      }
    );

    return [
      ...addBlockCommands,
      {
        id: "run-workflow",
        label: "Run Workflow",
        description: "Start executing the workflow",
        category: "Workflow",
        icon: Play,
        action: () => {
          startWorkflow(blocks, edges);
          onOpenChange(false);
        },
      },
      {
        id: "stop-workflow",
        label: "Stop Workflow",
        description: "Stop the currently running workflow",
        category: "Workflow",
        icon: Square,
        action: () => {
          cancelWorkflow();
          onOpenChange(false);
        },
      },
      {
        id: "save-snapshot",
        label: "Save Snapshot",
        description: "Save a version snapshot of the current workflow",
        category: "Workflow",
        icon: Save,
        action: () => {
          const snapshot = getSnapshot();
          const name = `Snapshot ${new Date().toLocaleTimeString()}`;
          localStorage.setItem(
            `ai-canvas-snapshot-${Date.now()}`,
            JSON.stringify({ name, data: snapshot, createdAt: Date.now() })
          );
          onOpenChange(false);
        },
      },
      {
        id: "export-workflow",
        label: "Export Workflow",
        description: "Export the workflow as JSON",
        category: "File",
        icon: Download,
        action: () => {
          const data = getSnapshot();
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `workflow-${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
          onOpenChange(false);
        },
      },
      {
        id: "import-workflow",
        label: "Import Workflow",
        description: "Import a workflow from a JSON file",
        category: "File",
        icon: Upload,
        action: () => {
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
          onOpenChange(false);
        },
      },
      {
        id: "clear-canvas",
        label: "Clear Canvas",
        description: "Remove all blocks and edges from the canvas",
        category: "Workflow",
        icon: Trash2,
        action: () => {
          clearCanvas();
          onOpenChange(false);
        },
      },
      {
        id: "toggle-dark-mode",
        label: "Toggle Dark Mode",
        description: "Switch between light and dark theme",
        category: "Preferences",
        icon: theme === "dark" ? Sun : Moon,
        action: () => {
          setTheme(theme === "dark" ? "light" : "dark");
          onOpenChange(false);
        },
      },
      {
        id: "open-dashboard",
        label: "Open Dashboard",
        description: "Navigate to the analytics dashboard",
        category: "Navigation",
        icon: LayoutDashboard,
        action: () => {
          window.location.href = "/dashboard";
          onOpenChange(false);
        },
      },
    ];
  }, [addBlock, blocks, edges, startWorkflow, cancelWorkflow, clearCanvas, getSnapshot, restoreSnapshot, onOpenChange, theme, setTheme]);

  const commands = buildCommands();

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const grouped = filtered.reduce(
    (acc, cmd) => {
      if (!acc[cmd.category]) acc[cmd.category] = [];
      acc[cmd.category].push(cmd);
      return acc;
    },
    {} as Record<string, Command[]>
  );

  const flatFiltered = filtered;
  const categoryKeys = Object.keys(grouped);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (flatFiltered[selectedIndex]) {
            flatFiltered[selectedIndex].action();
          }
          break;
      }
    },
    [flatFiltered, selectedIndex]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-0 gap-0 top-[15%] translate-y-0">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Command className="w-4 h-4 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="border-0 shadow-none focus-visible:ring-0 px-0 h-7 text-sm"
          />
        </div>

        <div className="max-h-[320px] overflow-y-auto py-2">
          {categoryKeys.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Try a different search term
              </p>
            </div>
          )}

          {categoryKeys.map((cat) => (
            <div key={cat}>
              <div className="px-4 py-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {cat}
                </span>
              </div>
              {grouped[cat].map((cmd) => {
                const idx = flatFiltered.indexOf(cmd);
                const isSelected = idx === selectedIndex;
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-2 text-left transition-colors",
                      isSelected && "bg-accent text-accent-foreground"
                    )}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => cmd.action()}
                  >
                    {Icon && (
                      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-muted shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{cmd.label}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {cmd.description}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="border-t px-4 py-2 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded border bg-muted text-[10px] font-mono">↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded border bg-muted text-[10px] font-mono">↵</kbd>
            Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded border bg-muted text-[10px] font-mono">Esc</kbd>
            Close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
