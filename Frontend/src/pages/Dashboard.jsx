import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Dashboard() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchServers(); }, []);

  const fetchServers = async () => {
    try {
      const { data } = await API.get("/dashboard/my-servers");
      setServers(data.servers || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await API.delete(`/dashboard/my-servers/${id}`);
      setServers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert("Failed to delete server. Please try again.");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">

      {/* Confirm Delete Modal */}
      {confirmId && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "#13131f", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "14px", padding: "2rem", width: "100%", maxWidth: "380px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🗑️</div>
            <h3 style={{ color: "#fff", marginBottom: "0.5rem", fontSize: "1.1rem" }}>
              Delete this server?
            </h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              This action cannot be undone. The server will be permanently removed from the registry.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => setConfirmId(null)}
                style={{
                  padding: "9px 24px", borderRadius: "8px", fontSize: "0.9rem",
                  background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.7)", cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={deletingId === confirmId}
                style={{
                  padding: "9px 24px", borderRadius: "8px", fontSize: "0.9rem",
                  background: deletingId === confirmId ? "#7f1d1d" : "#dc2626",
                  border: "none", color: "#fff", cursor: "pointer", fontWeight: 600,
                  opacity: deletingId === confirmId ? 0.7 : 1
                }}
              >
                {deletingId === confirmId ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sidebar">
        <div className="sidebar-logo">MCPHub</div>
        <div className="sidebar-nav">
          <button className="sidebar-btn active">⬡ Dashboard</button>
          <button className="sidebar-btn" onClick={() => navigate("/add-server")}>
            + Add Server
          </button>
        </div>
        <button className="sidebar-btn logout" onClick={logout}>
          ↩ Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back 👋</h1>
            <p>Manage and publish your MCP servers</p>
          </div>
          <button className="add-btn" onClick={() => navigate("/add-server")}>
            + Add MCP Server
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Servers</div>
            <div className="stat-value">{servers.length}</div>
            <div className="stat-sub">published</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Registry Status</div>
            <div className="stat-value" style={{ fontSize: "22px", paddingTop: "6px" }}>Active</div>
            <div className="stat-sub">all systems normal</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Uptime</div>
            <div className="stat-value">100%</div>
            <div className="stat-sub">last 30 days</div>
          </div>
        </div>

        <div className="section-heading">My MCP Servers</div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : servers.length === 0 ? (
          <div className="empty-state">
            <h3>No servers yet</h3>
            <p>Click "+ Add MCP Server" to publish your first one</p>
          </div>
        ) : (
          <div className="servers-grid">
            {servers.map((server, i) => (
              <div
                key={server.id}
                className="server-box"
                style={{ animationDelay: `${i * 0.05}s`, position: "relative" }}
              >
                {/* Delete button */}
                <button
                  onClick={() => setConfirmId(server.id)}
                  title="Delete server"
                  style={{
                    position: "absolute", top: "12px", right: "12px",
                    background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)",
                    borderRadius: "6px", padding: "5px 8px", cursor: "pointer",
                    color: "#f87171", fontSize: "13px", lineHeight: 1,
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: "4px"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(220,38,38,0.25)";
                    e.currentTarget.style.borderColor = "rgba(220,38,38,0.5)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(220,38,38,0.1)";
                    e.currentTarget.style.borderColor = "rgba(220,38,38,0.25)";
                  }}
                >
                  🗑️ Delete
                </button>

                <h3 style={{ paddingRight: "80px" }}>{server.name}</h3>
                {server.description && <p>{server.description}</p>}
                {server.tags?.length > 0 && (
                  <div className="server-tags">
                    {server.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
                {server.github_url && (
                  <a href={server.github_url} target="_blank" rel="noreferrer">
                    View Repository →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}