"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useAppStore } from "@/store/app-store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabPanels } from "@/components/ui/tabs";
import { formatDateTime, formatDuration, formatNumber } from "@/lib/utils";
import { WorkflowRun } from "@/types";
import {
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Coins,
  Activity,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

export default function MonitoringPage() {
  const { runs, monitoringStats } = useAppStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedRun, setExpandedRun] = useState<string | null>(null);

  if (!monitoringStats) return null;

  const successRate = ((monitoringStats.success_count / monitoringStats.total_runs) * 100).toFixed(1);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Monitoring</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            Track workflow runs, performance, and token usage
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-surface-900">{successRate}%</p>
              <p className="text-xs text-surface-500">Success Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <Activity className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-surface-900">{formatNumber(monitoringStats.total_runs)}</p>
              <p className="text-xs text-surface-500">Total Runs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <Clock className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-surface-900">{formatDuration(monitoringStats.avg_latency_ms)}</p>
              <p className="text-xs text-surface-500">Avg Latency</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <Coins className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-surface-900">{formatNumber(monitoringStats.total_tokens)}</p>
              <p className="text-xs text-surface-500">Total Tokens</p>
            </CardContent>
          </Card>
        </div>

        <Tabs
          tabs={[
            { id: "overview", label: "Overview", icon: <BarChart3 className="w-3.5 h-3.5" /> },
            { id: "runs", label: "Run History", icon: <Activity className="w-3.5 h-3.5" /> },
            { id: "errors", label: "Errors", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <TabPanels activeTab={activeTab}>
          {{
            overview: (
              <div className="space-y-6">
                {/* Runs chart */}
                <Card>
                  <div className="px-6 py-4 border-b border-surface-100">
                    <h3 className="text-sm font-semibold text-surface-900">Runs per Day</h3>
                  </div>
                  <CardContent>
                    <div className="h-48 flex items-end gap-2">
                      {monitoringStats.runs_by_day.map((day) => {
                        const maxCount = Math.max(...monitoringStats.runs_by_day.map((d) => d.count));
                        const height = (day.count / maxCount) * 100;
                        const successPct = (day.success / day.count) * 100;
                        return (
                          <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className="w-full rounded-t-md relative overflow-hidden"
                              style={{ height: `${height}%` }}
                            >
                              <div
                                className="absolute bottom-0 w-full bg-green-400 rounded-t-md"
                                style={{ height: `${successPct}%` }}
                              />
                              <div
                                className="absolute top-0 w-full bg-red-400"
                                style={{ height: `${100 - successPct}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-surface-500">
                              {day.date.split("-").slice(1).join("/")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-4 mt-3 justify-center">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-green-400 rounded-sm" />
                        <span className="text-xs text-surface-500">Success</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-red-400 rounded-sm" />
                        <span className="text-xs text-surface-500">Failure</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Latency chart */}
                <Card>
                  <div className="px-6 py-4 border-b border-surface-100">
                    <h3 className="text-sm font-semibold text-surface-900">Average Latency</h3>
                  </div>
                  <CardContent>
                    <div className="h-32 flex items-end gap-2">
                      {monitoringStats.latency_by_day.map((day) => {
                        const maxLatency = Math.max(...monitoringStats.latency_by_day.map((d) => d.avg_ms));
                        const height = (day.avg_ms / maxLatency) * 100;
                        return (
                          <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] text-surface-500">{formatDuration(day.avg_ms)}</span>
                            <div
                              className="w-full bg-blue-400 rounded-t-md"
                              style={{ height: `${height}%` }}
                            />
                            <span className="text-[10px] text-surface-500">
                              {day.date.split("-").slice(1).join("/")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Token usage chart */}
                <Card>
                  <div className="px-6 py-4 border-b border-surface-100">
                    <h3 className="text-sm font-semibold text-surface-900">Token Usage</h3>
                  </div>
                  <CardContent>
                    <div className="h-32 flex items-end gap-2">
                      {monitoringStats.tokens_by_day.map((day) => {
                        const maxTokens = Math.max(...monitoringStats.tokens_by_day.map((d) => d.tokens));
                        const height = (day.tokens / maxTokens) * 100;
                        return (
                          <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] text-surface-500">{formatNumber(day.tokens)}</span>
                            <div
                              className="w-full bg-purple-400 rounded-t-md"
                              style={{ height: `${height}%` }}
                            />
                            <span className="text-[10px] text-surface-500">
                              {day.date.split("-").slice(1).join("/")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
            runs: (
              <div className="space-y-2">
                {runs.map((run) => (
                  <RunCard
                    key={run.id}
                    run={run}
                    isExpanded={expandedRun === run.id}
                    onToggle={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                  />
                ))}
              </div>
            ),
            errors: (
              <Card>
                <div className="px-6 py-4 border-b border-surface-100">
                  <h3 className="text-sm font-semibold text-surface-900">Top Errors (Last 7 Days)</h3>
                </div>
                <div className="divide-y divide-surface-100">
                  {monitoringStats.top_errors.map((error, idx) => (
                    <div key={idx} className="px-6 py-3 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-surface-900 truncate">{error.message}</p>
                      </div>
                      <Badge variant="danger">{error.count} occurrences</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            ),
          }}
        </TabPanels>
      </div>
    </AppLayout>
  );
}

function RunCard({
  run,
  isExpanded,
  onToggle,
}: {
  run: WorkflowRun;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Card>
      <div
        className="px-5 py-3.5 flex items-center gap-4 cursor-pointer hover:bg-surface-50 transition-colors"
        onClick={onToggle}
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-surface-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-surface-400 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-surface-900">{run.workflow_name}</p>
            <Badge
              variant={
                run.status === "success"
                  ? "success"
                  : run.status === "failed"
                  ? "danger"
                  : run.status === "running"
                  ? "info"
                  : "default"
              }
            >
              {run.status}
            </Badge>
          </div>
          <p className="text-xs text-surface-500">{formatDateTime(run.started_at)}</p>
        </div>
        <div className="flex items-center gap-6 text-xs text-surface-500 flex-shrink-0">
          {run.duration_ms && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(run.duration_ms)}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Coins className="w-3.5 h-3.5" />
            {formatNumber(run.token_usage.total_tokens)} tokens
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="border-t border-surface-100 px-5 py-4 space-y-3 animate-fade-in">
          {run.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm font-medium text-red-700">Error</p>
              <p className="text-xs text-red-600 mt-1">{run.error}</p>
            </div>
          )}
          {run.block_runs.length > 0 && (
            <div>
              <p className="text-xs font-medium text-surface-600 mb-2">Block Execution</p>
              <div className="space-y-1">
                {run.block_runs.map((br) => (
                  <div key={br.id} className="flex items-center gap-3 p-2 bg-surface-50 rounded-lg">
                    {br.status === "success" ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : br.status === "failed" ? (
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-surface-900">{br.block_label}</span>
                        <Badge size="sm">{br.block_type.replace("_", " ")}</Badge>
                      </div>
                      {br.error && <p className="text-xs text-red-600 mt-0.5">{br.error}</p>}
                    </div>
                    <div className="text-xs text-surface-500 flex-shrink-0 flex items-center gap-3">
                      {br.retry_count > 0 && (
                        <span className="text-amber-600">{br.retry_count} retries</span>
                      )}
                      {br.duration_ms && <span>{formatDuration(br.duration_ms)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-xs font-medium text-surface-600 mb-1">Input</p>
              <pre className="text-xs text-surface-500 bg-surface-50 p-2 rounded-lg overflow-x-auto font-mono max-h-32">
                {JSON.stringify(run.input, null, 2)}
              </pre>
            </div>
            <div>
              <p className="text-xs font-medium text-surface-600 mb-1">Output</p>
              <pre className="text-xs text-surface-500 bg-surface-50 p-2 rounded-lg overflow-x-auto font-mono max-h-32">
                {run.output ? JSON.stringify(run.output, null, 2) : "null"}
              </pre>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
