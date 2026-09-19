from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class PredictRequest(BaseModel):
    last_played_game_id: Optional[str] = "cyber-sprint-x"
    session_duration_minutes: Optional[float] = 18.5
    user_profile: Optional[str] = "racing_enthusiast"
    user_history: Optional[List[Dict[str, Any]]] = None

class KnapsackRequest(BaseModel):
    cache_capacity_mb: Optional[int] = 500
    user_profile: Optional[str] = "racing_enthusiast"
    last_played_game_id: Optional[str] = "cyber-sprint-x"

class DijkstraRequest(BaseModel):
    network_mode: Optional[str] = "fast"  # "fast", "medium", "slow"
    start_node: Optional[str] = "User"
    target_node: Optional[str] = "Origin-Primary"
    custom_loads: Optional[Dict[str, float]] = None

class PrefetchRequest(BaseModel):
    game_ids: Optional[List[str]] = None
    network_mode: Optional[str] = "fast"

class SimulateLoadRequest(BaseModel):
    game_id: str
    is_optimized: bool = True
    network_mode: Optional[str] = "fast"

class GenerateQrRequest(BaseModel):
    game_id: str
    custom_url: Optional[str] = None
