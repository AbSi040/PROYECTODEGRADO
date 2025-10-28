import { Link } from "react-router-dom";

function DenunciaViolencia() {
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
      <div style={{ width: "90%", maxWidth: "1000px" }}>
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
          <strong>Mecanismos de denuncia y ayuda - La Paz</strong>
        </h1>

        <section
          style={{
            marginTop: "2rem",
            backgroundColor: "#6B7E77",
            padding: "2rem",
            borderRadius: "15px",
            boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
          }}
        >
          <p style={infoLine}>
            📞 <strong>Línea gratuita:</strong>{" "}
            <span style={{ color: "#C57A3D" }}>800-14-0348</span>
          </p>
          <p style={infoLine}>Policía Boliviana: 110</p>
        </section>

        <p
          style={{
            textAlign: "center",
            marginTop: "2rem",
            color: "#4E3B2B",
            fontWeight: "600",
          }}
        >
        </p>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <a href="" style={btnDenunciar} className="hover-scale">
            Llamar ahora
          </a>
        </div>
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

const infoLine = {
  color: "white",
  fontWeight: "600",
  fontSize: "1.1rem",
  marginBottom: "0.8rem",
};

const btnDenunciar = {
  backgroundColor: "#C57A3D",
  color: "white",
  padding: "0.9rem 2rem",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "1.1rem",
  boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
  cursor: "pointer",
};

export default DenunciaViolencia;
