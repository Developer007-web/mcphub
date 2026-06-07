import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/api";

const CATEGORIES = ["All", "Database", "Files", "Communication", "AI", "DevTools", "API", "Other"];

const FEATURED_SERVERS = [
  {
    name: "Anthropic Claude MCP",
    description: "Official MCP server by Anthropic. Connect Claude to external tools, files, and APIs seamlessly.",
    tags: ["AI", "official", "anthropic"],
    github_url: "https://github.com/anthropics/anthropic-tools",
    install_command: "npx @anthropic-ai/mcp-server",
    badge: "By Anthropic"
  },
  {
    name: "GitHub MCP Server",
    description: "Access GitHub repos, issues, PRs, and code search directly from your AI agent.",
    tags: ["DevTools", "github", "official"],
    github_url: "https://github.com/github/github-mcp-server",
    install_command: "npx @modelcontextprotocol/server-github",
    badge: "By GitHub"
  },
  {
    name: "Filesystem MCP",
    description: "Read and write local files securely. Essential for any agent that works with documents.",
    tags: ["Files", "official"],
    github_url: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
    install_command: "npx @modelcontextprotocol/server-filesystem",
    badge: "Official"
  },
  {
    name: "PostgreSQL MCP",
    description: "Query and interact with PostgreSQL databases. Run SQL, inspect schemas, and more.",
    tags: ["Database", "sql"],
    github_url: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres",
    install_command: "npx @modelcontextprotocol/server-postgres",
    badge: "Popular"
  },
  {
    name: "Brave Search MCP",
    description: "Real-time web search powered by Brave Search API. Let your agent browse the web.",
    tags: ["API", "search", "web"],
    github_url: "https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search",
    install_command: "npx @modelcontextprotocol/server-brave-search",
    badge: "By Brave"
  },
  {
    name: "Memory MCP",
    description: "Give your AI agent persistent memory across conversations using a knowledge graph.",
    tags: ["AI", "memory", "official"],
    github_url: "https://github.com/modelcontextprotocol/servers/tree/main/src/memory",
    install_command: "npx @modelcontextprotocol/server-memory",
    badge: "Official"
  }
];

const BADGE_COLORS = {
  "By Anthropic": { bg: "rgba(217,119,6,0.12)", color: "#fbbf24", border: "rgba(217,119,6,0.25)" },
  "By GitHub":    { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "rgba(255,255,255,0.12)" },
  "By Brave":     { bg: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "rgba(239,68,68,0.2)" },
  "Official":     { bg: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "rgba(99,102,241,0.25)" },
  "Popular":      { bg: "rgba(16,185,129,0.1)", color: "#6ee7b7", border: "rgba(16,185,129,0.2)" },
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} style={{
      background: copied ? "rgba(99,241,150,0.1)" : "rgba(255,255,255,0.06)",
      border: "none", borderRadius: "6px", padding: "4px 10px",
      color: copied ? "#6bf59e" : "rgba(255,255,255,0.4)",
      fontSize: "11px", cursor: "pointer", flexShrink: 0, transition: "all 0.2s"
    }}>
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function FeaturedCard({ server }) {
  const badge = BADGE_COLORS[server.badge] || BADGE_COLORS["Official"];
  return (
    <div className="server-box" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#818cf8" }}>⬡</div>
          <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "100px", background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
            {server.badge}
          </span>
        </div>
        {server.github_url && (
          <a href={server.github_url} target="_blank" rel="noreferrer" style={{ padding: "5px 10px", borderRadius: "7px", fontSize: "12px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.08)" }}>
            GitHub →
          </a>
        )}
      </div>
      <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "6px" }}>{server.name}</h3>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "14px", flex: 1 }}>{server.description}</p>
      <div className="server-tags" style={{ marginBottom: "14px" }}>
        {server.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
      </div>
      <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: "10px", padding: "10px 12px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <code style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {server.install_command}
        </code>
        <CopyButton text={server.install_command} />
      </div>
    </div>
  );
}

