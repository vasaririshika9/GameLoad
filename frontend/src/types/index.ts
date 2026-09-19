export type CacheStatus = 'Cold' | 'Prefetched' | 'Cached';
export type NetworkMode = 'fast' | 'medium' | 'slow';

export interface GameAsset {
  id: string;
  name: string;
  type: string;
  size_mb: number;
  importance: number;
  required: boolean;
}

export interface Game {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  rating: number;
  playable: boolean;
  playable_engine?: string;
  bundle_size_mb: number;
  uncompressed_size_mb: number;
  cold_load_sec: number;
  optimized_load_ms: number;
  thumbnail: string;
  theme_color: string;
  gradient: string;
  description: string;
  assets: GameAsset[];
  cache_status: CacheStatus;
  detailed_status?: string;
  current_estimated_load_ms: number;
}

export interface PathSegment {
  from: string;
  to: string;
  from_label: string;
  to_label: string;
  latency_ms: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'client' | 'edge' | 'cdn' | 'origin';
  x: number;
  y: number;
  region: string;
  load?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  cost: number;
  bandwidth_gbps: number;
  is_in_path: boolean;
}

export interface DijkstraResult {
  algorithm: string;
  start_node: string;
  target_node: string;
  optimal_path: string[];
  node_count: number;
  total_latency_ms: number;
  estimated_delivery_ms: number;
  path_segments: PathSegment[];
  steps_evaluated: number;
  nodes: Record<string, GraphNode>;
  edges: GraphEdge[];
  network_mode: NetworkMode;
  explanation?: {
    title: string;
    reasons: string[];
  };
}

export interface KnapsackItem {
  id: string;
  name: string;
  game_id: string;
  category: string;
  size_mb: number;
  probability: number;
  importance: number;
  benefit_score: number;
  estimated_dl_ms: number;
}

export interface KnapsackExplanation {
  game_id: string;
  name: string;
  decision: string;
  reasons: string[];
}

export interface KnapsackResult {
  algorithm: string;
  capacity_mb: number;
  total_size_mb: number;
  remaining_budget_mb: number;
  cache_utilization_pct: number;
  total_benefit_score: number;
  selected_count: number;
  skipped_count: number;
  selected_assets: KnapsackItem[];
  skipped_assets: KnapsackItem[];
  dp_table_summary: {
    item_index: number;
    item_name: string;
    values: { weight_mb: number; max_val: number }[];
  }[];
  explanations?: KnapsackExplanation[];
  prediction_context?: {
    top_predicted: string;
    confidence_pct: number;
    display_headline: string;
  };
}

export interface PredictionItem {
  game_id: string;
  title: string;
  category: string;
  probability: number;
  confidence_pct: number;
  signals: {
    play_count: number;
    time_spent_min: number;
    recency_hours: number;
    markov_transition_prob: number;
    affinity_multiplier: number;
  };
}

export interface PredictionResult {
  algorithm: string;
  model_type?: string;
  top_predicted_game: string;
  top_predicted_title: string;
  top_confidence_pct: number;
  display_headline: string;
  last_played_category: string;
  session_duration_min: number;
  user_profile: string;
  ranked_predictions: PredictionItem[];
}

export interface LoadingPhase {
  time_ms: number;
  phase: string;
  description: string;
  done: boolean;
}

export interface SimulationResult {
  game_id: string;
  title: string;
  is_optimized: boolean;
  actual_load_time_ms: number;
  actual_load_time_sec: number;
  perceived_load_time_ms: number;
  perceived_load_time_sec: number;
  phases: LoadingPhase[];
  speedup_factor: number;
  launch_telemetry: {
    game_id: string;
    status_before_launch: string;
    cache_hit: boolean;
    current_hit_rate: number;
    prefetch_accuracy: number;
    bandwidth_saved_mb: number;
  };
}

export interface AnalyticsData {
  mode: string;
  disclaimer: string;
  kpis: {
    cold_load_p50_sec: number;
    cold_load_p95_sec: number;
    optimized_load_p50_ms: number;
    optimized_load_p95_ms: number;
    avg_load_time_ms: number;
    avg_cold_load_time_sec: number;
    cache_hit_rate_pct: number;
    prefetch_accuracy_pct: number;
    bandwidth_saved_mb: number;
    bandwidth_saved_pct: number;
    launch_to_play_conversion_pct: number;
    games_sampled_per_session: number;
    avg_perceived_load_time_ms: number;
  };
  cache_stats?: any;
  comparison_timeline: {
    metric: string;
    without_opt_ms: number;
    with_gameload_ms: number;
  }[];
  latency_by_network: {
    network: string;
    cold_ms: number;
    gameload_ms: number;
    saving_pct: number;
  }[];
}

export interface QrResponse {
  game_id: string;
  title: string;
  launch_url: string;
  launch_path: string;
  environment?: string;
  is_lan_url?: boolean;
  cache_status: CacheStatus;
  qr_data_url: string;
  instructions: string;
}
