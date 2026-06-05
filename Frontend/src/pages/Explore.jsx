import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const CATEGORIES = ["All", "Database", "Files", "Communication", "AI", "DevTools", "API", "Other"];

const FEATURED_SERVERS = [
  {
    name: "Anthropic Claude MCP",
    org: "Anthropic",
    description: "Official MCP server by Anthropic. Connect Claude to external tools, files, and APIs seamlessly.",
    tags: ["AI", "official", "anthropic"],
    github_url: "https://github.com/anthropics/anthropic-tools",
    install_command: "npx @anthropic-ai/mcp-server",
    badge: "By Anthropic"
  },
  {
    name: "GitHub MCP Server",
    org: "GitHub",
    description: "Access GitHub repos, issues, PRs, and code search directly from your AI agent.",
    tags: ["DevTools", "github", "official"],
    github_url: "https://github.com/github/github-mcp-server",
    install_command: "npx @modelcontextprotocol/server-github",
    badge: "By GitHub"
  },
  {
    name: "Filesystem MCP",
    org: "Anthropic",
    description: "Read and write local files securely. Essential for any agent that works with documents.",
    tags: ["Files", "official"],
    github_url: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
    install_command: "npx @modelcontextprotocol/server-filesystem",
    badge: "Official"
  },
  {
    name: "PostgreSQL MCP",
    org: "Community",
    description: "Query and interact with PostgreSQL databases. Run SQL, inspect schemas, and more.",
    tags: ["Database", "sql"],
    github_url: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres",
    install_command: "npx @modelcontextprotocol/server-postgres",
    badge: "Popular"
  },
  {
    name: "Brave Search MCP",
    org: "Brave",
    description: "Real-time web search powered by Brave Search API. Let your agent browse the web.",
    tags: ["API", "search", "web"],
    github_url: "https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search",
    install_command: "npx @modelcontextprotocol/server-brave-search",
    badge: "By Brave"
  },
  {
    name: "Memory MCP",
    org: "Anthropic",
    description: "Give your AI agent persistent memory across conversations using a knowledge graph.",
    tags: ["AI", "memory", "official"],
    github_url: "https://github.com/modelcontextprotocol/servers/tree/main/src/memory",
    install_command: "npx @modelcontextprotocol/server-memory",
    badge: "Official"
  }
];

const BADGE_COLORS = {
  "By Anthropic": { bg: "rgba(217,119,6,0.12)", color: "#fbbf24", border: "rgba(217,119,6,0.25)" },
  "By GitHub": { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "rgba(255,255,255,0.12)" },
  "By Brave": { bg: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "rgba(239,68,68,0.2)" },
  "Official": { bg: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "rgba(99,102,241,0.25)" },
  "Popular": { bg: "rgba(16,185,129,0.1)", color: "#6ee7b7", border: "rgba(16,185,129,0.2)" },
};

function StatBadge({ value, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-1px" }}>{value}</div>
      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>{label}</div>
    </div>
  );
}

