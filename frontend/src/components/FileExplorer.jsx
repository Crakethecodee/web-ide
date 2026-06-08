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

  return (
    <div className="explorer">
      <div className="explorer-header">EXPLORER</div>
      <div className="explorer-actions">
        <input placeholder="Project name" value={projectName}
          onChange={(e) => setProjectName(e.target.value)} />
        <button onClick={createProject}>+ New</button>
      </div>
      <div className="explorer-actions">
        <input placeholder="GitHub URL" value={cloneUrl}
          onChange={(e) => setCloneUrl(e.target.value)} />
        <input placeholder="Folder name" value={cloneName}
          onChange={(e) => setCloneName(e.target.value)} />
        <button onClick={cloneRepo}>Clone</button>
      </div>
      <div className="tree">
        {tree ? <TreeNode node={tree} onFileSelect={onFileSelect} /> : "Loading..."}
      </div>
    </div>
  );
}