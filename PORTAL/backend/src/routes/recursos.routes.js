import express from "express";
import { sequelize } from "../config/database.js";

const router = express.Router();

router.get("/recursos", async (req, res) => {
  try {
    const [rows] = await sequelize.query(`
      SELECT id_recurso, titulo, descripcion_corta, tipo, archivo
      FROM recurso
      ORDER BY creado_en DESC
      LIMIT 10;
    `);

    // Solo generar vista previa (sin todo el archivo completo)
    const recursos = rows.map((r) => {
      if (r.archivo && r.archivo.length > 0) {
        const base64 = Buffer.from(r.archivo).toString("base64");

        // Solo generar vista previa si es imagen, video o audio
        if (["IMAGE", "INFOGRAFIA"].includes(r.tipo?.toUpperCase())) {
          r.url_origen = `data:image/jpeg;base64,${base64}`;
        } else if (r.tipo?.toUpperCase() === "VIDEO") {
          r.url_origen = `data:video/mp4;base64,${base64}`;
        } else if (r.tipo?.toUpperCase() === "AUDIO") {
          r.url_origen = `data:audio/mpeg;base64,${base64}`;
        }
      }
      delete r.archivo; // evitar peso innecesario
      return r;
    });

    res.json(recursos);
  } catch (err) {
    console.error("❌ Error al obtener recursos:", err);
    res.status(500).json({ error: "Error al obtener recursos." });
  }
});


/* =========================================================
   🔹 OBTENER DETALLE DE UN RECURSO (sin sobrecarga)
   ========================================================= */
router.get("/recursos/:id", async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      `
      SELECT id_recurso, titulo, descripcion_corta, tipo, autor_fuente, archivo
      FROM recurso
      WHERE id_recurso = ?;
      `,
      { replacements: [req.params.id] }
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Recurso no encontrado." });

    const recurso = rows[0];

    // Solo convertir el archivo actual a Base64 si existe
    if (recurso.archivo) {
      const base64 = Buffer.from(recurso.archivo).toString("base64");

      let mime = "application/octet-stream";
      switch (recurso.tipo?.toUpperCase()) {
        case "IMAGE":
        case "INFOGRAFIA":
          mime = "image/jpeg";
          break;
        case "VIDEO":
          mime = "video/mp4";
          break;
        case "AUDIO":
          mime = "audio/mpeg";
          break;
        case "PDF":
          mime = "application/pdf";
          break;
        case "DOCX":
          mime =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          break;
        case "TXT":
          mime = "text/plain";
          break;
        case "RTF":
          mime = "application/rtf";
          break;
        case "ODT":
          mime = "application/vnd.oasis.opendocument.text";
          break;
        case "HTML":
          mime = "text/html";
          break;
        case "XLSX":
          mime =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          break;
      }

      recurso.url_origen = `data:${mime};base64,${base64}`;
    }

    delete recurso.archivo; // remover el campo binario

    res.json(recurso);
  } catch (err) {
    console.error("❌ Error al obtener recurso:", err);
    res.status(500).json({ error: "Error al obtener recurso." });
  }
});

/* =========================================================
   🔹 DESCARGAR ARCHIVO (solo cuando se solicita)
   ========================================================= */
router.get("/recursos/:id/descargar", async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      `
      SELECT titulo, tipo, archivo
      FROM recurso
      WHERE id_recurso = ?;
      `,
      { replacements: [req.params.id] }
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Recurso no encontrado." });

    const recurso = rows[0];

    if (!recurso.archivo)
      return res
        .status(400)
        .json({ error: "El recurso no tiene archivo asociado." });

    let mime = "application/octet-stream";
    let extension = "bin";

    switch (recurso.tipo?.toUpperCase()) {
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
      default:
        break;
    }

    res.setHeader("Content-Type", mime);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${(recurso.titulo || "recurso")
        .replace(/[^a-zA-Z0-9]/g, "_")
        .substring(0, 50)}.${extension}"`
    );
    res.setHeader("Content-Length", recurso.archivo.length);

    res.end(Buffer.from(recurso.archivo, "binary"));
  } catch (err) {
    console.error("❌ Error al descargar recurso:", err);
    res.status(500).json({ error: "Error al descargar recurso." });
  }
});

export default router;
