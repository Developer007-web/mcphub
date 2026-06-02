````markdown
# MCPHub 🚀

A lightweight, AI-powered MCP (Model Context Protocol) Registry built with **HTML, CSS, JavaScript, and Groq API**. MCPHub acts as a mini npm-style registry where developers can discover, search, and submit MCP servers for AI applications and agent workflows.

## ✨ Features

- 🔍 Real-time MCP server search
- 📦 MCP server registry cards
- 🤖 AI-powered MCP Assistant using Groq
- 📝 Submit new MCP servers
- 🏷️ Automatic tag and description generation
- 📋 Copy installation commands
- 🌙 Modern dark theme inspired by GitHub and npm
- 📱 Fully responsive design
- ⚡ Lightweight and fast
- 🗂️ JSON-based local data storage

---

## 📂 Project Structure

```text
mcphub/
│
├── index.html          # Main application page
├── styles.css          # UI styling
├── app.js              # Main application logic
├── groq.js             # Groq API integration
├── servers.json        # Registry data
│
├── assets/
│   ├── logo.svg
│   └── icons/
│
└── README.md
````

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript (ES6+)

### AI Integration

* Groq API
* Llama Models

### Storage

* Local JSON file
* Browser LocalStorage (optional future enhancement)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mcphub.git
cd mcphub
```

### 2. Add Your Groq API Key

Open `groq.js`

```javascript
const GROQ_API_KEY = "YOUR_GROQ_API_KEY";
```

Replace with your actual API key.

---

### 3. Run the Project

Since this is a frontend-only project:

#### Option 1: Live Server (Recommended)

Install the **Live Server** extension in VS Code.

Then:

```bash
Right Click index.html
→ Open with Live Server
```

#### Option 2: Python Server

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

---

## 📦 MCP Server Registry

Each MCP server contains:

```json
{
  "id": 1,
  "name": "Filesystem MCP",
  "author": "Anthropic",
  "description": "Access and manage local files.",
  "tags": ["filesystem", "storage"],
  "category": "File Management",
  "github": "https://github.com/example",
  "install": "npx package-name"
}
```

---

## 🤖 AI Assistant

The built-in AI assistant can answer questions such as:

* Find MCP servers for databases
* Best MCP tools for AI agents
* Suggest MCP servers for file management
* Show MCP servers related to GitHub
* Which MCP server should I use for automation?

The assistant analyzes registry data and returns intelligent recommendations using the Groq API.

---

## 🎨 UI Components

### Registry Cards

Display:

* Server Name
* Description
* Author
* Tags
* Category
* GitHub Repository

### Server Modal

Includes:

* Detailed Information
* Installation Command
* Copy Button
* GitHub Link

### Submission Form

Allows users to:

* Add MCP Servers
* Generate AI Metadata
* Categorize Packages

---

## 🔮 Future Enhancements

* User Authentication
* Package Ratings
* Comments & Reviews
* Trending MCP Servers
* Package Analytics
* Server Verification
* GitHub Repository Auto-Sync
* MCP Categories Dashboard
* Version Management
* Backend API
* Database Support (PostgreSQL/Supabase)
* Admin Dashboard

---

## 📸 Screenshots

Add screenshots here after deployment.

```text
screenshots/
├── homepage.png
├── registry.png
├── assistant.png
└── server-modal.png
```

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request


## 🌟 Acknowledgements

* Model Context Protocol (MCP)
* Groq API
* Open Source Community
* GitHub Design Inspiration
* npm Registry Inspiration



```
```
