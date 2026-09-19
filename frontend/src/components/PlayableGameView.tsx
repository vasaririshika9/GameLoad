import React, { useRef, useEffect, useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, ArrowLeft, Zap, Shield, Trophy, Activity } from 'lucide-react';
import { Game } from '../types';
import { CyberSprintGame } from '../games/CyberSprint';
import { NeonStrikerGame } from '../games/NeonStriker';
import { StarVoidGame } from '../games/StarVoid';

interface PlayableGameViewProps {
  game: Game;
  isOptimized: boolean;
  actualLoadMs: number;
  perceivedLoadMs: number;
  onExit: () => void;
  onToggleOptimization: () => void;
}

export const PlayableGameView: React.FC<PlayableGameViewProps> = ({
  game,
  isOptimized,
  actualLoadMs,
  perceivedLoadMs,
  onExit,
  onToggleOptimization
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameInstanceRef = useRef<any>(null);

  const [score, setScore] = useState(0);
  const [extraMetric, setExtraMetric] = useState(0); // speed, streak, or shield
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set high DPI canvas resolution
    canvas.width = 800;
    canvas.height = 480;

    let engine: any;

    if (game.id === 'cyber-sprint-x') {
      engine = new CyberSprintGame(canvas);
      engine.onScoreUpdate = (s: number, spd: number) => {
        setScore(s);
        setExtraMetric(spd);
      };
      engine.start();
    } else if (game.id === 'neon-striker-pro') {
      engine = new NeonStrikerGame(canvas);
      engine.onScoreUpdate = (s: number, strk: number) => {
        setScore(s);
        setExtraMetric(strk);
      };
      engine.start();
    } else {
      // StarVoid or fallback arcade
      engine = new StarVoidGame(canvas);
      engine.onScoreUpdate = (s: number, sh: number) => {
        setScore(s);
        setExtraMetric(sh);
      };
      engine.start();
    }

    gameInstanceRef.current = engine;

    // FPS loop
    let lastFpsTime = performance.now();
    let frameCount = 0;
    let fpsAnimId: number;

    const measureFps = (now: number) => {
      frameCount++;
      if (now - lastFpsTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastFpsTime = now;
      }
      fpsAnimId = requestAnimationFrame(measureFps);
    };
    fpsAnimId = requestAnimationFrame(measureFps);

    return () => {
      cancelAnimationFrame(fpsAnimId);
      if (engine) engine.destroy();
    };
  }, [game.id]);

  const restartGame = () => {
    if (gameInstanceRef.current) {
      gameInstanceRef.current.start();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-300">
      {/* Top Benchmark & Optimization Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Lobby</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="font-heading font-bold text-white text-base">
                {game.title}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Playable WebAssembly Engine
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry Chips */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] mr-1.5">Actual:</span>
            <span className={isOptimized ? 'text-cyan-400 font-bold' : 'text-rose-400 font-bold'}>
              {(actualLoadMs / 1000).toFixed(2)}s
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] mr-1.5">Perceived:</span>
            <span className="text-emerald-400 font-bold">
              {(perceivedLoadMs / 1000).toFixed(2)}s
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] mr-1.5">FPS:</span>
            <span className="text-cyan-300 font-bold">{fps}</span>
          </div>

          {/* Toggle Simulator Mode */}
          <button
            onClick={onToggleOptimization}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold border transition-all ${
              isOptimized
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 hover:bg-cyan-900'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/50 hover:bg-amber-900'
            }`}
          >
            {isOptimized ? '⚡ GameLoad AI: ON' : '⚠️ Cold Load: Baseline'}
          </button>
        </div>
      </div>

      {/* Main Canvas Gaming Screen */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-950/80">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair select-none"
        />

        {/* In-Game HUD Overlays */}
        <div className="absolute top-4 left-4 flex items-center gap-3 pointer-events-none">
          {/* Score */}
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/40 backdrop-blur-md flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <div className="font-mono">
              <span className="text-[10px] text-slate-400 block leading-none">SCORE</span>
              <span className="text-lg font-bold text-white leading-none">{score}</span>
            </div>
          </div>

          {/* Specific Metric (Speed / Streak / Shield) */}
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-purple-500/40 backdrop-blur-md flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <div className="font-mono">
              <span className="text-[10px] text-slate-400 block leading-none">
                {game.id === 'cyber-sprint-x' ? 'SPEED' : game.id === 'neon-striker-pro' ? 'STREAK' : 'SHIELD'}
              </span>
              <span className="text-lg font-bold text-purple-300 leading-none">
                {extraMetric} {game.id === 'cyber-sprint-x' ? 'km/h' : game.id === 'starvoid-arcade' ? '%' : 'x'}
              </span>
            </div>
          </div>
        </div>

        {/* Restart Button */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={restartGame}
            title="Restart Game"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white backdrop-blur-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Touch / Mobile Controls HUD */}
        {game.id === 'cyber-sprint-x' && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <button
              onClick={() => gameInstanceRef.current?.moveLeft()}
              className="pointer-events-auto px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-mono text-sm active:scale-95 transition-transform backdrop-blur-md"
            >
              ◄ Steer Left (A)
            </button>
            <span className="text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800 backdrop-blur-sm hidden sm:block">
              Use Left/Right Arrows or A/D to steer • Collect Cyan Orbs
            </span>
            <button
              onClick={() => gameInstanceRef.current?.moveRight()}
              className="pointer-events-auto px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-mono text-sm active:scale-95 transition-transform backdrop-blur-md"
            >
              Steer Right (D) ►
            </button>
          </div>
        )}

        {game.id === 'neon-striker-pro' && (
          <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
            <span className="text-xs font-mono text-emerald-300 bg-slate-950/80 px-4 py-1.5 rounded-xl border border-emerald-500/30 backdrop-blur-sm">
              Click anywhere on goal area to shoot ball past the orange robotic barrier!
            </span>
          </div>
        )}

        {game.id === 'starvoid-arcade' && (
          <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
            <span className="text-xs font-mono text-purple-300 bg-slate-950/80 px-4 py-1.5 rounded-xl border border-purple-500/30 backdrop-blur-sm">
              Move cursor/touch to steer • Click or Space to fire dual plasma lasers
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
