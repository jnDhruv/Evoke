// backend/services/compensationEngine.js
const supabase = require("../supabaseClient");

function calculateBonus(zoneScore, deliveryCount) {
  if (zoneScore >= 0.85) return deliveryCount * 30;
  if (zoneScore >= 0.7) return deliveryCount * 20;
  if (zoneScore >= 0.5) return deliveryCount * 10;
  return 0;
}

async function runCompensationEngine() {
  const today = new Date().toISOString().split("T")[0];

  // Step 1 — get all flagged zones today
  const { data: flags } = await supabase
    .from("zone_flags")
    .select("*")
    .eq("flagged", true)
    .gte("flagged_at", `${today}T00:00:00`);

  if (!flags || flags.length === 0) {
    return { message: "No flagged zones today", payouts: [] };
  }

  const flaggedPincodes = [...new Set(flags.map((f) => f.pincode))];

  // Step 2 — get riders in those zones
  const { data: riders } = await supabase
    .from("riders")
    .select("*")
    .in("pincode", flaggedPincodes)
    .eq("is_active", true);

  if (!riders || riders.length === 0) {
    return { message: "No active riders in flagged zones", payouts: [] };
  }

  const results = [];

  for (const rider of riders) {
    // Step 3 — count valid flags for this rider's pincode
    const riderFlags = flags.filter((f) => f.pincode === rider.pincode);
    const validFlags = riderFlags.length;

    // Step 4 — calculate compensation
    const compensation = validFlags * (rider.avg_hourly_earning / 4);

    // Step 5 — bonus (mock 3 deliveries during disruption)
    const avgZoneScore =
      riderFlags.reduce((a, b) => a + b.zone_score, 0) / riderFlags.length;
    const bonus = calculateBonus(avgZoneScore, 3);

    const total = compensation + bonus;

    // Step 6 — insert payout record
    const { data: payout } = await supabase
      .from("payouts")
      .insert({
        rider_id: rider.id,
        date: today,
        valid_flags: validFlags,
        compensation,
        bonus,
        total,
        status: "paid",
      })
      .select()
      .single();

    results.push({ rider: rider.name, pincode: rider.pincode, total, payout });
  }

  return { message: "Compensation engine complete", payouts: results };
}

module.exports = { runCompensationEngine };
