import {
  Game,
  DijkstraResult,
  KnapsackResult,
  PredictionResult,
  SimulationResult,
  AnalyticsData,
  QrResponse,
  NetworkMode
} from '../types';

import axios from 'axios';

// Primary backend URL: Uses environment variable if set, otherwise defaults to deployed Render backend
export const BACKEND_URL = (
  import.meta.env.VITE_API_URL || 'https://gameload-1.onrender.com'
).replace(/\/$/, '');

export const API_BASE = `${BACKEND_URL}/api`;

// Configured Axios instance targeting https://gameload-1.onrender.com/api
export const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});
export const apiClient = axiosInstance;

/**
 * Returns the appropriate WebSocket URL (wss:// or ws://) matching the backend URL.
 */
export function getWebSocketUrl(path: string = '/ws/orchestrator'): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (BACKEND_URL.startsWith('http://') || BACKEND_URL.startsWith('https://')) {
    const url = new URL(BACKEND_URL);
    const wsProto = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${wsProto}//${url.host}${cleanPath}`;
  }
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${window.location.host}${cleanPath}`;
}

export const api = {
  async getGames(): Promise<Game[]> {
    try {
      const res = await fetch(`${API_BASE}/games`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, utilizing cached emergency fallback:', err);
      // Fallback data ensures zero crash
      return [
        {
          id: 'cyber-sprint-x',
          title: 'Cyber Sprint X',
          subtitle: 'High-octane neon synthwave highway racing',
          category: 'Racing',
          rating: 4.9,
          playable: true,
          playable_engine: 'cyber_sprint',
          bundle_size_mb: 135,
          uncompressed_size_mb: 420,
          cold_load_sec: 6.8,
          optimized_load_ms: 460,
          thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
          theme_color: '#00f3ff',
          gradient: 'from-cyan-500 to-blue-600',
          description: 'Certified third-party WebAssembly 3D neon racing bundle.',
          assets: [
            { id: 'csx_engine', name: 'WASM Engine Core', type: 'wasm', size_mb: 42, importance: 3.0, required: true },
            { id: 'csx_textures', name: 'Neon Textures', type: 'textures', size_mb: 45, importance: 2.5, required: true }
          ],
          cache_status: 'Cached',
          current_estimated_load_ms: 280
        }
      ];
    }
  },

  async getGameDetail(id: string): Promise<Game> {
    const res = await fetch(`${API_BASE}/games/${id}`);
    if (!res.ok) throw new Error('Game not found');
    return res.json();
  },

  async predictNextGame(params?: {
    last_played_game_id?: string;
    user_profile?: string;
    session_duration_minutes?: number;
  }): Promise<PredictionResult> {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {}),
    });
    if (!res.ok) throw new Error('Failed to predict next game');
    return res.json();
  },

  async getOptimalRoute(params?: {
    network_mode?: NetworkMode;
    start_node?: string;
    target_node?: string;
    custom_loads?: Record<string, number>;
  }): Promise<DijkstraResult> {
    const res = await fetch(`${API_BASE}/optimal-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {}),
    });
    if (!res.ok) throw new Error('Failed to compute optimal route');
    return res.json();
  },

  async optimizeCache(params?: {
    cache_capacity_mb?: number;
    user_profile?: string;
    last_played_game_id?: string;
  }): Promise<KnapsackResult> {
    const res = await fetch(`${API_BASE}/optimize-cache`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {}),
    });
    if (!res.ok) throw new Error('Failed to run knapsack optimizer');
    return res.json();
  },

  async prefetchGames(params?: {
    game_ids?: string[];
    network_mode?: NetworkMode;
  }): Promise<{ status: string; prefetched_games: any[]; cache_telemetry: any }> {
    const res = await fetch(`${API_BASE}/prefetch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {}),
    });
    if (!res.ok) throw new Error('Failed to prefetch games');
    return res.json();
  },

  async simulateLoad(params: {
    game_id: string;
    is_optimized: boolean;
    network_mode?: NetworkMode;
  }): Promise<SimulationResult> {
    const res = await fetch(`${API_BASE}/simulate-load`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to simulate load');
    return res.json();
  },

  async getAnalytics(): Promise<AnalyticsData> {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  async generateQr(game_id: string, custom_url?: string): Promise<QrResponse> {
    const res = await fetch(`${API_BASE}/generate-qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_id, custom_url }),
    });
    if (!res.ok) throw new Error('Failed to generate QR code');
    return res.json();
  },

  async resolveLaunch(game_id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/launch/${game_id}`);
    if (!res.ok) throw new Error('Failed to resolve game launch');
    return res.json();
  },

  async runFullPipeline(params?: {
    cache_capacity_mb?: number;
    user_profile?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/run-optimization-pipeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {}),
    });
    if (!res.ok) throw new Error('Failed to run pipeline');
    return res.json();
  }
};
