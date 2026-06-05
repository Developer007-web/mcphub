import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

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

      {/* Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

        {/* Sign In */}
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "9px 22px",
            fontSize: "0.95rem",
            fontWeight: 500,
            color: "rgba(255,255,255,0.85)",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={e => {
            e.target.style.background = "rgba(255,255,255,0.08)";
            e.target.style.borderColor = "rgba(255,255,255,0.3)";
            e.target.style.color = "#fff";
          }}
          onMouseLeave={e => {
            e.target.style.background = "transparent";
            e.target.style.borderColor = "rgba(255,255,255,0.18)";
            e.target.style.color = "rgba(255,255,255,0.85)";
          }}
        >
          Sign In
        </button>

        {/* Get Started */}
        <button
          onClick={() => navigate("/signup")}
          style={{
            padding: "9px 22px",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#fff",
            background: "linear-gradient(135deg, #6d28d9, #4f46e5)",
            border: "1px solid transparent",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            letterSpacing: "0.01em",
            boxShadow: "0 0 20px rgba(109,40,217,0.35)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed, #6366f1)";
            e.currentTarget.style.boxShadow = "0 0 28px rgba(109,40,217,0.55)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "linear-gradient(135deg, #6d28d9, #4f46e5)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(109,40,217,0.35)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Get Started
        </button>

      </div>
    </nav>
  );
}