import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api"; // ✅ USO CENTRALIZADO
import * as mammoth from "mammoth";
import * as XLSX from "xlsx";

function ResourceGrid() {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Cargar recursos desde backend en Render
  useEffect(() => {
    const cargarRecursos = async () => {
      try {
        const res = await api.get("/recursos");
        setRecursos(res.data);
      } catch (err) {
        console.error("❌ Error al cargar recursos:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarRecursos();
  }, []);

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem", color: "white" }}>
        Cargando recursos...
      </p>
    );
  }

  const getPreviewUrl = (recurso) => {
    return `${import.meta.env.VITE_API_URL}/recursos/${
      recurso.id_recurso
    }/archivo`;
  };

  const renderPreview = (r) => {
    const fileUrl = getPreviewUrl(r);

    if (r.tipo === "IMAGE" || r.tipo === "INFOGRAFIA") {
      return <img src={fileUrl} alt={r.titulo} style={styles.preview} />;
    }

    if (r.tipo === "VIDEO") {
      return <video src={fileUrl} style={styles.preview} controls />;
    }

    if (r.tipo === "AUDIO") {
      return (
        <audio controls style={{ width: "100%" }}>
          <source src={fileUrl} type="audio/mpeg" />
        </audio>
      );
    }

    if (r.tipo === "PDF") {
      return (
        <embed src={fileUrl} type="application/pdf" style={styles.preview} />
      );
    }

    if (["DOCX", "TXT", "RTF", "ODT", "HTML", "XLSX"].includes(r.tipo)) {
      return <DocPreview recurso={r} url={fileUrl} />;
    }

    return <div style={styles.previewAlt}>📄 {r.tipo}</div>;
  };

  const getIconForType = (tipo) => {
    switch (tipo) {
      case "PDF":
        return "📄";
      case "DOCX":
      case "RTF":
      case "ODT":
      case "TXT":
        return "🧾";
      case "XLSX":
        return "📊";
      case "AUDIO":
        return "🎧";
      case "VIDEO":
        return "🎥";
      case "IMAGE":
      case "INFOGRAFIA":
        return "🖼️";
      case "HTML":
        return "🌐";
      default:
        return "📁";
    }
  };

  return (
    <section style={styles.grid}>
      {recursos.slice(0, 15).map((r) => (
        <div key={r.id_recurso} style={styles.card} className="hover-card">
          {renderPreview(r)}

          <h3 style={styles.title}>{r.titulo}</h3>
          <p style={styles.desc}>{r.descripcion_corta || "Sin descripción"}</p>

          <div style={styles.footer}>
            <span style={styles.icon}>{getIconForType(r.tipo)}</span>

            <Link to={`/portal/recurso/${r.id_recurso}`} style={styles.btn}>
              Ver recurso
            </Link>
          </div>
        </div>
      ))}

      {/* Animación hover */}
      <style>
        {`
          .hover-card {
            transition: all 0.3s ease;
          }
          .hover-card:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 20px rgba(0,0,0,0.4);
          }
        `}
      </style>
    </section>
  );
}

/* 🧠 Componente interno para vista previa de documentos */
function DocPreview({ recurso, url }) {
  const [contenido, setContenido] = useState("Cargando vista previa...");

  useEffect(() => {
    const cargarVista = async () => {
      try {
        const res = await api.get(`/recursos/${recurso.id_recurso}/descargar`, {
          responseType: "arraybuffer",
        });

        const buffer = res.data;

        switch (recurso.tipo) {
          case "DOCX": {
            const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
            const texto = result.value
              .replace(/<[^>]+>/g, "")
              .replace(/\s+/g, " ")
              .trim()
              .slice(0, 200);
            setContenido(texto || "Vista previa no disponible.");
            break;
          }

          case "TXT":
          case "RTF":
          case "ODT":
          case "HTML": {
            const text = new TextDecoder("utf-8").decode(buffer);
            setContenido(text.slice(0, 200) + "...");
            break;
          }

          case "XLSX": {
            const workbook = XLSX.read(buffer, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const preview = rows.slice(0, 3);
            const html = `
              <table border="1" style="border-collapse:collapse;width:100%;font-size:0.8rem;color:#000;">
                ${preview
                  .map(
                    (row) =>
                      `<tr>${row
                        .map((c) => `<td>${c || ""}</td>`)
                        .join("")}</tr>`
                  )
                  .join("")}
              </table>
            `;
            setContenido(html);
            break;
          }

          default:
            setContenido("Vista previa no disponible.");
        }
      } catch (err) {
        console.error("❌ Error en vista previa:", err);
        setContenido("Vista previa no disponible.");
      }
    };

    cargarVista();
  }, [recurso]);

  return (
    <div
      style={styles.docPreview}
      dangerouslySetInnerHTML={{ __html: contenido }}
    />
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1.5rem",
    padding: "2rem 5%",
    justifyItems: "center",
  },
  card: {
    backgroundColor: "#1C2B29",
    color: "white",
    padding: "1rem",
    borderRadius: "10px",
    textAlign: "center",
    width: "100%",
    maxWidth: "360px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  },
  preview: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "0.8rem",
  },
  docPreview: {
    backgroundColor: "#f4f1eb",
    color: "#3d2c1d",
    borderRadius: "8px",
    textAlign: "left",
    padding: "0.8rem",
    height: "180px",
    overflow: "hidden",
    fontSize: "0.9rem",
    lineHeight: "1.4",
    marginBottom: "0.8rem",
    fontFamily: "'Quicksand', sans-serif",
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
  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
  },
  icon: {
    fontSize: "1.4rem",
  },
  btn: {
    backgroundColor: "#C57A3D",
    color: "white",
    padding: "0.6rem 1rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },
};

export default ResourceGrid;
