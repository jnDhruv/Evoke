import { NavLink } from "react-router-dom";

export default function Nav() {
  const rider = JSON.parse(localStorage.getItem("dash_rider") || "{}");

  return (
    <nav style={{
      background: "#13131a",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      padding: "0 2.5rem",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: "#ff5c1a",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: ".9rem", color: "#fff",
          }}>D</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#f0ede8" }}>
            D.A.S.H.
          </div>
        </div>
        <div style={{ display: "flex", gap: ".3rem" }}>
          {[
            { to: "/dashboard", label: "Dashboard" },
            { to: "/policy", label: "Policy" },
            { to: "/claims", label: "Claims" },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              padding: ".4rem 1rem",
              borderRadius: isActive ? "0" : "7px",
              fontSize: ".88rem",
              color: isActive ? "#ff5c1a" : "#8a8899",
              textDecoration: "none",
              fontWeight: isActive ? 500 : 400,
              background: isActive ? "transparent" : "transparent",
              borderBottom: isActive ? "2px solid #ff5c1a" : "2px solid transparent",
              transition: "all .2s",
            })}>
              {label}
            </NavLink>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: ".8rem" }}>
        {rider.name && (
          <>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: ".88rem", fontWeight: 600 }}>{rider.name}</div>
              <div style={{ fontSize: ".75rem", color: "#8a8899" }}>{rider.city}, {rider.pincode}</div>
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg, #ff5c1a, #ffaa00)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: ".85rem", color: "#fff",
            }}>
              {rider.name?.[0]?.toUpperCase()}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
