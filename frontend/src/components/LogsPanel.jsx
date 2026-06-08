import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8000";

export default function LogsPanel() {
  const [projectPath, setProjectPath] = useState("");
  const [command, setCommand] = useState("python hello.py");
  const [logs, setLogs] = useState("");
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const start = async () => {
    if (!projectPath) return alert("Enter project path first");
    try {
      await axios.post(`${API}/api/process/run`, { project_path: projectPath, command });
      setRunning(true);
      setLogs("");
      intervalRef.current = setInterval(async () => {
        const r = await axios.get(`${API}/api/process/logs`, {
          params: { project_path: projectPath }
        });
        if (r.data.logs) setLogs((prev) => prev + r.data.logs);
      }, 1000);
    } catch (e) {
      setLogs("Error starting process: " + e.message);
    }
  };

  const stop = async () => {
    try {
      await axios.post(`${API}/api/process/stop`, { project_path: projectPath, command });
    } catch (_) {}
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  return (
    <div className="logs-panel">
      <div className="logs-controls">
        <input
          id="project-path"
          placeholder="Project path (absolute)"
          value={projectPath}
          onChange={(e) => setProjectPath(e.target.value)}
        />
        <input
          id="run-command"
          placeholder="Command e.g. python hello.py"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        />
        <div style={{ display: "flex", gap: "4px" }}>
          <button onClick={start} disabled={running}>▶ Run</button>
          <button onClick={stop} disabled={!running}>■ Stop</button>
        </div>
      </div>
      <div className="logs-output">
        <pre>{logs || "No logs yet. Enter path and click Run."}</pre>
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}