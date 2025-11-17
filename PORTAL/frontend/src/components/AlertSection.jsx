// 📁 src/components/AlertSection.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

/**
 * 🚨 AlertSection
 * Muestra alertas automáticas generadas por el sistema.
 * Actualmente usa datos placeholder porque el backend aún no genera alertas reales.
 */

function AlertSection() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======== PLACEHOLDER TEMPORAL ========
  const alertasPlaceholder = [
    {
      nombre: "Estudiante 6A - 12",
      tipo_alerta: "Riesgo emocional",
      nivel: "Amarillo",
    },
    {
      nombre: "Estudiante 6B - 4",
      tipo_alerta: "Conducta impulsiva recurrente",
      nivel: "Rojo",
    },
    {
      nombre: "Estudiante 6C - 8",
      tipo_alerta: "Sumisión constante",
      nivel: "Amarillo",
    },
  ];

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        // Intentar llamar al backend (aunque no exista el endpoint)
        await api.get("/informes");

        // Usar placeholder
        setAlertas(alertasPlaceholder);
      } catch (err) {
        console.warn("⚠ Backend sin alertas, usando placeholder:", err);
        setAlertas(alertasPlaceholder);
      } finally {
        setLoading(false);
      }
    };

    fetchAlertas();
  }, []);

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        ⏳ Cargando alertas...
      </p>
    );

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>🚨 Alertas automáticas del sistema</h2>

      {alertas.length === 0 ? (
        <p style={{ textAlign: "center", color: "#333" }}>
          No hay alertas generadas actualmente.
        </p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.headerCell}>Estudiante</th>
                <th style={styles.headerCell}>Tipo de alerta</th>
                <th style={styles.headerCell}>Nivel</th>
              </tr>
            </thead>
            <tbody>
              {alertas.map((a, i) => (
                <tr key={i} style={styles.row}>
                  <td style={styles.cell}>{a.nombre}</td>
                  <td style={styles.cell}>{a.tipo_alerta}</td>
                  <td style={styles.cellNivel(a.nivel)}>{a.nivel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* 🎨 ESTILOS */
const styles = {
  section: {
    margin: "2rem auto",
    padding: "1.5rem 2rem",
    borderRadius: "12px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
    backgroundColor: "#eeeeeeff",
    maxWidth: "1300px",
  },
  title: {
    color: "#1C2B29",
    fontWeight: "700",
    marginBottom: "1rem",
    textAlign: "center",
    fontSize: "1.4rem",
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#5F736A",
    color: "white",
    borderRadius: "10px",
  },
  headerCell: {
    padding: "1rem",
    textAlign: "left",
    backgroundColor: "#4a5f57",
    fontWeight: "bold",
  },
  row: {
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  cell: {
    padding: "0.8rem 1rem",
    textAlign: "left",
    verticalAlign: "middle",
  },
  cellNivel: (nivel) => ({
    padding: "0.8rem 1rem",
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    borderRadius: "8px",
    backgroundColor:
      nivel === "Rojo"
        ? "#a94442"
        : nivel === "Amarillo"
        ? "#d6a82a"
        : "#5F736A",
  }),
};

export default AlertSection;
