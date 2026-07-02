"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAnalytics, clearAnalytics } from "@/lib/services/analytics";
import { formatDuration, formatCurrency, formatDate } from "@/lib/utils";
import { useAnalyticsStore } from "@/lib/stores/workflow-store";
import type { WorkflowAnalytics } from "@/lib/types";

function CircularProgress({ value, size = 64 }: { value: number; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-zinc-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-green-500 transition-all duration-700"
        />
      </svg>
      <span className="absolute text-sm font-bold text-zinc-200">
        {Math.round(value)}%
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<WorkflowAnalytics | null>(null);

  useEffect(() => {
    const data = getAnalytics();
    setAnalytics(data);
    data.runHistory.forEach((run) => {
      useAnalyticsStore.getState().recordRun(run);
    });
  }, []);

  if (!analytics) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-sm text-zinc-500">Loading analytics...</p>
      </div>
    );
  }

  const totalRuns = analytics.totalRuns || 0;
  const successRate = totalRuns > 0 ? (analytics.successCount / totalRuns) * 100 : 0;
  const avgDuration = totalRuns > 0 ? analytics.totalExecutionTime / totalRuns : 0;

  const statsCards = [
    {
      title: "Total Runs",
      value: totalRuns.toString(),
      icon: Activity,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Success Rate",
      value: (
        <CircularProgress value={successRate} size={48} />
      ),
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Avg Duration",
      value: formatDuration(avgDuration),
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Total Cost",
      value: formatCurrency(analytics.estimatedCost),
      icon: DollarSign,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Analytics and history for your AI workflows
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            clearAnalytics();
            setAnalytics(getAnalytics());
          }}
          className="gap-2 border-zinc-700 text-zinc-400 hover:text-zinc-200"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear Data
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zinc-100">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-zinc-900/60 border border-zinc-800/50">
          <TabsTrigger value="overview" className="text-xs">
            Overview
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            Run History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-zinc-200">
                Recent Runs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.runHistory.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">
                  No runs yet. Start a workflow to see results here.
                </p>
              ) : (
                <div className="space-y-2">
                  {analytics.runHistory.slice(0, 5).map((run) => (
                    <div
                      key={run.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-800/30 bg-zinc-900/30 px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`rounded-full p-1 ${
                            run.status === "completed"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {run.status === "completed" ? (
                            <CheckCircle className="h-3.5 w-3.5" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-200">
                            {run.workflowName}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {formatDate(run.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs text-zinc-400">
                          {formatDuration(run.duration)}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {formatCurrency(run.cost)}
                        </span>
                        <Badge
                          variant={
                            run.status === "completed" ? "default" : "destructive"
                          }
                          className="text-[10px]"
                        >
                          {run.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-zinc-200">
                Workflow Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.runHistory.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">
                  No workflow history yet.
                </p>
              ) : (
                <div className="relative space-y-0">
                  {analytics.runHistory.slice(0, 10).map((run, i) => (
                    <div key={run.id} className="relative flex gap-4 pb-6 last:pb-0">
                      {i < Math.min(analytics.runHistory.length, 10) - 1 && (
                        <div className="absolute left-[7px] top-3 h-full w-px bg-zinc-800" />
                      )}
                      <div
                        className={`relative mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                          run.status === "completed"
                            ? "border-green-500 bg-green-500/20"
                            : "border-red-500 bg-red-500/20"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <p className="truncate text-sm font-medium text-zinc-200">
                            {run.workflowName}
                          </p>
                          <span className="shrink-0 text-[11px] text-zinc-500">
                            {formatDate(run.timestamp)}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-zinc-500">
                          <span>{formatDuration(run.duration)}</span>
                          <span>{formatCurrency(run.cost)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-zinc-200">
                Full Run History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.runHistory.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">
                  No run history yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800/50 text-left">
                        <th className="pb-3 pr-4 text-xs font-medium text-zinc-500">
                          Workflow
                        </th>
                        <th className="pb-3 pr-4 text-xs font-medium text-zinc-500">
                          Status
                        </th>
                        <th className="pb-3 pr-4 text-xs font-medium text-zinc-500">
                          Duration
                        </th>
                        <th className="pb-3 pr-4 text-xs font-medium text-zinc-500">
                          Cost
                        </th>
                        <th className="pb-3 text-xs font-medium text-zinc-500">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.runHistory.map((run) => (
                        <tr
                          key={run.id}
                          className="border-b border-zinc-800/30 last:border-0"
                        >
                          <td className="py-3 pr-4 text-zinc-200">
                            {run.workflowName}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge
                              variant={
                                run.status === "completed"
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-[10px]"
                            >
                              {run.status}
                            </Badge>
                          </td>
                          <td className="py-3 pr-4 text-zinc-400">
                            {formatDuration(run.duration)}
                          </td>
                          <td className="py-3 pr-4 text-zinc-400">
                            {formatCurrency(run.cost)}
                          </td>
                          <td className="py-3 text-zinc-400">
                            {formatDate(run.timestamp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
