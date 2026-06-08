import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const API = "http://localhost:8000";

const extLang = {
  py: "python", js: "javascript", jsx: "javascript",
  html: "html", css: "css", json: "json", md: "markdown",
  txt: "plaintext", ts: "typescript", tsx: "typescript",
};

export default function CodeEditor({ file }) {
  const [content, setContent] = useState("// Select a file to edit");
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    if (!file) return;
    axios.get(`${API}/api/files/read`, { params: { path: file.path } })
      .then((r) => { setContent(r.data.content); setSaved(true); });
  }, [file]);

  const save = () => {
    if (!file) return;
    axios.post(`${API}/api/files/write`, { path: file.path, content })
      .then(() => setSaved(true));
  };

  const ext = file?.name.split(".").pop() || "txt";
  const language = extLang[ext] || "plaintext";

  return (
    <div className="editor-wrap">
      <div className="editor-topbar">
        <span>{file ? file.name : "No file selected"}</span>
        {!saved && <span className="unsaved">●</span>}
        <button onClick={save} disabled={!file}>Save (Ctrl+S)</button>
      </div>
      <Editor
        height="calc(100% - 36px)"
        language={language}
        value={content}
        theme="vs-dark"
        onChange={(v) => { setContent(v); setSaved(false); }}
        options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: "on" }}
      />
    </div>
  );
}