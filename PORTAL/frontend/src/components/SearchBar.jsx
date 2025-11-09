import { useState } from "react";
import axios from "axios";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);

  const manejarBusqueda = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const res = await axios.post("http://localhost:4000/api/buscar", { consulta: query });
    setResultados(res.data);
  };

  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      <form onSubmit={manejarBusqueda} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Buscar recurso..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "60%", padding: "0.8rem", borderRadius: "10px", border: "none" }}
        />
        <button type="submit" style={{width: 100, padding: "0.8rem 1.2rem", background: "#C57A3D", color: "white", border: "none", borderRadius: "8px", marginLeft: "0.5rem" }}>
          🔍 Buscar
        </button>
      </form>

      {resultados.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {resultados.map((r) => (
            <li key={r.id_recurso} style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
              ID: {r.id_recurso} — Similitud: {r.score}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
