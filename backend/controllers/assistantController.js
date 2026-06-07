import groq from "../config/groq.js";
import pool from "../config/supabase.js";

export const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    if (message.trim().length > 1000) {
      return res.status(400).json({ success: false, message: "Message too long (max 1000 chars)" });
    }

    // Fetch all servers to give the AI context
    const { rows: servers } = await pool.query(
      "SELECT name, description, tags, install_command, github_url FROM servers ORDER BY views DESC LIMIT 50"
    );

    const serverList = servers.length > 0
      ? servers.map(s =>
          `- **${s.name}**: ${s.description || "No description"} | Tags: ${(s.tags || []).join(", ")} | Install: ${s.install_command || "N/A"}`
        ).join("\n")
      : "No community servers yet.";

    const systemPrompt = `You are MCPHub Assistant — a helpful guide for the MCPHub MCP server registry.
Your job is to help users find, understand, and use MCP (Model Context Protocol) servers.

Here are the currently available community MCP servers in the registry:
${serverList}

Guidelines:
- Recommend relevant servers from the registry based on user needs
- Explain what MCP servers do and how to use them
- Help users understand install commands (they use npx)
- Be concise, friendly, and practical
- If no community server fits, suggest popular official ones (filesystem, github, postgres, memory, brave-search)
- Never make up server names or install commands`;

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message.trim() },
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response. Please try again.";

    return res.json({ success: true, reply });
  } catch (err) {
    console.error("Assistant error:", err.message);
    return res.status(500).json({ success: false, message: "Assistant unavailable. Please try again." });
  }
};