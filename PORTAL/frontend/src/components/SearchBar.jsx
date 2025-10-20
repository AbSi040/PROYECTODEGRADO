import { FaSearch } from "react-icons/fa";

function SearchBar() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      backgroundColor: "#C57A3D",
      borderRadius: "20px",
      padding: "0.5rem 1rem",
      width: "70%"
    }}>
      <input
        type="text"
        placeholder="Búsqueda de archivos"
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          color: "white",
          fontSize: "1rem",
        }}
      />
      <FaSearch color="white" />
    </div>
  );
}

export default SearchBar;
