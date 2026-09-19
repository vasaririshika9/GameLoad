import sys
import os

# Add parent directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.algorithms.dijkstra import NetworkGraph
from backend.algorithms.knapsack import KnapsackPrefetchOptimizer
from backend.algorithms.prediction import GamePredictionEngine
from backend.algorithms.cache_manager import CacheManager
from backend.data.games_db import GAMES_DATABASE

def test_dijkstra():
    print("--- Testing Dijkstra ---")
    g = NetworkGraph(network_mode="fast")
    res = g.run_dijkstra("User", "Origin-Primary")
    print(f"Path: {' -> '.join(res['optimal_path'])}")
    print(f"Total Latency: {res['total_latency_ms']} ms")
    assert len(res["optimal_path"]) >= 3
    assert res["optimal_path"][0] == "User"
    assert res["optimal_path"][-1] == "Origin-Primary"
    print("[PASS] Dijkstra test passed!")

def test_knapsack():
    print("\n--- Testing 0/1 Knapsack ---")
    opt = KnapsackPrefetchOptimizer(cache_capacity_mb=500)
    candidates = [
        {"id": "A", "name": "Game A", "size_mb": 120, "probability": 0.90, "importance": 2.0},
        {"id": "B", "name": "Game B", "size_mb": 200, "probability": 0.70, "importance": 1.5},
        {"id": "C", "name": "Game C", "size_mb": 80,  "probability": 0.40, "importance": 1.5},
        {"id": "D", "name": "Game D", "size_mb": 250, "probability": 0.30, "importance": 1.2},
    ]
    res = opt.optimize(candidates)
    print(f"Capacity: {res['capacity_mb']} MB")
    print(f"Selected Count: {res['selected_count']}, Total Size: {res['total_size_mb']} MB")
    print("Selected:", [x["name"] for x in res["selected_assets"]])
    print("Skipped:", [x["name"] for x in res["skipped_assets"]])
    assert res["total_size_mb"] <= 500
    assert len(res["selected_assets"]) >= 1
    print("[PASS] Knapsack test passed!")

def test_prediction():
    print("\n--- Testing AI Game Prediction ---")
    engine = GamePredictionEngine()
    pred = engine.predict_next_game(GAMES_DATABASE, user_profile="racing_enthusiast")
    print(f"Top Prediction: {pred['top_predicted_title']} ({pred['top_confidence_pct']}%)")
    print(f"Headline: {pred['display_headline']}")
    assert pred["top_confidence_pct"] > 0
    assert len(pred["ranked_predictions"]) == len(GAMES_DATABASE)
    print("[PASS] Prediction test passed!")

def test_cache():
    print("\n--- Testing Cache Manager ---")
    cm = CacheManager(capacity_mb=500)
    cm.prefetch_assets("cyber-sprint-x", size_mb=135)
    assert cm.get_game_status("cyber-sprint-x") == "Prefetched"
    cm.cache_assets("cyber-sprint-x", size_mb=135)
    assert cm.get_game_status("cyber-sprint-x") == "Cached"
    launch = cm.record_launch("cyber-sprint-x")
    assert launch["cache_hit"] is True
    print("[PASS] Cache Manager test passed!")

if __name__ == "__main__":
    test_dijkstra()
    test_knapsack()
    test_prediction()
    test_cache()
    print("\n>>> ALL BACKEND ALGORITHM TESTS PASSED SUCCESSFULLY! <<<")
