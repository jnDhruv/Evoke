// backend/routes/zones.js
const express = require("express");
const router = express.Router();
const { getWeatherScore } = require("../services/weatherService");
const { getTrafficScore } = require("../services/trafficService");
const { getSocialScore } = require("../services/rssService");
const supabase = require("../supabaseClient");

// GET /api/zones/score/:pincode
router.get("/score/:pincode", async (req, res) => {
  const { pincode } = req.params;

  const [weather, social] = await Promise.all([
    getWeatherScore(pincode),
    getSocialScore(pincode),
  ]);

  const traffic = getTrafficScore(weather.score);
  const zoneScore = Math.max(weather.score, traffic, social.score);
  const flagged = zoneScore >= 0.7;

  const dominantFactor =
    zoneScore === weather.score
      ? "weather"
      : zoneScore === traffic
        ? "traffic"
        : "social";

  // Save flag to DB
  await supabase.from("zone_flags").insert({
    pincode,
    weather_score: weather.score,
    traffic_score: traffic,
    social_score: social.score,
    zone_score: zoneScore,
    flagged,
    dominant_factor: dominantFactor,
  });

  res.json({
    pincode,
    zone_score: parseFloat(zoneScore.toFixed(2)),
    flagged,
    dominant_factor: dominantFactor,
    breakdown: {
      weather: weather.score,
      traffic,
      social: social.score,
    },
    weather_raw: weather.raw,
    social_keywords: social.matchedKeywords,
  });
});

module.exports = router;
