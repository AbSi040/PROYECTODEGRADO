import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function RecursoDetalle() {
  const { id } = useParams();
  const [recurso, setRecurso] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/recursos/${id}`)
      .then(res => setRecurso(res.data))
      .catch(err => console.error("Error al obtener recurso:", err));
  }, [id]);

  if (!recurso) return <p style={{ textAlign: "center" }}>Cargando recurso...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{recurso.titulo}</h1>
      <div style={styles.content}>
        <div style={styles.media}>
          {recurso.tipo === "IMAGE" ? (
            <img src={recurso.archivo || recurso.url_origen} alt={recurso.titulo} style={styles.viewer} />
          ) : recurso.tipo === "VIDEO" ? (
            <video src={recurso.archivo || recurso.url_origen} controls style={styles.viewer}></video>
          ) : recurso.tipo === "PDF" ? (
            <iframe src={recurso.archivo || recurso.url_origen} title="PDF" style={styles.viewer}></iframe>
          ) : (
            <p>No hay vista previa disponible</p>
          )}
        </div>
        <div style={styles.info}>
          <p>{recurso.descripcion_corta || "Sin descripción disponible"}</p>
          <a href={recurso.archivo || recurso.url_origen} download style={styles.btn}>
            ⬇ Descargar recurso
          </a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "2rem", color: "#4E3B2B" },
  title: { textAlign: "center", fontWeight: "bold", fontSize: "2rem", marginBottom: "1rem" },
  content: { display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" },
  media: { flex: "1", background: "#1C2B29", padding: "1rem", borderRadius: "10px" },
  info: { flex: "1", background: "#6B7E77", padding: "1rem", borderRadius: "10px" },
  viewer: { width: "100%", height: "400px", borderRadius: "10px", objectFit: "contain" },
  btn: {
    display: "inline-block",
    backgroundColor: "#C57A3D",
    color: "white",
    padding: "0.8rem 1.4rem",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default RecursoDetalle;
