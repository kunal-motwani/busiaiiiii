"use client";

import React, { useEffect, useState } from "react";
import {
  Network,
  Search,
  CheckCircle2,
  FileText,
  Sliders,
  Sparkles,
  ArrowDown,
  Layers,
  HelpCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { DecisionGraphResponse, buildDecisionGraph } from "@/lib/api";

interface DecisionGraphViewProps {
  datasetId: string;
  defaultQuestion?: string;
  onSelectSimulation: () => void;
}

export const DecisionGraphView: React.FC<DecisionGraphViewProps> = ({
  datasetId,
  defaultQuestion = "Why did revenue fall in August 2025?",
  onSelectSimulation,
}) => {
  const [question, setQuestion] = useState(defaultQuestion);
  const [graphData, setGraphData] = useState<DecisionGraphResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  const loadGraph = async (qText?: string) => {
    if (!datasetId) return;
    setIsLoading(true);
    try {
      const data = await buildDecisionGraph(datasetId, qText || question);
      setGraphData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGraph();
  }, [datasetId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Network className="h-5 w-5 text-cyan-400" />
            <span>Interactive Decision Graph</span>
          </h2>
          <p className="text-xs text-slate-400">
            Visual reasoning chain from business question to proven data points and recommendations.
          </p>
        </div>

        <button
          onClick={() => loadGraph()}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-xs font-semibold text-cyan-300 hover:text-white transition flex items-center space-x-1.5 cursor-pointer self-start"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Regenerate Graph</span>
        </button>
      </div>

      {isLoading && (
        <div className="glass-panel p-12 rounded-2xl text-center animate-pulse">
          <Layers className="h-8 w-8 text-cyan-400 mx-auto mb-3 animate-spin" />
          <span className="text-xs font-semibold text-slate-300">Constructing reasoning graph nodes...</span>
        </div>
      )}

      {graphData && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Node Map */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border-slate-800 space-y-6 relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            {/* Render Layers */}
            {/* 1. Root Question Node */}
            <div className="flex justify-center relative z-10">
              {graphData.nodes
                .filter((n) => n.type === "question")
                .map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/40 shadow-lg shadow-indigo-500/10 cursor-pointer hover:scale-102 transition max-w-md text-center"
                  >
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-cyan-300 border border-indigo-500/30">
                      {node.data.badge}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-2">&ldquo;{node.data.label}&rdquo;</h3>
                  </div>
                ))}
            </div>

            <div className="flex justify-center my-1">
              <ArrowDown className="h-4 w-4 text-slate-600" />
            </div>

            {/* 2. Hypotheses Layer */}
            <div className="space-y-2 relative z-10">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                Hypotheses Formulated
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {graphData.nodes
                  .filter((n) => n.type === "hypothesis")
                  .map((node) => {
                    const isConfirmed = node.data.status === "confirmed";
                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className={`p-3.5 rounded-xl border transition cursor-pointer hover:scale-102 ${
                          isConfirmed
                            ? "bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400"
                            : "bg-slate-900/80 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              isConfirmed
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {node.data.status}
                          </span>
                          <span className="text-[10px] text-slate-400">{node.data.confidence}% Conf</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-200">{node.data.label}</p>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="flex justify-center my-1">
              <ArrowDown className="h-4 w-4 text-slate-600" />
            </div>

            {/* 3. Evidence Layer */}
            <div className="space-y-2 relative z-10">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                Verified DuckDB Evidence Proofs
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {graphData.nodes
                  .filter((n) => n.type === "evidence")
                  .map((node) => (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 hover:border-cyan-400 transition cursor-pointer hover:scale-102"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center space-x-1">
                          <ShieldCheck className="h-3 w-3" />
                          <span>Calculated Proof</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 font-mono">
                          {String(node.data.proof_value)}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-200">{node.data.summary}</p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-center my-1">
              <ArrowDown className="h-4 w-4 text-slate-600" />
            </div>

            {/* 4. Action Recommendation Nodes */}
            <div className="space-y-2 relative z-10">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                Action Recommendations
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {graphData.nodes
                  .filter((n) => n.type === "action")
                  .map((node) => (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/40 hover:border-indigo-400 transition cursor-pointer hover:scale-102"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {node.data.badge}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400">{node.data.impact}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white mb-1">{node.data.label}</h4>
                      <p className="text-[11px] text-slate-300/80">{node.data.description}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* 5. What-If Simulation Trigger */}
            <div className="flex justify-center pt-2 relative z-10">
              <button
                onClick={onSelectSimulation}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition flex items-center space-x-2 cursor-pointer hover:scale-102"
              >
                <Sliders className="h-4 w-4" />
                <span>Simulate Grounded Scenario with What-If Engine</span>
              </button>
            </div>
          </div>

          {/* Node Inspector Side Panel */}
          <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-4 self-start">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Node Details Inspector
            </h3>

            {selectedNode ? (
              <div className="space-y-3 animate-fade-in">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">Type:</span>
                  <div className="text-xs font-bold text-white uppercase">{selectedNode.type}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">Label / Description:</span>
                  <p className="text-xs text-slate-200 font-medium">{selectedNode.data.label || selectedNode.data.description}</p>
                </div>

                {selectedNode.data.sql && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">Underlying DuckDB SQL:</span>
                    <pre className="text-[10px] font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap">
                      {selectedNode.data.sql}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                Click on any node in the reasoning graph to inspect its properties, SQL proof, or impact.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
