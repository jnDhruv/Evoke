import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Policy from "./pages/Policy";
import Claims from "./pages/Claims";
import Nav from "./components/Nav";

const NAV_ROUTES = ["/dashboard", "/policy", "/claims"];

export default function App() {
  // useState so Nav re-renders immediately after login (not just on next page load)
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("dash_rider_id"),
  );
  const location = useLocation();

  // Sync on route change to catch any edge cases
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("dash_rider_id"));
  }, [location.pathname]);

  const showNav = isLoggedIn && NAV_ROUTES.includes(location.pathname);

  return (
    <div
      style={{ minHeight: "100vh", background: "#0a0a0f", color: "#f0ede8" }}
    >
      {showNav && <Nav />}
      <Routes>
        {/* Landing page — root always shows landing */}
        <Route path="/" element={<Landing isLoggedIn={isLoggedIn} />} />

        {/* Auth */}
        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? <Dashboard /> : <Navigate to="/register" replace />
          }
        />
        <Route
          path="/policy"
          element={
            isLoggedIn ? <Policy /> : <Navigate to="/register" replace />
          }
        />
        <Route
          path="/claims"
          element={
            isLoggedIn ? <Claims /> : <Navigate to="/register" replace />
          }
        />
      </Routes>
    </div>
  );
}
