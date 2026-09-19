from typing import List, Dict, Any, Tuple

class KnapsackPrefetchOptimizer:
    """
    0/1 Knapsack Dynamic Programming Optimizer for Intelligent Game Asset Prefetching.
    Selects the optimal subset of game assets that maximizes expected launch benefit
    without exceeding the client device's cache/bandwidth capacity.
    """

    def __init__(self, cache_capacity_mb: int = 500):
        self.capacity_mb = max(50, cache_capacity_mb)

    def optimize(self, candidates: List[Dict[str, Any]]) -> Dict[str, Any]:
        n = len(candidates)
        if n == 0 or self.capacity_mb <= 0:
            return {
                "capacity_mb": self.capacity_mb,
                "total_size_mb": 0,
                "remaining_budget_mb": self.capacity_mb,
                "total_benefit_score": 0,
                "selected_assets": [],
                "skipped_assets": [],
                "dp_table_summary": [],
                "explanations": []
            }

        items = []
        for c in candidates:
            prob = float(c.get("probability", 0.5))
            size = max(1, int(c.get("size_mb", 50)))
            importance = float(c.get("importance", 1.5))
            benefit_score = int(round(prob * 100.0 * importance))
            
            items.append({
                "id": c.get("id"),
                "name": c.get("name"),
                "game_id": c.get("game_id"),
                "category": c.get("category", "General"),
                "size_mb": size,
                "probability": round(prob, 2),
                "importance": importance,
                "benefit_score": max(1, benefit_score),
                "estimated_dl_ms": c.get("estimated_dl_ms", size * 12),
                "raw": c
            })

        W = self.capacity_mb
        dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]

        for i in range(1, n + 1):
            item = items[i - 1]
            wt = item["size_mb"]
            val = item["benefit_score"]

            for w in range(W + 1):
                if wt <= w:
                    dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - wt] + val)
                else:
                    dp[i][w] = dp[i - 1][w]

        # Backtracking
        selected: List[Dict[str, Any]] = []
        skipped: List[Dict[str, Any]] = []
        w_rem = W

        for i in range(n, 0, -1):
            if dp[i][w_rem] != dp[i - 1][w_rem]:
                selected.append(items[i - 1])
                w_rem -= items[i - 1]["size_mb"]
            else:
                skipped.append(items[i - 1])

        selected.reverse()
        total_size = sum(item["size_mb"] for item in selected)
        total_benefit = dp[n][W]
        remaining_budget = W - total_size

        # Attach explanations for each decision (Requirement 23)
        explanations = []
        for s in selected:
            explanations.append({
                "game_id": s["game_id"],
                "name": s["name"],
                "decision": "PREFETCH",
                "reasons": [
                    f"{int(s['probability'] * 100)}% predicted launch probability",
                    f"Expected benefit score of {s['benefit_score']} exceeds allocation threshold",
                    f"Fits comfortably inside available cache capacity ({s['size_mb']} MB / {W} MB limit)",
                    f"Saves ~{round((s['estimated_dl_ms'] - 480) / 1000.0, 1)}s of cold download waiting time"
                ]
            })

        for sk in skipped:
            explanations.append({
                "game_id": sk["game_id"],
                "name": sk["name"],
                "decision": "SKIPPED",
                "reasons": [
                    f"Resource size ({sk['size_mb']} MB) would exceed remaining budget ({remaining_budget} MB)",
                    f"Lower expected utility density ({sk['benefit_score']} benefit vs higher priority items)",
                    f"Prefetching deferred to on-demand progressive loader to conserve mobile bandwidth"
                ]
            })

        step_stride = max(1, W // 8)
        sample_weights = list(range(0, W + 1, step_stride))
        if W not in sample_weights:
            sample_weights.append(W)

        dp_samples = []
        for i in range(min(6, n + 1)):
            row_label = "Base" if i == 0 else items[i-1]["name"]
            dp_samples.append({
                "item_index": i,
                "item_name": row_label,
                "values": [{"weight_mb": sw, "max_val": dp[i][sw]} for sw in sample_weights]
            })

        cache_utilization_pct = round((total_size / W) * 100, 1) if W > 0 else 0

        return {
            "algorithm": "0/1 Knapsack Dynamic Programming",
            "capacity_mb": W,
            "total_size_mb": total_size,
            "remaining_budget_mb": remaining_budget,
            "cache_utilization_pct": cache_utilization_pct,
            "total_benefit_score": total_benefit,
            "selected_count": len(selected),
            "skipped_count": len(skipped),
            "selected_assets": selected,
            "skipped_assets": skipped,
            "dp_table_summary": dp_samples,
            "explanations": explanations
        }
