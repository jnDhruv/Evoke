// backend/routes/riders.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

// City multipliers
const CITY_MULTIPLIERS = {
  Mumbai: 2.0,
  Delhi: 2.0,
  Bangalore: 2.0,
  Pune: 1.5,
  Hyderabad: 1.5,
  Chennai: 1.5,
  Lucknow: 1.0,
  Jaipur: 1.0,
  Nagpur: 1.0,
};

// POST /api/riders/register
router.post("/register", async (req, res) => {
  const { name, phone, city, pincode, platform, rider_platform_id, upi_id } =
    req.body;

  // Get zone score to calculate premium
  const zoneRes = await fetch(
    `${req.protocol}://${req.get("host")}/api/zones/score/${pincode}`,
  );
  const zoneData = await zoneRes.json();

  const multiplier = CITY_MULTIPLIERS[city] || 1.0;
  const rawPremium = 70 * zoneData.zone_score * multiplier;
  const weekly_premium = Math.min(Math.max(rawPremium, 70), 200);

  const { data, error } = await supabase
    .from("riders")
    .insert({
      name,
      phone,
      city,
      pincode,
      platform,
      rider_platform_id,
      upi_id,
      weekly_premium: parseFloat(weekly_premium.toFixed(2)),
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ rider: data, weekly_premium: data.weekly_premium });
});

// GET /api/riders/:id
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("riders")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(404).json({ error: "Rider not found" });
  res.json(data);
});

module.exports = router;
