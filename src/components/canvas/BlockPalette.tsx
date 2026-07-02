"use client";

import { useState, useCallback } from "react";
import { BLOCK_REGISTRY, type BlockType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Search,
  PenLine,
  BarChart3,
  Code2,
  Users,
  Mail,
  Image,
  ShieldCheck,
  GripVertical,
  Blocks,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Search,
  PenLine,
  BarChart3,
  Code2,
  Users,
  Mail,
  Image,
  ShieldCheck,
};

const categoryOrder: { key: string; label: string; types: BlockType[] }[] = [
  {
    key: "core",
    label: "Core AI",
    types: ["research", "writer", "analyst", "coder"],
  },
  {
    key: "integrations",
    label: "Integrations",
    types: ["crm", "email"],
  },
  {
    key: "media",
    label: "Media",
    types: ["image"],
  },
  {
    key: "workflow",
    label: "Workflow Control",
    types: ["approval"],
  },
];

interface BlockPaletteProps {
  onDragStart?: (type: BlockType) => void;
}

export default function BlockPalette({ onDragStart }: BlockPaletteProps) {
  const [search, setSearch] = useState("");

  const filteredCategories = categoryOrder
    .map((cat) => ({
      ...cat,
      types: cat.types.filter((t) => {
        const reg = BLOCK_REGISTRY[t];
        if (!reg) return false;
        const q = search.toLowerCase();
        return (
          reg.label.toLowerCase().includes(q) ||
          reg.description.toLowerCase().includes(q)
        );
      }),
    }))
    .filter((cat) => cat.types.length > 0);

  const handleDragStart = useCallback(
    (e: React.DragEvent, type: BlockType) => {
      e.dataTransfer.setData("application/reactflow", type);
      e.dataTransfer.effectAllowed = "move";
      onDragStart?.(type);
    },
    [onDragStart]
  );

  return (
    <div className="flex flex-col h-full bg-card border-l">
      <div className="p-3 border-b space-y-2">
        <div className="flex items-center gap-2">
          <Blocks className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">Block Library</span>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search blocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {filteredCategories.map((cat) => (
            <div key={cat.key}>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                {cat.label}
              </h4>
              <div className="space-y-1.5">
                {cat.types.map((type) => {
                  const reg = BLOCK_REGISTRY[type];
                  if (!reg) return null;
                  const Icon = iconMap[reg.icon];

                  return (
                    <Card
                      key={type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, type)}
                      className={cn(
                        "group cursor-grab active:cursor-grabbing",
                        "transition-all duration-150 hover:shadow-md",
                        "border-transparent hover:border-border"
                      )}
                    >
                      <div className="flex items-center gap-2.5 p-2.5">
                        <GripVertical className="w-3 h-3 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors shrink-0" />
                        <div
                          className="flex items-center justify-center w-7 h-7 rounded-md shrink-0"
                          style={{ background: `${reg.color}20` }}
                        >
                          {Icon && (
                            <Icon
                              className="w-3.5 h-3.5"
                              style={{ color: reg.color }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">
                            {reg.label}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate leading-tight">
                            {reg.description}
                          </div>
                        </div>
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0 opacity-60"
                          style={{ background: reg.color }}
                        />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-6 h-6 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No blocks found</p>
              <p className="text-[10px] text-muted-foreground/60">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
