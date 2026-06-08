import { useState } from "react";
import FileExplorer from "./components/FileExplorer";
import CodeEditor from "./components/CodeEditor";
import Terminal from "./components/Terminal";
import LogsPanel from "./components/LogsPanel";
import DBViewer from "./components/DBViewer";
import "./App.css";

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState("logs");

  return (
    <div className="app">
      <div className="topbar">
        <span className="logo">⚡ Web IDE</span>
      </div>
      <div className="main">
        <div className="left-panel">
          <FileExplorer onFileSelect={setSelectedFile} />
        </div>
        <div className="center-panel">
          <CodeEditor file={selectedFile} />
        </div>
        <div className="right-panel">
          <div className="tabs">
            {["logs", "terminal", "database"].map((t) => (
              <button
                key={t}
                className={activeTab === t ? "tab active" : "tab"}
                onClick={() => setActiveTab(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {activeTab === "logs" && <LogsPanel />}
            {activeTab === "terminal" && <Terminal />}
            {activeTab === "database" && <DBViewer />}
          </div>
        </div>
      </div>
    </div>
  );
}