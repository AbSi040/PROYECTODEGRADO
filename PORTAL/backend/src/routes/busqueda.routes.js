import express from "express";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { sequelize } from "../config/database.js";
import { Recurso } from "../models/recurso.model.js";

const router = express.Router();
const execFileAsync = promisify(execFile);

// 📘 Consulta simplificada
router.get("/buscar", async (req, res) => {
  try {
    const consulta = req.query.q;
    if (!consulta) return res.status(400).json({ error: "Falta parámetro q" });

    const scriptPath = path.resolve("python_scripts/predict_query.py");
    const { stdout } = await execFileAsync("python", [scriptPath, consulta]);

    let resultados = [];
    try {
      resultados = JSON.parse(stdout);
    } catch (err) {
      console.error("⚠️ Error al parsear JSON:", stdout);
    }

    if (!resultados || resultados.length === 0) {
      return res.json({ consulta, resultados: [] });
    }

    const ids = resultados.map((r) => r.id_recurso);

    const recursos = await Recurso.findAll({
      where: { id_recurso: ids },
    });

    res.json({ consulta, resultados: recursos });
  } catch (error) {
    console.error("Error en búsqueda:", error);
    res.status(500).json({ error: "Error interno en la búsqueda" });
  }
});

export default router;
