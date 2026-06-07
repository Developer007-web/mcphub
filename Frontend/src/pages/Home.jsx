import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TrendingServers from "../components/TrendingServers";
import API from "../api/api";

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalServers: 0, totalUsers: 0 });

  useEffect(() => {
    API.get("/dashboard/public-stats")
      .then(({ data }) => { if (data.success) setStats(data); })
      .catch(() => {});
  }, []);

  return (
    <div className="home">
      <Navbar />

      <section className="hero">
        <div className="hero-badge">✦ The open MCP registry</div>

        <h1>
          Discover & Share<br />MCP Servers
        </h1>

        <p>
          The modern registry for AI agents,
          MCP servers and automation tools.
        </p>

        <div className="hero-cta">
          <button className="btn-large primary" onClick={() => navigate("/explore")}>
            Browse Servers
          </button>
          <button className="btn-large ghost" onClick={() => navigate("/signup")}>
            Publish Yours →
          </button>
        </div>

        {/* Live stats */}
        <div style={{
          marginTop: "56px",
          display: "inline-flex",
          gap: "40px",
          padding: "18px 40px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          animation: "fadeUp 0.6s 0.4s ease both",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-1px" }}>{stats.totalServers}</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>Servers</div>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-1px" }}>{stats.totalUsers}</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>Developers</div>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-1px" }}>Free</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>Always</div>
          </div>
        </div>
      </section>

      <p className="section-title">Trending MCP Servers</p>
      <TrendingServers />

      {/* Features section */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 40px 100px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
        {[
          { icon: "⬡", title: "Discover", desc: "Browse community-published MCP servers filtered by category, tags, and popularity." },
          { icon: "⚡", title: "One-click Install", desc: "Copy install commands directly from any server card. Up and running in seconds." },
          { icon: "◈", title: "Publish", desc: "Share your own MCP servers with the community. Free forever." },
        ].map(f => (
          <div key={f.title} style={{ padding: "28px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "18px" }}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>{f.icon}</div>
            <div style={{ fontWeight: 600, marginBottom: "8px", fontSize: "16px" }}>{f.title}</div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
