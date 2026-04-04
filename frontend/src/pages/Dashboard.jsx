import { useState, useEffect, useCallback } from "react";
import { getZoneScore } from "../api";

const S = {
  page: { maxWidth: 1200, margin: "0 auto", padding: "2.5rem" },
  header: { marginBottom: "2rem" },
  h1: { fontFamily: "'Fraunces', serif", fontSize: "1.9rem", fontWeight: 700, color: "#f0ede8" },
  sub: { color: "#8a8899", fontSize: ".92rem", marginTop: ".3rem" },

  banner: (ok) => ({
    background: ok ? "linear-gradient(135deg, rgba(34,197,94,.08), rgba(34,197,94,.04))" : "linear-gradient(135deg, rgba(255,92,26,.08), rgba(255,92,26,.04))",
    border: ok ? "1px solid rgba(34,197,94,.2)" : "1px solid rgba(255,92,26,.2)",
    borderRadius: 14, padding: "1.3rem 1.8rem",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: "2rem", gap: "1rem",
  }),
  bannerCheck: (ok) => ({
    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
    background: ok ? "rgba(34,197,94,.15)" : "rgba(255,92,26,.15)",
    border: ok ? "1px solid rgba(34,197,94,.3)" : "1px solid rgba(255,92,26,.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: ok ? "#22c55e" : "#ff5c1a", fontSize: "1.1rem",
  }),
  bannerTitle: (ok) => ({ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: ok ? "#22c55e" : "#ff5c1a", fontSize: "1rem" }),
  bannerDesc: { fontSize: ".87rem", color: "#8a8899", marginTop: ".1rem" },

  grid: { display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", alignItems: "start" },
  card: {
    background: "#1c1c27", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: "1.8rem",
  },
  cardPlusMt: {
    background: "#1c1c27", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: "1.8rem", marginTop: "1.5rem",
  },

  premiumHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.2rem" },
  cardLabel: { fontSize: ".78rem", color: "#8a8899", marginBottom: ".3rem", fontWeight: 400 },
  autoBadge: {
    background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.2)",
    color: "#22c55e", borderRadius: 100, padding: ".25rem .8rem",
    fontSize: ".72rem", fontWeight: 500,
  },
  bigNum: { fontFamily: "'Fraunces', serif", fontSize: "2.6rem", fontWeight: 700, color: "#f0ede8", lineHeight: 1 },
  bigNumUnit: { fontFamily: "'Fraunces', serif", fontSize: "1.1rem", color: "#8a8899", fontWeight: 400, marginLeft: ".3rem" },
  divider: { height: 1, background: "rgba(255,255,255,0.07)", margin: "1.2rem 0" },
  metaRow: { display: "flex", gap: "2.5rem" },
  metaLbl: { fontSize: ".78rem", color: "#8a8899", marginBottom: ".2rem" },
  metaVal: { fontSize: ".95rem", fontWeight: 500 },

  zoneHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" },
  zoneTitle: { fontFamily: "'Fraunces', serif", fontSize: "1rem", fontWeight: 700 },
  liveDot: { display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".78rem", color: "#22c55e" },

  disruptionBox: (score) => ({
    background: score >= 0.7 ? "rgba(239,68,68,.07)" : score >= 0.4 ? "rgba(255,170,0,.07)" : "rgba(34,197,94,.07)",
    border: score >= 0.7 ? "1px solid rgba(239,68,68,.2)" : score >= 0.4 ? "1px solid rgba(255,170,0,.2)" : "1px solid rgba(34,197,94,.2)",
    borderRadius: 12, padding: "1.2rem 1.4rem", marginBottom: "1.4rem",
  }),
  disruptionLabel: (score) => ({ fontSize: ".85rem", fontWeight: 500, color: score >= 0.7 ? "#ef4444" : score >= 0.4 ? "#ffaa00" : "#22c55e" }),
  disruptionScore: (score) => ({
    fontFamily: "'Fraunces', serif", fontSize: "1.6rem", fontWeight: 700,
    color: score >= 0.7 ? "#ef4444" : score >= 0.4 ? "#ffaa00" : "#22c55e",
  }),
  scoreBarBg: { height: 6, background: "rgba(255,255,255,.08)", borderRadius: 100, marginTop: ".8rem" },
  scoreBarFill: (score) => ({
    height: 6, borderRadius: 100,
    background: score >= 0.7 ? "linear-gradient(90deg, #ef4444, #ff5c1a)" : score >= 0.4 ? "linear-gradient(90deg, #ffaa00, #ff5c1a)" : "linear-gradient(90deg, #22c55e, #16a34a)",
    width: `${Math.min(score * 100, 100)}%`, transition: "width .5s",
  }),

  subScores: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".8rem", marginBottom: "1.4rem" },
  subCard: {
    background: "#13131a", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 10, padding: ".9rem 1rem",
  },
  subTop: { display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".78rem", color: "#8a8899", marginBottom: ".4rem" },
  subVal: { fontFamily: "'Fraunces', serif", fontSize: "1.2rem", fontWeight: 700 },

  condTitle: { fontSize: ".8rem", color: "#8a8899", marginBottom: ".8rem", fontWeight: 400 },
  condGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".4rem .5rem" },
  condRow: { display: "flex", justifyContent: "space-between", fontSize: ".84rem", padding: ".3rem 0" },
  condKey: { color: "#8a8899" },
  condVal: { fontWeight: 500 },

  rightCol: { display: "flex", flexDirection: "column", gap: "1rem" },
  statCard: {
    background: "#1c1c27", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14, padding: "1.4rem 1.6rem",
  },
  alertsCard: {
    background: "#1c1c27", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14, padding: "1.4rem 1.6rem",
  },
  alertsTitle: { fontFamily: "'Fraunces', serif", fontSize: ".95rem", fontWeight: 700, marginBottom: "1rem" },
  alertItem: {
    background: "rgba(255,170,0,.07)", border: "1px solid rgba(255,170,0,.2)",
    borderRadius: 10, padding: ".9rem 1rem", marginBottom: ".8rem", fontSize: ".83rem",
  },
  alertTitle: { fontWeight: 700, color: "#ffaa00", marginBottom: ".2rem", display: "flex", alignItems: "center", gap: ".4rem" },
  alertBody: { color: "#8a8899", lineHeight: 1.5 },
  noCrit: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", textAlign: "center", gap: ".5rem" },
  noCritCircle: {
    width: 40, height: 40, borderRadius: "50%",
    background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.25)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#22c55e", fontSize: "1.1rem",
  },
  refreshBtn: {
    background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
    color: "#8a8899", borderRadius: 8, padding: ".4rem .9rem",
    fontSize: ".78rem", cursor: "pointer", transition: "all .2s",
  },
};

