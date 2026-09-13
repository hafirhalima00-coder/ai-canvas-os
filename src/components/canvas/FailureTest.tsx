"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  RotateCcw,
  SkipForward,
  Replace,
  XCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
} from "lucide-react";

interface RecoveryOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  confidence: number;
  impact: string;
  backoffInfo?: string;
  color: string;
  hoverColor: string;
}

interface FailureTestProps {
  blockLabel?: string;
  blockType?: string;
  errorMessage?: string;
  errorTimestamp?: number;
  onRecovery?: (optionId: string) => void;
  onDismiss?: () => void;
}

const DEFAULT_RECOVERY_OPTIONS: RecoveryOption[] = [
  {
    id: "retry",
    label: "Retry",
    description: "Re-attempt the failed operation with exponential backoff",
    icon: <RotateCcw className="w-4 h-4" />,
    confidence: 0.82,
    impact: "No downstream impact. Safe to retry.",
    backoffInfo: "1s → 2s → 4s → 8s → 16s (max 5 retries)",
    color: "text-emerald-400",
    hoverColor: "hover:bg-emerald-500/10 hover:text-emerald-300",
  },
  {
    id: "skip",
    label: "Skip",
    description: "Bypass this block and continue with downstream blocks",
    icon: <SkipForward className="w-4 h-4" />,
    confidence: 0.65,
    impact: "2 downstream blocks may receive incomplete data. Results will be partial.",
    color: "text-amber-400",
    hoverColor: "hover:bg-amber-500/10 hover:text-amber-300",
  },
  {
    id: "substitute",
    label: "Substitute",
    description: "Use an alternative block type to achieve a similar outcome",
    icon: <Replace className="w-4 h-4" />,
    confidence: 0.58,
    impact: "AI suggests: Use Research block as fallback. Output format may differ.",
    color: "text-blue-400",
    hoverColor: "hover:bg-blue-500/10 hover:text-blue-300",
  },
  {
    id: "abort",
    label: "Abort",
    description: "Stop execution and clean up all partial results",
    icon: <XCircle className="w-4 h-4" />,
    confidence: 0.95,
    impact: "All partial results will be discarded. Workflow will need a full restart.",
    color: "text-red-400",
    hoverColor: "hover:bg-red-500/10 hover:text-red-300",
  },
];

