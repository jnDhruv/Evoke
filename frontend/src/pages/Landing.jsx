import { useNavigate } from "react-router-dom";

const css = `
  @keyframes pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50% { opacity: .5; transform: scale(.7); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp .7s ease both; }
  .delay-1 { animation-delay: .1s; }
  .delay-2 { animation-delay: .2s; }
  .delay-3 { animation-delay: .35s; }
  .delay-4 { animation-delay: .5s; }

  .hero-badge::before {
    content: '';
    width: 7px; height: 7px; border-radius: 50%;
    background: #ff5c1a;
    animation: pulse 1.8s infinite;
    display: inline-block;
    margin-right: 8px;
    vertical-align: middle;
  }

  .feat-card { position: relative; overflow: hidden; transition: border-color .25s, transform .25s; }
  .feat-card::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, #ff5c1a, #ffaa00);
    opacity: 0; transition: opacity .3s;
  }
  .feat-card:hover { border-color: rgba(255,92,26,.3) !important; transform: translateY(-3px); }
  .feat-card:hover::after { opacity: 1; }

  .problem-card { transition: border-color .2s; }
  .problem-card:hover { border-color: rgba(255,92,26,.3) !important; }

  .testi-card { transition: transform .2s, border-color .2s; }
  .testi-card:hover { transform: translateY(-4px); border-color: rgba(255,92,26,.25) !important; }

  .btn-primary-land { transition: all .2s; }
  .btn-primary-land:hover { background: #ff7240 !important; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,92,26,.35); }
  .btn-secondary-land { transition: all .2s; }
  .btn-secondary-land:hover { border-color: rgba(255,255,255,.2) !important; background: rgba(255,255,255,.04) !important; }

  .nav-cta-land { transition: background .2s, transform .15s; }
  .nav-cta-land:hover { background: #ff7240 !important; transform: translateY(-1px); }

  .obj-card { background: #1c1c27; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1.8rem; }

  .live-pulse { animation: pulse 1.8s infinite; }
`;

