from fastapi import FastAPI
from pydantic import BaseModel
from nlp.social_disruption import get_social_score
from pricing.premium_model import calculate_premium
from scoring.zone_index import get_zone_score

app = FastAPI(title="DASH AI Models", version="1.0.0")

class ZoneRequest(BaseModel):
    weather_score: float
    traffic_score: float
    social_score: float

class PremiumRequest(BaseModel):
    zone_score: float
    city: str

class SocialRequest(BaseModel):
    headlines: list[str]

@app.get("/health")
def health():
    return {"status": "DASH models running"}

@app.post("/zone-score")
def zone_score(req: ZoneRequest):
    return get_zone_score(req.weather_score, req.traffic_score, req.social_score)

@app.post("/premium")
def premium(req: PremiumRequest):
    return calculate_premium(req.zone_score, req.city)

@app.post("/social-score")
def social_score(req: SocialRequest):
    return get_social_score(req.headlines)