function FeaturedCard({ server }) {
  const [copied, setCopied] = useState(false);
  const badge = BADGE_COLORS[server.badge] || BADGE_COLORS["Official"];

  const copy = () => {
    navigator.clipboard.writeText(server.install_command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="server-box" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#818cf8" }}>⬡</div>
          <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "100px", background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
            {server.badge}
          </span>
        </div>
        {server.github_url && (
          <a href={server.github_url} target="_blank" rel="noreferrer" style={{ padding: "5px 10px", borderRadius: "7px", fontSize: "12px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.08)" }}>
            GitHub →
          </a>
        )}
      </div>

      <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>{server.name}</h3>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6", marginBottom: "14px", flex: 1 }}>
        {server.description}
      </p>

      <div className="server-tags" style={{ marginBottom: "14px" }}>
        {server.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
      </div>

      <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: "10px", padding: "10px 12px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <code style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {server.install_command}
        </code>
        <button onClick={copy} style={{ background: copied ? "rgba(99,241,150,0.1)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: "6px", padding: "4px 10px", color: copied ? "#6bf59e" : "rgba(255,255,255,0.4)", fontSize: "11px", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function ServerCard({ server, index }) {
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(server.likes || 0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    API.post(`/servers/${server.id}/view`).catch(() => {});
  }, []);

  const copy = () => {
    if (!server.install_command) return;
    navigator.clipboard.writeText(server.install_command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const like = async () => {
    if (liked) return;
    try {
      const { data } = await API.post(`/servers/${server.id}/like`);
      setLikes(data.likes);
      setLiked(true);
    } catch {
      setLikes(l => l + 1);
      setLiked(true);
    }
  };

  const icons = ["⬡", "◈", "⬢", "◎", "⬟"];

  return (
    <div className="server-box" style={{ animationDelay: `${index * 0.04}s`, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#818cf8", flexShrink: 0 }}>
          {icons[index % icons.length]}
        </div>
        {server.github_url && (
          <a href={server.github_url} target="_blank" rel="noreferrer" style={{ padding: "5px 10px", borderRadius: "7px", fontSize: "12px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.08)" }}>
            GitHub →
          </a>
        )}
      </div>

      <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>{server.name}</h3>

      {server.description && (
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6", marginBottom: "14px", flex: 1 }}>
          {server.description.length > 100 ? server.description.slice(0, 100) + "..." : server.description}
        </p>
      )}

      {server.tags?.length > 0 && (
        <div className="server-tags" style={{ marginBottom: "14px" }}>
          {server.tags.slice(0, 3).map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", gap: "14px" }}>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: "4px" }}>
            👁 {server.views || 0}
          </span>
          <button onClick={like} style={{ background: "none", border: "none", cursor: liked ? "default" : "pointer", fontSize: "12px", color: liked ? "#f472b6" : "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: "4px", padding: 0, transition: "all 0.2s" }}>
            {liked ? "♥" : "♡"} {likes}
          </button>
        </div>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
          {new Date(server.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>

      {server.install_command && (
        <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: "10px", padding: "10px 12px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          <code style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {server.install_command}
          </code>
          <button onClick={copy} style={{ background: copied ? "rgba(99,241,150,0.1)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: "6px", padding: "4px 10px", color: copied ? "#6bf59e" : "rgba(255,255,255,0.4)", fontSize: "11px", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Explore() {
  const [servers, setServers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalServers: 0, totalUsers: 0 });
  const [sortBy, setSortBy] = useState("views");
  const navigate = useNavigate();

  useEffect(() => {
    fetchServers();
    fetchStats();
  }, []);

  useEffect(() => {
    let result = [...servers];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    if (category !== "All") {
      result = result.filter(s =>
        s.tags?.some(t => t.toLowerCase() === category.toLowerCase()) ||
        s.name?.toLowerCase().includes(category.toLowerCase()) ||
        s.description?.toLowerCase().includes(category.toLowerCase())
      );
    }
    if (sortBy === "views") result.sort((a, b) => (b.views || 0) - (a.views || 0));
    if (sortBy === "likes") result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    if (sortBy === "newest") result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setFiltered(result);
  }, [search, category, servers, sortBy]);

  const fetchServers = async () => {
    try {
      const { data } = await API.get("/servers");
      setServers(data.servers || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/dashboard/public-stats");
      setStats(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#030712" }}>

      {/* Navbar */}
      <nav className="navbar">
        <span className="navbar-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>MCPHub</span>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button className="btn-ghost" onClick={() => navigate("/login")}>Sign In</button>
          <button className="btn-primary" onClick={() => navigate("/signup")}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "80px 20px 40px", position: "relative" }}>
        <div style={{ position: "absolute", top: "-200px", left: "50%", transform: "translateX(-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="hero-badge" style={{ marginBottom: "20px" }}>✦ Open Registry</div>
        <h1 style={{ fontSize: "52px", fontWeight: "800", letterSpacing: "-2px", background: "linear-gradient(160deg, #ffffff 0%, rgba(255,255,255,0.5) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "16px" }}>
          Explore MCP Servers
        </h1>
        <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.4)", maxWidth: "460px", margin: "0 auto 40px" }}>
          Browse community-published MCP servers. Copy install commands and get running in seconds.
        </p>

        {/* Stats Bar */}
        <div style={{ display: "inline-flex", gap: "48px", padding: "20px 48px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", marginBottom: "40px" }}>
          <StatBadge value={stats.totalServers} label="Servers Published" />
          <div style={{ width: "1px", background: "rgba(255,255,255,0.08)" }} />
          <StatBadge value={stats.totalUsers} label="Developers" />
          <div style={{ width: "1px", background: "rgba(255,255,255,0.08)" }} />
          <StatBadge value={servers.reduce((a, s) => a + (s.views || 0), 0)} label="Total Views" />
          <div style={{ width: "1px", background: "rgba(255,255,255,0.08)" }} />
          <StatBadge value={servers.reduce((a, s) => a + (s.likes || 0), 0)} label="Total Likes" />
        </div>

        {/* Search */}
        <div style={{ maxWidth: "520px", margin: "0 auto", position: "relative" }}>
          <span style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)", fontSize: "18px" }}>⌕</span>
          <input
            placeholder="Search servers, tags, descriptions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "16px 18px 16px 46px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", fontSize: "15px", outline: "none" }}
            onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", padding: "0 20px 16px" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{ padding: "8px 18px", borderRadius: "100px", fontSize: "13px", fontWeight: "500", cursor: "pointer", transition: "all 0.2s", border: "none", background: category === cat ? "#6366f1" : "rgba(255,255,255,0.05)", color: category === cat ? "white" : "rgba(255,255,255,0.45)", outline: category === cat ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Servers */}
      {category === "All" && !search && (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 40px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span style={{ fontSize: "16px" }}>🔥</span>
            <span style={{ fontSize: "16px", fontWeight: "600" }}>Featured Servers</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", padding: "3px 10px", background: "rgba(255,255,255,0.05)", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.08)" }}>Official</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
            {FEATURED_SERVERS.map((server, i) => (
              <FeaturedCard key={i} server={server} />
            ))}
          </div>
        </div>
      )}

      {/* Sort + Count */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "16px", fontWeight: "600" }}>Community Servers</span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", padding: "3px 10px", background: "rgba(255,255,255,0.05)", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.08)" }}>
            {loading ? "..." : `${filtered.length} published`}
          </span>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {["views", "likes", "newest"].map(s => (
            <button key={s} onClick={() => setSortBy(s)} style={{ padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "500", cursor: "pointer", border: "none", background: sortBy === s ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)", color: sortBy === s ? "#a5b4fc" : "rgba(255,255,255,0.3)", outline: sortBy === s ? "none" : "1px solid rgba(255,255,255,0.06)", transition: "all 0.2s" }}>
              {s === "views" ? "🔥 Trending" : s === "likes" ? "♥ Most Liked" : "✦ Newest"}
            </button>
          ))}
        </div>
      </div>

      {/* Community Grid */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px 80px" }}>
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No servers found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
            {filtered.map((server, i) => (
              <ServerCard key={server.id} server={server} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      {!loading && (
        <div style={{ textAlign: "center", padding: "60px 20px 80px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "12px" }}>Have an MCP server?</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "28px", fontSize: "16px" }}>Publish it here and let the community discover it.</p>
          <button className="btn-large primary" onClick={() => navigate("/signup")}>Publish Your Server</button>
        </div>
      )}
    </div>
  );
}