// 📁 src/pages/InformeDetalle.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import api from "../services/api.js";

function InformeDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [estudiante, setEstudiante] = useState(null);
  const [progresos, setProgresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(false);

  // 🔹 Cargar datos principales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/informes/estudiantes/${id}`);
        setEstudiante(res.data);
      } catch (err) {
        console.error("Error al cargar informe individual:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 🔹 Cargar progreso por historia
  useEffect(() => {
    const cargarProgreso = async () => {
      try {
        const res = await api.get(`/informes/estudiantes/${id}/progreso`);
        setProgresos(res.data);
      } catch (err) {
        console.error("Error al cargar progreso:", err);
      }
    };
    cargarProgreso();
  }, [id]);

  // 🔹 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🔹 Exportar informe individual
  const exportarInforme = () => {
    alert("📥 Exportación disponible cuando se completen las historias.");
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "3rem" }}>Cargando informe...</p>;
  if (!estudiante)
    return (
      <p style={{ textAlign: "center", marginTop: "3rem" }}>
        No se encontró información del estudiante.
      </p>
    );

  return (
    <div style={styles.page}>
      {/* 🔹 Header con botones estilo PanelPsicologa */}
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Ir al panel
        </button>

        <div style={styles.headerText}>
          <h1 style={styles.headerTitle}>Informe individual del estudiante</h1>
          <p style={styles.headerSubtitle}>
            Visualiza el progreso, observaciones y recomendaciones generadas por el sistema.
          </p>
        </div>

        <div style={styles.userMenuContainer}>
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            style={styles.userBtn}
            aria-label="Menú de usuario"
          >
            <i className="fas fa-user"></i>
          </button>
          {menuAbierto && (
            <div style={styles.dropdown}>
              <p style={styles.userName}>Psicóloga</p>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 📄 Contenido principal */}
      <main style={styles.main}>
        {/* 🧾 Datos generales */}
        <div style={styles.infoBox}>
          <h2 style={styles.sectionTitle}>🧾 Datos generales</h2>
          <p><strong>Nombre:</strong> {estudiante.nombre}</p>
          <p><strong>Curso:</strong> {estudiante.curso}</p>
          <p><strong>Paralelo:</strong> {estudiante.paralelo || "—"}</p>
          <p><strong>Clúster asignado:</strong> {estudiante.cluster || "Sin clasificar"}</p>
          <p><strong>Resultado final:</strong> {estudiante.resultado_final || "Pendiente"}</p>
          <p><strong>Fecha del informe:</strong> {estudiante.generado_en?.split("T")[0] || "—"}</p>
        </div>

        {/* 📊 Progreso global */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>📊 Progreso global</h2>
          <p style={styles.text}>
            Avance total en el videojuego: <strong>{estudiante.progreso || 0}%</strong>
          </p>
          <div style={styles.progressBarContainer}>
            <div
              style={{
                width: `${estudiante.progreso || 0}%`,
                height: "100%",
                background: "#C57A3D",
                transition: "width 0.5s ease",
              }}
            ></div>
          </div>
        </div>

        {/* 📖 Progreso por historia */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>📖 Progreso por historia</h2>
          {progresos.length === 0 ? (
            <p style={styles.text}>No hay datos de progreso aún.</p>
          ) : (
            progresos.map((p, i) => (
              <div key={i} style={{ marginBottom: "1rem" }}>
                <p style={{ fontWeight: "bold", color: "#FFDAB3" }}>{p.historia}</p>
                <div style={styles.progressBarContainer}>
                  <div
                    style={{
                      width: `${p.progreso}%`,
                      height: "100%",
                      background: "#C57A3D",
                    }}
                  ></div>
                </div>
                <p style={{ fontSize: "0.9rem", color: "#fff", marginTop: "0.2rem" }}>
                  Avance: {p.progreso}%
                </p>
              </div>
            ))
          )}
        </div>

        {/* 💬 Observación */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>💬 Observación automática</h2>
          <p style={styles.text}>
            {estudiante.observacion || "No hay observación registrada."}
          </p>
        </div>

        {/* 🧠 Recomendación */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>🧠 Recomendación del sistema</h2>
          <p style={styles.text}>
            {estudiante.recomendacion || "Sin recomendación."}
          </p>
        </div>

        {/* 🧩 Decisiones clave */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>🧩 Decisiones clave</h2>
          <p style={styles.text}>
            Aquí se mostrarán las decisiones más representativas del estudiante una vez que el
            juego registre sus elecciones en la base de datos.
          </p>
          <ul style={styles.decisionList}>
            <li>Ejemplo: “Intervino para evitar un conflicto.” (Proactiva)</li>
            <li>Ejemplo: “Evitó involucrarse ante una situación de acoso.” (Evasiva)</li>
          </ul>
        </div>

        {/* 📥 Botón exportar */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={exportarInforme} style={styles.exportBtn}>
            📥 Exportar informe individual
          </button>
        </div>
      </main>
    </div>
  );
}

/* 🎨 ESTILOS */
const styles = {
  page: {
    backgroundColor: "#D9D9D9",
    minHeight: "100vh",
    paddingBottom: "3rem",
  },
  header: {
    background: "linear-gradient(90deg, #5F736A 0%, #C57A3D 100%)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    color: "white",
    borderBottom: "3px solid rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    backgroundColor: "#C57A3D",
    border: "none",
    color: "white",
    borderRadius: "8px",
    padding: "0.6rem 1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
    transition: "all 0.3s ease",
  },
  headerText: {
    textAlign: "center",
    flex: 1,
  },
  headerTitle: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "700",
  },
  headerSubtitle: {
    margin: 0,
    fontSize: "0.95rem",
    opacity: 0.9,
  },
  userMenuContainer: {
    position: "relative",
  },
  userBtn: {
    background: "white",
    border: "none",
    borderRadius: "50%",
    fontSize: "1.3rem",
    width: "42px",
    height: "42px",
    cursor: "pointer",
    color: "#5F736A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
  dropdown: {
    position: "absolute",
    top: "50px",
    right: 0,
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "0.8rem",
    boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
    zIndex: 20,
    color: "#1C2B29",
    minWidth: "150px",
  },
  userName: {
    margin: "0 0 0.5rem 0",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  logoutBtn: {
    backgroundColor: "#C57A3D",
    border: "none",
    color: "white",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
  },
  main: {
    maxWidth: "900px",
    margin: "2rem auto",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    padding: "0 1rem",
  },
  infoBox: {
    backgroundColor: "#5F736A",
    color: "white",
    borderRadius: "10px",
    padding: "1.5rem",
    boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
  },
  card: {
    backgroundColor: "#1C2B29",
    color: "white",
    borderRadius: "10px",
    padding: "1.5rem",
    boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
  },
  sectionTitle: {
    color: "#FFDAB3",
    marginBottom: "0.5rem",
  },
  text: {
    lineHeight: "1.6",
    textAlign: "justify",
  },
  progressBarContainer: {
    width: "100%",
    height: "15px",
    background: "#ccc",
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "0.5rem",
  },
  decisionList: {
    marginTop: "0.5rem",
    paddingLeft: "1.5rem",
  },
  exportBtn: {
    backgroundColor: "#C57A3D",
    border: "none",
    color: "white",
    borderRadius: "8px",
    padding: "0.8rem 1.5rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  userSection: {
    position: "relative",
  },
  userIcon: {
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.2)",
    transition: "background 0.3s ease",
  },
  userMenu: {
    position: "absolute",
    top: "50px",
    right: "0",
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 15px rgba(0,0,0,0.4)",
    borderRadius: "10px",
    padding: "1rem",
    textAlign: "center",
    minWidth: "200px",
    zIndex: 9999,
  },
  userText: {
    color: "#4E3B2B",
    fontWeight: "bold",
    marginBottom: "0.8rem",
    fontSize: "0.95rem",
  },
  logoutBtn: {
    backgroundColor: "#C57A3D",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "0.7rem 1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
  },
};

export default InformeDetalle;
