import React from "react";
import { useLocation, Link } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  // Verificar si estamos en la página principal
  const isHome = location.pathname === "/";

  return (
    <header className="portal-header fade-in">
      {/* Contenido visible solo en la página principal */}
      {isHome && (
        <div className="header-main">
          <h1 className="portal-title">Portal de Recursos</h1>
          <p className="portal-message">
            La violencia nunca es la solución a un problema; solo genera más
            dolor y sufrimiento. Su uso es una forma de control y poder y puede
            causar daños irreparables en las personas que la sufren. Debemos
            trabajar para construir un futuro mejor y lograr una sociedad más
            justa.
          </p>
          <Link to="/subir" className="btn-primary">
            Subir recurso
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
