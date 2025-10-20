function Header() {
  return (
    <header style={{
      backgroundColor: "#D9D9D9",
      textAlign: "center",
      padding: "1rem"
    }}>
      <h1 style={{
        fontSize: "2rem",
        color: "#4E3B2B",
        fontWeight: "bold",
        textShadow: "1px 1px 1px #00000040"
      }}>
        Portal de Recursos
      </h1>

      <p style={{
        backgroundColor: "#6B7E77",
        color: "black",
        padding: "0.5rem 1rem",
        borderRadius: "10px",
        display: "inline-block",
        marginTop: "0.5rem",
        fontWeight: "bold"
      }}>
        Mensaje acerca de la violencia
      </p>
    </header>
  );
}

export default Header; // 👈 ESTA LÍNEA ES CLAVE
