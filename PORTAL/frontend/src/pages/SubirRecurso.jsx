import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

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
      setMensaje("Selecciona un archivo antes de subir.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion_corta", descripcion);
    formData.append("tipo", tipo);
    formData.append("autor_fuente", autor);
    formData.append("archivo", archivo);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/recursos/subir`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data && res.data.message) {
        setMensaje(res.data.message);
      } else {
        setMensaje("Recurso subido correctamente.");
      }

      // No limpies los campos antes de mostrar el mensaje
      // Dale tiempo al mensaje para aparecer
      setTimeout(() => {
        setTitulo("");
        setDescripcion("");
        setAutor("");
        setArchivo(null);
      }, 500);
    } catch (error) {
      console.error(error);
      setMensaje("Error al subir el recurso.");
    }
  };

  return (
    <div className="portal-container fade-in" style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* Botón volver */}
        <div style={styles.topBar}>
          <Link to="/ " style={styles.btnVolver}>
            ← Volver
          </Link>
        </div>

        {/* Formulario */}
        <h2 style={styles.title}>Subir nuevo recurso</h2>
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

      {/* Estilos adicionales responsive */}
      <style>
        {`
          @media (max-width: 1024px) {
            h2 {
              font-size: 1.8rem !important;
            }
          }

          @media (max-width: 768px) {
            form {
              width: 90% !important;
              padding: 1rem !important;
            }

            input, textarea, select {
              font-size: 1rem !important;
            }


          @media (max-width: 480px) {
            h2 {
              font-size: 1.4rem !important;
            }

            form {
              width: 95% !important;
              padding: 0.8rem !important;
            }

            input, textarea, select {
              font-size: 0.9rem !important;
              padding: 0.6rem 0.8rem !important;
            }

            button {
              font-size: 0.9rem;
            }
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#D9D9D9",
    minHeight: "100vh",
    fontFamily: "'Quicksand', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "4rem",
  },
  container: {
    width: "100%",
    maxWidth: "900px",
    padding: "2rem",
    boxSizing: "border-box",
  },
  topBar: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "1rem",
  },
  btnVolver: {
    backgroundColor: "#C57A3D",
    color: "white",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "none",
    boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
    transition: "all 0.3s ease",
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
    width: "100%",
    maxWidth: "700px",
    margin: "0 auto",
  },
  input: {
    padding: "0.8rem 1rem",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    backgroundColor: "#D9D9D9",
    color: "#4E3B2B",
    fontSize: "1rem",
  },
  inputFile: {
    padding: "0.6rem",
    backgroundColor: "#E0E0E0",
    borderRadius: "10px",
    fontSize: "1rem",
  },
  btnSubir: {
    backgroundColor: "#C57A3D",
    color: "white",
    border: "none",
    padding: "0.9rem 1.6rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1.1rem",
    boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
    transition: "all 0.3s ease",
  },
  message: {
    marginTop: "1.5rem",
    textAlign: "center",
    color: "#4E3B2B",
    fontWeight: "bold",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "0.8rem",
    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
  },
};

// Hover
const hoverStyle = document.createElement("style");
hoverStyle.innerHTML = `
  button:hover, a:hover {
    transform: scale(1.05);
    background-color: #A86430 !important;
  }
`;
document.head.appendChild(hoverStyle);

export default SubirRecurso;
