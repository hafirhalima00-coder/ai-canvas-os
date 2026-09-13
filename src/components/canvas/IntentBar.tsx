"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  inferNextIntent,
  checkOllamaStatus,
  type IntentResult,
  type WorkflowState,
} from "@/lib/services/intent-engine";
import { useCanvasStore } from "@/lib/stores/canvas-store";
import { useWorkflowStore } from "@/lib/stores/workflow-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  ChevronRight,
  Wifi,
  WifiOff,
} from "lucide-react";

const INTENT_LABELS: Record<IntentResult["intent"], string> = {
  execute: "Executing...",
  decide: "Decision needed",
  "error-recovery": "Error recovery",
  review: "Review results",
  skip: "Skipped",
};

const INTENT_COLORS: Record<IntentResult["intent"], string> = {
  execute: "text-emerald-400",
  decide: "text-amber-400",
  "error-recovery": "text-red-400",
  review: "text-blue-400",
  skip: "text-zinc-400",
};

const ACTION_LABELS: Record<IntentResult["intent"], { primary: string; secondary?: string }> = {
  execute: { primary: "Execute", secondary: "Skip" },
  decide: { primary: "Approve", secondary: "Skip" },
  "error-recovery": { primary: "Retry", secondary: "Skip" },
  review: { primary: "Approve", secondary: "Skip" },
  skip: { primary: "Skip" },
};

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color =
    pct >= 80
      ? "bg-emerald-500"
      : pct >= 50
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-zinc-400 tabular-nums">
        {pct}%
      </span>
    </div>
  );
}

