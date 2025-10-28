function Header() {
  return (
    <header
      style={{
        backgroundColor: "#D9D9D9",
        textAlign: "center",
        padding: "0.5rem",
      }}
    >
      <h1
        style={{
          fontSize: "2.3rem",
          color: "#4E3B2B",
          fontWeight: "700", // 🔹 más negrilla
          textShadow: "1px 1px 2px #00000040",
          marginBottom: "1rem",
        }}
      >
        <strong>Portal de Recursos</strong>
      </h1>

      <p
        style={{
          backgroundColor: "#6B7E77",
          color: "black",
          padding: "1.4rem 3rem", // 🔼 más grande
          borderRadius: "15px",
          display: "inline-block",
          fontWeight: "bold",
          fontSize: "1.2rem",
          boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
        }}
      >
        Mensaje acerca de la violencia
      </p>
    </header>
  );
}

export default Header;
