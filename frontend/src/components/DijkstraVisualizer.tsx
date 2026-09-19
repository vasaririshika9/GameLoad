import React, { useState, useEffect } from 'react';
import { Network, Server, ArrowRight, Activity, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import { DijkstraResult } from '../types';
import { api } from '../services/api';
import { useGameLoad } from '../context/GameLoadContext';

interface DijkstraVisualizerProps {
  initialResult?: DijkstraResult;
  targetGameTitle?: string;
}

export const DijkstraVisualizer: React.FC<DijkstraVisualizerProps> = ({
  initialResult,
  targetGameTitle = 'Game Assets'
}) => {
  const { networkMode } = useGameLoad();
  const [result, setResult] = useState<DijkstraResult | null>(initialResult || null);
  const [loading, setLoading] = useState(!initialResult);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const fetchRoute = async () => {
    setLoading(true);
    try {
      const data = await api.getOptimalRoute({
        network_mode: networkMode,
        start_node: 'User',
        target_node: 'Origin-Primary'
      });
      setResult(data);
    } catch (err) {
      console.error('Failed to load Dijkstra route:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, [networkMode]);

  if (loading || !result) {
    return (
      <div className="p-8 flex flex-col items-center justify-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
        <p className="font-mono text-sm">Computing Dijkstra optimal path...</p>
      </div>
    );
  }

  // Node styles map
  const getNodeColor = (type: string, isOptimal: boolean) => {
    if (isOptimal) return '#00f3ff';
    if (type === 'client') return '#38bdf8';
    if (type === 'edge') return '#a855f7';
    if (type === 'cdn') return '#10b981';
    return '#f59e0b';
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-cyan-500/20 p-5 shadow-xl space-y-5">
      {/* Top Banner & Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="font-heading font-bold text-base text-white">
              Optimal Delivery Path (Dijkstra)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              Target: {targetGameTitle}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Dynamic min-heap shortest path based on live network latency & server load
          </p>
        </div>

        {/* Telemetry Stats */}
        <div className="flex items-center gap-4 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400">Total Latency</span>
            <p className="text-base font-bold font-mono text-cyan-400">{result.total_latency_ms} ms</p>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400">Node Hops</span>
            <p className="text-base font-bold font-mono text-slate-200">{result.node_count}</p>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400">Est. Delivery</span>
            <p className="text-base font-bold font-mono text-emerald-400">{result.estimated_delivery_ms} ms</p>
          </div>
        </div>
      </div>

      {/* Path Step-by-Step Flow Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
        <span className="text-xs font-mono text-slate-400 mr-1">Optimal Route:</span>
        {result.optimal_path.map((nodeId, idx) => {
          const isLast = idx === result.optimal_path.length - 1;
          const node = result.nodes[nodeId];
          return (
            <React.Fragment key={nodeId}>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{node?.label || nodeId}</span>
              </div>
              {!isLast && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Interactive SVG Network Graph */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] bg-[#070b14] rounded-xl border border-slate-800/80 overflow-hidden select-none">
        {/* Subtle grid background */}
        <div className="absolute inset-0 cyber-grid-bg opacity-30" />

        <svg className="w-full h-full" viewBox="0 0 1000 480">
          <defs>
            <linearGradient id="optEdgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Draw Edges */}
          {result.edges.map((edge, idx) => {
            const u = result.nodes[edge.source];
            const v = result.nodes[edge.target];
            if (!u || !v) return null;

            const x1 = (u.x / 100) * 940 + 30;
            const y1 = (u.y / 100) * 420 + 30;
            const x2 = (v.x / 100) * 940 + 30;
            const y2 = (v.y / 100) * 420 + 30;

            const isOptimal = edge.is_in_path;

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isOptimal ? '#00f3ff' : 'rgba(100, 116, 139, 0.25)'}
                  strokeWidth={isOptimal ? 3.5 : 1.5}
                  strokeDasharray={isOptimal ? 'none' : '4 4'}
                  filter={isOptimal ? 'url(#glowEffect)' : undefined}
                />
                {/* Edge latency label */}
                <rect
                  x={(x1 + x2) / 2 - 20}
                  y={(y1 + y2) / 2 - 10}
                  width="40"
                  height="18"
                  rx="4"
                  fill="#0b1120"
                  stroke={isOptimal ? '#00f3ff' : '#1e293b'}
                  strokeWidth="1"
                />
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 + 3}
                  textAnchor="middle"
                  fill={isOptimal ? '#00f3ff' : '#64748b'}
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                >
                  {edge.cost}ms
                </text>
              </g>
            );
          })}

          {/* Draw Nodes */}
          {Object.values(result.nodes).map((node) => {
            const x = (node.x / 100) * 940 + 30;
            const y = (node.y / 100) * 420 + 30;
            const isOptimal = result.optimal_path.includes(node.id);
            const isSelected = selectedNode === node.id;
            const color = getNodeColor(node.type, isOptimal);

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className="cursor-pointer group"
              >
                {/* Halo if optimal */}
                {isOptimal && (
                  <circle
                    cx={x}
                    cy={y}
                    r="24"
                    fill="none"
                    stroke="#00f3ff"
                    strokeWidth="1"
                    strokeOpacity="0.4"
                    className="animate-ping"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 18 : 14}
                  fill="#0b1324"
                  stroke={color}
                  strokeWidth={isOptimal ? 3 : 2}
                  filter={isOptimal ? 'url(#glowEffect)' : undefined}
                />

                {/* Inner dot */}
                <circle cx={x} cy={y} r="5" fill={color} />

                {/* Label */}
                <text
                  x={x}
                  y={y + 28}
                  textAnchor="middle"
                  fill={isOptimal ? '#ffffff' : '#94a3b8'}
                  fontSize="11"
                  fontFamily="Chakra Petch"
                  fontWeight={isOptimal ? 'bold' : 'normal'}
                >
                  {node.label.split(' ')[0]}
                </text>

                <text
                  x={x}
                  y={y + 40}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                >
                  {node.region}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Card Overlay */}
        {selectedNode && result.nodes[selectedNode] && (
          <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-cyan-500/40 p-3 rounded-xl shadow-xl backdrop-blur-md max-w-xs text-xs font-mono">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-bold text-cyan-300">
                {result.nodes[selectedNode].label}
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-400 text-[11px]">
              Region: <span className="text-slate-200">{result.nodes[selectedNode].region}</span>
            </p>
            <p className="text-slate-400 text-[11px]">
              Server Load: <span className="text-emerald-400">{result.nodes[selectedNode].load || 25}%</span>
            </p>
            <p className="text-slate-400 text-[11px]">
              Optimal Path Status:{' '}
              <span className={result.optimal_path.includes(selectedNode) ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                {result.optimal_path.includes(selectedNode) ? 'Included in Delivery Route' : 'Bypassed'}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Path Segments Latency Breakdown Table */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
        {result.path_segments.map((seg, i) => (
          <div key={i} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 truncate mr-2">
              {seg.from} → {seg.to}
            </span>
            <span className="text-cyan-400 font-bold">{seg.latency_ms} ms</span>
          </div>
        ))}
      </div>

      {/* Optimization Explanation Card (Requirement 23) */}
      {result.explanation && (
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Optimization Explanation: {result.explanation.title}</span>
          </div>
          <ul className="space-y-1 text-slate-300 pl-5 list-disc marker:text-cyan-400">
            {result.explanation.reasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
