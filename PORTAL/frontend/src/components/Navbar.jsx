import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function Navbar() {
  const [menuUsuario, setMenuUsuario] = useState(false);
  const [dropdownViolencia, setDropdownViolencia] = useState(false);
  const [dropdownContenido, setDropdownContenido] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const scrollContainerRef = useRef(null);
  const userIconRef = useRef(null);

  // Ocultar/mostrar navbar con el scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScroll(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  // Detectar si se necesitan las flechas
  useEffect(() => {
    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowArrows(scrollWidth > clientWidth);
      }
    };
    
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  // Scroll lateral del menú
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -150, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 150, behavior: "smooth" });
    }
  };

  // Cerrar dropdowns si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown")) {
        setDropdownViolencia(false);
        setDropdownContenido(false);
      }
      if (!e.target.closest(".user-section")) {
        setMenuUsuario(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Manejar selección de tipo de violencia
  const handleViolenciaClick = (tipo) => {
    console.log("Tipo de violencia seleccionado:", tipo);
    setDropdownViolencia(false);
    // Aquí puedes agregar lógica para filtrar o navegar
  };

  // Manejar selección de tipo de contenido
  const handleContenidoClick = (tipo) => {
    console.log("Tipo de contenido seleccionado:", tipo);
    setDropdownContenido(false);
    // Aquí puedes agregar lógica para filtrar o navegar
  };

  // Obtener posición del menú de usuario
  const getUserMenuPosition = () => {
    if (userIconRef.current) {
      const rect = userIconRef.current.getBoundingClientRect();
      return {
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      };
    }
    return { top: 70, right: 20 };
  };

  return (
    <nav
      style={{
        ...styles.navbar,
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
      }}
    >
      {/* Flecha izquierda (visible solo si hay overflow) */}
      {showArrows && (
        <button style={styles.arrowBtn} onClick={scrollLeft}>
          <IoIosArrowBack size={16} />
        </button>
      )}

      {/* Contenedor scrollable */}
      <div style={styles.scrollContainer} ref={scrollContainerRef}>
        <Link to="/" style={styles.logo}>
          📚
        </Link>

        <Link to="/" style={styles.menuItem}>
          Inicio
        </Link>

        {/* Dropdown Tipos de Violencia */}
        <div
          className="dropdown"
          style={styles.dropdownWrapper}
        >
          <span 
            style={styles.menuItemDropdown}
            onClick={(e) => {
              e.stopPropagation();
              setDropdownViolencia(!dropdownViolencia);
              setDropdownContenido(false);
            }}
          >
            Categorías ▾
          </span>
          {dropdownViolencia && (
            <div style={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("fisica")}
              >
                Bullying escolar
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("psicologica")}
              >
                Violencia en el noviazgo
              </button>
              
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("genero")}
              >
                Violencia de género
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("escolar")}
              >
                Violencia física
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("fisica")}
              >
                Violencia feminicida
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("psicologica")}
              >
                Violencia psicológica
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("intrafamiliar")}
              >
                Violencia mediática
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("genero")}
              >
                Violencia simbólica y/o encubierta
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("escolar")}
              >
                Violencia contra la dignidad
              </button>
               <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("fisica")}
              >
                Violencia sexual
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("psicologica")}
              >
                Violencia contra los derechos reproductivos
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("intrafamiliar")}
              >
                Violencia en servicios de salud
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("genero")}
              >
                Violencia patrimonial y económica
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("escolar")}
              >
               Violencia laboral
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("fisica")}
              >
                Violencia en el sistema educativo
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("psicologica")}
              >
                Violencia en el ejercicio político y liderazgo
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("intrafamiliar")}
              >
                Violencia institucional
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("intrafamiliar")}
              >
                Violencia en la familia
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("escolar")}
              >
                Violencia contra los derechos y la libertad sexual
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("escolar")}
              >
                Violencia infantil
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleViolenciaClick("escolar")}
              >
                Violencia digital
              </button>
            </div>
          )}
        </div>

        {/* Dropdown Tipos de Contenido */}
        <div
          className="dropdown"
          style={styles.dropdownWrapper}
        >
          <span 
            style={styles.menuItemDropdown}
            onClick={(e) => {
              e.stopPropagation();
              setDropdownContenido(!dropdownContenido);
              setDropdownViolencia(false);
            }}
          >
            Tipo de contenido ▾
          </span>
          {dropdownContenido && (
            <div style={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleContenidoClick("guias")}
              >
                Ley Normativa
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleContenidoClick("leyes")}
              >
                Informe estadístico
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleContenidoClick("campanias")}
              >
                Guía educativa
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleContenidoClick("videos")}
              >
                Artículo educativo
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleContenidoClick("estadisticas")}
              >
                Tesis investigación
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleContenidoClick("estadisticas")}
              >
                Recurso multimedia
              </button>
              <button 
                style={styles.dropdownButton}
                onClick={() => handleContenidoClick("estadisticas")}
              >
                Material Adventista
              </button>
            </div>
          )}
        </div>

        <Link to="/portal/campanias" style={styles.menuItem}>
          Campañas multimedia
        </Link>

        <Link to="/portal/informes" style={styles.menuItem}>
          Informes y estadísticas
        </Link>

        <Link to="/panel/psicologa" style={styles.menuItem}>
  Panel de informes
