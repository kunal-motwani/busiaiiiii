"use client";

import React, { useState } from "react";
import {
  Terminal,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Database,
} from "lucide-react";
import { DatasetInfo, SQLQueryResult, runSQLQuery } from "@/lib/api";

interface SQLWorkbenchProps {
  dataset: DatasetInfo;
}

export const SQLWorkbench: React.FC<SQLWorkbenchProps> = ({ dataset }) => {
  const defaultQuery = `SELECT * FROM "${dataset.table_name}" LIMIT 20`;
  const [query, setQuery] = useState(defaultQuery);
  const [result, setResult] = useState<SQLQueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    if (!query.trim()) return;
    setIsExecuting(true);
    try {
      const data = await runSQLQuery(dataset.id, query);
      setResult(data);
    } catch (err: any) {
      setResult({
        success: false,
        columns: [],
        rows: [],
        row_count: 0,
        execution_time_ms: 0,
        error: err.message || "Failed to execute query",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Terminal className="h-5 w-5 text-cyan-400" />
            <span>DuckDB Analytical SQL Workbench</span>
          </h2>
          <p className="text-xs text-slate-400">
            Execute safe, read-only analytical queries against registered in-memory tables.
          </p>
        </div>
        <span className="text-[11px] font-mono text-cyan-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
          Table: &quot;{dataset.table_name}&quot;
        </span>
      </div>

      {/* Editor Box */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            SQL Query Editor
          </span>
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold rounded-lg transition shadow-md shadow-indigo-500/20 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isExecuting ? (
              <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            <span>Execute Query</span>
          </button>
        </div>

        <textarea
          rows={4}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-y"
          placeholder="SELECT ... FROM ...;"
        />
      </div>

      {/* Query Results View */}
      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              {result.success ? (
                <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Success: {result.row_count} rows returned</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1.5 text-rose-400 font-semibold">
                  <AlertCircle className="h-4 w-4" />
                  <span>Query Execution Failed</span>
                </span>
              )}
            </div>
            {result.success && (
              <span className="flex items-center space-x-1 text-slate-400 font-mono text-[11px]">
                <Clock className="h-3 w-3" />
                <span>{result.execution_time_ms}ms</span>
              </span>
            )}
          </div>

          {result.error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
              {result.error}
            </div>
          )}

          {result.success && result.rows.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80">
                    {result.columns.map((c) => (
                      <th key={c} className="py-2.5 px-3 text-slate-300 font-semibold uppercase text-[10px]">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {result.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 text-slate-300">
                      {result.columns.map((col, cIdx) => (
                        <td key={cIdx} className="py-2 px-3 whitespace-nowrap">
                          {typeof row[col] === "number" ? row[col].toLocaleString() : String(row[col] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
