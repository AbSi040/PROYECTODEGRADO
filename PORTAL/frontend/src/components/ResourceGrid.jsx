import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ResourceGrid() {
  const [recursos, setRecursos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/recursos")
      .then(res => setRecursos(res.data))
      .catch(err => console.error("Error al cargar recursos:", err));
  }, []);

  return (
    <section style={styles.grid}>
      {recursos.map((r) => (
        <div key={r.id_recurso} style={styles.card}>
          {r.tipo === "IMAGE" || r.tipo === "INFOGRAFIA" ? (
            <img src={r.url_origen} alt={r.titulo} style={styles.preview} />
          ) : r.tipo === "VIDEO" ? (
            <video src={r.url_origen} style={styles.preview} controls />
          ) : r.tipo === "PDF" ? (
            <embed src={r.url_origen} type="application/pdf" style={styles.preview} />
          ) : r.tipo === "AUDIO" ? (
            <audio controls style={{ width: "100%" }}>
              <source src={r.url_origen} type="audio/mpeg" />
            </audio>
          ) : (
            <div style={styles.previewAlt}>📄 {r.tipo}</div>
          )}

          <h3 style={styles.title}>{r.titulo}</h3>
          <p style={styles.desc}>{r.descripcion_corta || "Sin descripción"}</p>
          <Link to={`/portal/recurso/${r.id_recurso}`} style={styles.btn}>
            Ver recurso
          </Link>
        </div>
      ))}
    </section>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1.5rem",
    padding: "1rem",
  },
  card: {
    backgroundColor: "#1C2B29",
    color: "white",
    padding: "1rem",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  },
  preview: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "0.8rem",
  },
  previewAlt: {
    backgroundColor: "#2E3C39",
    height: "180px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
  },
  title: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    margin: "0.5rem 0",
  },
  desc: {
    fontSize: "0.9rem",
    color: "#ccc",
    marginBottom: "1rem",
  },
  btn: {
    display: "inline-block",
    backgroundColor: "#C57A3D",
    color: "white",
    padding: "0.6rem 1rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default ResourceGrid;