export default function IntentBar() {
  const [connected, setConnected] = useState(false);
  const [checking, setChecking] = useState(true);
  const [intent, setIntent] = useState<IntentResult | null>(null);
  const [animating, setAnimating] = useState(false);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [manualIntent, setManualIntent] = useState<IntentResult["intent"] | null>(null);
  const prevIntentRef = useRef<string>("");

  const blocks = useCanvasStore((s) => s.blocks);
  const edges = useCanvasStore((s) => s.edges);
  const isRunning = useWorkflowStore((s) => s.isRunning);
  const currentBlockId = useWorkflowStore((s) => s.currentBlockId);
  const executionLog = useWorkflowStore((s) => s.executionLog);

  const buildState = useCallback((): WorkflowState => {
    return {
      blocks,
      edges: edges.map((e) => ({ source: e.source, target: e.target })),
      memory: [],
      currentBlockId,
      executionLog: executionLog.map((l) => ({
        blockId: l.blockId,
        status: l.status,
        message: l.message,
      })),
    };
  }, [blocks, edges, currentBlockId, executionLog]);

  useEffect(() => {
    let mounted = true;
    checkOllamaStatus().then((status) => {
      if (mounted) {
        setConnected(status.connected);
        setChecking(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (blocks.length > 0) {
        const completed = blocks.every((b) => b.status === "completed");
        const errored = blocks.some((b) => b.status === "error");
        setIntent({
          intent: errored ? "error-recovery" : completed ? "review" : "decide",
          reasoning: errored
            ? "Some blocks failed. Review errors."
            : completed
              ? "All blocks completed successfully."
              : "Workflow idle. Add blocks and run.",
          nextBlockId: null,
          userDecision: null,
          confidence: 1.0,
          suggestedAction: errored
            ? "Fix errors"
            : completed
              ? "Show results"
              : "Start workflow",
        });
      }
      return;
    }

    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      const state = buildState();
      const result = await inferNextIntent(state);
      if (!cancelled) {
        if (result.intent !== prevIntentRef.current) {
          setAnimating(true);
          setTimeout(() => setAnimating(false), 400);
          prevIntentRef.current = result.intent;
        }
        setIntent(manualIntent ? { ...result, intent: manualIntent } : result);
      }
    };

    poll();
    const interval = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isRunning, buildState, manualIntent, blocks.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAction = useCallback(
    (action: "execute" | "approve" | "skip" | "retry") => {
      if (!intent) return;
      if (action === "retry") {
        window.location.reload();
      }
    },
    [intent]
  );

  const handleOverride = useCallback(
    (intentType: IntentResult["intent"]) => {
      setManualIntent(intentType);
      setOverrideOpen(false);
    },
    []
  );

  const currentBlock = blocks.find((b) => b.id === intent?.nextBlockId);

  return (
    <div className="sticky top-0 z-40 w-full">
      <Card className="rounded-none border-x-0 border-t-0 bg-zinc-950/80 backdrop-blur-xl border-zinc-800/60 shadow-lg shadow-black/20">
        <CardContent className="p-0">
          <div className="flex items-center gap-3 px-4 py-2.5">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <Brain
                  className={`w-4 h-4 transition-colors duration-300 ${
                    connected ? "text-emerald-400" : "text-zinc-500"
                  }`}
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-zinc-950 transition-colors duration-500 ${
                    checking
                      ? "bg-amber-500 animate-pulse"
                      : connected
                        ? "bg-emerald-500"
                        : "bg-orange-500"
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 min-w-0">
                {checking ? (
                  <Badge variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-400 border-0">
                    Checking...
                  </Badge>
                ) : connected ? (
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1"
                  >
                    <Wifi className="w-2.5 h-2.5" />
                    Ollama Connected
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-orange-500/10 text-orange-400 border-orange-500/20 gap-1"
                  >
                    <WifiOff className="w-2.5 h-2.5" />
                    Offline Mode
                  </Badge>
                )}
              </div>

              <div className="w-px h-5 bg-zinc-800 mx-1" />

              {intent && (
                <div
                  className={`flex items-center gap-2 transition-all duration-400 ${
                    animating ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
                  }`}
                >
                  <span
                    className={`text-xs font-medium transition-colors duration-300 ${
                      INTENT_COLORS[intent.intent]
                    }`}
                  >
                    {INTENT_LABELS[intent.intent]}
                  </span>

                  {currentBlock && (
                    <span className="text-[10px] text-zinc-500 truncate max-w-[140px]">
                      {currentBlock.label}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {intent && (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500">Confidence</span>
                  <ConfidenceBar value={intent.confidence} />
                </div>
              )}

              {intent && (
                <div className="hidden md:block text-[10px] text-zinc-500 max-w-[240px] truncate">
                  <span className="text-zinc-400">AI suggests:</span>{" "}
                  {intent.reasoning}
                </div>
              )}

              <div className="relative">
                {intent && ACTION_LABELS[intent.intent] && (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-7 text-xs gap-1 px-2.5 ${
                        intent.intent === "error-recovery"
                          ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          : intent.intent === "review" || intent.intent === "decide"
                            ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                            : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                      }`}
                      onClick={() => {
                        const action =
                          intent.intent === "error-recovery"
                            ? "retry"
                            : intent.intent === "review" || intent.intent === "decide"
                              ? "approve"
                              : "execute";
                        handleAction(action);
                      }}
                    >
                      {intent.intent === "error-recovery" ? (
                        <RotateCcw className="w-3 h-3" />
                      ) : intent.intent === "review" || intent.intent === "decide" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Zap className="w-3 h-3" />
                      )}
                      {ACTION_LABELS[intent.intent].primary}
                      <ChevronRight className="w-3 h-3" />
                    </Button>

                    {ACTION_LABELS[intent.intent].secondary && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-zinc-500 hover:text-zinc-300 px-2"
                        onClick={() => handleAction("skip")}
                      >
                        {ACTION_LABELS[intent.intent].secondary}
                      </Button>
                    )}
                  </div>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-[10px] text-zinc-600 hover:text-zinc-300 px-1.5 ml-1"
                  onClick={() => setOverrideOpen(!overrideOpen)}
                >
                  Override
                </Button>

                {overrideOpen && (
                  <div className="absolute right-0 top-full mt-1 z-50">
                    <Card className="bg-zinc-900 border-zinc-700 shadow-xl min-w-[160px]">
                      <CardContent className="p-1.5">
                        <div className="text-[10px] text-zinc-500 px-2 py-1 font-medium">
                          Set intent manually
                        </div>
                        {(
                          [
                            "execute",
                            "decide",
                            "error-recovery",
                            "review",
                            "skip",
                          ] as const
                        ).map((type) => (
                          <button
                            key={type}
                            className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${
                              manualIntent === type
                                ? "bg-zinc-800 text-white"
                                : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                            }`}
                            onClick={() => handleOverride(type)}
                          >
                            {INTENT_LABELS[type]}
                          </button>
                        ))}
                        {manualIntent && (
                          <button
                            className="w-full text-left text-xs px-2 py-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 mt-0.5 border-t border-zinc-800 pt-2"
                            onClick={() => {
                              setManualIntent(null);
                              setOverrideOpen(false);
                            }}
                          >
                            Reset to auto
                          </button>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>

          {intent && (intent.intent === "decide" || intent.intent === "review") && (
            <div className="px-4 pb-2.5 pt-0">
              <div className="bg-zinc-900/60 rounded-lg px-3 py-2 border border-zinc-800/40">
                <div className="flex items-start gap-2">
                  {intent.intent === "decide" ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      <span className="font-medium">
                        {intent.userDecision || intent.suggestedAction}
                      </span>
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">
                      AI suggests: {intent.reasoning}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
