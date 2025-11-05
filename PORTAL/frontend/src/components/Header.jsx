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
        La violencia nunca es la solución a un problema y solo genera más dolor y sufrimiento. Su uso es una forma de control y poder y puede causar daños irreparables en las personas que la sufren. Debemos trabajar para construir un futuro mejor y lograr una sociedad más justa.
      </p>
    </header>
  );
}

export default Header;
