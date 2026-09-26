"use client";

import React, { useState } from "react";
import {
  Search,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Brain,
  Layers,
  FileCheck,
} from "lucide-react";
import { EvidenceItem, Hypothesis, InvestigationResult, runInvestigation } from "@/lib/api";

interface AIInvestigationConsoleProps {
  datasetId: string;
  onOpenEvidence: (ev: EvidenceItem) => void;
  onNavigateToSimulator: () => void;
  onNavigateToGraph: () => void;
  prefillQuestion?: string;
}

export const AIInvestigationConsole: React.FC<AIInvestigationConsoleProps> = ({
  datasetId,
  onOpenEvidence,
  onNavigateToSimulator,
  onNavigateToGraph,
  prefillQuestion = "",
}) => {
  const [question, setQuestion] = useState(prefillQuestion);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<InvestigationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleQuestions = [
    "Why did MRR drop in August 2025?",
    "Which product category generates the highest profit?",
    "What drove churn rate variance across segments?",
    "Why did sales fall in the South region?",
  ];

  const handleInvestigate = async (qText?: string) => {
    const query = qText || question;
    if (!query.trim() || !datasetId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await runInvestigation(datasetId, query);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to execute investigation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Console Header */}
      <div className="glass-panel-glow p-6 rounded-2xl">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Ask Any <span className="gradient-text">Business Question</span>
            </h1>
            <p className="text-xs text-slate-400">
              BusiAI investigates hypotheses, calculates exact SQL proofs, and attaches verified evidence.
            </p>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleInvestigate();
            }}
            className="relative flex items-center"
          >
            <div className="absolute left-4 text-slate-400">
              <Search className="h-5 w-5 text-indigo-400" />
            </div>
            <input
              id="investigation-input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Why did revenue drop in August? Or what drove churn up?"
              disabled={isLoading}
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 rounded-xl py-3.5 pl-12 pr-28 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-inner"
            />
            <button
              id="submit-investigation-btn"
              type="submit"
              disabled={isLoading || !question.trim()}
              className="absolute right-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition shadow-md shadow-indigo-500/20 cursor-pointer flex items-center space-x-1.5"
            >
              {isLoading ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Proving...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Investigate</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Starter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400 font-medium">Try asking:</span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuestion(q);
                  handleInvestigate(q);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-[11px] text-slate-300 hover:text-cyan-300 transition cursor-pointer"
              >
                &ldquo;{q}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State Skeleton */}
      {isLoading && (
        <div className="glass-panel p-8 rounded-2xl space-y-4 animate-pulse">
          <div className="flex items-center space-x-3 text-cyan-400 text-xs font-semibold">
            <Brain className="h-5 w-5 animate-spin" />
            <span>Formulating hypotheses and executing deterministic DuckDB calculations...</span>
          </div>
          <div className="h-6 bg-slate-800 rounded w-1/2"></div>
          <div className="h-20 bg-slate-900 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="h-24 bg-slate-900 rounded"></div>
            <div className="h-24 bg-slate-900 rounded"></div>
          </div>
        </div>
      )}

      {/* Investigation Results */}
      {result && !isLoading && (
        <div className="space-y-6 animate-fade-in">
          {/* Executive Summary Card */}
          <div className="glass-panel p-6 rounded-2xl border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Target: {result.target_metric}
                </span>
                <span className="text-xs text-slate-400 font-medium">Investigation Summary</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onNavigateToGraph}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-300 hover:text-white transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Layers className="h-3.5 w-3.5 text-cyan-400" />
                  <span>View Decision Graph</span>
                </button>
                <button
                  onClick={onNavigateToSimulator}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 text-xs font-semibold text-indigo-300 hover:text-white transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Simulate Action</span>
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {result.executive_summary}
            </p>

            {/* Key findings bullets */}
            {result.key_findings.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Verified Data Findings:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.key_findings.map((f, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Hypotheses Tested Scorecard */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <FileCheck className="h-4 w-4 text-indigo-400" />
                <span>Hypotheses Tested Deterministically ({result.hypotheses_tested.length})</span>
              </h3>
              <span className="text-[11px] text-slate-400">Click &quot;View Evidence&quot; to inspect exact SQL & proofs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {result.hypotheses_tested.map((hyp) => {
                const isConfirmed = hyp.status === "confirmed";
                const isRefuted = hyp.status === "refuted";
                const evItem = result.evidence_package.find((e) => e.hypothesis_id === hyp.id);

                return (
                  <div
                    key={hyp.id}
                    className={`glass-panel p-4 rounded-xl border flex flex-col justify-between ${
                      isConfirmed
                        ? "border-emerald-500/30 bg-emerald-950/10"
                        : isRefuted
                        ? "border-slate-800 bg-slate-950/30"
                        : "border-slate-800"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            isConfirmed
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : isRefuted
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}
                        >
                          {isConfirmed ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : isRefuted ? (
                            <XCircle className="h-3 w-3" />
                          ) : (
                            <HelpCircle className="h-3 w-3" />
                          )}
                          <span>{hyp.status}</span>
                        </span>

                        <span className="text-[11px] font-semibold text-slate-400">
                          {hyp.confidence_score}% Confidence
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-100 mb-1">{hyp.statement}</h4>
                      {hyp.explanation && (
                        <p className="text-[11px] text-slate-300/90 leading-relaxed mb-3">
                          {hyp.explanation}
                        </p>
                      )}
                    </div>

                    {evItem && (
                      <button
                        onClick={() => onOpenEvidence(evItem)}
                        className="mt-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-[11px] font-semibold text-cyan-300 hover:text-white transition cursor-pointer"
                      >
                        <span className="flex items-center space-x-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                          <span>View Evidence Proof & SQL</span>
                        </span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Recommended Business Interventions</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {result.recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">{rec.title}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            rec.priority === "high"
                              ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                              : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                          }`}
                        >
                          {rec.priority} priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-300/90 leading-relaxed mb-3">{rec.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Projected Impact:</span>
                      <span className="font-bold text-emerald-400">{rec.projected_impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
