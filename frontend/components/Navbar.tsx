"use client";

import React from "react";
import {
  Brain,
  Database,
  Sparkles,
  Search,
  Network,
  Sliders,
  Terminal,
  Upload,
  Layers,
  ChevronDown,
} from "lucide-react";
import { DatasetInfo } from "@/lib/api";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  datasets: DatasetInfo[];
  selectedDataset: DatasetInfo | null;
  setSelectedDataset: (d: DatasetInfo) => void;
  onOpenUploadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  datasets,
  selectedDataset,
  setSelectedDataset,
  onOpenUploadModal,
}) => {
  const tabs = [
    { id: "overview", label: "Auto Insights", icon: Sparkles },
    { id: "investigate", label: "AI Investigation", icon: Search },
    { id: "graph", label: "Decision Graph", icon: Network },
    { id: "simulator", label: "What-If Simulator", icon: Sliders },
    { id: "profile", label: "Data Profile", icon: Database },
    { id: "workbench", label: "SQL Workbench", icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Busi<span className="text-cyan-400">AI</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Decision Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">From data to decisions. With proof.</p>
            </div>
          </div>

          {/* Dataset Selector Dropdown */}
          <div className="flex items-center space-x-3">
            {datasets.length > 0 && (
              <div className="relative">
                <select
                  value={selectedDataset?.id || ""}
                  onChange={(e) => {
                    const found = datasets.find((d) => d.id === e.target.value);
                    if (found) setSelectedDataset(found);
                  }}
                  className="appearance-none bg-slate-900 border border-slate-700/80 text-slate-200 text-xs rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer font-medium"
                >
                  {datasets.map((d) => (
                    <option key={d.id} value={d.id}>
                      📊 {d.name} ({d.row_count} rows)
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            )}

            <button
              id="upload-data-btn"
              onClick={onOpenUploadModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Data</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-1 border-t border-slate-800/40 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-indigo-600/15 text-cyan-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
