import express from "express";
import { sequelize } from "../config/database.js";

const router = express.Router();

// Obtener todos los recursos con soporte Base64
router.get("/recursos", async (req, res) => {
  try {
    const [rows] = await sequelize.query(`
      SELECT id_recurso, titulo, descripcion_corta, tipo, archivo
      FROM recurso
      ORDER BY creado_en DESC;
    `);

    // Convertimos el campo binario a Base64 según el tipo
    const recursos = rows.map((r) => {
      if (r.archivo) {
        if (r.tipo === "IMAGE" || r.tipo === "INFOGRAFIA") {
          const base64 = Buffer.from(r.archivo).toString("base64");
          r.url_origen = `data:image/jpeg;base64,${base64}`;
        } else if (r.tipo === "VIDEO") {
          const base64 = Buffer.from(r.archivo).toString("base64");
          r.url_origen = `data:video/mp4;base64,${base64}`;
        } else if (r.tipo === "AUDIO") {
          const base64 = Buffer.from(r.archivo).toString("base64");
          r.url_origen = `data:audio/mpeg;base64,${base64}`;
        } else if (r.tipo === "PDF") {
          const base64 = Buffer.from(r.archivo).toString("base64");
          r.url_origen = `data:application/pdf;base64,${base64}`;
        }
      }
      delete r.archivo; // Evitamos enviar el binario crudo
      return r;
    });

    res.json(recursos);
  } catch (err) {
    console.error("❌ Error al obtener recursos:", err);
    res.status(500).json({ error: "Error al obtener recursos." });
  }
});

// 📂 Obtener un recurso por ID
router.get("/recursos/:id", async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      "SELECT * FROM recurso WHERE id_recurso = ?",
      { replacements: [req.params.id] }
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Recurso no encontrado." });

    const recurso = rows[0];
    if (recurso.archivo) {
      let mime = "application/octet-stream";
      if (recurso.tipo === "IMAGE" || recurso.tipo === "INFOGRAFIA")
        mime = "image/jpeg";
      else if (recurso.tipo === "VIDEO") mime = "video/mp4";
      else if (recurso.tipo === "AUDIO") mime = "audio/mpeg";
      else if (recurso.tipo === "PDF") mime = "application/pdf";

      const base64 = Buffer.from(recurso.archivo).toString("base64");
      recurso.url_origen = `data:${mime};base64,${base64}`;
    }
    delete recurso.archivo;

    res.json(recurso);
  } catch (err) {
    console.error("Error al obtener recurso:", err);
    res.status(500).json({ error: "Error al obtener recurso." });
  }
});

export default router;
