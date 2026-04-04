import { useState, useEffect } from "react";
import { getPayouts, runCompensationEngine, simulateDisruption } from "../api";

const S = {
  page: { maxWidth: 1200, margin: "0 auto", padding: "2.5rem" },
  header: { marginBottom: "2.5rem" },
  h1: { fontFamily: "'Fraunces', serif", fontSize: "1.9rem", fontWeight: 700 },
  sub: { color: "#8a8899", fontSize: ".92rem", marginTop: ".3rem" },

  statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 },
  statCard: {
    background: "#1c1c27", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14, padding: "1.4rem 1.6rem",
  },
  statLabel: { fontSize: ".78rem", color: "#8a8899", marginBottom: ".4rem" },
  statVal: { fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 700 },

  engineCard: {
    background: "#1c1c27", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: "1.8rem", marginBottom: 16,
  },
  engineTitle: { fontFamily: "'Fraunces', serif", fontSize: "1rem", fontWeight: 700, marginBottom: ".6rem" },
  engineDesc: { fontSize: ".87rem", color: "#8a8899", marginBottom: "1.2rem", lineHeight: 1.6 },
  triggerBtn: (running) => ({
    width: "100%", padding: "10px",
    background: running ? "rgba(255,255,255,.04)" : "rgba(255,92,26,.1)",
    border: running ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(255,92,26,.3)",
    color: running ? "#8a8899" : "#ff5c1a",
    borderRadius: 10, fontFamily: "'Syne', sans-serif", fontWeight: 600,
    fontSize: ".92rem", cursor: running ? "not-allowed" : "pointer", transition: "all .2s",
  }),
  resultBox: {
    marginTop: 12, fontSize: ".83rem",
    background: "rgba(34,197,94,.06)", border: "1px solid rgba(34,197,94,.2)",
    padding: "10px 14px", borderRadius: 8, color: "#22c55e",
  },

  emptyCard: {
    background: "#1c1c27", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: 60, textAlign: "center",
  },

  payoutCard: {
    background: "#1c1c27", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: "1.8rem", marginBottom: 12,
    transition: "border-color .2s",
  },
  payoutHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  payoutAmount: { fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 700 },
  payoutDate: { fontSize: ".82rem", color: "#8a8899", marginTop: 2 },
  statusBadge: {
    background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.2)",
    color: "#22c55e", borderRadius: 100, padding: ".25rem .8rem", fontSize: ".75rem", fontWeight: 500,
  },
  breakdownGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 },
  breakdownCard: {
    background: "#13131a", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 8, padding: "1rem",
  },
  breakdownLabel: { fontSize: ".72rem", color: "#8a8899", marginBottom: ".3rem" },
  breakdownVal: { fontSize: ".95rem", fontWeight: 500 },
  payoutFooter: {
    marginTop: 10, fontSize: ".78rem", color: "#8a8899",
    display: "flex", alignItems: "center", gap: 6,
  },
};

