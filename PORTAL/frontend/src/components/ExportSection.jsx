// 📁 src/components/ExportSection.jsx
import React, { useState } from "react";
import api from "../services/api";

/**
 * 📥 ExportSection
 * Permite a la psicóloga exportar los informes en formato Excel o PDF.
 * Por ahora devuelve un mensaje de confirmación.
 */

function ExportSection() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const exportar = async (formato) => {
    setLoading(true);
    setMensaje("");
    try {
      const res = await api.get(`/informes/exportar/${formato}`);
      if (res.data.message) {
        setMensaje(res.data.message);
      } else if (res.data.error) {
        setMensaje(`⚠️ ${res.data.error}`);
      } else {
        setMensaje("Exportación completada.");
      }
    } catch (error) {
      console.error("Error al exportar:", error);
      setMensaje("❌ Error al exportar los informes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>📥 Exportar informes</h2>
      <p style={styles.text}>
        Puedes exportar los informes generales en formato Excel o PDF.
        <br />
        (La descarga directa estará disponible cuando se completen los datos del
        juego.)
      </p>

      <div style={styles.btnContainer}>
        <button
          onClick={() => exportar("excel")}
          style={styles.btnExcel}
          disabled={loading}
        >
          📊 Exportar a Excel
        </button>
        <button
          onClick={() => exportar("pdf")}
          style={styles.btnPdf}
          disabled={loading}
        >
          📄 Exportar a PDF
        </button>
      </div>

      {mensaje && <p style={styles.message}>{mensaje}</p>}
    </section>
  );
}

/* 🎨 ESTILOS */
const styles = {
  section: {
    margin: "0.5rem auto",
    padding: "1rem",
    maxWidth: "800px",
    backgroundColor: "#1C2B29",
    color: "white",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
  },
  title: {
    color: "#FFDAB3",
    fontWeight: "bold",
    fontSize: "1.3rem",
    marginBottom: "0.8rem",
  },
  text: {
    color: "white",
    opacity: 0.9,
    marginBottom: "1.5rem",
    lineHeight: "1.5",
  },
  btnContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  btnExcel: {
    backgroundColor: "#5F736A",
    color: "white",
    border: "none",
    padding: "0.8rem 1.5rem",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  btnPdf: {
    backgroundColor: "#C57A3D",
    color: "white",
    border: "none",
    padding: "0.8rem 1.5rem",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  message: {
    marginTop: "1rem",
    color: "#FFDAB3",
    fontWeight: "600",
  },
};

export default ExportSection;
