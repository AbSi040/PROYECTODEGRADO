import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api"; // ✅ Backend centralizado

function SubirRecurso() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("PDF");
  const [autor, setAutor] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // ===================== VALIDACIÓN ===================== //
  const validarArchivo = (file) => {
    if (!file) return "Selecciona un archivo.";

    const maxSize = 20 * 1024 * 1024; // 20 MB
    if (file.size > maxSize) return "El archivo supera el límite de 20MB.";

    const extensionesPermitidas = {
      PDF: ["pdf"],
      DOCX: ["docx"],
      TXT: ["txt"],
      RTF: ["rtf"],
      ODT: ["odt"],
      HTML: ["html"],
      XLSX: ["xlsx"],
      IMAGE: ["png", "jpg", "jpeg"],
      INFOGRAFIA: ["png", "jpg", "jpeg"],
      VIDEO: ["mp4"],
      AUDIO: ["mp3", "wav", "ogg"],
    };

    const ext = file.name.split(".").pop().toLowerCase();
    const validas = extensionesPermitidas[tipo];

    if (!validas.includes(ext))
      return `El archivo debe ser de tipo: ${validas.join(", ")}`;

    return null;
  };

  // ===================== ENVÍO ===================== //
  const manejarEnvio = async (e) => {
    e.preventDefault();

    const error = validarArchivo(archivo);
    if (error) {
      setMensaje(error);
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion_corta", descripcion);
    formData.append("tipo", tipo);
    formData.append("autor_fuente", autor);
    formData.append("archivo", archivo);

    try {
      const res = await api.post("/recursos/subir", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMensaje(res.data?.message || "Recurso subido correctamente.");

      setTimeout(() => {
        setTitulo("");
        setDescripcion("");
        setAutor("");
        setArchivo(null);
      }, 800);
    } catch (error) {
      console.error("❌ Error al subir recurso:", error);
      setMensaje("Error al subir el recurso.");
    }
  };

  return (
    <div className="portal-container fade-in" style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* Botón volver */}
        <div style={styles.topBar}>
          <Link to="/" style={styles.btnVolver}>
            ← Volver
          </Link>
        </div>

        <h2 style={styles.title}>Subir nuevo recurso</h2>

        {/* Formulario */}
        <form onSubmit={manejarEnvio} style={styles.form}>
          <input
            type="text"
            placeholder="Título del recurso"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            style={styles.input}
            required
          />

          <textarea
            placeholder="Descripción corta"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={{ ...styles.input, height: "100px" }}
          />

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={styles.input}
          >
            <option value="PDF">PDF</option>
            <option value="DOCX">Documento Word</option>
            <option value="TXT">Texto</option>
            <option value="RTF">RTF</option>
            <option value="ODT">ODT</option>
            <option value="HTML">Página web</option>
            <option value="XLSX">Archivo Excel</option>
            <option value="IMAGE">Imagen</option>
            <option value="INFOGRAFIA">Infografía</option>
            <option value="VIDEO">Video</option>
            <option value="AUDIO">Audio</option>
          </select>

          <input
            type="text"
            placeholder="Autor o fuente"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            style={styles.input}
          />

          <input
            type="file"
            onChange={(e) => setArchivo(e.target.files[0])}
            style={styles.inputFile}
          />

          <button type="submit" style={styles.btnSubir}>
            Subir recurso
          </button>
        </form>

        {mensaje && <p style={styles.message}>{mensaje}</p>}
      </div>
    </div>
  );
}

/* 🎨 ESTILOS */
const styles = {
  page: {
    backgroundColor: "#D9D9D9",
    minHeight: "100vh",
    paddingTop: "4rem",
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: "900px",
    padding: "2rem",
  },
  topBar: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "1rem",
  },
  btnVolver: {
    backgroundColor: "#C57A3D",
    color: "white",
    padding: "0.6rem 1.2rem",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "0.2s",
  },
  title: {
    textAlign: "center",
    color: "#4E3B2B",
    fontWeight: "700",
    fontSize: "2rem",
    marginBottom: "1.5rem",
  },
  form: {
    backgroundColor: "#6B7E77",
    borderRadius: "15px",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
  },
  input: {
    padding: "0.8rem 1rem",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#D9D9D9",
    color: "#4E3B2B",
  },
  inputFile: {
    padding: "0.6rem",
    backgroundColor: "#E0E0E0",
    borderRadius: "10px",
  },
  btnSubir: {
    backgroundColor: "#C57A3D",
    color: "white",
    padding: "0.9rem",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
  message: {
    marginTop: "1.5rem",
    textAlign: "center",
    color: "#4E3B2B",
    fontWeight: "bold",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "0.8rem",
  },
};

export default SubirRecurso;
