import React from 'react';
import { Layers, Network, Database, Zap, Globe2, Server } from 'lucide-react';
import { DijkstraVisualizer } from '../components/DijkstraVisualizer';
import { KnapsackVisualizer } from '../components/KnapsackVisualizer';
import { useGameLoad } from '../context/GameLoadContext';

export const InfrastructureView: React.FC = () => {
  const { networkMode, setNetworkMode } = useGameLoad();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Infrastructure Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-cyan-400" />
            <h1 className="font-heading text-2xl font-bold text-white">
              Global Edge & CDN Infrastructure
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Algorithmic pipeline orchestrating Dijkstra shortest-path routing and 0/1 Knapsack prefetch caching
          </p>
        </div>

        {/* Network Conditions Bar */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="text-slate-400 text-[11px] px-2">Simulate Client Link:</span>
          {(['fast', 'medium', 'slow'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setNetworkMode(mode)}
              className={`px-3 py-1 rounded-lg uppercase text-[10px] font-bold transition-all ${
                networkMode === mode
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Dijkstra Edge-CDN Network Graph */}
      <DijkstraVisualizer />

      {/* 2. Knapsack 0/1 Cache Budget Optimizer */}
      <KnapsackVisualizer />
    </div>
  );
};
