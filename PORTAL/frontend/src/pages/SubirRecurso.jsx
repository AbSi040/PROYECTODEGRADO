import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function SubirRecurso() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("PDF");
  const [autor, setAutor] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!archivo) {
      setMensaje("⚠️ Selecciona un archivo antes de subir.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion_corta", descripcion);
    formData.append("tipo", tipo);
    formData.append("autor_fuente", autor);
    formData.append("archivo", archivo);

    try {
      const res = await axios.post("http://localhost:4000/api/recursos/subir", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMensaje(res.data.message);
      setTitulo("");
      setDescripcion("");
      setAutor("");
      setArchivo(null);
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al subir el recurso.");
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #D9D9D9 0%, #cfcfcf 100%)",
        fontFamily: "'Quicksand', sans-serif",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 🔙 Botón volver */}
      <div style={{ width: "90%", maxWidth: "1200px", textAlign: "left", marginBottom: "1rem" }}>
        <Link to="/" style={btnVolver} className="hover-scale">
          ← Volver al portal
        </Link>
      </div>

      <h1 style={{ color: "#4E3B2B", fontWeight: "700", marginBottom: "1.5rem" }}>
        Subir nuevo recurso
      </h1>

      <form
        onSubmit={manejarEnvio}
        style={{
          backgroundColor: "#6B7E77",
          padding: "2rem",
          borderRadius: "15px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
          width: "90%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Título del recurso"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={inputStyle}
          required
        />
        <textarea
          placeholder="Descripción corta"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          style={{ ...inputStyle, height: "80px" }}
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={inputStyle}>
          <option value="PDF">PDF</option>
          <option value="VIDEO">Video</option>
          <option value="AUDIO">Audio</option>
          <option value="IMAGE">Imagen</option>
          <option value="INFOGRAFIA">Infografía</option>
        </select>
        <input
          type="text"
          placeholder="Autor o fuente"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          style={inputStyle}
        />
        <input
          type="file"
          onChange={(e) => setArchivo(e.target.files[0])}
          style={inputStyle}
        />
        <button type="submit" style={btnSubir} className="hover-scale">
          Subir recurso
        </button>
      </form>

      {mensaje && (
        <p style={{ marginTop: "1.5rem", color: "#4E3B2B", fontWeight: "bold" }}>{mensaje}</p>
      )}
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

    /* 🔹 Placeholders en blanco */
    input::placeholder,
    textarea::placeholder {
      color: black;
      font-family: 'Quicksand', sans-serif;
      
      opacity: 1;
    }

    /* 🔹 Select y opciones con mismo estilo */
    select {
      color: black;
      font-family: 'Quicksand', sans-serif;
      background-color: #D9D9D9;
      border: none;
      outline: none;
    }

    option {
      background-color: #6B7E77;
      color: white;
      font-family: 'Quicksand', sans-serif;
    }

    /* 🔹 Efecto visual cuando el select está enfocado */
    select:focus {
      box-shadow: 0 0 5px rgba(197, 122, 61, 0.6);
    }
  `}
</style>
    </div>
  );
}

const inputStyle = {
  padding: "0.8rem 1rem",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  fontSize: "1rem",
  backgroundColor: "#D9D9D9",
  color: "#4E3B2B",
};

const btnSubir = {
  backgroundColor: "#C57A3D",
  color: "white",
  border: "none",
  padding: "0.9rem 1.6rem",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1.1rem",
  boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
};

const btnVolver = {
  backgroundColor: "#C57A3D",
  color: "white",
  border: "none",
  padding: "0.6rem 1.2rem",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  textDecoration: "none",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
};

export default SubirRecurso;
