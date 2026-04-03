// backend/routes/payouts.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const { runCompensationEngine } = require("../services/compensationEngine");

// GET /api/payouts/:rider_id
router.get("/:rider_id", async (req, res) => {
  const { data, error } = await supabase
    .from("payouts")
    .select("*")
    .eq("rider_id", req.params.rider_id)
    .order("date", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST /api/payouts/run-engine  ← demo trigger button calls this
router.post("/run-engine", async (req, res) => {
  const result = await runCompensationEngine();
  res.json(result);
});

module.exports = router;
