"use client";

import { useState } from "react";
import { Brain, Plus, X, FileUp, FileText } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useMemoryStore } from "@/lib/stores/memory-store";

export function MemoryPanel() {
  const { addItem, removeItem, getByType } = useMemoryStore();
  const [contextKey, setContextKey] = useState("");
  const [contextValue, setContextValue] = useState("");
  const [varKey, setVarKey] = useState("");
  const [varValue, setVarValue] = useState("");
  const [docKey, setDocKey] = useState("");
  const [dialogOpen, setDialogOpen] = useState<"context" | "variable" | "document" | null>(null);

  const contextItems = getByType("context");
  const variableItems = getByType("variable");
  const documentItems = getByType("document");

  const handleAddContext = () => {
    if (!contextKey.trim() || !contextValue.trim()) return;
    addItem({ type: "context", key: contextKey.trim(), value: contextValue.trim() });
    setContextKey("");
    setContextValue("");
    setDialogOpen(null);
  };

  const handleAddVariable = () => {
    if (!varKey.trim() || !varValue.trim()) return;
    addItem({ type: "variable", key: varKey.trim(), value: varValue.trim() });
    setVarKey("");
    setVarValue("");
    setDialogOpen(null);
  };

  const handleAddDocument = () => {
    if (!docKey.trim()) return;
    addItem({ type: "document", key: docKey.trim(), value: "Uploaded document" });
    setDocKey("");
    setDialogOpen(null);
  };

  const iconButtonClass =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-6 w-6";

  return (
    <Card className="h-full rounded-none border-y-0 border-r-0 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Brain className="h-4 w-4" />
          Memory & Context
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="context" className="px-4">
          <TabsList className="w-full">
            <TabsTrigger value="context" className="flex-1 text-xs">Context</TabsTrigger>
            <TabsTrigger value="variables" className="flex-1 text-xs">Variables</TabsTrigger>
            <TabsTrigger value="documents" className="flex-1 text-xs">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="context" className="mt-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{contextItems.length} items</span>
                <Dialog
                  open={dialogOpen === "context"}
                  onOpenChange={(open: boolean) => setDialogOpen(open ? "context" : null)}
                >
                  <DialogTrigger asChild>
                    <button className={iconButtonClass} type="button">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Context</DialogTitle>
                      <DialogDescription>Add a new key-value context pair.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="ctx-key">Key</Label>
                        <Input
                          id="ctx-key"
                          placeholder="e.g. user_goal"
                          value={contextKey}
                          onChange={(e) => setContextKey(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ctx-value">Value</Label>
                        <Input
                          id="ctx-value"
                          placeholder="e.g. Build a marketing campaign"
                          value={contextValue}
                          onChange={(e) => setContextValue(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <button
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                          type="button"
                        >
                          Cancel
                        </button>
                      </DialogClose>
                      <Button onClick={handleAddContext}>Add</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="space-y-1.5 pr-2">
                  {contextItems.length === 0 && (
                    <p className="py-6 text-center text-xs text-muted-foreground">No context items</p>
                  )}
                  {contextItems.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-start justify-between rounded-md border p-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{String(item.key)}</p>
                        <p className="truncate text-xs text-muted-foreground">{String(item.value)}</p>
                      </div>
                      <button
                        className="ml-1 h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                        type="button"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="variables" className="mt-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{variableItems.length} items</span>
                <Dialog
                  open={dialogOpen === "variable"}
                  onOpenChange={(open: boolean) => setDialogOpen(open ? "variable" : null)}
                >
                  <DialogTrigger asChild>
                    <button className={iconButtonClass} type="button">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Variable</DialogTitle>
                      <DialogDescription>Define a new variable.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="var-key">Variable Name</Label>
                        <Input
                          id="var-key"
                          placeholder="e.g. target_audience"
                          value={varKey}
                          onChange={(e) => setVarKey(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="var-value">Value</Label>
                        <Input
                          id="var-value"
                          placeholder="e.g. Tech professionals 25-45"
                          value={varValue}
                          onChange={(e) => setVarValue(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <button
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                          type="button"
                        >
                          Cancel
                        </button>
                      </DialogClose>
                      <Button onClick={handleAddVariable}>Add</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="space-y-1.5 pr-2">
                  {variableItems.length === 0 && (
                    <p className="py-6 text-center text-xs text-muted-foreground">No variables</p>
                  )}
                  {variableItems.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-start justify-between rounded-md border p-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{String(item.key)}</p>
                        <p className="truncate text-xs text-muted-foreground">{String(item.value)}</p>
                      </div>
                      <button
                        className="ml-1 h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                        type="button"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{documentItems.length} items</span>
                <Dialog
                  open={dialogOpen === "document"}
                  onOpenChange={(open: boolean) => setDialogOpen(open ? "document" : null)}
                >
                  <DialogTrigger asChild>
                    <button className={iconButtonClass} type="button">
                      <FileUp className="h-3.5 w-3.5" />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Document</DialogTitle>
                      <DialogDescription>Add a document reference.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="doc-name">Document name</Label>
                        <Input
                          id="doc-name"
                          placeholder="e.g. brand_guidelines.pdf"
                          value={docKey}
                          onChange={(e) => setDocKey(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <button
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                          type="button"
                        >
                          Cancel
                        </button>
                      </DialogClose>
                      <Button onClick={handleAddDocument}>Upload</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="space-y-1.5 pr-2">
                  {documentItems.length === 0 && (
                    <p className="py-6 text-center text-xs text-muted-foreground">No documents</p>
                  )}
                  {documentItems.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-start justify-between rounded-md border p-2.5"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate text-xs font-medium">{String(item.key)}</span>
                      </div>
                      <button
                        className="ml-1 h-5 w-5 shrink-0 opacity-0 group-hover:opacity-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                        type="button"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
