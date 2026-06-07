import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function AddServer() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [installCommand, setInstallCommand] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    if (!name.trim() || name.trim().length < 2) {
      setError("Server name is required (min 2 characters).");
      return;
    }
    if (name.trim().length > 80) {
      setError("Server name must be 80 characters or fewer.");
      return;
    }
    if (description.trim().length > 500) {
      setError("Description must be 500 characters or fewer.");
      return;
    }
    if (githubUrl.trim()) {
      try { new URL(githubUrl); } catch {
        setError("Please enter a valid GitHub URL.");
        return;
      }
    }

    try {
      setLoading(true);
      await API.post("/servers", {
        name: name.trim(),
        description: description.trim(),
        github_url: githubUrl.trim(),
        install_command: installCommand.trim(),
        tags: tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean),
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ width: "520px" }}>
        <h1>Add MCP Server</h1>
        <p className="subtitle">Publish a new server to the registry</p>

        {error && <div className="error-banner">{error}</div>}

        <div style={{ position: "relative" }}>
          <input
            placeholder="Server name *"
            value={name}
            onChange={e => { setName(e.target.value); setError(""); }}
            maxLength={80}
          />
          <span style={{ position: "absolute", right: "12px", bottom: "10px", fontSize: "11px", color: name.length > 70 ? "#f87171" : "rgba(255,255,255,0.2)" }}>
            {name.length}/80
          </span>
        </div>

        <div style={{ position: "relative" }}>
          <textarea
            placeholder="Description — what does this server do?"
            value={description}
            onChange={e => { setDescription(e.target.value); setError(""); }}
            rows={3}
            maxLength={500}
          />
          <span style={{ position: "absolute", right: "12px", bottom: "10px", fontSize: "11px", color: description.length > 450 ? "#f87171" : "rgba(255,255,255,0.2)" }}>
            {description.length}/500
          </span>
        </div>

        <input
          placeholder="GitHub URL (e.g. https://github.com/org/repo)"
          value={githubUrl}
          onChange={e => { setGithubUrl(e.target.value); setError(""); }}
          type="url"
        />

        <input
          placeholder="Install command (e.g. npx @modelcontextprotocol/server-github)"
          value={installCommand}
          onChange={e => setInstallCommand(e.target.value)}
        />

        <input
          placeholder="Tags — comma separated (e.g. github, tools, api)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", marginTop: "6px", paddingLeft: "4px" }}>
          Up to 8 tags. Tags help users discover your server.
        </p>

        <button onClick={handleSubmit} disabled={loading || !name.trim()}>
          {loading ? "Publishing..." : "Publish Server"}
        </button>

        <p className="auth-footer">
          <span
            style={{ cursor: "pointer", color: "#818cf8" }}
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </span>
        </p>
      </div>
    </div>
  );
}