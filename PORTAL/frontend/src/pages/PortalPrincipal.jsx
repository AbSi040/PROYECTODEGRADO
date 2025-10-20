import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import ResourceGrid from "../components/ResourceGrid";
import { Link } from "react-router-dom";

function PortalPrincipal() {
  return (
    <main style={{ backgroundColor: "#D9D9D9", minHeight: "100vh", padding: "1rem" }}>
      <Header />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button style={btn}>Menú</button>
        <h1 style={{ color: "#4E3B2B", fontSize: "2rem", fontWeight: "bold" }}>Portal de Recursos</h1>
        <Link to="/portal/denuncia" style={btn}>
  Denuncia la violencia
</Link>
      </div>

      <section style={{ margin: "1rem 0" }}>
        <h3 style={banner}>Mensaje acerca de la violencia</h3>
      </section>

      <section style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <SearchBar />
        <FilterPanel />
      </section>

      <ResourceGrid />
    </main>
  );
}

const btn = {
  backgroundColor: "#C57A3D",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};

const banner = {
  backgroundColor: "#6B7E77",
  color: "black",
  padding: "0.5rem 1rem",
  borderRadius: "10px",
  textAlign: "center"
};

export default PortalPrincipal;