export default function Landing({ isLoggedIn }) {
  const navigate = useNavigate();

  const goToCovered = () => {
    if (isLoggedIn) navigate("/dashboard");
    else navigate("/register");
  };

  return (
    <>
      <style>{css}</style>
      <div style={{ background: "#0a0a0f", color: "#f0ede8", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.7, overflowX: "hidden" }}>

        {/* ── NAV ── */}
        <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 5%", background: "rgba(10,10,15,0.82)", backdropFilter: "blur(18px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#f0ede8", letterSpacing: "-.02em" }}>
            D<span style={{ color: "#ff5c1a" }}>.</span>A<span style={{ color: "#ff5c1a" }}>.</span>S<span style={{ color: "#ff5c1a" }}>.</span>H<span style={{ color: "#ff5c1a" }}>.</span>
          </div>
          <div style={{ display: "flex", gap: "2rem", listStyle: "none" }}>
            {["#problem", "#solution", "#features", "#how"].map((href, i) => (
              <a key={i} href={href} style={{ color: "#8a8899", textDecoration: "none", fontSize: ".9rem", transition: "color .2s" }}
                onMouseOver={e => e.target.style.color = "#f0ede8"}
                onMouseOut={e => e.target.style.color = "#8a8899"}>
                {["Problem", "Solution", "Features", "How it works"][i]}
              </a>
            ))}
          </div>
          <button className="nav-cta-land" onClick={goToCovered} style={{ background: "#ff5c1a", color: "#fff", border: "none", borderRadius: 6, padding: ".55rem 1.3rem", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: ".88rem", cursor: "pointer" }}>
            {isLoggedIn ? "Go to Dashboard →" : "Get Covered →"}
          </button>
        </nav>

        {/* ── HERO ── */}
        <section style={{ minHeight: "100vh", paddingTop: "9rem", paddingLeft: "5%", paddingRight: "5%", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 55% at 60% 30%, rgba(255,92,26,.12) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(255,170,0,.07) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 780 }}>
            <div className="fade-up hero-badge" style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,92,26,.1)", border: "1px solid rgba(255,92,26,.25)", borderRadius: 100, padding: ".4rem 1rem", marginBottom: "2rem", fontSize: ".82rem", color: "#ff5c1a" }}>
              Live in 50+ pin codes across India
            </div>
            <h1 className="fade-up delay-1" style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.08, marginBottom: "1.5rem" }}>
              When rain stops<br />your ride,{" "}
              <em style={{ fontStyle: "normal", color: "#ff5c1a" }}>we pay</em><br />your day.
            </h1>
            <p className="fade-up delay-2" style={{ fontSize: "1.2rem", color: "#8a8899", maxWidth: 560, marginBottom: "2.5rem", lineHeight: 1.65 }}>
              India's first AI-powered parametric insurance for gig delivery riders.
              No claim forms. No waiting. Automatic payouts — directly to your UPI account.
            </p>
            <div className="fade-up delay-3" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button className="btn-primary-land" onClick={goToCovered} style={{ background: "#ff5c1a", color: "#fff", border: "none", borderRadius: 8, padding: ".9rem 2rem", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>
                {isLoggedIn ? "Go to Dashboard →" : "Start Coverage — ₹70/week"}
              </button>
              <a href="https://drive.google.com/file/d/1BfLRHlCXSVnKhkoLvOYoizhxZJ0PV58I/view" target="_blank" rel="noreferrer">
                <button className="btn-secondary-land" style={{ background: "transparent", color: "#f0ede8", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: ".9rem 2rem", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "1rem", cursor: "pointer" }}>
                  Watch Demo ↗
                </button>
              </a>
            </div>
            <div className="fade-up delay-4" style={{ display: "flex", gap: "3rem", marginTop: "4rem", paddingTop: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.07)", flexWrap: "wrap" }}>
              {[
                { num: "₹0", sup: "*", label: "Compensation today for disrupted riders" },
                { num: "20–30", sup: "%", label: "Monthly income lost to disruptions" },
                { num: "15", sup: "min", label: "Zone re-evaluation interval" },
              ].map(({ num, sup, label }) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800 }}>{num}<span style={{ color: "#ff5c1a" }}>{sup}</span></div>
                  <div style={{ color: "#8a8899", fontSize: ".85rem", marginTop: ".1rem" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <section style={{ padding: "3rem 5%", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#13131a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "3rem", flexWrap: "wrap" }}>
            <span style={{ color: "#8a8899", fontSize: ".8rem", whiteSpace: "nowrap", letterSpacing: ".06em", textTransform: "uppercase" }}>Riders from</span>
            <div style={{ display: "flex", gap: "2.5rem", alignItems: "center", flexWrap: "wrap" }}>
              {[
                { name: "Zomato", color: "rgba(255,75,75,.35)" },
                { name: "Swiggy", color: "rgba(255,160,20,.35)" },
                { name: "EatSure", color: "rgba(255,120,60,.3)" },
                { name: "Ownly", color: "rgba(120,180,255,.3)" },
              ].map(({ name, color }) => (
                <span key={name} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color, letterSpacing: ".02em" }}>⬡ {name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLEM ── */}
        <section id="problem" style={{ padding: "7rem 5%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
            <div>
              <span style={{ display: "inline-block", fontFamily: "'Syne', sans-serif", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#ff5c1a", marginBottom: "1.2rem" }}>The Problem</span>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: ".8rem" }}>Millions of riders. Zero protection.</h2>
              <p style={{ color: "#8a8899", maxWidth: 540, fontSize: "1.05rem" }}>India's 10 million+ gig delivery workers are entirely on their own — earning per order with no salary, no benefits, and no safety net. One disruption means a day of zero income.</p>
              <div style={{ marginTop: "2rem", background: "linear-gradient(135deg, rgba(255,92,26,.12), rgba(255,170,0,.08))", border: "1px solid rgba(255,92,26,.2)", borderRadius: 14, padding: "1.8rem" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "3.5rem", fontWeight: 800, color: "#ff5c1a", lineHeight: 1 }}>₹0</div>
                <p style={{ color: "#8a8899", fontSize: ".95rem", marginTop: ".5rem" }}>That's exactly how much of the 20–30% income loss from disruptions is compensated by Zomato, Swiggy, or any insurer today.</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { icon: "🌧️", title: "Heavy Rain", desc: "Makes roads dangerous, halts deliveries entirely. No orders = no income." },
                { icon: "🌡️", title: "Extreme Heat", desc: "Temperatures above 42°C make prolonged outdoor riding physically impossible." },
                { icon: "😷", title: "Severe AQI", desc: "Hazardous air quality forces riders off the road — no indoor alternative exists." },
                { icon: "🚧", title: "Curfews & Bandhs", desc: "Shut down both restaurants and customers simultaneously, collapsing all demand." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="problem-card" style={{ background: "#1c1c27", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.5rem 1.8rem", display: "flex", gap: "1.2rem", alignItems: "flex-start" }}>
                  <div style={{ fontSize: "1.6rem", flexShrink: 0, width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,92,26,.18)", borderRadius: 10 }}>{icon}</div>
                  <div>
                    <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: ".95rem", fontWeight: 700, marginBottom: ".3rem" }}>{title}</h4>
                    <p style={{ fontSize: ".88rem", color: "#8a8899", lineHeight: 1.55 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOLUTION ── */}
        <section id="solution" style={{ padding: "7rem 5%", background: "#13131a" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
            <div style={{ background: "#1c1c27", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "2.5rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, background: "radial-gradient(circle, rgba(255,92,26,.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
              <span style={{ display: "inline-block", fontFamily: "'Syne', sans-serif", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#ff5c1a", marginBottom: "1.5rem" }}>How DASH Responds</span>
              {[
                { num: 1, title: "Disruption Detected", desc: "Weather, traffic & news APIs flag your pin code automatically every 15 minutes" },
                { num: 2, title: "Zone Scored", desc: "AI model calculates a live disruption score — if > 0.7, zone is flagged unworkable" },
                { num: 3, title: "Riders Matched", desc: "Active subscribers in the flagged zone are automatically identified" },
                { num: 4, title: "UPI Payout — Midnight", desc: "Compensation credited directly to your account. Zero action needed from you." },
              ].map(({ num, title, desc }, i, arr) => (
                <div key={num}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: i < arr.length - 1 ? 0 : 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#ff5c1a", color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: ".8rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: ".2rem" }}>{num}</div>
                    <div>
                      <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: ".92rem", fontWeight: 700 }}>{title}</h4>
                      <p style={{ fontSize: ".83rem", color: "#8a8899" }}>{desc}</p>
                    </div>
                  </div>
                  {i < arr.length - 1 && <div style={{ width: 1, height: 24, background: "rgba(255,92,26,.3)", marginLeft: 15.5, marginBottom: 0 }} />}
                </div>
              ))}
            </div>
            <div>
              <span style={{ display: "inline-block", fontFamily: "'Syne', sans-serif", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#ff5c1a", marginBottom: "1.2rem" }}>The Solution</span>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: ".8rem" }}>The fourth option riders never had.</h2>
              <p style={{ color: "#8a8899", fontSize: "1.05rem", marginBottom: "2rem" }}>When a disruption hits, riders face three choices: risk their safety, absorb the loss, or borrow. DASH is the fourth — <strong style={{ color: "#f0ede8" }}>automatic income replacement</strong>, triggered without lifting a finger.</p>
              {["No claim forms", "No waiting period", "No location spoofing possible", "Direct UPI — no intermediary", "Premiums from just ₹21/week"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: ".8rem", fontSize: ".92rem", marginBottom: ".8rem" }}>
                  <span style={{ color: "#22c55e", fontSize: "1.1rem" }}>✓</span> {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{ padding: "7rem 5%", background: "#0a0a0f" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "3rem" }}>
            <div>
              <span style={{ display: "inline-block", fontFamily: "'Syne', sans-serif", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#ff5c1a", marginBottom: "1.2rem" }}>Key Features</span>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800 }}>Intelligence built for India's roads.</h2>
            </div>
            <p style={{ color: "#8a8899", maxWidth: 380, fontSize: "1.05rem" }}>Every piece of DASH is engineered around the real life of a delivery rider.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
            {[
              { icon: "📡", title: "Real-Time Zone Scoring", desc: "Every pin code gets a live disruption score recalculated every 15 minutes from weather, traffic, and civil disruption data." },
              { icon: "💸", title: "Dynamic Premiums", desc: "Your weekly premium reflects your actual zone risk and city earning potential — not a one-size-fits-all flat rate." },
              { icon: "🔒", title: "Anti-Fraud Architecture", desc: "Triggers come entirely from external APIs. Riders never report their own location — there is nothing to spoof." },
              { icon: "🏆", title: "Resilience Reward", desc: "Brave the conditions? Earn up to ₹30 bonus per delivery completed during moderate-to-severe disruption windows." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="feat-card" style={{ background: "#1c1c27", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "2rem" }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: "rgba(255,92,26,.18)", border: "1px solid rgba(255,92,26,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", marginBottom: "1.3rem" }}>{icon}</div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", fontWeight: 700, marginBottom: ".6rem" }}>{title}</h3>
                <p style={{ fontSize: ".88rem", color: "#8a8899", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how" style={{ padding: "7rem 5%", background: "#13131a" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span style={{ display: "inline-block", fontFamily: "'Syne', sans-serif", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#ff5c1a", marginBottom: "1.2rem" }}>How It Works</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: ".8rem" }}>Three steps. Zero friction.</h2>
            <p style={{ color: "#8a8899", fontSize: "1.05rem", maxWidth: 540, margin: "0 auto" }}>Designed for riders with low digital literacy — from signup to payout in minutes.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, position: "relative" }}>
            <div style={{ position: "absolute", top: 28, left: "16%", right: "16%", height: 1, background: "linear-gradient(90deg, #ff5c1a, transparent 45%, transparent 55%, #ff5c1a)", zIndex: 0 }} />
            {[
              { n: 1, title: "Sign Up in 3 Minutes", desc: "Phone number → OTP → pin code → platform ID → UPI mandate. Done. Coverage activates immediately." },
              { n: 2, title: "DASH Watches Your Zone", desc: "Every 15 minutes, your operative pin code is scored. If conditions become unworkable, it's flagged automatically." },
              { n: 3, title: "Wake Up to Your Payout", desc: "Each night at midnight, the compensation engine runs and credits your UPI account. No action required — ever." },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{ textAlign: "center", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#1c1c27", border: "2px solid #ff5c1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#ff5c1a", margin: "0 auto 1.5rem" }}>{n}</div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", fontWeight: 700, marginBottom: ".5rem" }}>{title}</h3>
                <p style={{ fontSize: ".87rem", color: "#8a8899" }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ padding: "7rem 5%", background: "#0a0a0f" }}>
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 3rem" }}>
            <span style={{ display: "inline-block", fontFamily: "'Syne', sans-serif", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#ff5c1a", marginBottom: "1.2rem" }}>Common Questions</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800 }}>We've thought of everything.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {[
              { q: "What if I fake my location to claim?", a: "You can't — DASH never asks where you are. Disruptions are detected entirely from external APIs. The system finds riders in affected zones, not the other way around." },
              { q: "What if multiple zones I work in are flagged?", a: "DASH calculates one combined payout per day. No double dipping. Each Valid Flag is a 15-minute window, counted once regardless of zone overlap." },
              { q: "What if I work in a rainy city and pay too much?", a: "Premiums are capped at ₹200/week no matter how high-risk your zone or city. And high-risk zones have proportionally more payout events — the math always works in your favour." },
              { q: "Is DASH financially sustainable long-term?", a: "Significant disruptions hit roughly 15–20% of active weeks. At 150 riders, weekly premiums of ₹12–15K comfortably cover payouts of ₹3–6K, leaving a healthy margin for growth." },
            ].map(({ q, a }) => (
              <div key={q} className="obj-card">
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: ".95rem", color: "#8a8899", marginBottom: ".8rem", display: "flex", alignItems: "center", gap: ".6rem" }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,.07)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: ".75rem", flexShrink: 0 }}>?</span>
                  {q}
                </div>
                <p style={{ fontSize: ".9rem", color: "#f0ede8", lineHeight: 1.65 }}>{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "7rem 5%", background: "linear-gradient(135deg, #1a0e06, #0a0a0f 50%, #0f1a0a)", position: "relative", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,92,26,.15) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
            <span style={{ display: "inline-block", fontFamily: "'Syne', sans-serif", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#ff5c1a", marginBottom: "1.2rem" }}>Get Protected</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 800, letterSpacing: "-.02em", marginBottom: "1.2rem" }}>
              Stop absorbing losses.<br /><em style={{ fontStyle: "normal", color: "#ff5c1a" }}>Start getting paid.</em>
            </h2>
            <p style={{ color: "#8a8899", fontSize: "1.1rem", marginBottom: "2.5rem" }}>Coverage starts at ₹70/week — less than 2% of weekly earnings for most riders. Sign up in 3 minutes, get covered immediately.</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary-land" onClick={goToCovered} style={{ background: "#ff5c1a", color: "#fff", border: "none", borderRadius: 8, padding: "1rem 2.5rem", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.05rem", cursor: "pointer" }}>
                {isLoggedIn ? "Go to Dashboard →" : "Get Covered Now →"}
              </button>
              <a href="https://drive.google.com/file/d/1BfLRHlCXSVnKhkoLvOYoizhxZJ0PV58I/view" target="_blank" rel="noreferrer">
                <button className="btn-secondary-land" style={{ background: "transparent", color: "#f0ede8", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "1rem 2.5rem", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "1.05rem", cursor: "pointer" }}>
                  Watch Demo Video ↗
                </button>
              </a>
            </div>
            <p style={{ marginTop: "1.5rem", fontSize: ".82rem", color: "#8a8899" }}>No lock-in. Weekly subscription. Cancel anytime via UPI mandate.</p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: "#13131a", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "3rem 5%", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem" }}>
              D<span style={{ color: "#ff5c1a" }}>.</span>A<span style={{ color: "#ff5c1a" }}>.</span>S<span style={{ color: "#ff5c1a" }}>.</span>H<span style={{ color: "#ff5c1a" }}>.</span>
            </div>
            <div style={{ color: "#8a8899", fontSize: ".8rem", marginTop: ".3rem" }}>Disruption Aware Safety Harbour</div>
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["#problem", "#solution", "#features", "#how"].map((href, i) => (
              <a key={i} href={href} style={{ color: "#8a8899", textDecoration: "none", fontSize: ".88rem" }}
                onMouseOver={e => e.target.style.color = "#f0ede8"}
                onMouseOut={e => e.target.style.color = "#8a8899"}>
                {["Problem", "Solution", "Features", "How it Works"][i]}
              </a>
            ))}
          </div>
          <div style={{ color: "#8a8899", fontSize: ".82rem" }}>© 2024 DASH. Built for India's gig economy.</div>
        </footer>

      </div>
    </>
  );
}