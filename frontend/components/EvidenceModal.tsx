"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  Calculator,
  Database,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { EvidenceItem } from "@/lib/api";

interface EvidenceModalProps {
  evidence: EvidenceItem | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ evidence, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!evidence) return null;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(evidence.sql_query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] glass-panel-glow rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-indigo-500/30">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white">{evidence.title}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {evidence.proof.confidence_pct}% Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{evidence.summary}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Mathematical Proof Box */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 mb-2">
              <Calculator className="h-4 w-4 text-indigo-400" />
              <span>Mathematical Proof & Calculation</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300 font-mono bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-500">Formula: </span>
                <span className="text-cyan-300">{evidence.proof.formula}</span>
              </div>
              <div>
                <span className="text-slate-500">Computed Output: </span>
                <span className="text-emerald-400 font-bold">{String(evidence.proof.calculated_value)}</span>
              </div>
            </div>
          </div>

          {/* Raw SQL Statement */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span>Deterministic DuckDB SQL</span>
              </span>
              <button
                onClick={handleCopySQL}
                className="flex items-center space-x-1 text-[11px] font-semibold text-slate-400 hover:text-white transition cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy Query"}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300/90 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {evidence.sql_query}
            </pre>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
              <span className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Execution Time: {evidence.execution_time_ms}ms</span>
              </span>
              <span>Executed: {new Date(evidence.executed_at).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Sample Raw Result Records */}
          {evidence.data_points && evidence.data_points.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-2 mb-2">
                <Database className="h-4 w-4 text-amber-400" />
                <span>Calculated Source Records ({evidence.data_points.length})</span>
              </span>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80">
                      {Object.keys(evidence.data_points[0]).map((k) => (
                        <th key={k} className="py-2 px-3 text-slate-400 font-semibold uppercase text-[10px]">
                          {k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {evidence.data_points.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40 text-slate-300">
                        {Object.values(row).map((val: any, cIdx) => (
                          <td key={cIdx} className="py-2 px-3">
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
      </div>
    </div>
  );
};
