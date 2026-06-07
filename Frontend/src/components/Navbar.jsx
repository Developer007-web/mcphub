import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 2rem",
      height: "64px",
      background: "rgba(10, 10, 20, 0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>

      {/* Logo */}
      <h2
        onClick={() => navigate("/")}
        style={{
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "#fff",
          cursor: "pointer",
          letterSpacing: "-0.02em",
          margin: 0,
          background: "linear-gradient(135deg, #a78bfa, #818cf8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        MCPHub
      </h2>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <button
          onClick={() => navigate("/explore")}
          style={{
            padding: "8px 16px",
            fontSize: "0.9rem",
            fontWeight: 500,
            color: isActive("/explore") ? "#a5b4fc" : "rgba(255,255,255,0.55)",
            background: isActive("/explore") ? "rgba(99,102,241,0.1)" : "transparent",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { if (!isActive("/explore")) e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
          onMouseLeave={e => { if (!isActive("/explore")) e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
        >
          Explore
        </button>

        {isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "8px 16px",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: isActive("/dashboard") ? "#a5b4fc" : "rgba(255,255,255,0.55)",
                background: isActive("/dashboard") ? "rgba(99,102,241,0.1)" : "transparent",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (!isActive("/dashboard")) e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
              onMouseLeave={e => { if (!isActive("/dashboard")) e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
            >
              Dashboard
            </button>
            <button
              onClick={logout}
              style={{
                marginLeft: "8px",
                padding: "9px 22px",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "rgba(255,255,255,0.75)",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,100,100,0.4)"; e.currentTarget.style.color = "#f87171"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              style={{
                marginLeft: "8px",
                padding: "9px 22px",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "rgba(255,255,255,0.85)",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              style={{
                padding: "9px 22px",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#fff",
                background: "linear-gradient(135deg, #6d28d9, #4f46e5)",
                border: "1px solid transparent",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 0 20px rgba(109,40,217,0.35)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed, #6366f1)"; e.currentTarget.style.boxShadow = "0 0 28px rgba(109,40,217,0.55)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, #6d28d9, #4f46e5)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(109,40,217,0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
}