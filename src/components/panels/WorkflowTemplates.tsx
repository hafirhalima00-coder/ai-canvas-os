"use client";

import { LayoutTemplate, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTemplateStore } from "@/lib/stores/template-store";
import { useCanvasStore } from "@/lib/stores/canvas-store";

function getCategoryVariant(category: string): "default" | "secondary" | "destructive" | "outline" {
  switch (category) {
    case "Content":
      return "default";
    case "Data":
      return "secondary";
    case "Development":
      return "outline";
    case "Marketing":
      return "destructive";
    default:
      return "outline";
  }
}

export function WorkflowTemplates() {
  const { templates } = useTemplateStore();
  const { setBlocks, setEdges, setWorkflowMeta } = useCanvasStore();

  const handleUseTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;
    setBlocks(template.blocks);
    setEdges(template.edges);
    setWorkflowMeta(template.name, template.description);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <LayoutTemplate className="h-4 w-4" />
        <h3 className="text-sm font-medium">Workflow Templates</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader className="p-3 pb-0">
              <div className="flex items-start justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <LayoutTemplate className="h-3.5 w-3.5" />
                </div>
                <Badge variant={getCategoryVariant(template.category)} className="text-[10px]">
                  {template.category}
                </Badge>
              </div>
              <CardTitle className="mt-2 text-sm">{template.name}</CardTitle>
              <CardDescription className="text-xs leading-tight">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto flex items-center justify-between p-3 pt-2">
              <span className="text-[10px] text-muted-foreground">
                {template.blocks.length} blocks
              </span>
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-6 px-2"
                type="button"
                onClick={() => handleUseTemplate(template.id)}
              >
                Use
                <ArrowRight className="h-3 w-3" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
