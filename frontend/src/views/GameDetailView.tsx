import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, QrCode, HardDrive, Zap, Layers, Server, CheckCircle2, RefreshCw } from 'lucide-react';
import { Game } from '../types';
import { DijkstraVisualizer } from '../components/DijkstraVisualizer';
import { useGameLoad } from '../context/GameLoadContext';

interface GameDetailViewProps {
  gameId: string;
  onBack: () => void;
  onPlay: (gameId: string) => void;
  onOpenQr: (game: Game) => void;
}

export const GameDetailView: React.FC<GameDetailViewProps> = ({
  gameId,
  onBack,
  onPlay,
  onOpenQr
}) => {
  const { games, triggerQuickPrefetch } = useGameLoad();
  const game = games.find(g => g.id === gameId) || games[0];

  if (!game) {
    return (
      <div className="p-16 text-center text-slate-400">
        <p>Game not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-800 rounded-xl">Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 uppercase">{game.category}</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">Bundle ID: {game.id}</span>
            </div>
            <h1 className="font-heading text-xl font-bold text-white">
              {game.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenQr(game)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan & Play</span>
          </button>

          <button
            onClick={() => triggerQuickPrefetch(game.id)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/40 text-xs font-mono transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Prefetch Assets</span>
          </button>

          <button
            onClick={() => onPlay(game.id)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Simulator</span>
          </button>
        </div>
      </div>

      {/* Game Profile & Asset Manifest */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Thumbnail, Specs, Description */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[16/10] relative">
            <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3">
              <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                game.cache_status === 'Cached'
                  ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/40'
                  : game.cache_status === 'Prefetched'
                  ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/40'
                  : 'bg-amber-950/90 text-amber-400 border border-amber-500/40'
              }`}>
                Cache Status: {game.cache_status}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs font-mono">
            <h3 className="font-heading font-bold text-sm text-white">Bundle Telemetry</h3>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Compressed Bundle:</span>
              <span className="text-white font-bold">{game.bundle_size_mb} MB</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Uncompressed Footprint:</span>
              <span className="text-slate-300">{game.uncompressed_size_mb} MB</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Cold Load (Baseline):</span>
              <span className="text-rose-400 font-bold">{game.cold_load_sec} s</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Optimized Launch:</span>
              <span className="text-cyan-400 font-bold">{game.optimized_load_ms} ms</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {game.description}
            </p>
          </div>
        </div>

        {/* Right: Asset Manifest Breakdown */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="font-heading font-bold text-base text-white">
                  Asset Manifest Decomposition
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {game.assets?.length || 0} Individual Chunks
              </span>
            </div>

            <div className="space-y-2.5">
              {game.assets?.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 uppercase text-[10px] font-bold">
                      {asset.type.slice(0, 3)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{asset.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ID: {asset.id} • Importance Priority: {asset.importance}x
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-300 font-bold">{asset.size_mb} MB</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      asset.required
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {asset.required ? 'Critical' : 'Deferred'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dijkstra Route Visualization for this game */}
          <DijkstraVisualizer targetGameTitle={game.title} />
        </div>
      </div>
    </div>
  );
};
