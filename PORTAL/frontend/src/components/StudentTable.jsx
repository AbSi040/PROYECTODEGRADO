// 📁 src/components/StudentTable.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

/**
 * 👩‍🎓 StudentTable
 * Tabla principal del Panel de la Psicóloga.
 * Muestra lista de estudiantes, progreso global, clúster y observación.
 * Permite acceder al informe individual.
 */

function StudentTable() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Obtener lista de estudiantes desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/informes/estudiantes");
        setEstudiantes(res.data);
      } catch (err) {
        console.error("Error al cargar estudiantes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔍 Filtrar por nombre o curso
  const filtered = estudiantes.filter(
    (e) =>
      e.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.curso?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Cargando estudiantes...
      </p>
    );

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>👩‍🎓 Estudiantes registrados</h2>

      {/* 🔍 Buscador */}
      <input
        type="text"
        placeholder="Buscar por nombre o curso..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.search}
      />

      {/* 📋 Tabla */}
      <div style={styles.tableContainer}>
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "#333", padding: "1rem" }}>
            No hay resultados para mostrar.
          </p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.headerCell}>Nombre</th>
                <th style={styles.headerCell}>Curso</th>
                <th style={styles.headerCell}>Paralelo</th>
                <th style={styles.headerCell}>Progreso (%)</th>
                <th style={styles.headerCell}>Clúster</th>
                <th style={styles.headerCell}>Observación</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={i} style={styles.row}>
                  {/* 🔗 Nombre con enlace al detalle */}
                  <td style={styles.cell}>
                    <Link
                      to={`/panel/psicologa/estudiante/${e.id_usuario}`}
                      style={styles.link}
                    >
                      {e.nombre}
                    </Link>
                  </td>

                  <td style={styles.cell}>{e.curso}</td>
                  <td style={styles.cell}>{e.paralelo || "—"}</td>

                  {/* 📊 Progreso */}
                  <td style={styles.cell}>
                    <strong>{e.progreso || 0}%</strong>
                  </td>

                  {/* 🧠 Clúster (color según tipo) */}
                  <td style={styles.cellCluster(e.cluster)}>
                    {e.cluster || "—"}
                  </td>

                  {/* 💬 Observación */}
                  <td style={styles.cell}>
                    {e.observacion || "Sin observación"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

/* 🎨 ESTILOS */
const styles = {
  section: {
    padding: "1rem",
    backgroundColor: "#eeeeeeff",
    borderRadius: "12px",
    margin: "0.1rem auto",
    maxWidth: "1300px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
  },
  title: {
    color: "#1C2B29",
    fontWeight: "700",
    marginBottom: "1rem",
    fontSize: "1.3rem",
  },
  search: {
    width: "100%",
    padding: "0.7rem 1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "1rem",
    fontSize: "1rem",
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
    whiteSpace: "nowrap",
  },
  row: {
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  cell: {
    padding: "0.8rem 1rem",
    textAlign: "left",
    verticalAlign: "top",
  },
  link: {
    color: "#FFDAB3",
    fontWeight: "bold",
    textDecoration: "none",
    transition: "color 0.2s ease",
  },
  cellCluster: (cluster) => ({
    padding: "0.8rem 1rem",
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    backgroundColor:
      cluster === "Reflexivo"
        ? "#3d635a"
        : cluster === "Inseguro"
        ? "#a67c52"
        : cluster === "En riesgo"
        ? "#a94442"
        : "#5F736A",
    borderRadius: "6px",
  }),
};

export default StudentTable;
