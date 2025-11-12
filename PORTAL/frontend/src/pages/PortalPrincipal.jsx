import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ResourceGrid from "../components/ResourceGrid";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";


const PortalPrincipal = () => {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Simulación de carga (podrías reemplazar con fetch a tu API)
  useEffect(() => {
    setResources([]);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Aquí se podría filtrar los recursos desde la API
  };

  return (
    <div className="portal-container fade-in">
      <Navbar/>
      {/* HEADER con Navbar (el texto y botón de subir recurso solo se muestran aquí) */}
      <Header />
      {/* CUERPO PRINCIPAL */}
      <main className="portal-main">
        {/* Barra de búsqueda */}
        <div className="search-section">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Contenedor de recursos */}
        <section className="resources-section">
          <ResourceGrid />

        </section>
      </main>
    </div>
  );
};
export default PortalPrincipal;