export default function Claims() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [engineResult, setEngineResult] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

  useEffect(() => {
    const riderId = localStorage.getItem("dash_rider_id");
    if (!riderId) return setLoading(false);
    getPayouts(riderId)
      .then((data) => setPayouts(data || []))
      .finally(() => setLoading(false));
  }, []);

  async function triggerEngine() {
    setRunning(true); setEngineResult(null);
    try {
      const result = await runCompensationEngine();
      setEngineResult(result);
      const riderId = localStorage.getItem("dash_rider_id");
      const data = await getPayouts(riderId);
      setPayouts(data || []);
    } catch { setEngineResult({ message: "Engine failed. Check backend." }); }
    setRunning(false);
  }

  async function handleSimulate() {
    setSimulating(true); setSimResult(null);
    try {
      const result = await simulateDisruption();
      setSimResult({
        ok: true,
        zoneScore: result.zoneData?.zone_score,
        flagged: result.zoneData?.flagged,
        payouts: result.engineResult?.payouts?.length ?? 0,
        message: result.engineResult?.message,
      });
      // Refresh payouts after simulation
      const riderId = localStorage.getItem("dash_rider_id");
      if (riderId) {
        const data = await getPayouts(riderId);
        setPayouts(data || []);
      }
    } catch (e) {
      setSimResult({ ok: false, message: "Simulation failed — is the backend running?" });
    }
    setSimulating(false);
  }

  const totalEarned = payouts.reduce((sum, p) => sum + (p.total || 0), 0);

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.h1}>Claims</h1>
        <p style={S.sub}>Zero-touch payouts — automatically triggered, no forms needed</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <div style={S.statLabel}>Total payouts</div>
          <div style={S.statVal}>₹{totalEarned.toFixed(0)}</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statLabel}>Events covered</div>
          <div style={S.statVal}>{payouts.length}</div>
        </div>
      </div>

      <div style={S.engineCard}>
        <div style={S.engineTitle}>Compensation engine</div>
        <div style={S.engineDesc}>
          Runs automatically at midnight. Scans flagged zones, matches active riders, calculates payouts.
          Trigger manually below for demo.
        </div>
        <button style={S.triggerBtn(running)} onClick={triggerEngine} disabled={running}>
          {running ? "Running engine..." : "⚡ Trigger compensation engine"}
        </button>
        {engineResult && (
          <div style={S.resultBox}>
            {engineResult.message}
            {engineResult.payouts?.length > 0 && <div style={{ marginTop: 6 }}>{engineResult.payouts.length} payout(s) processed</div>}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "1.4rem 0" }} />

        {/* Simulate disruption */}
        <div style={{ fontSize: ".87rem", color: "#8a8899", marginBottom: "1rem", lineHeight: 1.6 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#ffaa00", fontSize: ".82rem", letterSpacing: ".04em" }}>🎬 DEMO</span>
          {"  "}Simulate a real disruption in pincode <code style={{ background: "rgba(255,255,255,.07)", padding: ".1rem .4rem", borderRadius: 4, fontSize: ".82rem" }}>400051</code> (Mumbai). This will flag the zone, run the compensation engine, and generate a payout for any registered rider in that zone.
        </div>
        <button
          onClick={handleSimulate}
          disabled={simulating}
          style={{
            width: "100%", padding: "10px",
            background: simulating ? "rgba(255,255,255,.04)" : "rgba(255,170,0,.1)",
            border: simulating ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(255,170,0,.35)",
            color: simulating ? "#8a8899" : "#ffaa00",
            borderRadius: 10, fontFamily: "'Syne', sans-serif", fontWeight: 600,
            fontSize: ".92rem", cursor: simulating ? "not-allowed" : "pointer", transition: "all .2s",
          }}
        >
          {simulating ? "Simulating disruption..." : "🌧️ Simulate disruption — pincode 400051"}
        </button>
        {simResult && (
          <div style={{
            marginTop: 12, fontSize: ".83rem",
            background: simResult.ok ? "rgba(255,170,0,.06)" : "rgba(239,68,68,.06)",
            border: simResult.ok ? "1px solid rgba(255,170,0,.2)" : "1px solid rgba(239,68,68,.2)",
            padding: "12px 14px", borderRadius: 8,
            color: simResult.ok ? "#ffaa00" : "#ef4444",
          }}>
            {simResult.ok ? (
              <>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>✅ Disruption simulated successfully</div>
                <div>Zone score: <strong>{simResult.zoneScore}</strong> · Flagged: <strong>{simResult.flagged ? "Yes" : "No"}</strong></div>
                <div style={{ marginTop: 4 }}>{simResult.message} · {simResult.payouts} payout(s) processed</div>
              </>
            ) : (
              <div>{simResult.message}</div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#8a8899" }}>Loading payouts...</div>
      ) : payouts.length === 0 ? (
        <div style={S.emptyCard}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🟢</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>No disruptions yet</div>
          <div style={{ fontSize: ".87rem", color: "#8a8899" }}>When your zone is flagged and you're active, payouts appear here automatically</div>
        </div>
      ) : (
        <div>
          {payouts.map((p) => (
            <div key={p.id} style={S.payoutCard}>
              <div style={S.payoutHeader}>
                <div>
                  <div style={S.payoutAmount}>₹{p.total?.toFixed(0)}</div>
                  <div style={S.payoutDate}>{p.date}</div>
                </div>
                <span style={S.statusBadge}>{p.status}</span>
              </div>
              <div style={S.breakdownGrid}>
                {[
                  { label: "Valid flags", value: p.valid_flags },
                  { label: "Compensation", value: `₹${p.compensation?.toFixed(0)}` },
                  { label: "Conditions bonus", value: `₹${p.bonus?.toFixed(0)}` },
                ].map(({ label, value }) => (
                  <div key={label} style={S.breakdownCard}>
                    <div style={S.breakdownLabel}>{label}</div>
                    <div style={S.breakdownVal}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={S.payoutFooter}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                Auto-triggered · No claim filed · Credited to UPI
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}