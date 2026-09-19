import React from 'react';
import { Play, QrCode, Zap, Clock, HardDrive, Gamepad2 } from 'lucide-react';
import { Game } from '../types';
import { useGameLoad } from '../context/GameLoadContext';

interface GameCardProps {
  game: Game;
  onPlay: (gameId: string) => void;
  onOpenQr: (game: Game) => void;
  onInspect: (gameId: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onPlay,
  onOpenQr,
  onInspect
}) => {
  const { triggerQuickPrefetch } = useGameLoad();

  // Status badges styling
  const statusConfig = {
    Cached: {
      label: 'Cached',
      badgeClass: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50',
      dotClass: 'bg-emerald-400',
      loadColor: 'text-emerald-400',
    },
    Prefetched: {
      label: 'Prefetched',
      badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50',
      dotClass: 'bg-cyan-400 animate-ping',
      loadColor: 'text-cyan-300',
    },
    Cold: {
      label: 'Cold',
      badgeClass: 'bg-amber-950/80 text-amber-400 border-amber-500/40',
      dotClass: 'bg-amber-400',
      loadColor: 'text-amber-400',
    },
  };

  const currentStatus = statusConfig[game.cache_status] || statusConfig.Cold;

  const displayLoadTime =
    game.cache_status === 'Cached'
      ? '280 ms'
      : game.cache_status === 'Prefetched'
      ? `${game.optimized_load_ms} ms`
      : `${game.cold_load_sec} s`;

  return (
    <div className="group relative rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/50 flex flex-col justify-between overflow-hidden">
      {/* Background neon hover gradient */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div>
        {/* Thumbnail and Badges */}
        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 mb-3.5 border border-slate-800/80">
          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Top Status & Category Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/80 text-slate-300 border border-slate-700/80 backdrop-blur-sm">
              {game.category}
            </span>

            {/* Cache Status Badge */}
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border backdrop-blur-md ${currentStatus.badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dotClass}`} />
              <span className="font-bold">{currentStatus.label}</span>
            </div>
          </div>

          {/* Playable Canvas Engine Badge */}
          {game.playable && (
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono backdrop-blur-sm">
              <Gamepad2 className="w-3 h-3" />
              <span>Interactive HTML5</span>
            </div>
          )}

          {/* Bundle Size */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/80 text-slate-400 text-[10px] font-mono backdrop-blur-sm border border-slate-800">
            <HardDrive className="w-2.5 h-2.5" />
            <span>{game.bundle_size_mb} MB</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-heading font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
              {game.title}
            </h3>
            <button
              onClick={() => onInspect(game.id)}
              className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Inspect
            </button>
          </div>
          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
            {game.subtitle}
          </p>
        </div>

        {/* Estimated Load Time Telemetry */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-mono">Est. Launch:</span>
          </div>
          <div className="flex items-center gap-2">
            {game.cache_status !== 'Cold' && (
              <span className="text-[11px] line-through text-slate-400 font-mono">
                {game.cold_load_sec}s
              </span>
            )}
            <span className={`text-xs font-mono font-bold ${currentStatus.loadColor}`}>
              {displayLoadTime}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-12 gap-2">
        {/* Main "Play Now" button */}
        <button
          onClick={() => onPlay(game.id)}
          className="col-span-8 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Play Now</span>
        </button>

        {/* QR Code Instant Launch Modal trigger */}
        <button
          onClick={() => onOpenQr(game)}
          title="Scan & Play on Phone"
          className="col-span-2 flex items-center justify-center py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
        >
          <QrCode className="w-4 h-4" />
        </button>

        {/* Quick Prefetch Trigger */}
        <button
          onClick={() => triggerQuickPrefetch(game.id)}
          title="Prefetch into Cache"
          disabled={game.cache_status === 'Cached'}
          className={`col-span-2 flex items-center justify-center py-2.5 rounded-xl border transition-all ${
            game.cache_status === 'Cached'
              ? 'bg-slate-800/50 text-slate-400 border-slate-800 cursor-not-allowed'
              : 'bg-slate-800 hover:bg-cyan-950 text-cyan-400 border-slate-700 hover:border-cyan-500/50'
          }`}
        >
          <Zap className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
