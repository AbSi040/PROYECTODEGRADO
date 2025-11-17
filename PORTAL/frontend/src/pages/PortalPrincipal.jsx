import React from "react";
import Header from "../components/Header";
import ResourceGrid from "../components/ResourceGrid";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";

/**
 * 🏛️ PortalPrincipal
 * Vista principal del portal educativo.
 * Muestra:
 *  - Navbar
 *  - Header (banner con texto + botón subir recurso)
 *  - Barra de búsqueda
 *  - Grilla de recursos
 */

const PortalPrincipal = () => {
  return (
    <div className="portal-container fade-in">
      {/* 🔷 Navbar superior */}
      <Navbar />

      {/* 🔶 Encabezado del portal */}
      <Header />

      {/* 🔽 Contenido principal */}
      <main className="portal-main">
        {/* 🔍 Barra de búsqueda */}
        <div className="search-section">
          <SearchBar />
        </div>

        {/* 📚 Listado de recursos */}
        <section className="resources-section">
          <ResourceGrid />
        </section>
      </main>
    </div>
  );
};

export default PortalPrincipal;
