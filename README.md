⚡ Web IDE

A browser-based Web IDE that lets you write, run, and manage full-stack Python projects (Django/Flask/FastAPI) directly in the browser.

**## Demo Video

👉 [Watch the Demo Video](https://drive.google.com/drive/folders/1XN9ofTP2_QGKpes8py-Y72-Amj9geeY_?usp=sharing)**

 Features

- 📁 File Explorer — create projects, navigate files, clone GitHub repos
- 📝 Code Editor — Monaco editor (VSCode's editor) with syntax highlighting
- ▶️ Process Runner — run Python servers, view live logs
- 💻 Interactive Terminal — PowerShell terminal in browser
- 🗃️ Database Viewer — browse SQLite tables, rows, run queries

Tech Stack

| Layer     | Tech                                    |
| --------- | --------------------------------------- |
| Frontend  | React + Vite + Monaco Editor + Xterm.js |
| Backend   | FastAPI (Python)                        |
| Terminal  | WebSocket + PowerShell                  |
| DB Viewer | SQLite                                  |
| Storage   | Local disk (workspace folder)           |

Architecture

Browser (React)
├── File Explorer → REST API → Local Disk
├── Code Editor → REST API → Read/Write Files
├── Logs Panel → REST API → Process stdout
├── Terminal → WebSocket → PowerShell
└── DB Viewer → REST API → SQLite

ARCHITECTURE DIAGRAM


<img width="922" height="824" alt="image" src="https://github.com/user-attachments/assets/0596250e-a395-4c77-9967-1c1355354975" />



Setup & Run

Prerequisites

- Python 3.10+
- Node.js 18+
- Git

Backend

bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000


Frontend

bash
cd frontend
npm install
npm run dev


Open `http://localhost:5173`

Usage

1. Type a project name → click **+ New** to create a project
2. Or paste a GitHub URL → click **Clone**
3. Click files in explorer to edit in Monaco editor
4. Go to **LOGS** tab → enter project path + command → click **▶ Run**
5. Go to **TERMINAL** tab → type commands → press Enter
6. Go to **DATABASE** tab → enter SQLite path → click **Connect**


