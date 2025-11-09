import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import * as mammoth from "mammoth";
import * as XLSX from "xlsx";

function ResourceGrid() {
  const [recursos, setRecursos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/recursos")
      .then((res) => setRecursos(res.data))
      .catch((err) => console.error("Error al cargar recursos:", err));
  }, []);

  const renderPreview = (r) => {
    if (r.tipo === "IMAGE" || r.tipo === "INFOGRAFIA") {
      return <img src={r.url_origen} alt={r.titulo} style={styles.preview} />;
    } else if (r.tipo === "VIDEO") {
      return <video src={r.url_origen} style={styles.preview} controls />;
    } else if (r.tipo === "PDF") {
      return <embed src={r.url_origen} type="application/pdf" style={styles.preview} />;
    } else if (r.tipo === "AUDIO") {
      return (
        <audio controls style={{ width: "100%" }}>
          <source src={r.url_origen} type="audio/mpeg" />
        </audio>
      );
    } else if (["DOCX", "TXT", "RTF", "ODT", "HTML", "XLSX"].includes(r.tipo)) {
      return <DocPreview recurso={r} />;
    } else {
      return <div style={styles.previewAlt}>📄 {r.tipo}</div>;
    }
  };

  const getIconForType = (tipo) => {
    switch (tipo) {
      case "PDF": return "📄";
      case "DOCX": case "RTF": case "ODT": case "TXT": return "🧾";
      case "XLSX": return "📊";
      case "AUDIO": return "🎧";
      case "VIDEO": return "🎥";
      case "IMAGE": case "INFOGRAFIA": return "🖼️";
      case "HTML": return "🌐";
      default: return "📁";
    }
  };

  return (
    <section style={styles.grid}>
      {recursos.map((r) => (
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

      {/* Efecto de agrandarse */}
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
function DocPreview({ recurso }) {
  const [contenido, setContenido] = useState("Cargando vista previa...");

  useEffect(() => {
    const cargarVista = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/recursos/${recurso.id_recurso}/descargar`,
          { responseType: "arraybuffer" }
        );
        const buffer = res.data;

        switch (recurso.tipo) {
          case "DOCX":
            try {
              const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
              let textoLimpio = result.value
                .replace(/<[^>]+>/g, "")
                .replace(/\s+/g, " ")
                .trim();

              if (!textoLimpio) {
                const textoBruto = new TextDecoder("utf-8").decode(buffer);
                textoLimpio = textoBruto.slice(0, 300);
              }

              setContenido(
                textoLimpio
                  ? textoLimpio.slice(0, 200) + "..."
                  : "Vista previa no disponible."
              );
            } catch (err) {
              console.error("Error al leer DOCX:", err);
              setContenido("Error al procesar documento Word.");
            }
            break;

          case "TXT":
          case "RTF":
          case "ODT":
          case "HTML":
            const texto = new TextDecoder("utf-8").decode(buffer);
            setContenido(texto.slice(0, 200) + "...");
            break;

          case "XLSX":
            const workbook = XLSX.read(buffer, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const primerasFilas = rows.slice(0, 3);
            const htmlPreview = `
              <table border="1" style="border-collapse:collapse;width:100%;font-size:0.8rem;color:#000;">
                ${primerasFilas
                  .map((row) => `<tr>${row.map((c) => `<td>${c || ""}</td>`).join("")}</tr>`)
                  .join("")}
              </table>`;
            setContenido(htmlPreview);
            break;

          default:
            setContenido("Vista previa no disponible.");
            break;
        }
      } catch (err) {
        console.error("Error en vista previa:", err);
        setContenido("Vista previa no disponible.");
      }
    };

    cargarVista();
  }, [recurso]);

  return (
    <div
      style={styles.docPreview}
      dangerouslySetInnerHTML={{ __html: contenido }}
    ></div>
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
