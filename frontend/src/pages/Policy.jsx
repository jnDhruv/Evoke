import { useState, useEffect } from "react";

const BG = "#f5f4f1";
const SURFACE = "#ffffff";
const BORDER = "rgba(0,0,0,0.09)";
const TEXT = "#111111";
const MUTED = "#52525b";
const ORANGE = "#ff5c1a";
const AMBER = "#c97d00";
const GREEN = "#15803d";
const BLUE = "#1d6fa4"; // info box — AA on white

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

const MULTIPLIERS = {
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

const card = {
  background: SURFACE,
  border: `1px solid ${BORDER}`,
  borderRadius: 16,
  padding: "1.8rem",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

export default function Policy() {
  const [rider, setRider] = useState(null);
  useEffect(() => {
    const r = localStorage.getItem("dash_rider");
    if (r) setRider(JSON.parse(r));
  }, []);

  if (!rider)
    return (
      <div
        style={{
          background: BG,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: MUTED }}>No policy found.</p>
      </div>
    );

  const multiplier = MULTIPLIERS[rider.city] || 1.0;
  const zoneScore = rider.weekly_premium / (70 * multiplier);
  const riskTier =
    zoneScore >= 0.7 ? "High" : zoneScore >= 0.4 ? "Medium" : "Low";
  const riskColor =
    riskTier === "High" ? "#b91c1c" : riskTier === "Medium" ? AMBER : GREEN;
  const riskBg =
    riskTier === "High"
      ? "rgba(185,28,28,.07)"
      : riskTier === "Medium"
        ? "rgba(201,125,0,.07)"
        : "rgba(21,128,61,.07)";

  const coverages = [
    {
      icon: "🌦️",
      iconBg: "rgba(59,130,246,.1)",
      title: "Weather disruptions",
      desc: "Protection against heavy rain, extreme heat, hazardous AQI levels, poor visibility, and severe weather that makes riding unsafe.",
      tags: ["Heavy rain", "Extreme heat", "Poor AQI", "Low visibility"],
    },
    {
      icon: "🚦",
      iconBg: "rgba(249,115,22,.1)",
      title: "Traffic blockages",
      desc: "Coverage for road closures, severe congestion, waterlogging, and inaccessible routes that prevent deliveries in your operative zone.",
      tags: ["Road closures", "Severe congestion", "Waterlogging"],
    },
    {
      icon: "📢",
      iconBg: "rgba(168,85,247,.1)",
      title: "Civil disruptions",
      desc: "Protection during curfews, bandhs, strikes, and protests that shut down delivery operations and prevent restaurant or customer access.",
      tags: ["Curfews", "Bandhs", "Strikes", "Protests"],
    },
  ];

  const steps = [
    {
      title: "AI monitors your zone",
      desc: "Real-time weather, traffic, and civil event data is checked every 15 minutes for your operative pin code.",
    },
    {
      title: "Automatic disruption detection",
      desc: "When the zone's disruption score exceeds 0.7, it's flagged as unworkable and matched against your active hours.",
    },
    {
      title: "Compensation calculation",
      desc: "At midnight, DASH calculates your lost earnings based on your average hourly wage and valid disruption windows.",
    },
    {
      title: "Direct UPI payout",
      desc: "Compensation is automatically credited to your linked UPI account overnight. No forms, no waiting, no manual claims.",
    },
  ];

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
          Insurance policy
        </h1>
        <p style={{ color: MUTED, fontSize: ".92rem", marginBottom: "2.5rem" }}>
          Your current coverage details
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* ── LEFT ── */}
          <div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.05rem",
                fontWeight: 700,
                color: TEXT,
                marginBottom: "1.2rem",
              }}
            >
              What's covered
            </div>

            {coverages.map((c) => (
              <div key={c.title} style={{ ...card, marginBottom: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.4rem",
                      background: c.iconBg,
                    }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: ".97rem",
                        fontWeight: 700,
                        color: TEXT,
                        marginBottom: ".4rem",
                      }}
                    >
                      {c.title}
                    </div>
                    <p
                      style={{
                        fontSize: ".86rem",
                        color: MUTED,
                        lineHeight: 1.65,
                        marginBottom: ".85rem",
                      }}
                    >
                      {c.desc}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: ".4rem",
                      }}
                    >
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            background: BG,
                            border: `1px solid ${BORDER}`,
                            color: MUTED,
                            borderRadius: 100,
                            padding: ".22rem .72rem",
                            fontSize: ".73rem",
                            fontWeight: 500,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Resilience */}
            <div
              style={{
                background: "rgba(201,125,0,.05)",
                border: "1px solid rgba(201,125,0,.2)",
                borderRadius: 16,
                padding: "1.6rem",
                marginBottom: "2rem",
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
              }}
            >
              <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>⭐</div>
              <div>
                <div
                  style={{
                    fontSize: ".97rem",
                    fontWeight: 700,
                    color: AMBER,
                    marginBottom: ".4rem",
                  }}
                >
                  Resilience rewards
                </div>
                <p
                  style={{ fontSize: ".86rem", color: MUTED, lineHeight: 1.65 }}
                >
                  Earn bonus payments of ₹10–₹30 per delivery when you complete
                  orders during moderate to severe conditions. Bonuses are
                  automatically credited with your nightly compensation.
                </p>
              </div>
            </div>

            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.05rem",
                fontWeight: 700,
                color: TEXT,
                marginBottom: "1.2rem",
              }}
            >
              How it works
            </div>
            <div>
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  style={{
                    display: "flex",
                    gap: "1.2rem",
                    alignItems: "flex-start",
                    padding: "1.3rem 1.5rem",
                    background: SURFACE,
                    border: `1px solid ${BORDER}`,
                    borderRadius:
                      i === 0
                        ? "14px 14px 0 0"
                        : i === steps.length - 1
                          ? "0 0 14px 14px"
                          : 0,
                    borderTop: i === 0 ? `1px solid ${BORDER}` : "none",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: "rgba(255,92,26,.1)",
                      border: "1px solid rgba(255,92,26,.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: ".8rem",
                      color: ORANGE,
                      marginTop: ".15rem",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: ".9rem",
                        fontWeight: 700,
                        color: TEXT,
                        marginBottom: ".3rem",
                      }}
                    >
                      {step.title}
                    </div>
                    <p
                      style={{
                        fontSize: ".84rem",
                        color: MUTED,
                        lineHeight: 1.65,
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div>
            {/* Policy summary */}
            <div style={{ ...card, marginBottom: "1.2rem" }}>
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: ".95rem",
                  fontWeight: 700,
                  color: TEXT,
                  marginBottom: "1.2rem",
                }}
              >
                Policy summary
              </div>
              {[
                {
                  k: "Policy ID",
                  v: `DASH-2026-${rider.rider_platform_id || "----"}`,
                  mono: true,
                },
                { k: "Coverage", v: "₹50,000" },
                {
                  k: "Weekly premium",
                  v: `₹${rider.weekly_premium?.toFixed(0)}`,
                  num: true,
                },
                { k: "Operative zone", v: `${rider.city}, ${rider.pincode}` },
                { k: "Risk tier", v: riskTier, colored: true },
              ].map(({ k, v, mono, num, colored }, i, arr) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: ".7rem 0",
                    borderBottom:
                      i < arr.length - 1 ? `1px solid ${BORDER}` : "none",
                    fontSize: ".87rem",
                  }}
                >
                  <span style={{ color: MUTED }}>{k}</span>
                  {colored ? (
                    <span
                      style={{
                        background: riskBg,
                        color: riskColor,
                        borderRadius: 100,
                        padding: ".2rem .7rem",
                        fontSize: ".73rem",
                        fontWeight: 700,
                      }}
                    >
                      {v} risk
                    </span>
                  ) : (
                    <span
                      style={{
                        fontWeight: mono ? 500 : num ? 700 : 600,
                        fontFamily: mono
                          ? "monospace"
                          : num
                            ? "'Plus Jakarta Sans', sans-serif"
                            : "inherit",
                        color: mono ? ORANGE : TEXT,
                        fontSize: mono ? ".8rem" : num ? "1rem" : ".87rem",
                        letterSpacing: num ? "-0.02em" : "normal",
                      }}
                    >
                      {v}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Info box */}
            <div
              style={{
                background: "rgba(29,111,164,.05)",
                border: "1px solid rgba(29,111,164,.18)",
                borderRadius: 14,
                padding: "1.4rem",
                marginBottom: "1.2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".5rem",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: ".83rem",
                  fontWeight: 700,
                  color: BLUE,
                  marginBottom: ".9rem",
                }}
              >
                ℹ️ Important to know
              </div>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: ".6rem",
                }}
              >
                {[
                  "Coverage is valid only while your weekly premium is active",
                  "You must be app-active during disruption windows to qualify",
                  "Payouts are calculated from your registered average hourly earnings",
                  "Fraudulent activity may result in immediate policy termination",
                  "Premium rates may adjust based on live zone risk updates",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: ".82rem",
                      color: MUTED,
                      lineHeight: 1.55,
                      paddingLeft: "1rem",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        color: BLUE,
                        fontWeight: 700,
                      }}
                    >
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <button
              style={{
                width: "100%",
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                color: TEXT,
                borderRadius: 10,
                height: 48,
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: ".9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: ".5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              📄 Download policy document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
