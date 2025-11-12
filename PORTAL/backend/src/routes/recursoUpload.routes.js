import express from "express";
import multer from "multer";
import { sequelize } from "../config/database.js";

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/recursos/subir", upload.single("archivo"), async (req, res) => {
  try {
    const { titulo, descripcion_corta, tipo, autor_fuente } = req.body;
    const archivo = req.file ? req.file.buffer : null;

    if (!archivo) {
      return res.status(400).json({ message: "No se recibió ningún archivo." });
    }

    await sequelize.query(
      `INSERT INTO recurso (titulo, descripcion_corta, tipo, autor_fuente, archivo, creado_en)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      {
        replacements: [titulo, descripcion_corta, tipo, autor_fuente, archivo],
      }
    );

    res.status(201).json({ message: "Recurso guardado correctamente." });
  } catch (error) {
    console.error("Error al subir recurso:", error);
    res.status(500).json({ message: "Error al subir recurso." });
  }
});

export default router;
