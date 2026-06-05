import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TrendingServers from "../components/TrendingServers";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <Navbar />

      <section className="hero">
        <div className="hero-badge">
          ✦ The open MCP registry
        </div>

        <h1>
          Discover & Share<br />MCP Servers
        </h1>

        <p>
          The modern registry for AI agents,
          MCP servers and automation tools.
        </p>

        <div className="hero-cta">
          <button
            className="btn-large primary"
            onClick={() => navigate("/explore")}
          >
            Browse Servers
          </button>
          <button
            className="btn-large ghost"
            onClick={() => navigate("/signup")}
          >
            Publish Yours →
          </button>
        </div>
      </section>

      <p className="section-title">Trending MCP Servers</p>
      <TrendingServers />
    </div>
  );
}