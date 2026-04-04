import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getZoneScore, registerRider } from "../api";

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Lucknow", "Jaipur", "Nagpur"];
const PLATFORMS = ["Zomato", "Swiggy"];
const MULTIPLIERS = { Mumbai: 2.0, Delhi: 2.0, Bangalore: 2.0, Pune: 1.5, Hyderabad: 1.5, Chennai: 1.5, Lucknow: 1.0, Jaipur: 1.0, Nagpur: 1.0 };

const styles = {
  root: { minHeight: "100vh", background: "#0a0a0f", display: "flex", overflow: "hidden" },
  leftPanel: {
    width: "42%", minHeight: "100vh",
    background: "linear-gradient(160deg, #1a0f06 0%, #0d0d18 50%, #0a0a0f 100%)",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    padding: "3rem 3.5rem",
    display: "flex", flexDirection: "column", justifyContent: "space-between",
    position: "relative", overflow: "hidden",
  },
  bgGlow1: {
    position: "absolute", top: -80, right: -80,
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,92,26,.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  bgGlow2: {
    position: "absolute", bottom: -60, left: -60,
    width: 300, height: 300, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,170,0,.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  grid: {
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)",
    backgroundSize: "50px 50px", pointerEvents: "none",
  },
  leftContent: { position: "relative", zIndex: 1 },
  logoRow: { display: "flex", alignItems: "center", gap: ".6rem", marginBottom: "3.5rem" },
  logoIcon: {
    width: 42, height: 42, borderRadius: 10, background: "#ff5c1a",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#fff",
  },
  logoName: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#f0ede8", letterSpacing: ".04em" },
  headline: { fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "1.5rem", color: "#f0ede8", fontFamily: "'Fraunces', serif" },
  desc: { color: "#8a8899", fontSize: ".92rem", lineHeight: 1.7, marginBottom: "2.5rem" },
  checkList: { display: "flex", flexDirection: "column", gap: "1.2rem" },
  checkItem: { display: "flex", gap: "1rem", alignItems: "flex-start" },
  checkBox: {
    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
    background: "rgba(255,92,26,.15)", border: "1px solid rgba(255,92,26,.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#ff5c1a", fontSize: ".8rem", marginTop: ".1rem",
  },
  rightPanel: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem" },
  box: { width: "100%", maxWidth: 420 },
  boxTitle: { fontSize: "1.9rem", fontWeight: 700, marginBottom: ".4rem", fontFamily: "'Fraunces', serif", color: "#f0ede8" },
  boxSub: { color: "#8a8899", fontSize: ".92rem", marginBottom: "2rem" },
  progressRow: { display: "flex", gap: 6, marginBottom: "2rem" },
  progressBar: (active) => ({
    flex: 1, height: 3, borderRadius: 2,
    background: active ? "#ff5c1a" : "rgba(255,255,255,0.1)",
    transition: "background .3s",
  }),
  card: {
    background: "#1c1c27", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: "2rem",
  },
  label: { display: "block", fontSize: ".8rem", fontWeight: 500, color: "#8a8899", marginBottom: ".5rem", letterSpacing: ".02em" },
  inputGroup: {
    display: "flex", alignItems: "center",
    background: "#13131a", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, overflow: "hidden", marginBottom: "1.2rem",
    transition: "border-color .2s",
  },
  inputPrefix: {
    padding: "0 1rem", fontSize: ".88rem", color: "#8a8899",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    height: 50, display: "flex", alignItems: "center", flexShrink: 0,
  },
  input: {
    flex: 1, background: "transparent", border: "none", outline: "none",
    color: "#f0ede8", fontFamily: "'DM Sans', sans-serif",
    fontSize: ".92rem", padding: "0 1rem", height: 50,
  },
  select: {
    width: "100%", background: "#13131a", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "#f0ede8", fontFamily: "'DM Sans', sans-serif",
    fontSize: ".92rem", padding: "0 1rem", height: 50, outline: "none", marginBottom: "1.2rem",
  },
  plainInput: {
    width: "100%", background: "#13131a", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "#f0ede8", fontFamily: "'DM Sans', sans-serif",
    fontSize: ".92rem", padding: "0 1rem", height: 50, outline: "none", marginBottom: "1.2rem",
  },
  btnPrimary: {
    width: "100%", background: "#ff5c1a", color: "#fff", border: "none",
    borderRadius: 10, height: 52, fontFamily: "'Syne', sans-serif",
    fontWeight: 700, fontSize: "1rem", cursor: "pointer", transition: "all .2s",
  },
  error: { fontSize: ".82rem", color: "#ef4444", marginTop: ".5rem" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 0 },
  premiumBox: {
    background: "rgba(255,92,26,.08)", border: "1px solid rgba(255,92,26,.2)",
    borderRadius: 12, padding: "1.5rem", textAlign: "center", marginBottom: "1.2rem",
  },
  metaGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: "1.2rem" },
  metaCard: {
    background: "#13131a", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 8, padding: "1rem", textAlign: "center",
  },
};

