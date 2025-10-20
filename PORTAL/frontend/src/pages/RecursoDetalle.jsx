import { useNavigate } from "react-router-dom";

function RecursoDetalle() {
  const navigate = useNavigate(); //Hook para navegar

  const handleVolver = () => {
    navigate("/portal"); // Regresa al portal principal
  };

  return (
    <main style={{ backgroundColor: "#D9D9D9", minHeight: "100vh", padding: "1rem" }}>
      <button style={btnVolver} onClick={handleVolver}>←</button>

      <h1 style={{ textAlign: "center", color: "#4E3B2B" }}>
        Nombre de recurso
      </h1>

      <section style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <div style={bloqueIzq}>Imagen y/o video del recurso</div>
        <div style={bloqueDer}>
          <p>Recurso desplegado y mostrado</p>
          <button style={btnDescargar}>Descargar</button>
        </div>
      </section>
    </main>
  );
}

const btnVolver = {
  backgroundColor: "#C57A3D",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "background 0.2s ease",
};

const bloqueIzq = {
  flex: 1,
  backgroundColor: "#20302C",
  color: "white",
  borderRadius: "10px",
  padding: "1rem",
  minHeight: "400px"
};

const bloqueDer = {
  flex: 2,
  backgroundColor: "#6B7E77",
  color: "black",
  borderRadius: "10px",
  padding: "1rem"
};

const btnDescargar = {
  backgroundColor: "#C57A3D",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  cursor: "pointer",
  float: "right"
};

export default RecursoDetalle;