export default function Dashboard() {
  const [rider, setRider] = useState(null);
  const [zone, setZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const r = localStorage.getItem("dash_rider");
    if (r) setRider(JSON.parse(r));
  }, []);

  const refresh = useCallback(async () => {
    const r = JSON.parse(localStorage.getItem("dash_rider") || "{}");
    if (!r.pincode) return;
    setLoading(true);
    try {
      const data = await getZoneScore(r.pincode);
      setZone(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  const score = zone?.zone_score || 0;
  const flagged = zone?.flagged;

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.h1}>Hey, {rider?.name?.split(" ")[0] || "Rider"} 👋</h1>
        <p style={S.sub}>Here's your coverage status and live zone monitoring</p>
      </div>

      {/* Coverage Banner */}
      <div style={S.banner(!flagged)}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={S.bannerCheck(!flagged)}>{!flagged ? "✓" : "⚠"}</div>
          <div>
            <div style={S.bannerTitle(!flagged)}>{!flagged ? "Coverage active" : "Disruption detected"}</div>
            <div style={S.bannerDesc}>{!flagged ? "Your weekly premium is protecting you across all operative zones" : "Your zone is flagged — compensation will be calculated tonight"}</div>
          </div>
        </div>
        <button style={S.refreshBtn} onClick={refresh}>Refresh ↻</button>
      </div>

      {loading && !zone ? (
        <div style={{ textAlign: "center", padding: 80, color: "#8a8899" }}>Loading zone data...</div>
      ) : zone ? (
        <div style={S.grid}>
          {/* LEFT */}
          <div>
            {/* Premium */}
            <div style={S.card}>
              <div style={S.premiumHeader}>
                <div style={S.cardLabel}>Your weekly premium</div>
                <span style={S.autoBadge}>Auto-renewed</span>
              </div>
              <div style={S.bigNum}>₹{rider?.weekly_premium?.toFixed(0) || "—"}<span style={S.bigNumUnit}>/ week</span></div>
              <div style={S.divider} />
              <div style={S.metaRow}>
                <div><div style={S.metaLbl}>Coverage amount</div><div style={S.metaVal}>₹50,000</div></div>
                <div><div style={S.metaLbl}>Next payment</div><div style={S.metaVal}>Mon</div></div>
                <div><div style={S.metaLbl}>Platform</div><div style={S.metaVal}>{rider?.platform || "—"}</div></div>
              </div>
            </div>

            {/* Zone */}
            <div style={S.cardPlusMt}>
              <div style={S.zoneHeader}>
                <div style={S.zoneTitle}>Live zone monitoring</div>
                <div style={S.liveDot}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 1.8s infinite" }} />
                  Updates every 15min
                </div>
              </div>

              <div style={S.disruptionBox(score)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".4rem" }}>
                  <span style={S.disruptionLabel(score)}>
                    {score >= 0.7 ? "🔴 Zone flagged — disruption active" : score >= 0.4 ? "⚠️ Moderate conditions" : "✅ Zone clear — safe to ride"}
                  </span>
                  <span style={S.disruptionScore(score)}>{score.toFixed(2)}</span>
                </div>
                <div style={S.scoreBarBg}><div style={S.scoreBarFill(score)} /></div>
                <div style={{ fontSize: ".8rem", color: score >= 0.7 ? "#ef4444" : score >= 0.4 ? "#ffaa00" : "#22c55e", marginTop: ".5rem" }}>
                  Driven by {zone.dominant_factor} · {lastUpdated && `Updated ${lastUpdated}`}
                </div>
              </div>

              <div style={S.subScores}>
                {[
                  { icon: "🌦️", label: "Weather", val: zone.breakdown.weather.toFixed(2) },
                  { icon: "🚦", label: "Traffic", val: zone.breakdown.traffic.toFixed(2) },
                  { icon: "📢", label: "Social", val: zone.breakdown.social.toFixed(2) },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={S.subCard}>
                    <div style={S.subTop}>{icon} {label}</div>
                    <div style={S.subVal}>{val}</div>
                  </div>
                ))}
              </div>

              {zone.weather_raw?.temp && (
                <>
                  <div style={S.condTitle}>Current conditions — {zone.weather_raw.city}</div>
                  <div style={S.condGrid}>
                    {[
                      { k: "Temperature", v: `${zone.weather_raw.temp}°C` },
                      { k: "Condition", v: zone.weather_raw.weatherMain || "—" },
                      { k: "Rain (1h)", v: `${zone.weather_raw.rain || 0} mm` },
                      { k: "Wind", v: `${zone.weather_raw.wind?.toFixed(0)} km/h` },
                    ].map(({ k, v }) => (
                      <div key={k} style={S.condRow}><span style={S.condKey}>{k}</span><span style={S.condVal}>{v}</span></div>
                    ))}
                  </div>
                </>
              )}

              {zone.social_keywords?.length > 0 && (
                <div style={{ marginTop: "1.2rem" }}>
                  <div style={S.condTitle}>Live news triggers</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {zone.social_keywords.map((kw) => (
                      <span key={kw} style={{ background: "rgba(255,170,0,.1)", border: "1px solid rgba(255,170,0,.2)", color: "#ffaa00", borderRadius: 100, padding: ".25rem .75rem", fontSize: ".75rem" }}>{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div style={S.rightCol}>
            {[
              { label: "Total claims filed", val: "0" },
              { label: "Total compensated", val: "₹0" },
              { label: "Premiums paid", val: `₹${((rider?.weekly_premium || 0) * 12).toFixed(0)}` },
            ].map(({ label, val }) => (
              <div key={label} style={S.statCard}>
                <div style={S.cardLabel}>{label}</div>
                <div style={{ ...S.bigNum, fontSize: "2rem" }}>{val}</div>
              </div>
            ))}

            <div style={S.alertsCard}>
              <div style={S.alertsTitle}>Active alerts</div>
              {score >= 0.4 && (
                <div style={S.alertItem}>
                  <div style={S.alertTitle}>⚠️ {score >= 0.7 ? "High disruption" : "Moderate conditions"}</div>
                  <div style={S.alertBody}>{score >= 0.7 ? "Zone flagged — stay safe and track your active hours" : "Conditions approaching threshold in your area"}</div>
                </div>
              )}
              <div style={S.noCrit}>
                <div style={S.noCritCircle}>{score >= 0.7 ? "!" : "✓"}</div>
                <p style={{ fontSize: ".83rem", color: "#8a8899" }}>{score >= 0.7 ? "Compensation engine active" : "No critical disruptions"}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: 80, color: "#8a8899" }}>Could not load zone data.</div>
      )}
    </div>
  );
}
