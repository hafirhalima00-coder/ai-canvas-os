"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BlockType } from "@/lib/types";
import { BLOCK_REGISTRY } from "@/lib/types";
import { cn, getBlockTypeColor } from "@/lib/utils";

export type BlockConfigPanelProps = {
  blockId: string;
  blockType: BlockType;
  currentConfig: Record<string, unknown>;
  onSave: (blockId: string, config: Record<string, unknown>) => void;
  onClose: () => void;
};

const selectOptions: Record<string, string[]> = {
  source: ["web", "news", "academic"],
  tone: ["professional", "casual", "technical"],
  length: ["short", "medium", "long"],
  format: ["markdown", "html", "plain", "json", "csv"],
  analysisType: ["summary", "trends", "comparison", "sentiment"],
  language: ["typescript", "python", "javascript", "rust", "go"],
  task: ["generate", "review", "refactor"],
  action: ["lookup", "search", "export", "update"],
  template: ["default", "professional", "newsletter", "alert"],
  size: ["1024x1024", "512x512", "256x256", "1792x1024", "1024x1792"],
  style: ["realistic", "artistic", "cinematic", "anime"],
};

type FieldConfig = {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "switch";
  options?: string[];
};

const fieldMap: Record<BlockType, FieldConfig[]> = {
  research: [
    { key: "query", label: "Search Query", type: "text" },
    { key: "maxResults", label: "Max Results", type: "number" },
    { key: "source", label: "Source", type: "select", options: selectOptions.source },
  ],
  writer: [
    { key: "tone", label: "Tone", type: "select", options: selectOptions.tone },
    { key: "length", label: "Length", type: "select", options: selectOptions.length },
    { key: "format", label: "Format", type: "select", options: selectOptions.format },
  ],
  analyst: [
    { key: "analysisType", label: "Analysis Type", type: "select", options: selectOptions.analysisType },
    { key: "format", label: "Output Format", type: "select", options: ["json", "markdown", "csv"] },
  ],
  coder: [
    { key: "language", label: "Language", type: "select", options: selectOptions.language },
    { key: "task", label: "Task", type: "select", options: selectOptions.task },
  ],
  crm: [
    { key: "action", label: "Action", type: "select", options: selectOptions.action },
    { key: "fields", label: "Fields (comma-separated)", type: "text" },
  ],
  email: [
    { key: "recipient", label: "Recipient", type: "text" },
    { key: "subject", label: "Subject", type: "text" },
    { key: "template", label: "Template", type: "select", options: selectOptions.template },
  ],
  image: [
    { key: "prompt", label: "Image Prompt", type: "textarea" },
    { key: "size", label: "Size", type: "select", options: selectOptions.size },
    { key: "style", label: "Style", type: "select", options: selectOptions.style },
  ],
  approval: [
    { key: "requireNote", label: "Require Note", type: "switch" },
    { key: "timeout", label: "Timeout (seconds)", type: "number" },
  ],
};

function BlockConfigPanel({
  blockId,
  blockType,
  currentConfig,
  onSave,
  onClose,
}: BlockConfigPanelProps) {
  const registry = BLOCK_REGISTRY[blockType];
  const [config, setConfig] = useState<Record<string, unknown>>({ ...registry.defaultConfig, ...currentConfig });

  useEffect(() => {
    setConfig({ ...registry.defaultConfig, ...currentConfig });
  }, [blockId, blockType, registry.defaultConfig, currentConfig]);

  function updateField(key: string, value: unknown) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    onSave(blockId, config);
  }

  function renderField(field: FieldConfig) {
    const value = config[field.key];
    const fieldKey = `${blockId}-${field.key}`;

    switch (field.type) {
      case "text":
        return (
          <Input
            id={fieldKey}
            value={String(value ?? "")}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );

      case "number":
        return (
          <Input
            id={fieldKey}
            type="number"
            value={Number(value ?? 0)}
            onChange={(e) => updateField(field.key, Number(e.target.value))}
          />
        );

      case "textarea":
        return (
          <Textarea
            id={fieldKey}
            value={String(value ?? "")}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            rows={4}
          />
        );

      case "select":
        return (
          <Select
            value={String(value ?? "")}
            onValueChange={(v) => updateField(field.key, v)}
          >
            <SelectTrigger id={fieldKey}>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "switch":
        return (
          <Switch
            id={fieldKey}
            checked={Boolean(value)}
            onCheckedChange={(v) => updateField(field.key, v)}
          />
        );

      default:
        return null;
    }
  }

  const fields = fieldMap[blockType];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <Card
        className={cn(
          "relative w-full max-w-md h-full rounded-none border-l shadow-2xl",
          "bg-background/95 backdrop-blur-xl",
          "animate-in slide-in-from-right duration-300 ease-out"
        )}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderLeft: `3px solid ${getBlockTypeColor(blockType)}` }}
        >
          <div>
            <h2 className="text-lg font-semibold">Configure Block</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {registry.label} &mdash; {registry.description}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Form fields */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={`${blockId}-${field.key}`}>
                {field.label}
              </Label>
              {renderField(field)}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/20">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-1.5" />
            Save Config
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default BlockConfigPanel;
export { BlockConfigPanel };
