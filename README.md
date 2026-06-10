⚡ Web IDE

A browser-based Web IDE that lets you write, run, and manage full-stack Python projects (Django/Flask/FastAPI) directly in the browser.

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


Browser
   │
   ├── HTTP (REST API)
   └── WebSocket
         │
┌─────────────────────────────────────────────────────┐
│              React Frontend (localhost:5173)          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │File Explorer│  │Code Editor  │  │  DB Viewer  │  │
│  │  Tree view  │  │Monaco+Format│  │Tables+Query │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│  ┌─────────────┐  ┌─────────────┐                    │
│  │ Logs Panel  │  │  Terminal   │                    │
│  │stdout/stderr│  │  Xterm.js   │                    │
│  └─────────────┘  └─────────────┘                    │
└─────────────────────────────────────────────────────┘
         │ REST API + WebSocket
┌─────────────────────────────────────────────────────┐
│             FastAPI Backend (localhost:8000)          │
│  ┌─────────────┐  ┌─────────────┐                    │
│  │  files.py   │  │ process.py  │                    │
│  │read/write   │  │run/stop/logs│                    │
│  └─────────────┘  └─────────────┘                    │
│  ┌─────────────┐  ┌─────────────┐                    │
│  │ terminal.py │  │ database.py │                    │
│  │ WebSocket   │  │SQLite viewer│                    │
│  └─────────────┘  └─────────────┘                    │
└─────────────────────────────────────────────────────┘
         │                        │
┌────────────────┐    ┌──────────────────────┐
│    Workspace   │    │   External Services  │
│  Project files │    │  GitHub + PowerShell │
│  SQLite DBs    │    │                      │
└────────────────┘    └──────────────────────┘

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


