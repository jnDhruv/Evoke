def get_zone_score(weather_score: float, traffic_score: float, social_score: float) -> dict:
    dominant = max(weather_score, traffic_score, social_score)
    factors = { weather_score: "weather", traffic_score: "traffic", social_score: "social" }
    return {
        "zone_score": round(dominant, 2),
        "flagged": dominant >= 0.7,
        "dominant_factor": factors[dominant]
    }