function ServerCard({ server, index }) {
  const [likes, setLikes] = useState(server.likes || 0);
  const [liked, setLiked] = useState(false);
  const icons = ["⬡", "◈", "⬢", "◎", "⬟"];

  useEffect(() => {
    API.post(`/servers/${server.id}/view`).catch(() => {});
  }, []);

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

  return (
    <div className="server-box" style={{ animationDelay: `${index * 0.04}s`, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#818cf8" }}>
          {icons[index % icons.length]}
        </div>
        <button onClick={like} style={{
          display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px",
          background: liked ? "rgba(244,63,94,0.12)" : "rgba(255,255,255,0.04)",
          border: liked ? "1px solid rgba(244,63,94,0.25)" : "1px solid rgba(255,255,255,0.08)",
          borderRadius: "8px", color: liked ? "#fb7185" : "rgba(255,255,255,0.35)",
          fontSize: "12px", cursor: liked ? "default" : "pointer", transition: "all 0.2s"
        }}>
          {liked ? "♥" : "♡"} {likes}
        </button>
      </div>

      <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>{server.name}</h3>
      {server.description && (
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "12px", flex: 1 }}>
          {server.description.length > 100 ? server.description.slice(0, 100) + "…" : server.description}
        </p>
      )}

      {server.tags?.length > 0 && (
        <div className="server-tags" style={{ marginBottom: "12px" }}>
          {server.tags.slice(0, 4).map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      )}

      <div style={{ marginTop: "auto" }}>
        {server.install_command ? (
          <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: "10px", padding: "10px 12px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "10px" }}>
            <code style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {server.install_command}
            </code>
            <CopyButton text={server.install_command} />
          </div>
        ) : null}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>👁 {server.views || 0} views</span>
          {server.github_url && (
            <a href={server.github_url} target="_blank" rel="noreferrer" style={{ fontSize: "12px", color: "#818cf8", textDecoration: "none", fontWeight: 500 }}>
              GitHub →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// AI Assistant floating widget
function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm the MCPHub Assistant. Ask me to find the right MCP server for your needs 🤖" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const { data } = await API.post("/assistant/chat", { message: msg });
      setMessages(prev => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, I'm unavailable right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: "28px", right: "28px", zIndex: 500,
          width: "54px", height: "54px", borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          border: "none", cursor: "pointer", fontSize: "22px",
          boxShadow: "0 4px 24px rgba(99,102,241,0.45)",
          transition: "transform 0.2s, box-shadow 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = "0 6px 30px rgba(99,102,241,0.6)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(99,102,241,0.45)"; }}
        title="MCPHub Assistant"
      >
        {open ? "✕" : "✦"}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: "94px", right: "28px", zIndex: 500,
          width: "340px", background: "#0f0f1a",
          border: "1px solid rgba(99,102,241,0.25)", borderRadius: "18px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "fadeUp 0.2s ease both",
        }}>
          {/* Header */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "10px", background: "rgba(99,102,241,0.06)" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✦</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px" }}>MCPHub Assistant</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Powered by Groq</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", maxHeight: "320px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: "10px 13px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: m.role === "user" ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
                  border: m.role === "user" ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.07)",
                  fontSize: "13px", lineHeight: 1.6, color: m.role === "user" ? "#c7d2fe" : "rgba(255,255,255,0.75)",
                  whiteSpace: "pre-wrap",
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "10px 14px", borderRadius: "14px 14px 14px 4px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
                  Thinking…
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "8px" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask about MCP servers…"
              style={{
                flex: 1, padding: "10px 13px", background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
                color: "white", fontSize: "13px", outline: "none",
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                padding: "10px 14px", background: "#6366f1", border: "none",
                borderRadius: "10px", color: "white", fontSize: "14px",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.5 : 1, transition: "opacity 0.2s",
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function Explore() {
  const navigate = useNavigate();
  const [servers, setServers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [stats, setStats] = useState({ totalServers: 0, totalUsers: 0 });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("views");
  const [loading, setLoading] = useState(true);

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/dashboard/public-stats");
      if (data.success) setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#030712" }}>
      <Navbar />

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "80px 20px 40px", position: "relative" }}>
        <div style={{ position: "absolute", top: "-200px", left: "50%", transform: "translateX(-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="hero-badge" style={{ marginBottom: "20px" }}>✦ Open Registry</div>
        <h1 style={{ fontSize: "52px", fontWeight: 800, letterSpacing: "-2px", background: "linear-gradient(160deg, #ffffff 0%, rgba(255,255,255,0.5) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "16px" }}>
          Explore MCP Servers
        </h1>
        <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.4)", maxWidth: "460px", margin: "0 auto 40px" }}>
          Browse community-published MCP servers. Copy install commands and get running in seconds.
        </p>

        {/* Stats Bar */}
        <div style={{ display: "inline-flex", gap: "48px", padding: "20px 48px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", marginBottom: "40px" }}>
          {[
            { value: stats.totalServers, label: "Servers Published" },
            { value: stats.totalUsers, label: "Developers" },
            { value: servers.reduce((a, s) => a + (s.views || 0), 0), label: "Total Views" },
            { value: servers.reduce((a, s) => a + (s.likes || 0), 0), label: "Total Likes" },
          ].map((s, i) => (
            <>
              {i > 0 && <div key={`div-${i}`} style={{ width: "1px", background: "rgba(255,255,255,0.08)" }} />}
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-1px" }}>{s.value}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>{s.label}</div>
              </div>
            </>
          ))}
        </div>

        {/* Search */}
        <div style={{ maxWidth: "520px", margin: "0 auto", position: "relative" }}>
          <span style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)", fontSize: "18px" }}>⌕</span>
          <input
            placeholder="Search servers, tags, descriptions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "16px 18px 16px 46px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", fontSize: "15px", outline: "none", transition: "border-color 0.2s" }}
            onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", padding: "0 20px 24px" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: "8px 18px", borderRadius: "100px", fontSize: "13px", fontWeight: 500,
            cursor: "pointer", transition: "all 0.2s", border: "none",
            background: category === cat ? "#6366f1" : "rgba(255,255,255,0.05)",
            color: category === cat ? "white" : "rgba(255,255,255,0.45)",
            outline: category === cat ? "none" : "1px solid rgba(255,255,255,0.08)"
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Servers */}
      {category === "All" && !search && (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span style={{ fontSize: "16px" }}>🔥</span>
            <span style={{ fontSize: "16px", fontWeight: 600 }}>Featured Servers</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", padding: "3px 10px", background: "rgba(255,255,255,0.05)", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.08)" }}>Official</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
            {FEATURED_SERVERS.map((server, i) => <FeaturedCard key={i} server={server} />)}
          </div>
        </div>
      )}

      {/* Sort + Count */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "16px", fontWeight: 600 }}>Community Servers</span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", padding: "3px 10px", background: "rgba(255,255,255,0.05)", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.08)" }}>
            {loading ? "..." : `${filtered.length} published`}
          </span>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {["views", "likes", "newest"].map(s => (
            <button key={s} onClick={() => setSortBy(s)} style={{
              padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 500,
              cursor: "pointer", border: "none",
              background: sortBy === s ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
              color: sortBy === s ? "#a5b4fc" : "rgba(255,255,255,0.3)",
              outline: sortBy === s ? "none" : "1px solid rgba(255,255,255,0.06)",
              transition: "all 0.2s"
            }}>
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
            <p>Try a different search or category, or be the first to publish one!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
            {filtered.map((server, i) => <ServerCard key={server.id} server={server} index={i} />)}
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "60px 20px 100px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "12px" }}>Have an MCP server?</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "28px", fontSize: "16px" }}>Publish it here and let the community discover it.</p>
        <button className="btn-large primary" onClick={() => navigate("/signup")}>Publish Your Server</button>
      </div>

      {/* AI Assistant */}
      <Assistant />
    </div>
  );
}
