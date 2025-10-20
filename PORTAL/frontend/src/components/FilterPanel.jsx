import { FaSlidersH } from "react-icons/fa";

function FilterPanel() {
  return (
    <button
      style={{
        backgroundColor: "#C57A3D",
        color: "white",
        border: "none",
        borderRadius: "10px",
        padding: "0.6rem 1.2rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      <FaSlidersH />
      Filtros
    </button>
  );
}

export default FilterPanel;
