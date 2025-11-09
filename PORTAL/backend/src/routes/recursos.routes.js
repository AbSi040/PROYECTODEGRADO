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
    const base64 = Buffer.from(r.archivo).toString("base64");

    switch (r.tipo) {
      case "IMAGE":
      case "INFOGRAFIA":
        r.url_origen = `data:image/jpeg;base64,${base64}`;
        break;
      case "VIDEO":
        r.url_origen = `data:video/mp4;base64,${base64}`;
        break;
      case "AUDIO":
        r.url_origen = `data:audio/mpeg;base64,${base64}`;
        break;
      case "PDF":
        r.url_origen = `data:application/pdf;base64,${base64}`;
        break;
      case "DOCX":
        r.url_origen = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`;
        break;
      case "TXT":
        r.url_origen = `data:text/plain;base64,${base64}`;
        break;
      case "RTF":
        r.url_origen = `data:application/rtf;base64,${base64}`;
        break;
      case "ODT":
        r.url_origen = `data:application/vnd.oasis.opendocument.text;base64,${base64}`;
        break;
      case "HTML":
        r.url_origen = `data:text/html;base64,${base64}`;
        break;
      case "XLSX":
        r.url_origen = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
        break;
      default:
        r.url_origen = `data:application/octet-stream;base64,${base64}`;
        break;
    }
  }
  delete r.archivo;
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
      else if (recurso.tipo === "DOCX")
  mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
else if (recurso.tipo === "TXT")
  mime = "text/plain";
else if (recurso.tipo === "RTF")
  mime = "application/rtf";
else if (recurso.tipo === "ODT")
  mime = "application/vnd.oasis.opendocument.text";
else if (recurso.tipo === "HTML")
  mime = "text/html";
else if (recurso.tipo === "XLSX")
  mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";


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

// 🔽 Descargar archivo desde la base de datos
router.get("/recursos/:id/descargar", async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      "SELECT titulo, tipo, archivo FROM recurso WHERE id_recurso = ?",
      { replacements: [req.params.id] }
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Recurso no encontrado." });
    }

    const recurso = rows[0];

    if (!recurso.archivo) {
      return res.status(400).json({ error: "El recurso no tiene archivo asociado." });
    }

    // 📎 Definir tipo MIME y extensión según el tipo
    let mime = "application/octet-stream";
    let extension = "bin";

    switch (recurso.tipo.toUpperCase()) {
      case "IMAGE":
      case "INFOGRAFIA":
        mime = "image/jpeg";
        extension = "jpg";
        break;
      case "VIDEO":
        mime = "video/mp4";
        extension = "mp4";
        break;
      case "AUDIO":
        mime = "audio/mpeg";
        extension = "mp3";
        break;
      case "PDF":
        mime = "application/pdf";
        extension = "pdf";
        break;
    }

    // ⚙️ Asegurar encabezados correctos
    res.setHeader("Content-Type", mime);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${(recurso.titulo || "recurso").replace(/[^a-zA-Z0-9]/g, "_")}.${extension}"`
    );
    res.setHeader("Content-Length", recurso.archivo.length);

    // 📤 Enviar archivo binario
    res.end(Buffer.from(recurso.archivo, "binary"));
  } catch (err) {
    console.error("❌ Error al descargar recurso:", err);
    res.status(500).json({ error: "Error al descargar recurso." });
  }
});


export default router;
