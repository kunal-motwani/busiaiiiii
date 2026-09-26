"use client";

import React, { useEffect, useState } from "react";
import {
  Sliders,
  TrendingUp,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { SimulationResult, runSimulation } from "@/lib/api";

interface WhatIfSimulatorProps {
  datasetId: string;
  targetMetric?: string;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  datasetId,
  targetMetric = "mrr",
}) => {
  const [priceChange, setPriceChange] = useState<number>(10);
  const [churnReduction, setChurnReduction] = useState<number>(15);
  const [conversionBoost, setConversionBoost] = useState<number>(5);
  const [costReduction, setCostReduction] = useState<number>(0);

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async () => {
    if (!datasetId) return;
    setIsLoading(true);
    try {
      const data = await runSimulation({
        dataset_id: datasetId,
        target_metric: targetMetric,
        price_change_pct: priceChange,
        churn_reduction_pct: churnReduction,
        conversion_boost_pct: conversionBoost,
        cost_reduction_pct: costReduction,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSimulate();
  }, [datasetId, priceChange, churnReduction, conversionBoost, costReduction]);

  const handleReset = () => {
    setPriceChange(0);
    setChurnReduction(0);
    setConversionBoost(0);
    setCostReduction(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Sliders className="h-5 w-5 text-cyan-400" />
            <span>Grounded What-If Simulator</span>
          </h2>
          <p className="text-xs text-slate-400">
            Simulate the impact of pricing, retention, and acquisition changes with statistical bounds.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center space-x-1.5 cursor-pointer self-start"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Levers</span>
        </button>
      </div>

      {/* Main Simulation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Control Sliders */}
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-5 self-start">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Scenario Levers</span>
            <span className="text-cyan-400 font-normal">Target: {targetMetric}</span>
          </h3>

          {/* Slider 1: Price Change */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Price Adjustment</span>
              <span className={`font-mono font-bold ${priceChange >= 0 ? "text-cyan-400" : "text-rose-400"}`}>
                {priceChange > 0 ? `+${priceChange}%` : `${priceChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="5"
              value={priceChange}
              onChange={(e) => setPriceChange(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-30%</span>
              <span>0%</span>
              <span>+50%</span>
            </div>
          </div>

          {/* Slider 2: Churn Reduction */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Churn Reduction</span>
              <span className="font-mono font-bold text-emerald-400">+{churnReduction}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="5"
              value={churnReduction}
              onChange={(e) => setChurnReduction(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0%</span>
              <span>20%</span>
              <span>40%</span>
            </div>
          </div>

          {/* Slider 3: Conversion Boost */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Conversion Lift</span>
              <span className="font-mono font-bold text-indigo-400">+{conversionBoost}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="2"
              value={conversionBoost}
              onChange={(e) => setConversionBoost(Number(e.target.value))}
              className="w-full accent-indigo-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0%</span>
              <span>15%</span>
              <span>30%</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center space-x-1 text-slate-300 font-bold">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Grounded Model Assumptions:</span>
            </div>
            <p>Calculates demand price elasticity curve (-0.3) and compounding retention lifetime value.</p>
          </div>
        </div>

        {/* Right: Projections Chart & Scenario Cards */}
        <div className="lg:col-span-2 space-y-6">
          {result && (
            <>
              {/* High-level KPI Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="glass-panel p-4 rounded-xl border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Baseline Aggregate</span>
                  <div className="text-lg font-extrabold text-white mt-1 font-mono">
                    ${result.baseline_value.toLocaleString()}
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-xl border-indigo-500/40 bg-indigo-950/20">
                  <span className="text-[10px] font-bold text-cyan-300 uppercase">Projected Output</span>
                  <div className="text-lg font-extrabold text-cyan-400 mt-1 font-mono">
                    ${result.projected_value.toLocaleString()}
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-xl border-emerald-500/40 bg-emerald-950/20">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase">Net Variance</span>
                  <div className="text-lg font-extrabold text-emerald-400 mt-1 font-mono">
                    {result.net_delta >= 0 ? `+$${result.net_delta.toLocaleString()}` : `-$${Math.abs(result.net_delta).toLocaleString()}`}
                    <span className="text-xs font-semibold ml-1.5">({result.net_delta_pct > 0 ? `+${result.net_delta_pct}%` : `${result.net_delta_pct}%`})</span>
                  </div>
                </div>
              </div>

              {/* 6-Month Projection Area Chart */}
              <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                    <span>6-Month Forward Projection Curve</span>
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {result.confidence_score}% Statistical Confidence
                  </span>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.timeline_curve}>
                      <defs>
                        <linearGradient id="colorOptimistic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "0.75rem",
                          color: "#f8fafc",
                          fontSize: "12px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                      <Area
                        type="monotone"
                        dataKey="baseline"
                        stroke="#64748b"
                        strokeDasharray="4 4"
                        fill="none"
                        name="Baseline (Status Quo)"
                      />
                      <Area
                        type="monotone"
                        dataKey="projected_base"
                        stroke="#06b6d4"
                        fillOpacity={1}
                        fill="url(#colorBase)"
                        name="Expected Base Case"
                      />
                      <Area
                        type="monotone"
                        dataKey="projected_optimistic"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorOptimistic)"
                        name="Optimistic Upside"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Three Scenarios Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {result.scenarios.map((sc, i) => (
                  <div
                    key={i}
                    className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1.5"
                  >
                    <span className="text-[10px] font-extrabold uppercase text-indigo-400">
                      {sc.name.replace("_", " ")}
                    </span>
                    <div className="text-base font-bold text-white font-mono">
                      ${sc.projected_value.toLocaleString()}
                    </div>
                    <div className="text-xs font-bold text-emerald-400 font-mono">
                      {sc.delta_value >= 0 ? `+$${sc.delta_value.toLocaleString()}` : `-$${Math.abs(sc.delta_value).toLocaleString()}`} ({sc.delta_percentage > 0 ? `+${sc.delta_percentage}%` : `${sc.delta_percentage}%`})
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug pt-1">{sc.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
