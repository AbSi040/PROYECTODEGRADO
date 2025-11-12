import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import * as mammoth from "mammoth";
import * as XLSX from "xlsx";
import Navbar from "../components/Navbar";

function RecursoDetalle() {
  const { id } = useParams();
  const [recurso, setRecurso] = useState(null);
  const [contenido, setContenido] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/recursos/${id}`)
      .then((res) => setRecurso(res.data))
      .catch((err) => console.error("Error al cargar recurso:", err));
  }, [id]);

  useEffect(() => {
    if (!recurso) return;

    const cargarVista = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/recursos/${recurso.id_recurso}/descargar`,
          { responseType: "arraybuffer" }
        );
        const buffer = res.data;

        switch (recurso.tipo) {
          case "PDF":
            setContenido(
              `<embed src="${recurso.url_origen}" type="application/pdf" width="100%" height="1380" />`
            );
            break;
          case "DOCX":
            const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
            setContenido(result.value);
            break;
          case "XLSX":
            const workbook = XLSX.read(buffer, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const html = XLSX.utils.sheet_to_html(sheet);
            setContenido(html);
            break;
          case "IMAGE":
          case "INFOGRAFIA":
            setContenido(
              `<img src="${recurso.url_origen}" alt="${recurso.titulo}" style="width:100%;border-radius:10px" />`
            );
            break;
          case "VIDEO":
            setContenido(
              `<video controls style="width:100%;border-radius:10px"><source src="${recurso.url_origen}" type="video/mp4" /></video>`
            );
            break;
          case "AUDIO":
            setContenido(
              `<audio controls style="width:100%"><source src="${recurso.url_origen}" type="audio/mpeg" /></audio>`
            );
            break;
          default:
            const text = new TextDecoder("utf-8").decode(buffer);
            setContenido(`<pre>${text}</pre>`);
        }
      } catch (err) {
        console.error("Error al mostrar vista previa:", err);
        setContenido("<p>Error al cargar contenido.</p>");
      }
    };

    cargarVista();
  }, [recurso]);

  const descargarArchivo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/recursos/${id}/descargar`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", recurso.titulo);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert("No se pudo descargar el recurso.");
    }
  };

  if (!recurso) return <p>Cargando recurso...</p>;

  return (
    <div style={styles.page}>
       <Navbar/>

      <div style={styles.topBar}>
        <Link to="/" style={styles.backBtn}>
          ← Volver
        </Link>
      </div>

      {/* === CONTENEDOR PRINCIPAL === */}
      <div style={styles.mainContainer}>
        {/* Vista principal */}
        <div style={styles.previewBox}>
          <div dangerouslySetInnerHTML={{ __html: contenido }} />
        </div>

        {/* Panel lateral con info y relacionados */}
        <div style={styles.sidePanel}>
          <div style={styles.infoBox}>
            <h2 style={styles.title}>{recurso.titulo}</h2>
            <p>{recurso.descripcion_corta}</p>
            <p>
              <strong>Tipo:</strong> {recurso.tipo}
            </p>
            <p>
              <strong>Autor o fuente:</strong> {recurso.autor_fuente}
            </p>
            <button onClick={descargarArchivo} style={styles.downloadBtn}>
              ↓ Descargar recurso
            </button>
          </div>

          <section style={styles.relatedPanel}>
            <h3 style={styles.relatedTitle}>Recursos relacionados</h3>
            <div style={styles.relatedGrid}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} style={styles.relatedCard}>
                  <div style={styles.relatedPreview}></div>
                  <h4 style={styles.relatedText}>Recurso #{i}</h4>
                  <button style={styles.relatedBtn}>Ver recurso</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* 🎨 ESTILOS MEJORADOS */
const styles = {
  page: {
    paddingTop: "5rem",
    backgroundColor: "#D9D9D9",
    minHeight: "100vh",
    paddingBottom: "2rem",
  },
  topBar: {
    display: "flex",
    justifyContent: "flex-start",
    padding: "1rem 2rem",
  },
  backBtn: {
    display: "inline-block",
    backgroundColor: "#C57A3D",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    fontWeight: "bold",
    textDecoration: "none",
    cursor: "pointer",
    boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
    transition: "all 0.3s ease",
    fontSize: "0.9rem",
  },
  mainContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch",
    flexWrap: "wrap",
    padding: "1rem 2rem",
    gap: "1.5rem",
  },
  previewBox: {
    flex: "1 1 65%",
    backgroundColor: "#1C2B29",
    color: "white",
    borderRadius: "10px",
    padding: "2rem",
    boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
    overflowY: "auto",
    minHeight: "600px",
    maxHeight: "1380px",
  },
  sidePanel: {
    flex: "1 1 32%",
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
    minHeight: "600px",
  },
  infoBox: {
    backgroundColor: "#5F736A",
    color: "white",
    borderRadius: "10px",
    padding: "1.2rem",
    boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
    flexShrink: 0,
  },
  title: {
    color: "#FFDAB3",
    fontWeight: "700",
    fontSize: "1.3rem",
    marginBottom: "0.5rem",
  },
  downloadBtn: {
    backgroundColor: "#C57A3D",
    border: "none",
    color: "white",
    borderRadius: "8px",
    padding: "0.8rem 1.2rem",
    fontWeight: "bold",
    marginTop: "0.8rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "100%",
  },
  relatedPanel: {
    backgroundColor: "#5F736A",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
    flex: 1,
    overflowY: "auto",
  },
  relatedTitle: {
    color: "white",
    textAlign: "center",
    marginBottom: "1rem",
    fontSize: "1.1rem",
  },
  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  relatedCard: {
    backgroundColor: "#1C2B29",
    borderRadius: "10px",
    padding: "1rem",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    transition: "transform 0.3s ease",
  },
  relatedPreview: {
    backgroundColor: "#D9D9D9",
    height: "100px",
    borderRadius: "8px",
    marginBottom: "0.8rem",
  },
  relatedText: {
    color: "white",
    fontWeight: "bold",
    fontSize: "0.9rem",
    marginBottom: "0.5rem",
  },
  relatedBtn: {
    backgroundColor: "#C57A3D",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    fontSize: "0.85rem",
    width: "100%",
  },
};

/* 💡 Hover + Responsive */
const extraStyles = document.createElement("style");
extraStyles.innerHTML = `
  button:hover, a:hover {
    transform: scale(1.05);
    background-color: #A86430 !important;
  }

  @media (max-width: 1024px) {
    .mainContainer {
      flex-direction: column;
    }
  }

  @media (max-width: 768px) {
    .previewBox, .sidePanel {
      flex: 100%;
      min-height: auto !important;
    }

    .relatedGrid {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(extraStyles);

export default RecursoDetalle;