import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Sparkles, Zap, Shield, Layers, Layout, Cpu } from 'lucide-react';
import { Game } from '../types';

interface ProgressiveLoaderProps {
  game: Game;
  isOptimized: boolean;
  onLoadingComplete: (actualMs: number, perceivedMs: number) => void;
}

export const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({
  game,
  isOptimized,
  onLoadingComplete,
}) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Progressive Loading milestones
  const optimizedPhases = [
    { ms: 0, title: 'Game Shell Mounted', desc: 'Cached frame, viewport & background initialized', icon: Layout },
    { ms: 100, title: 'UI & Control HUD', desc: 'Touch overlay, score counters & audio context ready', icon: Layers },
    { ms: 200, title: 'Main Textures Deserialized', desc: 'Pre-warmed WebAssembly blobs unpacked from memory', icon: Sparkles },
    { ms: 300, title: 'Interactive Physics Bound', desc: 'Collision worker & input loop active', icon: Cpu },
    { ms: 480, title: 'Fully Playable ⚡', desc: 'First frame rendered without dropped cycles', icon: Zap },
  ];

  const unoptimizedPhases = [
    { ms: 0, title: 'DNS & SSL Handshake', desc: 'Negotiating connection to origin server', icon: Layout },
    { ms: 1400, title: 'Streaming Large Bundle', desc: `Downloading ${game.bundle_size_mb} MB unoptimized zip archive`, icon: Layers },
    { ms: 3600, title: 'Waiting for 4K Atlases', desc: 'Fetching uncompressed asset textures over high-latency pipe', icon: Sparkles },
    { ms: 5400, title: 'Compiling WebAssembly', desc: 'Main thread blocking JIT compilation', icon: Cpu },
    { ms: 6800, title: 'Game Ready (Cold Load)', desc: 'Finished sluggish cold startup', icon: Shield },
  ];

  const phases = isOptimized ? optimizedPhases : unoptimizedPhases;
  const targetActualMs = isOptimized ? 480 : 6800;
  const targetPerceivedMs = isOptimized ? 210 : 6600;

  useEffect(() => {
    let start = performance.now();
    let animId: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      setElapsedMs(Math.min(targetActualMs, Math.round(elapsed)));

      // Check current milestone
      for (let i = phases.length - 1; i >= 0; i--) {
        if (elapsed >= phases[i].ms) {
          setCurrentPhaseIndex(i);
          break;
        }
      }

      if (elapsed >= targetActualMs) {
        setIsFinished(true);
        onLoadingComplete(targetActualMs, targetPerceivedMs);
      } else {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isOptimized, targetActualMs]);

  const progressPct = Math.min(100, Math.round((elapsedMs / targetActualMs) * 100));

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-6 shadow-2xl backdrop-blur-xl space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
            {isOptimized ? 'GameLoad AI Accelerated' : 'Cold Unoptimized Load'}
          </span>
          <h2 className="font-heading text-xl font-bold text-white mt-1">
            Launching {game.title}...
          </h2>
        </div>

        {/* Stopwatch meters */}
        <div className="text-right font-mono">
          <span className="text-[10px] text-slate-400 block uppercase">Elapsed Time</span>
          <span className={`text-2xl font-bold ${isOptimized ? 'text-cyan-400' : 'text-amber-400'}`}>
            {(elapsedMs / 1000).toFixed(2)}s
          </span>
        </div>
      </div>

      {/* Interactive Progressive Skeleton Shell Preview */}
      <div className="relative aspect-[16/8] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-6">
        {/* Background artwork with progressive blur unmask */}
        <img
          src={game.thumbnail}
          alt={game.title}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
            currentPhaseIndex >= 2 ? 'opacity-40 blur-none' : 'opacity-15 blur-md'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        {/* Dynamic Skeleton Content */}
        <div className="relative z-10 w-full max-w-md space-y-3">
          {/* Phase 0 & 1 Skeleton: Game Shell HUD */}
          <div className="flex items-center justify-between">
            <div className={`h-6 w-32 rounded-lg transition-all ${currentPhaseIndex >= 1 ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-slate-800 animate-pulse'}`} />
            <div className={`h-6 w-20 rounded-lg transition-all ${currentPhaseIndex >= 1 ? 'bg-purple-500/20 border border-purple-500/40' : 'bg-slate-800 animate-pulse'}`} />
          </div>

          {/* Phase 2: Central Game Canvas Skeleton */}
          <div className={`h-24 w-full rounded-xl flex items-center justify-center transition-all ${
            currentPhaseIndex >= 2
              ? 'bg-cyan-950/40 border border-cyan-500/50 shadow-lg shadow-cyan-950/50'
              : 'bg-slate-900/60 border border-slate-800 animate-pulse'
          }`}>
            <span className="text-xs font-mono text-cyan-300 flex items-center gap-2">
              {currentPhaseIndex >= 4 ? (
                <>
                  <Zap className="w-4 h-4 text-cyan-400 fill-current" />
                  <span>Interactive Engine Ready!</span>
                </>
              ) : (
                <>
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span>{phases[currentPhaseIndex]?.title || 'Preparing assets...'}</span>
                </>
              )}
            </span>
          </div>

          {/* Phase 3: Bottom Control buttons Skeleton */}
          <div className="flex gap-2">
            <div className={`h-8 flex-1 rounded-lg transition-all ${currentPhaseIndex >= 3 ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-slate-800 animate-pulse'}`} />
            <div className={`h-8 flex-1 rounded-lg transition-all ${currentPhaseIndex >= 3 ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-slate-800 animate-pulse'}`} />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            {phases[currentPhaseIndex]?.title}
          </span>
          <span className="text-cyan-400 font-bold">{progressPct}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              isOptimized
                ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400'
                : 'bg-gradient-to-r from-amber-500 to-rose-500'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Progressive Step Timeline */}
      <div className="grid grid-cols-5 gap-1.5 pt-2">
        {phases.map((p, idx) => {
          const isPassed = currentPhaseIndex >= idx;
          const isCurrent = currentPhaseIndex === idx;

          return (
            <div
              key={idx}
              className={`p-2 rounded-lg border text-center transition-all ${
                isPassed
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 opacity-60'
              }`}
            >
              <span className="text-[10px] font-mono block text-slate-400 font-bold">
                {p.ms} ms
              </span>
              <span className="text-[10px] font-mono font-medium truncate block mt-0.5">
                {p.title.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Actual vs Perceived Load Metrics Comparison */}
      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
        <div>
          <span className="text-slate-400 text-[11px]">Actual Launch Time:</span>
          <p className="text-cyan-300 font-bold">
            {isFinished ? `${(targetActualMs / 1000).toFixed(2)}s` : `${(elapsedMs / 1000).toFixed(2)}s`}
          </p>
        </div>
        <div className="w-px h-6 bg-slate-800" />
        <div>
          <span className="text-slate-400 text-[11px]">Perceived Launch Time:</span>
          <p className="text-emerald-400 font-bold">
            {isFinished ? `${(targetPerceivedMs / 1000).toFixed(2)}s` : `${Math.min(targetPerceivedMs, elapsedMs) / 1000}s`}
          </p>
        </div>
        <div className="w-px h-6 bg-slate-800" />
        <div>
          <span className="text-slate-400 text-[11px]">Speedup Factor:</span>
          <p className="text-purple-400 font-bold">
            {isOptimized ? '14.2x Faster' : '1.0x (Baseline)'}
          </p>
        </div>
      </div>
    </div>
  );
};
