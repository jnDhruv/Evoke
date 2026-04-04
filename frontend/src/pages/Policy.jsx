import { useState, useEffect } from "react";

const MULTIPLIERS = { Mumbai: 2.0, Delhi: 2.0, Bangalore: 2.0, Pune: 1.5, Hyderabad: 1.5, Chennai: 1.5, Lucknow: 1.0, Jaipur: 1.0, Nagpur: 1.0 };

const S = {
  page: { maxWidth: 1200, margin: "0 auto", padding: "2.5rem" },
  header: { marginBottom: "2.5rem" },
  h1: { fontFamily: "'Fraunces', serif", fontSize: "1.9rem", fontWeight: 700 },
  sub: { color: "#8a8899", fontSize: ".92rem", marginTop: ".3rem" },
  grid: { display: "grid", gridTemplateColumns: "1fr 300px", gap: "2rem", alignItems: "start" },

  sectionTitle: { fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.2rem" },

  coverageCard: {
    background: "#1c1c27", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: "1.8rem", marginBottom: "1.2rem",
    transition: "border-color .2s", cursor: "default",
  },
  coverageTop: { display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1rem" },
  iconBox: (color) => ({
    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem",
    background: color,
  }),
  coverageTitle: { fontSize: ".98rem", fontWeight: 700, marginBottom: ".4rem" },
  coverageDesc: { fontSize: ".87rem", color: "#8a8899", lineHeight: 1.6, marginBottom: ".9rem" },
  tags: { display: "flex", flexWrap: "wrap", gap: ".4rem" },
  tag: {
    background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,0.07)",
    color: "#8a8899", borderRadius: 100, padding: ".25rem .75rem", fontSize: ".75rem",
  },

  resilienceCard: {
    background: "linear-gradient(135deg, rgba(255,170,0,.08), rgba(255,92,26,.06))",
    border: "1px solid rgba(255,170,0,.2)", borderRadius: 16, padding: "1.8rem",
    marginBottom: "2rem", display: "flex", gap: "1rem", alignItems: "flex-start",
  },
  resilienceTitle: { fontSize: ".98rem", fontWeight: 700, color: "#ffaa00", marginBottom: ".4rem" },
  resilienceDesc: { fontSize: ".87rem", color: "#8a8899", lineHeight: 1.6 },

  hiwList: { display: "flex", flexDirection: "column", gap: 0 },
  hiwStep: (first, last) => ({
    display: "flex", gap: "1.2rem", alignItems: "flex-start",
    padding: "1.3rem 1.5rem",
    background: "#1c1c27", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: first ? "14px 14px 0 0" : last ? "0 0 14px 14px" : 0,
    borderTop: first ? undefined : "none",
  }),
  hiwNum: {
    width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
    background: "rgba(255,92,26,.15)", border: "1px solid rgba(255,92,26,.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: ".82rem", color: "#ff5c1a", marginTop: ".1rem",
  },
  hiwTitle: { fontSize: ".9rem", fontWeight: 700, marginBottom: ".3rem" },
  hiwDesc: { fontSize: ".84rem", color: "#8a8899", lineHeight: 1.6 },

  summaryCard: {
    background: "#1c1c27", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: "1.6rem", marginBottom: "1.2rem",
  },
  summaryTitle: { fontFamily: "'Fraunces', serif", fontSize: ".95rem", fontWeight: 700, marginBottom: "1.2rem" },
  summaryRow: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: ".7rem 0", borderBottom: "1px solid rgba(255,255,255,0.07)", fontSize: ".87rem",
  },
  summaryKey: { color: "#8a8899" },
  summaryVal: { fontWeight: 500, textAlign: "right" },
  summaryValId: { fontFamily: "monospace", color: "#ff5c1a", fontSize: ".82rem", textAlign: "right" },

  infoBox: {
    background: "rgba(99,179,237,.06)", border: "1px solid rgba(99,179,237,.15)",
    borderRadius: 14, padding: "1.4rem", marginBottom: "1.2rem",
  },
  infoTitle: {
    display: "flex", alignItems: "center", gap: ".5rem",
    fontFamily: "'Syne', sans-serif", fontSize: ".85rem", fontWeight: 700,
    color: "#63b3ed", marginBottom: ".9rem",
  },
  infoList: { listStyle: "none", display: "flex", flexDirection: "column", gap: ".6rem" },
  infoItem: { fontSize: ".83rem", color: "#8a8899", lineHeight: 1.55, paddingLeft: "1rem", position: "relative" },

  btnDownload: {
    width: "100%", background: "#1c1c27", border: "1px solid rgba(255,255,255,0.07)",
    color: "#f0ede8", borderRadius: 10, height: 48,
    fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: ".9rem",
    cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem",
  },
};

