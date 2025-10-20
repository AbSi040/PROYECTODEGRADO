import { Link } from "react-router-dom";
import { FaDownload } from "react-icons/fa";

function ResourceCard({ title = "Tarjeta de recurso", id = 1 }) {
  return (
    <div
      style={{
        backgroundColor: "#20302C",
        color: "white",
        borderRadius: "10px",
        padding: "1rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "180px",
      }}
    >
      <h4>{title}</h4>

      <Link
        to={`/portal/recurso/${id}`}
        style={{
          backgroundColor: "#C57A3D",
          color: "white",
          border: "none",
          padding: "0.4rem 0.8rem",
          borderRadius: "8px",
          cursor: "pointer",
          textDecoration: "none",
          alignSelf: "center",
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
        }}
      >
        <FaDownload /> Ver recurso
      </Link>
    </div>
  );
}

export default ResourceCard;
