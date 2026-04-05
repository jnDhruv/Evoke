import { NavLink } from "react-router-dom";

export default function Nav() {
  const rider = JSON.parse(localStorage.getItem("dash_rider") || "{}");

  return (
    <nav
      style={{
        background: "#ffffff",
        borderBottom: "1px solid rgba(0,0,0,0.09)",
        padding: "0 2.5rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "#ff5c1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: ".9rem",
              color: "#fff",
            }}
          >
            D
          </div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "1.1rem",
              color: "#111111",
            }}
          >
            D.A.S.H.
          </div>
        </div>
        <div style={{ display: "flex", gap: ".3rem" }}>
          {[
            { to: "/dashboard", label: "Dashboard" },
            { to: "/policy", label: "Policy" },
            { to: "/claims", label: "Claims" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                padding: ".4rem 1rem",
                fontSize: ".88rem",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#ff5c1a" : "#3f3f46", // zinc-700 — high contrast inactive
                textDecoration: "none",
                background: "transparent",
                borderBottom: isActive
                  ? "2px solid #ff5c1a"
                  : "2px solid transparent",
                borderRadius: isActive ? 0 : 6,
                transition: "all .15s",
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: ".8rem" }}>
        {rider.name && (
          <>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: ".88rem",
                  fontWeight: 600,
                  color: "#111111",
                }}
              >
                {rider.name}
              </div>
              <div style={{ fontSize: ".75rem", color: "#52525b" }}>
                {rider.city}, {rider.pincode}
              </div>
            </div>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ff5c1a, #f59e0b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: ".85rem",
                color: "#fff",
              }}
            >
              {rider.name?.[0]?.toUpperCase()}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
