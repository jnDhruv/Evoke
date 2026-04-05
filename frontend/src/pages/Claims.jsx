import { useState, useEffect } from "react";
import { getPayouts, runCompensationEngine, simulateDisruption } from "../api";

const BG = "#f5f4f1";
const SURFACE = "#ffffff";
const BORDER = "rgba(0,0,0,0.09)";
const TEXT = "#111111";
const MUTED = "#52525b";
const ORANGE = "#ff5c1a";
const AMBER = "#c97d00";
const GREEN = "#15803d";
const RED = "#b91c1c";

const NUM = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontWeight: 800,
  letterSpacing: "-0.03em",
  color: TEXT,
};
const LABEL_STYLE = {
  fontSize: ".68rem",
  fontWeight: 700,
  color: MUTED,
  textTransform: "uppercase",
  letterSpacing: ".08em",
  marginBottom: ".35rem",
};
const card = {
  background: SURFACE,
  border: `1px solid ${BORDER}`,
  borderRadius: 16,
  padding: "1.8rem",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
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
    setRunning(true);
    setEngineResult(null);
    try {
      const result = await runCompensationEngine();
      setEngineResult(result);
      const riderId = localStorage.getItem("dash_rider_id");
      const data = await getPayouts(riderId);
      setPayouts(data || []);
    } catch {
      setEngineResult({ message: "Engine failed. Check backend." });
    }
    setRunning(false);
  }

  async function handleSimulate() {
    setSimulating(true);
    setSimResult(null);
    try {
      const result = await simulateDisruption();
      setSimResult({
        ok: true,
        zoneScore: result.zoneData?.zone_score,
        flagged: result.zoneData?.flagged,
        payouts: result.engineResult?.payouts?.length ?? 0,
        message: result.engineResult?.message,
      });
      const riderId = localStorage.getItem("dash_rider_id");
      if (riderId) {
        const data = await getPayouts(riderId);
        setPayouts(data || []);
      }
    } catch {
      setSimResult({
        ok: false,
        message: "Simulation failed — is the backend running?",
      });
    }
    setSimulating(false);
  }

  const totalEarned = payouts.reduce((sum, p) => sum + (p.total || 0), 0);

  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem" }}>
        {/* Header */}
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "1.9rem",
            fontWeight: 700,
            color: TEXT,
            marginBottom: ".3rem",
          }}
        >
          Claims
        </h1>
        <p style={{ color: MUTED, fontSize: ".92rem", marginBottom: "2rem" }}>
          Zero-touch payouts — automatically triggered, no forms needed
        </p>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 16,
          }}
        >
          {[
            { label: "Total payouts", val: `₹${totalEarned.toFixed(0)}` },
            { label: "Events covered", val: `${payouts.length}` },
          ].map(({ label, val }) => (
            <div key={label} style={{ ...card, padding: "1.3rem 1.6rem" }}>
              <div style={LABEL_STYLE}>{label}</div>
              <div style={{ ...NUM, fontSize: "2.2rem", lineHeight: 1.1 }}>
                {val}
              </div>
            </div>
          ))}
        </div>

        {/* Engine + Simulate card */}
        <div style={{ ...card, marginBottom: 16 }}>
          {/* Compensation engine */}
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1rem",
              fontWeight: 700,
              color: TEXT,
              marginBottom: ".6rem",
            }}
          >
            Compensation engine
          </div>
          <div
            style={{
              fontSize: ".86rem",
              color: MUTED,
              marginBottom: "1.2rem",
              lineHeight: 1.65,
            }}
          >
            Runs automatically at midnight. Scans flagged zones, matches active
            riders, calculates payouts. Trigger manually for demo.
          </div>
          <button
            onClick={triggerEngine}
            disabled={running}
            style={{
              width: "100%",
              padding: "11px",
              background: running ? BG : "rgba(255,92,26,.08)",
              border: running
                ? `1px solid ${BORDER}`
                : "1px solid rgba(255,92,26,.3)",
              color: running ? MUTED : ORANGE,
              borderRadius: 10,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: ".9rem",
              cursor: running ? "not-allowed" : "pointer",
              transition: "all .2s",
            }}
          >
            {running ? "Running engine…" : "⚡ Trigger compensation engine"}
          </button>

          {engineResult && (
            <div
              style={{
                marginTop: 12,
                fontSize: ".83rem",
                background: "rgba(21,128,61,.05)",
                border: "1px solid rgba(21,128,61,.2)",
                padding: "10px 14px",
                borderRadius: 8,
                color: GREEN,
                fontWeight: 500,
              }}
            >
              {engineResult.message}
              {engineResult.payouts?.length > 0 && (
                <div style={{ marginTop: 4 }}>
                  {engineResult.payouts.length} payout(s) processed
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: BORDER, margin: "1.4rem 0" }} />

          {/* Simulate disruption */}
          <div
            style={{
              fontSize: ".86rem",
              color: MUTED,
              marginBottom: "1rem",
              lineHeight: 1.65,
            }}
          >
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                color: AMBER,
                fontSize: ".78rem",
                letterSpacing: ".04em",
              }}
            >
              🎬 DEMO
            </span>
            {"  "}Simulate a real disruption in pincode{" "}
            <code
              style={{
                background: BG,
                border: `1px solid ${BORDER}`,
                padding: ".1rem .4rem",
                borderRadius: 4,
                fontSize: ".8rem",
                color: TEXT,
                fontWeight: 600,
              }}
            >
              400051
            </code>{" "}
            (Mumbai). Flags the zone, runs the compensation engine, and
            generates a payout for any registered rider in that zone.
          </div>
          <button
            onClick={handleSimulate}
            disabled={simulating}
            style={{
              width: "100%",
              padding: "11px",
              background: simulating ? BG : "rgba(201,125,0,.07)",
              border: simulating
                ? `1px solid ${BORDER}`
                : "1px solid rgba(201,125,0,.28)",
              color: simulating ? MUTED : AMBER,
              borderRadius: 10,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: ".9rem",
              cursor: simulating ? "not-allowed" : "pointer",
              transition: "all .2s",
            }}
          >
            {simulating
              ? "Simulating disruption…"
              : "🌧️ Simulate disruption — pincode 400051"}
          </button>

          {simResult && (
            <div
              style={{
                marginTop: 12,
                fontSize: ".83rem",
                background: simResult.ok
                  ? "rgba(201,125,0,.05)"
                  : "rgba(185,28,28,.05)",
                border: simResult.ok
                  ? "1px solid rgba(201,125,0,.22)"
                  : "1px solid rgba(185,28,28,.22)",
                padding: "12px 14px",
                borderRadius: 8,
                color: simResult.ok ? AMBER : RED,
                fontWeight: 500,
              }}
            >
              {simResult.ok ? (
                <>
                  <div
                    style={{
                      fontWeight: 700,
                      marginBottom: 4,
                      color: simResult.flagged ? RED : GREEN,
                    }}
                  >
                    ✅ Disruption simulated successfully
                  </div>
                  <div>
                    Zone score:{" "}
                    <strong
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {simResult.zoneScore}
                    </strong>{" "}
                    · Flagged:{" "}
                    <strong>{simResult.flagged ? "Yes" : "No"}</strong>
                  </div>
                  <div style={{ marginTop: 4 }}>
                    {simResult.message} · {simResult.payouts} payout(s)
                    processed
                  </div>
                </>
              ) : (
                <div>{simResult.message}</div>
              )}
            </div>
          )}
        </div>

        {/* Payouts list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: MUTED }}>
            Loading payouts…
          </div>
        ) : payouts.length === 0 ? (
          <div style={{ ...card, textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🟢</div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: TEXT,
                marginBottom: 8,
              }}
            >
              No disruptions yet
            </div>
            <div style={{ fontSize: ".87rem", color: MUTED }}>
              When your zone is flagged and you're active, payouts appear here
              automatically
            </div>
          </div>
        ) : (
          <div>
            {payouts.map((p) => (
              <div key={p.id} style={{ ...card, marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <div style={{ ...NUM, fontSize: "1.6rem", lineHeight: 1 }}>
                      ₹{p.total?.toFixed(0)}
                    </div>
                    <div
                      style={{ fontSize: ".8rem", color: MUTED, marginTop: 3 }}
                    >
                      {p.date}
                    </div>
                  </div>
                  <span
                    style={{
                      background: "rgba(21,128,61,.08)",
                      border: "1px solid rgba(21,128,61,.2)",
                      color: GREEN,
                      borderRadius: 100,
                      padding: ".22rem .8rem",
                      fontSize: ".72rem",
                      fontWeight: 700,
                    }}
                  >
                    {p.status}
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 8,
                  }}
                >
                  {[
                    { label: "Valid flags", value: p.valid_flags },
                    {
                      label: "Compensation",
                      value: `₹${p.compensation?.toFixed(0)}`,
                    },
                    {
                      label: "Conditions bonus",
                      value: `₹${p.bonus?.toFixed(0)}`,
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      style={{
                        background: BG,
                        border: `1px solid ${BORDER}`,
                        borderRadius: 8,
                        padding: ".9rem 1rem",
                      }}
                    >
                      <div style={LABEL_STYLE}>{label}</div>
                      <div style={{ ...NUM, fontSize: "1.1rem" }}>{value}</div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontSize: ".76rem",
                    color: MUTED,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: GREEN,
                      display: "inline-block",
                    }}
                  />
                  Auto-triggered · No claim filed · Credited to UPI
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
