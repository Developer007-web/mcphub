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
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!name) return alert("Server name is required");
    try {
      setLoading(true);
      await API.post("/servers", {
        name,
        description,
        github_url: githubUrl,
        install_command: installCommand,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean)
      });
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ width: "520px" }}>
        <h1>Add MCP Server</h1>
        <p className="subtitle">Publish a new server to the registry</p>

        <input
          placeholder="Server name *"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <textarea
          placeholder="Description — what does this server do?"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
        />

        <input
          placeholder="GitHub URL"
          value={githubUrl}
          onChange={e => setGithubUrl(e.target.value)}
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

        <button onClick={handleSubmit} disabled={loading}>
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