"use client";

import React from "react";
import {
  TrendingDown,
  TrendingUp,
  PieChart,
  GitBranch,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { BusinessInsight } from "@/lib/api";

interface AutoInsightsDeckProps {
  insights: BusinessInsight[];
  onInvestigateInsight: (question: string) => void;
  isLoading: boolean;
}

export const AutoInsightsDeck: React.FC<AutoInsightsDeckProps> = ({
  insights,
  onInvestigateInsight,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-1/3 mb-3"></div>
            <div className="h-5 bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-12 bg-slate-800/60 rounded mb-4"></div>
            <div className="h-8 bg-slate-800 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center border-dashed border-slate-800">
        <Sparkles className="h-10 w-10 text-indigo-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">No Key Deviations Detected</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          The dataset metrics appear within standard operational variance bounds. Try asking a targeted investigation question.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Automated Business Insights</span>
          </h2>
          <p className="text-xs text-slate-400">
            Discovered key changes, segment concentration, and anomalies from raw data.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          {insights.length} Signals Found
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight) => {
          let Icon = Zap;
          let badgeColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
          let borderHighlight = "hover:border-indigo-500/40";

          if (insight.type === "trend_shift") {
            Icon = TrendingDown;
            badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";
            borderHighlight = "hover:border-rose-500/40";
          } else if (insight.type === "growth") {
            Icon = TrendingUp;
            badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            borderHighlight = "hover:border-emerald-500/40";
          } else if (insight.type === "concentration") {
            Icon = PieChart;
            badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
            borderHighlight = "hover:border-amber-500/40";
          } else if (insight.type === "correlation") {
            Icon = GitBranch;
            badgeColor = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
            borderHighlight = "hover:border-cyan-500/40";
          } else if (insight.type === "anomaly") {
            Icon = AlertTriangle;
            badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";
            borderHighlight = "hover:border-purple-500/40";
          }

          return (
            <div
              key={insight.id}
              className={`glass-panel p-5 rounded-2xl flex flex-col justify-between glass-card-hover border border-slate-800/80 ${borderHighlight}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg border ${badgeColor}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {insight.type.replace("_", " ")}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                      insight.importance === "high"
                        ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {insight.importance} priority
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-2 leading-snug">{insight.title}</h3>
                <p className="text-xs text-slate-300/90 leading-relaxed mb-4">{insight.description}</p>
              </div>

              {insight.suggested_question && (
                <button
                  onClick={() => onInvestigateInsight(insight.suggested_question!)}
                  className="w-full mt-2 flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-xs font-semibold text-cyan-300 hover:text-white transition group cursor-pointer"
                >
                  <span className="truncate pr-2">Investigate: &quot;{insight.suggested_question}&quot;</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-cyan-400 group-hover:translate-x-1 transition" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
