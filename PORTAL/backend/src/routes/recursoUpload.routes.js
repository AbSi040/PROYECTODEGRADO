import express from "express";
import multer from "multer";
import { sequelize } from "../config/database.js";

const router = express.Router();

// Configuración de Multer (guarda en memoria)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para subir un recurso
router.post("/recursos/subir", upload.single("archivo"), async (req, res) => {
  try {
    const { titulo, descripcion_corta, tipo, autor_fuente } = req.body;
    const archivo = req.file ? req.file.buffer : null;
    const nombreArchivo = req.file ? req.file.originalname : null;

    if (!archivo) {
      return res.status(400).json({ message: "⚠️ No se recibió ningún archivo." });
    }

    await sequelize.query(
      `
      INSERT INTO recurso (titulo, descripcion_corta, tipo, url_origen, autor_fuente, archivo)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      {
        replacements: [
          titulo,
          descripcion_corta,
          tipo,
          nombreArchivo,
          autor_fuente,
          archivo,
        ],
      }
    );

    res.status(201).json({ message: "Recurso guardado correctamente en en la base de datos." });
  } catch (error) {
    console.error("Error al subir recurso:", error);
    res.status(500).json({ message: "Error al subir recurso." });
  }
});

export default router;