export default function Policy() {
  const [rider, setRider] = useState(null);
  useEffect(() => {
    const r = localStorage.getItem("dash_rider");
    if (r) setRider(JSON.parse(r));
  }, []);

  if (!rider) return <div style={{ padding: 80, textAlign: "center", color: "#8a8899" }}>No policy found.</div>;

  const multiplier = MULTIPLIERS[rider.city] || 1.0;
  const zoneScore = rider.weekly_premium / (70 * multiplier);
  const riskTier = zoneScore >= 0.7 ? "High" : zoneScore >= 0.4 ? "Medium" : "Low";

  const coverages = [
    { icon: "🌦️", iconBg: "rgba(99,179,237,.12)", title: "Weather disruptions", desc: "Protection against heavy rain, extreme heat, hazardous AQI levels, poor visibility, and severe weather conditions that make riding unsafe or impossible.", tags: ["Heavy rain", "Extreme heat", "Poor AQI", "Low visibility"] },
    { icon: "🚦", iconBg: "rgba(252,129,74,.12)", title: "Traffic blockages", desc: "Coverage for road closures, severe congestion, waterlogging, and inaccessible routes that prevent you from completing deliveries in your operative zone.", tags: ["Road closures", "Severe congestion", "Waterlogging"] },
    { icon: "📢", iconBg: "rgba(237,100,166,.12)", title: "Civil disruptions", desc: "Protection during curfews, bandhs, strikes, and major protests that shut down delivery operations and prevent restaurant or customer access.", tags: ["Curfews", "Bandhs", "Strikes", "Protests"] },
  ];

  const steps = [
    { title: "AI monitors your zone", desc: "Our system tracks weather, traffic, and civil events every 15 minutes in your operative pin code using real-time data from multiple sources." },
    { title: "Automatic disruption detection", desc: "When your zone's disruption score exceeds 0.7, it's flagged as unworkable. The system matches this with your active hours to identify valid compensation periods." },
    { title: "Compensation calculation", desc: "At midnight, D.A.S.H. calculates your lost earnings based on your average hourly wage and the time you were active in disrupted zones." },
    { title: "Direct UPI payout", desc: "Compensation is automatically credited to your linked UPI account overnight. No forms, no waiting, no manual claims." },
  ];

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.h1}>Insurance policy</h1>
        <p style={S.sub}>Your current coverage details</p>
      </div>

      <div style={S.grid}>
        {/* LEFT */}
        <div>
          <div style={S.sectionTitle}>What's covered</div>

          {coverages.map((c) => (
            <div key={c.title} style={S.coverageCard}>
              <div style={S.coverageTop}>
                <div style={S.iconBox(c.iconBg)}>{c.icon}</div>
                <div>
                  <div style={S.coverageTitle}>{c.title}</div>
                  <p style={S.coverageDesc}>{c.desc}</p>
                  <div style={S.tags}>
                    {c.tags.map((t) => <span key={t} style={S.tag}>{t}</span>)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div style={S.resilienceCard}>
            <div style={{ fontSize: "1.6rem", flexShrink: 0 }}>⭐</div>
            <div>
              <div style={S.resilienceTitle}>Resilience rewards</div>
              <p style={S.resilienceDesc}>Earn bonus payments of ₹10–₹30 per delivery when you complete orders during moderate to severe conditions. Bonuses are automatically credited with your compensation.</p>
            </div>
          </div>

          <div style={S.sectionTitle}>How it works</div>
          <div style={S.hiwList}>
            {steps.map((s, i) => (
              <div key={s.title} style={S.hiwStep(i === 0, i === steps.length - 1)}>
                <div style={S.hiwNum}>{i + 1}</div>
                <div>
                  <div style={S.hiwTitle}>{s.title}</div>
                  <p style={S.hiwDesc}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div style={S.summaryCard}>
            <div style={S.summaryTitle}>Policy summary</div>
            {[
              { k: "Policy ID", v: `DASH-2026-${rider.rider_platform_id || "----"}`, mono: true },
              { k: "Coverage amount", v: "₹50,000" },
              { k: "Weekly premium", v: `₹${rider.weekly_premium?.toFixed(0)}` },
              { k: "Operative zone", v: `${rider.city}, ${rider.pincode}` },
              { k: "Risk tier", v: riskTier },
            ].map(({ k, v, mono }, i, arr) => (
              <div key={k} style={{ ...S.summaryRow, borderBottom: i === arr.length - 1 ? "none" : "1px solid rgba(255,255,255,0.07)" }}>
                <span style={S.summaryKey}>{k}</span>
                <span style={mono ? S.summaryValId : S.summaryVal}>{v}</span>
              </div>
            ))}
          </div>

          <div style={S.infoBox}>
            <div style={S.infoTitle}>ℹ️ Important to know</div>
            <ul style={S.infoList}>
              {[
                "Coverage is valid only while your weekly premium is active",
                "You must be app-active during disruption windows to receive compensation",
                "Payouts are calculated based on your registered average hourly earnings",
                "Fraudulent activity may result in immediate policy termination",
                "Premium rates may adjust based on zone risk updates",
              ].map((item) => (
                <li key={item} style={S.infoItem}>
                  <span style={{ position: "absolute", left: 0, color: "#63b3ed" }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button style={S.btnDownload}>📄 Download policy document</button>
        </div>
      </div>
    </div>
  );
}
