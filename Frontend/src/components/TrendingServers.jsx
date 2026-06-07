import { useEffect, useState } from "react";
import API from "../api/api";

const FALLBACK = [
  { name: "Filesystem MCP",   url: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem" },
  { name: "GitHub MCP",       url: "https://github.com/github/github-mcp-server" },
  { name: "PostgreSQL MCP",   url: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres" },
  { name: "Google Drive MCP", url: "https://github.com/modelcontextprotocol/servers" },
  { name: "Slack MCP",        url: "https://github.com/modelcontextprotocol/servers" },
  { name: "Memory MCP",       url: "https://github.com/modelcontextprotocol/servers/tree/main/src/memory" },
  { name: "Git MCP",          url: "https://github.com/modelcontextprotocol/servers/tree/main/src/git" },
  { name: "Brave Search MCP", url: "https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search" },
];

export default function TrendingServers() {
  const [servers, setServers] = useState(FALLBACK);

  useEffect(() => {
    API.get("/servers?sort=views&limit=12")
      .then(({ data }) => {
        if (data.servers?.length >= 4) {
          setServers(data.servers.map(s => ({
            name: s.name,
            url: s.github_url || "#",
          })));
        }
      })
      .catch(() => {}); // silently fall back to hardcoded list
  }, []);

  const items = [...servers, ...servers, ...servers];

  return (
    <div className="marquee">
      <div className="track">
        {items.map((server, index) => (
          <a
            key={index}
            href={server.url !== "#" ? server.url : undefined}
            target={server.url !== "#" ? "_blank" : undefined}
            rel="noreferrer"
            className="server-card"
            style={{ textDecoration: "none", cursor: server.url !== "#" ? "pointer" : "default" }}
          >
            🚀 {server.name}
          </a>
        ))}
      </div>
    </div>
  );
}
