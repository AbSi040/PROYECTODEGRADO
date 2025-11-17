import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as mammoth from "mammoth";
import * as XLSX from "xlsx";
import Navbar from "../components/Navbar";
import api from "../services/api"; // ✅ USO CORRECTO DEL BACKEND

function RecursoDetalle() {
  const { id } = useParams();
  const [recurso, setRecurso] = useState(null);
  const [contenido, setContenido] = useState("");

  // 👇 URL REAL del archivo en el backend
  const getFileUrl = (id) =>
    `${import.meta.env.VITE_API_URL}/recursos/${id}/archivo`;

  // ======================================================
  // 1. Cargar la info del recurso
  // ======================================================
  useEffect(() => {
    api
      .get(`/recursos/${id}`)
      .then((res) => setRecurso(res.data))
      .catch((err) => console.error("Error al cargar recurso:", err));
  }, [id]);

  // ======================================================
  // 2. Cargar vista previa del archivo
  // ======================================================
  useEffect(() => {
    if (!recurso) return;

    const cargarVista = async () => {
      try {
        const res = await api.get(`/recursos/${recurso.id_recurso}/descargar`, {
          responseType: "arraybuffer",
        });
        const buffer = res.data;
        const fileUrl = getFileUrl(recurso.id_recurso);

        switch (recurso.tipo) {
          case "PDF":
            setContenido(
              `<embed src="${fileUrl}" type="application/pdf" width="100%" height="100%" />`
            );
            break;

          case "DOCX": {
            const result = await mammoth.convertToHtml({
              arrayBuffer: buffer,
            });
            setContenido(
              result.value || "<p>No se pudo mostrar el documento.</p>"
            );
            break;
          }

          case "XLSX": {
            const workbook = XLSX.read(buffer, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const html = XLSX.utils.sheet_to_html(sheet);
            setContenido(html);
            break;
          }

          case "IMAGE":
          case "INFOGRAFIA":
            setContenido(
              `<img src="${fileUrl}" alt="${recurso.titulo}" style="width:100%;border-radius:10px" />`
            );
            break;

          case "VIDEO":
            setContenido(
              `<video controls style="width:100%;border-radius:10px">
                <source src="${fileUrl}" type="video/mp4" />
              </video>`
            );
            break;

          case "AUDIO":
            setContenido(
              `<audio controls style="width:100%">
                <source src="${fileUrl}" type="audio/mpeg" />
              </audio>`
            );
            break;

          default:
            const text = new TextDecoder("utf-8").decode(buffer);
            setContenido(`<pre>${text}</pre>`);
        }
      } catch (err) {
        console.error("Error al mostrar vista previa:", err);
        setContenido("<p>Error al mostrar vista previa.</p>");
      }
    };

    cargarVista();
  }, [recurso]);

  // ======================================================
  // 3. Descargar archivo
  // ======================================================
  const descargarArchivo = async () => {
    try {
      const response = await api.get(`/recursos/${id}/descargar`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", recurso.archivo || recurso.titulo);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("No se pudo descargar el recurso.");
    }
  };

  if (!recurso) return <p className="loading">Cargando recurso...</p>;

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.topBar}>
        <Link to="/" style={styles.backBtn}>
          ← Volver
        </Link>
      </div>

      <div style={styles.mainContainer}>
        {/* ===================== VISTA PRINCIPAL ===================== */}
        <div style={styles.previewBox}>
          <div dangerouslySetInnerHTML={{ __html: contenido }} />
        </div>

        {/* ===================== PANEL LATERAL ===================== */}
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

          {/* Panel de recursos relacionados (placeholder por ahora) */}
          <section style={styles.relatedPanel}>
            <h3 style={styles.relatedTitle}>Recursos relacionados</h3>

            <div style={styles.relatedGrid}>
              {[1, 2, 3, 4].map((i) => (
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

/* 🎨 ESTILOS */
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
    backgroundColor: "#C57A3D",
    color: "white",
    padding: "0.6rem 1rem",
    borderRadius: "8px",
    fontWeight: "bold",
    textDecoration: "none",
    transition: "0.3s",
  },
  mainContainer: {
    display: "flex",
    gap: "2rem",
    padding: "1rem 2rem",
    flexWrap: "wrap",
  },
  previewBox: {
    flex: "1 1 65%",
    backgroundColor: "#1C2B29",
    color: "white",
    borderRadius: "10px",
    padding: "2rem",
    overflowY: "auto",
    minHeight: "600px",
    maxHeight: "1380px",
  },
  sidePanel: {
    flex: "1 1 32%",
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  infoBox: {
    backgroundColor: "#5F736A",
    color: "white",
    borderRadius: "10px",
    padding: "1.2rem",
  },
  title: {
    color: "#FFDAB3",
    fontWeight: "700",
    marginBottom: "0.5rem",
  },
  downloadBtn: {
    backgroundColor: "#C57A3D",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "0.8rem",
    marginTop: "0.8rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
  relatedPanel: {
    backgroundColor: "#5F736A",
    borderRadius: "12px",
    padding: "1.5rem",
    flex: 1,
    overflowY: "auto",
  },
  relatedTitle: {
    color: "white",
    textAlign: "center",
    marginBottom: "1rem",
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
  },
  relatedBtn: {
    backgroundColor: "#C57A3D",
    color: "white",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
};

export default RecursoDetalle;
