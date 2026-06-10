import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000";

function TreeNode({ node, onFileSelect }) {
  const [open, setOpen] = useState(false);

  if (node.type === "file") {
    return (
      <div className="tree-file" onClick={() => onFileSelect(node)}>
        📄 {node.name}
      </div>
    );
  }
  return (
    <div>
      <div className="tree-folder" onClick={() => setOpen(!open)}>
        {open ? "📂" : "📁"} {node.name}
      </div>
      {open && (
        <div className="tree-children">
          {node.children?.map((child, i) => (
            <TreeNode key={i} node={child} onFileSelect={onFileSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileExplorer({ onFileSelect }) {
  const [tree, setTree] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [cloneUrl, setCloneUrl] = useState("");
  const [cloneName, setCloneName] = useState("");
  const [newFilePath, setNewFilePath] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);

  const fetchTree = () => {
    axios.get(`${API}/api/files/tree`).then((r) => setTree(r.data));
  };

  useEffect(() => { fetchTree(); }, []);

  const createProject = () => {
    if (!projectName) return;
    axios.post(`${API}/api/files/create-project`, { name: projectName })
      .then(() => { fetchTree(); setProjectName(""); });
  };

  const cloneRepo = () => {
    if (!cloneUrl || !cloneName) return;
    axios.post(`${API}/api/files/clone`, { url: cloneUrl, name: cloneName })
      .then(() => { fetchTree(); setCloneUrl(""); setCloneName(""); });
  };

  const createFile = () => {
    if (!newFilePath) return;
    axios.post(`${API}/api/files/write`, { path: newFilePath, content: "" })
      .then(() => { fetchTree(); setNewFilePath(""); setShowNewFile(false); });
  };

  return (
    <div className="explorer">
      <div className="explorer-header">EXPLORER</div>

      {/* Create Project */}
      <div className="explorer-actions">
        <input id="project-name" placeholder="Project name" value={projectName}
          onChange={(e) => setProjectName(e.target.value)} />
        <button onClick={createProject}>+ New</button>
      </div>

      {/* Clone Repo */}
      <div className="explorer-actions">
        <input id="clone-url" placeholder="GitHub URL" value={cloneUrl}
          onChange={(e) => setCloneUrl(e.target.value)} />
        <input id="clone-name" placeholder="Folder name" value={cloneName}
          onChange={(e) => setCloneName(e.target.value)} />
        <button onClick={cloneRepo}>Clone</button>
      </div>

      {/* New File */}
      <div className="explorer-actions">
        <button onClick={() => setShowNewFile(!showNewFile)}>
          {showNewFile ? "✕ Cancel" : "📄 New File"}
        </button>
      </div>
      {showNewFile && (
        <div className="explorer-actions">
          <input
            id="new-file-path"
            placeholder="e.g. workspace/myapp/main.py"
            value={newFilePath}
            onChange={(e) => setNewFilePath(e.target.value)}
          />
          <button onClick={createFile}>Create</button>
        </div>
      )}

      {/* File Tree */}
      <div className="tree">
        {tree ? <TreeNode node={tree} onFileSelect={onFileSelect} /> : "Loading..."}
      </div>
    </div>
  );
}