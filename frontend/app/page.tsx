"use client";

import React, { useEffect, useState } from "react";
import {
  Brain,
  Sparkles,
  Database,
  Search,
  Network,
  Sliders,
  Terminal,
  Upload,
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { DatasetUploader } from "@/components/DatasetUploader";
import { AutoInsightsDeck } from "@/components/AutoInsightsDeck";
import { AIInvestigationConsole } from "@/components/AIInvestigationConsole";
import { EvidenceModal } from "@/components/EvidenceModal";
import { DecisionGraphView } from "@/components/DecisionGraphView";
import { WhatIfSimulator } from "@/components/WhatIfSimulator";
import { DatasetProfileView } from "@/components/DatasetProfileView";
import { SQLWorkbench } from "@/components/SQLWorkbench";
import {
  BusinessInsight,
  DatasetInfo,
  EvidenceItem,
  getDatasetInsights,
  listDatasets,
  uploadSampleCsv,
} from "@/lib/api";

const SAMPLE_SAAS_DEFAULT = `date,mrr,arr,churn_rate,new_customers,churned_customers,cac,ltv,region,plan_tier
2025-01-01,120000,1440000,2.1,45,8,420,5200,North America,Enterprise
2025-01-01,65000,780000,3.4,80,22,210,2400,EMEA,Pro
2025-01-01,35000,420000,4.2,60,18,150,1600,APAC,Starter
2025-02-01,128000,1536000,1.9,48,7,410,5400,North America,Enterprise
2025-02-01,69000,828000,3.1,84,20,205,2500,EMEA,Pro
2025-02-01,37000,444000,3.9,64,16,145,1650,APAC,Starter
2025-03-01,135000,1620000,1.8,52,6,395,5600,North America,Enterprise
2025-03-01,73000,876000,2.9,90,19,200,2600,EMEA,Pro
2025-03-01,39000,468000,3.8,68,15,140,1700,APAC,Starter
2025-04-01,142000,1704000,2.0,50,7,405,5500,North America,Enterprise
2025-04-01,77000,924000,3.0,92,20,198,2650,EMEA,Pro
2025-04-01,41000,492000,3.7,70,15,138,1750,APAC,Starter
2025-05-01,151000,1812000,1.7,55,5,390,5800,North America,Enterprise
2025-05-01,82000,984000,2.8,96,18,195,2700,EMEA,Pro
2025-05-01,44000,528000,3.5,75,14,135,1800,APAC,Starter
2025-06-01,160000,1920000,1.6,58,5,385,5950,North America,Enterprise
2025-06-01,86000,1032000,2.7,100,17,190,2750,EMEA,Pro
2025-06-01,46000,552000,3.4,78,13,132,1850,APAC,Starter
2025-07-01,169000,2028000,1.5,60,4,380,6100,North America,Enterprise
2025-07-01,91000,1092000,2.6,105,16,188,2800,EMEA,Pro
2025-07-01,48000,576000,3.3,80,12,130,1900,APAC,Starter
2025-08-01,122000,1464000,5.8,25,32,620,4100,North America,Enterprise
2025-08-01,72000,864000,4.9,55,36,310,2100,EMEA,Pro
2025-08-01,36000,432000,5.2,40,25,210,1400,APAC,Starter
2025-09-01,138000,1656000,3.2,42,14,480,4800,North America,Enterprise
2025-09-01,80000,960000,3.5,78,21,240,2500,EMEA,Pro
2025-09-01,42000,504000,3.9,65,16,160,1680,APAC,Starter
2025-10-01,152000,1824000,2.2,52,8,410,5400,North America,Enterprise
2025-10-01,88000,1056000,2.9,92,19,205,2680,EMEA,Pro
2025-10-01,45000,540000,3.5,72,14,142,1760,APAC,Starter`;

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<DatasetInfo | null>(null);
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [prefillQuestion, setPrefillQuestion] = useState<string>("");

  const refreshDatasets = async () => {
    try {
      let list = await listDatasets();
      if (list.length === 0) {
        // Auto-bootstrap sample dataset so user has immediate data
        const sample = await uploadSampleCsv(
          "saas_monthly_metrics.csv",
          SAMPLE_SAAS_DEFAULT,
          "SaaS Growth & Churn Metrics"
        );
        list = [sample];
      }
      setDatasets(list);
      if (!selectedDataset && list.length > 0) {
        setSelectedDataset(list[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshDatasets();
  }, []);

  useEffect(() => {
    if (!selectedDataset) return;
    const fetchInsights = async () => {
      setIsLoadingInsights(true);
      try {
        const data = await getDatasetInsights(selectedDataset.id);
        setInsights(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingInsights(false);
      }
    };
    fetchInsights();
  }, [selectedDataset?.id]);

  const handleInvestigateInsight = (q: string) => {
    setPrefillQuestion(q);
    setActiveTab("investigate");
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        datasets={datasets}
        selectedDataset={selectedDataset}
        setSelectedDataset={setSelectedDataset}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {selectedDataset ? (
          <>
            {activeTab === "overview" && (
              <div className="space-y-6 animate-fade-in">
                {/* Hero Banner */}
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border-indigo-500/20 relative overflow-hidden">
                  <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="max-w-2xl space-y-3 relative z-10">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Evidence-First AI Business Engine</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Find what changed. <span className="gradient-text">Prove it with data.</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      BusiAI connects automated anomaly detection, DuckDB deterministic SQL, and grounded what-if simulations to give business decisions backed by mathematical proof.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setActiveTab("investigate")}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-500/20 flex items-center space-x-2 cursor-pointer"
                      >
                        <Search className="h-3.5 w-3.5" />
                        <span>Ask AI Question</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("simulator")}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Explore What-If Scenarios</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Auto Insights Deck */}
                <AutoInsightsDeck
                  insights={insights}
                  onInvestigateInsight={handleInvestigateInsight}
                  isLoading={isLoadingInsights}
                />
              </div>
            )}

            {activeTab === "investigate" && (
              <AIInvestigationConsole
                datasetId={selectedDataset.id}
                onOpenEvidence={(ev) => setSelectedEvidence(ev)}
                onNavigateToSimulator={() => setActiveTab("simulator")}
                onNavigateToGraph={() => setActiveTab("graph")}
                prefillQuestion={prefillQuestion}
              />
            )}

            {activeTab === "graph" && (
              <DecisionGraphView
                datasetId={selectedDataset.id}
                onSelectSimulation={() => setActiveTab("simulator")}
              />
            )}

            {activeTab === "simulator" && (
              <WhatIfSimulator datasetId={selectedDataset.id} />
            )}

            {activeTab === "profile" && (
              <DatasetProfileView dataset={selectedDataset} />
            )}

            {activeTab === "workbench" && (
              <SQLWorkbench dataset={selectedDataset} />
            )}
          </>
        ) : (
          <div className="text-center py-24 glass-panel rounded-3xl p-8 max-w-lg mx-auto space-y-4">
            <Database className="h-12 w-12 text-indigo-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">No Dataset Ingested Yet</h2>
            <p className="text-xs text-slate-400">
              Upload a business dataset or click below to launch the SaaS Growth demo dataset.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              Upload / Select Dataset
            </button>
          </div>
        )}
      </main>

      {/* Ingestion Modal */}
      <DatasetUploader
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDatasetUploaded={(dataset) => {
          setDatasets((prev) => [dataset, ...prev]);
          setSelectedDataset(dataset);
        }}
      />

      {/* Evidence Inspection Modal */}
      <EvidenceModal
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-[11px] text-slate-500">
        BusiAI &mdash; AI Decision Engine for Business Data &bull; Powered by DuckDB &amp; FastAPI &bull; From data to decisions. With proof.
      </footer>
    </div>
  );
}
