import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, XCircle, Sliders, HardDrive, Zap, Info } from 'lucide-react';
import { KnapsackResult } from '../types';
import { api } from '../services/api';
import { useGameLoad } from '../context/GameLoadContext';

export const KnapsackVisualizer: React.FC = () => {
  const { cacheCapacityMb, setCacheCapacityMb, userProfile } = useGameLoad();
  const [knapsackData, setKnapsackData] = useState<KnapsackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDpTable, setShowDpTable] = useState(false);

  const fetchKnapsack = async (capacity: number) => {
    setLoading(true);
    try {
      const res = await api.optimizeCache({
        cache_capacity_mb: capacity,
        user_profile: userProfile
      });
      setKnapsackData(res);
    } catch (err) {
      console.error('Failed to run Knapsack:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnapsack(cacheCapacityMb);
  }, [cacheCapacityMb, userProfile]);

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-purple-500/20 p-5 shadow-xl space-y-5">
      {/* Header & Capacity Slider */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            <h3 className="font-heading font-bold text-base text-white">
              0/1 Knapsack Cache Optimizer
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
              DP Algorithm
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Maximizes expected launch utility while strictly respecting device cache & bandwidth limits
          </p>
        </div>

        {/* Cache Capacity Slider Control */}
        <div className="flex items-center gap-3 bg-slate-950/70 px-4 py-2.5 rounded-xl border border-slate-800">
          <Sliders className="w-4 h-4 text-purple-400" />
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-slate-400 text-[11px]">Cache Budget:</span>
              <span className="text-purple-300 font-bold ml-2">{cacheCapacityMb} MB</span>
            </div>
            <input
              type="range"
              min="200"
              max="900"
              step="50"
              value={cacheCapacityMb}
              onChange={(e) => setCacheCapacityMb(Number(e.target.value))}
              className="w-36 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>
      </div>

      {knapsackData && (
        <>
          {/* Budget Utilization Bar */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300">
                  Cache Allocation: <strong className="text-white">{knapsackData.total_size_mb} MB</strong> / {knapsackData.capacity_mb} MB
                </span>
              </div>
              <span className="text-purple-400 font-bold">
                {knapsackData.cache_utilization_pct}% Utilized ({knapsackData.remaining_budget_mb} MB free)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${knapsackData.cache_utilization_pct}%` }}
              />
            </div>
          </div>

          {/* Decision Comparison: Selected vs Skipped */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Selected for Prefetch */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-heading font-bold text-sm text-emerald-300">
                    Prefetch Decision ({knapsackData.selected_count} Selected)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  High Expected Utility
                </span>
              </div>

              <div className="space-y-2">
                {knapsackData.selected_assets.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-emerald-500/20 text-xs font-mono"
                  >
                    <div>
                      <span className="font-bold text-slate-100">{item.name}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{item.size_mb} MB</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold">
                        {Math.round(item.probability * 100)}% launch prob
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Benefit Score: {item.benefit_score}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skipped to Save Cache/Bandwidth */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span className="font-heading font-bold text-sm text-rose-300">
                    Skipped ({knapsackData.skipped_count} Excluded)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-500/30">
                  Exceeds Cost / Low Prob
                </span>
              </div>

              <div className="space-y-2">
                {knapsackData.skipped_assets.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-rose-500/20 text-xs font-mono opacity-80"
                  >
                    <div>
                      <span className="font-bold text-slate-300">{item.name}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{item.size_mb} MB</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-rose-400 font-semibold">
                        {Math.round(item.probability * 100)}% prob
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Benefit: {item.benefit_score}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Programming Table Inspector Toggle */}
          <div className="border-t border-slate-800 pt-3 space-y-3">
            <button
              onClick={() => setShowDpTable(!showDpTable)}
              className="flex items-center gap-2 text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showDpTable ? 'Hide' : 'Inspect'} Dynamic Programming Table Matrix</span>
            </button>

            {showDpTable && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono overflow-x-auto">
                <p className="text-slate-400 text-[11px] mb-2">
                  Sample snapshot of DP state matrix <code className="text-purple-300">dp[i][w]</code> tracking maximum expected value at capacity steps:
                </p>
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-1.5 px-2">Asset Item (i)</th>
                      {knapsackData.dp_table_summary[0]?.values.map((v, idx) => (
                        <th key={idx} className="py-1.5 px-2 text-center text-cyan-400">
                          {v.weight_mb}MB
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {knapsackData.dp_table_summary.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-slate-900 hover:bg-slate-900/50">
                        <td className="py-1.5 px-2 text-slate-300 font-semibold truncate max-w-[120px]">
                          {row.item_name}
                        </td>
                        {row.values.map((v, cIdx) => (
                          <td key={cIdx} className="py-1.5 px-2 text-center text-slate-400">
                            {v.max_val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Optimization Explanation List (Requirement 23) */}
            {knapsackData.explanations && knapsackData.explanations.length > 0 && (
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-purple-300 font-bold">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>Algorithmic Optimization Explanation: Why Were Assets Selected / Skipped?</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {knapsackData.explanations.map((exp) => (
                    <div
                      key={exp.game_id}
                      className={`p-3 rounded-lg border ${
                        exp.decision === 'PREFETCH'
                          ? 'bg-slate-900/80 border-emerald-500/30'
                          : 'bg-slate-900/60 border-slate-800 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{exp.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          exp.decision === 'PREFETCH'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {exp.decision}
                        </span>
                      </div>
                      <ul className="space-y-0.5 text-[11px] text-slate-300 pl-4 list-disc marker:text-purple-400">
                        {exp.reasons.map((r, rIdx) => (
                          <li key={rIdx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
