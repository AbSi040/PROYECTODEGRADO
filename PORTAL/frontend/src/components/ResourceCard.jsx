import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

function ResourceCard({ title = "Tarjeta de recurso", id = 1 }) {
  return (
    <div
      className="resource-card"
      style={{
        backgroundColor: "#20302C",
        color: "white",
        borderRadius: "10px",
        padding: "1rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "190px",
        fontFamily: "'Quicksand', sans-serif", // 🎨 tipografía más viva
      }}
    >
      <h4 style={{ fontWeight: "600", fontSize: "1.1rem" }}>{title}</h4>

      <Link
        to={`/portal/recurso/${id}`}
        style={{
          backgroundColor: "#C57A3D",
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          cursor: "pointer",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.3rem",
          fontWeight: "bold",
        }}
      >
        <FaEye /> Ver recurso
      </Link>
    </div>
  );
}

export default ResourceCard;
