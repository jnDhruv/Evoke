SEVERITY_HIGH = ["curfew", "bandh", "riot", "flood"]
SEVERITY_MED  = ["strike", "protest", "shutdown", "waterlogging"]
SEVERITY_LOW  = ["blocked", "closed", "disruption", "cancelled"]

def get_social_score(headlines: list[str]) -> dict:
    score = 0.0
    matched = []

    for headline in headlines:
        h = headline.lower()
        for kw in SEVERITY_HIGH:
            if kw in h:
                score = max(score, 0.85)
                matched.append(kw)
        for kw in SEVERITY_MED:
            if kw in h:
                score = max(score, 0.55)
                matched.append(kw)
        for kw in SEVERITY_LOW:
            if kw in h:
                score = max(score, 0.35)
                matched.append(kw)

    return {"score": round(score, 2), "matched_keywords": list(set(matched))}