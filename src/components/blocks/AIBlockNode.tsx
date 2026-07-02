"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import {
  Search,
  PenLine,
  BarChart3,
  Code2,
  Users,
  Mail,
  Image,
  ShieldCheck,
  Settings2,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  PauseCircle,
  type LucideIcon,
} from "lucide-react";
import type { BlockType, BlockStatus } from "@/lib/types";
import { BLOCK_REGISTRY } from "@/lib/types";
import { cn, getBlockTypeColor } from "@/lib/utils";

export type AIBlockNodeData = {
  id: string;
  type: BlockType;
  label: string;
  status: BlockStatus;
  config: Record<string, unknown>;
  onConfigure?: (id: string, type: BlockType) => void;
  onRemove?: (id: string) => void;
};

const iconMap: Record<BlockType, LucideIcon> = {
  research: Search,
  writer: PenLine,
  analyst: BarChart3,
  coder: Code2,
  crm: Users,
  email: Mail,
  image: Image,
  approval: ShieldCheck,
};

const statusStyle: Record<
  BlockStatus,
  { badge: string; dot: string; icon: LucideIcon | null; spin: boolean }
> = {
  idle: { badge: "bg-gray-500/10 text-gray-400", dot: "bg-gray-400", icon: null, spin: false },
  running: {
    badge: "bg-blue-500/10 text-blue-400",
    dot: "bg-blue-400",
    icon: Loader2,
    spin: true,
  },
  completed: {
    badge: "bg-green-500/10 text-green-400",
    dot: "bg-green-400",
    icon: CheckCircle2,
    spin: false,
  },
  error: { badge: "bg-red-500/10 text-red-400", dot: "bg-red-400", icon: XCircle, spin: false },
  paused: {
    badge: "bg-orange-500/10 text-orange-400",
    dot: "bg-orange-400",
    icon: PauseCircle,
    spin: false,
  },
};

const outputHandles: Partial<Record<BlockType, { id: string; label: string }[]>> = {
  analyst: [
    { id: "output-insights", label: "Insights" },
    { id: "output-raw", label: "Raw Data" },
  ],
  approval: [
    { id: "approved", label: "Approved" },
    { id: "denied", label: "Denied" },
  ],
};

function AIBlockNode({ data, id: nodeId }: NodeProps<Node<AIBlockNodeData>>) {
  const registry = BLOCK_REGISTRY[data.type];
  const Icon = iconMap[data.type];
  const status = statusStyle[data.status];
  const outputs = outputHandles[data.type] ?? [{ id: "output", label: "" }];
  const color = getBlockTypeColor(data.type);

  return (
    <div className="relative group">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !border-2 !border-background !bg-muted-foreground"
      />

      <div
        className={cn(
          "min-w-[220px] rounded-xl border backdrop-blur-xl shadow-lg transition-all duration-200",
          "bg-background/80 border-border/50",
          "group-hover:shadow-xl group-hover:border-border/80",
          data.status === "running" && "ring-1 ring-blue-500/30"
        )}
        style={{ borderLeft: `3px solid ${color}` }}
        onClick={() => data.onConfigure?.(nodeId, data.type)}
      >
        <div className="p-3.5">
          <div className="flex items-start gap-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
              style={{ backgroundColor: `${color}18` }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate leading-tight">
                {data.label}
              </p>
              <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                {registry.description}
              </p>
            </div>

            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0",
                status.badge
              )}
            >
              {status.icon && (
                <status.icon
                  className={cn("w-3 h-3", status.spin && "animate-spin")}
                />
              )}
              {!status.icon && (
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    status.dot,
                    status.spin && "animate-ping"
                  )}
                />
              )}
              <span className="capitalize">{data.status}</span>
            </span>
          </div>

          <div className="flex items-center gap-1 mt-3 pt-2.5 border-t border-border/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                data.onConfigure?.(nodeId, data.type);
              }}
            >
              <Settings2 className="w-3 h-3" />
              Configure
            </button>
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors ml-auto"
              onClick={(e) => {
                e.stopPropagation();
                data.onRemove?.(nodeId);
              }}
            >
              <X className="w-3 h-3" />
              Remove
            </button>
          </div>
        </div>

        {data.status === "running" && (
          <div className="h-0.5 bg-blue-500/20 rounded-b-xl overflow-hidden">
            <div className="h-full w-1/2 bg-blue-500 rounded-full animate-[progress_1s_ease-in-out_infinite]" />
          </div>
        )}
      </div>

      {outputs.map((output, idx) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          className={cn("!w-3 !h-3 !border-2 !border-background !bg-muted-foreground")}
          style={
            outputs.length > 1
              ? { top: `${25 + (idx * 50) / (outputs.length - 1)}%` }
              : undefined
          }
        >
          {output.label && (
            <span className="absolute right-full mr-1.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground whitespace-nowrap pointer-events-none">
              {output.label}
            </span>
          )}
        </Handle>
      ))}
    </div>
  );
}

export default AIBlockNode;
export { AIBlockNode };
