import React from 'react';
import { Zap, Wifi, Cpu, BarChart2, QrCode, Play, Layers, Sparkles } from 'lucide-react';
import { useGameLoad } from '../context/GameLoadContext';
import { NetworkMode } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const {
    networkMode,
    setNetworkMode,
    userProfile,
    setUserProfile,
    setOpenOptimizationModal
  } = useGameLoad();

  const networkOptions: { id: NetworkMode; label: string; ping: string; color: string }[] = [
    { id: 'fast', label: 'Fast (5G)', ping: '~18ms', color: 'text-emerald-400 border-emerald-500/40' },
    { id: 'medium', label: 'Medium (4G)', ping: '~65ms', color: 'text-amber-400 border-amber-500/40' },
    { id: 'slow', label: 'Slow (3G)', ping: '~210ms', color: 'text-rose-400 border-rose-500/40' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#080c14]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => onSelectTab('lobby')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6 text-slate-950 fill-current animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl font-bold tracking-wider text-white">
                Game<span className="text-cyan-400">Load</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                AI Engine
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Near-Instant Launch Platform
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onSelectTab('lobby')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'lobby'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Games
          </button>

          <button
            onClick={() => onSelectTab('infrastructure')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'infrastructure'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Infrastructure
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'analytics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Analytics
          </button>

          <button
            onClick={() => onSelectTab('scan')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'scan'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Scan & Play
          </button>
        </nav>

        {/* Right Controls: Network Simulator, Profile, Demo Mode Trigger */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Network Simulator Mode (Requirement 22) */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800 text-xs">
            <Wifi className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 text-[11px] font-mono mr-1">Network:</span>
            {networkOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setNetworkMode(opt.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                  networkMode === opt.id
                    ? `bg-slate-800 font-bold border ${opt.color}`
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {opt.label.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* User Profile Affinity Selector */}
          <div className="hidden xl:flex items-center gap-1.5 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800 text-xs">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={userProfile}
              onChange={(e) => setUserProfile(e.target.value)}
              className="bg-transparent text-[11px] font-mono text-cyan-300 focus:outline-none cursor-pointer"
            >
              <option value="racing_enthusiast" className="bg-slate-900">Profile: Speedrunner (Racing)</option>
              <option value="sports_fan" className="bg-slate-900">Profile: Sports Fan</option>
              <option value="action_seeker" className="bg-slate-900">Profile: Action / Arcade</option>
              <option value="casual" className="bg-slate-900">Profile: Casual (Puzzle)</option>
            </select>
          </div>

          {/* 🚀 DEMO MODE MAIN ACTION (Requirement 20) */}
          <button
            onClick={() => setOpenOptimizationModal(true)}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all"
          >
            <span className="text-sm">🚀</span>
            <span>DEMO MODE</span>
          </button>
        </div>
      </div>
    </header>
  );
};
