import React, { useState } from 'react';
import { ArrowLeft, Zap, Clock, ShieldAlert, Sparkles, RefreshCw, Layers, ArrowRight } from 'lucide-react';
import { ProgressiveLoader } from '../components/ProgressiveLoader';
import { PlayableGameView } from '../components/PlayableGameView';
import { Game } from '../types';
import { api } from '../services/api';
import { useGameLoad } from '../context/GameLoadContext';

interface PlayViewProps {
  gameId: string;
  onExit: () => void;
  onSwitchGame?: (gameId: string) => void;
}

export const PlayView: React.FC<PlayViewProps> = ({ gameId, onExit, onSwitchGame }) => {
  const { games, networkMode, refreshGames, triggerQuickPrefetch } = useGameLoad();

  const game = games.find(g => g.id === gameId) || games[0];

  // Default to optimized mode if game is Cached or Prefetched
  const [isOptimized, setIsOptimized] = useState<boolean>(
    game ? (game.cache_status === 'Cached' || game.cache_status === 'Prefetched') : true
  );

  const [isLoading, setIsLoading] = useState(true);
  const [actualLoadMs, setActualLoadMs] = useState(0);
  const [perceivedLoadMs, setPerceivedLoadMs] = useState(0);

  const handleToggleOptimization = () => {
    const nextMode = !isOptimized;
    setIsOptimized(nextMode);
    setIsLoading(true);
  };

  const handleLoadingComplete = (actualMs: number, perceivedMs: number) => {
    setActualLoadMs(actualMs);
    setPerceivedLoadMs(perceivedMs);
    setIsLoading(false);
    api.simulateLoad({
      game_id: gameId,
      is_optimized: isOptimized,
      network_mode: networkMode
    }).then(() => {
      refreshGames();
    }).catch(console.error);
  };

  if (!game) {
    return (
      <div className="p-16 text-center text-slate-400">
        <p>Game not found.</p>
        <button onClick={onExit} className="mt-4 px-4 py-2 bg-slate-800 rounded-xl">Back to Lobby</button>
      </div>
    );
  }

  // Other candidate games for Smart Game Switching (Requirement 21)
  const candidateSwitchGames = games.filter(g => g.id !== game.id).slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls & Comparison Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 uppercase">Simulator Studio</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">Network: {networkMode.toUpperCase()}</span>
            </div>
            <h1 className="font-heading text-lg font-bold text-white">
              Launch Test: {game.title}
            </h1>
          </div>
        </div>

        {/* Dual Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => { if (!isOptimized) handleToggleOptimization(); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              isOptimized
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-current" />
            <span>With GameLoad AI (0.48s)</span>
          </button>

          <button
            onClick={() => { if (isOptimized) handleToggleOptimization(); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              !isOptimized
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            <span>Without Optimization (6.8s)</span>
          </button>
        </div>
      </div>

      {/* Main Container: Progressive Loader OR Playable Game */}
      {isLoading ? (
        <ProgressiveLoader
          key={`loader-${gameId}-${isOptimized}`}
          game={game}
          isOptimized={isOptimized}
          onLoadingComplete={handleLoadingComplete}
        />
      ) : (
        <PlayableGameView
          game={game}
          isOptimized={isOptimized}
          actualLoadMs={actualLoadMs}
          perceivedLoadMs={perceivedLoadMs}
          onExit={onExit}
          onToggleOptimization={handleToggleOptimization}
        />
      )}

      {/* Smart Game Switching Strip (Requirement 21) */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-sm text-white">
              Smart Game Switching
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              Next-Game Discovery
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Current: <strong className="text-white">{game.title}</strong>
          </span>
        </div>

        <p className="text-xs text-slate-400 font-mono">
          Predicted likely transitions based on session genre momentum. Prefetched in background for instantaneous switching:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {candidateSwitchGames.map((candidate) => (
            <div
              key={candidate.id}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between transition-all"
            >
              <div>
                <p className="text-xs font-bold text-white font-heading truncate max-w-[140px]">
                  {candidate.title}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mt-0.5">
                  <span>{candidate.category}</span>
                  <span>•</span>
                  <span className={candidate.cache_status === 'Cached' ? 'text-emerald-400' : 'text-cyan-300'}>
                    {candidate.cache_status === 'Cached' ? 'Ready ⚡' : 'Prefetched ✓'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onSwitchGame) {
                    setIsLoading(true);
                    onSwitchGame(candidate.id);
                  }
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-colors shadow-sm"
              >
                <span>Switch</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-Side Architectural Contrast Card (Section 8 & 13) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Without Optimization Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          !isOptimized
            ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/30'
            : 'bg-slate-900/40 border-slate-800 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-heading font-bold text-sm text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Without GameLoad AI (Raw Cold Load)
            </span>
            <span className="text-xs font-mono font-bold text-rose-400">~6.8 seconds</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono text-slate-400">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
              <span>1. Click Game link</span>
              <span className="text-slate-500">0 ms</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
              <span>2. Sequential DNS & TLS handshake</span>
              <span className="text-slate-500">+1.2 s</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
              <span>3. Download {game.bundle_size_mb} MB bundle over congested route</span>
              <span className="text-slate-500">+3.4 s</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
              <span>4. Main-thread blocking WASM JIT compile</span>
              <span className="text-slate-500">+2.2 s</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-rose-950/30 text-rose-300 font-bold">
              <span>Game finally playable</span>
              <span>6.8s Total</span>
            </div>
          </div>
        </div>

        {/* With GameLoad AI Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isOptimized
            ? 'bg-cyan-950/20 border-cyan-500/40 shadow-lg shadow-cyan-950/30'
            : 'bg-slate-900/40 border-slate-800 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-heading font-bold text-sm text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              With GameLoad AI (Predictive Pipeline)
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400">~0.48 seconds</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono text-slate-300">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
              <span>1. Behavior Markov prediction before click</span>
              <span className="text-emerald-400">Done in background</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
              <span>2. 0/1 Knapsack selects asset bundle</span>
              <span className="text-emerald-400">Done in background</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
              <span>3. Dijkstra routes over optimal CDN (Fastly)</span>
              <span className="text-emerald-400">Done in background</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
              <span>4. Assets pre-warmed in local memory</span>
              <span className="text-cyan-400">0 ms Shell ready</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-cyan-950/40 text-cyan-300 font-bold">
              <span>User clicks Play → Instant start!</span>
              <span>0.48s Total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
