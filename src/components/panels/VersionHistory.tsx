"use client";

import { useState, useEffect } from "react";
import { History, RotateCcw, Trash2, Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCanvasStore } from "@/lib/stores/canvas-store";
import {
  createSnapshot,
  getSnapshots,
  deleteSnapshot,
} from "@/lib/services/version-history";
import { formatDate } from "@/lib/utils";
import type { WorkflowSnapshot } from "@/lib/types";

export function VersionHistory() {
  const { workflowName, getSnapshot, restoreSnapshot, blocks } = useCanvasStore();
  const [open, setOpen] = useState(false);
  const [snapshots, setSnapshots] = useState<WorkflowSnapshot[]>([]);
  const [snapshotName, setSnapshotName] = useState("");
  const [confirmAction, setConfirmAction] = useState<{
    type: "restore" | "delete";
    snapshot: WorkflowSnapshot;
  } | null>(null);

  useEffect(() => {
    if (open) {
      setSnapshots(getSnapshots());
    }
  }, [open]);

  const handleCreateSnapshot = () => {
    const name = snapshotName.trim() || `Snapshot ${new Date().toLocaleString()}`;
    const data = getSnapshot();
    createSnapshot("default", name, data.blocks, data.edges);
    setSnapshotName("");
    setSnapshots(getSnapshots());
  };

  const handleRestore = () => {
    if (!confirmAction) return;
    restoreSnapshot(confirmAction.snapshot.data);
    setConfirmAction(null);
    setOpen(false);
  };

  const handleDelete = () => {
    if (!confirmAction) return;
    deleteSnapshot(confirmAction.snapshot.id);
    setConfirmAction(null);
    setSnapshots(getSnapshots());
  };

  const iconBtnClass =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-7 w-7";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <History className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            Manage snapshots of &ldquo;{workflowName || "Untitled Workflow"}&rdquo;
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-end gap-2 pb-2">
          <div className="flex-1 space-y-1">
            <Label htmlFor="snapshot-name">New snapshot name</Label>
            <Input
              id="snapshot-name"
              placeholder="e.g. Before major refactor"
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateSnapshot} disabled={blocks.length === 0}>
            <Save className="mr-1 h-3.5 w-3.5" />
            Save
          </Button>
        </div>

        {snapshots.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <Clock className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No snapshots yet</p>
            <p className="text-xs text-muted-foreground/60">
              Save a snapshot to capture the current canvas state
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="space-y-2">
              {snapshots.map((snapshot) => (
                <Card key={snapshot.id} className="overflow-hidden">
                  <CardContent className="flex items-center gap-3 p-3">
                    <Clock className="h-8 w-8 shrink-0 text-muted-foreground/40" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{snapshot.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(snapshot.createdAt)}
                      </p>
                      <p className="text-xs text-muted-foreground/60">
                        {snapshot.data.blocks.length} blocks, {snapshot.data.edges.length} edges
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        className={iconBtnClass}
                        type="button"
                        title="Restore"
                        onClick={() =>
                          setConfirmAction({ type: "restore", snapshot })
                        }
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className={iconBtnClass + " text-destructive hover:text-destructive"}
                        type="button"
                        title="Delete"
                        onClick={() =>
                          setConfirmAction({ type: "delete", snapshot })
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}

        <Dialog
          open={!!confirmAction}
          onOpenChange={(open: boolean) => {
            if (!open) setConfirmAction(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {confirmAction?.type === "restore" ? "Restore Snapshot" : "Delete Snapshot"}
              </DialogTitle>
              <DialogDescription>
                {confirmAction?.type === "restore"
                  ? `Are you sure you want to restore "${confirmAction?.snapshot.name}"? Current canvas will be replaced.`
                  : `Are you sure you want to delete "${confirmAction?.snapshot.name}"? This action cannot be undone.`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                  type="button"
                >
                  Cancel
                </button>
              </DialogClose>
              <Button
                variant={confirmAction?.type === "delete" ? "destructive" : "default"}
                onClick={confirmAction?.type === "restore" ? handleRestore : handleDelete}
              >
                {confirmAction?.type === "restore" ? "Restore" : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