export default function Register({ onLogin }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({ name: "", city: "Mumbai", pincode: "", platform: "Zomato", rider_platform_id: "", upi_id: "" });
  const [premium, setPremium] = useState(null);
  const [zoneData, setZoneData] = useState(null);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function sendOtp() {
    if (phone.length < 10) return setError("Enter a valid 10-digit number");
    setError(""); setOtpSent(true);
  }

  async function verifyOtp() {
    if (otp.length !== 6) return setError("Enter the 6-digit OTP");
    setError(""); setStep(2);
  }

  async function calculatePremium() {
    if (!form.pincode || form.pincode.length < 6) return setError("Enter valid 6-digit pincode");
    setLoading(true); setError("");
    try {
      const data = await getZoneScore(form.pincode);
      setZoneData(data);
      const m = MULTIPLIERS[form.city] || 1.0;
      const raw = 70 * data.zone_score * m;
      setPremium(Math.min(Math.max(raw, 70), 200).toFixed(0));
      setStep(3);
    } catch { setError("Could not fetch zone data. Check pincode."); }
    setLoading(false);
  }

  async function submit() {
    setLoading(true); setError("");
    try {
      const data = await registerRider({ ...form, phone });
      localStorage.setItem("dash_rider_id", data.rider.id);
      localStorage.setItem("dash_rider", JSON.stringify(data.rider));
      if (onLogin) onLogin(); // update App state so Nav appears immediately
      navigate("/dashboard");
    } catch (e) { setError(e.response?.data?.error || "Registration failed"); }
    setLoading(false);
  }

  return (
    <div style={styles.root}>
      {/* LEFT */}
      <div style={styles.leftPanel}>
        <div style={styles.bgGlow1} />
        <div style={styles.bgGlow2} />
        <div style={styles.grid} />
        <div style={styles.leftContent}>
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>D</div>
            <div style={styles.logoName}>D.A.S.H.</div>
          </div>
          <h1 style={styles.headline}>Your safety net<br />on <span style={{ color: "#ff5c1a" }}>every ride</span></h1>
          <p style={styles.desc}>AI-powered income protection for delivery riders. When disruptions stop you from riding, we compensate you automatically.</p>
          <div style={styles.checkList}>
            {[
              { title: "Zero paperwork claims", desc: "Automatic payouts when disruptions hit your zone" },
              { title: "Real-time monitoring", desc: "AI tracks weather, traffic, and civil events every 15 minutes" },
              { title: "Affordable coverage", desc: "Starting at just ₹70 per week with UPI AutoPay" },
            ].map(({ title, desc }) => (
              <div key={title} style={styles.checkItem}>
                <div style={styles.checkBox}>✓</div>
                <div>
                  <div style={{ fontSize: ".92rem", fontWeight: 700, marginBottom: ".2rem" }}>{title}</div>
                  <div style={{ fontSize: ".83rem", color: "#8a8899", lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div style={styles.rightPanel}>
        <div style={styles.box}>
          <h2 style={styles.boxTitle}>{step === 1 ? "Get covered" : step === 2 ? "Your profile" : "Your plan"}</h2>
          <p style={styles.boxSub}>{step === 1 ? "Verify your number to start" : step === 2 ? "Tell us about yourself and your zone" : "Based on your zone and city"}</p>

          <div style={styles.progressRow}>
            {[1, 2, 3].map((n) => <div key={n} style={styles.progressBar(step >= n)} />)}
          </div>

          <div style={styles.card}>
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <label style={styles.label}>Mobile number</label>
                <div style={styles.inputGroup}>
                  <div style={styles.inputPrefix}>+91</div>
                  <input style={styles.input} type="tel" placeholder="10-digit number" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} />
                </div>
                {!otpSent ? (
                  <button style={styles.btnPrimary} onClick={sendOtp}>Send OTP →</button>
                ) : (
                  <>
                    <div style={{ fontSize: ".82rem", color: "#22c55e", background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)", padding: "10px 14px", borderRadius: 8, marginBottom: "1.2rem" }}>
                      OTP sent to +91 {phone} — use any 6 digits for demo
                    </div>
                    <label style={styles.label}>Enter OTP</label>
                    <div style={styles.inputGroup}>
                      <input style={{ ...styles.input, paddingLeft: "1rem" }} type="text" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
                    </div>
                    <button style={styles.btnPrimary} onClick={verifyOtp}>Verify & Continue →</button>
                  </>
                )}
                {error && <div style={styles.error}>{error}</div>}
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={styles.label}>Full name</label>
                <input style={styles.plainInput} placeholder="Rahul Sharma" value={form.name} onChange={set("name")} />
                <div style={styles.grid2}>
                  <div>
                    <label style={styles.label}>City</label>
                    <select style={styles.select} value={form.city} onChange={set("city")}>
                      {CITIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Pincode</label>
                    <input style={styles.plainInput} placeholder="400051" value={form.pincode} onChange={set("pincode")} maxLength={6} />
                  </div>
                </div>
                <div style={styles.grid2}>
                  <div>
                    <label style={styles.label}>Platform</label>
                    <select style={styles.select} value={form.platform} onChange={set("platform")}>
                      {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Partner ID</label>
                    <input style={styles.plainInput} placeholder="ZOM-4521" value={form.rider_platform_id} onChange={set("rider_platform_id")} />
                  </div>
                </div>
                <label style={styles.label}>UPI ID</label>
                <input style={styles.plainInput} placeholder="rahul@upi" value={form.upi_id} onChange={set("upi_id")} />
                <button style={{ ...styles.btnPrimary, marginTop: ".5rem", opacity: loading ? .6 : 1 }} onClick={calculatePremium} disabled={loading}>
                  {loading ? "Calculating..." : "Calculate my premium →"}
                </button>
                {error && <div style={styles.error}>{error}</div>}
              </div>
            )}

            {step === 3 && zoneData && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={styles.premiumBox}>
                  <div style={{ fontSize: ".82rem", color: "#ff5c1a", marginBottom: ".4rem" }}>Weekly premium</div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: "3rem", fontWeight: 700, color: "#ff5c1a", lineHeight: 1 }}>₹{premium}</div>
                  <div style={{ fontSize: ".78rem", color: "#8a8899", marginTop: ".4rem" }}>Auto-deducted every Monday via UPI</div>
                </div>
                <div style={styles.metaGrid}>
                  {[
                    { label: "Zone score", value: zoneData.zone_score },
                    { label: "Status", value: zoneData.flagged ? "🔴 Flagged" : "✅ Safe" },
                    { label: "Driver", value: zoneData.dominant_factor },
                  ].map(({ label, value }) => (
                    <div key={label} style={styles.metaCard}>
                      <div style={{ fontSize: ".72rem", color: "#8a8899", marginBottom: ".3rem" }}>{label}</div>
                      <div style={{ fontSize: ".95rem", fontWeight: 600 }}>{value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: ".82rem", color: "#8a8899", background: "#13131a", border: "1px solid rgba(255,255,255,.07)", padding: "10px 14px", borderRadius: 8, marginBottom: "1.2rem" }}>
                  If your zone is disrupted, compensation is auto-transferred to {form.upi_id || "your UPI"} — no claims needed.
                </div>
                <button style={{ ...styles.btnPrimary, opacity: loading ? .6 : 1 }} onClick={submit} disabled={loading}>
                  {loading ? "Activating..." : "Activate coverage →"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}