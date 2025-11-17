import React, { useState } from "react";
import ResourceCard from "./ResourceCard";
import api from "../services/api"; // ✅ Backend centralizado

function SearchBar() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      // 🔥 Cargar todos los recursos desde el backend
      const response = await api.get("/recursos");

      const todos = response.data;

      // 🔍 Filtrar en frontend por título
      const coincidencias = todos.filter((r) =>
        r.titulo.toLowerCase().includes(query.toLowerCase())
      );

      setResultados(coincidencias);
    } catch (err) {
      console.error("Error al buscar recursos:", err);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <input
        type="text"
        value={query}
        placeholder="Buscar recurso..."
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "0.6rem",
          width: "300px",
          border: "1px solid #888",
          borderRadius: "4px",
        }}
      />

      <button
        onClick={handleSearch}
        style={{
          marginLeft: "8px",
          padding: "0.6rem 1.2rem",
          backgroundColor: "#C57A3D",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Buscar
      </button>

      <div style={{ marginTop: "2rem" }}>
        {loading ? (
          <p>Cargando resultados...</p>
        ) : resultados.length === 0 && query ? (
          <p style={{ color: "#777" }}>No se encontraron coincidencias.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1.5rem",
              padding: "0 2rem",
              marginTop: "2rem",
            }}
          >
            {resultados.map((recurso) => (
              <ResourceCard key={recurso.id_recurso} recurso={recurso} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
