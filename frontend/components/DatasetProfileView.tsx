"use client";

import React, { useEffect, useState } from "react";
import {
  Database,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Hash,
  Type,
  Key,
  Layers,
  Sparkles,
  Table,
} from "lucide-react";
import { DatasetInfo, DatasetProfile, getDatasetProfile } from "@/lib/api";

interface DatasetProfileViewProps {
  dataset: DatasetInfo;
}

export const DatasetProfileView: React.FC<DatasetProfileViewProps> = ({ dataset }) => {
  const [profile, setProfile] = useState<DatasetProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const data = await getDatasetProfile(dataset.id);
        if (isMounted) setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [dataset.id]);

  if (isLoading) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center animate-pulse">
        <Database className="h-8 w-8 text-indigo-400 mx-auto mb-3 animate-spin" />
        <span className="text-xs font-semibold text-slate-300">Profiling dataset statistics with DuckDB...</span>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Overview Stats Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Rows</span>
          <div className="text-xl font-extrabold text-white mt-1 font-mono">{profile.total_rows.toLocaleString()}</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Columns</span>
          <div className="text-xl font-extrabold text-white mt-1 font-mono">{profile.total_columns}</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border-emerald-500/30 bg-emerald-950/15">
          <span className="text-[10px] font-bold text-emerald-400 uppercase">Data Quality Score</span>
          <div className="text-xl font-extrabold text-emerald-300 mt-1 font-mono">{profile.quality_score}%</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Primary Date Column</span>
          <div className="text-sm font-bold text-cyan-300 mt-1 font-mono truncate">
            {profile.primary_date_column || "None detected"}
          </div>
        </div>
      </div>

      {/* Column Details Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Layers className="h-4 w-4 text-indigo-400" />
          <span>Column Profiles & Type Classification ({profile.columns.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {profile.columns.map((col) => {
            let typeBadge = "bg-indigo-500/15 text-indigo-400 border-indigo-500/30";
            let TypeIcon = Type;

            if (col.inferred_type === "numeric") {
              typeBadge = "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
              TypeIcon = Hash;
            } else if (col.inferred_type === "datetime") {
              typeBadge = "bg-amber-500/15 text-amber-400 border-amber-500/30";
              TypeIcon = Calendar;
            } else if (col.inferred_type === "identifier") {
              typeBadge = "bg-purple-500/15 text-purple-400 border-purple-500/30";
              TypeIcon = Key;
            }

            return (
              <div
                key={col.name}
                className="glass-panel p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white truncate max-w-[150px]">
                      {col.original_name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border flex items-center space-x-1 ${typeBadge}`}>
                      <TypeIcon className="h-3 w-3" />
                      <span>{col.inferred_type}</span>
                    </span>
                  </div>

                  {/* Null Percentage */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 my-1">
                    <span>Nulls:</span>
                    <span className={`font-mono ${col.null_count > 0 ? "text-amber-400 font-bold" : "text-slate-400"}`}>
                      {col.null_count} ({col.null_percentage}%)
                    </span>
                  </div>

                  {/* Numeric Stats */}
                  {col.numeric_stats && (
                    <div className="mt-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1 font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>Range:</span>
                        <span className="text-slate-200">
                          {col.numeric_stats.min?.toLocaleString()} &rarr; {col.numeric_stats.max?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Mean / Median:</span>
                        <span className="text-slate-200">
                          {col.numeric_stats.mean?.toLocaleString()} / {col.numeric_stats.median?.toLocaleString()}
                        </span>
                      </div>
                      {col.numeric_stats.outlier_count > 0 && (
                        <div className="flex justify-between text-amber-400 font-bold">
                          <span>IQR Outliers:</span>
                          <span>{col.numeric_stats.outlier_count}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Categorical Stats */}
                  {col.categorical_stats && (
                    <div className="mt-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1">
                      <div className="flex justify-between text-slate-400 font-mono">
                        <span>Distinct Values:</span>
                        <span className="text-slate-200">{col.categorical_stats.unique_count}</span>
                      </div>
                      {col.categorical_stats.top_values.length > 0 && (
                        <div className="text-[10px] text-slate-400 truncate pt-1">
                          Top: {col.categorical_stats.top_values.map((v) => `${v.value} (${v.count})`).join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 10-Row Data Preview Table */}
      {dataset.preview_rows && dataset.preview_rows.length > 0 && (
        <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Table className="h-4 w-4 text-cyan-400" />
              <span>Dataset Preview (Top 10 Records)</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Table: {dataset.table_name}</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  {Object.keys(dataset.preview_rows[0]).map((k) => (
                    <th key={k} className="py-2.5 px-3 text-slate-300 font-semibold uppercase text-[10px]">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {dataset.preview_rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 text-slate-300">
                    {Object.values(row).map((val: any, cIdx) => (
                      <td key={cIdx} className="py-2 px-3 whitespace-nowrap">
                        {typeof val === "number" ? val.toLocaleString() : String(val ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
