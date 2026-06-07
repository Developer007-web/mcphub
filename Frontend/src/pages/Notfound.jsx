import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh", background: "#030712",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "20px",
    }}>
      <div style={{
        fontSize: "96px", fontWeight: 800, letterSpacing: "-4px",
        background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4))",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        lineHeight: 1, marginBottom: "16px",
      }}>
        404
      </div>
      <h2 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "10px", color: "rgba(255,255,255,0.85)" }}>
        Page not found
      </h2>
      <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.35)", marginBottom: "36px", maxWidth: "360px" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: "12px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 500, background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
        >
          ← Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          style={{ padding: "12px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 600, background: "#6366f1", border: "none", color: "#fff", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#5558e8"}
          onMouseLeave={e => e.currentTarget.style.background = "#6366f1"}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
