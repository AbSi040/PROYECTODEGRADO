import { Link } from "react-router-dom";

function RecursoDetalle() {
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #D9D9D9 0%, #cfcfcf 100%)",
        padding: "2rem",
        fontFamily: "'Quicksand', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "1200px",
        }}
      >
        <Link to="/" style={btnVolver}>
          ← Volver
        </Link>

        <h1
          style={{
            textAlign: "center",
            color: "#4E3B2B",
            fontWeight: "700",
            marginTop: "1.5rem",
            textShadow: "1px 1px 2px #00000030",
          }}
        >
          <strong>Nombre de recurso</strong>
        </h1>

        <section
          style={{
            display: "flex",
            gap: "1.5rem",
            marginTop: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div style={bloqueIzq}>📸 Imagen o video del recurso</div>

          <div style={bloqueDer}>
            <p style={{ fontWeight: "500" }}>
              Aquí se despliega el recurso educativo seleccionado por el usuario.
            </p>
            <button style={btnDescargar} className="hover-scale">
              ⬇ Descargar recurso
            </button>
          </div>
        </section>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');

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

const btnVolver = {
  backgroundColor: "#C57A3D",
  color: "white",
  border: "none",
  padding: "0.6rem 1.2rem",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  textDecoration: "none",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
};

const bloqueIzq = {
  flex: 1,
  backgroundColor: "#20302C",
  color: "white",
  borderRadius: "10px",
  padding: "1rem",
  minHeight: "350px",
  textAlign: "center",
  fontWeight: "600",
  boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
};

const bloqueDer = {
  flex: 2,
  backgroundColor: "#6B7E77",
  color: "black",
  borderRadius: "10px",
  padding: "1.2rem",
  boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
};

const btnDescargar = {
  backgroundColor: "#C57A3D",
  color: "white",
  border: "none",
  padding: "0.7rem 1.4rem",
  borderRadius: "10px",
  cursor: "pointer",
  float: "right",
  fontWeight: "bold",
  fontSize: "1rem",
};

export default RecursoDetalle;
