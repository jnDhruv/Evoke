CITY_MULTIPLIERS = {
    "Mumbai": 2.0, "Delhi": 2.0, "Bangalore": 2.0,
    "Pune": 1.5, "Hyderabad": 1.5, "Chennai": 1.5,
    "Lucknow": 1.0, "Jaipur": 1.0, "Nagpur": 1.0,
}

def calculate_premium(zone_score: float, city: str) -> dict:
    base = 70
    multiplier = CITY_MULTIPLIERS.get(city, 1.0)
    raw = base * zone_score * multiplier
    premium = min(max(raw, base), 200)
    return {
        "weekly_premium": round(premium, 2),
        "base_rate": base,
        "zone_score": zone_score,
        "city_multiplier": multiplier,
    }