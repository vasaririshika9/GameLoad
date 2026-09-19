import React, { useState } from 'react';
import { Sparkles, Zap, Clock, ShieldCheck, Flame, ArrowRight, CheckCircle2, QrCode, Filter, RefreshCw } from 'lucide-react';
import { GameCard } from '../components/GameCard';
import { useGameLoad } from '../context/GameLoadContext';
import { Game } from '../types';
import { api } from '../services/api';

interface LobbyViewProps {
  onPlayGame: (gameId: string) => void;
  onInspectGame: (gameId: string) => void;
  onOpenQrModal: (game: Game) => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  onPlayGame,
  onInspectGame,
  onOpenQrModal
}) => {
  const {
    games,
    loading,
    prediction,
    setOpenOptimizationModal,
    triggerQuickPrefetch
  } = useGameLoad();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Racing', 'Sports', 'Arcade', 'Puzzle', 'Action'];

  const filteredGames = selectedCategory === 'All'
    ? games
    : games.filter(g => g.category.toLowerCase() === selectedCategory.toLowerCase());

  const topPredictedGame = games.find(g => g.id === prediction?.top_predicted_game) || games[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. AI-Based Prediction Hero Banner */}
      {topPredictedGame && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-[#0a152e] to-slate-950 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl shadow-cyan-950/40">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  <span>AI Game Prediction Active</span>
                </span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Background Prefetched</span>
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl font-bold text-white tracking-tight">
                {prediction?.display_headline || `Next Game Prediction: ${topPredictedGame.title} — 87% confidence`}
              </h1>

              <p className="text-sm text-slate-300 font-sans">
                Third-party certified bundles usually take <span className="text-rose-400 font-mono font-bold">6–8s</span> to mount.
                GameLoad AI predicted your launch intent, ran Dijkstra optimal routing, and preheated WASM assets into local memory:
                ready to play in <span className="text-cyan-300 font-mono font-bold">~460ms</span>!
              </p>

              {/* Real-Time Prefetch Tracker Micro-Pipeline */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Predict intent: ✓</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Knapsack budget: ✓</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Dijkstra route: ✓</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <Zap className="w-3.5 h-3.5 text-cyan-400 fill-current animate-bounce" />
                  <span>Launch ready (460ms)</span>
                </div>
              </div>
            </div>

            {/* Quick Launch CTA Button */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
              <button
                onClick={() => onPlayGame(topPredictedGame.id)}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-heading font-bold text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Instant Launch</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setOpenOptimizationModal(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition-colors"
              >
                <span>Pipeline Inspector</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Platform Telemetry Dashboard Strip (Section 1) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono text-slate-400">Current Avg Load</span>
          <p className="text-xl font-bold font-mono text-cyan-400 mt-1">482 ms</p>
          <span className="text-[10px] text-emerald-400 font-mono mt-1">↓ 92.9% reduction</span>
        </div>

        {/* Metric 2 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono text-slate-400">Cold Load Baseline</span>
          <p className="text-xl font-bold font-mono text-rose-400 mt-1">6.8 sec</p>
          <span className="text-[10px] text-slate-400 font-mono mt-1">Raw origin pipe</span>
        </div>

        {/* Metric 3 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono text-slate-400">Cache Hit Rate</span>
          <p className="text-xl font-bold font-mono text-emerald-400 mt-1">94.2%</p>
          <span className="text-[10px] text-slate-400 font-mono mt-1">LRU memory buffer</span>
        </div>

        {/* Metric 4 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono text-slate-400">Prefetch Accuracy</span>
          <p className="text-xl font-bold font-mono text-purple-400 mt-1">87.0%</p>
          <span className="text-[10px] text-slate-400 font-mono mt-1">Markov AI scoring</span>
        </div>

        {/* Metric 5 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono text-slate-400">Sampled / Session</span>
          <p className="text-xl font-bold font-mono text-slate-200 mt-1">4.8 games</p>
          <span className="text-[10px] text-slate-400 font-mono mt-1">Zero latency hopping</span>
        </div>

        {/* Metric 6 */}
        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono text-slate-400">Conversion Rate</span>
          <p className="text-xl font-bold font-mono text-cyan-300 mt-1">92.4%</p>
          <span className="text-[10px] text-emerald-400 font-mono mt-1">Sub-second start</span>
        </div>
      </div>

      {/* 3. Game Catalog Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">
            Available Certified Bundles
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Optimized delivery routes computed via Dijkstra and Knapsack budget control
          </p>
        </div>

        {/* Genre Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Game Cards Grid */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-slate-400">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
          <p className="font-mono text-sm">Syncing games with Edge Cache...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={onPlayGame}
              onOpenQr={onOpenQrModal}
              onInspect={onInspectGame}
            />
          ))}
        </div>
      )}

      {/* 5. Core Message Tagline Footer */}
      <div className="text-center py-6 border-t border-slate-800">
        <blockquote className="font-heading text-lg sm:text-xl font-bold text-slate-300 tracking-wide">
          “Don't make the game load faster. Make the game ready before the user asks for it.”
        </blockquote>
        <p className="text-xs text-slate-400 font-mono mt-1">
          GameLoad AI Infrastructure • Certified Third-Party Edge Delivery Architecture
        </p>
      </div>
    </div>
  );
};
