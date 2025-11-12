import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFilePdf, FaImage, FaVideo } from "react-icons/fa6";

function ResourceCard({ recurso }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/portal/recurso/${recurso.id_recurso}`);
  };

  // 🔹 Determinar ícono según tipo
  const getIcon = () => {
    if (recurso.tipo === "PDF") return <FaFilePdf style={{ marginRight: "6px" }} />;
    if (recurso.tipo === "VIDEO") return <FaVideo style={{ marginRight: "6px" }} />;
    return <FaImage style={{ marginRight: "6px" }} />;
  };

  // 🔹 Mostrar vista previa según tipo
  const renderPreview = () => {
    if (recurso.tipo === "VIDEO") {
      return (
        <video
          src={recurso.url_origen}
          controls={false}
          style={{
            width: "100%",
            height: "200px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            objectFit: "cover",
            backgroundColor: "#111",
          }}
        />
      );
    }
    if (recurso.tipo === "IMAGE" || recurso.tipo === "INFOGRAFIA") {
      return (
        <img
          src={recurso.url_origen}
          alt={recurso.titulo}
          style={{
            width: "100%",
            height: "200px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            objectFit: "cover",
          }}
        />
      );
    }
    return (
      <div
        style={{
          width: "100%",
          height: "200px",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          backgroundColor: "#243434",
          color: "#ccc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "0.9rem",
        }}
      >
        Vista previa no disponible
      </div>
    );
  };

  return (
    <div
      className="recurso-card"
      onClick={handleClick}
      style={{
        backgroundColor: "#213A3A",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 6px 14px rgba(0, 0, 0, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
      }}
    >
      {renderPreview()}

      <div style={{ padding: "1rem", color: "white" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: "#F5CDAA",
            marginBottom: "0.3rem",
            textTransform: "uppercase",
          }}
        >
          {recurso.titulo}
        </h3>

        <p
          style={{
            fontSize: "0.85rem",
            color: "#CFCFCF",
            marginBottom: "0.8rem",
          }}
        >
          {recurso.descripcion_corta?.length > 60
            ? recurso.descripcion_corta.substring(0, 60) + "..."
            : recurso.descripcion_corta}
        </p>

        <div style={{ fontSize: "0.8rem", color: "#EAEAEA", lineHeight: "1.4" }}>
          <p>
            <strong>Violencia:</strong>{" "}
            {recurso.nombre_tipo_violencia || "—"}
          </p>
          <p>
            <strong>Categoría:</strong>{" "}
            {recurso.nombre_categoria || "—"}
          </p>
        </div>

        <button
          style={{
            width: "100%",
            marginTop: "0.9rem",
            padding: "0.6rem",
            backgroundColor: "#C57A3D",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "500",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "0.9rem",
          }}
        >
          {getIcon()} Ver recurso
        </button>
      </div>
    </div>
  );
}

export default ResourceCard;