function ConfidencePill({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const bg =
    pct >= 75
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
      : pct >= 50
        ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
        : "bg-red-500/15 text-red-400 border-red-500/20";

  return (
    <span
      className={`inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded-full border tabular-nums ${bg}`}
    >
      {pct}%
    </span>
  );
}

function RecoveryPathDiagram({
  option,
  isExecuting,
}: {
  option: RecoveryOption;
  isExecuting: boolean;
}) {
  return (
    <div className="flex items-center gap-2 py-2 text-[10px] text-zinc-500">
      <div className="flex items-center gap-1.5 bg-zinc-900 rounded px-2 py-1 border border-zinc-800">
        <AlertTriangle className="w-3 h-3 text-red-400" />
        <span>Failed</span>
      </div>
      <ArrowRight className="w-3 h-3 text-zinc-600" />
      <div
        className={`flex items-center gap-1.5 rounded px-2 py-1 border transition-colors duration-300 ${
          isExecuting
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-zinc-900 border-zinc-800"
        }`}
      >
        {option.icon}
        <span>{option.label}</span>
      </div>
      <ArrowRight className="w-3 h-3 text-zinc-600" />
      <div className="flex items-center gap-1.5 bg-zinc-900 rounded px-2 py-1 border border-zinc-800">
        <Shield className="w-3 h-3 text-blue-400" />
        <span>
          {option.id === "retry"
            ? "Recovered"
            : option.id === "skip"
              ? "Partial result"
              : option.id === "substitute"
                ? "Alternative output"
                : "Clean state"}
        </span>
      </div>
    </div>
  );
}

export default function FailureTest({
  blockLabel = "Research Block",
  blockType = "research",
  errorMessage = "ECONNREFUSED: Cannot connect to external API at port 443. Request timed out after 30s.",
  errorTimestamp,
  onRecovery,
  onDismiss,
}: FailureTestProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("options");

  const timestamp = useMemo(
    () =>
      errorTimestamp
        ? new Date(errorTimestamp).toLocaleTimeString()
        : new Date().toLocaleTimeString(),
    [errorTimestamp]
  );

  const handleExecuteRecovery = useCallback(() => {
    if (!selectedOption) return;
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setExecuted(true);
      onRecovery?.(selectedOption);
    }, 1500);
  }, [selectedOption, onRecovery]);

  const handleDismiss = useCallback(() => {
    setSelectedOption(null);
    setExecuted(false);
    setIsExecuting(false);
    onDismiss?.();
  }, [onDismiss]);

  return (
    <Card className="bg-zinc-950/90 backdrop-blur-xl border-zinc-800/60 shadow-2xl shadow-black/40 overflow-hidden">
      <CardContent className="p-0">
        <div className="px-4 pt-4 pb-3 border-b border-zinc-800/60">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-zinc-100">
                    Block Failed
                  </h3>
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-red-500/10 text-red-400 border-red-500/20"
                  >
                    {blockType}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 truncate">
                  {blockLabel}
                </p>
              </div>
            </div>
            <span className="text-[10px] text-zinc-600 flex-shrink-0 tabular-nums">
              {timestamp}
            </span>
          </div>

          <div className="mt-3 bg-zinc-900/60 rounded-lg px-3 py-2 border border-zinc-800/40">
            <p className="text-xs text-red-300/80 font-mono leading-relaxed break-all">
              {errorMessage}
            </p>
          </div>
        </div>

        <div className="px-4 pt-3 pb-1">
          <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mb-2">
            This failure test shows: when the interface guesses wrong, here&apos;s
            how it recovers
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="px-4"
        >
          <TabsList className="bg-zinc-900/60 border border-zinc-800/40 h-8">
            <TabsTrigger
              value="options"
              className="text-[10px] px-3 py-1 data-[state=active]:bg-zinc-800"
            >
              Recovery Options
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              className="text-[10px] px-3 py-1 data-[state=active]:bg-zinc-800"
            >
              What Went Wrong
            </TabsTrigger>
          </TabsList>

          <TabsContent value="options" className="mt-3 space-y-2 pb-3">
            {DEFAULT_RECOVERY_OPTIONS.map((option) => (
              <button
                key={option.id}
                className={`w-full text-left rounded-lg border p-3 transition-all duration-200 ${
                  selectedOption === option.id
                    ? "bg-zinc-800/80 border-zinc-700 shadow-lg"
                    : "bg-zinc-900/40 border-zinc-800/40 hover:bg-zinc-900/70 hover:border-zinc-700/50"
                }`}
                onClick={() => setSelectedOption(option.id)}
                disabled={isExecuting || executed}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`flex-shrink-0 mt-0.5 ${option.color}`}
                    >
                      {option.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-medium ${option.color}`}
                        >
                          {option.label}
                        </span>
                        <ConfidencePill value={option.confidence} />
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedOption === option.id && (
                  <div className="mt-2.5 pt-2.5 border-t border-zinc-800/60 space-y-2">
                    <RecoveryPathDiagram
                      option={option}
                      isExecuting={isExecuting}
                    />

                    <div className="bg-zinc-900/60 rounded px-2.5 py-1.5 border border-zinc-800/30">
                      <span className="text-[10px] text-zinc-500 font-medium">
                        Impact:{" "}
                      </span>
                      <span className="text-[10px] text-zinc-400 leading-relaxed">
                        {option.impact}
                      </span>
                    </div>

                    {option.backoffInfo && (
                      <div className="bg-zinc-900/60 rounded px-2.5 py-1.5 border border-zinc-800/30">
                        <span className="text-[10px] text-zinc-500 font-medium">
                          Backoff:{" "}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {option.backoffInfo}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </button>
            ))}
          </TabsContent>

          <TabsContent value="analysis" className="mt-3 pb-3">
            <div className="space-y-3">
              <div className="bg-zinc-900/40 rounded-lg border border-zinc-800/40 p-3">
                <h4 className="text-xs font-medium text-zinc-300 mb-2">
                  Error Analysis
                </h4>
                <div className="space-y-2 text-[11px] text-zinc-500 leading-relaxed">
                  <p>
                    <span className="text-zinc-400 font-medium">Root cause:</span>{" "}
                    Network connectivity issue. The external API endpoint is
                    unreachable, likely due to a firewall rule, DNS resolution
                    failure, or the service being temporarily down.
                  </p>
                  <p>
                    <span className="text-zinc-400 font-medium">Block type:</span>{" "}
                    The {blockType} block requires network access to fetch
                    external data. Without connectivity, it cannot fulfill its
                    primary function.
                  </p>
                  <p>
                    <span className="text-zinc-400 font-medium">Frequency:</span>{" "}
                    This type of failure occurs in approximately 12% of workflow
                    executions and is typically transient.
                  </p>
                </div>
              </div>

              <button
                className="w-full text-left bg-zinc-900/40 rounded-lg border border-zinc-800/40 p-3 transition-colors hover:bg-zinc-900/60"
                onClick={() => setAnalysisOpen(!analysisOpen)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-300">
                    Detailed Breakdown
                  </span>
                  {analysisOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                  )}
                </div>
              </button>

              {analysisOpen && (
                <div className="bg-zinc-900/40 rounded-lg border border-zinc-800/40 p-3 text-[11px] text-zinc-500 leading-relaxed space-y-2">
                  <p>
                    <span className="text-zinc-400 font-medium">
                      Downstream dependencies:
                    </span>{" "}
                    2 blocks depend on this block&apos;s output. Skipping will
                    propagate null values. Substituting preserves the data flow.
                  </p>
                  <p>
                    <span className="text-zinc-400 font-medium">
                      Partial results:
                    </span>{" "}
                    No partial results were cached before the failure. A retry
                    will restart from scratch.
                  </p>
                  <p>
                    <span className="text-zinc-400 font-medium">
                      Recovery confidence:
                    </span>{" "}
                    Based on historical data, retry has the highest success rate
                    (82%) for transient network errors. Skip is recommended only
                    if the block&apos;s output is non-critical.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="px-4 pb-4 pt-2 border-t border-zinc-800/60">
          {executed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">
                  Recovery executed
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-zinc-500 hover:text-zinc-300"
                onClick={handleDismiss}
              >
                Dismiss
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-zinc-500 hover:text-zinc-300"
                onClick={handleDismiss}
              >
                Dismiss
              </Button>
              <Button
                size="sm"
                className={`h-7 text-xs gap-1.5 ${
                  selectedOption === "abort"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : selectedOption === "skip"
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : selectedOption === "substitute"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
                disabled={!selectedOption || isExecuting}
                onClick={handleExecuteRecovery}
              >
                {isExecuting ? (
                  <>
                    <RotateCcw className="w-3 h-3 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    Execute Recovery
                    <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
