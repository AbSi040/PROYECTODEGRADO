import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import ResourceGrid from "../components/ResourceGrid";
import { Link } from "react-router-dom";

function PortalPrincipal() {
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #D9D9D9 0%, #cfcfcf 100%)",
        margin: 0,
        paddingTop: "1rem",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Quicksand', sans-serif",
      }}
    >
      {/* Encabezado */}
      <Header />

      {/* 🔸 Botones centrales */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1.5rem",
          marginTop: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Link to="/portal/denuncia" style={btnDenuncia} className="hover-scale">
          Denuncia la violencia
        </Link>
        <Link to="/subir" style={btnSubir} className="hover-scale">
          Subir recurso
        </Link>
      </div>

      <div
        style={{
          width: "90%",
          maxWidth: "1200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginTop: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <SearchBar />
        <button style={btnFiltro} className="hover-scale">
          Filtros
        </button>
      </div>

      {/* 📦 Panel de recursos */}
      <div
        style={{
          width: "90%",
          maxWidth: "1200px",
          marginTop: "1.5rem",
          marginBottom: "2rem",
          animation: "fadeIn 1s ease",
        }}
      >
        <ResourceGrid />
      </div>

      {/* 🎨 Estilos globales */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* Efecto hover para todos los botones */
          .hover-scale {
            transition: all 0.3s ease;
          }
          .hover-scale:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
          }
        `}
      </style>
    </div>
  );
}

const btnBase = {
  color: "white",
  border: "none",
  padding: "0.9rem 1.8rem",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1.1rem",
  letterSpacing: "0.5px",
  textDecoration: "none",
  boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
};

const btnDenuncia = {
  ...btnBase,
  backgroundColor: "#C57A3D",
};

const btnSubir = {
  ...btnBase,
  backgroundColor: "#C57A3D",
};

const btnFiltro = {
  ...btnBase,
  backgroundColor: "#C57A3D",
  fontSize: "1rem",
  padding: "0.8rem 1.6rem",
};

export default PortalPrincipal;
