import { useState, useEffect, useCallback } from "react";
import { getZoneScore } from "../api";

// ── Design tokens ─────────────────────────────────────────
const BG = "#f5f4f1"; // page background (warm off-white)
const SURFACE = "#ffffff"; // card / nav surface
const BORDER = "rgba(0,0,0,0.09)";
const TEXT = "#111111"; // high contrast body text
const MUTED = "#52525b"; // secondary text — dark enough on white (AA pass)
const ORANGE = "#ff5c1a";
const AMBER = "#c97d00"; // darker amber — readable on white
const GREEN = "#15803d";
const RED = "#b91c1c";

// Plus Jakarta Sans for all numeric displays
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
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

export default function Dashboard() {
  const [rider, setRider] = useState(null);
  const [zone, setZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setUpdated] = useState(null);

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
      setUpdated(new Date().toLocaleTimeString());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(iv);
  }, [refresh]);

  const s = zone?.zone_score || 0;
  const flagged = zone?.flagged;

  const scoreColor = s >= 0.7 ? RED : s >= 0.4 ? AMBER : GREEN;
  const scoreBg =
    s >= 0.7
      ? "rgba(185,28,28,.05)"
      : s >= 0.4
        ? "rgba(201,125,0,.05)"
        : "rgba(21,128,61,.05)";
  const scoreBdr =
    s >= 0.7
      ? "rgba(185,28,28,.18)"
      : s >= 0.4
        ? "rgba(201,125,0,.18)"
        : "rgba(21,128,61,.18)";

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
          }}
        >
          Hey, {rider?.name?.split(" ")[0] || "Rider"} 👋
        </h1>
        <p
          style={{
            color: MUTED,
            fontSize: ".92rem",
            marginTop: ".3rem",
            marginBottom: "2rem",
          }}
        >
          Here's your coverage status and live zone monitoring
        </p>

        {/* Coverage banner */}
        <div
          style={{
            background: !flagged
              ? "rgba(21,128,61,.05)"
              : "rgba(255,92,26,.05)",
            border: !flagged
              ? "1px solid rgba(21,128,61,.18)"
              : "1px solid rgba(255,92,26,.18)",
            borderRadius: 14,
            padding: "1.2rem 1.6rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                flexShrink: 0,
                background: !flagged
                  ? "rgba(21,128,61,.1)"
                  : "rgba(255,92,26,.1)",
                border: !flagged
                  ? "1px solid rgba(21,128,61,.22)"
                  : "1px solid rgba(255,92,26,.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: !flagged ? GREEN : ORANGE,
                fontSize: "1rem",
              }}
            >
              {!flagged ? "✓" : "⚠"}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  color: !flagged ? GREEN : ORANGE,
                  fontSize: ".95rem",
                }}
              >
                {!flagged ? "Coverage active" : "Disruption detected"}
              </div>
              <div
                style={{
                  fontSize: ".84rem",
                  color: MUTED,
                  marginTop: ".15rem",
                }}
              >
                {!flagged
                  ? "Weekly premium active — you're protected across all operative zones"
                  : "Zone flagged — compensation calculated tonight"}
              </div>
            </div>
          </div>
          <button
            onClick={refresh}
            style={{
              background: "transparent",
              border: `1px solid ${BORDER}`,
              color: MUTED,
              borderRadius: 8,
              padding: ".38rem .9rem",
              fontSize: ".78rem",
              cursor: "pointer",
            }}
          >
            Refresh ↻
          </button>
        </div>

        {loading && !zone ? (
          <div style={{ textAlign: "center", padding: 80, color: MUTED }}>
            Loading zone data…
          </div>
        ) : zone ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 290px",
              gap: "1.5rem",
              alignItems: "start",
            }}
          >
            {/* ── LEFT ── */}
            <div>
              {/* Premium card */}
              <div style={{ ...card, marginBottom: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1.2rem",
                  }}
                >
                  <div style={LABEL_STYLE}>Weekly premium</div>
                  <span
                    style={{
                      background: "rgba(21,128,61,.08)",
                      border: "1px solid rgba(21,128,61,.18)",
                      color: GREEN,
                      borderRadius: 100,
                      padding: ".22rem .75rem",
                      fontSize: ".68rem",
                      fontWeight: 700,
                    }}
                  >
                    Auto-renewed
                  </span>
                </div>
                <span style={{ ...NUM, fontSize: "3rem", lineHeight: 1 }}>
                  ₹{rider?.weekly_premium?.toFixed(0) || "—"}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: ".95rem",
                    color: MUTED,
                    fontWeight: 400,
                    marginLeft: ".4rem",
                  }}
                >
                  / week
                </span>
                <div
                  style={{ height: 1, background: BORDER, margin: "1.2rem 0" }}
                />
                <div style={{ display: "flex", gap: "2.5rem" }}>
                  {[
                    { l: "Coverage", v: "₹50,000" },
                    { l: "Next payment", v: "Monday" },
                    { l: "Platform", v: rider?.platform || "—" },
                  ].map(({ l, v }) => (
                    <div key={l}>
                      <div style={LABEL_STYLE}>{l}</div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: ".95rem",
                          color: TEXT,
                        }}
                      >
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zone monitoring card */}
              <div style={card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.4rem",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: TEXT,
                    }}
                  >
                    Live zone monitoring
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: ".4rem",
                      fontSize: ".76rem",
                      color: GREEN,
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: GREEN,
                        display: "inline-block",
                        animation: "pulse 1.8s infinite",
                      }}
                    />
                    Every 15 min
                  </div>
                </div>

                {/* Score box */}
                <div
                  style={{
                    background: scoreBg,
                    border: `1px solid ${scoreBdr}`,
                    borderRadius: 12,
                    padding: "1.1rem 1.3rem",
                    marginBottom: "1.3rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: ".83rem",
                        fontWeight: 600,
                        color: scoreColor,
                      }}
                    >
                      {s >= 0.7
                        ? "🔴 Zone flagged — disruption active"
                        : s >= 0.4
                          ? "⚠️ Moderate conditions"
                          : "✅ Zone clear — safe to ride"}
                    </span>
                    <span
                      style={{ ...NUM, fontSize: "2rem", color: scoreColor }}
                    >
                      {s.toFixed(2)}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: "rgba(0,0,0,.08)",
                      borderRadius: 100,
                      marginTop: ".75rem",
                    }}
                  >
                    <div
                      style={{
                        height: 5,
                        borderRadius: 100,
                        transition: "width .5s",
                        background:
                          s >= 0.7
                            ? `linear-gradient(90deg, ${RED}, #ff5c1a)`
                            : s >= 0.4
                              ? `linear-gradient(90deg, ${AMBER}, #ff5c1a)`
                              : `linear-gradient(90deg, ${GREEN}, #22c55e)`,
                        width: `${Math.min(s * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: ".76rem",
                      color: scoreColor,
                      marginTop: ".45rem",
                    }}
                  >
                    Driven by {zone.dominant_factor}
                    {lastUpdated && ` · Updated ${lastUpdated}`}
                  </div>
                </div>

                {/* Sub-scores */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: ".75rem",
                    marginBottom: "1.3rem",
                  }}
                >
                  {[
                    {
                      icon: "🌦️",
                      label: "Weather",
                      val: zone.breakdown.weather.toFixed(2),
                    },
                    {
                      icon: "🚦",
                      label: "Traffic",
                      val: zone.breakdown.traffic.toFixed(2),
                    },
                    {
                      icon: "📢",
                      label: "Social",
                      val: zone.breakdown.social.toFixed(2),
                    },
                  ].map(({ icon, label, val }) => (
                    <div
                      key={label}
                      style={{
                        background: BG,
                        border: `1px solid ${BORDER}`,
                        borderRadius: 10,
                        padding: ".85rem 1rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: ".72rem",
                          color: MUTED,
                          fontWeight: 600,
                          marginBottom: ".35rem",
                        }}
                      >
                        {icon} {label}
                      </div>
                      <div style={{ ...NUM, fontSize: "1.3rem" }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Conditions */}
                {zone.weather_raw?.temp && (
                  <>
                    <div style={{ ...LABEL_STYLE, marginBottom: ".7rem" }}>
                      Current conditions — {zone.weather_raw.city}
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        rowGap: 2,
                      }}
                    >
                      {[
                        { k: "Temperature", v: `${zone.weather_raw.temp}°C` },
                        {
                          k: "Condition",
                          v: zone.weather_raw.weatherMain || "—",
                        },
                        {
                          k: "Rain (1h)",
                          v: `${zone.weather_raw.rain || 0} mm`,
                        },
                        {
                          k: "Wind",
                          v: `${zone.weather_raw.wind?.toFixed(0)} km/h`,
                        },
                      ].map(({ k, v }) => (
                        <div
                          key={k}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: ".83rem",
                            padding: ".28rem 0",
                          }}
                        >
                          <span style={{ color: MUTED }}>{k}</span>
                          <span style={{ fontWeight: 600, color: TEXT }}>
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Keywords */}
                {zone.social_keywords?.length > 0 && (
                  <div style={{ marginTop: "1.1rem" }}>
                    <div style={{ ...LABEL_STYLE, marginBottom: ".7rem" }}>
                      Live news triggers
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {zone.social_keywords.map((kw) => (
                        <span
                          key={kw}
                          style={{
                            background: "rgba(201,125,0,.07)",
                            border: "1px solid rgba(201,125,0,.22)",
                            color: AMBER,
                            borderRadius: 100,
                            padding: ".22rem .7rem",
                            fontSize: ".73rem",
                            fontWeight: 600,
                          }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {[
                { label: "Claims filed", val: "0" },
                { label: "Compensated", val: "₹0" },
                {
                  label: "Premiums paid",
                  val: `₹${((rider?.weekly_premium || 0) * 12).toFixed(0)}`,
                },
              ].map(({ label, val }) => (
                <div key={label} style={{ ...card, padding: "1.3rem 1.5rem" }}>
                  <div style={LABEL_STYLE}>{label}</div>
                  <div style={{ ...NUM, fontSize: "2rem", lineHeight: 1.1 }}>
                    {val}
                  </div>
                </div>
              ))}

              <div style={{ ...card, padding: "1.3rem 1.5rem" }}>
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: ".9rem",
                    fontWeight: 700,
                    marginBottom: ".9rem",
                    color: TEXT,
                  }}
                >
                  Active alerts
                </div>
                {s >= 0.4 && (
                  <div
                    style={{
                      background: "rgba(201,125,0,.05)",
                      border: "1px solid rgba(201,125,0,.2)",
                      borderRadius: 10,
                      padding: ".85rem 1rem",
                      marginBottom: ".75rem",
                      fontSize: ".82rem",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color: AMBER,
                        marginBottom: ".2rem",
                      }}
                    >
                      ⚠️ {s >= 0.7 ? "High disruption" : "Moderate conditions"}
                    </div>
                    <div style={{ color: MUTED, lineHeight: 1.5 }}>
                      {s >= 0.7
                        ? "Zone flagged — track your active hours"
                        : "Approaching threshold in your area"}
                    </div>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "1.2rem",
                    textAlign: "center",
                    gap: ".5rem",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: "rgba(21,128,61,.08)",
                      border: "1px solid rgba(21,128,61,.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: GREEN,
                      fontSize: "1rem",
                    }}
                  >
                    {s >= 0.7 ? "!" : "✓"}
                  </div>
                  <p style={{ fontSize: ".82rem", color: MUTED }}>
                    {s >= 0.7
                      ? "Compensation engine active"
                      : "No critical disruptions"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: 80, color: MUTED }}>
            Could not load zone data.
          </div>
        )}
      </div>
    </div>
  );
}