</Link>

        <Link to="/portal/denuncia" style={styles.menuItem}>
          Acerca de / Ayuda
        </Link>
      </div>

      {/* Flecha derecha (visible solo si hay overflow) */}
      {showArrows && (
        <button style={styles.arrowBtn} onClick={scrollRight}>
          <IoIosArrowForward size={16} />
        </button>
      )}

      {/* Menú de usuario */}
      <div className="user-section" style={styles.userSection}>
        <div
          ref={userIconRef}
          onClick={(e) => {
            e.stopPropagation();
            setMenuUsuario(!menuUsuario);
          }}
          style={styles.userIcon}
        >
          <FaUserCircle size={32} />
        </div>
        {menuUsuario && (
          <div 
            style={{
              ...styles.userMenu,
              top: getUserMenuPosition().top,
              right: getUserMenuPosition().right,
            }}
          >
            <p style={styles.userText}>👋 Hola, usuario</p>
            <button style={styles.logoutBtn}>Cerrar sesión</button>
          </div>
        )}
      </div>
    </nav>
  );
}

/* 🎨 Estilos */
const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    background: "linear-gradient(90deg, #5F736A 0%, #C57A3D 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.6rem 1.5rem",
    boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
    transition: "transform 0.4s ease",
    zIndex: 1000,
    height: "80px",
    overflow: "visible",
  },
  logo: {
    fontWeight: "bold",
    color: "white",
    textDecoration: "none",
    marginRight: "1.5rem",
    fontSize: "0.95rem",
    whiteSpace: "nowrap",
    padding: "0.5rem 1rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  },
  scrollContainer: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    overflowX: "auto",
    overflowY: "visible",
    scrollBehavior: "smooth",
    flexGrow: 1,
    scrollbarWidth: "none",
    padding: "0.3rem 0",
  },
  menuItem: {
    textDecoration: "none",
    color: "white",
    fontWeight: "600",
    fontSize: "1rem",
    whiteSpace: "nowrap",
    cursor: "pointer",
    padding: "1rem 1rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  },
  menuItemDropdown: {
    textDecoration: "none",
    color: "white",
    fontWeight: "600",
    fontSize: "1rem",
    whiteSpace: "nowrap",
    cursor: "pointer",
    padding: "1rem 1rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    display: "block",
  },
  dropdownWrapper: {
    position: "static",
  },
  dropdownMenu: {
  position: "fixed",
  marginTop: "0.5rem",
  backgroundColor: "#6B7E77",
  borderRadius: "10px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.4)",
  display: "flex",
  flexDirection: "column",
  minWidth: "280px",
  maxHeight: "320px", // 🔹 altura máxima del dropdown
  overflowY: "auto",  // 🔹 scroll interno vertical
  scrollbarWidth: "thin",
  scrollbarColor: "#C57A3D #6B7E77",
  zIndex: 9999,
  padding: "0.5rem 0",
},

  dropdownButton: {
    color: "white",
    backgroundColor: "transparent",
    border: "none",
    padding: "0.7rem 1.2rem",
    fontSize: "0.9rem",
    transition: "all 0.2s ease",
    cursor: "pointer",
    textAlign: "left",
    fontWeight: "500",
    width: "100%",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  arrowBtn: {
    background: "rgba(255, 255, 255, 0.2)",
    border: "none",
    color: "white",
    cursor: "pointer",
    opacity: 0.9,
    padding: "0.5rem",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userSection: {
    position: "relative",
    marginLeft: "1rem",
  },
  userIcon: {
    color: "white",
    cursor: "pointer",
    transition: "transform 0.3s ease",
    display: "flex",
    alignItems: "center",
    padding: "0.3rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
  },
  userMenu: {
    position: "fixed",
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 15px rgba(0,0,0,0.4)",
    borderRadius: "10px",
    padding: "1.2rem",
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

// 🎨 Efectos hover
const hoverStyles = document.createElement("style");
hoverStyles.innerHTML = `
  nav a:hover, nav span:hover {
    background-color: rgba(255, 255, 255, 0.25) !important;
    transform: translateY(-2px);
  }
  
  .dropdown button:hover {
    background-color: #C57A3D !important;
    padding-left: 1.5rem;
  }
  
  .dropdown button:last-child {
    border-bottom: none !important;
  }
  
  button:hover {
    opacity: 1 !important;
  }
  
  .arrowBtn:hover {
    background-color: rgba(255, 255, 255, 0.3) !important;
    transform: scale(1.1);
  }
  
  .user-section:hover .userIcon {
    transform: scale(1.1);
  }
  
  /* Ocultar scrollbar */
  nav > div::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    nav {
      padding: 0.5rem 0.8rem !important;
    }
  }
`;
document.head.appendChild(hoverStyles);

export default Navbar;