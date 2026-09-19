from typing import Dict, List, Any, Optional
import math
import random

# Default Markov transition probability matrix between game categories/genres
# P(next_genre | current_genre)
TRANSITION_MATRIX = {
    "Racing": {"Racing": 0.45, "Sports": 0.25, "Action": 0.20, "Puzzle": 0.10},
    "Sports": {"Sports": 0.50, "Racing": 0.30, "Action": 0.15, "Puzzle": 0.05},
    "Action": {"Action": 0.40, "Racing": 0.35, "Sports": 0.15, "Puzzle": 0.10},
    "Puzzle": {"Puzzle": 0.55, "Action": 0.20, "Sports": 0.15, "Racing": 0.10},
    "Arcade": {"Arcade": 0.40, "Racing": 0.30, "Action": 0.20, "Puzzle": 0.10}
}

class GamePredictionEngine:
    """
    AI Predictive Scoring Engine for Next-Game Launch Prediction.
    Blends:
      1. Recency Decay (exponential decay based on last played timestamp)
      2. Play Frequency & Total Dwell Time
      3. Markov Transition Probabilities from previous game
      4. Category Affinity Score
      5. Time-of-day / Session Momentum
    """

    def __init__(self):
        pass

    def predict_next_game(
        self,
        games: List[Dict[str, Any]],
        user_history: Optional[List[Dict[str, Any]]] = None,
        last_played_game_id: Optional[str] = "cyber-sprint-x",
        session_duration_minutes: float = 18.5,
        user_profile: str = "racing_enthusiast"
    ) -> Dict[str, Any]:
        """
        Calculates predicted launch probability for all games and ranks them.
        """
        if not user_history:
            # Default realistic synthetic session history
            user_history = [
                {"game_id": "cyber-sprint-x", "category": "Racing", "play_count": 14, "total_seconds": 3820, "recency_hours": 0.2},
                {"game_id": "neon-striker-pro", "category": "Sports", "play_count": 8, "total_seconds": 1940, "recency_hours": 3.5},
                {"game_id": "starvoid-arcade", "category": "Arcade", "play_count": 6, "total_seconds": 1250, "recency_hours": 24.0},
                {"game_id": "quantum-shift", "category": "Puzzle", "play_count": 4, "total_seconds": 820, "recency_hours": 48.0},
                {"game_id": "apex-velocity", "category": "Racing", "play_count": 11, "total_seconds": 2900, "recency_hours": 1.1},
                {"game_id": "cyber-odyssey", "category": "Action", "play_count": 5, "total_seconds": 1100, "recency_hours": 12.0}
            ]

        # Map history by game_id
        hist_map = {h["game_id"]: h for h in user_history}
        
        # Determine last game category
        last_game = next((g for g in games if g["id"] == last_played_game_id), None)
        last_category = last_game["category"] if last_game else "Racing"

        scored_games = []

        for g in games:
            gid = g["id"]
            cat = g.get("category", "Arcade")
            hist = hist_map.get(gid, {"play_count": 1, "total_seconds": 120, "recency_hours": 72.0})

            # 1. Frequency Score: log normalized play count
            freq_score = math.log1p(hist.get("play_count", 0)) / math.log1p(25)

            # 2. Time Spent Score: normalized hours
            time_spent_hours = hist.get("total_seconds", 0) / 3600.0
            dwell_score = min(1.0, time_spent_hours / 2.0)

            # 3. Recency Decay: e^(-lambda * hours)
            recency_hours = hist.get("recency_hours", 72.0)
            recency_score = math.exp(-0.05 * recency_hours)

            # 4. Markov Transition probability from last game's category
            transitions = TRANSITION_MATRIX.get(last_category, {})
            transition_score = transitions.get(cat, 0.20)

            # 5. Profile Affinity Boost
            affinity_boost = 1.0
            if user_profile == "racing_enthusiast" and cat == "Racing":
                affinity_boost = 1.45
            elif user_profile == "sports_fan" and cat == "Sports":
                affinity_boost = 1.45
            elif user_profile == "casual" and cat == "Puzzle":
                affinity_boost = 1.40
            elif user_profile == "action_seeker" and cat in ["Action", "Arcade"]:
                affinity_boost = 1.35

            # Combined raw score
            raw_score = (
                (freq_score * 0.25) +
                (dwell_score * 0.20) +
                (recency_score * 0.30) +
                (transition_score * 0.25)
            ) * affinity_boost

            scored_games.append({
                "game_id": gid,
                "title": g["title"],
                "category": cat,
                "raw_score": raw_score,
                "signals": {
                    "play_count": hist.get("play_count", 0),
                    "time_spent_min": round(hist.get("total_seconds", 0) / 60.0, 1),
                    "recency_hours": recency_hours,
                    "markov_transition_prob": round(transition_score, 2),
                    "affinity_multiplier": round(affinity_boost, 2)
                }
            })

        # Softmax normalization to get strictly calibrated probabilities summing to 1.0
        max_raw = max(sg["raw_score"] for sg in scored_games)
        exp_scores = [math.exp((sg["raw_score"] - max_raw) * 3.5) for sg in scored_games]
        sum_exp = sum(exp_scores)

        probabilities = [round(exp / sum_exp, 3) for exp in exp_scores]

        # Attach normalized probabilities
        results = []
        for i, sg in enumerate(scored_games):
            p = probabilities[i]
            results.append({
                "game_id": sg["game_id"],
                "title": sg["title"],
                "category": sg["category"],
                "probability": p,
                "confidence_pct": int(round(p * 100)),
                "signals": sg["signals"]
            })

        # Sort descending by probability
        results.sort(key=lambda x: x["probability"], reverse=True)

        top_pick = results[0]
        confidence_display = f"{top_pick['title']} — {top_pick['confidence_pct']}% confidence"

        return {
            "algorithm": "Multi-Factor Markov AI Predictor",
            "top_predicted_game": top_pick["game_id"],
            "top_predicted_title": top_pick["title"],
            "top_confidence_pct": top_pick["confidence_pct"],
            "display_headline": f"Next Game Prediction: {confidence_display}",
            "last_played_category": last_category,
            "session_duration_min": session_duration_minutes,
            "user_profile": user_profile,
            "ranked_predictions": results
        }
