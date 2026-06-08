import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8000";

export default function DBViewer() {
  const [dbPath, setDbPath] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const loadTables = () => {
    axios.get(`${API}/api/database/tables`, { params: { db_path: dbPath } })
      .then((r) => setTables(r.data.tables));
  };

  const loadRows = (table, p = 1) => {
    setSelectedTable(table);
    axios.get(`${API}/api/database/rows`, { params: { db_path: dbPath, table, page: p, page_size: 50 } })
      .then((r) => { setColumns(r.data.columns); setRows(r.data.rows); setPage(p); });
  };

  const runQuery = () => {
    axios.post(`${API}/api/database/query`, { db_path: dbPath, query })
      .then((r) => { setColumns(r.data.columns); setRows(r.data.rows); });
  };

  return (
    <div className="db-viewer">
      <div className="db-controls">
        <input placeholder="SQLite DB path (absolute)" value={dbPath}
          onChange={(e) => setDbPath(e.target.value)} />
        <button onClick={loadTables}>Connect</button>
      </div>
      <div className="db-tables">
        {tables.map((t) => (
          <div key={t} className={`db-table-item ${selectedTable === t ? "active" : ""}`}
            onClick={() => loadRows(t)}>
            🗃 {t}
          </div>
        ))}
      </div>
      <div className="db-query">
        <input placeholder="SELECT * FROM ..." value={query}
          onChange={(e) => setQuery(e.target.value)} />
        <button onClick={runQuery}>Run</button>
      </div>
      <div className="db-results">
        {columns.length > 0 && (
          <table>
            <thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>{columns.map((c) => <td key={c}>{String(row[c] ?? "")}</td>)}</tr>
              ))}
            </tbody>
          </table>
        )}
        {selectedTable && (
          <div className="pagination">
            <button onClick={() => loadRows(selectedTable, page - 1)} disabled={page === 1}>◀</button>
            <span>Page {page}</span>
            <button onClick={() => loadRows(selectedTable, page + 1)}>▶</button>
          </div>
        )}
      </div>
    </div>
  );
}