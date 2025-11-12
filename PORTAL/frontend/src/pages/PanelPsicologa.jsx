import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import DashboardSection from "../components/DashboardSection";
import StudentTable from "../components/StudentTable";
import ComparativeSection from "../components/ComparativeSection";
import AlertSection from "../components/AlertSection";
import ExportSection from "../components/ExportSection";

export default function PanelPsicologa() {
  const [menuUsuario, setMenuUsuario] = useState(false);
  const userIconRef = useRef(null);
  const navigate = useNavigate();

  // Cerrar menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-section")) setMenuUsuario(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className = "panel-container fade-in" style={styles.page}>
      {/* 🔝 Encabezado */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          {/* 🔙 Botón Ir al portal */}
          <button
            style={styles.portalBtn}
            onClick={() => navigate("/")}
          >
            ← Ir al portal
          </button>

          {/* 🩺 Título principal */}
          <div style={styles.centerContent}>
            <h1 style={styles.title}>Panel de informes de la psicóloga</h1>
            <p style={styles.subtitle}>
              Visualiza el progreso, las observaciones y las alertas automáticas
              generadas por el sistema.
            </p>
          </div>

          {/* 👤 Usuario */}
          <div className="user-section" style={styles.userSection}>
            <div
              ref={userIconRef}
              onClick={(e) => {
                e.stopPropagation();
                setMenuUsuario(!menuUsuario);
              }}
              style={styles.userIcon}
            >
              <FaUserCircle size={36} />
            </div>
            {menuUsuario && (
              <div style={styles.userMenu}>
                <p style={styles.userText}>👋 Hola, psicóloga</p>
                <button
                  style={styles.logoutBtn}
                  onClick={() => navigate("/login")}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================== */}
      <DashboardSection />
      <section style={styles.section}>
        <StudentTable />
      </section>
      <section style={styles.section}>
        <ComparativeSection />
        <AlertSection />
      </section>
      <section style={styles.section}>
        <ExportSection />
      </section>
    </div>
  );
}

/* 🎨 Estilos */
const styles = {
  page: {
    backgroundColor: "#D9D9D9",
    minHeight: "100vh",
    fontFamily: "Quicksand, sans-serif",
  },
  header: {
    width: "100%",
    background: "linear-gradient(90deg, #5F736A 0%, #C57A3D 100%)",
    color: "white",
    textAlign: "center",
    padding: "1.5rem 1rem 2.5rem",
    borderBottomLeftRadius: "20px",
    borderBottomRightRadius: "20px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
    flexWrap: "wrap",
  },
  centerContent: {
    flex: "1",
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "800",
    marginBottom: "0.4rem",
  },
  subtitle: {
    color: "#FFDAB3",
    fontSize: "1rem",
    lineHeight: "1.4",
  },
  portalBtn: {
    backgroundColor: "#C57A3D",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "0.6rem 1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
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
  section: {
    margin: "2rem auto",
    maxWidth: "1300px",
    padding: "1rem 2rem",
  },
};

/* 📱 Responsividad */
const responsive = document.createElement("style");
responsive.innerHTML = `
@media (max-width: 900px) {
  header {
    padding: 1.2rem 0.8rem 2rem !important;
  }

  h1 {
    font-size: 1.4rem !important;
  }

  .user-section {
    position: static !important;
  }

  .user-menu {
    top: 60px !important;
    right: 50% !important;
    transform: translateX(50%);
  }

  button {
    font-size: 0.85rem !important;
    padding: 0.5rem 1rem !important;
  }
}
`;
document.head.appendChild(responsive);
