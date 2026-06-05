const servers = [
  {
    name: "Filesystem MCP",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem"
  },
  {
    name: "GitHub MCP",
    url: "https://github.com/github/github-mcp-server"
  },
  {
    name: "PostgreSQL MCP",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres"
  },
  {
    name: "Google Drive MCP",
    url: "https://github.com/modelcontextprotocol/servers"
  },
  {
    name: "Slack MCP",
    url: "https://github.com/modelcontextprotocol/servers"
  },
  {
    name: "Memory MCP",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/memory"
  },
  {
    name: "Git MCP",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/git"
  },
  {
    name: "SQLite MCP",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite"
  }
];

export default function TrendingServers() {
  return (
    <div className="marquee">
      <div className="track">
        {[...servers, ...servers, ...servers].map(
          (server, index) => (
            <a
              key={index}
              href={server.url}
              target="_blank"
              rel="noreferrer"
              className="server-card"
            >
              🚀 {server.name}
            </a>
          )
        )}
      </div>
    </div>
  );
}